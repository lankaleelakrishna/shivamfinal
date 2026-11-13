import type { ProductId } from "@/lib/products";
import { buildCircle } from "./circle";
import { buildHireNova } from "./hireNova";
import { buildHireVaani } from "./hireVaani";
import { buildParkNow } from "./parkNow";
import { buildVivahLive } from "./vivahLive";
import type { ModelBuilder } from "./types";

export const MODEL_BUILDERS: Record<ProductId, ModelBuilder> = {
  hirenova: buildHireNova,
  hirevaani: buildHireVaani,
  vivahlive: buildVivahLive,
  circle: buildCircle,
  parknow: buildParkNow,
};

export type { ProductModel } from "./types";
