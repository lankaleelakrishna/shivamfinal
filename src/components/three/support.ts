"use client";

import { useSyncExternalStore } from "react";

let cached: boolean | null = null;

/**
 * WebGL2 support check (three r163+ needs WebGL2). Kept free of any three.js
 * import so callers can decide on a fallback before the 3D chunk downloads.
 */
export function isWebGLAvailable(): boolean {
  if (cached !== null) return cached;
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    const ctx = c.getContext("webgl2");
    cached = !!ctx;
    ctx?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}

const noopSubscribe = () => () => {};

/** `null` during SSR/hydration, then whether WebGL2 is available. */
export function useWebGLSupport(): boolean | null {
  return useSyncExternalStore<boolean | null>(noopSubscribe, isWebGLAvailable, () => null);
}
