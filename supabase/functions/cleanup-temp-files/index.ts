import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async () => {
  return json({
    interval: "every 5 minutes",
    deletes: [
      "expired /temp/uploads objects",
      "expired /temp/results objects",
      "failed job objects",
      "orphan objects with no live Supabase job",
    ],
    maxRetention: "15 minutes",
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
