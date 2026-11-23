import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { SERVICE_GROUPS } from "@/lib/services";
import styles from "./Services.module.css";

export function Services({ headingAs }: { headingAs?: "h1" | "h2" }) {
  return (
    <section id="services" className="band alt" aria-labelledby="services-title">
      <div className="wrap">
        <SectionHeading
          id="services-title"
          as={headingAs}
          eyebrow="Services"
          title="Two desks, one point of contact"
          intro="Hiring and software sit in the same office, so a product team can be staffed by the same people who build your app."
        />
        {SERVICE_GROUPS.map((group) => (
          <div key={group.id} className={styles.group}>
            <div className={styles.head}>
              <h3>{group.title}</h3>
              <p>{group.intro}</p>
            </div>
            <div className={styles.cards}>
              {group.services.map((s) => (
                <ServiceCard key={s.title} {...s} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
