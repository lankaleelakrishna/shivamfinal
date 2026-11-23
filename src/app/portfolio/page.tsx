import type { Metadata } from "next";
import { PageCta } from "@/components/sections/PageCta";
import { ProductsShowcase } from "@/components/sections/ProductsShowcase";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Portfolio | Sri Shivam Infotech",
  description: "Five products built in-house by Sri Shivam Infotech, including HireVaani and ParkNow on Google Play.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  return (
    <>
      <ProductsShowcase headingAs="h1" />
      <PageCta />
    </>
  );
}
