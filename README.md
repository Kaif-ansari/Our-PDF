# Our PDF

Our PDF is an original iLovePDF-style PDF toolkit with optional Supabase authentication. Guests can use the workspace without logging in. Registered users can sync safe job history metadata.

## Local Website

The local server is:

```powershell
node scripts/static-server.mjs
```

Then visit:

```text
http://127.0.0.1:4173/index.html
```

## Features

Browser-native tools that generate downloadable files:

- Merge PDF
- Split PDF
- Compress PDF
- Repair PDF
- JPG/PNG to PDF
- PDF to JPG
- PDF to Word-compatible `.doc`
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
- Selectable-text OCR export
- Basic PDF text summary

Worker-required tools:

- Protect PDF
- Unlock PDF

These require a server-side worker for real PDF encryption or password removal. The browser app intentionally does not fake protected output.

## Fidelity Notes

The browser conversion path is private and downloadable, but it cannot perfectly reconstruct every arbitrary PDF or Office layout. PDF-to-Office exports include extracted text plus rendered page previews to preserve visible content. Office-to-PDF exports readable text and attaches the original source file inside the generated PDF when supported by the PDF reader.

For exact enterprise-grade conversion with complex tables, fonts, comments, tracked changes, embedded media, scanned OCR, and encrypted PDFs, connect Supabase Edge Functions to a worker with LibreOffice, OCR, and a PDF security tool such as qpdf or a commercial SDK.

## Supabase

1. Run `supabase/schema.sql` in your Supabase project.
2. Enable email authentication in Supabase Auth.
3. Add your frontend keys in `index.html`:

```html
<script>
  window.OUR_PDF_SUPABASE = {
    url: "https://your-project.supabase.co",
    anonKey: "your-anon-key"
  };
</script>
```

Supabase stores only account and job metadata. It does not store uploaded PDFs, generated PDFs, OCR text, previews, thumbnails, or permanent file URLs.

## Important Files

- `index.html` contains the app shell and optional Supabase config.
- `app.js` contains tool definitions, browser PDF processing, optional auth, and history sync.
- `styles.css` contains the responsive app UI.
- `supabase/schema.sql` defines profiles, job history, RLS, and metadata-only guards.
- `scripts/static-server.mjs` serves the static app locally.
