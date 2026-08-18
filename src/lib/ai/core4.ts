// TASK-201: Product Understanding Engine
// Source: documents/[개발 문서] AI_CORE4_SCHEMA.md (2. Final Schema, Status: LOCKED)
//
// Core4는 Color/Tone, Silhouette/Form, Material, Monogram Density 4개 축으로 구성되며,
// 각 축은 아래 Enum 또는 null(판정 근거 부족)만 허용한다.
// Material, Monogram Density는 reversible/detachable 등 대등한 복수 구조가 실제로 존재할 때만
// 2개 이상 값의 배열을 허용한다 (AI_CORE4_SCHEMA.md 4.3, 4.4 Multi-value 예외).

import { z } from "zod";

export const COLOR_TONE_VALUES = [
  "warm_neutral",
  "cool_neutral",
  "muted",
  "saturated",
  "mono",
] as const;

export const SILHOUETTE_FORM_VALUES = [
  "structured",
  "soft",
  "compact",
  "envelope",
] as const;

export const MATERIAL_VALUES = [
  "signature_monogram",
  "leather",
  "nylon",
  "textile",
] as const;

export const MONOGRAM_DENSITY_VALUES = ["none", "low", "medium", "high"] as const;

const colorToneSchema = z.enum(COLOR_TONE_VALUES).nullable();
const silhouetteFormSchema = z.enum(SILHOUETTE_FORM_VALUES).nullable();

// Material / Monogram Density만 명확한 대등 복수 구조에 한해 배열을 허용한다.
const materialSchema = z.union([
  z.enum(MATERIAL_VALUES),
  z.array(z.enum(MATERIAL_VALUES)).min(2),
  z.null(),
]);

const monogramDensitySchema = z.union([
  z.enum(MONOGRAM_DENSITY_VALUES),
  z.array(z.enum(MONOGRAM_DENSITY_VALUES)).min(2),
  z.null(),
]);

export const Core4Schema = z.object({
  colorTone: colorToneSchema,
  silhouetteForm: silhouetteFormSchema,
  material: materialSchema,
  monogramDensity: monogramDensitySchema,
});

export type Core4 = z.infer<typeof Core4Schema>;
