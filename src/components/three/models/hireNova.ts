import * as THREE from "three";
import { basic, box, mat } from "../webgl";
import type { ProductModel } from "./types";

/** HireNova AI: a stack of resumes with a scanning beam and orbiting sparks. */
export function buildHireNova(): ProductModel {
  const g = new THREE.Group();
  const blue = 0x5b8cff;
  const paper = mat(0xf3f6fb, { r: 0.7, m: 0 });

  const sheets: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const s = box(2.1, 2.8, 0.05, paper);
    s.position.set(0.18 - 0.18 * i, -0.08 * i, -0.28 * i);
    s.rotation.z = 0.06 * (i - 1);
    g.add(s);
    sheets.push(s);
  }

  const top = sheets[0];
  const lineM = mat(0xafc0d6, { r: 0.8, m: 0 });
  const hiM = mat(blue, { r: 0.4, m: 0, e: blue, ei: 0.5 });

  const avatar = new THREE.Mesh(new THREE.CircleGeometry(0.22, 32), hiM);
  avatar.position.set(-0.6, 1.05, 0.035);
  top.add(avatar);
  const name = box(0.9, 0.12, 0.02, lineM);
  name.position.set(0.1, 1.1, 0.035);
  top.add(name);
  const sub = box(0.6, 0.07, 0.02, lineM);
  sub.position.set(-0.05, 0.92, 0.035);
  top.add(sub);

  [0.65, 0.35, 0.05, -0.25, -0.55, -0.85, -1.15].forEach((y, k) => {
    const w = k === 0 ? 1.0 : 1.5 - (k % 3) * 0.2;
    const l = box(w, 0.09, 0.02, k === 1 || k === 4 ? hiM : lineM);
    l.position.set(-0.8 + w / 2, y, 0.035);
    top.add(l);
  });

  const scan = new THREE.Group();
  scan.add(new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.07), basic(blue, 0.95, true)));
  scan.add(new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.6), basic(blue, 0.16, true)));
  scan.position.set(0.18, 0, 0.1);
  g.add(scan);

  interface Spark {
    mesh: THREE.Mesh;
    r: number;
    sp: number;
    ph: number;
    y: number;
  }
  const sparkMat = mat(0xbfd2ff, { e: blue, ei: 1 });
  const sparkGeo = new THREE.OctahedronGeometry(0.07);
  const sparks: Spark[] = [];
  for (let j = 0; j < 12; j++) {
    const mesh = new THREE.Mesh(sparkGeo, sparkMat);
    sparks.push({ mesh, r: 1.7 + (j % 4) * 0.2, sp: 0.5 + (j % 5) * 0.12, ph: j * 0.9, y: -1.2 + (j / 11) * 2.4 });
    g.add(mesh);
  }

  g.rotation.x = -0.05;

  return {
    group: g,
    update(t) {
      scan.position.y = Math.sin(t * 1.4) * 1.3;
      hiM.emissiveIntensity = 0.45 + 0.35 * Math.sin(t * 3);
      for (const s of sparks) {
        const a = t * s.sp + s.ph;
        s.mesh.position.set(Math.cos(a) * s.r, s.y + Math.sin(t * 2 + s.ph) * 0.2, Math.sin(a) * 0.9);
        s.mesh.rotation.set(a, a * 1.3, 0);
      }
    },
  };
}
