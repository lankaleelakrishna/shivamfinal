"use client";

import { useEffect, useRef } from "react";
import { FINE_POINTER_QUERY, REDUCED_MOTION_QUERY } from "@/hooks/useMediaQuery";
import styles from "./CursorGlow.module.css";

/**
 * Soft saffron/blue glow that trails the cursor. Desktop pointers only, off
 * for reduced motion, and the animation loop sleeps once the glow catches up.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia(FINE_POINTER_QUERY).matches;
    const reduce = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    if (!fine || reduce) return;

    let gx = -500;
    let gy = -500;
    let x = gx;
    let y = gy;
    let raf = 0;

    const follow = () => {
      x += (gx - x) * 0.16;
      y += (gy - y) * 0.16;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = Math.abs(gx - x) + Math.abs(gy - y) > 0.3 ? requestAnimationFrame(follow) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      gx = e.clientX;
      gy = e.clientY;
      el.dataset.active = "true";
      if (!raf) raf = requestAnimationFrame(follow);
    };
    const onLeave = () => {
      el.dataset.active = "false";
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} className={styles.glow} aria-hidden="true" data-active="false" />;
}
