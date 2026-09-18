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
  // sharp's Linux binary (@img/sharp-linux-x64) dlopen()s libvips from a
  // sibling package that file tracing can't see, so on Vercel the function
  // bundle shipped without it and every image route died with
  // "ERR_DLOPEN_FAILED: libvips-cpp.so: cannot open shared object file".
  // Force both packages into the bundle for the routes that import sharp.
  // (Locally on Windows these globs match nothing — that's fine.)
  outputFileTracingIncludes: {
    "/api/proof": ["./node_modules/@img/sharp-linux-x64/**/*", "./node_modules/@img/sharp-libvips-linux-x64/**/*"],
    "/api/upload": ["./node_modules/@img/sharp-linux-x64/**/*", "./node_modules/@img/sharp-libvips-linux-x64/**/*"],
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
