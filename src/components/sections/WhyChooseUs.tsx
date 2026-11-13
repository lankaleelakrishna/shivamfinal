import { Icon } from "@/components/icons/Icon";
import { WHY_US } from "@/lib/constants";
import styles from "./WhyChooseUs.module.css";

export function WhyChooseUs() {
  return (
    <section className="band" aria-label="Why Sri Shivam">
      <div className="wrap">
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
