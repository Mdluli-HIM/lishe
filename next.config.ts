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
      { source: "/nutrition", destination: "/journal/nourish", permanent: false },
      { source: "/fitness", destination: "/journal/move", permanent: false },
      { source: "/lifestyle", destination: "/journal/live", permanent: false },
      { source: "/explore", destination: "/journal", permanent: false },
      { source: "/explore/:section", destination: "/journal/:section", permanent: false },
      { source: "/features", destination: "/journal/features", permanent: false },
      { source: "/voices", destination: "/journal/features", permanent: false },
      { source: "/about", destination: "/our-story", permanent: false },
      { source: "/contact-us", destination: "/contact", permanent: false },
      { source: "/shop", destination: "/wellness", permanent: false },
      { source: "/blog", destination: "/journal", permanent: false },
    ];
  },
};

export default config;
