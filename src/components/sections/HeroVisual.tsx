"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { HERO } from "@/lib/constants";
import { SceneErrorBoundary } from "@/components/three/SceneErrorBoundary";
import { useWebGLSupport } from "@/components/three/support";
import styles from "./HeroVisual.module.css";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

type GlState = "pending" | "ready" | "unavailable";

/**
 * Right-hand hero column: the 3D phone with orbiting candidate cards, or the
 * two "desk" lists when WebGL is not available (same fallback as the reference).
 * The server always renders the desks, so the content exists without JS.
 */
export function HeroVisual() {
  const supported = useWebGLSupport();
  const [status, setStatus] = useState<GlState>("pending");
  const gl: GlState = supported === false ? "unavailable" : status;
  const onReady = useCallback(() => setStatus("ready"), []);
  const onError = useCallback(() => setStatus("unavailable"), []);

  return (
    <div className={styles.visual} data-gl={gl} aria-label="What we handle" role="group">
      {gl !== "unavailable" ? (
        <SceneErrorBoundary onError={onError}>
          <HeroScene className={styles.canvas} onReady={onReady} onError={onError} />
        </SceneErrorBoundary>
      ) : null}
      <div className={styles.desks}>
        {HERO.desks.map((d) => (
          <div key={d.title} className={styles.desk}>
            <h3>{d.title}</h3>
            <ul>
              {d.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
