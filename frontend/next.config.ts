import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cryptoicons.org",
        port: "",
        pathname: "/api/icon/**",
      },
    ],
  },
};

export default nextConfig;
