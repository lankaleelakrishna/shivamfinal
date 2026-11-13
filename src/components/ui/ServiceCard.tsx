import { Icon } from "@/components/icons/Icon";
import type { Service } from "@/lib/services";
import styles from "./ServiceCard.module.css";

export function ServiceCard({ icon, title, body }: Service) {
  return (
    <article className={styles.card}>
      <span className={styles.icBox}>
        <Icon name={icon} />
      </span>
      <h4>{title}</h4>
      <p>{body}</p>
    </article>
  );
}
