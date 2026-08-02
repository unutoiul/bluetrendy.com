import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // The CV is a self-contained static site under public/cv. Serve its entry
  // point at /cv so the URL stays clean.
  async rewrites() {
    return [{ source: "/cv", destination: "/cv/index.html" }];
  },
};

export default nextConfig;
