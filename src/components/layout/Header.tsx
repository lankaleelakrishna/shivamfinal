"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { PickLink } from "@/components/ui/PickLink";
import { COMPANY, NAV_LINKS } from "@/lib/constants";
import styles from "./Header.module.css";

export function Header() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Close on Escape, and when the viewport grows past the mobile breakpoint.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const mql = window.matchMedia("(min-width: 881px)");
    const onMql = () => mql.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mql.addEventListener("change", onMql);
    return () => {
      document.removeEventListener("keydown", onKey);
      mql.removeEventListener("change", onMql);
    };
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.inner}`}>
        <a className={styles.brand} href="#top" aria-label={`${COMPANY.legalName.replace(" Pvt. Ltd.", "")}, home`}>
          <Image className={styles.mark} src="/brand/logo-mark.png" alt="" width={38} height={38} priority />
          <span className={styles.name}>
            {COMPANY.shortName}
            <small>{COMPANY.tagline}</small>
          </span>
        </a>

        <nav id="site-nav" className={open ? `${styles.nav} ${styles.open}` : styles.nav} aria-label="Main">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <PickLink pick="hire" compact>
            Hire talent
          </PickLink>
          <button
            ref={btnRef}
            className={styles.menuBtn}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
    </header>
  );
}
