import { Icon } from "@/components/icons/Icon";
import type { Industry } from "@/lib/constants";
import styles from "./IndustryCard.module.css";

export function IndustryCard({ icon, label }: Industry) {
  return (
    <li className={styles.tile}>
      <Icon name={icon} />
      {label}
    </li>
  );
}
