# Browser-Only PDF App Architecture

Our PDF is a static, browser-only PDF toolkit. The production security posture is intentionally simple: users select files locally, browser libraries process those files in the user agent, and generated results are downloaded from in-memory object URLs.

There is no account system, subscription system, upload API, database, object storage bucket, queue, server-side PDF worker, or document-retention service in this build.

## Runtime Flow

```text
User browser
  |
  v
Static HTML/CSS/JS from Vercel CDN
  or Cloudflare Pages edge cache
  |
  v
Local file selection
  |
  v
Client-side validation
  - 10 MB limit
  - safe filename checks
  - extension and MIME allowlist
  - magic-byte validation
  - PDF structure checks
  - encrypted PDF rejection
  - risky PDF active-content marker rejection
  |
  v
Browser-only processing
  - pdf-lib
  - pdf.js
  - JSZip
  |
  v
Generated Blob/object URL
  |
  v
User download
```

## Data Handling

Files must not be sent to this application server. The app does not persist:

- Uploaded PDFs or source Office/image documents.
- Generated PDFs, images, archives, or Office files.
- Extracted text, summaries, previews, thumbnails, or filenames.
- User accounts, billing records, or job history on a backend.

Local browser job history stores only minimal non-content metadata and avoids original filenames.

## Security Boundaries

The primary boundary is the browser sandbox. Because there is no backend document processing, server-side RCE risk from PDF parsers is removed from this application. The remaining risks are handled with:

- Strict static hosting headers.
- CDN edge caching for HTML, JavaScript, CSS, and image assets instead of a stateful origin server.
- No public upload endpoints.
- No cloud storage credentials.
- No server-side shell commands.
- No backend PDF parser execution.
- No wildcard CORS.
- No JWT or session cookies.
- No exposed admin routes.

## Unsupported By Design

These features are intentionally not included in the browser-only build:

- Unlocking encrypted PDFs.
- Strong PDF password encryption.
- Scanned-document OCR.
- AI summarization through external APIs.
- Premium subscriptions.
- Cloud upload, sync, history, or file libraries.

Adding any of those would require a separate backend architecture with isolated workers, malware scanning, rate limiting, audit logging, and a revised privacy notice.

## Traffic Scaling

Production traffic is divided into small static file requests and served from the CDN edge:

- `index.html` stays revalidated so deploys are picked up quickly.
- `app.js` and `styles.css` can be cached briefly with stale-while-revalidate.
- `/assets/*` can be cached immutably for one year.

This keeps high traffic away from any application server. The local development server also streams files in 64 KB chunks so large static responses do not need to be buffered in memory.
