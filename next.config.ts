import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Load Nodemailer from node_modules at runtime rather than bundling it. It uses dynamic requires.
  serverExternalPackages: ["nodemailer"],
  // Old static-site addresses (for example /portfolio.html) still appear in search results.
  // Send them permanently to the matching page on the new site.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/services.html", destination: "/services", permanent: true },
      { source: "/industries.html", destination: "/industries", permanent: true },
      { source: "/clients.html", destination: "/clients", permanent: true },
      { source: "/blogs.html", destination: "/blogs", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/portfolio.html", destination: "/portfolio", permanent: true },
      { source: "/service.html", destination: "/services", permanent: true },
      // Old sitelink paths shown in Google results. Best-guess slugs; confirm against Search Console.
      { source: "/digital-marketing-services", destination: "/services", permanent: true },
      { source: "/digital-marketing", destination: "/services", permanent: true },
      { source: "/website-development-portfolio", destination: "/portfolio", permanent: true },
    ];
  },
};

export default nextConfig;
