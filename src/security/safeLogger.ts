import { ALLOWED_LOG_FIELDS } from "../config/security";

type AllowedLogField = (typeof ALLOWED_LOG_FIELDS)[number];
type SafeLogPayload = Partial<Record<AllowedLogField, string | number | boolean | null>>;

const blockedFieldPattern =
  /(file|content|ocr|text|image|preview|thumbnail|pdf|document|signedUrl|token|secret|bytes)/i;

export function safeLog(event: string, payload: SafeLogPayload): void {
  for (const key of Object.keys(payload)) {
    if (!ALLOWED_LOG_FIELDS.includes(key as AllowedLogField) || blockedFieldPattern.test(key)) {
      throw new Error(`Unsafe log field rejected: ${key}`);
    }
  }

  console.info(JSON.stringify({ event, ...payload }));
}

export function safeErrorCode(error: unknown): string {
  if (error instanceof Error && error.name) {
    return error.name;
  }

  return "UnknownError";
}

