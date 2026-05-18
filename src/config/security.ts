export const ZERO_PERSISTENCE = {
  maxRetentionSeconds: 15 * 60,
  cleanupIntervalSeconds: 5 * 60,
  uploadPrefix: "/temp/uploads",
  resultPrefix: "/temp/results",
  signedUploadUrlTtlSeconds: 5 * 60,
  signedDownloadUrlTtlSeconds: 3 * 60,
} as const;

export const PRIVACY_MESSAGES = {
  autoDelete: "Files are automatically deleted after processing.",
  noPermanentStorage: "No uploaded documents are permanently stored.",
  privateFiles: "Your files remain private.",
  noContentRetained: "No file contents are retained.",
} as const;

export const FORBIDDEN_PERSISTENT_FIELDS = [
  "uploaded_file_bytes",
  "generated_file_bytes",
  "pdf_content",
  "ocr_text",
  "image_content",
  "preview_content",
  "thumbnail_bytes",
  "permanent_file_url",
  "archive_path",
] as const;

export const ALLOWED_LOG_FIELDS = [
  "jobId",
  "userId",
  "status",
  "operation",
  "durationMs",
  "errorCode",
  "workerId",
  "queueDepth",
  "deletedObjectCount",
  "metricName",
  "metricValue",
] as const;

export type Plan = "free" | "premium";

export const PLAN_LIMITS: Record<
  Plan,
  {
    uploadsPerHour: number;
    maxFileSizeBytes: number;
    ocrRequestsPerHour: number;
    concurrentJobs: number;
  }
> = {
  free: {
    uploadsPerHour: 5,
    maxFileSizeBytes: 25 * 1024 * 1024,
    ocrRequestsPerHour: 3,
    concurrentJobs: 1,
  },
  premium: {
    uploadsPerHour: 100,
    maxFileSizeBytes: 250 * 1024 * 1024,
    ocrRequestsPerHour: 100,
    concurrentJobs: 5,
  },
};

export function expiresAtFromNow(ttlSeconds: number): Date {
  return new Date(Date.now() + ttlSeconds * 1000);
}

export function assertTemporaryObjectKey(key: string): void {
  const allowed =
    key.startsWith(`${ZERO_PERSISTENCE.uploadPrefix}/`) ||
    key.startsWith(`${ZERO_PERSISTENCE.resultPrefix}/`);

  if (!allowed) {
    throw new Error("Object key must use a temporary zero-persistence prefix.");
  }
}
