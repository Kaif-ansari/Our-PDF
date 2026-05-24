export const BROWSER_ONLY_SECURITY = {
  maxFileSizeBytes: 10 * 1024 * 1024,
  maxPdfPages: 300,
  maxPdfRenderPixels: 24_000_000,
  storesDocumentBytesServerSide: false,
  requiresAccounts: false,
  requiresSubscriptions: false,
} as const;

export const PRIVACY_MESSAGES = {
  localOnly: "Files are processed locally in your browser.",
  noUpload: "No document bytes are uploaded to this application server.",
  noAccounts: "No account registration is required.",
  noContentRetained: "No file contents are retained.",
} as const;

export const FORBIDDEN_LOG_FIELDS = [
  "uploaded_file_bytes",
  "generated_file_bytes",
  "pdf_content",
  "ocr_text",
  "image_content",
  "preview_content",
  "thumbnail_bytes",
  "file_name",
  "document_name",
  "signed_url",
] as const;
