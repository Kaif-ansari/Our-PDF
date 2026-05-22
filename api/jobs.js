import { randomUUID } from "node:crypto";

const allowedOperations = new Set([
  "merge",
  "split",
  "remove-pages",
  "extract-pages",
  "compress",
  "repair",
  "jpg-to-pdf",
  "pdf-to-word",
  "pdf-to-powerpoint",
  "pdf-to-excel",
  "pdf-to-jpg",
  "word-to-pdf",
  "powerpoint-to-pdf",
  "excel-to-pdf",
  "rotate",
  "watermark",
  "page-numbers",
  "crop",
  "sign",
  "redact",
  "protect",
  "unlock",
  "compare",
  "ocr",
  "summarize",
]);

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("allow", "POST");
    response.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const body = request.body ?? {};
  if (!allowedOperations.has(body.operation)) {
    response.status(400).json({ error: "invalid_operation" });
    return;
  }

  response.status(202).json({
    jobId: randomUUID(),
    status: "created",
    operation: body.operation,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    storagePolicy: "temporary-metadata-only",
  });
}
