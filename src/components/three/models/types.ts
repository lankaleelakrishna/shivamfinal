import type * as THREE from "three";

/** One product's 3D scene: a group plus a per-frame animation step. */
export interface ProductModel {
  group: THREE.Group;
  /** Advance the model's own animation to scene time `t` (seconds). */
  update(t: number): void;
}

export type ModelBuilder = () => ProductModel;
