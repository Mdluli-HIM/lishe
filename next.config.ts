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
  async redirects() {
    return [
      { source: "/nutrition", destination: "/explore/nourish", permanent: false },
      { source: "/fitness", destination: "/explore/move", permanent: false },
      { source: "/lifestyle", destination: "/explore/live", permanent: false },
    ];
  },
};

export default config;
