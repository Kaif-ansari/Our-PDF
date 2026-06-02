import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const output = join(root, "public");
const siteUrl = "https://www.cloudpdf.online";
const builtAt = new Date().toISOString();
const gtmContainerId = "GTM-T7KM2D5G";
const adsensePublisherId = "ca-pub-8501020285416333";

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
    title: "PowerPoint to PDF Without Losing Animations | CloudPDF",
    description: "Convert PowerPoint files to PDF and learn what to check when animations become static PDF pages.",
    heading: "PowerPoint to PDF without losing animations",
    toolSlug: "powerpoint-to-pdf",
    toolName: "PowerPoint to PDF",
    intent: "turn a PowerPoint deck into a shareable PDF copy",
    useCases: ["Class slides", "Client decks", "Presentation handouts"],
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

for (const item of ["index.html", "app.js", "theme.js", "styles.css", "assets", "_headers", "_redirects", "site.webmanifest"]) {
  await cp(join(root, item), join(output, item), { recursive: true });
}

await mkdir(join(output, "vendor"), { recursive: true });
await cp(join(root, "node_modules", "pdf-lib", "dist", "pdf-lib.esm.min.js"), join(output, "vendor", "pdf-lib.esm.min.js"));
await cp(join(root, "node_modules", "jszip", "dist", "jszip.min.js"), join(output, "vendor", "jszip.min.js"));
await cp(join(root, "node_modules", "pdfjs-dist", "build", "pdf.min.mjs"), join(output, "vendor", "pdf.min.mjs"));
await cp(join(root, "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs"), join(output, "vendor", "pdf.worker.min.mjs"));

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

function buildSitemap() {
  const urls = [
    { loc: `${siteUrl}/`, priority: "1.0", changefreq: "weekly" },
    ...toolPages.map((tool) => ({
      loc: `${siteUrl}/tools/${tool.slug}/`,
      priority: tool.slug === "merge-pdf" || tool.slug === "compress-pdf" ? "0.9" : "0.8",
      changefreq: "monthly",
    })),
    ...longTailPages.map((page) => ({
      loc: `${siteUrl}/${page.slug}/`,
      priority: "0.72",
      changefreq: "monthly",
    })),
    ...trustPages.map((page) => ({
      loc: `${siteUrl}/${page.slug}/`,
      priority: page.slug === "about" ? "0.7" : "0.6",
      changefreq: "yearly",
    })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${builtAt}</lastmod>
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

function buildGoogleTagManagerHead() {
  return `<!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmContainerId}');</script>
    <!-- End Google Tag Manager -->`;
}

function buildGoogleTagManagerBody() {
  return `<!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmContainerId}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->`;
}

function buildAdsenseHead() {
  return `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}"
      crossorigin="anonymous"></script>`;
}

function buildAdsTxt() {
  return `google.com, ${adsensePublisherId.replace("ca-pub-", "pub-")}, DIRECT, f08c47fec0942fa0
`;
}

function buildToolPage(tool) {
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
    ${buildGoogleTagManagerHead()}
    ${buildAdsenseHead()}
    <link rel="canonical" href="${url}" />
    <link rel="icon" type="image/png" href="/assets/cloudpdf-favicon.png?v=1" />
    <link rel="apple-touch-icon" href="/assets/cloudpdf-favicon.png?v=1" />
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
    <script defer src="/theme.js?v=security-v1"></script>
    <link rel="stylesheet" href="/styles.css?v=footer-v1" />
    <script defer src="/_vercel/speed-insights/script.js" data-sdkn="@vercel/speed-insights" data-sdkv="2.0.0"></script>
    <script type="application/ld+json">${jsonLd.replace(/</g, "\\u003c")}</script>
  </head>
  <body>
    ${buildGoogleTagManagerBody()}
    <header class="topbar">
      <a class="brand" href="/" aria-label="CloudPDF home">
        <img class="brand-logo" src="/assets/cloudpdf-logo.png?v=1" alt="" width="56" height="36" aria-hidden="true" />
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

function buildLongTailPage(page) {
  const url = `${siteUrl}/${page.slug}/`;
  const toolUrl = `${siteUrl}/tools/${page.toolSlug}/`;
  const relatedPages = longTailPages
    .filter((item) => item.slug !== page.slug && item.toolSlug === page.toolSlug)
    .slice(0, 6);
  const relatedPageLinks = relatedPages
    .map((item) => `<a href="/${item.slug}/">${escapeHtml(item.heading)}</a>`)
    .join("");
  const faqs = [
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
          isPartOf: { "@id": `${siteUrl}/#website` },
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
  const body = [
    `${page.heading} is a specific PDF workflow for people who need to ${page.intent}. Start with the related ${page.toolName} tool, choose your file, use the available settings, and download the result.`,
    `This page is built for a narrow search intent, so it focuses on the real use case instead of duplicating the main tool page. Good fits include ${page.useCases.join(", ").toLowerCase()}.`,
    "After downloading, open the output file and confirm the text, images, page order, and file size match the destination requirement before you submit or share it.",
  ];
  const extra = `<section class="seo-section" aria-labelledby="use-cases-title">
        <div class="section-heading">
          <p class="eyebrow">Use cases</p>
          <h2 id="use-cases-title">When this workflow helps.</h2>
        </div>
        <div class="faq-grid">${page.useCases.map((item) => `<article><h4>${escapeHtml(item)}</h4><p>Use ${escapeHtml(page.toolName)} when this document needs a cleaner, smaller, or more submission-ready PDF workflow.</p></article>`).join("")}</div>
      </section>
      <section class="seo-section" aria-labelledby="tool-link-title">
        <div class="section-heading">
          <p class="eyebrow">Start here</p>
          <h2 id="tool-link-title">Open the related PDF tool.</h2>
          <p><a class="button primary" href="/tools/${escapeHtml(page.toolSlug)}/">Open ${escapeHtml(page.toolName)}</a></p>
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
    eyebrow: "Long-tail PDF workflow",
    heading: page.heading,
    body,
    jsonLd,
    extra,
  });
}

function buildSimplePage({ url, title, description, eyebrow, heading, body, jsonLd, extra = "" }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="theme-color" content="#fffaf2" />
    ${buildGoogleTagManagerHead()}
    ${buildAdsenseHead()}
    <link rel="canonical" href="${url}" />
    <link rel="icon" type="image/png" href="/assets/cloudpdf-favicon.png?v=1" />
    <link rel="apple-touch-icon" href="/assets/cloudpdf-favicon.png?v=1" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="CloudPDF" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${siteUrl}/assets/cloudpdf-logo.png" />
    <script defer src="/theme.js?v=security-v1"></script>
    <script type="application/ld+json">${jsonLd.replace(/</g, "\\u003c")}</script>
    <link rel="stylesheet" href="/styles.css?v=footer-v1" />
  </head>
  <body>
    ${buildGoogleTagManagerBody()}
    <header class="topbar">
      <a class="brand" href="/" aria-label="CloudPDF home">
        <img class="brand-logo" src="/assets/cloudpdf-logo.png?v=1" alt="" width="56" height="36" aria-hidden="true" />
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
          <h3 id="page-title">${escapeHtml(heading)}</h3>
          ${body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          <div class="hero-actions">
            <a class="button primary" href="/#tools">Explore PDF tools</a>
            <a class="button secondary" href="/">Home</a>
          </div>
        </div>
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

