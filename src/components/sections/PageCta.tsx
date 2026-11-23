import { PickLink } from "@/components/ui/PickLink";
import styles from "./PageCta.module.css";

/** Closing call-to-action for the separate Services, About us and Portfolio pages. */
export function PageCta() {
  return (
    <section className={`band alt ${styles.section}`} aria-labelledby="page-cta-title">
      <div className={`wrap ${styles.inner}`}>
        <h2 id="page-cta-title">Ready to hire or build?</h2>
        <p>Tell us what you need and we will come back to you with a clear next step.</p>
        <div className={styles.actions}>
          <PickLink pick="hire">Hire talent</PickLink>
          <PickLink pick="app" variant="ghost" className={styles.ghostOnLight}>
            Get an app quote
          </PickLink>
        </div>
      </div>
    </section>
  );
}
