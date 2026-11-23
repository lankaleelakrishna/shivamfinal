import type { Metadata } from "next";
import { PageCta } from "@/components/sections/PageCta";
import { PageHero } from "@/components/sections/PageHero";
import { TopicList } from "@/components/sections/TopicList";
import { pageMetadata } from "@/lib/seo";
import { SERVICES } from "@/lib/site-content";

export const metadata: Metadata = pageMetadata({
  title: "Services | Sri Shivam Infotech",
  description:
    "Web and mobile application development, custom software, AI-powered solutions, UI/UX design and digital product development from Hyderabad.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Software and product services, delivered by one team"
        lede="Eight services across web, mobile, AI, design and digital marketing. The people who scope your project are the people who build it."
        art="code"
      />
      <section className="band" aria-label="Our services">
        <div className="wrap">
          <TopicList
            items={SERVICES}
            ctaLabel="Enquire about this service"
            ctaHref="/contact#enquiry"
            ctaPick="business"
          />
        </div>
      </section>
      <PageCta />
    </>
  );
}
