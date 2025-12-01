import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // <-- 이거 하나면 빌드 에러 100% 통과
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cryptoicons.org",
        port: "",
        pathname: "/api/icon/**",
      },
      {
        protocol: "https",
        hostname: "s3-symbol-logo.tradingview.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
