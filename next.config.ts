import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "assets.coincap.io",
      "xbanka-kyc-storage-zo86m7.s3.us-east-1.amazonaws.com",
      "backend.xbankang.com"
    ],
  },
};

export default nextConfig;
