import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, relative, resolve } from "node:path";

const cwd = resolve(process.cwd());
const publicRoot = resolve(join(cwd, "public"));
const root = existsSync(join(publicRoot, "index.html")) ? publicRoot : cwd;
const port = Number(process.env.PORT ?? 4173);
const STREAM_CHUNK_BYTES = 64 * 1024;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".sql": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

const securityHeaders = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://tagmanager.google.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://partner.googleadservices.com https://tpc.googlesyndication.com; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com https://stats.g.doubleclick.net https://ssl.gstatic.com https://www.gstatic.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com; font-src 'self'; connect-src 'self' https://vitals.vercel-insights.com https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://ep1.adtrafficquality.google; frame-src 'self' blob: https://www.googletagmanager.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://pagead2.googlesyndication.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), clipboard-read=(), clipboard-write=(self)",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-Permitted-Cross-Domain-Policies": "none",
};

function getCacheControl(pathname) {
  if (pathname === "/index.html") {
    return "public, max-age=0, must-revalidate";
  }

  if (["/sitemap.xml", "/robots.txt", "/ads.txt", "/llms.txt"].includes(pathname)) {
    return "public, max-age=0, must-revalidate";
  }

  if (pathname === "/site.webmanifest") {
    return "public, max-age=86400, stale-while-revalidate=604800";
  }

  if (pathname.startsWith("/assets/")) {
    return "public, max-age=31536000, immutable";
  }

  if (pathname.startsWith("/vendor/") || pathname === "/app.js" || pathname === "/styles.css" || pathname === "/theme.js") {
    return "public, max-age=31536000, immutable";
  }

  return "public, max-age=3600, stale-while-revalidate=86400";
}

createServer((request, response) => {
  if (!["GET", "HEAD"].includes(request.method ?? "GET")) {
    response.writeHead(405, {
      "allow": "GET, HEAD",
      "content-type": "text/plain; charset=utf-8",
      ...securityHeaders,
    });
    response.end("Method not allowed");
    return;
  }

  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
  if (/^\/.+\/sitemap\.xml\/?$/.test(url.pathname)) {
    response.writeHead(301, {
      location: "/sitemap.xml",
      ...securityHeaders,
    });
    response.end();
    return;
  }

  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  let filePath = resolve(join(root, normalize(decodeURIComponent(requestedPath))));
  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = resolve(join(filePath, "index.html"));
  }
  const relativePath = relative(root, filePath);

  if (relativePath.startsWith("..") || relativePath === "" || resolve(relativePath) === relativePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8", ...securityHeaders });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": contentTypes[extname(filePath)] ?? "application/octet-stream",
    "cache-control": getCacheControl(requestedPath),
    ...securityHeaders,
  });
  if (request.method === "HEAD") {
    response.end();
    return;
  }

  createReadStream(filePath, { highWaterMark: STREAM_CHUNK_BYTES }).pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`Static server running at http://127.0.0.1:${port}`);
});
