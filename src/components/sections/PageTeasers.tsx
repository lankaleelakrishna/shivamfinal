import Link from "next/link";
import { Artwork, type ArtKind } from "@/components/art/Artwork";
import { Icon, type IconName } from "@/components/icons/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./PageTeasers.module.css";

interface Teaser {
  href: string;
  art: ArtKind;
  icon: IconName;
  title: string;
  body: string;
  more: string;
}

const TEASERS: Teaser[] = [
  {
    href: "/services",
    art: "code",
    icon: "users",
    title: "Services",
    body: "IT and non-IT staffing, payroll, and Android and iOS app development.",
    more: "See services",
  },
  {
    href: "/about",
    art: "network",
    icon: "building",
    title: "About us",
    body: "How we work, and the industries we hire and build for.",
    more: "About our team",
  },
  {
    href: "/portfolio",
    art: "device",
    icon: "phone",
    title: "Portfolio",
    body: "Five products built in-house, some live on Google Play.",
    more: "View the products",
  },
];

/** Short teasers on the home page that link to the separate Services, About us and Portfolio pages. */
export function PageTeasers() {
  return (
    <section className="band" aria-labelledby="explore-title">
      <div className="wrap">
        <SectionHeading id="explore-title" eyebrow="Explore" title="Find out more about us" />
        <div className={styles.grid}>
          {TEASERS.map((t) => (
            <Link key={t.href} href={t.href} className={styles.card}>
              <div className={styles.thumb}>
                <Artwork kind={t.art} label={`Illustration for ${t.title}`} />
              </div>
              <Icon name={t.icon} />
              <h3>{t.title}</h3>
              <p>{t.body}</p>
              <span className={styles.more}>
                {t.more}
                <Icon name="arrow" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
