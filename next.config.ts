import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // `domains` is deprecated in Next 16 in favour of `remotePatterns`.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "nigerianbanks.xyz" },
      {
        protocol: "https",
        hostname: "xbanka-kyc-storage-zo86m7.s3.us-east-1.amazonaws.com",
      },
      { protocol: "https", hostname: "backend.xbankang.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
