import * as THREE from "three";
import { PI, box, mat } from "../webgl";
import type { ProductModel } from "./types";

/** HireVaani: a studio microphone inside a ring of live voice bars. */
export function buildHireVaani(): ProductModel {
  const g = new THREE.Group();
  const orange = 0xf5a04a;
  const metal = mat(0x22344d, { r: 0.35, m: 0.6 });
  const ringM = mat(orange, { r: 0.3, m: 0.3, e: orange, ei: 0.5 });

  const mic = new THREE.Group();
  mic.add(new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.0, 32), metal));
  const capTop = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 16), metal);
  capTop.position.y = 0.5;
  mic.add(capTop);
  const capBottom = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 16), metal);
  capBottom.position.y = -0.5;
  mic.add(capBottom);

  for (const y of [0.18, -0.18]) {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.035, 12, 40), ringM);
    band.rotation.x = PI / 2;
    band.position.y = y;
    mic.add(band);
  }

  const arc = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.05, 12, 40, PI), metal);
  arc.rotation.z = PI;
  arc.position.y = 0.1;
  mic.add(arc);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 12), metal);
  stem.position.y = -0.87;
  mic.add(stem);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.08, 32), metal);
  base.position.y = -1.15;
  mic.add(base);
  g.add(mic);

  const N = 40;
  const R = 1.95;
  const bars: THREE.Mesh[] = [];
  for (let i = 0; i < N; i++) {
    const c = new THREE.Color().setHSL(0.06 + 0.06 * ((i % 8) / 8), 0.9, 0.55);
    const b = box(
      0.09,
      1,
      0.09,
      new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.45, roughness: 0.5, metalness: 0.1 }),
    );
    const a = (i / N) * PI * 2;
    b.position.set(Math.cos(a) * R, 0, Math.sin(a) * R);
    g.add(b);
    bars.push(b);
  }

  g.rotation.x = 0.35;

  return {
    group: g,
    update(t) {
      bars.forEach((b, i) => {
        b.scale.y = 0.25 + 1.1 * Math.abs(Math.sin(t * 2.2 + i * 0.45)) * (0.55 + 0.45 * Math.sin(t * 0.9 + i * 0.2));
      });
      mic.position.y = 0.1 + Math.sin(t * 1.6) * 0.06;
    },
  };
}
