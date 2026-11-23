import Image from "next/image";
import Link from "next/link";
import { FormTabLink } from "@/components/ui/FormTabLink";
import { COMPANY, FOOTER_CONTACT, FOOTER_EXPLORE } from "@/lib/constants";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.brand}>
          <div className={styles.lockup}>
            <Image src="/brand/logo-mark.png" alt="" width={64} height={64} className={styles.mark} />
            <strong>{COMPANY.legalName}</strong>
          </div>
          <span>{COMPANY.footerBlurb}</span>
        </div>
        <nav aria-label="Explore">
          <h4>Explore</h4>
          <ul>
            {FOOTER_EXPLORE.map((l) => (
              <li key={l.label}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Get in touch">
          <h4>Get in touch</h4>
          <ul>
            {FOOTER_CONTACT.map((l) => (
              <li key={l.label}>
                {l.pick ? (
                  <FormTabLink href={l.href} pick={l.pick}>
                    {l.label}
                  </FormTabLink>
                ) : (
                  <Link href={l.href}>{l.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <p className={styles.bottom}>{COMPANY.copyright}</p>
      </div>
    </footer>
  );
}
