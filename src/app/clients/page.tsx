import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FormTabLink } from "@/components/ui/FormTabLink";
import { PRODUCTS } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import styles from "./clients.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Clients and partners | Sri Shivam Infotech",
  description:
    "Our in-house products, their status, and how to work with Sri Shivam Infotech as a client or partner.",
  path: "/clients",
});

export default function ClientsPage() {
  return (
    <>
      <PageHero
        eyebrow="Clients"
        title="Our work and partnerships"
        lede="We show the products we have built ourselves. Client names and testimonials will be added once they are verified and approved for publication."
        art="bars"
      />

      <section id="projects" className="band" aria-labelledby="projects-title">
        <div className="wrap">
          <SectionHeading
            id="projects-title"
            eyebrow="Project showcase"
            title="Products built in-house"
            intro="Each product shows its status, so you can see what is live, in demo, or still a prototype."
          />
          <ul className={styles.grid}>
            {PRODUCTS.map((p) => {
              const links = [...(p.link ? [p.link] : []), ...(p.links ?? [])];
              return (
                <li key={p.id} className={styles.card}>
                  <span className={`${styles.status} ${styles[p.status.tone]}`}>{p.status.label}</span>
                  <h3>{p.name}</h3>
                  <p>{p.summary}</p>
                  <p className={styles.tech}>{p.tech}</p>
                  {links.length ? (
                    <ul className={styles.links}>
                      {links.map((l) => (
                        <li key={l.href}>
                          <a href={l.href} target="_blank" rel="noopener noreferrer">
                            {l.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="partners" className="band alt" aria-labelledby="partners-title">
        <div className="wrap">
          <SectionHeading
            id="partners-title"
            eyebrow="Partnerships"
            title="Work with us"
            intro="We are open to partnerships with recruitment agencies, training institutes and software teams. Tell us what you have in mind."
          />
          <div className={styles.actions}>
            <FormTabLink href="/contact#enquiry" pick="business" className={styles.action}>
              Start a business enquiry
            </FormTabLink>
            <FormTabLink href="/contact#enquiry" pick="hirevaani" className={styles.action}>
              Ask about HireVaani
            </FormTabLink>
          </div>
        </div>
      </section>
    </>
  );
}
