# Our PDF

Our PDF is an original iLovePDF-style PDF toolkit that runs as a browser-first local workspace. There is no account registration or login flow.

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
- Selectable-text OCR export
- Basic PDF text summary

Worker-required tools:

- Protect PDF
- Unlock PDF

These require a server-side worker for real PDF encryption or password removal. The browser app intentionally does not fake protected output.

## Fidelity Notes

The browser conversion path is private and downloadable, but it cannot perfectly reconstruct every arbitrary PDF or Office layout. PDF-to-Word exports a real `.docx` and places each rendered PDF page at the original page size to preserve the visible layout, including scanned pages, tables, images, and complex typography. Office-to-PDF exports readable text and attaches the original source file inside the generated PDF when supported by the PDF reader.

For exact enterprise-grade conversion with complex tables, fonts, comments, tracked changes, embedded media, scanned OCR, and encrypted PDFs, connect a secure worker with LibreOffice, OCR, and a PDF security tool such as qpdf or a commercial SDK.

## Important Files

- `index.html` contains the app shell.
- `app.js` contains tool definitions and browser PDF processing.
- `styles.css` contains the responsive app UI.
- `scripts/static-server.mjs` serves the static app locally.
