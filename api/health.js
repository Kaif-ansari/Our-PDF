export default function handler(_request, response) {
  response.status(200).json({
    ok: true,
    service: "our-pdf",
    mode: "dynamic-api-ready",
    zeroPersistence: true,
    retentionMinutes: 15,
  });
}
