import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROCESS } from "@/lib/constants";
import styles from "./Process.module.css";

export function Process() {
  return (
    <section id="process" className="band" aria-labelledby="process-title">
      <div className="wrap">
        <SectionHeading id="process-title" eyebrow="How we work" title="What happens after you send a request" />
        {PROCESS.map((flow) => (
          <div key={flow.title} className={styles.process}>
            <h3>{flow.title}</h3>
            <ol className={styles.steps}>
              {flow.steps.map((s) => (
                <li key={s.title}>
                  <b>{s.title}</b>
                  <span>{s.body}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
