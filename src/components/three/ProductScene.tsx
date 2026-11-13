"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { prefersReducedMotion, REDUCED_MOTION_QUERY } from "@/hooks/useMediaQuery";
import { PRODUCTS, productById, type ProductId } from "@/lib/products";
import { MODEL_BUILDERS, type ProductModel } from "./models";
import {
  LIGHT,
  createFrameLoop,
  tryCreateRenderer,
  disposeObject,
  disposeRenderer,
  isWebGLAvailable,
  mountCanvas,
} from "./webgl";

export interface ProductSceneProps {
  active: ProductId;
  /** Stop rendering (section off-screen). */
  paused: boolean;
  className?: string;
  label: string;
  onReady: () => void;
  onError: () => void;
  /** Called on the first drag, so the auto-tour stops. */
  onInteract: () => void;
}

interface SceneApi {
  setActive(id: ProductId): void;
  setPaused(paused: boolean): void;
}

interface Item {
  id: ProductId;
  base: number;
  s: number;
  model: ProductModel;
}

/**
 * The products stage: all five models live in one scene and cross-fade by
 * scale when the active product changes. Drag rotates with inertia, there is a
 * slow idle spin, and the key light takes the product colour.
 */
export default function ProductScene({ active, paused, className, label, onReady, onError, onInteract }: ProductSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<SceneApi | null>(null);
  const initial = useRef({ active, paused });
  const callbacks = useRef({ onReady, onError, onInteract });

  useEffect(() => {
    callbacks.current = { onReady, onError, onInteract };
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (!isWebGLAvailable()) {
      callbacks.current.onError();
      return;
    }

    const canvas = mountCanvas(host);
    const renderer = tryCreateRenderer(canvas);
    if (!renderer) {
      canvas.remove();
      callbacks.current.onError();
      return;
    }

    let reduce = prefersReducedMotion();
    let activeId: ProductId = initial.current.active;
    let paused = initial.current.paused;
    let dirty = true;

    /* scene, camera and lights (values from the reference) */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.4, 7.2);
    camera.lookAt(0, 0, 0);
    scene.add(LIGHT.ambient(0xffffff, 0.6));
    const key = LIGHT.directional(0xffffff, 0.9);
    key.position.set(3, 5, 4);
    scene.add(key);
    const rim = LIGHT.directional(0x88aaff, 0.4);
    rim.position.set(-4, 2, -4);
    scene.add(rim);
    const accent = LIGHT.point(productById(activeId).color, 1.3, 30);
    accent.position.set(-3, 2.5, 4);
    scene.add(accent);

    const root = new THREE.Group();
    scene.add(root);

    const items: Item[] = PRODUCTS.map((p) => {
      const model = MODEL_BUILDERS[p.id]();
      const on = p.id === activeId;
      model.group.visible = on;
      model.group.scale.setScalar(on ? p.modelScale : 0.001);
      root.add(model.group);
      return { id: p.id, base: p.modelScale, s: on ? 1 : 0, model };
    });

    /* sizing */
    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = Math.max(6.6, 7.6 / camera.aspect);
      camera.updateProjectionMatrix();
      dirty = true;
      if (!loop.running) renderFrame(0);
    };
    const ro = new ResizeObserver(resize);

    /* drag to rotate, with inertia */
    let dragging = false;
    let lastX = 0;
    let spinVel = 0;
    let userY = 0.3;
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      dragging = true;
      lastX = e.clientX;
      spinVel = 0;
      callbacks.current.onInteract();
      try {
        host.setPointerCapture(e.pointerId);
      } catch {
        /* capture is best effort */
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      userY += dx * 0.01;
      spinVel = dx * 0.004;
      dirty = true;
    };
    const onUp = () => {
      dragging = false;
    };
    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerup", onUp);
    host.addEventListener("pointercancel", onUp);
    host.addEventListener("lostpointercapture", onUp);

    /* frame */
    let t = 0;
    const renderFrame = (dt: number) => {
      const f = dt * 60; // normalise the reference's per-frame constants to 60 fps
      t = reduce ? 1.5 : t + dt;
      if (!dragging) {
        userY += ((reduce ? 0 : 0.003) + spinVel) * f;
        spinVel *= Math.pow(0.94, f);
        if (Math.abs(spinVel) > 1e-5) dirty = true;
      }
      root.rotation.y = userY;

      let settling = false;
      const k = reduce ? 1 : 1 - Math.pow(1 - 0.14, Math.max(f, 0.0001));
      for (const it of items) {
        const target = it.id === activeId ? 1 : 0;
        it.s += (target - it.s) * k;
        if (Math.abs(target - it.s) < 0.003) it.s = target;
        else settling = true;
        it.model.group.visible = it.s > 0.01;
        if (it.model.group.visible) {
          it.model.group.scale.setScalar(Math.max(0.001, it.s) * it.base);
          it.model.update(t);
        }
      }

      // With reduced motion the scene is static: only redraw when something changed.
      if (reduce && !dirty && !settling) return;
      renderer.render(scene, camera);
      dirty = false;
    };
    const loop = createFrameLoop(renderFrame);

    const syncRunning = () => {
      const shouldRun = !paused && document.visibilityState !== "hidden";
      if (shouldRun) loop.start();
      else loop.stop();
    };
    const onVisibility = () => syncRunning();
    document.addEventListener("visibilitychange", onVisibility);

    const mql = window.matchMedia(REDUCED_MOTION_QUERY);
    const onMotion = () => {
      reduce = mql.matches;
      dirty = true;
    };
    mql.addEventListener("change", onMotion);

    apiRef.current = {
      setActive(id) {
        activeId = id;
        accent.color.setHex(productById(id).color);
        dirty = true;
        if (!loop.running) renderFrame(0);
      },
      setPaused(p) {
        paused = p;
        syncRunning();
      },
    };

    ro.observe(host);
    resize();
    renderFrame(0);
    syncRunning();
    callbacks.current.onReady();

    return () => {
      apiRef.current = null;
      loop.stop();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      mql.removeEventListener("change", onMotion);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onUp);
      host.removeEventListener("lostpointercapture", onUp);
      disposeObject(scene);
      disposeRenderer(renderer);
      canvas.remove();
    };
  }, []);

  useEffect(() => {
    apiRef.current?.setActive(active);
  }, [active]);

  useEffect(() => {
    apiRef.current?.setPaused(paused);
  }, [paused]);

  return <div ref={hostRef} className={className} role="img" aria-label={label} />;
}
