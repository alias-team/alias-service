// TASK-201: Product Understanding Engine
// Source: documents/[개발 문서] 07_DATABASE_SCHEMA.md (4.2 product_profiles)
//
// AI 응답을 저장/반환하기 전 검증하는 Zod Schema.
// 07_DATABASE_SCHEMA.md 4.2 핵심 규칙:
// - AI Product Trait은 2~3개를 기준으로 저장한다.
// - 각 Trait에는 이름, 이유, Evidence가 있어야 한다.
// - core4의 값은 허용된 Enum 또는 null만 허용한다.
// - 검증에 실패한 AI 결과는 저장하지 않는다.

import { z } from "zod";
// @ts-expect-error TS5097: 플레인 node로 직접 실행하기 위해 명시적 .ts 확장자를 유지한다
// (moduleResolution: "bundler"에서는 allowImportingTsExtensions 없이 tsc가 이를 거부하지만,
// 런타임 동작에는 영향이 없다).
import { Core4Schema } from "./core4.ts";

// 07_DATABASE_SCHEMA.md 4.2 ai_product_traits 예시의 evidence 형태: { source, text }
const EvidenceItemSchema = z.object({
  source: z.enum(["product_image", "product_description"]),
  text: z.string().min(1),
});

const AiProductTraitSchema = z.object({
  name: z.string().min(1),
  reason: z.string().min(1),
  evidence: z.array(EvidenceItemSchema).min(1),
});

export const ProductProfileAiOutputSchema = z.object({
  core4: Core4Schema,
  ai_product_traits: z.array(AiProductTraitSchema).min(2).max(3),
  evidence: z.array(EvidenceItemSchema).min(1),
});

export type ProductProfileAiOutput = z.infer<typeof ProductProfileAiOutputSchema>;

export class ProductProfileValidationError extends Error {
  readonly issues: z.ZodError["issues"];

  constructor(issues: z.ZodError["issues"]) {
    super(
      `Product Profile 검증 실패: ${issues
        .map((issue) => `${issue.path.join(".")} - ${issue.message}`)
        .join("; ")}`
    );
    this.name = "ProductProfileValidationError";
    this.issues = issues;
  }
}
