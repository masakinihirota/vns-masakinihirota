import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
