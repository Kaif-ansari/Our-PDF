import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const output = join(root, "public");
const siteUrl = "https://www.cloudpdf.online";
const builtAt = new Date().toISOString();
const defaultPublishedDate = "2026-06-07T00:00:00.000Z";
const defaultModifiedDate = builtAt;
const googleTagId = "G-D05GDHTV7C";
const adsensePublisherId = "ca-pub-8501020285416333";
const googleSearchConsoleVerification = "PASTE_GOOGLE_SEARCH_CONSOLE_VERIFICATION_TOKEN";
const stylesVersion = "responsive-v3";
const criticalCss = `:root{--ink:#171923;--muted:#596174;--line:rgba(31,36,48,.12);--surface:#fff;--glass:rgba(255,255,255,.72);--hero-bg:linear-gradient(135deg,#fffaf1,#fff 48%,#f4fbff);--accent-dark:#bd1238;--font-body:"Segoe UI",Inter,ui-sans-serif,system-ui,sans-serif;--font-display:"Trebuchet MS","Segoe UI",ui-sans-serif,system-ui,sans-serif;--font-hero:"Arial Black","Trebuchet MS","Segoe UI",ui-sans-serif,system-ui,sans-serif}*{box-sizing:border-box}body{margin:0;min-width:320px;overflow-x:hidden;color:var(--ink);background:#f7fbff;font-family:var(--font-body);line-height:1.5}.topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:68px;padding:0 28px;border-bottom:1px solid var(--line);background:var(--glass);backdrop-filter:blur(20px) saturate(1.4)}.brand,.nav-links,.topbar-actions,.hero-actions{display:inline-flex;align-items:center}.brand{gap:10px;font-family:var(--font-display);font-weight:900;flex:0 0 auto}.brand-logo{width:58px;height:38px;object-fit:contain}.nav-links{flex-wrap:wrap;justify-content:center;gap:6px;color:var(--muted);font-size:.92rem}.nav-links a,.primary-link{min-height:40px;padding:0 12px;border-radius:999px;color:inherit;text-decoration:none}.primary-link{display:inline-flex;align-items:center;background:#171923;color:#fff;font-weight:900}.hero{display:grid;grid-template-columns:minmax(0,.92fr) minmax(320px,.78fr);gap:clamp(22px,4vw,54px);align-items:center;min-height:calc(100vh - 104px);padding:54px 28px 40px;background:var(--hero-bg)}.hero-copy{max-width:850px}.eyebrow{margin:0 0 8px;color:var(--accent-dark);font-size:.78rem;font-weight:900;text-transform:uppercase}.hero-eyebrow{display:inline-flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}.hero-eyebrow span{display:inline-flex;align-items:center;min-height:28px;padding:0 10px;border-radius:999px;background:rgba(255,79,94,.12)}h1#page-title,h2#hero-title,h3#tool-title{margin:0 0 12px;max-width:760px;font-family:var(--font-hero);font-size:clamp(3.1rem,8vw,7.4rem);line-height:.88;letter-spacing:0}.hero-short{display:flex;flex-wrap:wrap;gap:.25em .42em;margin:0 0 8px;font-family:var(--font-display);font-size:clamp(1.6rem,4vw,3.45rem);font-weight:900;line-height:1.02}.hero-visual{margin:0;overflow:hidden;width:100%;max-width:620px;justify-self:center;border:1px solid var(--line);border-radius:24px}.mock-window{display:grid;gap:18px;aspect-ratio:1/.82;min-height:420px;padding:22px}.mock-docs{display:grid;grid-template-columns:1fr 1fr;gap:14px}@media (max-width:760px){.topbar{min-height:auto;padding:10px 14px;align-items:flex-start;flex-wrap:wrap}.nav-links{order:3;width:100%;justify-content:flex-start;overflow-x:auto;white-space:nowrap}.hero{grid-template-columns:1fr;min-height:auto;gap:18px;padding:24px 14px}h1#page-title,h2#hero-title,h3#tool-title{font-size:clamp(2.55rem,14vw,3.8rem)}.hero-visual{transform:none;max-width:520px}.mock-window{min-height:300px;padding:16px;border-radius:20px}}`;

const toolPages = [
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    title: "Merge PDF Online Free - Combine PDF Files | CloudPDF",
    description: "Merge PDF files online in your browser. Add multiple PDFs, arrange them in order, and download one combined PDF file with CloudPDF.",
    intent: "combine multiple PDF files into one organized document",
    keywords: ["merge PDF", "combine PDF files", "join PDF online", "free PDF merger"],
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    title: "Compress PDF Online Free - Reduce PDF File Size | CloudPDF",
    description: "Compress PDF files online with a fast browser-based optimizer. Reduce PDF file size and download an optimized document.",
    intent: "reduce PDF file size for sharing, upload forms, and email attachments",
    keywords: ["compress PDF", "reduce PDF size", "PDF compressor", "make PDF smaller"],
  },
  {
    slug: "repair-pdf",
    name: "Repair PDF",
    title: "Repair PDF Online Free - Rewrite PDF Structure | CloudPDF",
    description: "Repair PDF files online by reopening and rewriting the document structure in your browser.",
    intent: "try to rebuild a PDF file structure for a cleaner downloadable copy",
    keywords: ["repair PDF", "fix PDF", "rewrite PDF", "PDF repair tool"],
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    title: "Split PDF Online Free - Extract PDF Pages | CloudPDF",
    description: "Split PDF pages online, export page ranges, and create smaller PDF files from one document with CloudPDF.",
    intent: "separate a PDF into page ranges or individual files",
    keywords: ["split PDF", "extract PDF pages", "separate PDF", "PDF splitter"],
  },
  {
    slug: "remove-pages-from-pdf",
    name: "Remove PDF Pages",
    title: "Remove Pages from PDF Online Free | CloudPDF",
    description: "Remove unwanted pages from a PDF online. Choose page numbers, delete them in your browser, and download a cleaner PDF file.",
    intent: "delete selected pages from a PDF document",
    keywords: ["remove PDF pages", "delete pages from PDF", "PDF page remover", "remove pages online"],
  },
  {
    slug: "extract-pdf-pages",
    name: "Extract PDF Pages",
    title: "Extract PDF Pages Online Free | CloudPDF",
    description: "Extract pages from a PDF online and save selected page ranges as a new PDF file in your browser.",
    intent: "save selected PDF pages as a separate document",
    keywords: ["extract PDF pages", "save PDF pages", "PDF page extractor", "extract pages online"],
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    title: "PDF to JPG Converter Online Free | CloudPDF",
    description: "Convert PDF pages to JPG images online. Render PDF pages into downloadable image files from your browser.",
    intent: "turn PDF pages into shareable JPG images",
    keywords: ["PDF to JPG", "convert PDF to image", "PDF image converter", "PDF to JPEG"],
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    title: "JPG to PDF Converter Online Free | CloudPDF",
    description: "Convert JPG and PNG images to PDF online. Build one PDF from multiple images with a simple browser tool.",
    intent: "create a PDF from JPG or PNG image files",
    keywords: ["JPG to PDF", "image to PDF", "PNG to PDF", "convert images to PDF"],
  },
  {
    slug: "pdf-to-word",
    name: "PDF to Word",
    title: "PDF to Word Converter Online Free | CloudPDF",
    description: "Convert PDF pages to a Word-compatible DOCX file online using a private browser-based PDF converter.",
    intent: "export PDF pages into a Word document",
    keywords: ["PDF to Word", "PDF to DOCX", "convert PDF to Word", "online PDF converter"],
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    title: "Word to PDF Converter Online Free | CloudPDF",
    description: "Convert Word DOCX files to PDF online and download a browser-generated PDF copy of your document.",
    intent: "turn a Word document into a PDF",
    keywords: ["Word to PDF", "DOCX to PDF", "convert Word to PDF", "online PDF converter"],
  },
  {
    slug: "pdf-to-excel",
    name: "PDF to Excel",
    title: "PDF to Excel Converter Online Free | CloudPDF",
    description: "Convert extracted PDF text into an Excel-compatible workbook online with a browser-based PDF converter.",
    intent: "export PDF content into a spreadsheet format",
    keywords: ["PDF to Excel", "PDF to XLS", "convert PDF to spreadsheet", "PDF table export"],
  },
  {
    slug: "excel-to-pdf",
    name: "Excel to PDF",
    title: "Excel to PDF Converter Online Free | CloudPDF",
    description: "Convert Excel workbook content to PDF online and download a browser-generated PDF document.",
    intent: "turn spreadsheet content into a PDF",
    keywords: ["Excel to PDF", "XLSX to PDF", "convert Excel to PDF", "spreadsheet to PDF"],
  },
  {
    slug: "pdf-to-powerpoint",
    name: "PDF to PowerPoint",
    title: "PDF to PowerPoint Converter Online Free | CloudPDF",
    description: "Convert PDF pages to a PowerPoint-compatible slide deck online from your browser.",
    intent: "export PDF pages into a presentation file",
    keywords: ["PDF to PowerPoint", "PDF to PPT", "convert PDF to slides", "PDF presentation converter"],
  },
  {
    slug: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    title: "PowerPoint to PDF Converter Online Free | CloudPDF",
    description: "Convert PowerPoint slides to PDF online and download a browser-generated PDF document.",
    intent: "turn presentation content into a PDF",
    keywords: ["PowerPoint to PDF", "PPT to PDF", "PPTX to PDF", "slides to PDF"],
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    title: "Rotate PDF Online Free - Turn PDF Pages | CloudPDF",
    description: "Rotate PDF pages online by 90, 180, or 270 degrees and download a corrected PDF document.",
    intent: "fix sideways or upside-down PDF pages",
    keywords: ["rotate PDF", "turn PDF pages", "fix PDF orientation", "rotate PDF online"],
  },
  {
    slug: "watermark-pdf",
    name: "Watermark PDF",
    title: "Add Watermark to PDF Online Free | CloudPDF",
    description: "Add a text watermark to PDF pages online. Stamp drafts, confidential files, invoices, and documents in your browser.",
    intent: "label PDF pages with reusable watermark text",
    keywords: ["watermark PDF", "add watermark to PDF", "stamp PDF", "PDF watermark tool"],
  },
  {
    slug: "add-page-numbers-to-pdf",
    name: "Add Page Numbers",
    title: "Add Page Numbers to PDF Online Free | CloudPDF",
    description: "Add page numbers to PDF pages online and download a numbered PDF for review, printing, or sharing.",
    intent: "number the pages in a PDF document",
    keywords: ["add page numbers to PDF", "number PDF pages", "PDF page numbering", "insert page numbers PDF"],
  },
  {
    slug: "crop-pdf",
    name: "Crop PDF",
    title: "Crop PDF Online Free - Trim PDF Margins | CloudPDF",
    description: "Crop PDF pages online by trimming page margins and downloading a cleaner PDF file from your browser.",
    intent: "trim PDF page margins",
    keywords: ["crop PDF", "trim PDF margins", "resize PDF pages", "PDF crop tool"],
  },
  {
    slug: "sign-pdf",
    name: "Sign PDF",
    title: "Sign PDF Online Free - Add a Signature | CloudPDF",
    description: "Sign PDF documents online by placing a typed signature on your file and downloading the signed PDF.",
    intent: "add a simple signature to a PDF document",
    keywords: ["sign PDF", "PDF signature", "sign document online", "add signature to PDF"],
  },
  {
    slug: "redact-pdf",
    name: "Redact PDF",
    title: "Redact PDF Online Free - Cover Sensitive Text | CloudPDF",
    description: "Redact PDF files online with a browser-based tool that applies a visible redaction band to pages.",
    intent: "cover sensitive areas before sharing a PDF",
    keywords: ["redact PDF", "hide PDF text", "remove sensitive PDF content", "PDF redaction"],
  },
  {
    slug: "compare-pdf",
    name: "Compare PDF",
    title: "Compare PDF Files Online Free | CloudPDF",
    description: "Compare two PDF files online and download a text-based difference report from your browser.",
    intent: "review differences between two PDF documents",
    keywords: ["compare PDF", "PDF comparison", "compare documents online", "PDF diff"],
  },
  {
    slug: "extract-pdf-text",
    name: "Extract PDF Text",
    title: "Extract Text from PDF Online Free | CloudPDF",
    description: "Extract selectable text from PDF pages online and download a text export for summaries, notes, and review.",
    intent: "copy selectable PDF text into a downloadable text file",
    keywords: ["extract PDF text", "PDF text extractor", "copy text from PDF", "PDF OCR preview"],
  },
  {
    slug: "summarize-pdf",
    name: "Summarize PDF",
    title: "Summarize PDF Online Free - Local PDF Summary | CloudPDF",
    description: "Summarize PDF text online with a local browser-based summary of selectable PDF content.",
    intent: "create a local summary from selectable PDF text",
    keywords: ["summarize PDF", "PDF summary", "summarize document", "local PDF summary"],
  },
];

const appToolIdsBySlug = {
  "merge-pdf": "merge",
  "compress-pdf": "compress",
  "repair-pdf": "repair",
  "split-pdf": "split",
  "remove-pages-from-pdf": "remove-pages",
  "extract-pdf-pages": "extract-pages",
  "pdf-to-jpg": "pdf-to-jpg",
  "jpg-to-pdf": "jpg-to-pdf",
  "pdf-to-word": "pdf-to-word",
  "word-to-pdf": "word-to-pdf",
  "pdf-to-excel": "pdf-to-excel",
  "excel-to-pdf": "excel-to-pdf",
  "pdf-to-powerpoint": "pdf-to-powerpoint",
  "powerpoint-to-pdf": "powerpoint-to-pdf",
  "rotate-pdf": "rotate",
  "watermark-pdf": "watermark",
  "add-page-numbers-to-pdf": "page-numbers",
  "crop-pdf": "crop",
  "sign-pdf": "sign",
  "redact-pdf": "redact",
  "compare-pdf": "compare",
  "extract-pdf-text": "ocr",
  "summarize-pdf": "summarize",
};

const toolSeoProfiles = {
  "merge-pdf": {
    primaryKeyword: "merge PDF online",
    secondaryKeywords: ["combine PDF files", "join PDF files online", "free PDF merger", "merge multiple PDFs", "combine documents into one PDF"],
    relatedTools: ["split-pdf", "compress-pdf", "remove-pages-from-pdf", "add-page-numbers-to-pdf", "rotate-pdf", "watermark-pdf"],
  },
  "split-pdf": {
    primaryKeyword: "split PDF online",
    secondaryKeywords: ["separate PDF pages", "extract pages from PDF", "PDF splitter", "split PDF into individual pages", "divide PDF file"],
    relatedTools: ["merge-pdf", "extract-pdf-pages", "remove-pages-from-pdf", "rotate-pdf", "compress-pdf", "add-page-numbers-to-pdf"],
  },
  "remove-pages-from-pdf": {
    primaryKeyword: "remove pages from PDF",
    secondaryKeywords: ["delete PDF pages", "PDF page remover", "remove unwanted pages", "delete pages from PDF online", "clean PDF pages"],
    relatedTools: ["split-pdf", "extract-pdf-pages", "merge-pdf", "crop-pdf", "redact-pdf", "compress-pdf"],
  },
  "extract-pdf-pages": {
    primaryKeyword: "extract PDF pages",
    secondaryKeywords: ["save PDF pages", "PDF page extractor", "extract pages online", "copy pages from PDF", "create PDF from selected pages"],
    relatedTools: ["split-pdf", "remove-pages-from-pdf", "merge-pdf", "compress-pdf", "rotate-pdf", "pdf-to-jpg"],
  },
  "compress-pdf": {
    primaryKeyword: "compress PDF online",
    secondaryKeywords: ["reduce PDF size", "PDF compressor", "make PDF smaller", "compress PDF for email", "compress PDF under 1MB"],
    relatedTools: ["merge-pdf", "split-pdf", "pdf-to-jpg", "jpg-to-pdf", "word-to-pdf", "repair-pdf"],
  },
  "repair-pdf": {
    primaryKeyword: "repair PDF online",
    secondaryKeywords: ["fix PDF file", "PDF repair tool", "rewrite PDF structure", "recover PDF document", "repair corrupted PDF"],
    relatedTools: ["compress-pdf", "merge-pdf", "split-pdf", "extract-pdf-text", "pdf-to-jpg", "pdf-to-word"],
  },
  "jpg-to-pdf": {
    primaryKeyword: "JPG to PDF converter",
    secondaryKeywords: ["image to PDF", "convert JPG to PDF", "PNG to PDF", "combine images into PDF", "photo to PDF online"],
    relatedTools: ["pdf-to-jpg", "merge-pdf", "compress-pdf", "crop-pdf", "rotate-pdf", "word-to-pdf"],
  },
  "pdf-to-jpg": {
    primaryKeyword: "PDF to JPG converter",
    secondaryKeywords: ["convert PDF to image", "PDF to JPEG", "save PDF pages as JPG", "PDF image converter", "high quality PDF to JPG"],
    relatedTools: ["jpg-to-pdf", "pdf-to-word", "pdf-to-powerpoint", "extract-pdf-pages", "compress-pdf", "crop-pdf"],
  },
  "pdf-to-excel": {
    primaryKeyword: "PDF to Excel converter",
    secondaryKeywords: ["convert PDF to Excel", "PDF to XLSX", "extract PDF tables", "PDF spreadsheet converter", "PDF data to Excel"],
    relatedTools: ["excel-to-pdf", "extract-pdf-text", "pdf-to-word", "pdf-to-powerpoint", "compare-pdf", "compress-pdf"],
  },
  "pdf-to-powerpoint": {
    primaryKeyword: "PDF to PowerPoint converter",
    secondaryKeywords: ["PDF to PPT", "convert PDF to slides", "PDF presentation converter", "PDF to PPTX", "turn PDF into presentation"],
    relatedTools: ["powerpoint-to-pdf", "pdf-to-jpg", "pdf-to-word", "merge-pdf", "compress-pdf", "extract-pdf-pages"],
  },
  "pdf-to-word": {
    primaryKeyword: "PDF to Word converter",
    secondaryKeywords: ["convert PDF to Word", "PDF to DOCX", "editable Word from PDF", "PDF document converter", "PDF to Word online"],
    relatedTools: ["word-to-pdf", "extract-pdf-text", "pdf-to-excel", "pdf-to-powerpoint", "compress-pdf", "compare-pdf"],
  },
  "word-to-pdf": {
    primaryKeyword: "Word to PDF converter",
    secondaryKeywords: ["DOCX to PDF", "convert Word to PDF", "document to PDF", "make PDF from Word", "Word file to PDF online"],
    relatedTools: ["pdf-to-word", "merge-pdf", "compress-pdf", "add-page-numbers-to-pdf", "watermark-pdf", "sign-pdf"],
  },
  "redact-pdf": {
    primaryKeyword: "redact PDF online",
    secondaryKeywords: ["hide text in PDF", "cover sensitive PDF content", "PDF redaction tool", "black out PDF text", "remove private information from PDF"],
    relatedTools: ["sign-pdf", "watermark-pdf", "extract-pdf-text", "compare-pdf", "remove-pages-from-pdf", "crop-pdf"],
  },
  "sign-pdf": {
    primaryKeyword: "sign PDF online",
    secondaryKeywords: ["add signature to PDF", "PDF signature", "sign document online", "free PDF signer", "type signature on PDF"],
    relatedTools: ["redact-pdf", "watermark-pdf", "word-to-pdf", "merge-pdf", "compress-pdf", "add-page-numbers-to-pdf"],
  },
  "crop-pdf": {
    primaryKeyword: "crop PDF online",
    secondaryKeywords: ["trim PDF margins", "remove white border from PDF", "resize PDF pages", "PDF crop tool", "crop PDF pages"],
    relatedTools: ["rotate-pdf", "remove-pages-from-pdf", "pdf-to-jpg", "jpg-to-pdf", "compress-pdf", "redact-pdf"],
  },
  "add-page-numbers-to-pdf": {
    primaryKeyword: "add page numbers to PDF",
    secondaryKeywords: ["number PDF pages", "insert page numbers PDF", "PDF page numbering", "add footer numbers to PDF", "paginate PDF online"],
    relatedTools: ["merge-pdf", "watermark-pdf", "rotate-pdf", "word-to-pdf", "split-pdf", "compress-pdf"],
  },
  "watermark-pdf": {
    primaryKeyword: "add watermark to PDF",
    secondaryKeywords: ["watermark PDF online", "stamp PDF", "add text watermark", "PDF watermark tool", "mark PDF as confidential"],
    relatedTools: ["sign-pdf", "redact-pdf", "add-page-numbers-to-pdf", "merge-pdf", "compress-pdf", "word-to-pdf"],
  },
  "rotate-pdf": {
    primaryKeyword: "rotate PDF online",
    secondaryKeywords: ["turn PDF pages", "fix PDF orientation", "rotate PDF pages", "rotate PDF permanently", "change PDF page direction"],
    relatedTools: ["crop-pdf", "split-pdf", "merge-pdf", "extract-pdf-pages", "add-page-numbers-to-pdf", "compress-pdf"],
  },
  "powerpoint-to-pdf": {
    primaryKeyword: "PowerPoint to PDF converter",
    secondaryKeywords: ["PPT to PDF", "PPTX to PDF", "slides to PDF", "convert presentation to PDF", "PowerPoint file to PDF"],
    relatedTools: ["pdf-to-powerpoint", "merge-pdf", "compress-pdf", "watermark-pdf", "add-page-numbers-to-pdf", "pdf-to-jpg"],
  },
  "summarize-pdf": {
    primaryKeyword: "summarize PDF online",
    secondaryKeywords: ["PDF summary", "summarize document", "AI PDF summary", "local PDF summarizer", "summarize PDF text"],
    relatedTools: ["extract-pdf-text", "pdf-to-word", "compare-pdf", "redact-pdf", "compress-pdf", "merge-pdf"],
  },
  "extract-pdf-text": {
    primaryKeyword: "extract text from PDF",
    secondaryKeywords: ["PDF text extractor", "copy text from PDF", "extract selectable PDF text", "PDF OCR preview", "PDF to text"],
    relatedTools: ["summarize-pdf", "pdf-to-word", "pdf-to-excel", "compare-pdf", "redact-pdf", "repair-pdf"],
  },
  "compare-pdf": {
    primaryKeyword: "compare PDF files",
    secondaryKeywords: ["PDF comparison", "compare documents online", "PDF diff", "find PDF differences", "compare two PDFs"],
    relatedTools: ["extract-pdf-text", "redact-pdf", "pdf-to-word", "merge-pdf", "compress-pdf", "sign-pdf"],
  },
};

const trustPages = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy | CloudPDF",
    description: "Read how CloudPDF handles browser-based PDF processing, analytics, file privacy, and security for online PDF tools.",
    heading: "Privacy Policy",
    eyebrow: "Trust center",
    body: [
      "CloudPDF is designed around browser-based document work. Supported tools process files in the current browser session, and the app does not require an account before you merge, compress, split, convert, sign, redact, or extract text from PDF files.",
      "Files selected in the workspace are used only for the action you choose. They are not stored in a CloudPDF user account by this static site, and clearing the browser session, refreshing the page, or closing the tab removes the active file selection.",
      "Generated files are created for download in your browser. You should review every output before sharing it, especially after compression, conversion, redaction, repair, or text extraction, because document structure and visual layout can vary across PDF readers.",
      "CloudPDF may use privacy-conscious analytics, performance monitoring, and security tooling to understand aggregate usage, diagnose reliability issues, and improve Core Web Vitals. These services should be configured to avoid collecting document contents.",
      "Do not upload or process files you are not authorized to use. For highly sensitive, regulated, legal, medical, financial, or business-critical documents, evaluate whether a local offline workflow is more appropriate."
    ],
  },
  {
    slug: "terms",
    title: "Terms of Use | CloudPDF",
    description: "Review the terms for using CloudPDF free online PDF tools, including acceptable use and document responsibility.",
    heading: "Terms of Use",
    eyebrow: "Legal",
    body: [
      "CloudPDF provides free online PDF tools for common document workflows. You are responsible for the files you choose, the rights you have to process them, and how you use downloaded results.",
      "You agree not to use CloudPDF to process unlawful, harmful, infringing, deceptive, or unauthorized content. You must also avoid activity that abuses, overloads, reverse engineers, bypasses, scans, or interferes with the site or its supporting infrastructure.",
      "The tools are provided as-is for convenience. Document conversion, compression, redaction, comparison, signing, and repair features should be reviewed carefully before you rely on the output for legal, financial, medical, compliance, or business-critical use.",
      "CloudPDF may change tool availability, limits, supported file types, security controls, policies, and these terms as the product evolves. Continued use of the website means you accept the current version of these terms.",
      "If a generated file does not match your requirements, stop using that output and recreate it from the original source document using the appropriate tool settings."
    ],
  },
  {
    slug: "contact",
    title: "Contact CloudPDF | Support for Online PDF Tools",
    description: "Contact CloudPDF for support, feedback, privacy questions, partnerships, or online PDF tool requests.",
    heading: "Contact CloudPDF",
    eyebrow: "Support",
    body: [
      "For support, feedback, privacy questions, partnerships, or feature requests, contact the CloudPDF team through the official channel linked from the production site.",
      "When reporting an issue, include the tool name, browser, operating system, file type, file size range, and the exact step where the problem happened. Do not send confidential documents unless a secure support process has been established.",
      "For privacy or security concerns, use a clear subject line and include enough detail for the team to reproduce the issue without requiring your original document. Screenshots with sensitive content hidden are usually safer than sending source files.",
      "Useful requests include new PDF conversion formats, accessibility improvements, workflow suggestions, educational resources, directory partnerships, and documentation corrections.",
      "For business or partnership questions, describe the audience, expected workflow, geographic market, and any compliance requirements so the request can be routed properly."
    ],
  },
  {
    slug: "about",
    title: "About CloudPDF | Free Browser-Based PDF Tools",
    description: "Learn about CloudPDF, a fast browser-based PDF toolkit for merging, compressing, converting, signing, and editing documents online.",
    heading: "About CloudPDF",
    eyebrow: "Company",
    body: [
      "CloudPDF is a browser-based PDF toolkit for students, freelancers, office teams, and small businesses that need fast document actions without a complicated account flow.",
      "The product focuses on practical tools: merge PDF files, compress PDF documents, split pages, convert documents, add watermarks, number pages, sign PDFs, redact files, compare documents, and extract selectable text.",
      "CloudPDF favors direct workflows over heavy dashboards. Choose a tool, drop a file, adjust only the settings that matter, and download the result with a clear understanding of what changed.",
      "The website is organized around useful tool pages, long-tail workflow guides, structured data, fast loading, accessible interface patterns, and clear privacy messaging.",
      "The long-term goal is a dependable document workspace that feels simple for everyday users while still respecting security, privacy, performance, and search discoverability."
    ],
  },
];

const longTailPages = [
  {
    slug: "compress-pdf-under-100kb",
    title: "Compress PDF Under 100KB Online | CloudPDF",
    description: "Learn how to compress a PDF under 100KB for forms, uploads, and email attachments with CloudPDF.",
    heading: "Compress PDF under 100KB",
    toolSlug: "compress-pdf",
    toolName: "Compress PDF",
    intent: "make a PDF small enough for strict upload limits",
    useCases: ["Government forms with small upload limits", "School portals that reject large files", "Email attachments that need a compact PDF"],
  },
  {
    slug: "compress-pdf-under-500kb",
    title: "Compress PDF Under 500KB Online | CloudPDF",
    description: "Compress PDF files under 500KB for sharing, forms, and lightweight document uploads.",
    heading: "Compress PDF under 500KB",
    toolSlug: "compress-pdf",
    toolName: "Compress PDF",
    intent: "reduce PDF file size while keeping the document readable",
    useCases: ["Job applications", "Invoice uploads", "Mobile-friendly document sharing"],
  },
  {
    slug: "compress-pdf-for-email",
    title: "Compress PDF for Email Attachments | CloudPDF",
    description: "Reduce PDF size for email attachments and download a smaller PDF from your browser.",
    heading: "Compress PDF for email attachments",
    toolSlug: "compress-pdf",
    toolName: "Compress PDF",
    intent: "prepare a PDF that is easier to email",
    useCases: ["Client reports", "Scanned documents", "Receipts and invoices"],
  },
  {
    slug: "compress-pdf-for-whatsapp",
    title: "Compress PDF for WhatsApp Sharing | CloudPDF",
    description: "Make PDF documents easier to share on WhatsApp by reducing file size online.",
    heading: "Compress PDF for WhatsApp",
    toolSlug: "compress-pdf",
    toolName: "Compress PDF",
    intent: "make a PDF easier to share from a phone",
    useCases: ["Class notes", "Travel documents", "Small business catalogues"],
  },
  {
    slug: "pdf-to-word-for-students",
    title: "PDF to Word for Students Online | CloudPDF",
    description: "Convert PDF pages to Word-compatible DOCX files for assignments, notes, and study material.",
    heading: "PDF to Word for students",
    toolSlug: "pdf-to-word",
    toolName: "PDF to Word",
    intent: "turn PDF pages into an editable study document",
    useCases: ["Class notes", "Assignment drafts", "Research excerpts"],
  },
  {
    slug: "pdf-to-word-for-resumes",
    title: "PDF to Word for Resumes Online | CloudPDF",
    description: "Convert a resume PDF to a Word-compatible file so you can update text and formatting.",
    heading: "PDF to Word for resumes",
    toolSlug: "pdf-to-word",
    toolName: "PDF to Word",
    intent: "recover an editable resume from a PDF copy",
    useCases: ["Resume updates", "Recruiter edits", "Job application tailoring"],
  },
  {
    slug: "jpg-to-pdf-for-job-application",
    title: "JPG to PDF for Job Applications | CloudPDF",
    description: "Convert JPG documents, certificates, and scanned photos into one PDF for job applications.",
    heading: "JPG to PDF for job applications",
    toolSlug: "jpg-to-pdf",
    toolName: "JPG to PDF",
    intent: "combine image documents into one application-ready PDF",
    useCases: ["Certificates", "ID scans", "Portfolio images"],
  },
  {
    slug: "convert-pdf-to-word-without-losing-formatting",
    title: "Convert PDF to Word Without Losing Formatting | CloudPDF",
    description: "Convert PDF to Word online and preserve readable page layout with a browser-based DOCX export workflow.",
    heading: "Convert PDF to Word without losing formatting",
    toolSlug: "pdf-to-word",
    toolName: "PDF to Word",
    intent: "turn PDF pages into a Word-compatible file while keeping the page structure easy to review",
    useCases: ["Resume edits", "Assignment drafts", "Client document updates"],
  },
  {
    slug: "pdf-to-word-converter-free-without-email",
    title: "PDF to Word Converter Free Without Email | CloudPDF",
    description: "Use a free PDF to Word converter without an email gate. Export a Word-compatible file from your browser.",
    heading: "PDF to Word converter free without email",
    toolSlug: "pdf-to-word",
    toolName: "PDF to Word",
    intent: "convert a PDF to Word without creating an account or entering an email address first",
    useCases: ["Quick document edits", "School notes", "Office paperwork"],
  },
  {
    slug: "compress-pdf-file-size-below-1mb-online",
    title: "Compress PDF File Size Below 1MB Online | CloudPDF",
    description: "Reduce a PDF file below 1MB for upload forms, email attachments, and mobile sharing.",
    heading: "Compress PDF file size below 1MB online",
    toolSlug: "compress-pdf",
    toolName: "Compress PDF",
    intent: "make a PDF small enough for common 1MB upload limits",
    useCases: ["Job portals", "Government forms", "Email attachments"],
  },
  {
    slug: "merge-pdf-files-online-without-size-limit",
    title: "Merge PDF Files Online Without Size Limit | CloudPDF",
    description: "Merge PDF files online with a clean browser workflow for combining documents in the order you choose.",
    heading: "Merge PDF files online without size limit",
    toolSlug: "merge-pdf",
    toolName: "Merge PDF",
    intent: "combine several PDF files into one organized document without a complicated account flow",
    useCases: ["Client reports", "Application packets", "Class notes"],
  },
  {
    slug: "merge-pdf-online-free-no-limit",
    title: "Merge PDF Online Free No Limit | CloudPDF",
    description: "Combine PDF files online for free and arrange pages before downloading one merged document.",
    heading: "Merge PDF online free no limit",
    toolSlug: "merge-pdf",
    toolName: "Merge PDF",
    intent: "join PDF files quickly and download one combined file",
    useCases: ["Invoices", "Receipts", "Forms and attachments"],
  },
  {
    slug: "split-pdf-into-individual-pages-free-online",
    title: "Split PDF Into Individual Pages Free Online | CloudPDF",
    description: "Split a PDF into individual pages or page ranges and download smaller PDF files from your browser.",
    heading: "Split PDF into individual pages free online",
    toolSlug: "split-pdf",
    toolName: "Split PDF",
    intent: "separate one PDF into single pages or custom page ranges",
    useCases: ["Extracting forms", "Sharing one chapter", "Separating scanned documents"],
  },
  {
    slug: "split-pdf-into-separate-pages",
    title: "Split PDF Into Separate Pages | CloudPDF",
    description: "Create separate PDF pages from one file with a focused online PDF splitter workflow.",
    heading: "Split PDF into separate pages",
    toolSlug: "split-pdf",
    toolName: "Split PDF",
    intent: "turn one multi-page PDF into separate PDF outputs",
    useCases: ["One page submissions", "Document review", "Page-by-page exports"],
  },
  {
    slug: "remove-specific-pages-from-pdf-online-free",
    title: "Remove Specific Pages From PDF Online Free | CloudPDF",
    description: "Delete selected PDF pages online and download a cleaner file without the pages you do not need.",
    heading: "Remove specific pages from PDF online free",
    toolSlug: "remove-pages-from-pdf",
    toolName: "Remove PDF Pages",
    intent: "remove unwanted pages from a PDF before sharing or submitting it",
    useCases: ["Removing blank scans", "Deleting duplicate pages", "Cleaning up forms"],
  },
  {
    slug: "rearrange-pages-in-pdf-online-free",
    title: "Rearrange Pages in PDF Online Free | CloudPDF",
    description: "Organize PDF pages online by extracting, removing, rotating, and merging pages into the order you need.",
    heading: "Rearrange pages in PDF online free",
    toolSlug: "merge-pdf",
    toolName: "Merge PDF",
    intent: "rebuild a PDF page order using the organize PDF tools",
    useCases: ["Scanned forms", "Report packets", "Combined class material"],
  },
  {
    slug: "rotate-pdf-pages-permanently-online",
    title: "Rotate PDF Pages Permanently Online | CloudPDF",
    description: "Rotate sideways PDF pages online and download a corrected copy for printing, sharing, or upload.",
    heading: "Rotate PDF pages permanently online",
    toolSlug: "rotate-pdf",
    toolName: "Rotate PDF",
    intent: "fix PDF page orientation and save a corrected file",
    useCases: ["Sideways scans", "Phone-scanned forms", "Print-ready documents"],
  },
  {
    slug: "crop-pdf-to-remove-white-border-online",
    title: "Crop PDF to Remove White Border Online | CloudPDF",
    description: "Crop PDF margins online to remove extra white border around scanned pages or exported documents.",
    heading: "Crop PDF to remove white border online",
    toolSlug: "crop-pdf",
    toolName: "Crop PDF",
    intent: "trim PDF page margins for a cleaner result",
    useCases: ["Scanned paperwork", "Presentation exports", "Printable PDFs"],
  },
  {
    slug: "add-watermark-to-pdf-free-without-adobe-acrobat",
    title: "Add Watermark to PDF Free Without Adobe Acrobat | CloudPDF",
    description: "Add a text watermark to PDF pages online without using Adobe Acrobat or installing desktop software.",
    heading: "Add watermark to PDF free without Adobe Acrobat",
    toolSlug: "watermark-pdf",
    toolName: "Watermark PDF",
    intent: "stamp a PDF with visible reusable watermark text",
    useCases: ["Draft files", "Confidential documents", "Client proofs"],
  },
  {
    slug: "add-text-to-pdf-online-free-no-signup",
    title: "Add Text to PDF Online Free No Signup | CloudPDF",
    description: "Add signature text, page numbers, or watermark text to a PDF online without signing up first.",
    heading: "Add text to PDF online free no signup",
    toolSlug: "sign-pdf",
    toolName: "Sign PDF",
    intent: "place simple text-based marks on a PDF before downloading the result",
    useCases: ["Typed signatures", "Page labels", "Document watermarks"],
  },
  {
    slug: "jpg-to-pdf-multiple-images-at-once",
    title: "JPG to PDF Multiple Images at Once | CloudPDF",
    description: "Convert multiple JPG or PNG images into one PDF file with a batch-friendly image to PDF workflow.",
    heading: "JPG to PDF multiple images at once",
    toolSlug: "jpg-to-pdf",
    toolName: "JPG to PDF",
    intent: "combine several image files into one PDF document",
    useCases: ["Photo IDs", "Receipts", "Assignment photos"],
  },
  {
    slug: "pdf-to-jpg-high-quality-online-free",
    title: "PDF to JPG High Quality Online Free | CloudPDF",
    description: "Convert PDF pages to high-quality JPG images online and download rendered page images from your browser.",
    heading: "PDF to JPG high quality online free",
    toolSlug: "pdf-to-jpg",
    toolName: "PDF to JPG",
    intent: "export PDF pages as clear JPG images",
    useCases: ["Preview images", "Social sharing", "Image archives"],
  },
  {
    slug: "convert-png-to-pdf-online-without-watermark",
    title: "Convert PNG to PDF Online Without Watermark | CloudPDF",
    description: "Convert PNG and JPG images to PDF online with a simple browser workflow and no mandatory watermark step.",
    heading: "Convert PNG to PDF online without watermark",
    toolSlug: "jpg-to-pdf",
    toolName: "JPG to PDF",
    intent: "create a PDF from PNG or JPG images without adding a visible watermark",
    useCases: ["Scanned notes", "Screenshots", "Mobile photos"],
  },
  {
    slug: "scan-document-to-pdf-on-android-free",
    title: "Scan Document to PDF on Android Free | CloudPDF",
    description: "Turn phone-scanned JPG or PNG document photos into a single PDF from an Android browser.",
    heading: "Scan document to PDF on Android free",
    toolSlug: "jpg-to-pdf",
    toolName: "JPG to PDF",
    intent: "convert mobile document photos into one PDF file",
    useCases: ["ID scans", "Receipts", "School forms"],
  },
  {
    slug: "pdf-to-excel-converter-keep-formatting",
    title: "PDF to Excel Converter Keep Formatting | CloudPDF",
    description: "Convert PDF text into an Excel-compatible workbook and review extracted table-style content online.",
    heading: "PDF to Excel converter keep formatting",
    toolSlug: "pdf-to-excel",
    toolName: "PDF to Excel",
    intent: "export PDF content into a spreadsheet-friendly file",
    useCases: ["Finance reports", "Lists and tables", "Invoice review"],
  },
  {
    slug: "powerpoint-to-pdf-without-losing-animations",
    title: "PowerPoint to PDF Without Losing Animations: What Actually Works | CloudPDF",
    description: "Learn why PowerPoint animations become static in PDF, how to preserve each animation step as pages, and when to use video instead.",
    heading: "PowerPoint to PDF without losing animations",
    toolSlug: "powerpoint-to-pdf",
    toolName: "PowerPoint to PDF",
    intent: "turn a PowerPoint deck into a shareable PDF copy while checking how animated slides will appear",
    useCases: ["Class slides", "Client decks", "Presentation handouts"],
    primaryKeyword: "PowerPoint to PDF without losing animations",
    keywords: ["PowerPoint to PDF without losing animations", "PPT to PDF animations", "PPTX to PDF with animations", "convert animated PowerPoint to PDF"],
    publishedAt: "2026-06-07T00:00:00.000Z",
    modifiedAt: builtAt,
  },
  {
    slug: "unlock-pdf-without-password-online-free",
    title: "Unlock PDF Without Password Online Free | CloudPDF",
    description: "Understand safe PDF access limits and use CloudPDF security tools for legitimate document workflows.",
    heading: "Unlock PDF without password online free",
    toolSlug: "repair-pdf",
    toolName: "Repair PDF",
    intent: "work with legitimate PDF access issues without bypassing someone else's permissions",
    useCases: ["Corrupted files", "Own documents", "Readable backup copies"],
  },
  {
    slug: "how-to-password-protect-a-pdf-for-free",
    title: "How to Password Protect a PDF for Free | CloudPDF",
    description: "Learn practical ways to prepare a PDF for safer sharing and when to use password protection.",
    heading: "How to password protect a PDF for free",
    toolSlug: "redact-pdf",
    toolName: "Redact PDF",
    intent: "prepare sensitive documents for safer sharing",
    useCases: ["Private forms", "Client files", "Shared reports"],
  },
  {
    slug: "digitally-sign-pdf-free-without-adobe",
    title: "Digitally Sign PDF Free Without Adobe | CloudPDF",
    description: "Add a simple typed signature to a PDF online and learn when a formal digital certificate is required.",
    heading: "Digitally sign PDF free without Adobe",
    toolSlug: "sign-pdf",
    toolName: "Sign PDF",
    intent: "add a visible signature mark to a PDF before downloading it",
    useCases: ["Approval forms", "Lightweight agreements", "Internal documents"],
  },
  {
    slug: "redact-text-in-pdf-online-free",
    title: "Redact Text in PDF Online Free | CloudPDF",
    description: "Redact PDF pages online by adding visible redaction bands before you share sensitive documents.",
    heading: "Redact text in PDF online free",
    toolSlug: "redact-pdf",
    toolName: "Redact PDF",
    intent: "cover sensitive information before sharing a PDF",
    useCases: ["IDs", "Financial details", "Private forms"],
  },
  {
    slug: "how-to-make-pdf-read-only-free",
    title: "How to Make PDF Read Only Free | CloudPDF",
    description: "Learn how to prepare a PDF for read-only sharing and reduce editable or sensitive content before sending.",
    heading: "How to make PDF read only free",
    toolSlug: "redact-pdf",
    toolName: "Redact PDF",
    intent: "prepare a PDF for safer viewing and sharing",
    useCases: ["Client previews", "Shared forms", "Final reports"],
  },
  {
    slug: "ocr-pdf-make-searchable-text-free",
    title: "OCR PDF Make Searchable Text Free | CloudPDF",
    description: "Extract selectable PDF text online and learn how searchable text workflows differ from image-only scans.",
    heading: "OCR PDF make searchable text free",
    toolSlug: "extract-pdf-text",
    toolName: "Extract PDF Text",
    intent: "extract readable text from PDF pages for notes, summaries, and review",
    useCases: ["Research notes", "Scanned reports with selectable text", "Document review"],
  },
  {
    slug: "summarize-pdf-with-ai-free-online-no-signup",
    title: "Summarize PDF With AI Free Online No Signup | CloudPDF",
    description: "Summarize selectable PDF text online with a local summary workflow and no mandatory signup step.",
    heading: "Summarize PDF with AI free online no signup",
    toolSlug: "summarize-pdf",
    toolName: "Summarize PDF",
    intent: "create a quick summary from selectable PDF content",
    useCases: ["Study notes", "Business reports", "Research PDFs"],
  },
  {
    slug: "summarize-pdf-for-free-online-instantly",
    title: "Summarize PDF for Free Online Instantly | CloudPDF",
    description: "Create a fast local summary from selectable PDF text and review the main points before sharing.",
    heading: "Summarize PDF for free online instantly",
    toolSlug: "summarize-pdf",
    toolName: "Summarize PDF",
    intent: "quickly understand the main points in a selectable PDF",
    useCases: ["Long articles", "Reports", "Study material"],
  },
  {
    slug: "chat-with-pdf-ai-free-no-login",
    title: "Chat With PDF AI Free No Login | CloudPDF",
    description: "Use text extraction and summaries to review PDF content without a mandatory login flow.",
    heading: "Chat with PDF AI free no login",
    toolSlug: "summarize-pdf",
    toolName: "Summarize PDF",
    intent: "review PDF content with AI-style summary workflows",
    useCases: ["Question prep", "Document review", "Study sessions"],
  },
  {
    slug: "translate-pdf-from-english-to-hindi-free",
    title: "Translate PDF From English to Hindi Free | CloudPDF",
    description: "Prepare PDF text for translation by extracting selectable content before using your translation workflow.",
    heading: "Translate PDF from English to Hindi free",
    toolSlug: "extract-pdf-text",
    toolName: "Extract PDF Text",
    intent: "extract PDF text so it can be translated in a separate translation workflow",
    useCases: ["Study material", "Forms", "Business documents"],
  },
  {
    slug: "translate-pdf-to-spanish-online-free",
    title: "Translate PDF to Spanish Online Free | CloudPDF",
    description: "Extract selectable PDF text as a first step before translating document content to Spanish.",
    heading: "Translate PDF to Spanish online free",
    toolSlug: "extract-pdf-text",
    toolName: "Extract PDF Text",
    intent: "prepare PDF text for translation into Spanish",
    useCases: ["Class documents", "Travel forms", "Reference material"],
  },
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const homepageTemplate = await readFile(join(root, "index.html"), "utf8");

for (const item of ["index.html", "app.js", "theme.js", "styles.css", "assets", "_headers", "_redirects", "site.webmanifest"]) {
  await cp(join(root, item), join(output, item), { recursive: true });
}

await mkdir(join(output, "vendor"), { recursive: true });
await cp(join(root, "node_modules", "pdf-lib", "dist", "pdf-lib.esm.min.js"), join(output, "vendor", "pdf-lib.esm.min.js"));
await cp(join(root, "node_modules", "pdf-lib", "dist", "pdf-lib.esm.min.js.map"), join(output, "vendor", "pdf-lib.esm.min.js.map"));
await cp(join(root, "node_modules", "jszip", "dist", "jszip.min.js"), join(output, "vendor", "jszip.min.js"));
await cp(join(root, "node_modules", "pdfjs-dist", "build", "pdf.min.mjs"), join(output, "vendor", "pdf.min.mjs"));
await cp(join(root, "node_modules", "pdfjs-dist", "build", "pdf.mjs.map"), join(output, "vendor", "pdf.mjs.map"));
await cp(join(root, "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs"), join(output, "vendor", "pdf.worker.min.mjs"));
await cp(join(root, "node_modules", "pdfjs-dist", "build", "pdf.worker.mjs.map"), join(output, "vendor", "pdf.worker.mjs.map"));

await writeFile(join(output, "robots.txt"), buildRobots(), "utf8");
await writeFile(join(output, "sitemap.xml"), buildSitemap(), "utf8");
await writeFile(join(output, "llms.txt"), buildLlmsTxt(), "utf8");
await writeFile(join(output, "ads.txt"), buildAdsTxt(), "utf8");

for (const tool of toolPages) {
  const dir = join(output, "tools", tool.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), buildToolPage(tool), "utf8");
}

for (const page of trustPages) {
  const dir = join(output, page.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), buildTrustPage(page), "utf8");
}

for (const page of longTailPages) {
  const dir = join(output, page.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), buildLongTailPage(page), "utf8");
}

console.log("Static site written to public/");

function buildRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
Host: www.cloudpdf.online
`;
}

function buildStylesHead() {
  return `<style>${criticalCss}</style>
    <link rel="preload" as="style" href="/styles.css?v=${stylesVersion}" />
    <link rel="stylesheet" href="/styles.css?v=${stylesVersion}" media="print" onload="this.media='all'" />
    <noscript><link rel="stylesheet" href="/styles.css?v=${stylesVersion}" /></noscript>`;
}

function buildSitemap() {
  const urls = [
    { loc: `${siteUrl}/`, priority: "1.0", changefreq: "daily", lastmod: builtAt },
    ...toolPages.map((tool) => ({
      loc: `${siteUrl}/tools/${tool.slug}/`,
      priority: tool.slug === "merge-pdf" || tool.slug === "compress-pdf" ? "0.9" : "0.8",
      changefreq: "daily",
      lastmod: builtAt,
    })),
    ...longTailPages.map((page) => ({
      loc: `${siteUrl}/${page.slug}/`,
      priority: page.slug === "powerpoint-to-pdf-without-losing-animations" ? "0.86" : "0.72",
      changefreq: page.slug === "powerpoint-to-pdf-without-losing-animations" ? "weekly" : "daily",
      lastmod: page.modifiedAt ?? defaultModifiedDate,
    })),
    ...trustPages.map((page) => ({
      loc: `${siteUrl}/${page.slug}/`,
      priority: page.slug === "about" ? "0.7" : "0.6",
      changefreq: "daily",
      lastmod: builtAt,
    })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
}

function buildLlmsTxt() {
  const toolLines = toolPages
    .map((tool) => `- [${tool.name}](${siteUrl}/tools/${tool.slug}/): ${tool.description}`)
    .join("\n");

  return `# CloudPDF

CloudPDF is a free browser-based PDF toolkit for common document tasks. It helps users merge PDF files, compress PDF files, split PDF pages, convert PDF to JPG, convert JPG to PDF, rotate pages, add watermarks, sign PDFs, redact PDFs, compare PDFs, and extract PDF text.

## Primary Pages

- [Homepage](${siteUrl}/): Online PDF tools workspace and directory.
- [Sitemap](${siteUrl}/sitemap.xml): XML sitemap for crawl discovery.
- [Robots](${siteUrl}/robots.txt): Crawl policy.
- [About](${siteUrl}/about/): Product background and trust context.
- [Privacy Policy](${siteUrl}/privacy-policy/): File handling and privacy policy.
- [Terms](${siteUrl}/terms/): Terms of use.
- [Contact](${siteUrl}/contact/): Support and feedback route.

## PDF Tool Pages

${toolLines}

## Long-Tail SEO Pages

${longTailPages.map((page) => `- [${page.heading}](${siteUrl}/${page.slug}/): ${page.description}`).join("\n")}

## Entity Summary

- Brand: CloudPDF
- Category: Online PDF tools, browser PDF converter, document productivity software
- Processing model: Browser-based PDF processing for supported tools
- Audience: Students, freelancers, office workers, small businesses, and anyone editing PDFs online
`;
}

function buildAdsenseHead() {
  return "";
}

function buildGoogleTagHead() {
  return `<script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${googleTagId}');
      window.addEventListener('load', () => {
        const loadThirdParty = () => {
          const tag = document.createElement('script');
          tag.async = true;
          tag.src = 'https://www.googletagmanager.com/gtag/js?id=${googleTagId}';
          document.head.append(tag);

          const ads = document.createElement('script');
          ads.async = true;
          ads.crossOrigin = 'anonymous';
          ads.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}';
          document.head.append(ads);
        };
        if ('requestIdleCallback' in window) {
          requestIdleCallback(loadThirdParty, { timeout: 2500 });
        } else {
          setTimeout(loadThirdParty, 1200);
        }
      }, { once: true });
    </script>`;
}

function buildGoogleSearchConsoleHead() {
  if (!googleSearchConsoleVerification || googleSearchConsoleVerification.includes("PASTE_")) {
    return "";
  }

  return `<meta name="google-site-verification" content="${googleSearchConsoleVerification}" />`;
}

function buildAdsTxt() {
  return `google.com, ${adsensePublisherId.replace("ca-pub-", "pub-")}, DIRECT, f08c47fec0942fa0
`;
}

function buildToolWorkspacePage(tool) {
  const url = `${siteUrl}/tools/${tool.slug}/`;
  const appToolId = appToolIdsBySlug[tool.slug] ?? "merge";
  const faqs = buildToolFaqs(tool);
  const keywords = getToolKeywords(tool);
  const jsonLd = JSON.stringify(buildToolStructuredData(tool, url, faqs), null, 2);
  const toolSeoContent = buildToolSeoContent(tool, faqs);
  const categoryBySlug = {
    "merge-pdf": "Organize PDF",
    "split-pdf": "Organize PDF",
    "remove-pages-from-pdf": "Organize PDF",
    "extract-pdf-pages": "Organize PDF",
    "compress-pdf": "Optimize PDF",
    "repair-pdf": "Optimize PDF",
    "jpg-to-pdf": "Convert PDF",
    "pdf-to-word": "Convert PDF",
    "pdf-to-powerpoint": "Convert PDF",
    "pdf-to-excel": "Convert PDF",
    "pdf-to-jpg": "Convert PDF",
    "word-to-pdf": "Convert PDF",
    "powerpoint-to-pdf": "Convert PDF",
    "excel-to-pdf": "Convert PDF",
    "rotate-pdf": "Edit PDF",
    "watermark-pdf": "Edit PDF",
    "add-page-numbers-to-pdf": "Edit PDF",
    "crop-pdf": "Edit PDF",
    "sign-pdf": "PDF Security",
    "redact-pdf": "PDF Security",
    "compare-pdf": "PDF Security",
    "extract-pdf-text": "PDF Intelligence",
    "summarize-pdf": "PDF Intelligence",
  };
  const page = homepageTemplate
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(tool.title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/,
      `<meta name="description" content="${escapeHtml(tool.description)}" />\n    <meta name="keywords" content="${escapeHtml(keywords.join(", "))}" />`
    )
    .replace(/<link rel="canonical" href="[\s\S]*?" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title" content="[\s\S]*?" \/>/, `<meta property="og:title" content="${escapeHtml(tool.title)}" />`)
    .replace(
      /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/>/,
      `<meta property="og:description" content="${escapeHtml(tool.description)}" />`
    )
    .replace(/<meta property="og:url" content="[\s\S]*?" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta name="twitter:title" content="[\s\S]*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(tool.title)}" />`)
    .replace(
      /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/>/,
      `<meta name="twitter:description" content="${escapeHtml(tool.description)}" />`
    )
    .replace(/<p class="eyebrow" id="active-category">[\s\S]*?<\/p>/, `<p class="eyebrow" id="active-category">${escapeHtml(categoryBySlug[tool.slug] ?? "PDF Tool")}</p>`)
    .replace(/<h2 id="workspace-title">[\s\S]*?<\/h2>/, `<h1 id="workspace-title">${escapeHtml(tool.name)} Online</h1>`)
    .replace(/<p id="workspace-description">[\s\S]*?<\/p>/, `<p id="workspace-description">${escapeHtml(tool.description)}</p>`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${jsonLd.replace(/</g, "\\u003c")}</script>`)
    .replace('alt="" width="56" height="36" aria-hidden="true" decoding="async"', 'alt="" width="56" height="36" aria-hidden="true" decoding="async" fetchpriority="high"')
    .replace("<body>", `<body data-tool-id="${escapeHtml(appToolId)}">`)
    .replaceAll('href="#tools"', 'href="/#tools"')
    .replaceAll('href="#popular"', 'href="/#popular"')
    .replaceAll('href="#faq"', 'href="/#faq"')
    .replaceAll('href="#workspace"', 'href="#workspace"');
  const mainOpen = page.indexOf("<main>");
  const mainContentStart = mainOpen + "<main>".length;
  const mainClose = page.indexOf("</main>");
  const breadcrumbsStart = page.indexOf('<nav class="breadcrumbs"', mainContentStart);
  const breadcrumbsEnd = page.indexOf("</nav>", breadcrumbsStart) + "</nav>".length;
  const workspaceStart = page.indexOf('<section id="workspace"', mainContentStart);
  const dashboardStart = page.indexOf('<section id="dashboard"', workspaceStart);
  const breadcrumbs = page.slice(breadcrumbsStart, breadcrumbsEnd);
  const workspace = page.slice(workspaceStart, dashboardStart);
  const afterWorkspace = page.slice(dashboardStart, mainClose);
  const hiddenToolDirectory = `<section class="tool-directory" hidden aria-hidden="true">
        <div class="category-tabs" id="category-tabs" aria-label="Tool categories"></div>
        <div class="tool-grid" id="tool-grid"></div>
      </section>`;

  return `${page.slice(0, mainContentStart)}
      ${breadcrumbs}
      ${hiddenToolDirectory}
      ${workspace}
      ${toolSeoContent}
      ${afterWorkspace}
    ${page.slice(mainClose)}`;
}

function buildToolStructuredData(tool, url, faqs) {
  const keywords = getToolKeywords(tool);
  const relatedTools = getRelatedTools(tool);
  const relatedGuides = getRelatedGuides(tool);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        name: tool.title.replace(" | CloudPDF", ""),
        url,
        description: tool.description,
        keywords: keywords.join(", "),
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${url}#app` },
        inLanguage: "en",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${url}#app`,
        name: tool.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any",
        url,
        description: tool.description,
        keywords: keywords.join(", "),
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@id": `${siteUrl}/#organization` },
        featureList: [
          tool.intent,
          ...keywords.slice(0, 6),
          "Free online PDF workflow",
          "Browser-based document processing",
          "No mandatory signup for the core tool",
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${url}#howto`,
        name: `How to use ${tool.name} online`,
        description: `Use CloudPDF to ${tool.intent}.`,
        totalTime: "PT2M",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Choose your file",
            text: `Open ${tool.name} and choose the PDF or supported file you want to process.`,
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Adjust the options",
            text: "Review the available settings and confirm the file order, page range, conversion option, or edit setting.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Download the result",
            text: "Process the file, download the output, and review it before sharing or submitting it.",
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "PDF Tools", item: `${siteUrl}/#tools` },
          { "@type": "ListItem", position: 3, name: tool.name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${url}#related-tools`,
        name: `Related ${tool.name} tools`,
        itemListElement: relatedTools.map((relatedTool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: relatedTool.name,
          url: `${siteUrl}/tools/${relatedTool.slug}/`,
        })),
      },
      ...(relatedGuides.length
        ? [
            {
              "@type": "ItemList",
              "@id": `${url}#related-guides`,
              name: `Related ${tool.name} guides`,
              itemListElement: relatedGuides.map((guide, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: guide.heading,
                url: `${siteUrl}/${guide.slug}/`,
              })),
            },
          ]
        : []),
    ],
  };
}

function buildToolSeoContent(tool, faqs) {
  const profile = getToolSeoProfile(tool);
  const keywords = getToolKeywords(tool);
  const relatedTools = getRelatedTools(tool);
  const relatedGuides = getRelatedGuides(tool);
  const relatedToolLinks = relatedTools
    .map((relatedTool) => `<a href="/tools/${relatedTool.slug}/">${escapeHtml(relatedTool.name)}</a>`)
    .join("");
  const relatedGuideLinks = relatedGuides
    .map((guide) => `<a href="/${guide.slug}/">${escapeHtml(guide.heading)}</a>`)
    .join("");

  return `<section class="seo-section tool-seo-summary" aria-labelledby="tool-seo-title">
        <div class="section-heading">
          <p class="eyebrow">Online PDF tool</p>
          <h2 id="tool-seo-title">${escapeHtml(profile.primaryKeyword)} for fast browser-based document work.</h2>
          <p>${escapeHtml(tool.name)} helps you ${escapeHtml(tool.intent)}. CloudPDF keeps the workflow focused: choose your file, review the relevant settings, process it in the browser workspace, and download the finished result.</p>
          <p>This page targets ${keywords.map((keyword) => escapeHtml(keyword)).join(", ")} with a dedicated canonical URL, sitemap discovery, indexable copy, and tool-specific structured data.</p>
        </div>
        <div class="faq-grid">
          <article><h4>How to use ${escapeHtml(tool.name)}</h4><p>Open the workspace, choose your file, adjust the available options, then download and review the result before sharing it.</p></article>
          <article><h4>Why this page should be indexed</h4><p>It has a dedicated canonical URL, unique title and description, indexable page copy, tool-specific FAQ answers, and structured data tied to the exact PDF workflow.</p></article>
          <article><h4>Related search intent</h4><p>${keywords.map((keyword) => escapeHtml(keyword)).join(", ")}.</p></article>
        </div>
        <div class="section-heading">
          <p class="eyebrow">Internal backlinks</p>
          <h2>Related pages that support ${escapeHtml(profile.primaryKeyword)}.</h2>
          <p>These internal links help users and crawlers discover closely related PDF workflows from this page.</p>
        </div>
        <div class="seo-link-grid">${relatedToolLinks}</div>
        ${relatedGuideLinks ? `<div class="seo-link-grid tool-guide-links">${relatedGuideLinks}</div>` : ""}
        <div class="faq-grid" aria-label="${escapeHtml(tool.name)} frequently asked questions">
          ${faqs.slice(0, 6).map((faq) => `<article><h4>${escapeHtml(faq.question)}</h4><p>${escapeHtml(faq.answer)}</p></article>`).join("")}
        </div>
      </section>`;
}

function getToolSeoProfile(tool) {
  return toolSeoProfiles[tool.slug] ?? {
    primaryKeyword: tool.keywords[0] ?? `${tool.name} online`,
    secondaryKeywords: tool.keywords.slice(1),
    relatedTools: toolPages.filter((item) => item.slug !== tool.slug).slice(0, 6).map((item) => item.slug),
  };
}

function getToolKeywords(tool) {
  const profile = getToolSeoProfile(tool);
  return [...new Set([profile.primaryKeyword, ...profile.secondaryKeywords, ...tool.keywords])];
}

function getRelatedTools(tool) {
  const profile = getToolSeoProfile(tool);
  const preferred = profile.relatedTools
    .map((slug) => toolPages.find((item) => item.slug === slug))
    .filter(Boolean);
  const fallback = toolPages.filter((item) => item.slug !== tool.slug && !preferred.some((related) => related.slug === item.slug));
  return [...preferred, ...fallback].slice(0, 8);
}

function getRelatedGuides(tool) {
  return longTailPages.filter((page) => page.toolSlug === tool.slug).slice(0, 8);
}

function buildToolPage(tool) {
  return buildToolWorkspacePage(tool);

  const url = `${siteUrl}/tools/${tool.slug}/`;
  const appToolId = appToolIdsBySlug[tool.slug] ?? "merge";
  const encodedAppToolId = encodeURIComponent(appToolId);
  const faqs = buildToolFaqs(tool);
  const relatedLinks = toolPages
    .filter((item) => item.slug !== tool.slug)
    .slice(0, 6)
    .map((item) => `<a href="/tools/${item.slug}/">${escapeHtml(item.name)}</a>`)
    .join("");
  const relatedGuides = longTailPages
    .filter((page) => page.toolSlug === tool.slug)
    .slice(0, 8)
    .map((page) => `<a href="/${page.slug}/">${escapeHtml(page.heading)}</a>`)
    .join("");

  const keywordList = tool.keywords
    .map(
      (keyword, index) =>
        `<span class="keyword-chip keyword-chip-${index + 1}" aria-label="${escapeHtml(keyword)}"><i aria-hidden="true"></i><b class="sr-only">${escapeHtml(keyword)}</b></span>`
    )
    .join("");
  const jsonLd = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "@id": `${url}#app`,
          name: tool.name,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          url,
          description: tool.description,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@id": `${siteUrl}/#organization` },
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${url}#breadcrumbs`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
            { "@type": "ListItem", position: 2, name: "PDF Tools", item: `${siteUrl}/#tools` },
            { "@type": "ListItem", position: 3, name: tool.name, item: url },
          ],
        },
        {
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        },
      ],
    },
    null,
    2
  );

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(tool.title)}</title>
    <meta name="description" content="${escapeHtml(tool.description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="theme-color" content="#fffaf2" />
    ${buildGoogleTagHead()}
    ${buildAdsenseHead()}
    ${buildGoogleSearchConsoleHead()}
    <link rel="canonical" href="${url}" />
    <link rel="icon" type="image/svg+xml" href="/assets/cloudpdf-favicon.svg?v=1" />
    <link rel="apple-touch-icon" href="/assets/ourpdf-new-icon.png?v=1" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="CloudPDF" />
    <meta property="og:title" content="${escapeHtml(tool.title)}" />
    <meta property="og:description" content="${escapeHtml(tool.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${siteUrl}/assets/cloudpdf-logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(tool.title)}" />
    <meta name="twitter:description" content="${escapeHtml(tool.description)}" />
    <meta name="twitter:image" content="${siteUrl}/assets/cloudpdf-logo.png" />
    <script defer src="/theme.js?v=security-v2"></script>
    ${buildStylesHead()}
    <script defer src="/_vercel/speed-insights/script.js" data-sdkn="@vercel/speed-insights" data-sdkv="2.0.0"></script>
    <script type="application/ld+json">${jsonLd.replace(/</g, "\\u003c")}</script>
  </head>
  <body>
    <header class="topbar">
      <a class="brand" href="/" aria-label="CloudPDF home">
        <img class="brand-logo" src="/assets/cloudpdf-logo.svg?v=1" alt="" width="56" height="36" aria-hidden="true" decoding="async" />
        <span>CloudPDF</span>
      </a>
      <nav class="nav-links" aria-label="Primary navigation">
        <a href="/#tools">Tools</a>
        <a href="/#pdf-converter">Converters</a>
        <a href="/#faq">FAQ</a>
        <a href="/#workspace">Workspace</a>
      </nav>
      <div class="topbar-actions">
        <button class="theme-toggle" type="button" id="theme-toggle" aria-label="Switch to dark theme" aria-pressed="false">
          <span aria-hidden="true"></span>
          <strong>Light</strong>
        </button>
        <a class="primary-link" href="/#workspace">Start</a>
      </div>
    </header>
    <main>
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/#tools">PDF tools</a></li>
          <li><a href="${url}">${escapeHtml(tool.name)}</a></li>
        </ol>
      </nav>
      <section class="hero tool-landing" aria-labelledby="tool-title">
        <div class="hero-copy">
          <p class="eyebrow">Free online PDF tool</p>
          <h3 id="tool-title">${escapeHtml(tool.name)} online</h3>
          <p>${escapeHtml(tool.description)} Use this page when you need to ${escapeHtml(tool.intent)} with a focused PDF workflow.</p>
          <div class="hero-actions">
            <a class="button primary" href="/#workspace" data-initial-tool="${encodedAppToolId}">Open ${escapeHtml(tool.name)}</a>
            <a class="button secondary" href="/#tools">Browse all PDF tools</a>
          </div>
        </div>
        <div class="hero-panel keyword-panel tilt-card" aria-label="${escapeHtml(tool.name)} highlights">
          <div class="keyword-art" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
          <h2>${escapeHtml(tool.name)} signals</h2>
          <div class="keyword-list">${keywordList}</div>
        </div>
      </section>
      <section class="seo-section" aria-labelledby="about-tool-title">
        <div class="section-heading">
          <p class="eyebrow">What this tool does</p>
          <h2 id="about-tool-title">${escapeHtml(tool.name)} for focused document work.</h2>
          <p>${escapeHtml(tool.name)} helps you ${escapeHtml(tool.intent)}. It is built for people who want a direct browser workflow: open the tool, choose files, adjust only the settings that matter, and download the finished PDF or converted file. This page targets the ${escapeHtml(tool.keywords[0])} search intent while also answering related long-tail questions about privacy, file handling, speed, and common use cases.</p>
          <p>Use it for everyday school, work, client, invoice, form, and sharing tasks where you need a quick PDF result without hunting through a full desktop editor.</p>
        </div>
      </section>
      <section class="seo-section" aria-labelledby="benefits-title">
        <div class="section-heading">
          <p class="eyebrow">Benefits</p>
          <h2 id="benefits-title">Fast, secure, free, and browser-based.</h2>
        </div>
        <div class="faq-grid">
          <article><h4>Fast</h4><p>Focused options help you finish the PDF task quickly and avoid unnecessary setup.</p></article>
          <article><h4>Secure</h4><p>The workspace is designed for browser-session processing and clear file handling.</p></article>
          <article><h4>Free</h4><p>You can start core PDF actions without a mandatory signup step.</p></article>
          <article><h4>Browser-based</h4><p>Use the tool from a modern desktop or mobile browser without installing a heavy editor.</p></article>
        </div>
      </section>
      <section class="seo-section" aria-labelledby="how-title">
        <div class="section-heading">
          <p class="eyebrow">How it works</p>
          <h2 id="how-title">A simple workflow for ${escapeHtml(tool.name.toLowerCase())}.</h2>
        </div>
        <div class="workflow-flow tilt-card" aria-label="Workflow: choose file, adjust options, download result">
          <div class="flow-step">
            <span class="workflow-icon file-icon" aria-hidden="true"></span>
            <strong>Choose</strong>
          </div>
          <span class="flow-arrow" aria-hidden="true"></span>
          <div class="flow-step">
            <span class="workflow-icon adjust-icon" aria-hidden="true"></span>
            <strong>Adjust</strong>
          </div>
          <span class="flow-arrow" aria-hidden="true"></span>
          <div class="flow-step">
            <span class="workflow-icon download-icon" aria-hidden="true"></span>
            <strong>Download</strong>
          </div>
          <p>Open the workspace, set the options, then download the finished file.</p>
        </div>
      </section>
      <section class="seo-section" aria-labelledby="privacy-title">
        <div class="section-heading">
          <p class="eyebrow">Security and privacy</p>
          <h2 id="privacy-title">Clear file handling for private PDF work.</h2>
          <p>CloudPDF is designed as a browser-first workspace. Selected files are used for the task you choose in the current session, and the interface does not require a user account before processing. Always review sensitive documents before sharing them and close or refresh the session when you are done.</p>
        </div>
      </section>
      <section class="seo-section" aria-labelledby="tool-faq-title">
        <div class="section-heading">
          <p class="eyebrow">FAQ</p>
          <h2 id="tool-faq-title">${escapeHtml(tool.name)} questions.</h2>
        </div>
        <div class="faq-grid">
          ${faqs.map((faq) => `<article><h4>${escapeHtml(faq.question)}</h4><p>${escapeHtml(faq.answer)}</p></article>`).join("")}
        </div>
      </section>
      <section class="seo-section" aria-labelledby="related-title">
        <div class="section-heading">
          <p class="eyebrow">Related tools</p>
          <h2 id="related-title">More online PDF tools from CloudPDF.</h2>
        </div>
        <div class="seo-link-grid">${relatedLinks}</div>
      </section>
      ${
        relatedGuides
          ? `<section class="seo-section" aria-labelledby="related-guides-title">
        <div class="section-heading">
          <p class="eyebrow">Keyword guides</p>
          <h2 id="related-guides-title">Focused ${escapeHtml(tool.name)} workflows.</h2>
        </div>
        <div class="seo-link-grid">${relatedGuides}</div>
      </section>`
          : ""
      }
    </main>
    ${buildFooter()}
    <script>
      (() => {
        const themeToggle = document.querySelector("#theme-toggle");
        const applyTheme = (theme) => {
          document.documentElement.dataset.theme = theme;
          localStorage.setItem("cloudpdf.theme", theme);
          document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#10131a" : "#fffaf2");
          if (!themeToggle) return;
          const isDark = theme === "dark";
          themeToggle.setAttribute("aria-pressed", String(isDark));
          themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
          const label = themeToggle.querySelector("strong");
          if (label) label.textContent = isDark ? "Dark" : "Light";
        };
        applyTheme(document.documentElement.dataset.theme || "light");
        for (const link of document.querySelectorAll("[data-initial-tool]")) {
          link.addEventListener("click", () => {
            localStorage.setItem("cloudpdf.initialTool", link.dataset.initialTool || "merge");
          });
        }
        themeToggle?.addEventListener("click", () => {
          applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
        });
        for (const target of document.querySelectorAll(".tilt-card, .seo-link-grid a")) {
          target.addEventListener("pointermove", (event) => {
            const rect = target.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            target.style.setProperty("--tilt-x", (-y * 12).toFixed(2) + "deg");
            target.style.setProperty("--tilt-y", (x * -12).toFixed(2) + "deg");
            target.style.setProperty("--lift-x", (-x * 12).toFixed(1) + "px");
            target.style.setProperty("--lift-y", (-y * 12).toFixed(1) + "px");
          });
          target.addEventListener("pointerleave", () => {
            target.style.removeProperty("--tilt-x");
            target.style.removeProperty("--tilt-y");
            target.style.removeProperty("--lift-x");
            target.style.removeProperty("--lift-y");
          });
        }
      })();
    </script>
  </body>
</html>
`;
}

function buildTrustPage(page) {
  const url = `${siteUrl}/${page.slug}/`;
  const jsonLd = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      name: page.heading,
      url,
      description: page.description,
      isPartOf: { "@id": `${siteUrl}/#website` },
    },
    null,
    2
  );
  return buildSimplePage({
    url,
    title: page.title,
    description: page.description,
    eyebrow: page.eyebrow,
    heading: page.heading,
    body: page.body,
    jsonLd,
  });
}

function buildMergePdfOnlineFreeNoLimitPage(page) {
  const url = `${siteUrl}/${page.slug}/`;
  const toolUrl = `${siteUrl}/tools/merge-pdf/`;
  const metaTitle = "Merge PDF Online Free - No Limit | CloudPDF";
  const metaDescription = "Merge PDF online free with CloudPDF. Combine PDF files fast, reorder documents, and download one clean PDF in your browser.";
  const faqs = [
    {
      question: "How do I merge PDF files for free?",
      answer: "Open the CloudPDF Merge PDF tool, upload your PDF files, arrange the order, click Merge, and download the combined document.",
    },
    {
      question: "Is there a file size limit?",
      answer: "CloudPDF is designed for everyday PDF merging in the browser. Very large files can depend on your device memory, browser, and network conditions.",
    },
    {
      question: "Can I merge PDFs on mobile?",
      answer: "Yes. The online PDF merger works in modern mobile browsers, so you can combine PDF files from a phone or tablet.",
    },
    {
      question: "Do I need to create an account?",
      answer: "No account is required for the basic merge workflow. You can open the tool and start combining files directly.",
    },
    {
      question: "Is my data secure?",
      answer: "The workflow is built for private, browser-based processing where possible. Always use the HTTPS website and avoid uploading documents you are not allowed to process online.",
    },
    {
      question: "Does merging affect quality?",
      answer: "Merging normally keeps the original PDF pages intact. Review the downloaded file to confirm page order, readability, and formatting.",
    },
    {
      question: "Can I reorder pages?",
      answer: "You can arrange files before merging. For page-level rearranging, use split, remove pages, or organize tools before creating the final PDF.",
    },
    {
      question: "How long are files stored?",
      answer: "CloudPDF focuses on a browser workspace rather than long-term document storage. Close the session and clear downloads when handling sensitive files.",
    },
    {
      question: "Can I merge password-protected PDFs?",
      answer: "Password-protected PDFs may need to be unlocked first. If a file cannot be read by the browser, remove the protection with permission from the document owner.",
    },
    {
      question: "Is the tool completely free?",
      answer: "The Merge PDF Online Free workflow is available without a mandatory signup step for normal document merging tasks.",
    },
  ];
  const jsonLd = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${url}#webpage`,
          name: "Merge PDF Online Free - No Limit",
          url,
          description: metaDescription,
          isPartOf: { "@id": `${siteUrl}/#website` },
        },
        {
          "@type": "Article",
          "@id": `${url}#article`,
          headline: "Merge PDF Online Free - No Limit: The Fastest Way to Combine PDF Files",
          description: metaDescription,
          author: { "@type": "Organization", name: "CloudPDF" },
          publisher: { "@id": `${siteUrl}/#organization` },
          mainEntityOfPage: { "@id": `${url}#webpage` },
          image: `${siteUrl}/assets/cloudpdf-logo.png`,
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${url}#breadcrumbs`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
            { "@type": "ListItem", position: 2, name: "Merge PDF", item: toolUrl },
            { "@type": "ListItem", position: 3, name: "Merge PDF Online Free", item: url },
          ],
        },
        {
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        },
      ],
    },
    null,
    2
  );

  const faqMarkup = faqs
    .map(
      (faq) => `<article class="faq-item">
            <h3>${escapeHtml(faq.question)}</h3>
            <p>${escapeHtml(faq.answer)}</p>
          </article>`
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${metaTitle}</title>
    <meta name="description" content="${metaDescription}" />
    <meta name="keywords" content="Merge PDF Online Free, combine PDF files, PDF merger online, merge PDFs free, online PDF merger, PDF combine tool, merge PDF without software" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${metaTitle}" />
    <meta property="og:description" content="${metaDescription}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:site_name" content="CloudPDF" />
    <meta property="og:image" content="${siteUrl}/assets/cloudpdf-logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${metaTitle}" />
    <meta name="twitter:description" content="${metaDescription}" />
    <meta name="twitter:image" content="${siteUrl}/assets/cloudpdf-logo.png" />
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
    ${buildStylesHead()}
    ${buildGoogleTagHead()}
    ${buildAdsenseHead()}
    ${buildGoogleSearchConsoleHead()}
    <script type="application/ld+json">${jsonLd}</script>
  </head>
  <body>
    <main class="simple-page">
      <section class="hero simple-hero">
        <a class="breadcrumb" href="/">CloudPDF</a>
        <p class="eyebrow">PDF combine tool</p>
        <h1 id="page-title">Merge PDF Online Free – No Limit: The Fastest Way to Combine PDF Files</h1>
        <p class="hero-copy">Combine PDF files into one organized document with a fast online PDF merger built for students, teams, freelancers, and everyday document work.</p>
        <div class="hero-actions">
          <a class="primary-action" href="/tools/merge-pdf/">Merge PDF Online Free</a>
          <a class="secondary-action" href="/#tools">View all PDF tools</a>
        </div>
      </section>

      <article class="seo-section" aria-labelledby="intro-title">
        <div class="section-heading">
          <p class="eyebrow">Guide</p>
          <h2 id="intro-title">A simple way to combine PDF files.</h2>
          <p>PDF merging means taking two or more PDF files and joining them into a single document. Instead of sending separate attachments, renaming files again and again, or asking someone to open documents in the correct order, you create one clean PDF that is easier to share, review, print, archive, and upload. That is why a Merge PDF Online Free tool is useful for daily work.</p>
          <p>Students use PDF merging to combine notes, assignments, references, and scanned pages. Business professionals combine proposals, invoices, reports, and supporting documents. HR teams merge resumes, ID proofs, offer letters, and onboarding forms. Legal professionals often need one organized file for contracts, exhibits, affidavits, or case material. Freelancers use an online PDF merger to deliver polished client work without expensive desktop software.</p>
          <p>The best part is convenience. With a PDF merger online, you can upload files, arrange their order, merge PDFs free, and download the final document from your browser. It keeps the task focused: no software installation, no complicated editor, and no unnecessary steps between you and the finished file.</p>
        </div>
        <div class="mini-card">
          <h3>Featured image suggestion</h3>
          <p>User combining multiple PDF files into a single document on a laptop.</p>
          <p><strong>Alt text:</strong> Merge PDF online free tool interface.</p>
        </div>
      </article>

      <section class="seo-section" aria-labelledby="what-title">
        <div class="section-heading">
          <p class="eyebrow">Definition</p>
          <h2 id="what-title">What Is a PDF Merger?</h2>
          <p>A PDF merger is a tool that combines separate PDF documents into one file. It keeps the pages from each source file and places them together in the order you choose. A good PDF combine tool makes this easy: select files, reorder them if needed, merge, and download the result.</p>
          <h3>How PDF merging works</h3>
          <p>When you merge PDF without software, the tool reads the structure of each selected PDF, copies the pages, and builds a new combined document. The text, images, page size, and formatting are generally preserved because merging does not require rewriting the document content. It simply organizes pages from multiple files into one output PDF.</p>
          <h3>Why PDF remains the preferred document format</h3>
          <p>PDF is still the standard format for official documents because it looks consistent across devices. A PDF can preserve fonts, layouts, images, tables, forms, and signatures better than many editable formats. It is also accepted by schools, banks, job portals, government sites, legal teams, and business platforms. When you combine PDF files, you keep the reliability of PDF while making the document easier to manage.</p>
        </div>
      </section>

      <section class="seo-section" aria-labelledby="why-merge-title">
        <div class="section-heading">
          <p class="eyebrow">Reasons</p>
          <h2 id="why-merge-title">Why Merge PDF Files?</h2>
          <p>People merge PDF files because separate documents are easy to lose, send in the wrong order, or misunderstand. One combined file gives the recipient a clear path from the first page to the last page.</p>
          <ul class="check-list">
            <li><strong>Organize documents:</strong> Keep related pages, attachments, and records in one place.</li>
            <li><strong>Simplify sharing:</strong> Send one PDF instead of several attachments.</li>
            <li><strong>Reduce confusion:</strong> Control the reading order and avoid missing files.</li>
            <li><strong>Create professional reports:</strong> Combine cover pages, analysis, charts, and appendices.</li>
            <li><strong>Combine contracts and invoices:</strong> Deliver agreements, payment records, and supporting files together.</li>
          </ul>
          <p><strong>Suggested image:</strong> Business documents merging into one PDF.</p>
          <p><strong>Alt text:</strong> Multiple PDF documents merged into a single file.</p>
        </div>
      </section>

      <section class="seo-section" aria-labelledby="benefits-title">
        <div class="section-heading">
          <p class="eyebrow">Benefits</p>
          <h2 id="benefits-title">Benefits of Using an Online PDF Merger</h2>
          <p>An online PDF merger is built for speed. You do not need to install a heavy desktop app, learn a full editing suite, or wait until you are back at a work computer. Open the browser, select the files, and create the final PDF.</p>
          <ul class="check-list">
            <li><strong>No software installation:</strong> Merge PDF without software directly in your browser.</li>
            <li><strong>Works on all devices:</strong> Use CloudPDF on laptops, desktops, tablets, and mobile browsers.</li>
            <li><strong>Fast processing:</strong> Combine routine PDF files quickly and download the output.</li>
            <li><strong>Secure file handling:</strong> Use a focused workspace and review sensitive documents before processing.</li>
            <li><strong>Free to use:</strong> Start the Merge PDF Online Free workflow without buying a desktop license.</li>
            <li><strong>No registration required:</strong> Basic merging does not need an account barrier.</li>
          </ul>
        </div>
      </section>

      <section class="seo-section" aria-labelledby="how-title">
        <div class="section-heading">
          <p class="eyebrow">Steps</p>
          <h2 id="how-title">How to Merge PDF Files Online</h2>
          <h3>Step 1: Upload PDF Files</h3>
          <p>Open the Merge PDF tool and choose the PDF files you want to combine. Use clear filenames when possible, especially if the documents are part of a report, assignment, or client package.</p>
          <h3>Step 2: Arrange File Order</h3>
          <p>Place the PDFs in the order you want them to appear. For example, a business report might start with a cover page, then the main report, then charts, invoices, and supporting documents.</p>
          <h3>Step 3: Click Merge</h3>
          <p>Start the merge process. The PDF combine tool creates one document from your selected files. Keep the browser tab open until processing is complete.</p>
          <h3>Step 4: Download Combined PDF</h3>
          <p>Download the merged file and open it once before sharing. Check page order, page count, readability, and file name. A final review prevents simple mistakes from reaching a teacher, client, HR manager, or court filing team.</p>
          <p><strong>Suggested screenshot/image:</strong> PDF upload and merge process.</p>
          <p><strong>Alt text:</strong> How to merge PDF files online.</p>
        </div>
      </section>

      <section class="seo-section" aria-labelledby="features-title">
        <div class="section-heading">
          <p class="eyebrow">Features</p>
          <h2 id="features-title">Key Features of Our PDF Merge Tool</h2>
          <p>CloudPDF is made for people who need practical PDF tools without turning a small task into a project. The merge workspace is direct, browser-based, and easy to understand.</p>
          <ul class="check-list">
            <li><strong>Unlimited merging workflow:</strong> Combine documents without a complicated account flow.</li>
            <li><strong>No unnecessary file-count barrier:</strong> Add the PDFs you need for a normal merge task, subject to browser and device limits.</li>
            <li><strong>High-quality output:</strong> Keep original pages readable and organized.</li>
            <li><strong>Secure processing habits:</strong> Work from the official HTTPS website and download the file when finished.</li>
            <li><strong>Mobile-friendly:</strong> Merge PDFs free from a phone when you are away from your desk.</li>
            <li><strong>Browser-based tool:</strong> No installer, no updates, and no complex setup.</li>
            <li><strong>Fast download:</strong> Save the combined PDF and continue with your submission or sharing workflow.</li>
          </ul>
        </div>
      </section>

      <section class="seo-section" aria-labelledby="use-cases-title">
        <div class="section-heading">
          <p class="eyebrow">Use cases</p>
          <h2 id="use-cases-title">Use Cases for PDF Merging</h2>
          <h3>For Students</h3>
          <p>Students can combine lecture notes, scanned homework, research sources, project pages, and assignment sheets into one submission. A single PDF is easier for teachers to open and grade.</p>
          <h3>For Businesses</h3>
          <p>Business teams can merge proposals, product sheets, financial summaries, performance reports, invoices, and meeting notes. This creates a professional package for clients and internal teams.</p>
          <h3>For HR Departments</h3>
          <p>HR teams often collect resumes, ID documents, contracts, policy acknowledgments, and onboarding forms. One organized PDF can make employee records easier to review.</p>
          <h3>For Legal Teams</h3>
          <p>Legal professionals may need to combine contracts, exhibits, correspondence, signed pages, and supporting records. Merging helps keep related material together in a clear sequence.</p>
          <h3>For Freelancers</h3>
          <p>Freelancers can combine estimates, work samples, signed agreements, invoices, receipts, and final deliverables. A polished single PDF can make client communication feel more professional.</p>
        </div>
      </section>

      <section class="seo-section" aria-labelledby="safe-title">
        <div class="section-heading">
          <p class="eyebrow">Safety</p>
          <h2 id="safe-title">Is It Safe to Merge PDFs Online?</h2>
          <p>Safety depends on the website, the document, and your own handling habits. Use the official CloudPDF HTTPS URL, keep your browser updated, and avoid processing documents you are not authorized to upload or edit. For highly confidential legal, medical, financial, or government records, follow your organization&apos;s policy before using any online PDF merger.</p>
          <p>CloudPDF is designed around a focused browser workspace instead of long-term cloud storage. That helps reduce friction and keeps the process simple. Still, users should download the result, review it locally, and clear sensitive files from shared computers after the task is complete.</p>
          <ul class="check-list">
            <li><strong>Data encryption:</strong> Use the HTTPS version of the website for encrypted browser communication.</li>
            <li><strong>Automatic cleanup mindset:</strong> Do not leave sensitive downloads on shared devices.</li>
            <li><strong>Privacy protection:</strong> Rename files carefully and remove unnecessary personal information before sharing.</li>
            <li><strong>Secure servers and browsers:</strong> Use trusted networks and updated browsers for document work.</li>
          </ul>
          <p><strong>Suggested image:</strong> Secure cloud and encrypted PDF files.</p>
          <p><strong>Alt text:</strong> Secure PDF processing and encryption.</p>
        </div>
      </section>

      <section class="seo-section" aria-labelledby="comparison-title">
        <div class="section-heading">
          <p class="eyebrow">Comparison</p>
          <h2 id="comparison-title">Online PDF Merger vs Desktop Software</h2>
          <table class="preview-table">
            <thead>
              <tr>
                <th>Factor</th>
                <th>Online PDF Merger</th>
                <th>Desktop Software</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cost</td>
                <td>Often free for common merge tasks</td>
                <td>May require a paid license</td>
              </tr>
              <tr>
                <td>Installation</td>
                <td>No installation needed</td>
                <td>Requires download and setup</td>
              </tr>
              <tr>
                <td>Speed</td>
                <td>Fast for everyday files</td>
                <td>Fast after setup, but heavier to start</td>
              </tr>
              <tr>
                <td>Accessibility</td>
                <td>Available from any modern browser</td>
                <td>Limited to installed devices</td>
              </tr>
              <tr>
                <td>Ease of use</td>
                <td>Simple upload, reorder, merge, download flow</td>
                <td>More features, but often more complexity</td>
              </tr>
              <tr>
                <td>Device compatibility</td>
                <td>Works on desktop and mobile browsers</td>
                <td>Depends on operating system support</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="seo-section" aria-labelledby="tips-title">
        <div class="section-heading">
          <p class="eyebrow">Best practices</p>
          <h2 id="tips-title">Tips for Better PDF Management</h2>
          <ol class="step-list">
            <li>Rename files before merging so the order is easy to understand.</li>
            <li>Place cover pages, summaries, or signed forms at the beginning when needed.</li>
            <li>Remove duplicate pages before creating the final PDF.</li>
            <li>Compress the final file if an upload portal has a size limit.</li>
            <li>Open the merged PDF and check every important section before sending.</li>
            <li>Use clear final filenames such as client-report-final.pdf or assignment-complete.pdf.</li>
            <li>Keep an original copy of each source PDF in case you need to rebuild the file.</li>
            <li>Use bookmarks or page numbers for long reports when possible.</li>
            <li>Avoid merging unrelated confidential files into the same document.</li>
            <li>Store the final PDF in the correct folder immediately after download.</li>
          </ol>
        </div>
      </section>

      <section class="seo-section" aria-labelledby="faq-title">
        <div class="section-heading">
          <p class="eyebrow">FAQ</p>
          <h2 id="faq-title">Frequently Asked Questions</h2>
        </div>
        <div class="faq-grid">
          ${faqMarkup}
        </div>
      </section>

      <section class="seo-section" aria-labelledby="seo-notes-title">
        <div class="section-heading">
          <p class="eyebrow">SEO notes</p>
          <h2 id="seo-notes-title">Recommended Search Metadata and Images</h2>
          <ul class="check-list">
            <li><strong>Meta title:</strong> ${metaTitle}</li>
            <li><strong>Meta description:</strong> ${metaDescription}</li>
            <li><strong>URL slug:</strong> /merge-pdf-online-free-no-limit/</li>
            <li><strong>Primary keyword:</strong> Merge PDF Online Free</li>
            <li><strong>Secondary keywords:</strong> Combine PDF files, PDF merger online, Merge PDFs free, Online PDF merger, PDF combine tool, Merge PDF without software.</li>
            <li><strong>Image placement:</strong> Use the laptop merge interface image near the introduction, the business document merge image in the "Why Merge PDF Files?" section, the upload process screenshot in the step-by-step section, and the secure cloud image in the safety section.</li>
          </ul>
        </div>
      </section>

      <section class="seo-section" aria-labelledby="conclusion-title">
        <div class="section-heading">
          <p class="eyebrow">Conclusion</p>
          <h2 id="conclusion-title">Merge PDFs faster with CloudPDF.</h2>
          <p>A Merge PDF Online Free tool is one of the most useful document shortcuts for modern work. It helps you combine PDF files into a single, organized document that is easier to send, upload, review, and store. Whether you are a student preparing an assignment, a business professional sending a report, an HR team organizing employee records, a legal professional preparing document sets, or a freelancer delivering client files, one clean PDF can save time and reduce mistakes.</p>
          <p>CloudPDF keeps the process simple: upload your PDFs, arrange the order, merge, and download the finished document. You can merge PDF without software, avoid a complicated account flow, and work from a browser on desktop or mobile. For best results, review your final file before sharing and follow sensible privacy practices when handling sensitive documents. Ready to create one polished PDF? Open the online PDF merger and combine your files now.</p>
          <div class="hero-actions">
            <a class="primary-action" href="/tools/merge-pdf/">Merge PDFs free</a>
            <a class="secondary-action" href="/tools/compress-pdf/">Compress PDF after merging</a>
          </div>
        </div>
      </section>
    </main>
    ${buildFooter()}
  </body>
</html>
`;
}

function buildLongTailPage(page) {
  if (page.slug === "merge-pdf-online-free-no-limit") {
    return buildMergePdfOnlineFreeNoLimitPage(page);
  }

  const isAnimationGuide = page.slug === "powerpoint-to-pdf-without-losing-animations";
  const url = `${siteUrl}/${page.slug}/`;
  const toolUrl = `${siteUrl}/tools/${page.toolSlug}/`;
  const visuals = getLongTailVisuals(page);
  const relatedPages = longTailPages
    .filter((item) => item.slug !== page.slug && item.toolSlug === page.toolSlug)
    .slice(0, 6);
  const relatedPageLinks = relatedPages
    .map((item) => `<a href="/${item.slug}/">${escapeHtml(item.heading)}</a>`)
    .join("");
  const faqs = [
    ...(isAnimationGuide
      ? [
          {
            question: "Can a PDF keep PowerPoint animations?",
            answer: "A standard PDF cannot play PowerPoint animation timelines. The reliable workaround is to export each animation step as a separate slide or page, or share a video when movement must remain playable.",
          },
          {
            question: "How do I make animated PowerPoint slides readable as a PDF?",
            answer: "Duplicate the slide for each build step, reveal one additional element per duplicate slide, then convert the deck to PDF so each animation state becomes its own PDF page.",
          },
          {
            question: "Should I use PDF or video for an animated presentation?",
            answer: "Use PDF for printable handouts, email attachments, LMS uploads, and review copies. Use video or PowerPoint when timing, motion paths, audio, or automatic playback matter.",
          },
        ]
      : [
          {
            question: `What is the fastest way to ${page.heading.toLowerCase()}?`,
            answer: `Open ${page.toolName}, choose your file, use the available settings, and download the result after checking the output.`,
          },
          {
            question: `Is ${page.heading.toLowerCase()} free on CloudPDF?`,
            answer: `CloudPDF provides this workflow through the free ${page.toolName} page without a mandatory signup step.`,
          },
          {
            question: "What should I check before submitting the file?",
            answer: "Review page order, formatting, file size, readability, and any sensitive information before sharing or uploading the final document.",
          },
        ]),
  ];
  const jsonLd = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${url}#webpage`,
          name: page.heading,
          url,
          description: page.description,
          keywords: (page.keywords ?? [page.primaryKeyword, page.toolName, page.heading]).filter(Boolean).join(", "),
          inLanguage: "en",
          isPartOf: { "@id": `${siteUrl}/#website` },
        },
        {
          "@type": "Article",
          "@id": `${url}#article`,
          headline: page.heading,
          description: page.description,
          author: { "@type": "Organization", name: "CloudPDF" },
          publisher: { "@id": `${siteUrl}/#organization` },
          mainEntityOfPage: { "@id": `${url}#webpage` },
          datePublished: page.publishedAt ?? defaultPublishedDate,
          dateModified: page.modifiedAt ?? defaultModifiedDate,
          image: `${siteUrl}${visuals.hero.src.replace(/\?.*$/, "")}`,
          articleSection: "PDF conversion guides",
          keywords: (page.keywords ?? [page.primaryKeyword, page.toolName, page.heading]).filter(Boolean).join(", "),
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${url}#breadcrumbs`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
            { "@type": "ListItem", position: 2, name: page.toolName, item: toolUrl },
            { "@type": "ListItem", position: 3, name: page.heading, item: url },
          ],
        },
        {
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        },
      ],
    },
    null,
    2
  );
  const lowerHeading = page.heading.toLowerCase();
  const body = isAnimationGuide
    ? [
        "PDF is excellent for sharing a stable slide handout, but it does not run PowerPoint's animation engine. That means entrances, exits, motion paths, timings, audio cues, and trigger-based effects usually become static once the deck is converted.",
        "The practical solution is to decide what the PDF needs to preserve: the final slide only, every build step as separate pages, speaker handouts, or a video-like version of the presentation. Once that choice is clear, conversion becomes much more predictable.",
        "This guide explains the safe workflow for class slides, client decks, and presentation handouts, then links directly to the PowerPoint to PDF tool when you are ready to create the PDF copy.",
      ]
    : [
        `If you are trying to ${lowerHeading}, you are usually not looking for another complicated PDF editor. You just need a clean way to handle the file, check the result, and move on.`,
        `This guide walks through the practical version of that workflow: what to prepare, when ${page.toolName} is the right starting point, and what to review before you send, upload, or archive the finished document.`,
        `The examples below are written for real situations like ${page.useCases.join(", ").toLowerCase()}, where a small formatting mistake or oversized file can slow everything down.`,
      ];
  const animationGuideExtra = isAnimationGuide
    ? `<section class="seo-section" aria-labelledby="animation-reality-title">
        <div class="section-heading">
          <p class="eyebrow">Important limitation</p>
          <h2 id="animation-reality-title">A PDF can show animation steps, but it cannot play PowerPoint animations.</h2>
          <p>When PowerPoint exports to PDF, each slide is flattened into page content. The PDF can keep text, images, shapes, speaker-friendly layout, and slide order, but it does not preserve the PowerPoint animation timeline as interactive motion.</p>
          <p>For most handouts, that is fine. For a slide where bullet points appear one by one, duplicate the slide several times and reveal one additional bullet on each duplicate. The resulting PDF will show the build sequence page by page, which is readable for students, reviewers, and clients.</p>
        </div>
        <div class="faq-grid">
          <article><h4>Best for PDF</h4><p>Use PDF when the audience needs a printable, searchable, easy-to-share copy of the deck.</p></article>
          <article><h4>Best for video</h4><p>Use video when exact timing, audio, transitions, or motion paths need to play automatically.</p></article>
          <article><h4>Best for PowerPoint</h4><p>Share the original PPTX when the recipient needs to edit slides or present with live animations.</p></article>
        </div>
      </section>
      <section class="seo-section" aria-labelledby="animation-steps-title">
        <div class="section-heading">
          <p class="eyebrow">Recommended workflow</p>
          <h2 id="animation-steps-title">How to convert animated PowerPoint slides to a useful PDF.</h2>
        </div>
        <div class="faq-grid">
          <article><h4>1. Review animated slides</h4><p>Find slides that depend on builds, reveal effects, motion paths, audio, or timed transitions. Decide whether the final state is enough or each step needs a separate PDF page.</p></article>
          <article><h4>2. Duplicate build states</h4><p>For important reveal animations, duplicate the slide and manually show the next item on each copy. This creates a clean page-by-page reading order after conversion.</p></article>
          <article><h4>3. Convert and inspect</h4><p>Convert the deck to PDF, then check slide order, text readability, charts, speaker notes, and any slide that originally had animation.</p></article>
        </div>
      </section>`
    : "";
  const extra = `${animationGuideExtra}<section class="seo-section blog-section" aria-labelledby="why-title">
        <div class="blog-split">
        <div class="section-heading">
          <p class="eyebrow">Why it matters</p>
          <h2 id="why-title">A small PDF task can still waste time.</h2>
          <p>Most PDF jobs are simple until the destination has a rule: a size limit, a required format, one file instead of many, readable text, or pages in the correct order. A focused browser workflow keeps the job small. Open the right tool, work from the original file, download the output, and inspect it before using it anywhere important.</p>
          <p>For ${escapeHtml(page.heading)}, the main goal is to ${escapeHtml(page.intent)} without adding extra steps. CloudPDF keeps the related tool close so you can read the guidance, then start the actual file work on the matching workspace page.</p>
        </div>
        ${buildBlogFigure(visuals.why)}
        </div>
      </section>
      <section class="seo-section blog-section" aria-labelledby="steps-title">
        <div class="blog-split blog-split-reverse">
        ${buildBlogFigure(visuals.steps)}
        <div>
        <div class="section-heading">
          <p class="eyebrow">Step by step</p>
          <h2 id="steps-title">How to handle this workflow cleanly.</h2>
        </div>
        <div class="faq-grid">
          <article><h4>1. Start with the best source file</h4><p>Use the original PDF, document, image, or scan when you can. A cleaner source usually gives a cleaner result, especially for conversion, compression, splitting, and page edits.</p></article>
          <article><h4>2. Open ${escapeHtml(page.toolName)}</h4><p>The related tool is built for this job, so you do not have to search through a large editor. Choose the file, review the available settings, and process it in the browser workspace.</p></article>
          <article><h4>3. Check the output before sharing</h4><p>Open the downloaded file and look at page order, formatting, file size, readability, and any private information. This last check is the difference between a quick fix and a second round of rework.</p></article>
        </div>
        </div>
        </div>
      </section>
      <section class="seo-section blog-section" aria-labelledby="use-cases-title">
        <div class="blog-split">
        <div>
        <div class="section-heading">
          <p class="eyebrow">Use cases</p>
          <h2 id="use-cases-title">When this guide is useful.</h2>
          <p>These are common moments where a focused ${escapeHtml(page.toolName)} workflow is faster than opening a full desktop editor or starting the document from scratch.</p>
        </div>
        <div class="faq-grid">${page.useCases.map((item) => `<article><h4>${escapeHtml(item)}</h4><p>This workflow helps when you need a file that is easier to review, submit, share, or keep organized without changing the original more than necessary.</p></article>`).join("")}</div>
        </div>
        ${buildBlogFigure(visuals.useCases)}
        </div>
      </section>
      <section class="seo-section" aria-labelledby="tool-link-title">
        <div class="section-heading">
          <p class="eyebrow">Do the file work</p>
          <h2 id="tool-link-title">Open ${escapeHtml(page.toolName)} when you are ready.</h2>
          <p>The guide gives you the checklist; the tool page is where the actual upload, processing, and download happen. Your source file stays selected only for the browser session.</p>
          <p><a class="button primary" href="/tools/${escapeHtml(page.toolSlug)}/">Open ${escapeHtml(page.toolName)}</a></p>
        </div>
      </section>
      <section class="seo-section blog-section" aria-labelledby="quality-title">
        <div class="blog-split blog-split-reverse">
        ${buildBlogFigure(visuals.quality)}
        <div class="section-heading">
          <p class="eyebrow">Before you finish</p>
          <h2 id="quality-title">A quick quality check saves headaches.</h2>
          <p>Before submitting the final file, scan the first page, the last page, and any page with a table, signature, image, or form field. If the destination has a size limit or format requirement, confirm that too. For sensitive files, make sure the output does not reveal information you meant to remove.</p>
        </div>
        </div>
      </section>
      <section class="seo-section" aria-labelledby="faq-title">
        <div class="section-heading">
          <p class="eyebrow">FAQ</p>
          <h2 id="faq-title">${escapeHtml(page.heading)} questions.</h2>
        </div>
        <div class="faq-grid">${faqs.map((faq) => `<article><h4>${escapeHtml(faq.question)}</h4><p>${escapeHtml(faq.answer)}</p></article>`).join("")}</div>
      </section>
      ${
        relatedPageLinks
          ? `<section class="seo-section" aria-labelledby="related-keyword-title">
        <div class="section-heading">
          <p class="eyebrow">Related keyword pages</p>
          <h2 id="related-keyword-title">More ${escapeHtml(page.toolName)} workflows.</h2>
        </div>
        <div class="seo-link-grid">${relatedPageLinks}</div>
      </section>`
          : ""
      }`;

  return buildSimplePage({
    url,
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    eyebrow: "Long-tail PDF workflow",
    heading: page.heading,
    body,
    jsonLd,
    extra,
    heroImage: visuals.hero,
    primaryAction: { href: `/tools/${page.toolSlug}/`, label: `Open ${page.toolName}` },
  });
}

function getLongTailVisuals(page) {
  if (page.slug === "powerpoint-to-pdf-without-losing-animations") {
    return {
      hero: {
        src: "/assets/blog-powerpoint-pdf-animation.svg",
        alt: "Animated PowerPoint slide states converted into separate PDF pages",
        caption: "PDFs can preserve animation steps as separate pages, but not live PowerPoint motion.",
      },
      why: {
        src: "/assets/blog-powerpoint-pdf-animation.svg",
        alt: "PowerPoint animation timeline becoming static PDF pages",
        caption: "Flattened PDF pages are reliable for handouts and review copies.",
      },
      steps: {
        src: "/assets/blog-powerpoint-pdf-animation.svg",
        alt: "Three step workflow for exporting animated PowerPoint slides to PDF",
        caption: "Duplicate build states, convert the deck, and inspect the PDF output.",
      },
      useCases: {
        src: "/assets/blog-powerpoint-pdf-animation.svg",
        alt: "Presentation handout PDF for class slides and client decks",
        caption: "Useful for classes, client reviews, and shareable presentation handouts.",
      },
      quality: {
        src: "/assets/blog-powerpoint-pdf-animation.svg",
        alt: "Checklist for reviewing converted PowerPoint PDF pages",
        caption: "Check animated slides carefully after conversion.",
      },
    };
  }

  if (page.slug === "convert-pdf-to-word-without-losing-formatting") {
    return {
      hero: {
        src: "/assets/blog-pdf-word-hero.svg",
        alt: "PDF to Word conversion layout preview on laptop and mobile screens",
        caption: "Convert PDF pages into a Word-compatible document while checking layout on every device.",
      },
      why: {
        src: "/assets/blog-pdf-word-layout.svg",
        alt: "PDF page layout converting into editable Word document blocks",
        caption: "Formatting checks help preserve headings, columns, images, and readable spacing.",
      },
      steps: {
        src: "/assets/blog-pdf-word-steps.svg",
        alt: "Three step PDF to Word workflow showing upload convert and download",
        caption: "Upload the source PDF, convert it, then review the Word-compatible download.",
      },
      useCases: {
        src: "/assets/blog-pdf-word-devices.svg",
        alt: "PDF to Word workflow shown on desktop tablet and phone",
        caption: "The guide is aligned for desktop reading and stacks cleanly on phones.",
      },
      quality: {
        src: "/assets/blog-pdf-word-quality.svg",
        alt: "Document quality checklist for converted Word file",
        caption: "Check key pages before sending the converted document.",
      },
    };
  }

  return {
    hero: {
      src: "/assets/cloudpdf-logo.svg?v=1",
      alt: `${page.toolName} guide visual`,
      caption: `${page.toolName} workflow guide for faster PDF tasks.`,
    },
    why: {
      src: "/assets/cloudpdf-logo.svg?v=1",
      alt: `${page.toolName} document workflow visual`,
      caption: "Keep the document workflow focused and easy to review.",
    },
    steps: {
      src: "/assets/cloudpdf-logo.svg?v=1",
      alt: `${page.toolName} step by step workflow visual`,
      caption: "Use a simple upload, process, and download workflow.",
    },
    useCases: {
      src: "/assets/cloudpdf-logo.svg?v=1",
      alt: `${page.toolName} use cases visual`,
      caption: "Useful for school, business, freelance, and everyday document work.",
    },
    quality: {
      src: "/assets/cloudpdf-logo.svg?v=1",
      alt: `${page.toolName} quality check visual`,
      caption: "Review the output before sharing or uploading it.",
    },
  };
}

function buildBlogFigure(visual) {
  return `<figure class="blog-image">
          <img src="${escapeHtml(visual.src)}" alt="${escapeHtml(visual.alt)}" loading="lazy" width="920" height="620" />
          <figcaption>${escapeHtml(visual.caption)}</figcaption>
        </figure>`;
}

function buildSimplePage({ url, title, description, keywords = [], eyebrow, heading, body, jsonLd, extra = "", heroImage = null, primaryAction = null }) {
  const shareImage = heroImage ? `${siteUrl}${heroImage.src.replace(/\?.*$/, "")}` : `${siteUrl}/assets/cloudpdf-logo.png`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    ${keywords.length ? `<meta name="keywords" content="${escapeHtml(keywords.join(", "))}" />` : ""}
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="theme-color" content="#fffaf2" />
    ${buildGoogleTagHead()}
    ${buildAdsenseHead()}
    ${buildGoogleSearchConsoleHead()}
    <link rel="canonical" href="${url}" />
    <link rel="icon" type="image/svg+xml" href="/assets/cloudpdf-favicon.svg?v=1" />
    <link rel="apple-touch-icon" href="/assets/ourpdf-new-icon.png?v=1" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="CloudPDF" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${shareImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${shareImage}" />
    <script defer src="/theme.js?v=security-v2"></script>
    <script type="application/ld+json">${jsonLd.replace(/</g, "\\u003c")}</script>
    ${buildStylesHead()}
  </head>
  <body>
    <header class="topbar">
      <a class="brand" href="/" aria-label="CloudPDF home">
        <img class="brand-logo" src="/assets/cloudpdf-logo.svg?v=1" alt="" width="56" height="36" aria-hidden="true" decoding="async" />
        <span>CloudPDF</span>
      </a>
      <nav class="nav-links" aria-label="Primary navigation">
        <a href="/#tools">Tools</a>
        <a href="/#pdf-converter">Converters</a>
        <a href="/about/">About</a>
        <a href="/contact/">Contact</a>
      </nav>
      <div class="topbar-actions">
        <a class="primary-link" href="/#workspace">Start</a>
      </div>
    </header>
    <main>
      <section class="hero tool-landing" aria-labelledby="page-title">
        <div class="hero-copy">
          <p class="eyebrow">${escapeHtml(eyebrow)}</p>
          <h1 id="page-title">${escapeHtml(heading)}</h1>
          ${body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          <div class="hero-actions">
            <a class="button primary" href="${escapeHtml(primaryAction?.href ?? "/#tools")}">${escapeHtml(primaryAction?.label ?? "Explore PDF tools")}</a>
            <a class="button secondary" href="/">Home</a>
          </div>
        </div>
        ${heroImage ? buildBlogFigure(heroImage).replace('class="blog-image"', 'class="blog-image blog-hero-image"') : ""}
      </section>
      ${extra}
    </main>
    ${buildFooter()}
  </body>
</html>
`;
}

function buildFooter() {
  return `<footer class="site-footer">
      <div class="footer-main">
        <section class="footer-brand" aria-label="CloudPDF">
          <strong>CloudPDF</strong>
          <p>Professional browser-based PDF tools for fast, private document workflows. Merge, compress, convert, sign, and organize PDFs without unnecessary friction.</p>
          <div class="footer-trust" aria-label="Trust highlights">
            <span>Browser-first processing</span>
            <span>No mandatory signup</span>
            <span>Secure HTTPS</span>
          </div>
        </section>
        <nav class="footer-column" aria-label="Product">
          <h2>Product</h2>
          <a href="/#tools"><span>All PDF tools</span><small>Browse every available workspace.</small></a>
          <a href="/tools/compress-pdf/"><span>Compress PDF</span><small>Reduce file size for sharing and uploads.</small></a>
          <a href="/tools/merge-pdf/"><span>Merge PDF</span><small>Combine documents in the order you choose.</small></a>
          <a href="/tools/pdf-to-word/"><span>PDF to Word</span><small>Create a Word-compatible document.</small></a>
        </nav>
        <nav class="footer-column" aria-label="Company">
          <h2>Company</h2>
          <a href="/about/"><span>About</span><small>Learn how CloudPDF is built and maintained.</small></a>
          <a href="/contact/"><span>Contact</span><small>Send support, privacy, and partnership questions.</small></a>
          <a href="/#faq"><span>FAQ</span><small>Answers for common document workflows.</small></a>
        </nav>
        <nav class="footer-column" aria-label="Legal">
          <h2>Legal</h2>
          <a href="/privacy-policy/"><span>Privacy Policy</span><small>How files, analytics, and browser sessions work.</small></a>
          <a href="/terms/"><span>Terms of Use</span><small>Usage rules, responsibilities, and limitations.</small></a>
        </nav>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2026 CloudPDF. All rights reserved.</span>
        <span>Built for secure, efficient document productivity.</span>
      </div>
    </footer>`;
}

function buildToolFaqs(tool) {
  return [
    {
      question: `Is ${tool.name} free to use?`,
      answer: `Yes. ${tool.name} is available as part of the free CloudPDF browser toolkit.`,
    },
    {
      question: `What is ${tool.name} used for?`,
      answer: `${tool.name} helps users ${tool.intent}.`,
    },
    {
      question: `Do I need to create an account to use ${tool.name}?`,
      answer: "No. The core workspace is built to start without a mandatory signup step.",
    },
    {
      question: `Can I use ${tool.name} on mobile?`,
      answer: "Yes. The pages are responsive and work in modern mobile browsers, though large PDF files are easier to handle on desktop.",
    },
    {
      question: `Are my files stored after using ${tool.name}?`,
      answer: "The static CloudPDF workspace is designed around the current browser session and does not store files in a user account.",
    },
    {
      question: `What file types does ${tool.name} support?`,
      answer: `This page focuses on ${tool.keywords.join(", ")} workflows. The workspace shows the accepted file types before you choose files.`,
    },
    {
      question: `How long does ${tool.name} take?`,
      answer: "Small files usually process quickly. Very large PDFs, image-heavy files, or long documents may take longer depending on your device.",
    },
    {
      question: `Will ${tool.name} change my original file?`,
      answer: "No. The tool creates a downloadable result and leaves your selected source file unchanged.",
    },
    {
      question: `What should I check before sharing the output?`,
      answer: "Open the downloaded file and review page order, formatting, readability, file size, and any sensitive content before sharing it.",
    },
    {
      question: `Which related tools should I try next?`,
      answer: "Common next steps include Compress PDF, Merge PDF, Split PDF, PDF to Word, JPG to PDF, and PDF to JPG depending on your workflow.",
    },
  ];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

