import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.219.213.246"],
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
