"use client";

import { useEffect, useState, type RefObject } from "react";

/** True while the element intersects the viewport (and the tab is visible). */
export function useInView<T extends Element>(ref: RefObject<T | null>, rootMargin = "0px"): boolean {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let intersecting = true;
    const update = () => setInView(intersecting && document.visibilityState !== "hidden");
    const io = new IntersectionObserver(
      (entries) => {
        intersecting = entries[entries.length - 1]?.isIntersecting ?? false;
        update();
      },
      { rootMargin },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [ref, rootMargin]);

  return inView;
}
