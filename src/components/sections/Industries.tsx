import { IndustryCard } from "@/components/ui/IndustryCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { INDUSTRIES } from "@/lib/constants";
import styles from "./Industries.module.css";

export function Industries() {
  return (
    <section id="industries" className="band alt" aria-labelledby="industries-title">
      <div className="wrap">
        <SectionHeading
          id="industries-title"
          eyebrow="Industries"
          title="Where we hire and build"
          intro="From Hyderabad's global capability centres to local businesses opening their first app."
        />
        <ul className={styles.tiles}>
          {INDUSTRIES.map((i) => (
            <IndustryCard key={i.label} {...i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
