import { PDFDocument, StandardFonts, rgb, degrees } from "https://cdn.skypack.dev/pdf-lib@1.17.1";
import JSZip from "https://cdn.skypack.dev/jszip@3.10.1";
import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

const categories = ["All", "Organize PDF", "Optimize PDF", "Convert PDF", "Edit PDF", "PDF Security", "PDF Intelligence"];

const categoryStyles = {
  "Organize PDF": { tone: "coral" },
  "Optimize PDF": { tone: "green" },
  "Convert PDF": { tone: "blue" },
  "Edit PDF": { tone: "purple" },
  "PDF Security": { tone: "blue" },
  "PDF Intelligence": { tone: "green" },
};

const toolLogos = {
  merge: { tone: "coral", type: "arrows", labels: ["↘", "↖"] },
  split: { tone: "coral", type: "arrows split", labels: ["↖", "↘"] },
  "remove-pages": { tone: "coral", type: "stack", labels: ["−", "×"] },
  "extract-pages": { tone: "coral", type: "stack", labels: ["↗", "PDF"] },
  compress: { tone: "green", type: "quad", labels: ["↘", "↙", "↗", "↖"] },
  repair: { tone: "green", type: "single", labels: ["⌘"] },
  "jpg-to-pdf": { tone: "yellow", type: "swap", labels: ["JPG", "↘"] },
  "pdf-to-word": { tone: "blue", type: "swap", labels: ["↘", "W"] },
  "pdf-to-powerpoint": { tone: "coral", type: "swap", labels: ["↘", "P"] },
  "pdf-to-excel": { tone: "green", type: "swap", labels: ["↘", "X"] },
  "pdf-to-jpg": { tone: "yellow", type: "image", labels: ["↘", "◆"] },
  "word-to-pdf": { tone: "blue", type: "swap reverse", labels: ["W", "↘"] },
  "powerpoint-to-pdf": { tone: "coral", type: "swap reverse", labels: ["P", "↘"] },
  "excel-to-pdf": { tone: "green", type: "swap reverse", labels: ["X", "↘"] },
  rotate: { tone: "purple", type: "single", labels: ["↻"] },
  watermark: { tone: "purple", type: "single", labels: ["♟"] },
  "page-numbers": { tone: "purple", type: "quad", labels: ["1", "2", "3", "4"] },
  crop: { tone: "purple", type: "single", labels: ["⌗"] },
  sign: { tone: "blue", type: "single", labels: ["✒"] },
  redact: { tone: "purple", type: "single", labels: ["▰"] },
  protect: { tone: "blue", type: "single", labels: ["♙"] },
  unlock: { tone: "blue", type: "single", labels: ["↥"] },
  compare: { tone: "blue", type: "book", labels: ["▥", "▥"] },
  ocr: { tone: "green", type: "document", labels: ["OCR"] },
  summarize: { tone: "coral", type: "scan", labels: ["▣"] },
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
    description: "Export each PDF page into a layout-preserving Word DOCX file.",
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
    description: "Create a local text summary from selectable PDF content.",
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
const workspaceDownloads = document.querySelector("#workspace-downloads");
const progressSteps = document.querySelector("#progress-steps");
const resultList = document.querySelector("#result-list");
const historyList = document.querySelector("#history-list");
const sessionState = document.querySelector("#session-state");
const privacyState = document.querySelector("#privacy-state");
const metricTotal = document.querySelector("#metric-total");
const metricCompleted = document.querySelector("#metric-completed");
const metricFailed = document.querySelector("#metric-failed");
const metricMode = document.querySelector("#metric-mode");

let selectedCategory = "All";
let selectedTool = tools[0];
let selectedFiles = [];
let mergeSlotCount = 2;
let mergeSlots = [];
let outputUrls = [];
let jobHistory = loadLocalHistory();

renderCategories();
renderTools();
selectTool("merge");
wireUpload();
renderHistory();

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
    const style = toolLogos[tool.id] ?? categoryStyles[tool.category];
    const button = document.createElement("button");
    button.type = "button";
    button.className = `tool-card ${tool.id === selectedTool.id ? "active" : ""}`;
    button.dataset.tone = style.tone;
    button.innerHTML = `
      ${renderToolLogo(tool)}
      <span class="tool-copy">
        <strong>${tool.name}</strong>
        <small>${tool.category}</small>
      </span>
    `;
    button.addEventListener("click", () => selectTool(tool.id, true));
    toolGrid.append(button);
  }
}

function renderToolLogo(tool) {
  const logo = toolLogos[tool.id] ?? { tone: categoryStyles[tool.category].tone, type: "single", labels: [tool.name.slice(0, 1)] };
  const pieces = logo.labels.map((label) => `<span>${escapeHtml(label)}</span>`).join("");
  return `<span class="feature-logo ${logo.type}" data-tone="${logo.tone}" aria-hidden="true">${pieces}</span>`;
}

function selectTool(toolId, shouldOpenWorkspace = false) {
  selectedTool = tools.find((tool) => tool.id === toolId) ?? tools[0];
  activeCategory.textContent = selectedTool.category;
  workspaceTitle.textContent = selectedTool.name;
  workspaceDescription.textContent = selectedTool.description;
  fileInput.accept = selectedTool.accept;
  fileInput.multiple = selectedTool.multiple;
  fileHelp.textContent = isMergeTool() ? "Fill numbered PDF slots in the merge order" : selectedTool.multiple ? "Multiple files supported" : "One file required";
  runToolButton.textContent = selectedTool.name;
  selectedFiles = [];
  mergeSlotCount = isMergeTool() ? Math.max(selectedTool.minFiles ?? 2, 2) : 2;
  mergeSlots = Array.from({ length: mergeSlotCount }, () => null);
  fileInput.value = "";
  renderOptions();
  renderFiles();
  renderResult([]);
  setStatus("Ready");
  renderProgress("idle");
  renderTools();
  if (shouldOpenWorkspace) {
    openWorkspace();
  }
}

function renderProgress(active) {
  const steps = [
    ["queued", "Queued"],
    ["processing", "Processing"],
    ["preview", "Preview ready"],
    ["completed", "Download ready"],
  ];
  const activeIndex = steps.findIndex(([key]) => key === active);
  progressSteps.innerHTML = steps
    .map(([key, label], index) => {
      const state = active === "failed" && index === activeIndex ? "failed" : activeIndex >= index ? "complete" : "";
      return `<li class="${state}" data-step="${escapeHtml(key)}">${escapeHtml(label)}</li>`;
    })
    .join("");
}

function openWorkspace() {
  history.replaceState(null, "", "#workspace");
  document.querySelector("#workspace").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderOptions() {
  optionsForm.innerHTML = "";
  if (isMergeTool()) {
    renderMergeOptions();
    return;
  }
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

function renderMergeOptions() {
  const label = document.createElement("label");
  label.className = "option-wide";
  label.textContent = "Number of PDFs to merge";

  const field = document.createElement("input");
  field.type = "number";
  field.min = "2";
  field.max = "20";
  field.step = "1";
  field.value = String(mergeSlotCount);
  field.addEventListener("change", () => setMergeSlotCount(field.value));
  field.addEventListener("input", () => setMergeSlotCount(field.value));

  label.append(field);
  optionsForm.append(label);
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
    if (isMergeTool()) {
      mergeSlots = Array.from({ length: mergeSlotCount }, () => null);
    }
    fileInput.value = "";
    renderFiles();
    renderResult([]);
    setStatus("Cleared");
  });
  runToolButton.addEventListener("click", runSelectedTool);
}

function setFiles(files) {
  if (isMergeTool()) {
    setMergeFiles(files);
    return;
  }
  selectedFiles = selectedTool.multiple ? files : files.slice(0, 1);
  renderFiles();
  setStatus(`${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"} selected`);
}

function renderFiles() {
  fileList.innerHTML = "";
  if (isMergeTool()) {
    renderMergeFiles();
    return;
  }
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

function setMergeSlotCount(value) {
  const count = Math.min(20, Math.max(2, Number.parseInt(value, 10) || 2));
  if (count === mergeSlotCount) return;
  mergeSlotCount = count;
  mergeSlots = Array.from({ length: mergeSlotCount }, (_, index) => mergeSlots[index] ?? null);
  syncMergeFiles();
  renderOptions();
  renderFiles();
}

function setMergeFiles(files) {
  const pdfFiles = files.filter((file) => fileAllowed(file, selectedTool.accept));
  mergeSlotCount = Math.min(20, Math.max(2, pdfFiles.length, mergeSlotCount));
  mergeSlots = Array.from({ length: mergeSlotCount }, (_, index) => pdfFiles[index] ?? mergeSlots[index] ?? null);
  syncMergeFiles();
  renderOptions();
  renderFiles();
  setMergeStatus();
}

function setMergeSlotFile(index, file) {
  mergeSlots[index] = file ?? null;
  syncMergeFiles();
  renderFiles();
  setMergeStatus();
}

function setMergeSlotPosition(index, position) {
  const target = Number.parseInt(position, 10) - 1;
  if (target < 0 || target >= mergeSlots.length) return;
  [mergeSlots[index], mergeSlots[target]] = [mergeSlots[target], mergeSlots[index]];
  syncMergeFiles();
  renderFiles();
  setMergeStatus();
}

function syncMergeFiles() {
  selectedFiles = mergeSlots.filter(Boolean);
}

function setMergeStatus() {
  const ready = selectedFiles.length;
  setStatus(`${ready} of ${mergeSlotCount} merge slot${mergeSlotCount === 1 ? "" : "s"} filled`);
}

function renderMergeFiles() {
  const intro = document.createElement("p");
  intro.className = "small-note";
  intro.textContent = "Files are merged by position number. Set each PDF as 1st, 2nd, 3rd, and so on.";
  fileList.append(intro);

  mergeSlots.forEach((file, index) => {
    const item = document.createElement("div");
    item.className = `file-item merge-slot ${file ? "" : "empty"}`;

    const details = document.createElement("div");
    details.innerHTML = file
      ? `<strong>${index + 1}. ${escapeHtml(file.name)}</strong><small>${formatBytes(file.size)} - ${file.type || "application/pdf"}</small>`
      : `<strong>${index + 1}. Choose PDF</strong><small>This slot will be ${ordinal(index + 1)} in the merged file.</small>`;

    const actions = document.createElement("div");
    actions.className = "file-actions";

    const input = document.createElement("input");
    input.type = "file";
    input.accept = selectedTool.accept;
    input.addEventListener("change", (event) => {
      setMergeSlotFile(index, event.target.files[0] ?? null);
      event.target.value = "";
    });

    const choose = document.createElement("button");
    choose.className = "button secondary";
    choose.type = "button";
    choose.textContent = file ? "Replace" : "Upload";
    choose.addEventListener("click", () => input.click());

    const positionLabel = document.createElement("label");
    positionLabel.className = "position-control";
    positionLabel.textContent = "Position";
    const position = document.createElement("select");
    position.disabled = !file;
    for (let slot = 1; slot <= mergeSlotCount; slot += 1) {
      const option = document.createElement("option");
      option.value = String(slot);
      option.textContent = `${slot}`;
      option.selected = slot === index + 1;
      position.append(option);
    }
    position.addEventListener("change", () => setMergeSlotPosition(index, position.value));
    positionLabel.append(position);

    const remove = document.createElement("button");
    remove.className = "button quiet";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.disabled = !file;
    remove.addEventListener("click", () => setMergeSlotFile(index, null));

    actions.append(input, choose, positionLabel, remove);
    item.append(details, actions);
    fileList.append(item);
  });
}

async function runSelectedTool() {
  let job = null;
  try {
    validateFiles();
    job = safeCreateJobRecord("processing");
    renderProgress("queued");
    setStatus("Queued...");
    renderResult([]);
    const options = Object.fromEntries(new FormData(optionsForm).entries());
    renderProgress("processing");
    setStatus("Processing...");
    const started = performance.now();
    const outputs = await selectedTool.run(selectedFiles, options);
    const durationMs = Math.round(performance.now() - started);
    renderProgress("preview");
    renderResult(outputs);
    renderProgress("completed");
    setStatus(`Completed in ${durationMs} ms`);
    updateJobRecord(job.id, { status: "completed", durationMs, outputCount: outputs.length });
  } catch (error) {
    console.error(error);
    renderProgress("failed");
    setStatus(error.message || "Unable to process file");
    if (job) {
      updateJobRecord(job.id, { status: "failed", safeErrorCode: "CLIENT_PROCESSING_ERROR" });
    }
  }
}

function validateFiles() {
  const minFiles = selectedTool.minFiles ?? 1;
  if (isMergeTool() && selectedFiles.length !== mergeSlotCount) {
    throw new Error(`Fill all ${mergeSlotCount} merge slots, or reduce the number of PDFs to merge.`);
  }
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
  clearOutputUrls();
  resultList.innerHTML = "";
  workspaceDownloads.innerHTML = "";
  if (!outputs.length) {
    resultList.innerHTML = `<p>No processed files yet.</p>`;
    return;
  }

  renderWorkspaceDownloads(outputs);

  for (const [index, output] of outputs.entries()) {
    const item = document.createElement("div");
    item.className = "result-item output-card";
    const url = URL.createObjectURL(output.blob);
    outputUrls.push(url);

    const header = document.createElement("div");
    header.className = "output-header";
    header.innerHTML = `<div><strong>${escapeHtml(output.name)}</strong><small>${formatBytes(output.blob.size)} - ${escapeHtml(outputKind(output))}</small></div>`;

    const preview = document.createElement("div");
    preview.className = "output-preview";
    renderOutputPreview(output, url, preview, index);

    const link = outputDownloadButton(output, url, "Download file");
    item.append(header, preview, link);
    resultList.append(item);
  }
}

function renderWorkspaceDownloads(outputs) {
  const title = document.createElement("strong");
  title.textContent = "Ready to download";
  workspaceDownloads.append(title);

  const list = document.createElement("div");
  list.className = "download-button-row";
  for (const output of outputs) {
    const url = URL.createObjectURL(output.blob);
    outputUrls.push(url);
    list.append(outputDownloadButton(output, url, `Download ${output.name}`));
  }
  workspaceDownloads.append(list);
}

function outputDownloadButton(output, url, label) {
  const link = document.createElement("a");
  link.className = "button primary download-button";
  link.href = url;
  link.download = output.name;
  link.textContent = label;
  return link;
}

async function renderOutputPreview(output, url, container, index) {
  const name = output.name.toLowerCase();
  const type = output.blob.type;
  if (output.preview?.type === "pages") {
    renderPagePreview(output.preview.pages, container);
    return;
  }
  if (output.preview?.type === "images") {
    renderImagePreviewGrid(output.preview.images, container);
    return;
  }
  if (output.preview?.type === "table") {
    renderTablePreview(output.preview, container);
    return;
  }
  if (type === "application/pdf" || name.endsWith(".pdf")) {
    const frame = document.createElement("iframe");
    frame.title = `Preview of ${output.name}`;
    frame.src = url;
    container.append(frame);
    return;
  }
  if (type.startsWith("image/") || /\.(jpe?g|png|webp)$/i.test(name)) {
    const image = document.createElement("img");
    image.alt = `Preview of ${output.name}`;
    image.src = url;
    container.append(image);
    return;
  }
  if (type.startsWith("text/") || /\.(txt|csv|json)$/i.test(name)) {
    const pre = document.createElement("pre");
    pre.textContent = truncateText(await output.blob.text(), 1600);
    container.append(pre);
    return;
  }
  if (name.endsWith(".zip")) {
    const summary = document.createElement("div");
    summary.className = "preview-summary";
    summary.textContent = "Archive generated. Download to open the converted files inside.";
    container.append(summary);
    return;
  }

  const summary = document.createElement("div");
  summary.className = "preview-summary";
  summary.innerHTML = `<strong>${escapeHtml(selectedTool.name)} completed</strong><span>${escapeHtml(outputKind(output))} output ${index + 1} is ready.</span>`;
  container.append(summary);
}

function renderPagePreview(pages, container) {
  const previewPages = pages.slice(0, 4);
  const wrap = document.createElement("div");
  wrap.className = "page-preview-grid";
  for (const page of previewPages) {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = page.imageDataUrl;
    image.alt = `Converted page ${page.number}`;
    const caption = document.createElement("figcaption");
    caption.textContent = `Page ${page.number}`;
    figure.append(image, caption);
    wrap.append(figure);
  }
  container.append(wrap);
  if (pages.length > previewPages.length) {
    const note = document.createElement("p");
    note.className = "preview-note";
    note.textContent = `Showing ${previewPages.length} of ${pages.length} converted pages.`;
    container.append(note);
  }
}

function renderImagePreviewGrid(images, container) {
  const previewImages = images.slice(0, 6);
  const wrap = document.createElement("div");
  wrap.className = "image-preview-grid";
  for (const imageData of previewImages) {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = imageData.src;
    image.alt = imageData.label;
    const caption = document.createElement("figcaption");
    caption.textContent = imageData.label;
    figure.append(image, caption);
    wrap.append(figure);
  }
  container.append(wrap);
  if (images.length > previewImages.length) {
    const note = document.createElement("p");
    note.className = "preview-note";
    note.textContent = `Showing ${previewImages.length} of ${images.length} generated images.`;
    container.append(note);
  }
}

function renderTablePreview(preview, container) {
  const table = document.createElement("table");
  table.className = "preview-table";
  const head = document.createElement("thead");
  head.innerHTML = `<tr>${preview.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>`;
  const body = document.createElement("tbody");
  for (const row of preview.rows.slice(0, 12)) {
    body.innerHTML += `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`;
  }
  table.append(head, body);
  container.append(table);
  if (preview.rows.length > 12) {
    const note = document.createElement("p");
    note.className = "preview-note";
    note.textContent = `Showing 12 of ${preview.rows.length} rows.`;
    container.append(note);
  }
}

function clearOutputUrls() {
  outputUrls.forEach((url) => URL.revokeObjectURL(url));
  outputUrls = [];
}

function outputKind(output) {
  const name = output.name.toLowerCase();
  if (name.endsWith(".docx") || name.endsWith(".doc")) return "Word document";
  if (name.endsWith(".ppt") || name.endsWith(".pptx")) return "PowerPoint file";
  if (name.endsWith(".xls") || name.endsWith(".xlsx")) return "Excel file";
  if (name.endsWith(".zip")) return "ZIP archive";
  if (name.endsWith(".pdf")) return "PDF";
  return output.blob.type || "converted file";
}

function createJobRecord(status) {
  const record = {
    id: createId(),
    operation: selectedTool.id,
    toolName: selectedTool.name,
    status,
    fileCount: selectedFiles.length,
    fileNames: selectedFiles.map((file) => file.name),
    outputCount: 0,
    durationMs: null,
    safeErrorCode: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  jobHistory = [record, ...jobHistory].slice(0, 20);
  persistLocalHistory();
  renderHistory();
  return record;
}

function safeCreateJobRecord(status) {
  try {
    return createJobRecord(status);
  } catch (error) {
    console.warn("Job history unavailable; continuing without metadata.", error);
    return null;
  }
}

function updateJobRecord(id, changes) {
  try {
    jobHistory = jobHistory.map((job) => (job.id === id ? { ...job, ...changes, updatedAt: new Date().toISOString() } : job));
    persistLocalHistory();
    renderHistory();
  } catch (error) {
    console.warn("Unable to update job history.", error);
  }
}

function renderHistory() {
  if (!historyList || !metricTotal || !metricCompleted || !metricFailed || !metricMode) return;
  if (!jobHistory.length) {
    historyList.innerHTML = `<p>No jobs yet.</p>`;
  } else {
    historyList.innerHTML = "";
    for (const job of jobHistory) {
      const item = document.createElement("div");
      item.className = `history-item ${job.status}`;
      item.innerHTML = `
        <div>
          <strong>${escapeHtml(job.toolName)}</strong>
          <small>${escapeHtml(job.status)} - ${job.fileCount} file(s) - ${new Date(job.createdAt).toLocaleString()}</small>
        </div>
        <span>${job.durationMs ? `${job.durationMs} ms` : "Live"}</span>
      `;
      historyList.append(item);
    }
  }
  const completed = jobHistory.filter((job) => job.status === "completed").length;
  const failed = jobHistory.filter((job) => job.status === "failed").length;
  metricTotal.textContent = String(jobHistory.length);
  metricCompleted.textContent = String(completed);
  metricFailed.textContent = String(failed);
  metricMode.textContent = "Browser";
}

function loadLocalHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem("ourpdf.jobs") || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistLocalHistory() {
  try {
    localStorage.setItem("ourpdf.jobs", JSON.stringify(jobHistory));
  } catch (error) {
    console.warn("Local job history could not be saved.", error);
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
  const images = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const canvas = await renderPdfPageToCanvas(pdf, pageNumber, scale);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
    zip.file(`page-${pageNumber}.jpg`, blob);
    images.push({ label: `Page ${pageNumber}.jpg`, src: canvas.toDataURL("image/jpeg", 0.82) });
  }
  return [{ name: "pdf-pages-jpg.zip", blob: await zip.generateAsync({ type: "blob" }), preview: { type: "images", images } }];
}

async function pdfToWord(files) {
  const data = await extractPdfForOffice(files[0]);
  const blob = await buildLayoutDocx(files[0].name, data.pages);
  return [{ name: replaceExtension(files[0].name, ".docx"), blob, preview: officePagePreview(data.pages) }];
}

async function pdfToPowerPoint(files) {
  const data = await extractPdfForOffice(files[0]);
  const slides = data.pages
    .map(
      (page) => `
        <section style="width:960px;height:540px;page-break-after:always;padding:24px;font-family:Arial,sans-serif;">
          <h1 style="font-size:24px;margin:0 0 16px;">Page ${page.number}</h1>
          <img src="${page.imageDataUrl}" alt="Page ${page.number}" style="max-width:912px;max-height:420px;display:block;margin-bottom:12px;" />
          <p style="font-size:12px;white-space:pre-wrap;">${escapeHtml(page.text.slice(0, 900))}</p>
        </section>
      `,
    )
    .join("");
  return [
    {
      name: replaceExtension(files[0].name, ".ppt"),
      blob: new Blob([officeHtmlDocument(files[0].name, slides)], { type: "application/vnd.ms-powerpoint" }),
      preview: officePagePreview(data.pages),
    },
  ];
}

async function pdfToExcel(files) {
  const data = await extractPdfText(files[0]);
  const previewRows = [];
  const rows = data.pages
    .flatMap((page) =>
      page.lines.map(
        (line, index) => {
          previewRows.push([String(page.number), String(index + 1), line]);
          return `<tr><td>${page.number}</td><td>${index + 1}</td><td>${escapeHtml(line)}</td></tr>`;
        },
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
  return [
    {
      name: replaceExtension(files[0].name, ".xls"),
      blob: new Blob([workbook], { type: "application/vnd.ms-excel" }),
      preview: { type: "table", headers: ["Page", "Line", "Text"], rows: previewRows },
    },
  ];
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
    options: redactSensitiveOptions(options),
    nextStep:
      "Send this safe metadata and a temporary object reference to a secure worker. Do not store document bytes.",
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
    `${selectedTool.name} needs a secure server worker for production-grade encryption/decryption. Configure a worker endpoint before enabling this action.`,
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
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(" ").replace(/\s+/g, " ").trim();
    const canvas = await renderPdfPageToCanvas(pdf, pageNumber, 2);
    const image = await canvasToBlob(canvas, "image/jpeg", 0.92);
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.84);
    pages.push({ number: pageNumber, text, image, imageDataUrl, widthPt: viewport.width, heightPt: viewport.height });
  }
  return { pages };
}

function officePagePreview(pages) {
  return {
    type: "pages",
    pages: pages.map((page) => ({
      number: page.number,
      text: page.text,
      imageDataUrl: page.imageDataUrl,
    })),
  };
}

async function buildLayoutDocx(sourceName, pages) {
  const zip = new JSZip();
  zip.file("[Content_Types].xml", docxContentTypes(pages));
  zip.folder("_rels").file(".rels", docxRootRelationships());
  zip.folder("docProps").file("core.xml", docxCoreProperties(sourceName));
  zip.folder("docProps").file("app.xml", docxAppProperties(pages.length));

  const word = zip.folder("word");
  word.file("document.xml", docxDocumentXml(sourceName, pages));
  word.folder("_rels").file("document.xml.rels", docxDocumentRelationships(pages));

  const media = word.folder("media");
  for (const page of pages) {
    media.file(`page-${page.number}.jpg`, page.image);
  }

  return zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    compression: "DEFLATE",
  });
}

function docxDocumentXml(sourceName, pages) {
  const body = pages.map((page, index) => docxPageXml(page, index < pages.length - 1)).join("");
  const finalPage = pages.at(-1) ?? { widthPt: 612, heightPt: 792 };
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
  xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
  xmlns:w10="urn:schemas-microsoft-com:office:word"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
  xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
  mc:Ignorable="w14 wp14">
  <w:body>
    ${body}
    <w:sectPr>
      ${docxPageSection(finalPage)}
    </w:sectPr>
  </w:body>
</w:document>`;
}

function docxPageXml(page, addBreak) {
  const widthEmu = pointsToEmu(page.widthPt);
  const heightEmu = pointsToEmu(page.heightPt);
  const alt = escapeHtml(truncateText(`Page ${page.number} from PDF. ${page.text || "No selectable text detected."}`, 500));
  return `
    <w:p>
      <w:pPr>
        <w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/>
      </w:pPr>
      <w:r>
        <w:drawing>
          <wp:inline distT="0" distB="0" distL="0" distR="0">
            <wp:extent cx="${widthEmu}" cy="${heightEmu}"/>
            <wp:effectExtent l="0" t="0" r="0" b="0"/>
            <wp:docPr id="${page.number}" name="PDF page ${page.number}" descr="${alt}"/>
            <wp:cNvGraphicFramePr>
              <a:graphicFrameLocks noChangeAspect="1"/>
            </wp:cNvGraphicFramePr>
            <a:graphic>
              <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                <pic:pic>
                  <pic:nvPicPr>
                    <pic:cNvPr id="${page.number}" name="page-${page.number}.jpg" descr="${alt}"/>
                    <pic:cNvPicPr/>
                  </pic:nvPicPr>
                  <pic:blipFill>
                    <a:blip r:embed="rIdImage${page.number}" cstate="print"/>
                    <a:stretch><a:fillRect/></a:stretch>
                  </pic:blipFill>
                  <pic:spPr>
                    <a:xfrm>
                      <a:off x="0" y="0"/>
                      <a:ext cx="${widthEmu}" cy="${heightEmu}"/>
                    </a:xfrm>
                    <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
                  </pic:spPr>
                </pic:pic>
              </a:graphicData>
            </a:graphic>
          </wp:inline>
        </w:drawing>
      </w:r>
    </w:p>
    ${addBreak ? `<w:p><w:pPr><w:sectPr><w:type w:val="nextPage"/>${docxPageSection(page)}</w:sectPr></w:pPr></w:p>` : ""}`;
}

function docxPageSection(page) {
  return `
      <w:pgSz w:w="${pointsToTwips(page.widthPt)}" w:h="${pointsToTwips(page.heightPt)}"/>
      <w:pgMar w:top="0" w:right="0" w:bottom="0" w:left="0" w:header="0" w:footer="0" w:gutter="0"/>
      <w:cols w:space="0"/>
      <w:docGrid w:linePitch="360"/>`;
}

function docxContentTypes(pages) {
  const imageOverrides = pages
    .map((page) => `<Override PartName="/word/media/page-${page.number}.jpg" ContentType="image/jpeg"/>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="jpg" ContentType="image/jpeg"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  ${imageOverrides}
</Types>`;
}

function docxRootRelationships() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;
}

function docxDocumentRelationships(pages) {
  const relationships = pages
    .map(
      (page) =>
        `<Relationship Id="rIdImage${page.number}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/page-${page.number}.jpg"/>`,
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${relationships}</Relationships>`;
}

function docxCoreProperties(sourceName) {
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:dcterms="http://purl.org/dc/terms/"
  xmlns:dcmitype="http://purl.org/dc/dcmitype/"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>${escapeHtml(sourceName)}</dc:title>
  <dc:creator>Our PDF</dc:creator>
  <cp:lastModifiedBy>Our PDF</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
</cp:coreProperties>`;
}

function docxAppProperties(pageCount) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"
  xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Our PDF</Application>
  <Pages>${pageCount}</Pages>
</Properties>`;
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

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Unable to render PDF page image."));
      }
    }, type, quality);
  });
}

function pointsToTwips(points) {
  return Math.round(points * 20);
}

function pointsToEmu(points) {
  return Math.round(points * 12700);
}

async function sha256(buffer) {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function createId() {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.randomUUID) return cryptoApi.randomUUID();
  const bytes = cryptoApi?.getRandomValues ? cryptoApi.getRandomValues(new Uint8Array(16)) : null;
  if (!bytes) return `job-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return [...bytes].map((byte, index) => `${index === 4 || index === 6 || index === 8 || index === 10 ? "-" : ""}${byte.toString(16).padStart(2, "0")}`).join("");
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function isMergeTool() {
  return selectedTool.id === "merge";
}

function ordinal(value) {
  const suffixes = ["th", "st", "nd", "rd"];
  const remainder = value % 100;
  return `${value}${suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function truncateText(value, maxLength) {
  const text = String(value).replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
}

function replaceExtension(fileName, extension) {
  return fileName.replace(/\.[^.]+$/, "") + extension;
}
