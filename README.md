# CloudPDF

CloudPDF is an original iLovePDF-style PDF toolkit that runs as a browser-only local workspace. There is no account registration, premium subscription, upload API, database, or server-side document storage.

## Local Website

The local server is:

```powershell
node scripts/static-server.mjs
```

Then visit:

```text
http://127.0.0.1:4173/index.html
```

## Deploy to Vercel

This is a static browser app, so Vercel can host it without API functions or backend services.

```powershell
npm install -g vercel
vercel login
vercel
vercel --prod
```

When Vercel asks for settings, use:

- Framework Preset: `Other`
- Build Command: leave empty or use `npm run build`
- Output Directory: `public`
- Install Command: leave empty or `npm install`

## Deploy to Cloudflare Pages

Cloudflare should sit at the edge as the traffic and security layer. Deploy the generated static output, not API functions:

```powershell
npm run build
```

Cloudflare Pages settings:

- Build command: `npm run build`
- Build output directory: `public`
- Root directory: repository root

The build copies `_headers` and `_redirects` into `public/`, so Cloudflare applies strict security headers, no document-upload routes, immutable asset caching, and single-page fallback routing. Large traffic is handled by Cloudflare edge caching instead of a stateful origin server.

Recommended Cloudflare security settings:

- Enable WAF managed rules and DDoS protection.
- Add a rate limit rule for excessive requests to `/app.js`, `/styles.css`, and `/assets/*`.
- Set SSL/TLS mode to Full (strict).
- Keep Bot Fight Mode or bot management enabled if available.
- Do not add R2 buckets or Workers that receive user document bytes.

## Features

Browser-native tools that generate downloadable files:

- Merge PDF
- Split PDF
- Compress PDF
- Repair PDF
- JPG/PNG to PDF
- PDF to JPG
- PDF to Word-compatible `.docx`
- PDF to PowerPoint-compatible `.ppt`
- PDF to Excel-compatible `.xls`
- DOCX to PDF with original source attached
- PPTX to PDF with original source attached
- XLSX to PDF with original source attached
- Rotate PDF
- Remove pages
- Extract pages
- Add watermark
- Add page numbers
- Crop PDF
- Sign PDF
- Redact PDF
- Compare PDF
- Selectable PDF text export
- Local PDF text summary

## Fidelity Notes

The browser conversion path is private and downloadable, but it cannot perfectly reconstruct every arbitrary PDF or Office layout. PDF-to-Word exports a real `.docx` and places each rendered PDF page at the original page size to preserve the visible layout, including scanned pages, tables, images, and complex typography. Office-to-PDF exports readable text and attaches the original source file inside the generated PDF when supported by the PDF reader.

This browser-only build intentionally does not unlock encrypted PDFs, perform scanned-document OCR, or call AI services. Those features would require a backend worker and a different privacy/security model.

## Security Model

- Files are processed locally in the browser.
- Document bytes are not uploaded to this application server.
- Uploads are limited to 10 MB per file.
- File type, extension, magic bytes, PDF structure, encryption state, and risky PDF active-content markers are validated before processing.
- The deployed site is static and uses strict security headers.
- Static assets are cacheable at the CDN edge to absorb high traffic in small independent file requests.
- No Supabase, R2, Stripe, OpenAI, subscription, JWT, or database credentials are required.

## Important Files

- `index.html` contains the app shell.
- `app.js` contains tool definitions and browser PDF processing.
- `styles.css` contains the responsive app UI.
- `scripts/static-server.mjs` serves the static app locally.

