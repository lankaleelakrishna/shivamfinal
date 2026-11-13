import { COMPANY, FOOTER_CONTACT, FOOTER_EXPLORE } from "@/lib/constants";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.brand}>
          <strong>{COMPANY.legalName}</strong>
          <span>{COMPANY.footerBlurb}</span>
        </div>
        <nav aria-label="Explore">
          <h4>Explore</h4>
          <ul>
            {FOOTER_EXPLORE.map((l) => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Get in touch">
          <h4>Get in touch</h4>
          <ul>
            {FOOTER_CONTACT.map((l) => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={styles.bottom}>{COMPANY.copyright}</p>
      </div>
    </footer>
  );
}
