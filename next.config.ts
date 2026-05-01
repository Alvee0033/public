import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@heroicons/react",
      "react-icons",
      "date-fns",
      "framer-motion",
      "embla-carousel-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "recharts",
      "chart.js",
    ],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // Public assets can stay warm across navigations and deploys.
        source: "/(.*)\\.(png|jpg|jpeg|gif|webp|avif|ico|svg|woff2|woff|ttf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Next.js internal static assets remain immutable
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/scholarships",
        destination: "/",
        permanent: false,
      },
      {
        source: "/scholarships/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/scholarship-application",
        destination: "/",
        permanent: false,
      },
      {
        source: "/scholarship-category",
        destination: "/",
        permanent: false,
      },
      {
        source: "/scholarship-category/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/scholarship-payment",
        destination: "/",
        permanent: false,
      },
      {
        source: "/scholar-pass",
        destination: "/",
        permanent: false,
      },
      {
        source: "/scholar-pass/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/launchpad",
        destination: "/",
        permanent: false,
      },
      {
        source: "/launchpad/:path*",
        destination: "/",
        permanent: false,
      },
    ];
  },

  /**
   * Proxy all /api/v1/* calls to the NestJS backend at port 4050.
   */
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:4050/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
