import type { Metadata } from "next";
import { PageCta } from "@/components/sections/PageCta";
import { PageHero } from "@/components/sections/PageHero";
import { TopicList } from "@/components/sections/TopicList";
import { pageMetadata } from "@/lib/seo";
import { INDUSTRIES } from "@/lib/site-content";

export const metadata: Metadata = pageMetadata({
  title: "Industries | Sri Shivam Infotech",
  description:
    "Recruitment and staffing, HR and workforce management, education and skill development, and business and enterprise solutions from Sri Shivam Infotech.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Where we hire and build"
        lede="We work with staffing firms, HR teams, training institutes and operations-led businesses. Each segment below shows the kind of work we do."
        art="people"
      />
      <section className="band" aria-label="Industry segments">
        <div className="wrap">
          <TopicList
            items={INDUSTRIES}
            ctaLabel="Talk to us about your sector"
            ctaHref="/contact#enquiry"
            ctaPick="business"
          />
        </div>
      </section>
      <PageCta />
    </>
  );
}
