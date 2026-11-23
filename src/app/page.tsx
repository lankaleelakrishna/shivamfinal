import type { Metadata } from "next";
import { CapabilitiesMarquee } from "@/components/sections/CapabilitiesMarquee";
import { Contact } from "@/components/sections/Contact";
import { ContactForms } from "@/components/sections/ContactForms";
import { Hero } from "@/components/sections/Hero";
import { Industries } from "@/components/sections/Industries";
import { PageTeasers } from "@/components/sections/PageTeasers";
import { Process } from "@/components/sections/Process";
import { ProductsShowcase } from "@/components/sections/ProductsShowcase";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { COMPANY } from "@/lib/constants";
import { SITE_DESCRIPTION, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: COMPANY.shortName,
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <CapabilitiesMarquee />
      <WhyChooseUs
        heading={{
          eyebrow: "Why choose us",
          title: "One team for hiring and building",
          intro: "The people who recruit your team sit next to the people who build your app. That is the whole idea.",
        }}
      />
      <PageTeasers />
      <ProductsShowcase />
      <Process />
      <Industries />
      <ContactForms />
      <Contact />
    </>
  );
}
