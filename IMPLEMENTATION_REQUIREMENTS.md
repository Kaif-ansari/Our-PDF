# Implementation Requirements

This project is a static browser-only PDF converter. Do not add backend upload APIs, database persistence, subscription systems, or cloud document storage unless the architecture is explicitly changed.

## Required Security Controls

- Process files locally in the browser only.
- Limit every selected file to 10 MB.
- Accept only the file types required by each tool.
- Validate filename, extension, MIME type, and magic bytes before parser use.
- Reject executable extensions and double extensions.
- Reject malformed or encrypted PDFs.
- Reject PDFs with risky active-content markers such as JavaScript, launch actions, rich media, XFA, or embedded files.
- Bound PDF page count and render-pixel count.
- Avoid storing original filenames or document content in local history.
- Use object URLs only for generated downloads and revoke them when no longer needed.
- Keep strict CSP, frame, MIME-sniffing, referrer, permissions, and HSTS headers in deployment config.

## Forbidden In This Build

- Uploading user documents to the app server.
- Supabase/Auth/database job metadata.
- Cloudflare R2 or other object storage for user documents.
- Stripe or premium subscription code.
- OpenAI or other external AI APIs for document content.
- Server-side PDF conversion workers.
- Shelling out to PDF tools from request handlers.
- Persistent document previews, OCR text, thumbnails, or filenames.

## DevSecOps

- Keep `npm audit --audit-level=moderate` clean.
- Keep Dependabot enabled for npm dependencies.
- Run static checks before deployment.
- Treat any future backend feature as a separate security review requiring rate limiting, CSRF/CORS controls, malware scanning, worker isolation, and a privacy impact review.
