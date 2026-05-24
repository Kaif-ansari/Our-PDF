import { cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const output = join(root, "public");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const item of ["index.html", "app.js", "styles.css", "assets", "_headers", "_redirects"]) {
  await cp(join(root, item), join(output, item), { recursive: true });
}

console.log("Static site written to public/");
