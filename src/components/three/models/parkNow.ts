import * as THREE from "three";
import { PI, basic, box, clamp01, ease, lerp, mat } from "../webgl";
import type { ProductModel } from "./types";

function signTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const x = c.getContext("2d");
  if (x) {
    x.fillStyle = "#1F6FEB";
    x.fillRect(0, 0, 128, 128);
    x.fillStyle = "#FFFFFF";
    x.font = "bold 92px sans-serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText("P", 64, 70);
  }
  return new THREE.CanvasTexture(c);
}

function makeCar(color: number): THREE.Group {
  const c = new THREE.Group();
  const body = box(0.6, 0.2, 1.0, mat(color, { r: 0.35, m: 0.4 }));
  body.position.y = 0.2;
  c.add(body);
  const cab = box(0.5, 0.17, 0.5, mat(0xcfe3f7, { r: 0.2, m: 0.3 }));
  cab.position.set(0, 0.37, -0.05);
  c.add(cab);
  const wheelMat = mat(0x10161f, { r: 0.8, m: 0 });
  const wheelGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 16);
  for (const [wx, wz] of [
    [-0.31, 0.32],
    [0.31, 0.32],
    [-0.31, -0.32],
    [0.31, -0.32],
  ]) {
    const w = new THREE.Mesh(wheelGeo, wheelMat);
    w.rotation.z = PI / 2;
    w.position.set(wx, 0.1, wz);
    c.add(w);
  }
  return c;
}

/** ParkNow: a car drives in, finds the free bay marked by the pin, and parks. */
export function buildParkNow(): ProductModel {
  const g = new THREE.Group();
  const green = 0x2bd67b;

  const ground = box(5.2, 0.1, 3.6, mat(0x1e2b3c, { r: 0.85, m: 0 }));
  g.add(ground);

  const lineM = mat(0xdce6f2, { r: 0.7, m: 0 });
  for (const z of [-1.05, 1.05]) {
    for (const x of [-1.8, -0.9, 0, 0.9, 1.8]) {
      const l = box(0.04, 0.012, 1.1, lineM);
      l.position.set(x, 0.056, z);
      g.add(l);
    }
  }

  const parked = [
    { x: -1.35, z: -1.05, c: 0xe5484d, r: PI },
    { x: 0.45, z: -1.05, c: 0x3b82f6, r: PI },
    { x: 1.35, z: -1.05, c: 0xf5c542, r: PI },
    { x: -0.45, z: 1.05, c: 0x8b5cf6, r: 0 },
    { x: 1.35, z: 1.05, c: 0x14b8a6, r: 0 },
  ];
  for (const p of parked) {
    const car = makeCar(p.c);
    car.position.set(p.x, 0.05, p.z);
    car.rotation.y = p.r;
    g.add(car);
  }

  const bayMat = basic(green, 0.5);
  const bay = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 1.0), bayMat);
  bay.rotation.x = -PI / 2;
  bay.position.set(-0.45, 0.062, -1.05);
  g.add(bay);

  const pin = new THREE.Group();
  const pinMat = mat(green, { r: 0.3, m: 0.2, e: green, ei: 0.7 });
  pin.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16), pinMat));
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), basic(0xffffff));
  dot.position.z = 0.16;
  pin.add(dot);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.4, 20), pinMat);
  tip.rotation.x = PI;
  tip.position.y = -0.28;
  pin.add(tip);
  pin.position.set(-0.45, 1.3, -1.05);
  g.add(pin);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.3, 10), mat(0x9aa8ba, { r: 0.5, m: 0.5 }));
  pole.position.set(2.3, 0.7, 0.2);
  g.add(pole);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshBasicMaterial({ map: signTexture() }));
  sign.position.set(2.3, 1.45, 0.24);
  g.add(sign);

  const mover = makeCar(0xf2f5f9);
  g.add(mover);

  g.rotation.x = 0.5;
  const CYCLE = 9;

  return {
    group: g,
    update(t) {
      const u = t % CYCLE;
      let x = 2.6;
      let z = 0;
      let th = -PI / 2;
      if (u < 3) {
        x = lerp(2.6, -0.45, ease(u / 3));
      } else if (u < 4) {
        x = -0.45;
        th = lerp(-PI / 2, -PI, ease(u - 3));
      } else {
        x = -0.45;
        th = -PI;
        z = lerp(0, -1.05, ease((u - 4) / 1.5));
      }
      mover.position.set(x, 0.05, z);
      mover.rotation.y = th;
      const cs = u < 0.4 ? u / 0.4 : u > 8.4 ? (CYCLE - u) / 0.6 : 1;
      mover.scale.setScalar(Math.max(0.001, cs));

      const taken = u >= 5.5 && u < 8.5;
      bayMat.color.setHex(taken ? 0xe5484d : green);
      bayMat.opacity = 0.35 + 0.2 * Math.sin(t * 4);

      const ps = u < 5.5 ? 1 : u < 6 ? 1 - (u - 5.5) / 0.5 : u < 8 ? 0 : clamp01(u - 8);
      pin.scale.setScalar(Math.max(0.001, ps));
      pin.position.y = 1.3 + Math.sin(t * 3) * 0.1;
    },
  };
}
