import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const MAX_RETENTION_SECONDS = 15 * 60;
const UPLOAD_TTL_SECONDS = 5 * 60;
const UPLOAD_PREFIX = "/temp/uploads";

type Plan = "free" | "premium";

const limits: Record<Plan, { maxFileSizeBytes: number }> = {
  free: { maxFileSizeBytes: 25 * 1024 * 1024 },
  premium: { maxFileSizeBytes: 250 * 1024 * 1024 },
};

serve(async (request) => {
  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const body = await request.json();
  const turnstileOk = await verifyTurnstile(body.turnstileToken, request.headers.get("CF-Connecting-IP"));

  if (!turnstileOk) {
    return json({ error: "turnstile_failed" }, 403);
  }

  const plan = (body.plan ?? "free") as Plan;
  const planLimits = limits[plan] ?? limits.free;

  if (body.contentType !== "application/pdf") {
    return json({ error: "pdf_required" }, 400);
  }

  if (body.fileSizeBytes > planLimits.maxFileSizeBytes) {
    return json({ error: "file_too_large" }, 413);
  }

  const jobId = crypto.randomUUID();
  const objectId = crypto.randomUUID();
  const objectKey = `${UPLOAD_PREFIX}/${jobId}/${objectId}`;
  const expiresAt = new Date(Date.now() + MAX_RETENTION_SECONDS * 1000).toISOString();

  return json({
    jobId,
    objectKey,
    expiresAt,
    uploadUrlExpiresInSeconds: UPLOAD_TTL_SECONDS,
    uploadUrl: "TODO: generate Cloudflare R2 signed PUT URL with scoped server credentials",
  });
});

async function verifyTurnstile(token: string | undefined, remoteIp: string | null): Promise<boolean> {
  if (!token) {
    return false;
  }

  const formData = new FormData();
  formData.set("secret", Deno.env.get("CLOUDFLARE_TURNSTILE_SECRET_KEY") ?? "");
  formData.set("response", token);

  if (remoteIp) {
    formData.set("remoteip", remoteIp);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData,
  });
  const result = await response.json();

  return Boolean(result.success);
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}
