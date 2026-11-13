import type { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Use the light-on-dark palette (products section). */
  onDark?: boolean;
  id?: string;
}

export function SectionHeading({ eyebrow, title, intro, onDark, id }: SectionHeadingProps) {
  return (
    <div className={onDark ? `${styles.head} ${styles.dark}` : styles.head}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {intro ? <p className={styles.intro}>{intro}</p> : null}
    </div>
  );
}
