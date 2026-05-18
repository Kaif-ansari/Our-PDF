import { PRIVACY_MESSAGES } from "../config/security";

export const uploadPrivacyMessages = [
  PRIVACY_MESSAGES.autoDelete,
  PRIVACY_MESSAGES.noPermanentStorage,
  PRIVACY_MESSAGES.privateFiles,
  PRIVACY_MESSAGES.noContentRetained,
];

export function getUploadPrivacyNotice(): string {
  return uploadPrivacyMessages.join(" ");
}

