import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const output = join(root, "public");
const siteUrl = "https://our-pdf-beryl.vercel.app";
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
    slug: "split-pdf",
    name: "Split PDF",
    title: "Split PDF Online Free - Extract PDF Pages | Our PDF",
    description: "Split PDF pages online, export page ranges, and create smaller PDF files from one document with Our PDF.",
    intent: "separate a PDF into page ranges or individual files",
    keywords: ["split PDF", "extract PDF pages", "separate PDF", "PDF splitter"],
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
    slug: "extract-pdf-text",
    name: "Extract PDF Text",
    title: "Extract Text from PDF Online Free | Our PDF",
    description: "Extract selectable text from PDF pages online and download a text export for summaries, notes, and review.",
    intent: "copy selectable PDF text into a downloadable text file",
    keywords: ["extract PDF text", "PDF text extractor", "copy text from PDF", "PDF OCR preview"],
  },
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const item of ["index.html", "app.js", "styles.css", "assets", "_headers", "_redirects", "site.webmanifest"]) {
  await cp(join(root, item), join(output, item), { recursive: true });
}

await writeFile(join(output, "robots.txt"), buildRobots(), "utf8");
await writeFile(join(output, "sitemap.xml"), buildSitemap(), "utf8");

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

function buildToolPage(tool) {
  const url = `${siteUrl}/tools/${tool.slug}/`;
  const relatedLinks = toolPages
    .filter((item) => item.slug !== tool.slug)
    .slice(0, 6)
    .map((item) => `<a href="/tools/${item.slug}/">${escapeHtml(item.name)}</a>`)
    .join("");

  const keywordList = tool.keywords.map((keyword) => `<li>${escapeHtml(keyword)}</li>`).join("");
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
    <link rel="canonical" href="${url}" />
    <link rel="icon" type="image/png" href="/assets/ourpdf-logo-red.png" />
    <link rel="apple-touch-icon" href="/assets/ourpdf-logo-red.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Our PDF" />
    <meta property="og:title" content="${escapeHtml(tool.title)}" />
    <meta property="og:description" content="${escapeHtml(tool.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${siteUrl}/assets/ourpdf-logo-red.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(tool.title)}" />
    <meta name="twitter:description" content="${escapeHtml(tool.description)}" />
    <meta name="twitter:image" content="${siteUrl}/assets/ourpdf-logo-red.png" />
    <link rel="stylesheet" href="/styles.css" />
    <script type="application/ld+json">${jsonLd.replace(/</g, "\\u003c")}</script>
  </head>
  <body>
    <header class="topbar">
      <a class="brand" href="/" aria-label="Our PDF home">
        <img class="brand-logo" src="/assets/ourpdf-logo-red.png" alt="" width="48" height="38" aria-hidden="true" />
        <span>Our PDF</span>
      </a>
      <nav class="nav-links" aria-label="Primary navigation">
        <a href="/#tools">Tools</a>
        <a href="/#pdf-converter">Converters</a>
        <a href="/#faq">FAQ</a>
        <a href="/#workspace">Workspace</a>
      </nav>
      <a class="primary-link" href="/#workspace">Start</a>
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
            <a class="button primary" href="/#workspace">Open ${escapeHtml(tool.name)}</a>
            <a class="button secondary" href="/#tools">Browse all PDF tools</a>
          </div>
        </div>
        <div class="hero-panel" aria-label="${escapeHtml(tool.name)} highlights">
          <h2>${escapeHtml(tool.name)} keywords</h2>
          <ul class="keyword-list">${keywordList}</ul>
        </div>
      </section>
      <section class="seo-section" aria-labelledby="how-title">
        <div class="section-heading">
          <p class="eyebrow">How it works</p>
          <h2 id="how-title">A simple workflow for ${escapeHtml(tool.name.toLowerCase())}.</h2>
        </div>
        <div class="faq-grid">
          <article><h3>1. Choose your file</h3><p>Open the Our PDF workspace and select the PDF or image files needed for this task.</p></article>
          <article><h3>2. Adjust options</h3><p>Use the available controls for page ranges, order, conversion quality, labels, or document settings.</p></article>
          <article><h3>3. Download the result</h3><p>Process the file in the browser and download the finished document when the preview is ready.</p></article>
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
      <nav aria-label="Footer navigation">
        <a href="/sitemap.xml">Sitemap</a>
        <a href="/robots.txt">Robots</a>
        <a href="/#tools">All PDF tools</a>
      </nav>
    </footer>
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
