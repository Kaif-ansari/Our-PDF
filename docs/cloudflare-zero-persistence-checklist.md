# Cloudflare Static Deployment Checklist

This browser-only build does not require Cloudflare R2, Supabase, worker queues, or upload presign routes.

## Required

- Deploy as a static site through Cloudflare Pages or place Cloudflare in front of the static host.
- Run `npm run build` and publish the `public/` directory.
- Keep strict security headers from `_headers` or `vercel.json`.
- Enable Cloudflare WAF managed rules and DDoS protection.
- Set SSL/TLS to Full (strict).
- Cache `/assets/*` at the edge with immutable caching.
- Cache `/app.js` and `/styles.css` with short stale-while-revalidate caching.
- Do not create public upload endpoints.
- Do not add document storage buckets.
- Do not configure backend secrets unless a backend feature is deliberately introduced.

## Optional

- Use Cloudflare rate limiting for abusive static asset traffic.
- Enable bot controls if traffic patterns look automated.
- Use privacy-safe uptime monitoring that does not upload user documents.
