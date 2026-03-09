import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  
  // 🛡️ SECURITY HEADERS
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'DENY' }, // Storefront should NEVER be framed
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { 
            key: 'Content-Security-Policy', 
            // Allow PostHog, Stripe, and R2
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://us.posthog.com https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.r2.cloudflarestorage.com https://api.pixelforgedeveloper.com; font-src 'self' data:; connect-src 'self' https://api.pixelforgedeveloper.com https://us.posthog.com https://us.i.posthog.com;" 
          }
        ],
      },
    ];
  },

  // 🕵️ REVERSE PROXY (Preserved)
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },
  
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.pixelforgedeveloper.com' },
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      { protocol: 'http', hostname: 'backend-api' }
    ],
  },
};

export default nextConfig;