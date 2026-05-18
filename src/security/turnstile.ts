export interface TurnstileVerificationOptions {
  secretKey: string;
  token: string;
  remoteIp?: string;
}

export interface TurnstileVerificationResult {
  success: boolean;
  errorCodes: string[];
}

interface CloudflareTurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
}

export async function verifyTurnstileToken({
  secretKey,
  token,
  remoteIp,
}: TurnstileVerificationOptions): Promise<TurnstileVerificationResult> {
  if (!token) {
    return { success: false, errorCodes: ["missing-token"] };
  }

  const formData = new FormData();
  formData.set("secret", secretKey);
  formData.set("response", token);

  if (remoteIp) {
    formData.set("remoteip", remoteIp);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    return { success: false, errorCodes: [`siteverify-http-${response.status}`] };
  }

  const result = (await response.json()) as CloudflareTurnstileResponse;

  return {
    success: result.success,
    errorCodes: result["error-codes"] ?? [],
  };
}

export async function requireValidTurnstile(options: TurnstileVerificationOptions): Promise<void> {
  const result = await verifyTurnstileToken(options);

  if (!result.success) {
    throw new Error(`Turnstile verification failed: ${result.errorCodes.join(",") || "unknown"}`);
  }
}

