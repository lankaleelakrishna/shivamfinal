import { Fragment } from "react";
import { MARQUEE_ITEMS } from "@/lib/constants";
import styles from "./CapabilitiesMarquee.module.css";

function Group({ hidden }: { hidden?: boolean }) {
  return (
    <div className={styles.group} aria-hidden={hidden || undefined}>
      {MARQUEE_ITEMS.map((item) => (
        <Fragment key={item}>
          <span>{item}</span>
          <i aria-hidden="true" />
        </Fragment>
      ))}
    </div>
  );
}

/** Continuous capabilities ticker. Pure CSS: pauses on hover and stops for reduced motion. */
export function CapabilitiesMarquee() {
  return (
    <div className={styles.marquee} role="region" aria-label="Our capabilities">
      <div className={styles.track}>
        <Group />
        <Group hidden />
      </div>
    </div>
  );
}
