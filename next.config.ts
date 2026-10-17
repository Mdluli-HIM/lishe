import type { NextConfig } from "next";

const config: NextConfig = {
  turbopack: { root: process.cwd() },
  outputFileTracingIncludes: {
    "/**": ["./public/images/**/*"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lishe.co.za" },
      { protocol: "https", hostname: "**.wp.com" },
    ],
  },
};

export default config;
