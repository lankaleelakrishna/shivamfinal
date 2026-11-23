"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { PickLink } from "@/components/ui/PickLink";
import { useFormTab } from "@/components/providers/FormTabProvider";
import { COMPANY, NAV_ITEMS, type NavItem } from "@/lib/constants";
import styles from "./Header.module.css";

/** Below this width the menu collapses into the mobile drawer. Keep in step with the CSS breakpoint. */
const DESKTOP_QUERY = "(min-width: 1081px)";
const HOVER_QUERY = "(hover: hover)";

interface NavEntryProps {
  item: NavItem;
  isOpen: boolean;
  onToggle: () => void;
  onHover: (entering: boolean) => void;
  onNavigate: () => void;
}

function NavEntry({ item, isOpen, onToggle, onHover, onNavigate }: NavEntryProps) {
  const menuId = useId();
  const { setTab } = useFormTab();

  if (!item.children) {
    return (
      <li className={styles.item}>
        <Link href={item.href} className={styles.link} onClick={onNavigate}>
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li className={styles.item} onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>
      <div className={styles.row}>
        <Link href={item.href} className={styles.link} onClick={onNavigate}>
          {item.label}
        </Link>
        <button
          type="button"
          className={`${styles.caret} ${isOpen ? styles.caretOpen : ""}`}
          aria-expanded={isOpen}
          aria-controls={menuId}
          aria-label={`${isOpen ? "Hide" : "Show"} ${item.label} links`}
          onClick={onToggle}
        >
          <Icon name="arrow" />
        </button>
      </div>
      <ul id={menuId} className={isOpen ? `${styles.sub} ${styles.subOpen}` : styles.sub}>
        {item.children.map((c) => (
          <li key={c.label}>
            <Link
              href={c.href}
              onClick={() => {
                if (c.form) setTab(c.form);
                onNavigate();
              }}
            >
              {c.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Escape closes whatever is open. A click outside the nav closes dropdowns.
  // Crossing into the desktop layout closes the mobile drawer.
  useEffect(() => {
    const closeAll = () => {
      setMenuOpen(false);
      setOpenItem(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const hadMenu = menuOpen;
      closeAll();
      if (hadMenu) btnRef.current?.focus();
    };
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenItem(null);
    };
    const mql = window.matchMedia(DESKTOP_QUERY);
    const onMql = () => {
      if (mql.matches) closeAll();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    mql.addEventListener("change", onMql);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      mql.removeEventListener("change", onMql);
    };
  }, [menuOpen]);

  const closeAll = () => {
    setMenuOpen(false);
    setOpenItem(null);
  };

  // Hover opens dropdowns only with a fine pointer on the desktop layout. Touch uses the caret.
  const hoverEnabled = () =>
    window.matchMedia(DESKTOP_QUERY).matches && window.matchMedia(HOVER_QUERY).matches;

  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.inner}`}>
        <Link className={styles.brand} href="/" aria-label={`${COMPANY.legalName.replace(" Pvt. Ltd.", "")}, home`}>
          <Image className={styles.mark} src="/brand/logo-mark.png" alt="" width={38} height={38} priority />
          <span className={styles.name}>
            {COMPANY.shortName}
            <small>{COMPANY.tagline}</small>
          </span>
        </Link>

        <nav id="site-nav" ref={navRef} className={menuOpen ? `${styles.nav} ${styles.open}` : styles.nav} aria-label="Main">
          <ul className={styles.list}>
            {NAV_ITEMS.map((item) => (
              <NavEntry
                key={item.href}
                item={item}
                isOpen={openItem === item.href}
                onToggle={() => setOpenItem((cur) => (cur === item.href ? null : item.href))}
                onHover={(entering) => {
                  if (!hoverEnabled()) return;
                  setOpenItem((cur) => (entering ? item.href : cur === item.href ? null : cur));
                }}
                onNavigate={closeAll}
              />
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <PickLink pick="hire" compact>
            Hire talent
          </PickLink>
          <button
            ref={btnRef}
            className={styles.menuBtn}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => {
              setOpenItem(null);
              setMenuOpen((v) => !v);
            }}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>
    </header>
  );
}
