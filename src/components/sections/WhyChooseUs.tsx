import { Icon } from "@/components/icons/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WHY_US } from "@/lib/constants";
import styles from "./WhyChooseUs.module.css";

interface WhyChooseUsProps {
  /** Optional heading shown above the three points, used on the home page. */
  heading?: { eyebrow: string; title: string; intro?: string };
}

export function WhyChooseUs({ heading }: WhyChooseUsProps) {
  return (
    <section className="band" aria-label="Why Sri Shivam">
      <div className="wrap">
        {heading ? (
          <SectionHeading eyebrow={heading.eyebrow} title={heading.title} intro={heading.intro} />
        ) : null}
        <div className={styles.why}>
          {WHY_US.map((f) => (
            <div key={f.title} className={styles.item}>
              <span className={styles.icBox}>
                <Icon name={f.icon} />
              </span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
