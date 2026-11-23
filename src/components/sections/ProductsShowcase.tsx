"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Icon } from "@/components/icons/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SceneErrorBoundary } from "@/components/three/SceneErrorBoundary";
import { useWebGLSupport } from "@/components/three/support";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import {
  AUTO_ADVANCE_MS,
  PRODUCTS,
  PRODUCT_ORDER,
  hexToCss,
  hexToRgba,
  productById,
  type ProductId,
} from "@/lib/products";
import styles from "./ProductsShowcase.module.css";

const ProductScene = dynamic(() => import("@/components/three/ProductScene"), { ssr: false });

type GlState = "pending" | "ready" | "unavailable";

export function ProductsShowcase({ headingAs }: { headingAs?: "h1" | "h2" }) {
  const [active, setActive] = useState<ProductId>("hirenova");
  const supported = useWebGLSupport();
  const [status, setGl] = useState<GlState>("pending");
  const gl: GlState = supported === false ? "unavailable" : status;
  const userTouched = useRef(false);
  const viewRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<ProductId, HTMLButtonElement | null>>>({});
  const inView = useInView(viewRef);
  const reduce = usePrefersReducedMotion();
  const product = productById(active);

  const step = useCallback((dir: 1 | -1) => {
    setActive((cur) => {
      const i = PRODUCT_ORDER.indexOf(cur);
      return PRODUCT_ORDER[(i + dir + PRODUCT_ORDER.length) % PRODUCT_ORDER.length];
    });
  }, []);

  const touch = useCallback(() => {
    userTouched.current = true;
  }, []);

  // Gentle auto-tour until the visitor picks, drags or navigates.
  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => {
      if (!userTouched.current) step(1);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [reduce, inView, step]);

  const choose = (id: ProductId, focus = false) => {
    touch();
    setActive(id);
    if (focus) tabRefs.current[id]?.focus();
  };

  const onPickerKey = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const n = PRODUCT_ORDER.length;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (idx + 1) % n;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (idx - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next !== null) {
      e.preventDefault();
      choose(PRODUCT_ORDER[next], true);
    }
  };

  const onReady = useCallback(() => setGl("ready"), []);
  const onError = useCallback(() => setGl("unavailable"), []);

  const stageStyle = {
    "--glow": hexToRgba(product.color, 0.4),
    "--c": hexToCss(product.color),
  } as CSSProperties;

  return (
    <section id="work" className={`band ${styles.section}`} aria-labelledby="work-title">
      <div className="wrap">
        <SectionHeading
          id="work-title"
          as={headingAs}
          onDark
          eyebrow="Our products"
          title="Five products, built in-house"
          intro="Pick a product and drag the model to turn it. Each one is a real app or prototype from our own studio."
        />

        <div className={styles.stage}>
          <div ref={viewRef} className={styles.view} style={stageStyle} data-gl={gl}>
            {gl !== "unavailable" ? (
              <SceneErrorBoundary onError={onError}>
                <ProductScene
                  className={styles.canvas}
                  active={active}
                  paused={!inView}
                  onReady={onReady}
                  onError={onError}
                  onInteract={touch}
                  label={`3D model of ${product.name}`}
                />
              </SceneErrorBoundary>
            ) : null}

            <p className={styles.label}>
              <i aria-hidden="true" />
              <span>{product.name}</span>
            </p>
            {gl !== "unavailable" ? <p className={styles.hint}>Drag to rotate</p> : null}
            <div className={styles.nav}>
              <button
                type="button"
                aria-label="Previous product"
                onClick={() => {
                  touch();
                  step(-1);
                }}
              >
                <Icon name="left" />
              </button>
              <button
                type="button"
                aria-label="Next product"
                onClick={() => {
                  touch();
                  step(1);
                }}
              >
                <Icon name="arrow" />
              </button>
            </div>
            {gl === "unavailable" ? (
              <p className={styles.fallback}>
                The 3D view is not available on this device. Product details are shown beside it.
              </p>
            ) : null}
          </div>

          <div>
            <div className={styles.picker} role="tablist" aria-label="Products">
              {PRODUCTS.map((p, idx) => {
                const on = p.id === active;
                return (
                  <button
                    key={p.id}
                    ref={(el) => {
                      tabRefs.current[p.id] = el;
                    }}
                    className={styles.pick}
                    type="button"
                    role="tab"
                    id={`product-tab-${p.id}`}
                    aria-selected={on}
                    aria-controls={`product-panel-${p.id}`}
                    tabIndex={on ? 0 : -1}
                    style={{ "--dot": hexToCss(p.color) } as CSSProperties}
                    onClick={() => choose(p.id)}
                    onKeyDown={(e) => onPickerKey(e, idx)}
                  >
                    <i aria-hidden="true" />
                    {p.name}
                  </button>
                );
              })}
            </div>

            {PRODUCTS.map((p) => (
              <article
                key={p.id}
                id={`product-panel-${p.id}`}
                className={styles.info}
                role="tabpanel"
                aria-labelledby={`product-tab-${p.id}`}
                hidden={p.id !== active}
              >
                <span className={`${styles.pill} ${styles[p.status.tone]}`}>{p.status.label}</span>
                <h3>{p.name}</h3>
                <p className={styles.summary}>{p.summary}</p>
                <ul className={styles.feat}>
                  {p.features.map((f) => (
                    <li key={f}>
                      <Icon name="check" />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className={styles.tech}>{p.tech}</p>
                {p.link || p.links ? (
                  <div className={styles.links}>
                    {[...(p.link ? [p.link] : []), ...(p.links ?? [])].map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                        {l.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
