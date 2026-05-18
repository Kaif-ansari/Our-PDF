import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (request) => {
  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const body = await request.json();

  if (!body.tokenId) {
    return json({ error: "missing_token" }, 400);
  }

  return json({
    tokenId: body.tokenId,
    downloadUrl: "TODO: generate one-time Cloudflare R2 signed GET URL",
    afterDownload: "delete /temp/results object immediately and mark token used",
  });
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}
