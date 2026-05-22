import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.cwd());
const port = Number(process.env.PORT ?? 4173);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".json": "application/json; charset=utf-8",
  ".sql": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = resolve(join(root, normalize(decodeURIComponent(requestedPath))));

  if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": contentTypes[extname(filePath)] ?? "application/octet-stream",
    "cache-control": "no-store",
  });
  createReadStream(filePath).pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`Static server running at http://127.0.0.1:${port}`);
});
