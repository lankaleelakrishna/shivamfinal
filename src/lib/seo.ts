import type { Metadata } from "next";
import { COMPANY } from "@/lib/constants";

/** Primary public domain. The bare domain redirects here. */
export const SITE_URL = "https://www.srishivam.in";

export const SITE_DESCRIPTION =
  "Sri Shivam Infotech Solutions, Hyderabad: IT and non-IT staffing, recruitment, payroll, and Android and iOS app development.";

const SOCIAL_IMAGE = { url: "/brand/logo-mark.png", width: 256, height: 256, alt: COMPANY.shortName };

/** Metadata for one page: canonical URL, Open Graph and Twitter cards. `path` starts with "/". */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const url = new URL(path, SITE_URL).toString();
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: COMPANY.shortName,
      title,
      description,
      url,
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [SOCIAL_IMAGE.url],
    },
  };
}
