export default function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("allow", "POST");
    response.status(405).json({ error: "method_not_allowed" });
    return;
  }

  response.status(501).json({
    error: "download_service_not_configured",
    message: "One-time signed downloads require R2 result storage and token persistence.",
    storagePolicy: "delete_result_after_successful_download",
  });
}
