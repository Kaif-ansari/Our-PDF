import {
  ZERO_PERSISTENCE,
  assertTemporaryObjectKey,
  expiresAtFromNow,
} from "../config/security";

export type TemporaryObjectPurpose = "upload" | "result";

export interface TemporaryObjectMetadata {
  jobId: string;
  ownerId: string;
  purpose: TemporaryObjectPurpose;
  expiresAt: Date;
}

export interface SignedUrlRequest {
  key: string;
  contentType?: string;
  expiresInSeconds: number;
  metadata?: TemporaryObjectMetadata;
}

export interface TemporaryStorageAdapter {
  createSignedUploadUrl(request: SignedUrlRequest): Promise<string>;
  createSignedDownloadUrl(request: SignedUrlRequest): Promise<string>;
  deleteObject(key: string): Promise<void>;
  listExpiredObjects(before: Date): Promise<string[]>;
  getObjectMetadata(key: string): Promise<TemporaryObjectMetadata | null>;
}

export function createTemporaryUploadKey(jobId: string, objectId: string): string {
  return `${ZERO_PERSISTENCE.uploadPrefix}/${jobId}/${objectId}`;
}

export function createTemporaryResultKey(jobId: string, objectId: string): string {
  return `${ZERO_PERSISTENCE.resultPrefix}/${jobId}/${objectId}`;
}

export async function createUploadUrl(
  storage: TemporaryStorageAdapter,
  input: {
    jobId: string;
    ownerId: string;
    objectId: string;
    contentType: string;
  },
): Promise<{ key: string; uploadUrl: string; expiresAt: Date }> {
  const key = createTemporaryUploadKey(input.jobId, input.objectId);
  const expiresAt = expiresAtFromNow(ZERO_PERSISTENCE.signedUploadUrlTtlSeconds);

  assertTemporaryObjectKey(key);

  const uploadUrl = await storage.createSignedUploadUrl({
    key,
    contentType: input.contentType,
    expiresInSeconds: ZERO_PERSISTENCE.signedUploadUrlTtlSeconds,
    metadata: {
      jobId: input.jobId,
      ownerId: input.ownerId,
      purpose: "upload",
      expiresAt,
    },
  });

  return { key, uploadUrl, expiresAt };
}

export async function createDownloadUrl(
  storage: TemporaryStorageAdapter,
  input: {
    jobId: string;
    ownerId: string;
    objectId: string;
    key: string;
  },
): Promise<{ downloadUrl: string; expiresAt: Date }> {
  assertTemporaryObjectKey(input.key);

  const expiresAt = expiresAtFromNow(ZERO_PERSISTENCE.signedDownloadUrlTtlSeconds);
  const downloadUrl = await storage.createSignedDownloadUrl({
    key: input.key,
    expiresInSeconds: ZERO_PERSISTENCE.signedDownloadUrlTtlSeconds,
    metadata: {
      jobId: input.jobId,
      ownerId: input.ownerId,
      purpose: "result",
      expiresAt,
    },
  });

  return { downloadUrl, expiresAt };
}

export async function deleteTemporaryObject(
  storage: TemporaryStorageAdapter,
  key: string,
): Promise<void> {
  assertTemporaryObjectKey(key);
  await storage.deleteObject(key);
}

