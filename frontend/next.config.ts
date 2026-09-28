import type { NextConfig } from "next";
import { backendUrl } from "./src/lib/api/server";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl()}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
