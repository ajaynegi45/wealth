import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  allowedDevOrigins: ['192.168.1.6'],
  devIndicators:false
};

export default nextConfig;
