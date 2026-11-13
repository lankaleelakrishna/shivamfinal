import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Load Nodemailer from node_modules at runtime rather than bundling it. It uses dynamic requires.
  serverExternalPackages: ["nodemailer"],
};

export default nextConfig;
