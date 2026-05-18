# Cloudflare Zero-Persistence Checklist

Use this checklist when configuring infrastructure and reviewing pull requests.

## Cloudflare

- CDN is enabled for frontend traffic.
- WAF managed rules are enabled.
- Bot protection is enabled.
- Rate Limiting protects auth, upload, OCR, conversion, contact, and download endpoints.
- Turnstile site keys are configured for signup, login, upload, and contact forms.
- Zero Trust protects admin dashboards, internal observability, worker consoles, and R2 administration.
- Optional Workers reject malformed traffic and oversized upload preflight requests at the edge.

## R2

- Temporary uploads use `temp/uploads`.
- Temporary results use `temp/results`.
- Public access is disabled.
- Lifecycle rules delete all temporary objects within 15 minutes.
- Signed upload URLs expire within minutes.
- Signed download URLs expire within minutes.
- One-time download tokens are enforced by the application.
- No permanent buckets, archives, user libraries, backups, or historical file copies exist.

## Backend

- Backend routes do not accept file bytes for normal uploads.
- Upload presign routes require JWT/session auth, Turnstile, file size checks, content type checks, and plan limit checks.
- Download routes require ownership, complete job status, unexpired result objects, and unused one-time tokens.
- Logs contain only job IDs, durations, safe error codes, and system metrics.
- Database schemas do not include file bytes, OCR text, previews, thumbnails, or permanent file URLs.

## Workers

- Workers run in isolated containers.
- Workers use isolated temp filesystems.
- Workers wipe temp directories after every job.
- Workers have CPU, memory, and timeout limits.
- Workers do not have general outbound internet access.
- Workers delete uploads after success or failure.
- Workers delete results after failed jobs.

## Cleanup

- Cleanup runs every 5 minutes.
- Expired uploads are deleted.
- Expired results are deleted.
- Failed job objects are deleted.
- Orphan files are purged.
- Missing objects are treated as already cleaned.

