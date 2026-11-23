import Image from "next/image";
import Link from "next/link";
import { FormTabLink } from "@/components/ui/FormTabLink";
import { COMPANY, FOOTER_CONTACT, FOOTER_EXPLORE, FOOTER_SOCIAL, type SocialIcon } from "@/lib/constants";
import styles from "./Footer.module.css";

/** Simple line glyphs for the social buttons. Drawn here so no third-party icon files are needed. */
function SocialGlyph({ kind }: { kind: SocialIcon }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, "aria-hidden": true, focusable: false };
  if (kind === "facebook") {
    return (
      <svg {...common}>
        <path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.5c0-.8.3-1.4 1.4-1.4H16V5.6c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.1H8v2.8h2.4v7z" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (kind === "instagram") {
    return (
      <svg {...common}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="4" y="9" width="3" height="11" fill="currentColor" stroke="none" />
      <circle cx="5.5" cy="5.5" r="1.8" fill="currentColor" stroke="none" />
      <path d="M10 9h3v1.6c.5-.9 1.6-1.9 3.4-1.9 3.4 0 4 2.2 4 5.1V20h-3v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V20h-3z" fill="currentColor" stroke="none" />
    </svg>
  );
}

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
          <ul className={styles.social} aria-label="Follow us">
            {FOOTER_SOCIAL.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`${l.label} (opens in a new tab)`}>
                  <SocialGlyph kind={l.icon} />
                </a>
              </li>
            ))}
          </ul>
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
