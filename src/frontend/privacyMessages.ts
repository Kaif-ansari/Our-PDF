import { PRIVACY_MESSAGES } from "../config/security";

export const uploadPrivacyMessages = [
  PRIVACY_MESSAGES.localOnly,
  PRIVACY_MESSAGES.noUpload,
  PRIVACY_MESSAGES.noAccounts,
  PRIVACY_MESSAGES.noContentRetained,
];

export function getUploadPrivacyNotice(): string {
  return uploadPrivacyMessages.join(" ");
}
