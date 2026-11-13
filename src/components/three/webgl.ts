import * as THREE from "three";

/**
 * Shared Three.js plumbing for the hero and product scenes.
 *
 * The reference was authored against three r128 (legacy lights, no colour
 * management). Modern three (r155+) is physically based by default, which
 * would make every scene darker and more saturated. `createRenderer` and the
 * `LIGHT` helpers restore the r128 look so the models match the reference.
 */

export { isWebGLAvailable } from "./support";

/** Legacy (r128) lighting multiplied irradiance by π; modern three does not. */
const LEGACY_SCALE = Math.PI;
/** Approximates r128's linear point-light falloff (decay 1, distance 30) at ~5.5 units. */
const LEGACY_POINT_FALLOFF = 0.82;

export const LIGHT = {
  ambient: (color: THREE.ColorRepresentation, intensity: number) => new THREE.AmbientLight(color, intensity * LEGACY_SCALE),
  directional: (color: THREE.ColorRepresentation, intensity: number) =>
    new THREE.DirectionalLight(color, intensity * LEGACY_SCALE),
  point: (color: THREE.ColorRepresentation, intensity: number, distance: number) =>
    new THREE.PointLight(color, intensity * LEGACY_SCALE * LEGACY_POINT_FALLOFF, distance, 0),
};

export interface RendererOptions {
  /** Cap for devicePixelRatio. Lowered automatically on touch devices. */
  maxPixelRatio?: number;
}

export function createRenderer(canvas: HTMLCanvasElement, { maxPixelRatio = 2 }: RendererOptions = {}): THREE.WebGLRenderer {
  // Match r128: hex colours are used as-is and output is not sRGB-encoded.
  THREE.ColorManagement.enabled = false;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.setClearColor(0x000000, 0);
  const coarse = window.matchMedia?.("(pointer: coarse)").matches;
  const cap = coarse ? Math.min(maxPixelRatio, 1.5) : maxPixelRatio;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap));
  return renderer;
}

/** Like createRenderer, but returns null instead of throwing (no WebGL2, context limit, etc.). */
export function tryCreateRenderer(canvas: HTMLCanvasElement, options?: RendererOptions): THREE.WebGLRenderer | null {
  try {
    return createRenderer(canvas, options);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.warn("[3D] WebGL renderer unavailable:", err);
    return null;
  }
}

/** A canvas element that fills its host; created per mount so StrictMode remounts get a fresh GL context. */
export function mountCanvas(host: HTMLElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);
  return canvas;
}

/** Frees every geometry, material and texture under `root`. */
export function disposeObject(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    mesh.geometry?.dispose();
    const mats = mesh.material ? (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) : [];
    for (const m of mats) {
      for (const value of Object.values(m)) {
        if (value instanceof THREE.Texture) value.dispose();
      }
      m.dispose();
    }
  });
}

export function disposeRenderer(renderer: THREE.WebGLRenderer): void {
  renderer.dispose();
  renderer.forceContextLoss();
}

/* ---------- small material / geometry helpers (same as the reference) ---------- */

export interface MatOptions {
  r?: number;
  m?: number;
  e?: number;
  ei?: number;
}

export function mat(color: THREE.ColorRepresentation, o: MatOptions = {}): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: o.r ?? 0.45,
    metalness: o.m ?? 0.1,
    emissive: new THREE.Color(o.e ?? 0x000000),
    emissiveIntensity: o.ei ?? 1,
  });
}

export function basic(color: THREE.ColorRepresentation, opacity?: number, additive?: boolean): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: opacity != null && opacity < 1,
    opacity: opacity ?? 1,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    depthWrite: !additive,
  });
}

export function box(w: number, h: number, d: number, m: THREE.Material): THREE.Mesh {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const ease = (x: number) => {
  const k = clamp01(x);
  return k * k * (3 - 2 * k);
};
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export const PI = Math.PI;

/* ---------- frame loop with pause / resume ---------- */

export interface FrameLoop {
  start(): void;
  stop(): void;
  readonly running: boolean;
}

/** requestAnimationFrame loop that passes a clamped delta (seconds) and can be paused. */
export function createFrameLoop(tick: (dt: number) => void): FrameLoop {
  let raf = 0;
  let last = 0;
  let running = false;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(Math.max((now - last) / 1000, 0), 0.05);
    last = now;
    tick(dt);
  };
  return {
    start() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    get running() {
      return running;
    },
  };
}
