# Security hardening checklist

## Browser-only production posture

- Host only static files.
- Do not deploy upload, job, download, auth, subscription, database, or AI API routes.
- Do not configure Supabase, R2, Stripe, OpenAI, JWT, or database secrets.
- Keep all document processing inside the browser.
- Keep uploaded/generated document bytes out of logs, analytics, monitoring, and crash reports.

## File validation

- Enforce the 10 MB file limit in the browser.
- Accept only the exact file types required by the selected tool.
- Validate filename, extension, MIME type, and magic bytes.
- Reject executable extensions and double extensions.
- Reject encrypted PDFs.
- Reject malformed PDFs.
- Reject PDFs containing risky active-content markers.
- Bound page count and render-pixel count to reduce denial-of-service risk.

## Static hosting

- Use strict CSP.
- Deny framing.
- Enable `nosniff`.
- Use strict referrer policy.
- Restrict browser permissions.
- Enable HSTS on production HTTPS domains.
- Keep Vercel Firewall or Cloudflare WAF/DDoS protections enabled for static traffic.
- Serve static assets through CDN edge caching so high traffic is absorbed without backend state.

## Privacy and compliance

- State clearly that files are processed locally in the browser.
- Do not retain original filenames in local history.
- Do not collect accounts, billing records, or document metadata.
- Keep any telemetry aggregate and document-content-free.
- Review GDPR and India DPDP obligations again before adding any backend feature.
