export default function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("allow", "POST");
    response.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const configured = Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY);
  if (!configured) {
    response.status(501).json({
      error: "r2_not_configured",
      message: "Add Cloudflare R2 credentials and Turnstile verification before enabling cloud uploads.",
      storagePolicy: "no_file_bytes_accepted_by_api",
    });
    return;
  }

  response.status(501).json({
    error: "presign_worker_not_connected",
    message: "R2 signing credentials are present, but the signing worker is not implemented in this route yet.",
  });
}
