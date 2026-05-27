import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const output = join(root, "public");
const siteUrl = "https://www.cloudpdf.online";
const builtAt = new Date().toISOString();

const toolPages = [
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    title: "Merge PDF Online Free - Combine PDF Files | Our PDF",
    description: "Merge PDF files online in your browser. Add multiple PDFs, arrange them in order, and download one combined PDF file with Our PDF.",
    intent: "combine multiple PDF files into one organized document",
    keywords: ["merge PDF", "combine PDF files", "join PDF online", "free PDF merger"],
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    title: "Compress PDF Online Free - Reduce PDF File Size | Our PDF",
    description: "Compress PDF files online with a fast browser-based optimizer. Reduce PDF file size and download an optimized document.",
    intent: "reduce PDF file size for sharing, upload forms, and email attachments",
    keywords: ["compress PDF", "reduce PDF size", "PDF compressor", "make PDF smaller"],
  },
  {
    slug: "repair-pdf",
    name: "Repair PDF",
    title: "Repair PDF Online Free - Rewrite PDF Structure | Our PDF",
    description: "Repair PDF files online by reopening and rewriting the document structure in your browser.",
    intent: "try to rebuild a PDF file structure for a cleaner downloadable copy",
    keywords: ["repair PDF", "fix PDF", "rewrite PDF", "PDF repair tool"],
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    title: "Split PDF Online Free - Extract PDF Pages | Our PDF",
    description: "Split PDF pages online, export page ranges, and create smaller PDF files from one document with Our PDF.",
    intent: "separate a PDF into page ranges or individual files",
    keywords: ["split PDF", "extract PDF pages", "separate PDF", "PDF splitter"],
  },
  {
    slug: "remove-pages-from-pdf",
    name: "Remove PDF Pages",
    title: "Remove Pages from PDF Online Free | Our PDF",
    description: "Remove unwanted pages from a PDF online. Choose page numbers, delete them in your browser, and download a cleaner PDF file.",
    intent: "delete selected pages from a PDF document",
    keywords: ["remove PDF pages", "delete pages from PDF", "PDF page remover", "remove pages online"],
  },
  {
    slug: "extract-pdf-pages",
    name: "Extract PDF Pages",
    title: "Extract PDF Pages Online Free | Our PDF",
    description: "Extract pages from a PDF online and save selected page ranges as a new PDF file in your browser.",
    intent: "save selected PDF pages as a separate document",
    keywords: ["extract PDF pages", "save PDF pages", "PDF page extractor", "extract pages online"],
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    title: "PDF to JPG Converter Online Free | Our PDF",
    description: "Convert PDF pages to JPG images online. Render PDF pages into downloadable image files from your browser.",
    intent: "turn PDF pages into shareable JPG images",
    keywords: ["PDF to JPG", "convert PDF to image", "PDF image converter", "PDF to JPEG"],
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    title: "JPG to PDF Converter Online Free | Our PDF",
    description: "Convert JPG and PNG images to PDF online. Build one PDF from multiple images with a simple browser tool.",
    intent: "create a PDF from JPG or PNG image files",
    keywords: ["JPG to PDF", "image to PDF", "PNG to PDF", "convert images to PDF"],
  },
  {
    slug: "pdf-to-word",
    name: "PDF to Word",
    title: "PDF to Word Converter Online Free | Our PDF",
    description: "Convert PDF pages to a Word-compatible DOCX file online using a private browser-based PDF converter.",
    intent: "export PDF pages into a Word document",
    keywords: ["PDF to Word", "PDF to DOCX", "convert PDF to Word", "online PDF converter"],
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    title: "Word to PDF Converter Online Free | Our PDF",
    description: "Convert Word DOCX files to PDF online and download a browser-generated PDF copy of your document.",
    intent: "turn a Word document into a PDF",
    keywords: ["Word to PDF", "DOCX to PDF", "convert Word to PDF", "online PDF converter"],
  },
  {
    slug: "pdf-to-excel",
    name: "PDF to Excel",
    title: "PDF to Excel Converter Online Free | Our PDF",
    description: "Convert extracted PDF text into an Excel-compatible workbook online with a browser-based PDF converter.",
    intent: "export PDF content into a spreadsheet format",
    keywords: ["PDF to Excel", "PDF to XLS", "convert PDF to spreadsheet", "PDF table export"],
  },
  {
    slug: "excel-to-pdf",
    name: "Excel to PDF",
    title: "Excel to PDF Converter Online Free | Our PDF",
    description: "Convert Excel workbook content to PDF online and download a browser-generated PDF document.",
    intent: "turn spreadsheet content into a PDF",
    keywords: ["Excel to PDF", "XLSX to PDF", "convert Excel to PDF", "spreadsheet to PDF"],
  },
  {
    slug: "pdf-to-powerpoint",
    name: "PDF to PowerPoint",
    title: "PDF to PowerPoint Converter Online Free | Our PDF",
    description: "Convert PDF pages to a PowerPoint-compatible slide deck online from your browser.",
    intent: "export PDF pages into a presentation file",
    keywords: ["PDF to PowerPoint", "PDF to PPT", "convert PDF to slides", "PDF presentation converter"],
  },
  {
    slug: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    title: "PowerPoint to PDF Converter Online Free | Our PDF",
    description: "Convert PowerPoint slides to PDF online and download a browser-generated PDF document.",
    intent: "turn presentation content into a PDF",
    keywords: ["PowerPoint to PDF", "PPT to PDF", "PPTX to PDF", "slides to PDF"],
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    title: "Rotate PDF Online Free - Turn PDF Pages | Our PDF",
    description: "Rotate PDF pages online by 90, 180, or 270 degrees and download a corrected PDF document.",
    intent: "fix sideways or upside-down PDF pages",
    keywords: ["rotate PDF", "turn PDF pages", "fix PDF orientation", "rotate PDF online"],
  },
  {
    slug: "watermark-pdf",
    name: "Watermark PDF",
    title: "Add Watermark to PDF Online Free | Our PDF",
    description: "Add a text watermark to PDF pages online. Stamp drafts, confidential files, invoices, and documents in your browser.",
    intent: "label PDF pages with reusable watermark text",
    keywords: ["watermark PDF", "add watermark to PDF", "stamp PDF", "PDF watermark tool"],
  },
  {
    slug: "add-page-numbers-to-pdf",
    name: "Add Page Numbers",
    title: "Add Page Numbers to PDF Online Free | Our PDF",
    description: "Add page numbers to PDF pages online and download a numbered PDF for review, printing, or sharing.",
    intent: "number the pages in a PDF document",
    keywords: ["add page numbers to PDF", "number PDF pages", "PDF page numbering", "insert page numbers PDF"],
  },
  {
    slug: "crop-pdf",
    name: "Crop PDF",
    title: "Crop PDF Online Free - Trim PDF Margins | Our PDF",
    description: "Crop PDF pages online by trimming page margins and downloading a cleaner PDF file from your browser.",
    intent: "trim PDF page margins",
    keywords: ["crop PDF", "trim PDF margins", "resize PDF pages", "PDF crop tool"],
  },
  {
    slug: "sign-pdf",
    name: "Sign PDF",
    title: "Sign PDF Online Free - Add a Signature | Our PDF",
    description: "Sign PDF documents online by placing a typed signature on your file and downloading the signed PDF.",
    intent: "add a simple signature to a PDF document",
    keywords: ["sign PDF", "PDF signature", "sign document online", "add signature to PDF"],
  },
  {
    slug: "redact-pdf",
    name: "Redact PDF",
    title: "Redact PDF Online Free - Cover Sensitive Text | Our PDF",
    description: "Redact PDF files online with a browser-based tool that applies a visible redaction band to pages.",
    intent: "cover sensitive areas before sharing a PDF",
    keywords: ["redact PDF", "hide PDF text", "remove sensitive PDF content", "PDF redaction"],
  },
  {
    slug: "compare-pdf",
    name: "Compare PDF",
    title: "Compare PDF Files Online Free | Our PDF",
    description: "Compare two PDF files online and download a text-based difference report from your browser.",
    intent: "review differences between two PDF documents",
    keywords: ["compare PDF", "PDF comparison", "compare documents online", "PDF diff"],
  },
  {
    slug: "extract-pdf-text",
    name: "Extract PDF Text",
    title: "Extract Text from PDF Online Free | Our PDF",
    description: "Extract selectable text from PDF pages online and download a text export for summaries, notes, and review.",
    intent: "copy selectable PDF text into a downloadable text file",
    keywords: ["extract PDF text", "PDF text extractor", "copy text from PDF", "PDF OCR preview"],
  },
  {
    slug: "summarize-pdf",
    name: "Summarize PDF",
    title: "Summarize PDF Online Free - Local PDF Summary | Our PDF",
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

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const item of ["index.html", "app.js", "styles.css", "assets", "_headers", "_redirects", "site.webmanifest"]) {
  await cp(join(root, item), join(output, item), { recursive: true });
}

await writeFile(join(output, "robots.txt"), buildRobots(), "utf8");
await writeFile(join(output, "sitemap.xml"), buildSitemap(), "utf8");
await writeFile(join(output, "llms.txt"), buildLlmsTxt(), "utf8");

for (const tool of toolPages) {
  const dir = join(output, "tools", tool.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), buildToolPage(tool), "utf8");
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

  return `# Our PDF

Our PDF is a free browser-based PDF toolkit for common document tasks. It helps users merge PDF files, compress PDF files, split PDF pages, convert PDF to JPG, convert JPG to PDF, rotate pages, add watermarks, sign PDFs, redact PDFs, compare PDFs, and extract PDF text.

## Primary Pages

- [Homepage](${siteUrl}/): Online PDF tools workspace and directory.
- [Sitemap](${siteUrl}/sitemap.xml): XML sitemap for crawl discovery.
- [Robots](${siteUrl}/robots.txt): Crawl policy.

## PDF Tool Pages

${toolLines}

## Entity Summary

- Brand: Our PDF
- Category: Online PDF tools, browser PDF converter, document productivity software
- Processing model: Browser-based PDF processing for supported tools
- Audience: Students, freelancers, office workers, small businesses, and anyone editing PDFs online
`;
}

function buildToolPage(tool) {
  const url = `${siteUrl}/tools/${tool.slug}/`;
  const appToolId = appToolIdsBySlug[tool.slug] ?? "merge";
  const encodedAppToolId = encodeURIComponent(appToolId);
  const relatedLinks = toolPages
    .filter((item) => item.slug !== tool.slug)
    .slice(0, 6)
    .map((item) => `<a href="/tools/${item.slug}/">${escapeHtml(item.name)}</a>`)
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
          mainEntity: [
            {
              "@type": "Question",
              name: `Is ${tool.name} free to use?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: `Yes. ${tool.name} is available as part of the free Our PDF browser toolkit.`,
              },
            },
            {
              "@type": "Question",
              name: `What is ${tool.name} used for?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: `${tool.name} helps users ${tool.intent}.`,
              },
            },
          ],
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
    <link rel="canonical" href="${url}" />
    <link rel="icon" type="image/png" href="/assets/ourpdf-current-favicon.png?v=1" />
    <link rel="apple-touch-icon" href="/assets/ourpdf-current-favicon.png?v=1" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Our PDF" />
    <meta property="og:title" content="${escapeHtml(tool.title)}" />
    <meta property="og:description" content="${escapeHtml(tool.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${siteUrl}/assets/ourpdf-new-logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(tool.title)}" />
    <meta name="twitter:description" content="${escapeHtml(tool.description)}" />
    <meta name="twitter:image" content="${siteUrl}/assets/ourpdf-new-logo.png" />
    <script>
      (() => {
        const saved = localStorage.getItem("ourpdf.theme");
        const theme = saved === "dark" || saved === "light"
          ? saved
          : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        document.documentElement.dataset.theme = theme;
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#10131a" : "#fffaf2");
    })();
  </script>
    <link rel="stylesheet" href="/styles.css?v=black-dropzone" />
    <script defer src="/_vercel/speed-insights/script.js" data-sdkn="@vercel/speed-insights" data-sdkv="2.0.0"></script>
    <script type="application/ld+json">${jsonLd.replace(/</g, "\\u003c")}</script>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-T7KM2D5G');</script>
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-MXLF769M');</script>
    <!-- End Google Tag Manager -->
  </head>
  <body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T7KM2D5G"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MXLF769M"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <header class="topbar">
      <a class="brand" href="/" aria-label="Our PDF home">
        <img class="brand-logo" src="/assets/ourpdf-current-logo.png?v=1" alt="" width="56" height="36" aria-hidden="true" />
        <span>Our PDF</span>
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
          <h1 id="tool-title">${escapeHtml(tool.name)} online</h1>
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
      <section class="seo-section" aria-labelledby="related-title">
        <div class="section-heading">
          <p class="eyebrow">Related tools</p>
          <h2 id="related-title">More online PDF tools from Our PDF.</h2>
        </div>
        <div class="seo-link-grid">${relatedLinks}</div>
      </section>
    </main>
    <footer class="site-footer">
      <strong>Our PDF</strong>
    </footer>
    <script>
      (() => {
        const themeToggle = document.querySelector("#theme-toggle");
        const applyTheme = (theme) => {
          document.documentElement.dataset.theme = theme;
          localStorage.setItem("ourpdf.theme", theme);
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
            localStorage.setItem("ourpdf.initialTool", link.dataset.initialTool || "merge");
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
