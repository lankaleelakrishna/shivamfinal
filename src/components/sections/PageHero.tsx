import type { ReactNode } from "react";
import { Artwork, type ArtKind } from "@/components/art/Artwork";
import styles from "./PageHero.module.css";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lede: string;
  actions?: ReactNode;
  /** Optional artwork beside the text on wide screens. */
  art?: ArtKind;
}

/** The strong opening band for each inner page: one H1, a short lede, optional actions and artwork. */
export function PageHero({ eyebrow, title, lede, actions, art }: PageHeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="page-hero-title">
      <div className={`wrap ${art ? styles.split : ""}`}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 id="page-hero-title" className={styles.title}>
            {title}
          </h1>
          <p className={styles.lede}>{lede}</p>
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </div>
        {art ? (
          <div className={styles.media}>
            <Artwork kind={art} label={`Illustration for ${title}`} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
