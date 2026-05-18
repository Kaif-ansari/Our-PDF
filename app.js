import { PDFDocument, StandardFonts, rgb, degrees } from "https://cdn.skypack.dev/pdf-lib@1.17.1";
import JSZip from "https://cdn.skypack.dev/jszip@3.10.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

const categories = ["All", "Organize PDF", "Optimize PDF", "Convert PDF", "Edit PDF", "PDF Security", "PDF Intelligence"];

const categoryStyles = {
  "Organize PDF": { icon: "ORG", tone: "teal" },
  "Optimize PDF": { icon: "ZIP", tone: "gold" },
  "Convert PDF": { icon: "CVT", tone: "blue" },
  "Edit PDF": { icon: "EDT", tone: "red" },
  "PDF Security": { icon: "SEC", tone: "ink" },
  "PDF Intelligence": { icon: "AI", tone: "violet" },
};

const tools = [
  {
    id: "merge",
    name: "Merge PDF",
    category: "Organize PDF",
    description: "Combine multiple PDF files in the order you choose.",
    accept: ".pdf,application/pdf",
    multiple: true,
    minFiles: 2,
    options: [],
    run: mergePdf,
  },
  {
    id: "split",
    name: "Split PDF",
    category: "Organize PDF",
    description: "Split every page or custom page ranges into separate PDF files.",
    accept: ".pdf,application/pdf",
    multiple: false,
    options: [
      { name: "splitMode", label: "Split mode", type: "select", choices: ["Every page", "Custom ranges"] },
      { name: "ranges", label: "Ranges", type: "text", value: "1-2,3", hint: "Used for custom ranges" },
    ],
    run: splitPdf,
  },
  {
    id: "remove-pages",
    name: "Remove Pages",
    category: "Organize PDF",
    description: "Delete selected pages and download the remaining PDF.",
    accept: ".pdf,application/pdf",
    multiple: false,
    options: [{ name: "pages", label: "Pages to remove", type: "text", value: "2,4-5" }],
    run: removePages,
  },
  {
    id: "extract-pages",
    name: "Extract Pages",
    category: "Organize PDF",
    description: "Extract selected pages into a new PDF.",
    accept: ".pdf,application/pdf",
    multiple: false,
    options: [{ name: "pages", label: "Pages to extract", type: "text", value: "1,3-4" }],
    run: extractPages,
  },
  {
    id: "compress",
    name: "Compress PDF",
    category: "Optimize PDF",
    description: "Rewrite a PDF with object streams and metadata cleanup.",
    accept: ".pdf,application/pdf",
    multiple: false,
    options: [{ name: "level", label: "Compression level", type: "select", choices: ["Recommended", "High", "Extreme"] }],
    run: compressPdf,
  },
  {
    id: "repair",
    name: "Repair PDF",
    category: "Optimize PDF",
    description: "Try to reopen and rewrite the PDF structure.",
    accept: ".pdf,application/pdf",
    multiple: false,
    options: [],
    run: repairPdf,
  },
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    category: "Convert PDF",
    description: "Turn JPG or PNG images into one PDF.",
    accept: ".jpg,.jpeg,.png,image/jpeg,image/png",
    multiple: true,
    options: [{ name: "pageSize", label: "Page size", type: "select", choices: ["Fit image", "A4 portrait", "Letter portrait"] }],
    run: imagesToPdf,
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    category: "Convert PDF",
    description: "Export PDF text and page previews as a Word-compatible DOC file.",
    accept: ".pdf,application/pdf",
    multiple: false,
    options: [],
    run: pdfToWord,
  },
  {
    id: "pdf-to-powerpoint",
    name: "PDF to PowerPoint",
    category: "Convert PDF",
    description: "Export each PDF page as a PowerPoint-compatible slide deck.",
    accept: ".pdf,application/pdf",
    multiple: false,
    options: [],
    run: pdfToPowerPoint,
  },
  {
    id: "pdf-to-excel",
    name: "PDF to Excel",
    category: "Convert PDF",
    description: "Export extracted PDF text into an Excel-compatible workbook.",
    accept: ".pdf,application/pdf",
    multiple: false,
    options: [],
    run: pdfToExcel,
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    category: "Convert PDF",
    description: "Render PDF pages into JPG images.",
    accept: ".pdf,application/pdf",
    multiple: false,
    options: [{ name: "scale", label: "Image scale", type: "select", choices: ["1", "1.5", "2"] }],
    run: pdfToJpg,
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    category: "Convert PDF",
    description: "Convert DOCX text to PDF and attach the original document.",
    accept: ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    multiple: false,
    options: [],
    run: wordToPdf,
  },
  {
    id: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    category: "Convert PDF",
    description: "Convert PPTX slide text to PDF and attach the original deck.",
    accept: ".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation",
    multiple: false,
    options: [],
    run: powerPointToPdf,
  },
  {
    id: "excel-to-pdf",
    name: "Excel to PDF",
    category: "Convert PDF",
    description: "Convert XLSX sheet text to PDF and attach the original workbook.",
    accept: ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    multiple: false,
    options: [],
    run: excelToPdf,
  },
  {
    id: "rotate",
    name: "Rotate PDF",
    category: "Edit PDF",
    description: "Rotate every page by 90, 180, or 270 degrees.",
    accept: ".pdf,application/pdf",
    multiple: false,
    options: [{ name: "angle", label: "Angle", type: "select", choices: ["90", "180", "270"] }],
    run: rotatePdf,
  },
  {
    id: "watermark",
    name: "Add Watermark",
    category: "Edit PDF",
    description: "Stamp text across every page.",
    accept: ".pdf,application/pdf",
    multiple: false,
    options: [
      { name: "text", label: "Watermark text", type: "text", value: "CONFIDENTIAL" },
      { name: "opacity", label: "Opacity", type: "select", choices: ["0.18", "0.28", "0.4"] },
    ],
    run: addWatermark,
  },
  {
    id: "page-numbers",
    name: "Add Page Numbers",
    category: "Edit PDF",
    description: "Add page numbers to the bottom of each page.",
    accept: ".pdf,application/pdf",
    multiple: false,
    options: [{ name: "prefix", label: "Prefix", type: "text", value: "Page" }],
    run: addPageNumbers,
  },
  {
    id: "crop",
    name: "Crop PDF",
    category: "Edit PDF",
    description: "Crop page boxes by a fixed margin.",
    accept: ".pdf,application/pdf",
    multiple: false,
    options: [{ name: "margin", label: "Margin in points", type: "number", value: "24" }],
    run: cropPdf,
  },
  {
    id: "sign",
    name: "Sign PDF",
    category: "PDF Security",
    description: "Place a typed signature on the first page.",
    accept: ".pdf,application/pdf",
    multiple: false,
    options: [{ name: "signature", label: "Signature", type: "text", value: "Signed by Our PDF" }],
    run: signPdf,
  },
  {
    id: "redact",
    name: "Redact PDF",
    category: "PDF Security",
    description: "Burn a black redaction band onto every page.",
    accept: ".pdf,application/pdf",
    multiple: false,
    options: [{ name: "label", label: "Redaction label", type: "text", value: "REDACTED" }],
    run: redactPdf,
  },
  {
    id: "protect",
    name: "Protect PDF",
    category: "PDF Security",
    description: "Encrypt a PDF with a password using a secure server worker.",
    accept: ".pdf,application/pdf",
    multiple: false,
    options: [{ name: "password", label: "Password", type: "text", value: "" }],
    run: serverRequired,
  },
  {
    id: "unlock",
    name: "Unlock PDF",
    category: "PDF Security",
    description: "Remove a known password using a secure server worker.",
    accept: ".pdf,application/pdf",
    multiple: false,
    options: [{ name: "password", label: "Current password", type: "text", value: "" }],
    run: serverRequired,
  },
  {
    id: "compare",
    name: "Compare PDF",
    category: "PDF Security",
    description: "Compare document page counts, sizes, titles, and hashes.",
    accept: ".pdf,application/pdf",
    multiple: true,
    minFiles: 2,
    options: [],
    run: comparePdf,
  },
  {
    id: "ocr",
    name: "OCR Preview",
    category: "PDF Intelligence",
    description: "Render page previews for OCR worker handoff.",
    accept: ".pdf,application/pdf",
    multiple: false,
    options: [{ name: "pages", label: "Pages to preview", type: "text", value: "1" }],
    run: ocrPreview,
  },
  {
    id: "summarize",
    name: "AI Summarizer",
    category: "PDF Intelligence",
    description: "Create a metadata summary and Supabase-ready AI job.",
    accept: ".pdf,application/pdf",
    multiple: false,
    options: [],
    run: summarizePdf,
  },
];

const categoryTabs = document.querySelector("#category-tabs");
const toolGrid = document.querySelector("#tool-grid");
const activeCategory = document.querySelector("#active-category");
const workspaceTitle = document.querySelector("#workspace-title");
const workspaceDescription = document.querySelector("#workspace-description");
const fileInput = document.querySelector("#file-input");
const dropzone = document.querySelector("#dropzone");
const fileHelp = document.querySelector("#file-help");
const fileList = document.querySelector("#file-list");
const optionsForm = document.querySelector("#options-form");
const runToolButton = document.querySelector("#run-tool");
const clearFilesButton = document.querySelector("#clear-files");
const toolStatus = document.querySelector("#tool-status");
const resultList = document.querySelector("#result-list");
const historyList = document.querySelector("#history-list");
const authState = document.querySelector("#auth-state");
const privacyState = document.querySelector("#privacy-state");
const authEmail = document.querySelector("#auth-email");
const authPassword = document.querySelector("#auth-password");
const authMessage = document.querySelector("#auth-message");

let selectedCategory = "All";
let selectedTool = tools[0];
let selectedFiles = [];
let currentUser = null;
let supabase = null;

const config = window.OUR_PDF_SUPABASE ?? {};
if (config.url && config.anonKey) {
  supabase = createClient(config.url, config.anonKey);
}

renderCategories();
renderTools();
selectTool("merge");
wireUpload();
wireAuth();
initAuth();

function renderCategories() {
  categoryTabs.innerHTML = "";
  for (const category of categories) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = category;
    button.className = category === selectedCategory ? "active" : "";
    button.addEventListener("click", () => {
      selectedCategory = category;
      renderCategories();
      renderTools();
    });
    categoryTabs.append(button);
  }
}

function renderTools() {
  toolGrid.innerHTML = "";
  const visibleTools = selectedCategory === "All" ? tools : tools.filter((tool) => tool.category === selectedCategory);
  for (const tool of visibleTools) {
    const style = categoryStyles[tool.category];
    const button = document.createElement("button");
    button.type = "button";
    button.className = `tool-card ${tool.id === selectedTool.id ? "active" : ""}`;
    button.dataset.tone = style.tone;
    button.innerHTML = `
      <span class="tool-icon" aria-hidden="true">${style.icon}</span>
      <span class="tool-copy">
        <strong>${tool.name}</strong>
        <small>${tool.category}</small>
        <span>${tool.description}</span>
      </span>
    `;
    button.addEventListener("click", () => selectTool(tool.id, true));
    toolGrid.append(button);
  }
}

function selectTool(toolId, shouldOpenWorkspace = false) {
  selectedTool = tools.find((tool) => tool.id === toolId) ?? tools[0];
  activeCategory.textContent = selectedTool.category;
  workspaceTitle.textContent = selectedTool.name;
  workspaceDescription.textContent = selectedTool.description;
  fileInput.accept = selectedTool.accept;
  fileInput.multiple = selectedTool.multiple;
  fileHelp.textContent = selectedTool.multiple ? "Multiple files supported" : "One file required";
  runToolButton.textContent = selectedTool.name;
  selectedFiles = [];
  fileInput.value = "";
  renderOptions();
  renderFiles();
  setStatus("Ready");
  renderTools();
  if (shouldOpenWorkspace) {
    openWorkspace();
  }
}

function openWorkspace() {
  history.replaceState(null, "", "#workspace");
  document.querySelector("#workspace").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderOptions() {
  optionsForm.innerHTML = "";
  if (selectedTool.options.length === 0) {
    optionsForm.innerHTML = `<p class="option-wide small-note">No extra settings for this tool.</p>`;
    return;
  }
  for (const option of selectedTool.options) {
    const label = document.createElement("label");
    label.className = option.type === "textarea" ? "option-wide" : "";
    label.textContent = option.label;
    let field;
    if (option.type === "select") {
      field = document.createElement("select");
      for (const choice of option.choices) {
        const item = document.createElement("option");
        item.value = choice;
        item.textContent = choice;
        field.append(item);
      }
    } else if (option.type === "textarea") {
      field = document.createElement("textarea");
    } else {
      field = document.createElement("input");
      field.type = option.type;
    }
    field.name = option.name;
    field.value = option.value ?? option.choices?.[0] ?? "";
    if (option.hint) {
      field.placeholder = option.hint;
    }
    label.append(field);
    optionsForm.append(label);
  }
}

function wireUpload() {
  for (const eventName of ["dragenter", "dragover"]) {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.add("dragging");
    });
  }
  for (const eventName of ["dragleave", "drop"]) {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.remove("dragging");
    });
  }
  dropzone.addEventListener("drop", (event) => setFiles([...event.dataTransfer.files]));
  fileInput.addEventListener("change", (event) => setFiles([...event.target.files]));
  clearFilesButton.addEventListener("click", () => {
    selectedFiles = [];
    fileInput.value = "";
    renderFiles();
    renderResult([]);
    setStatus("Cleared");
  });
  runToolButton.addEventListener("click", runSelectedTool);
}

function setFiles(files) {
  selectedFiles = selectedTool.multiple ? files : files.slice(0, 1);
  renderFiles();
  setStatus(`${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"} selected`);
}

function renderFiles() {
  fileList.innerHTML = "";
  if (selectedFiles.length === 0) {
    fileList.innerHTML = `<p class="small-note">No files selected.</p>`;
    return;
  }
  selectedFiles.forEach((file, index) => {
    const item = document.createElement("div");
    item.className = "file-item";
    item.innerHTML = `<div><strong>${escapeHtml(file.name)}</strong><small>${formatBytes(file.size)} - ${file.type || "unknown type"}</small></div>`;
    const remove = document.createElement("button");
    remove.className = "button quiet";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      selectedFiles.splice(index, 1);
      renderFiles();
    });
    item.append(remove);
    fileList.append(item);
  });
}

async function runSelectedTool() {
  try {
    validateFiles();
    setStatus("Processing...");
    renderResult([]);
    const options = Object.fromEntries(new FormData(optionsForm).entries());
    const started = performance.now();
    const outputs = await selectedTool.run(selectedFiles, options);
    const durationMs = Math.round(performance.now() - started);
    renderResult(outputs);
    setStatus(`Completed in ${durationMs} ms`);
    await saveHistory("completed", durationMs);
  } catch (error) {
    console.error(error);
    setStatus(error.message || "Unable to process file");
    await saveHistory("failed", null, error.message);
  }
}

function validateFiles() {
  const minFiles = selectedTool.minFiles ?? 1;
  if (selectedFiles.length < minFiles) {
    throw new Error(`${selectedTool.name} needs at least ${minFiles} file${minFiles === 1 ? "" : "s"}.`);
  }
  const acceptsImages = selectedTool.accept.includes("image");
  for (const file of selectedFiles) {
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isImage = file.type.startsWith("image/") || /\.(jpe?g|png)$/i.test(file.name);
    if (acceptsImages && !isImage) {
      throw new Error("This tool accepts JPG and PNG files only.");
    }
    if (!acceptsImages && !fileAllowed(file, selectedTool.accept)) {
      throw new Error(`This tool accepts: ${selectedTool.accept.replaceAll(",", ", ")}.`);
    }
    if (selectedTool.accept.includes("pdf") && !selectedTool.accept.includes("word") && !isPdf) {
      throw new Error("This tool accepts PDF files only.");
    }
  }
}

function setStatus(message) {
  toolStatus.textContent = message;
}

function renderResult(outputs) {
  resultList.innerHTML = "";
  if (!outputs.length) {
    resultList.innerHTML = `<p>No processed files yet.</p>`;
    return;
  }
  for (const output of outputs) {
    const item = document.createElement("div");
    item.className = "result-item";
    const url = URL.createObjectURL(output.blob);
    item.innerHTML = `<div><strong>${escapeHtml(output.name)}</strong><small>${formatBytes(output.blob.size)}</small></div>`;
    const link = document.createElement("a");
    link.href = url;
    link.download = output.name;
    link.textContent = "Download";
    item.append(link);
    resultList.append(item);
  }
}

async function mergePdf(files) {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
    const pages = await merged.copyPages(source, source.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }
  return [pdfOutput(await merged.save(), "merged.pdf")];
}

async function splitPdf(files, options) {
  const source = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
  const ranges =
    options.splitMode === "Custom ranges"
      ? parseRanges(options.ranges, source.getPageCount()).map((range) => range.pages)
      : source.getPageIndices().map((index) => [index]);
  const outputs = [];
  for (let index = 0; index < ranges.length; index += 1) {
    const doc = await PDFDocument.create();
    const pages = await doc.copyPages(source, ranges[index]);
    pages.forEach((page) => doc.addPage(page));
    outputs.push(pdfOutput(await doc.save(), `split-${index + 1}.pdf`));
  }
  return outputs;
}

async function removePages(files, options) {
  const source = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
  const remove = new Set(flattenRanges(options.pages, source.getPageCount()));
  const keep = source.getPageIndices().filter((index) => !remove.has(index));
  if (keep.length === 0) throw new Error("At least one page must remain.");
  return [await copyPages(source, keep, "pages-removed.pdf")];
}

async function extractPages(files, options) {
  const source = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
  const keep = flattenRanges(options.pages, source.getPageCount());
  return [await copyPages(source, keep, "pages-extracted.pdf")];
}

async function compressPdf(files) {
  const source = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
  source.setTitle("");
  source.setSubject("");
  source.setKeywords([]);
  source.setProducer("Our PDF");
  const bytes = await source.save({ useObjectStreams: true, addDefaultPage: false });
  return [pdfOutput(bytes, "compressed.pdf")];
}

async function repairPdf(files) {
  const source = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true, updateMetadata: false });
  const repaired = await PDFDocument.create();
  const pages = await repaired.copyPages(source, source.getPageIndices());
  pages.forEach((page) => repaired.addPage(page));
  return [pdfOutput(await repaired.save(), "repaired.pdf")];
}

async function imagesToPdf(files, options) {
  const pdf = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const image = file.type === "image/png" || file.name.toLowerCase().endsWith(".png")
      ? await pdf.embedPng(bytes)
      : await pdf.embedJpg(bytes);
    const size = pageSizeForImage(options.pageSize, image.width, image.height);
    const page = pdf.addPage(size);
    const fit = fitRect(image.width, image.height, page.getWidth(), page.getHeight());
    page.drawImage(image, fit);
  }
  return [pdfOutput(await pdf.save(), "images.pdf")];
}

async function pdfToJpg(files, options) {
  const bytes = await files[0].arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
  const zip = new JSZip();
  const scale = Number(options.scale || 1.5);
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const canvas = await renderPdfPageToCanvas(pdf, pageNumber, scale);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
    zip.file(`page-${pageNumber}.jpg`, blob);
  }
  return [{ name: "pdf-pages-jpg.zip", blob: await zip.generateAsync({ type: "blob" }) }];
}

async function pdfToWord(files) {
  const data = await extractPdfForOffice(files[0]);
  const sections = data.pages
    .map(
      (page) => `
        <h2>Page ${page.number}</h2>
        <p><img src="${page.image}" alt="Page ${page.number} preview" style="max-width:100%;height:auto;" /></p>
        <pre>${escapeHtml(page.text || "[No selectable text detected on this page.]")}</pre>
      `,
    )
    .join('<br style="page-break-after:always" />');
  const html = officeHtmlDocument(files[0].name, sections);
  return [{ name: replaceExtension(files[0].name, ".doc"), blob: new Blob([html], { type: "application/msword" }) }];
}

async function pdfToPowerPoint(files) {
  const data = await extractPdfForOffice(files[0]);
  const slides = data.pages
    .map(
      (page) => `
        <section style="width:960px;height:540px;page-break-after:always;padding:24px;font-family:Arial,sans-serif;">
          <h1 style="font-size:24px;margin:0 0 16px;">Page ${page.number}</h1>
          <img src="${page.image}" alt="Page ${page.number}" style="max-width:912px;max-height:420px;display:block;margin-bottom:12px;" />
          <p style="font-size:12px;white-space:pre-wrap;">${escapeHtml(page.text.slice(0, 900))}</p>
        </section>
      `,
    )
    .join("");
  return [{ name: replaceExtension(files[0].name, ".ppt"), blob: new Blob([officeHtmlDocument(files[0].name, slides)], { type: "application/vnd.ms-powerpoint" }) }];
}

async function pdfToExcel(files) {
  const data = await extractPdfText(files[0]);
  const rows = data.pages
    .flatMap((page) =>
      page.lines.map(
        (line, index) =>
          `<tr><td>${page.number}</td><td>${index + 1}</td><td>${escapeHtml(line)}</td></tr>`,
      ),
    )
    .join("");
  const workbook = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8" /></head>
      <body><table><tr><th>Page</th><th>Line</th><th>Text</th></tr>${rows}</table></body>
    </html>
  `;
  return [{ name: replaceExtension(files[0].name, ".xls"), blob: new Blob([workbook], { type: "application/vnd.ms-excel" }) }];
}

async function rotatePdf(files, options) {
  const source = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
  const angle = Number(options.angle || 90);
  source.getPages().forEach((page) => page.setRotation(degrees(angle)));
  return [pdfOutput(await source.save(), "rotated.pdf")];
}

async function addWatermark(files, options) {
  const source = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
  const font = await source.embedFont(StandardFonts.HelveticaBold);
  const text = options.text || "CONFIDENTIAL";
  const opacity = Number(options.opacity || 0.28);
  source.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width * 0.18,
      y: height * 0.48,
      size: Math.max(28, width / 12),
      font,
      color: rgb(0.79, 0.2, 0.18),
      rotate: degrees(-32),
      opacity,
    });
  });
  return [pdfOutput(await source.save(), "watermarked.pdf")];
}

async function addPageNumbers(files, options) {
  const source = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
  const font = await source.embedFont(StandardFonts.Helvetica);
  const pages = source.getPages();
  pages.forEach((page, index) => {
    const text = `${options.prefix || "Page"} ${index + 1} of ${pages.length}`;
    const width = font.widthOfTextAtSize(text, 10);
    page.drawText(text, {
      x: (page.getWidth() - width) / 2,
      y: 24,
      size: 10,
      font,
      color: rgb(0.2, 0.23, 0.28),
    });
  });
  return [pdfOutput(await source.save(), "numbered.pdf")];
}

async function cropPdf(files, options) {
  const source = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
  const margin = Math.max(0, Number(options.margin || 0));
  source.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    const safe = Math.min(margin, width / 3, height / 3);
    page.setCropBox(safe, safe, width - safe * 2, height - safe * 2);
  });
  return [pdfOutput(await source.save(), "cropped.pdf")];
}

async function signPdf(files, options) {
  const source = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
  const font = await source.embedFont(StandardFonts.TimesRomanItalic);
  const page = source.getPage(0);
  page.drawText(options.signature || "Signed", {
    x: 48,
    y: 64,
    size: 22,
    font,
    color: rgb(0.05, 0.18, 0.34),
  });
  page.drawRectangle({ x: 44, y: 58, width: 220, height: 42, borderColor: rgb(0.05, 0.18, 0.34), borderWidth: 1 });
  return [pdfOutput(await source.save(), "signed.pdf")];
}

async function redactPdf(files, options) {
  const source = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
  const font = await source.embedFont(StandardFonts.HelveticaBold);
  source.getPages().forEach((page) => {
    const width = page.getWidth();
    page.drawRectangle({ x: 40, y: page.getHeight() - 110, width: width - 80, height: 34, color: rgb(0, 0, 0) });
    page.drawText(options.label || "REDACTED", { x: 52, y: page.getHeight() - 101, size: 13, font, color: rgb(1, 1, 1) });
  });
  return [pdfOutput(await source.save(), "redacted.pdf")];
}

async function comparePdf(files) {
  const lines = [];
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const hash = await sha256(bytes);
    lines.push(`${file.name}
Pages: ${doc.getPageCount()}
Size: ${formatBytes(file.size)}
SHA-256: ${hash}
`);
  }
  const blob = new Blob([lines.join("\n---\n")], { type: "text/plain" });
  return [{ name: "pdf-comparison.txt", blob }];
}

async function ocrPreview(files, options) {
  const data = await extractPdfText(files[0]);
  const selected = new Set(flattenRanges(options.pages || "1", data.pages.length));
  const text = data.pages
    .filter((page) => selected.has(page.number - 1))
    .map((page) => `Page ${page.number}\n${page.lines.join("\n") || "[No selectable text found. Use a server OCR worker for scanned pages.]"}`)
    .join("\n\n");
  return [{ name: replaceExtension(files[0].name, "-ocr.txt"), blob: new Blob([text], { type: "text/plain" }) }];
}

async function summarizePdf(files) {
  const data = await extractPdfText(files[0]);
  const allText = data.pages.flatMap((page) => page.lines).join(" ");
  const sentences = allText.match(/[^.!?]+[.!?]+/g) ?? [allText];
  const preview = sentences.slice(0, 6).join(" ").trim();
  const summary = new Blob(
    [
      `PDF summary
File: ${files[0].name}
Pages: ${data.pages.length}
Size: ${formatBytes(files[0].size)}

${preview || "No selectable text was found. Connect a server OCR/AI worker for scanned documents."}
`,
    ],
    { type: "text/plain" },
  );
  return [{ name: replaceExtension(files[0].name, "-summary.txt"), blob: summary }];
}

async function wordToPdf(files) {
  const text = await extractDocxText(files[0]);
  return [await textToPdfWithOriginal(files[0], text, "word-converted.pdf", "Word to PDF")];
}

async function powerPointToPdf(files) {
  const text = await extractPptxText(files[0]);
  return [await textToPdfWithOriginal(files[0], text, "powerpoint-converted.pdf", "PowerPoint to PDF")];
}

async function excelToPdf(files) {
  const text = await extractXlsxText(files[0]);
  return [await textToPdfWithOriginal(files[0], text, "excel-converted.pdf", "Excel to PDF")];
}

async function serverWorkerManifest(files, options) {
  const file = files[0];
  const manifest = {
    tool: selectedTool.id,
    toolName: selectedTool.name,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || "unknown",
    requestedAt: new Date().toISOString(),
    authenticatedUser: currentUser?.id ?? null,
    options: redactSensitiveOptions(options),
    nextStep:
      "Send this safe metadata and a temporary object reference to a Supabase Edge Function or worker. Do not store document bytes in Supabase.",
  };
  return [
    {
      name: `${selectedTool.id}-worker-manifest.json`,
      blob: new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" }),
    },
  ];
}

async function serverRequired() {
  throw new Error(
    `${selectedTool.name} needs a secure server worker for production-grade encryption/decryption. Configure the Supabase worker endpoint before enabling this action.`,
  );
}

function redactSensitiveOptions(options) {
  return Object.fromEntries(
    Object.entries(options).map(([key, value]) => [key, key.toLowerCase().includes("password") ? "[redacted]" : value]),
  );
}

async function copyPages(source, indices, name) {
  const doc = await PDFDocument.create();
  const pages = await doc.copyPages(source, indices);
  pages.forEach((page) => doc.addPage(page));
  return pdfOutput(await doc.save(), name);
}

async function extractPdfForOffice(file) {
  const bytes = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(" ").replace(/\s+/g, " ").trim();
    const canvas = await renderPdfPageToCanvas(pdf, pageNumber, 1.45);
    pages.push({ number: pageNumber, text, image: canvas.toDataURL("image/jpeg", 0.88) });
  }
  return { pages };
}

async function extractPdfText(file) {
  const bytes = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const lines = groupTextItemsIntoLines(content.items);
    pages.push({ number: pageNumber, lines });
  }
  return { pages };
}

async function renderPdfPageToCanvas(pdf, pageNumber, scale) {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = window.document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  await page.render({ canvasContext: context, viewport }).promise;
  return canvas;
}

function groupTextItemsIntoLines(items) {
  const rows = new Map();
  for (const item of items) {
    const y = Math.round(item.transform?.[5] ?? 0);
    rows.set(y, [...(rows.get(y) ?? []), item]);
  }
  return [...rows.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, rowItems]) =>
      rowItems
        .sort((a, b) => (a.transform?.[4] ?? 0) - (b.transform?.[4] ?? 0))
        .map((item) => item.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);
}

function officeHtmlDocument(title, body) {
  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; }
          pre { white-space: pre-wrap; font-family: Arial, sans-serif; line-height: 1.45; }
          h1, h2 { page-break-after: avoid; }
        </style>
      </head>
      <body>${body}</body>
    </html>
  `;
}

async function extractDocxText(file) {
  if (!file.name.toLowerCase().endsWith(".docx")) {
    throw new Error("Browser conversion supports DOCX. Use the worker path for legacy DOC files.");
  }
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const xml = await zip.file("word/document.xml")?.async("text");
  if (!xml) throw new Error("Unable to read DOCX document text.");
  return xmlText(xml).join("\n");
}

async function extractPptxText(file) {
  if (!file.name.toLowerCase().endsWith(".pptx")) {
    throw new Error("Browser conversion supports PPTX. Use the worker path for legacy PPT files.");
  }
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => Number(a.match(/\d+/)?.[0] ?? 0) - Number(b.match(/\d+/)?.[0] ?? 0));
  const slides = [];
  for (const [index, name] of slideFiles.entries()) {
    const text = xmlText(await zip.file(name).async("text")).join("\n");
    slides.push(`Slide ${index + 1}\n${text}`);
  }
  return slides.join("\n\n");
}

async function extractXlsxText(file) {
  if (!file.name.toLowerCase().endsWith(".xlsx")) {
    throw new Error("Browser conversion supports XLSX. Use the worker path for legacy XLS files.");
  }
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const shared = zip.file("xl/sharedStrings.xml")
    ? xmlText(await zip.file("xl/sharedStrings.xml").async("text"))
    : [];
  const sheetFiles = Object.keys(zip.files)
    .filter((name) => /^xl\/worksheets\/sheet\d+\.xml$/.test(name))
    .sort();
  const sheets = [];
  for (const [sheetIndex, name] of sheetFiles.entries()) {
    const xml = await zip.file(name).async("text");
    const rows = [...xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map((rowMatch) => {
      return [...rowMatch[1].matchAll(/<c[^>]*?(?:t="([^"]+)")?[^>]*>([\s\S]*?)<\/c>/g)]
        .map((cellMatch) => {
          const type = cellMatch[1];
          const value = cellMatch[2].match(/<v[^>]*>([\s\S]*?)<\/v>/)?.[1] ?? "";
          return type === "s" ? shared[Number(value)] ?? "" : decodeXml(value);
        })
        .filter(Boolean)
        .join(" | ");
    });
    sheets.push(`Sheet ${sheetIndex + 1}\n${rows.filter(Boolean).join("\n")}`);
  }
  return sheets.join("\n\n");
}

async function textToPdfWithOriginal(file, text, outputName, title) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage([612, 792]);
  let y = 744;
  page.drawText(title, { x: 48, y, size: 18, font: bold, color: rgb(0.08, 0.09, 0.12) });
  y -= 28;
  page.drawText(`Source file attached: ${file.name}`, { x: 48, y, size: 10, font, color: rgb(0.35, 0.39, 0.45) });
  y -= 28;
  for (const line of wrapText(text || "[No readable text found. Original file is attached.]", 92)) {
    if (y < 48) {
      page = pdf.addPage([612, 792]);
      y = 744;
    }
    page.drawText(line, { x: 48, y, size: 10, font, color: rgb(0.08, 0.09, 0.12) });
    y -= 14;
  }
  if (typeof pdf.attach === "function") {
    await pdf.attach(await file.arrayBuffer(), file.name, {
      mimeType: file.type || "application/octet-stream",
      description: "Original source file attached by Our PDF to preserve source information.",
      creationDate: new Date(),
      modificationDate: new Date(),
    });
  }
  return pdfOutput(await pdf.save(), outputName);
}

function xmlText(xml) {
  return [...xml.matchAll(/<[^:/>\s]+:t[^>]*>([\s\S]*?)<\/[^:/>\s]+:t>/g)]
    .map((match) => decodeXml(match[1]).trim())
    .filter(Boolean);
}

function decodeXml(value) {
  const parser = new DOMParser();
  return parser.parseFromString(`<x>${value}</x>`, "text/xml").documentElement.textContent ?? "";
}

function wrapText(text, maxLength) {
  const lines = [];
  for (const paragraph of text.split(/\r?\n/)) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let line = "";
    for (const word of words) {
      if ((line + " " + word).trim().length > maxLength) {
        lines.push(line);
        line = word;
      } else {
        line = `${line} ${word}`.trim();
      }
    }
    lines.push(line || "");
  }
  return lines;
}

function pdfOutput(bytes, name) {
  return { name, blob: new Blob([bytes], { type: "application/pdf" }) };
}

function fileAllowed(file, accept) {
  const name = file.name.toLowerCase();
  return accept
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .some((item) => (item.startsWith(".") ? name.endsWith(item) : file.type === item || file.type.startsWith(item.replace("/*", "/"))));
}

function parseRanges(value, pageCount) {
  return String(value || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => ({ pages: parseRangePart(part, pageCount) }));
}

function flattenRanges(value, pageCount) {
  const pages = parseRanges(value, pageCount).flatMap((range) => range.pages);
  if (pages.length === 0) throw new Error("Enter at least one valid page number or range.");
  return [...new Set(pages)].sort((a, b) => a - b);
}

function parseRangePart(part, pageCount) {
  const [startRaw, endRaw] = part.split("-");
  const start = clampPage(Number(startRaw), pageCount);
  const end = clampPage(Number(endRaw || startRaw), pageCount);
  const low = Math.min(start, end);
  const high = Math.max(start, end);
  return Array.from({ length: high - low + 1 }, (_, index) => low + index - 1);
}

function clampPage(page, pageCount) {
  if (!Number.isFinite(page) || page < 1) throw new Error("Page ranges must use numbers like 1,3-5.");
  return Math.min(Math.floor(page), pageCount);
}

function pageSizeForImage(mode, width, height) {
  if (mode === "A4 portrait") return [595.28, 841.89];
  if (mode === "Letter portrait") return [612, 792];
  return [width, height];
}

function fitRect(sourceWidth, sourceHeight, boxWidth, boxHeight) {
  const scale = Math.min(boxWidth / sourceWidth, boxHeight / sourceHeight);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  return { x: (boxWidth - width) / 2, y: (boxHeight - height) / 2, width, height };
}

async function sha256(buffer) {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function replaceExtension(fileName, extension) {
  return fileName.replace(/\.[^.]+$/, "") + extension;
}

function wireAuth() {
  document.querySelector("#sign-in").addEventListener("click", () => signIn());
  document.querySelector("#sign-up").addEventListener("click", () => signUp());
  document.querySelector("#sign-out").addEventListener("click", () => signOut());
}

async function initAuth() {
  if (!supabase) {
    updateAuthUi(null);
    return;
  }
  const { data } = await supabase.auth.getUser();
  updateAuthUi(data.user);
  supabase.auth.onAuthStateChange((_event, session) => updateAuthUi(session?.user ?? null));
}

async function signIn() {
  if (!supabase) return setAuthMessage("Supabase is not configured yet.");
  const { error } = await supabase.auth.signInWithPassword({ email: authEmail.value, password: authPassword.value });
  setAuthMessage(error ? error.message : "Signed in.");
}

async function signUp() {
  if (!supabase) return setAuthMessage("Supabase is not configured yet.");
  const { error } = await supabase.auth.signUp({ email: authEmail.value, password: authPassword.value });
  setAuthMessage(error ? error.message : "Account created. Check email confirmation settings in Supabase.");
}

async function signOut() {
  if (!supabase) return setAuthMessage("Supabase is not configured yet.");
  await supabase.auth.signOut();
  setAuthMessage("Signed out.");
}

function updateAuthUi(user) {
  currentUser = user;
  authState.textContent = user ? user.email : "Guest mode";
  privacyState.textContent = user ? "Safe metadata sync enabled" : "Files stay in this browser session";
  setAuthMessage(user ? `Signed in as ${user.email}` : "Guest mode is active. Sign in only if you want history.");
  loadHistory();
}

function setAuthMessage(message) {
  authMessage.textContent = message;
}

async function saveHistory(status, durationMs, errorMessage = null) {
  if (!currentUser || !supabase) return;
  await supabase.from("jobs").insert({
    user_id: currentUser.id,
    operation: selectedTool.id,
    status,
    file_count: selectedFiles.length,
    file_names: selectedFiles.map((file) => file.name),
    processing_duration_ms: durationMs,
    safe_error_code: errorMessage ? "CLIENT_PROCESSING_ERROR" : null,
  });
  await loadHistory();
}

async function loadHistory() {
  if (!currentUser || !supabase) {
    historyList.innerHTML = `<p>Sign in to sync safe job metadata with Supabase.</p>`;
    return;
  }
  const { data, error } = await supabase
    .from("jobs")
    .select("operation,status,file_count,created_at,processing_duration_ms")
    .order("created_at", { ascending: false })
    .limit(8);
  if (error) {
    historyList.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
    return;
  }
  if (!data.length) {
    historyList.innerHTML = `<p>No saved jobs yet.</p>`;
    return;
  }
  historyList.innerHTML = "";
  for (const job of data) {
    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `<div><strong>${escapeHtml(job.operation)}</strong><small>${job.status} - ${job.file_count} file(s) - ${new Date(job.created_at).toLocaleString()}</small></div>`;
    historyList.append(item);
  }
}
