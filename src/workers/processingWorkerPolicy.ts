import { rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { safeErrorCode, safeLog } from "../security/safeLogger";
import { deleteTemporaryObject, TemporaryStorageAdapter } from "../storage/temporaryR2Storage";

export interface ProcessingJob {
  jobId: string;
  uploadKey: string;
  resultKey?: string;
}

export async function withIsolatedTempDirectory<T>(
  jobId: string,
  processJob: (tempDir: string) => Promise<T>,
): Promise<T> {
  const tempDir = resolve(join(tmpdir(), "zero-persistence-pdf", jobId));

  try {
    return await processJob(tempDir);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

export async function handleProcessingFailure(
  storage: TemporaryStorageAdapter,
  job: ProcessingJob,
  error: unknown,
): Promise<void> {
  await deleteTemporaryObject(storage, job.uploadKey);

  if (job.resultKey) {
    await deleteTemporaryObject(storage, job.resultKey);
  }

  safeLog("worker.job_failed", {
    jobId: job.jobId,
    errorCode: safeErrorCode(error),
  });
}

export async function handleProcessingSuccess(
  storage: TemporaryStorageAdapter,
  job: ProcessingJob,
  durationMs: number,
): Promise<void> {
  await deleteTemporaryObject(storage, job.uploadKey);

  safeLog("worker.job_completed", {
    jobId: job.jobId,
    durationMs,
  });
}

