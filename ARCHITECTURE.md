# Privacy-First PDF Platform Architecture

This platform operates under a mandatory zero-persistence file policy. Uploaded files and generated files are temporary only, are never publicly accessible, are never backed up, and are deleted automatically after processing or download. Only accounts, billing data, metadata, job status, and safe operational logs may persist.

## Updated Architecture

```text
                    +----------------------+
                    |        Users         |
                    |  Web / Mobile / API  |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | Cloudflare CDN       |
                    | Edge cache + TLS     |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | Cloudflare Security  |
                    | WAF + Bot + DDoS     |
                    | Rate Limiting        |
                    | Zero Trust           |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | Frontend (Next.js)   |
                    | UI + upload flow     |
                    | Turnstile widgets    |
                    +----------+-----------+
                               |
                    HTTPS API |
                               v
               +-----------------------------+
               | API Gateway / Supabase Edge |
               | Auth, JWT, validation       |
               | Helmet, CSP, CORS, limits   |
               | Turnstile verification      |
               +----------+------------------+
                          |
          +---------------+----------------+
          |               |                |
          v               v                v
 +----------------+ +--------------+ +----------------+
 | Supabase Auth | | Billing      | | Supabase DB    |
 | JWT + OTP     | | Stripe       | | Jobs/status    |
 +----------------+ +--------------+ +----------------+
                          |
                          v
               +----------------------+
               | Upload URL Service   |
               | R2 presigned URLs    |
               | Upload policy checks |
               +----------+-----------+
                          |
                          v
               +----------------------+
               | Cloudflare R2        |
               | Temporary buckets    |
               | /temp/uploads        |
               | /temp/results        |
               +----------+-----------+
                          |
                          v
               +----------------------+
               | Redis + BullMQ       |
               | Processing queue     |
               | Job expiry metadata  |
               +----------+-----------+
                          |
          +---------------+----------------+
          |               |                |
          v               v                v
 +----------------+ +----------------+ +----------------+
 | Merge Worker   | | Compress Worker| | Convert Worker |
 | pdf-lib        | | Ghostscript    | | LibreOffice    |
 | isolated tmpfs | | isolated tmpfs | | isolated tmpfs |
 +-------+--------+ +-------+--------+ +-------+--------+
         |                  |                  |
         +------------------+------------------+
                          |
                          v
               +----------------------+
               | Download Service     |
               | Signed one-time URLs |
               | Minutes-long expiry  |
               +----------+-----------+
                          |
                          v
               +----------------------+
               | Cleanup Service      |
               | Runs every 5 minutes |
               | Deletes expired R2   |
               | files and failed jobs|
               +----------------------+
```

Cloudflare Workers may be added between Cloudflare Security and the API Gateway for optional edge validation, request normalization, and early rejection of oversized or malformed upload requests.

## Mandatory Cloudflare Stack

The platform must use Cloudflare for CDN, WAF, DDoS protection, bot protection, rate limiting, upload protection, temporary object storage, and Zero Trust access controls.

Required Cloudflare services:

- Cloudflare CDN for frontend and static assets.
- Cloudflare WAF for request filtering and managed security rules.
- Cloudflare Bot Management or bot fight mode for automated abuse protection.
- Cloudflare Rate Limiting for per-plan upload, OCR, conversion, and API limits.
- Cloudflare Turnstile for signup, login, upload, and contact forms.
- Cloudflare R2 for temporary uploads and generated outputs only.
- Cloudflare Zero Trust for administrative access, internal tools, worker dashboards, and sensitive operational surfaces.
- Cloudflare Workers for optional edge validation and upload preflight checks.

## Zero-Persistence File Policy

The platform must not permanently store uploaded or generated user files anywhere in the system.

Files must:

- Exist only temporarily during upload, processing, and short download windows.
- Be stored only in temporary Cloudflare R2 prefixes.
- Be accessible only through signed, expiring URLs.
- Be deleted immediately after successful processing when no longer needed.
- Be deleted immediately after successful download.
- Be deleted automatically after 15 minutes at the latest.
- Never be publicly readable.
- Never be used for training.
- Never be included in backups.
- Never be written to permanent local disks.
- Never be stored in the database.
- Never appear in logs, analytics payloads, traces, document previews, or monitoring samples.

Permitted persistent data:

- User accounts and credentials in Supabase Auth.
- Subscription and billing metadata.
- Job IDs, statuses, timestamps, durations, temporary object references, and non-sensitive error codes.
- Processing history that contains metadata only.
- Operational metrics that do not contain file content, OCR text, images, previews, or generated documents.

Prohibited persistent data:

- Uploaded PDFs or source documents.
- Generated PDFs or output files.
- Extracted OCR text.
- Uploaded images.
- Document previews or thumbnails.
- File content snippets.
- Backups or archives of user files.

## Temporary File Lifecycle

```text
User selects file
  |
  v
Frontend requests upload permission with Turnstile token
  |
  v
Backend verifies Turnstile token and user plan limits
  |
  v
Backend returns signed R2 upload URL with short expiry
  |
  v
Frontend uploads directly to Cloudflare R2 /temp/uploads
  |
  v
Backend receives upload completion event or client confirmation
  |
  v
Redis/BullMQ job starts with object key metadata only
  |
  v
Isolated worker downloads temporary object to isolated temp filesystem
  |
  v
Worker processes file and wipes local temp files
  |
  v
Worker writes generated output to R2 /temp/results with short expiry
  |
  v
Download service creates one-time signed download URL
  |
  v
User downloads result
  |
  v
Upload and result objects are deleted immediately
```

If a job fails, the worker must wipe local temp files and enqueue immediate deletion for all related R2 objects. The cleanup service provides a second safety layer by deleting expired and orphaned objects every 5 minutes.

## R2 Temporary Storage Design

Use separate temporary prefixes or buckets:

```text
/temp/uploads/{jobId}/{sourceObjectId}
/temp/results/{jobId}/{resultObjectId}
```

Rules:

- Buckets must not allow public access.
- Object access must require signed URLs or scoped service credentials.
- Upload signed URLs must expire within minutes.
- Download signed URLs must expire within minutes and should be one-time use.
- Object metadata must include `jobId`, `ownerId`, `purpose`, and `expiresAt`.
- Lifecycle rules must delete all temporary objects after 15 minutes.
- The cleanup worker must delete expired objects every 5 minutes.
- Backups, replication to durable archives, analytics copies, and permanent user folders are forbidden.

## Secure Upload Flow

The frontend must not upload files through the backend application server.

Required flow:

```text
Frontend
  -> POST /api/uploads/presign with JWT, file metadata, and Turnstile token
  -> Backend verifies JWT, Turnstile, plan limits, content type, file size, and rate limits
  -> Backend returns signed Cloudflare R2 upload URL
  -> Frontend uploads directly to R2
  -> Frontend calls /api/uploads/complete with object key and job id
  -> Backend validates object metadata and enqueues processing job
```

The backend may validate file metadata, size, content type, plan limits, user ownership, and request integrity. It must never receive or store the file bytes in normal operation.

## Turnstile Validation

Turnstile is mandatory on:

- Signup.
- Login.
- Upload.
- Contact forms.

Verification flow:

```text
Frontend renders Turnstile widget
  |
  v
Cloudflare returns Turnstile token
  |
  v
Frontend sends token to backend
  |
  v
Backend verifies token with Cloudflare Siteverify API
  |
  v
Backend allows request only when verification succeeds
```

Failed or missing Turnstile verification must reject the request before upload URLs, login sessions, signup records, or contact messages are created.

## Rate Limiting

Cloudflare Rate Limiting must enforce plan-aware limits.

Free users:

- Lower uploads per hour.
- Lower file size limits.
- Lower OCR request limits.
- Lower concurrent processing limits.

Premium users:

- Higher uploads per hour.
- Higher file size limits.
- Higher OCR request limits.
- Higher concurrent processing limits.

The backend should also enforce the same limits as a second layer so bypassing edge controls does not grant extra capacity.

## Worker Security

Each processing worker must:

- Run in an isolated container.
- Use an isolated temporary filesystem.
- Wipe its temporary directory after every job, success or failure.
- Disable outbound internet access except required private service endpoints.
- Use scoped credentials that access only required R2 temporary objects.
- Enforce CPU limits.
- Enforce memory limits.
- Enforce processing timeouts.
- Avoid logging file names when they contain user-provided sensitive text.
- Log only job IDs, safe error codes, processing duration, and system metrics.

Workers must not:

- Persist files to host disks.
- Retain input, output, OCR text, previews, thumbnails, or extracted content.
- Call third-party APIs with user file contents unless explicitly approved by policy and disclosed to the user.
- Include file bytes or extracted content in error messages.

## Cleanup System

Create cleanup workers that run every 5 minutes.

Responsibilities:

- Delete expired uploads.
- Delete generated outputs after download.
- Delete generated outputs older than 15 minutes.
- Delete failed job objects.
- Purge orphan R2 objects with no live job.
- Clear stale Redis job entries after safe metadata retention periods.
- Mark jobs as expired without retaining file contents.

Cleanup must be idempotent. Deleting an already-deleted object should be treated as success.

## Download Security

Generated files must:

- Be available only through signed URLs.
- Expire within minutes.
- Support one-time download tokens.
- Delete immediately after successful download.
- Delete automatically after 15 minutes even if never downloaded.

The download service must validate:

- Authenticated user owns the job or has permission to download it.
- Job is complete.
- Result object has not expired.
- One-time token has not been used.

After a successful download response, the result object and the original upload object must be deleted. If deletion fails, enqueue a high-priority cleanup job.

## Backend Security Middleware

Implement:

- Helmet.js.
- Strict Content Security Policy headers.
- Strict CORS allowlist.
- JWT authentication.
- OTP verification for sensitive account operations.
- Secure, HTTP-only, SameSite cookies.
- Signed upload and download URLs.
- Input validation on all API routes.
- Request body size limits.
- Anti-DDoS protection through Cloudflare.
- Rate limits at Cloudflare and in the backend.

## Logging And Monitoring Restrictions

Never log:

- File contents.
- Extracted OCR text.
- Document previews.
- Uploaded images.
- Generated PDFs.
- Raw file names when they may include sensitive user data.
- Signed URL secrets or tokens.

Allowed logs:

- Job IDs.
- User IDs or tenant IDs where required for security auditing.
- Processing duration.
- Safe error codes.
- Worker status.
- Queue metrics.
- Storage deletion success or failure.
- System metrics.

Monitoring and tracing tools must be configured to scrub request bodies, response bodies, signed URLs, tokens, and object keys where necessary.

## Privacy-First UX Requirements

The user interface must clearly state:

- "Files are automatically deleted after processing."
- "No uploaded documents are permanently stored."
- "Your files remain private."
- "No file contents are retained."

These messages should appear near upload surfaces, processing states, and download screens. They must reflect actual backend behavior and storage lifecycle rules.
