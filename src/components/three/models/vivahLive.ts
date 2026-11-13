import * as THREE from "three";
import { PI, basic, box, mat } from "../webgl";
import type { ProductModel } from "./types";

function videoPhone(screenColor: number, x: number, ry: number): THREE.Group {
  const p = new THREE.Group();
  p.add(box(0.95, 1.7, 0.07, mat(0x16223a, { r: 0.4, m: 0.5 })));
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 1.55), basic(screenColor));
  screen.position.z = 0.04;
  p.add(screen);
  const head = new THREE.Mesh(new THREE.CircleGeometry(0.17, 24), basic(0xffffff));
  head.position.set(0, 0.22, 0.05);
  p.add(head);
  const shoulders = new THREE.Mesh(new THREE.CircleGeometry(0.34, 24, 0, PI), basic(0xffffff));
  shoulders.position.set(0, -0.2, 0.05);
  p.add(shoulders);
  p.position.x = x;
  p.rotation.y = ry;
  p.rotation.z = x < 0 ? 0.08 : -0.08;
  return p;
}

/** VivahLive: a beating heart, two video-call phones in orbit and floating coins. */
export function buildVivahLive(): ProductModel {
  const g = new THREE.Group();
  const pink = 0xff5c8a;

  const h = new THREE.Shape();
  h.moveTo(0, -1);
  h.bezierCurveTo(-0.2, -0.75, -1.1, -0.2, -1.1, 0.35);
  h.bezierCurveTo(-1.1, 0.95, -0.35, 1.15, 0, 0.6);
  h.bezierCurveTo(0.35, 1.15, 1.1, 0.95, 1.1, 0.35);
  h.bezierCurveTo(1.1, -0.2, 0.2, -0.75, 0, -1);
  const geo = new THREE.ExtrudeGeometry(h, {
    depth: 0.5,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.1,
    bevelSegments: 6,
    curveSegments: 40,
  });
  geo.center();
  const heart = new THREE.Mesh(geo, mat(pink, { r: 0.3, m: 0.2, e: 0x5a0f26, ei: 0.6 }));
  g.add(heart);

  const orbit = new THREE.Group();
  orbit.add(videoPhone(0x7aa7ff, -2.2, PI / 2));
  orbit.add(videoPhone(0xffb36b, 2.2, -PI / 2));
  g.add(orbit);

  interface Coin {
    obj: THREE.Group;
    r: number;
    ph: number;
    y: number;
  }
  const coinMat = mat(0xf2b84b, { r: 0.3, m: 0.8, e: 0x7a5200, ei: 0.4 });
  const coinGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 28);
  const coins: Coin[] = [];
  for (let i = 0; i < 6; i++) {
    const w = new THREE.Group();
    const cm = new THREE.Mesh(coinGeo, coinMat);
    cm.rotation.x = PI / 2;
    w.add(cm);
    g.add(w);
    coins.push({ obj: w, r: 1.5 + (i % 3) * 0.25, ph: i * 1.05, y: -1.1 + i * 0.45 });
  }

  return {
    group: g,
    update(t) {
      const beat = Math.max(0, Math.sin(t * 3.2));
      heart.scale.setScalar(0.95 * (1 + 0.07 * beat * beat * beat));
      heart.rotation.y = Math.sin(t * 0.7) * 0.35;
      orbit.rotation.y = t * 0.5;
      for (const c of coins) {
        const a = t * 0.9 + c.ph;
        c.obj.position.set(Math.cos(a) * c.r, c.y + Math.sin(t * 1.5 + c.ph) * 0.15, Math.sin(a) * c.r);
        c.obj.rotation.y = t * 2 + c.ph;
      }
    },
  };
}
