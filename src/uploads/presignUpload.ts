import { PLAN_LIMITS, Plan } from "../config/security";
import { requireValidTurnstile } from "../security/turnstile";
import { TemporaryStorageAdapter, createUploadUrl } from "../storage/temporaryR2Storage";

export interface PresignUploadInput {
  userId: string;
  plan: Plan;
  jobId: string;
  objectId: string;
  contentType: string;
  fileSizeBytes: number;
  turnstileToken: string;
  remoteIp?: string;
}

export async function presignUpload(
  storage: TemporaryStorageAdapter,
  input: PresignUploadInput,
  cloudflareTurnstileSecret: string,
): Promise<{ key: string; uploadUrl: string; expiresAt: Date }> {
  await requireValidTurnstile({
    secretKey: cloudflareTurnstileSecret,
    token: input.turnstileToken,
    remoteIp: input.remoteIp,
  });

  const limits = PLAN_LIMITS[input.plan];

  if (input.fileSizeBytes > limits.maxFileSizeBytes) {
    throw new Error("File exceeds plan limit.");
  }

  if (input.contentType !== "application/pdf") {
    throw new Error("Only PDF uploads are allowed.");
  }

  return createUploadUrl(storage, {
    jobId: input.jobId,
    ownerId: input.userId,
    objectId: input.objectId,
    contentType: input.contentType,
  });
}

