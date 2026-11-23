import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** Clean, canonical URLs only. Old .html addresses redirect here and are not listed. */
const PATHS = ["/", "/about", "/services", "/industries", "/clients", "/blogs", "/contact", "/portfolio"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
