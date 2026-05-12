import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ai-citation-monitor",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
