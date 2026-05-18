import { deleteTemporaryObject, TemporaryStorageAdapter } from "../storage/temporaryR2Storage";

export interface OneTimeDownloadToken {
  tokenId: string;
  userId: string;
  jobId: string;
  resultKey: string;
  expiresAt: Date;
  usedAt: Date | null;
}

export interface DownloadTokenStore {
  findToken(tokenId: string): Promise<OneTimeDownloadToken | null>;
  markUsed(tokenId: string, usedAt: Date): Promise<void>;
}

export async function consumeOneTimeDownload(
  storage: TemporaryStorageAdapter,
  tokenStore: DownloadTokenStore,
  input: {
    tokenId: string;
    userId: string;
    onAuthorizedDownload: () => Promise<void>;
  },
): Promise<void> {
  const token = await tokenStore.findToken(input.tokenId);

  if (!token || token.userId !== input.userId) {
    throw new Error("Download token is invalid.");
  }

  if (token.usedAt) {
    throw new Error("Download token has already been used.");
  }

  if (token.expiresAt.getTime() <= Date.now()) {
    await deleteTemporaryObject(storage, token.resultKey);
    throw new Error("Download token has expired.");
  }

  await input.onAuthorizedDownload();
  await tokenStore.markUsed(token.tokenId, new Date());
  await deleteTemporaryObject(storage, token.resultKey);
}

