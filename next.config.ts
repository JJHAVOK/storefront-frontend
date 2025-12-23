import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Keeps Docker working
  reactStrictMode: true,
  poweredByHeader: false, // Hides "Next.js" version info
  
  // 🛡️ SECURITY HEADERS (Phase 10 Requirement)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'DENY' }, // Stops Clickjacking
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ],
      },
    ];
  },
  
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.pixelforgedeveloper.com' },
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' } // Added R2 Support
    ],
  },
};

export default nextConfig;