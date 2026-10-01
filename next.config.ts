import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
  /* Pin the trace root to this app. D:\work also holds a package-lock.json
     (the Vercel CLI lives there), and without this Next infers that parent as
     the workspace root and warns on every build. */
  outputFileTracingRoot: path.join(__dirname),
  transpilePackages: ["@shadergradient/react"],
};

export default nextConfig;
