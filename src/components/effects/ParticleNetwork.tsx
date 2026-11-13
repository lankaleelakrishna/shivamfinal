"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/hooks/useMediaQuery";
import styles from "./ParticleNetwork.module.css";

interface Point {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  r: number;
}

const LINK_DISTANCE = 112;
const HALO_RADIUS = 155;

/**
 * Hero background: drifting depth-scaled particles joined by faint lines, with
 * pointer parallax and a warm halo. Ported from the reference; it stops
 * drawing when the hero is off-screen or the tab is hidden.
 */
export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !hero || !ctx) return;

    const reduce = prefersReducedMotion();
    let points: Point[] = [];
    let w = 0;
    let h = 0;
    const pointer = { x: -9999, y: -9999 };

    const seed = () => {
      const count = Math.min(105, Math.max(38, Math.floor((w * h) / 10500)));
      points = Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * w,
        y: (Math.random() - 0.5) * h,
        z: Math.random() * 0.85 + 0.15,
        vx: (Math.random() - 0.5) * 0.34,
        vy: (Math.random() - 0.5) * 0.34,
        vz: (Math.random() - 0.5) * 0.0018,
        r: Math.random() * 1.4 + 0.7,
      }));
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of points) {
        ctx.beginPath();
        ctx.arc(w * 0.5 + p.x, h * 0.5 + p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(183,211,241,.55)";
        ctx.fill();
      }
    };

    const resize = () => {
      const r = hero.getBoundingClientRect();
      const nw = r.width;
      const nh = r.height;
      if (!nw || !nh) return;
      // Ignore tiny height jitter (mobile URL bar) so the field does not reshuffle.
      const reseed = Math.abs(nw - w) > 1 || Math.abs(nh - h) > 40 || points.length === 0;
      w = nw;
      h = nh;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reseed) seed();
      if (reduce) drawStatic();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const hasPointer = pointer.x > -1000;
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.vx *= 0.999;
        p.vy *= 0.999;
        if (p.x < -w * 0.58 || p.x > w * 0.58) p.vx *= -1;
        if (p.y < -h * 0.58 || p.y > h * 0.58) p.vy *= -1;
        if (p.z < 0.15 || p.z > 1) p.vz *= -1;

        let px = w * 0.5 + p.x * (0.55 + 0.7 * p.z);
        let py = h * 0.5 + p.y * (0.55 + 0.7 * p.z);
        if (hasPointer) {
          px += (pointer.x - w * 0.5) * 0.018 * p.z;
          py += (pointer.y - h * 0.5) * 0.018 * p.z;
        }

        ctx.beginPath();
        ctx.arc(px, py, p.r * (0.55 + p.z), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(183,211,241,${0.28 + p.z * 0.58})`;
        ctx.fill();

        for (let j = i + 1; j < points.length; j++) {
          const q = points[j];
          const qx = w * 0.5 + q.x * (0.55 + 0.7 * q.z);
          const qy = h * 0.5 + q.y * (0.55 + 0.7 * q.z);
          const dd = Math.hypot(px - qx, py - qy);
          if (dd < LINK_DISTANCE && Math.abs(p.z - q.z) < 0.34) {
            const mz = Math.min(p.z, q.z);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(qx, qy);
            ctx.strokeStyle = `rgba(133,177,222,${(1 - dd / LINK_DISTANCE) * mz * 0.34})`;
            ctx.lineWidth = 0.55 + mz * 0.55;
            ctx.stroke();
          }
        }
      }
      if (hasPointer) {
        const halo = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, HALO_RADIUS);
        halo.addColorStop(0, "rgba(245,160,74,.11)");
        halo.addColorStop(1, "rgba(245,160,74,0)");
        ctx.fillStyle = halo;
        ctx.fillRect(pointer.x - HALO_RADIUS, pointer.y - HALO_RADIUS, HALO_RADIUS * 2, HALO_RADIUS * 2);
      }
    };

    let raf = 0;
    let running = false;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      draw();
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    let onScreen = true;
    const sync = () => (onScreen && document.visibilityState !== "hidden" ? start() : stop());
    const io = new IntersectionObserver((entries) => {
      onScreen = entries[entries.length - 1]?.isIntersecting ?? false;
      sync();
    });
    const ro = new ResizeObserver(resize);

    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", sync);
    resize();
    ro.observe(hero);
    io.observe(hero);
    sync();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
