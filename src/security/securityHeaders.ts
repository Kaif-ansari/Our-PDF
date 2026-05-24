export const securityHeaders: Record<string, string> = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' https://cdn.skypack.dev https://cdnjs.cloudflare.com",
    "worker-src 'self' blob: https://cdnjs.cloudflare.com",
    "frame-src 'self' blob:",
    "connect-src 'self'",
    "img-src 'self' data: blob:",
    "style-src 'self'",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; "),
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Origin-Agent-Cluster": "?1",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), clipboard-read=(), clipboard-write=(self)",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-Permitted-Cross-Domain-Policies": "none",
};

export function applySecurityHeaders(headers: Headers): Headers {
  for (const [key, value] of Object.entries(securityHeaders)) {
    headers.set(key, value);
  }

  return headers;
}
