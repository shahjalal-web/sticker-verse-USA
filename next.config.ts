import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Whenever the proxy runs on a request, Next.js buffers a clone of the body
  // and silently drops everything past this limit (default 10MB) — which was
  // truncating large design uploads into unparseable FormData. /api is now
  // excluded from the proxy matcher so this shouldn't apply to uploads at
  // all; the raised limit is a second line of defence so any future route
  // the proxy does cover can still take the 25MB the upload UI promises.
  experimental: {
    proxyClientMaxBodySize: "30mb",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        // Fallback URL uploadFileToShopify() returns when Shopify hasn't
        // finished processing a file into a cdn.shopify.com asset yet.
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
