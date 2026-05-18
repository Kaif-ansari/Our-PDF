import { ZERO_PERSISTENCE } from "../config/security";
import { safeErrorCode, safeLog } from "../security/safeLogger";
import { TemporaryStorageAdapter } from "../storage/temporaryR2Storage";

export interface JobMetadataStore {
  findFailedJobObjectKeys(): Promise<string[]>;
  findOrphanObjectKeys(): Promise<string[]>;
  markObjectsDeleted(keys: string[], deletedAt: Date): Promise<void>;
}

export async function runCleanupOnce(
  storage: TemporaryStorageAdapter,
  jobs: JobMetadataStore,
): Promise<void> {
  const expiredBefore = new Date(Date.now() - ZERO_PERSISTENCE.maxRetentionSeconds * 1000);
  const objectKeys = new Set<string>([
    ...(await storage.listExpiredObjects(expiredBefore)),
    ...(await jobs.findFailedJobObjectKeys()),
    ...(await jobs.findOrphanObjectKeys()),
  ]);

  const deleted: string[] = [];

  for (const key of objectKeys) {
    try {
      await storage.deleteObject(key);
      deleted.push(key);
    } catch (error) {
      safeLog("cleanup.delete_failed", {
        errorCode: safeErrorCode(error),
      });
    }
  }

  if (deleted.length > 0) {
    await jobs.markObjectsDeleted(deleted, new Date());
  }

  safeLog("cleanup.completed", {
    deletedObjectCount: deleted.length,
  });
}

export function cleanupIntervalMs(): number {
  return ZERO_PERSISTENCE.cleanupIntervalSeconds * 1000;
}

