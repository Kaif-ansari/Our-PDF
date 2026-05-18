# Implementation Requirements

This document converts the zero-persistence architecture into implementation controls. Treat every item marked "MUST" as a release blocker.

## Implementation Primitives

The repository includes framework-neutral TypeScript primitives that future app code should reuse or adapt:

- `src/config/security.ts` defines zero-persistence retention limits, R2 prefixes, plan limits, forbidden persistent fields, and privacy messages.
- `src/security/turnstile.ts` verifies Cloudflare Turnstile tokens through Cloudflare Siteverify.
- `src/security/securityHeaders.ts` defines CSP, HSTS, frame, content-type, and cross-origin security headers.
- `src/security/safeLogger.ts` rejects unsafe log fields before logs are emitted.
- `src/storage/temporaryR2Storage.ts` constrains object keys to `/temp/uploads` and `/temp/results` and exposes signed URL helpers.
- `src/uploads/presignUpload.ts` enforces Turnstile, content type, file size, and plan checks before returning a direct R2 upload URL.
- `src/downloads/oneTimeDownload.ts` enforces one-time download tokens and deletes result objects after download.
- `src/workers/processingWorkerPolicy.ts` wipes worker temp directories and deletes upload objects after processing.
- `src/workers/cleanupWorker.ts` deletes expired, failed, and orphaned objects.
- `src/frontend/privacyMessages.ts` centralizes privacy-first UX copy.

## Frontend

- MUST render Cloudflare Turnstile on signup, login, upload, and contact forms.
- MUST send Turnstile tokens to the backend before privileged actions.
- MUST upload files directly to Cloudflare R2 using signed upload URLs.
- MUST NOT upload files through the backend API server.
- MUST show privacy-first file handling messages near upload and download flows.
- MUST NOT render persistent previews unless they are generated in-memory and discarded.
- MUST NOT send document contents, OCR text, thumbnails, or previews to analytics tools.
- SHOULD show upload URL expiry and processing timeout states clearly.

## API Gateway And Backend

- MUST verify JWT/session authentication where required.
- MUST verify Cloudflare Turnstile tokens server-side.
- MUST validate file type, file size, requested operation, user plan, and rate limits before returning upload URLs.
- MUST generate short-lived signed upload URLs for R2 temporary storage.
- MUST store only metadata, job status, and safe logs.
- MUST NOT accept normal file uploads through backend routes.
- MUST NOT persist uploaded files, generated files, OCR text, images, previews, or thumbnails in the database.
- MUST NOT log file contents, signed URL secrets, OCR text, previews, or raw document snippets.
- MUST use Helmet.js, strict CSP, strict CORS, secure cookies, signed URLs, request body limits, and input validation.
- SHOULD enforce backend rate limits in addition to Cloudflare edge limits.

## Database

Allowed tables:

- users
- accounts
- sessions
- subscriptions
- jobs
- processing_logs
- audit_events
- one_time_download_tokens

Forbidden columns:

- uploaded_file_bytes
- generated_file_bytes
- pdf_content
- ocr_text
- image_content
- preview_content
- thumbnail_bytes
- permanent_file_url
- archive_path

Job records may store:

- job id
- user id
- operation type
- status
- upload object key hash or scoped opaque object reference
- result object key hash or scoped opaque object reference
- object expiry time
- processing duration
- safe error code
- created, updated, completed, downloaded, deleted timestamps

## R2 Storage

- MUST use temporary R2 storage only.
- MUST use prefixes or buckets equivalent to `/temp/uploads` and `/temp/results`.
- MUST disable public access.
- MUST require signed URLs or scoped service credentials.
- MUST attach expiry metadata to every object.
- MUST set lifecycle deletion to 15 minutes maximum.
- MUST delete uploads after processing succeeds or fails.
- MUST delete results after successful download.
- MUST NOT create permanent storage, user archives, historical backups, or file libraries.

## Queue And Workers

- MUST enqueue jobs using metadata and temporary object references only.
- MUST process files inside isolated containers.
- MUST use isolated temp filesystems.
- MUST wipe temporary directories after every job.
- MUST disable general external internet access from worker containers.
- MUST limit worker memory, CPU, and job duration.
- MUST delete source files from R2 immediately after successful processing.
- MUST delete related R2 objects immediately when processing fails.
- MUST write results only to `/temp/results` with maximum 15-minute retention.
- MUST NOT log file contents, OCR text, previews, or generated output data.

## Cleanup Worker

- MUST run every 5 minutes.
- MUST delete expired uploads.
- MUST delete expired results.
- MUST delete failed job objects.
- MUST purge orphan R2 objects.
- MUST retry failed deletion attempts.
- MUST be idempotent.
- MUST treat missing objects as successful cleanup.
- SHOULD emit safe metrics for cleanup counts, durations, and failures.

## Download Service

- MUST issue signed download URLs that expire within minutes.
- MUST support one-time download tokens.
- MUST validate user ownership or authorization before download.
- MUST delete result objects immediately after successful download.
- MUST delete source upload objects if any remain.
- MUST enqueue urgent cleanup if immediate deletion fails.
- MUST reject expired or already-used download tokens.

## Cloudflare Configuration

- MUST enable Cloudflare CDN for frontend delivery.
- MUST enable Cloudflare WAF managed rules.
- MUST enable Cloudflare Rate Limiting for upload, OCR, conversion, auth, and contact endpoints.
- MUST enable bot protection.
- MUST enable Turnstile on required user interaction surfaces.
- MUST use R2 for temporary object storage.
- MUST use Zero Trust for admin and internal surfaces.
- SHOULD use Cloudflare Workers for edge validation, upload preflight checks, and early rejection of malformed traffic.

## Verification Checklist

Before launch, verify:

- Uploading through the backend server is impossible.
- Signed upload URLs expire as configured.
- Signed download URLs expire as configured.
- One-time download links cannot be reused.
- Uploaded files are deleted after processing.
- Generated files are deleted after download.
- All files are deleted within 15 minutes even without download.
- Failed jobs delete all related files.
- Cleanup runs every 5 minutes.
- R2 buckets are private.
- R2 lifecycle policies are active.
- Database contains no document bytes, OCR text, previews, thumbnails, or generated files.
- Logs contain no file contents, OCR text, previews, thumbnails, signed URL secrets, or generated files.
- Worker temp directories are empty after success and failure.
- Worker containers cannot access the public internet.
- Free and premium rate limits are enforced at Cloudflare and backend layers.
- Turnstile verification is required on signup, login, upload, and contact forms.
