import Image from "next/image";
import { Artwork } from "@/components/art/Artwork";
import { Icon } from "@/components/icons/Icon";
import { FormTabLink } from "@/components/ui/FormTabLink";
import type { FormTabId } from "@/lib/forms";
import type { ContentBlock } from "@/lib/site-content";
import styles from "./TopicList.module.css";

interface TopicListProps {
  items: ContentBlock[];
  /** Label for the call-to-action under each item. */
  ctaLabel?: string;
  ctaHref?: string;
  /** Enquiry type to select when the call-to-action is followed. */
  ctaPick?: FormTabId;
}

/** One dedicated section per topic: artwork on one side, summary and key points on the other, alternating. */
export function TopicList({ items, ctaLabel, ctaHref, ctaPick }: TopicListProps) {
  return (
    <div className={styles.list}>
      {items.map((item, idx) => (
        <section
          key={item.id}
          id={item.id}
          className={`${styles.topic} ${idx % 2 ? styles.reverse : ""}`}
          aria-labelledby={`${item.id}-title`}
        >
          <div className={styles.wrap}>
            <div className={styles.media}>
              {item.image ? (
                <Image
                  className={styles.image}
                  src={item.image}
                  alt={`${item.title} visual`}
                  width={497}
                  height={461}
                  sizes="(max-width: 880px) 100vw, 50vw"
                />
              ) : (
                <Artwork kind={item.art} label={`Illustration for ${item.title}`} />
              )}
            </div>
            <div className={styles.text}>
              <p className={styles.index}>{String(idx + 1).padStart(2, "0")}</p>
              <h2 id={`${item.id}-title`} className={styles.title}>
                {item.title}
              </h2>
              <p className={styles.summary}>{item.summary}</p>
              <ul className={styles.points}>
                {item.points.map((p) => (
                  <li key={p}>
                    <Icon name="check" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              {ctaLabel && ctaHref ? (
                <FormTabLink href={ctaHref} pick={ctaPick} className={styles.cta}>
                  {ctaLabel}
                  <Icon name="arrow" />
                </FormTabLink>
              ) : null}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
