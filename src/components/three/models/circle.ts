import * as THREE from "three";
import { PI, basic, mat } from "../webgl";
import type { ProductModel } from "./types";

/** Circle: private orbit rings whose members appear, then fade away (24-hour posts). */
export function buildCircle(): ProductModel {
  const g = new THREE.Group();
  const vio = 0xa78bfa;
  const radii = [0.95, 1.55, 2.15];
  const tilts = [0, 0.25, -0.2];
  const speeds = [0.6, 0.45, 0.33];

  const rings: THREE.Group[] = radii.map((r, i) => {
    const rg = new THREE.Group();
    rg.rotation.x = tilts[i];
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.028, 12, 90), mat(vio, { r: 0.3, m: 0.3, e: vio, ei: 0.7 }));
    ring.rotation.x = PI / 2;
    rg.add(ring);
    g.add(rg);
    return rg;
  });

  const core = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 16), mat(vio, { r: 0.3, m: 0.2, e: vio, ei: 0.8 }));
  g.add(core);
  g.add(new THREE.Mesh(new THREE.SphereGeometry(0.62, 24, 12), basic(vio, 0.14, true)));

  const palette = [0xffd166, 0x06d6a0, 0xef476f, 0x4cc9f0, 0xf5a04a, 0xffffff, 0x80ed99, 0xff9cee, 0x72ddf7];
  interface Member {
    mesh: THREE.Mesh;
    ri: number;
    ph: number;
    sp: number;
  }
  const memberGeo = new THREE.SphereGeometry(0.14, 20, 12);
  const members: Member[] = palette.map((color, i) => {
    const mesh = new THREE.Mesh(memberGeo, mat(color, { r: 0.35, m: 0.1, e: color, ei: 0.45 }));
    const ri = i % 3;
    rings[ri].add(mesh);
    return { mesh, ri, ph: i * 0.7, sp: speeds[ri] * (i % 2 ? 1 : -1) };
  });

  g.rotation.x = 0.5;

  return {
    group: g,
    update(t) {
      core.scale.setScalar(1 + 0.05 * Math.sin(t * 2));
      members.forEach((m, i) => {
        const a = t * m.sp + m.ph;
        const r = radii[m.ri];
        m.mesh.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
        const p = (t * 0.12 + i / 9) % 1;
        const s = p < 0.1 ? p / 0.1 : p > 0.85 ? (1 - p) / 0.15 : 1;
        m.mesh.scale.setScalar(Math.max(0.001, s));
      });
    },
  };
}
