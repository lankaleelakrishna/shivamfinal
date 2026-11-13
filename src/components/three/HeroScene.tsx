"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { prefersReducedMotion, REDUCED_MOTION_QUERY } from "@/hooks/useMediaQuery";
import { cardTexture, glowTexture, screenTexture, type DrawnTexture } from "./heroTextures";
import {
  LIGHT,
  PI,
  createFrameLoop,
  tryCreateRenderer,
  disposeObject,
  disposeRenderer,
  isWebGLAvailable,
  mountCanvas,
} from "./webgl";

export interface HeroSceneProps {
  className?: string;
  onReady: () => void;
  onError: () => void;
}

const ROLES: Array<[role: string, color: string]> = [
  ["Java Dev", "#5B8CFF"],
  ["Sales Exec", "#2BD67B"],
  ["HR Exec", "#FF5C8A"],
  ["QA Engineer", "#A78BFA"],
  ["Accounts", "#F5A04A"],
  ["Delivery", "#4CC9F0"],
];
const RADII = [2.4, 2.7, 2.3, 2.7, 2.4, 2.6];
const HEIGHTS = [1.0, -0.15, -1.2, 1.45, 0.2, -0.85];

function phoneShape(W: number, H: number, R: number): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-W / 2 + R, -H / 2);
  s.lineTo(W / 2 - R, -H / 2);
  s.quadraticCurveTo(W / 2, -H / 2, W / 2, -H / 2 + R);
  s.lineTo(W / 2, H / 2 - R);
  s.quadraticCurveTo(W / 2, H / 2, W / 2 - R, H / 2);
  s.lineTo(-W / 2 + R, H / 2);
  s.quadraticCurveTo(-W / 2, H / 2, -W / 2, H / 2 - R);
  s.lineTo(-W / 2, -H / 2 + R);
  s.quadraticCurveTo(-W / 2, -H / 2, -W / 2 + R, -H / 2);
  return s;
}

/**
 * Hero: a floating job-board smartphone with six shortlisted-candidate cards
 * orbiting it, tethered by saffron lines, tilting toward the pointer.
 */
export default function HeroScene({ className, onReady, onError }: HeroSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onReady, onError });

  useEffect(() => {
    callbacks.current = { onReady, onError };
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
    let dirty = true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.3, 9);
    scene.add(LIGHT.ambient(0xffffff, 0.75));
    const key = LIGHT.directional(0xffffff, 0.9);
    key.position.set(3, 5, 5);
    scene.add(key);
    const warm = LIGHT.point(0xf5a04a, 1.2, 30);
    warm.position.set(-3, 2, 4);
    scene.add(warm);

    const root = new THREE.Group();
    scene.add(root);

    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 7),
      new THREE.MeshBasicMaterial({ map: glowTexture(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    glow.position.z = -1.2;
    scene.add(glow);

    /* phone */
    const textures: DrawnTexture[] = [];
    const phone = new THREE.Group();
    const bodyGeo = new THREE.ExtrudeGeometry(phoneShape(1.5, 3.0, 0.24), {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 3,
      curveSegments: 16,
    });
    bodyGeo.center();
    phone.add(new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial({ color: 0x0b1626, roughness: 0.3, metalness: 0.65 })));
    const screenTex = screenTexture();
    textures.push(screenTex);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.36, 2.86), new THREE.MeshBasicMaterial({ map: screenTex.texture }));
    screen.position.z = 0.1;
    phone.add(screen);
    root.add(phone);

    /* orbiting candidate cards */
    interface Card {
      mesh: THREE.Mesh;
      r: number;
      y: number;
      ph: number;
      bob: number;
    }
    const cardGeo = new THREE.PlaneGeometry(1.1, 0.6);
    const cards: Card[] = ROLES.map(([role, color], i) => {
      const tex = cardTexture(role, color);
      textures.push(tex);
      const mesh = new THREE.Mesh(cardGeo, new THREE.MeshBasicMaterial({ map: tex.texture, transparent: true }));
      root.add(mesh);
      return { mesh, r: RADII[i], y: HEIGHTS[i], ph: (i / ROLES.length) * PI * 2, bob: i * 1.3 };
    });

    const lineArr = new Float32Array(cards.length * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(lineArr, 3));
    const lines = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ color: 0xf5a04a, transparent: true, opacity: 0.35 }),
    );
    lines.frustumCulled = false;
    root.add(lines);

    // Redraw canvas text once the brand fonts are ready.
    let alive = true;
    document.fonts?.ready.then(() => {
      if (!alive) return;
      textures.forEach((t) => t.redraw());
      dirty = true;
    });

    /* sizing */
    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = Math.max(7.6, 9.2 / camera.aspect);
      camera.updateProjectionMatrix();
      dirty = true;
    };
    const ro = new ResizeObserver(resize);

    /* pointer tilt */
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);

    let t = 0;
    const renderFrame = (dt: number) => {
      const f = dt * 60;
      t = reduce ? 1.2 : t + dt;
      const k = 1 - Math.pow(1 - 0.06, Math.max(f, 0.0001));
      const moving = Math.abs(tx - cx) > 1e-4 || Math.abs(ty - cy) > 1e-4;
      cx += (tx - cx) * k;
      cy += (ty - cy) * k;
      root.rotation.y = Math.sin(t * 0.45) * 0.35 + cx * 0.4;
      root.rotation.x = cy * 0.18;
      phone.position.y = Math.sin(t * 1.2) * 0.08;
      glow.scale.setScalar(1 + 0.05 * Math.sin(t * 1.5));
      cards.forEach((c, i) => {
        const a = t * 0.35 + c.ph;
        c.mesh.position.set(Math.cos(a) * c.r, c.y + Math.sin(t * 1.1 + c.bob) * 0.12, Math.sin(a) * c.r * 0.85);
        c.mesh.lookAt(camera.position);
        lineArr[i * 6] = 0;
        lineArr[i * 6 + 1] = 0;
        lineArr[i * 6 + 2] = 0;
        lineArr[i * 6 + 3] = c.mesh.position.x;
        lineArr[i * 6 + 4] = c.mesh.position.y;
        lineArr[i * 6 + 5] = c.mesh.position.z;
      });
      lineGeo.attributes.position.needsUpdate = true;
      if (reduce && !dirty && !moving) return;
      renderer.render(scene, camera);
      dirty = false;
    };
    const loop = createFrameLoop(renderFrame);

    /* run only while visible */
    let onScreen = true;
    const sync = () => {
      if (onScreen && document.visibilityState !== "hidden") loop.start();
      else loop.stop();
    };
    const io = new IntersectionObserver((entries) => {
      onScreen = entries[entries.length - 1]?.isIntersecting ?? false;
      sync();
    });
    document.addEventListener("visibilitychange", sync);
    const mql = window.matchMedia(REDUCED_MOTION_QUERY);
    const onMotion = () => {
      reduce = mql.matches;
      dirty = true;
    };
    mql.addEventListener("change", onMotion);

    ro.observe(host);
    io.observe(host);
    resize();
    renderFrame(0);
    sync();
    callbacks.current.onReady();

    return () => {
      alive = false;
      loop.stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      mql.removeEventListener("change", onMotion);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      disposeObject(scene);
      disposeRenderer(renderer);
      canvas.remove();
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
