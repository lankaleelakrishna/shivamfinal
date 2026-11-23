import type { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Use the light-on-dark palette (products section). */
  onDark?: boolean;
  id?: string;
  /** Use h1 when this heading is the page's main title. Defaults to h2. */
  as?: "h1" | "h2";
}

export function SectionHeading({ eyebrow, title, intro, onDark, id, as: Heading = "h2" }: SectionHeadingProps) {
  return (
    <div className={onDark ? `${styles.head} ${styles.dark}` : styles.head}>
      <p className="eyebrow">{eyebrow}</p>
      <Heading id={id}>{title}</Heading>
      {intro ? <p className={styles.intro}>{intro}</p> : null}
    </div>
  );
}
