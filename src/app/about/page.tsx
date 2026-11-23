import type { Metadata } from "next";
import { PageCta } from "@/components/sections/PageCta";
import { PageHero } from "@/components/sections/PageHero";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HERO } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import { TECH_APPROACH, VISION_MISSION } from "@/lib/site-content";
import styles from "./about.module.css";

export const metadata: Metadata = pageMetadata({
  title: "About us | Sri Shivam Infotech",
  description:
    "Who we are: a Hyderabad team for hiring and building. Our vision, technology approach, and the story of HireVaani, our voice-first hiring product.",
  path: "/about",
});

const HIREVAANI_APPS = [
  {
    name: "HireVaani Worker",
    body: "For job seekers. Create a voice profile, answer short voice interviews and show verified skills to employers.",
    href: "https://play.google.com/store/apps/details?id=com.hirevaani.ai.worker&hl=en_IN",
  },
  {
    name: "HireVaani Recruiter",
    body: "For employers and recruiters. Review voice profiles and verified skill badges, and shortlist candidates faster.",
    href: "https://play.google.com/store/apps/details?id=com.hirevaani.ai.employer&hl=en_IN",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="A Hyderabad team for hiring and building"
        lede={HERO.lede}
        art="network"
      />

      <section id="company" className="band" aria-labelledby="company-title">
        <div className="wrap">
          <SectionHeading
            id="company-title"
            eyebrow="Company introduction"
            title="Who we are"
            intro="Sri Shivam Infotech Solutions Pvt. Ltd. is a Hyderabad company that brings recruitment, payroll and software development together. Our recruiters and developers work from the same office, so the people who hire your team can work closely with the people who build your product."
          />
        </div>
      </section>

      <section id="vision" className="band alt" aria-labelledby="vision-title">
        <div className="wrap">
          <SectionHeading id="vision-title" eyebrow="Vision and mission" title="What we work toward" />
          <div className={styles.statements}>
            <article>
              <h3>Vision</h3>
              <p>{VISION_MISSION.vision}</p>
            </article>
            <article>
              <h3>Mission</h3>
              <p>{VISION_MISSION.mission}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="technology" className="band" aria-labelledby="technology-title">
        <div className="wrap">
          <SectionHeading
            id="technology-title"
            eyebrow="Technology approach"
            title="How we build software"
            intro="The same habits apply to every project, whether it is a hiring tool, a mobile app or an internal system."
          />
          <ol className={styles.approach}>
            {TECH_APPROACH.map((step, idx) => (
              <li key={step.title}>
                <span className={styles.step}>{String(idx + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <WhyChooseUs heading={{ eyebrow: "Why choose us", title: "Why choose Sri Shivam Infotech" }} />

      <section id="hirevaani" className="band alt" aria-labelledby="hirevaani-title">
        <div className="wrap">
          <SectionHeading
            id="hirevaani-title"
            eyebrow="Our product"
            title="The HireVaani story"
            intro="HireVaani is a voice-first hiring product owned and developed by Sri Shivam Infotech. Workers speak instead of typing, and employers get short, verified voice profiles. It is made of two apps."
          />
          <div className={styles.apps}>
            {HIREVAANI_APPS.map((app) => (
              <article key={app.name}>
                <h3>{app.name}</h3>
                <p>{app.body}</p>
                <a href={app.href} target="_blank" rel="noopener noreferrer">
                  View on Google Play
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PageCta />
    </>
  );
}
