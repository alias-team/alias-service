import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createMock } = vi.hoisted(() => ({ createMock: vi.fn() }));

vi.mock("./openai-client", () => ({
  getOpenAIClient: () => ({
    chat: { completions: { create: createMock } },
  }),
}));

import { analyzeProduct, TraitQualityValidationError, validateTraitQuality } from "./product-understanding";
import type { ProductProfileAiOutput } from "./product-profile.schema";

// TASK-201: AI Product Trait 의미 품질 검증(validateTraitQuality).
// - Core4 재포장 Trait: Product Profile 전체를 FAIL시키지 않고 해당 Trait만 제외한다.
//   제외 후 남은 유효 Trait이 2개 미만이면 그때 FAIL한다.
// - Evidence grounding: Trait evidence(product_description)가 officialDescription 원문에
//   실제로 존재해야 한다(존재하지 않는 근거를 지어내면 FAIL). top-level evidence와 문장이
//   겹치는 것 자체는 더 이상 오류로 취급하지 않는다(07_DATABASE_SCHEMA.md/AI_CORE4_SCHEMA.md
//   어디에도 그런 배타성 요구가 없음 — 과잉 방어였다).
// - 금지 일반 단어(Elegance/Sophistication) / Craftsmanship 원문 복사: soft warning만 남기고 PASS.
// Core4 로직/Material multi-value gate는 다루지 않는다.

const DESCRIPTION =
  "An artisanal companion with a Munich muse, the shopper in calfskin leather is characterized by " +
  "handle straps and side patches inspired by the Bavarian diamonds, offered in a striking black " +
  "colorway with a maxi monogram, a signature Visetos monogram pattern, and premium leather trim, " +
  "a nod to earlier campaigns. Looking inward, emblematic artwork adorns the interior — featuring " +
  "a removable pouch for another facet of functional brilliance, alongside a trilogy of zipped " +
  "compartments. Modern utility rooted in heritage craftsmanship, it's meticulously sculpted from " +
  "signature Visetos and nappa leather.";

const baseOutput: ProductProfileAiOutput = {
  core4: {
    colorTone: "mono",
    silhouetteForm: "structured",
    material: "leather",
    monogramDensity: "high",
  },
  ai_product_traits: [
    {
      name: "Bavarian Diamond Inspiration",
      reason: "핸들 스트랩과 사이드 패치에 바이에른 다이아몬드 모티프가 사용됐다.",
      evidence: [{ source: "product_description", text: "inspired by the Bavarian diamonds" }],
    },
    {
      name: "Functional Interior Artistry",
      reason: "내부에 별도 문양과 탈부착 파우치가 있어 실용성을 더한다.",
      evidence: [{ source: "product_description", text: "featuring a removable pouch" }],
    },
  ],
  evidence: [
    { source: "product_image", text: "The bag is black with a structured form." },
    { source: "product_description", text: "calfskin leather" },
  ],
};

let warnSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  warnSpy.mockRestore();
});

// TASK-201: gpt-5-mini는 temperature=0(요청 기본값)을 지원하지 않고 400을 반환한다
// (Unsupported value: 'temperature' does not support 0 with this model). callVisionJson()이
// model === "gpt-5-mini"일 때만 temperature 필드를 요청에서 제외하는지 확인한다.
// 다른 로직(Core4/schema 검증 등)은 대상이 아니므로 create()가 이후 무엇을 반환하든 신경 쓰지
// 않고, 실제로 전송된 요청 payload만 검사한다.
describe("callVisionJson (via analyzeProduct) temperature 처리", () => {
  const originalModel = process.env.OPENAI_MODEL;

  afterEach(() => {
    createMock.mockReset();
    if (originalModel === undefined) delete process.env.OPENAI_MODEL;
    else process.env.OPENAI_MODEL = originalModel;
  });

  it("OPENAI_MODEL=gpt-5-mini면 temperature 필드를 요청에서 완전히 제외한다", async () => {
    process.env.OPENAI_MODEL = "gpt-5-mini";
    createMock.mockRejectedValueOnce(new Error("stub: downstream 검증 대상 아님"));

    await analyzeProduct({
      imageUrl: "https://example.com/product.jpg",
      officialDescription: "설명",
    }).catch(() => {});

    expect(createMock).toHaveBeenCalledTimes(1);
    const requestArg = createMock.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(requestArg.model).toBe("gpt-5-mini");
    expect(requestArg).not.toHaveProperty("temperature");
  });

  it("gpt-4o-mini(기본값)는 기존대로 temperature=0을 그대로 전달한다", async () => {
    delete process.env.OPENAI_MODEL;
    createMock.mockRejectedValueOnce(new Error("stub: downstream 검증 대상 아님"));

    await analyzeProduct({
      imageUrl: "https://example.com/product.jpg",
      officialDescription: "설명",
    }).catch(() => {});

    expect(createMock).toHaveBeenCalledTimes(1);
    const requestArg = createMock.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(requestArg.model).toBe("gpt-4o-mini");
    expect(requestArg.temperature).toBe(0);
  });

  it("gpt-4o처럼 명시적으로 override해도 gpt-5-mini가 아니면 temperature=0을 전달한다", async () => {
    process.env.OPENAI_MODEL = "gpt-4o";
    createMock.mockRejectedValueOnce(new Error("stub: downstream 검증 대상 아님"));

    await analyzeProduct({
      imageUrl: "https://example.com/product.jpg",
      officialDescription: "설명",
    }).catch(() => {});

    const requestArg = createMock.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(requestArg.model).toBe("gpt-4o");
    expect(requestArg.temperature).toBe(0);
  });
});

describe("validateTraitQuality", () => {
  it("재포장 Trait이 없으면 기존대로 전체 Trait 그대로 PASS한다", () => {
    const result = validateTraitQuality(baseOutput, DESCRIPTION);
    expect(result.traits).toEqual(baseOutput.ai_product_traits);
    expect(result.warnings).toEqual([]);
  });

  it("실제 description에 존재하는 동일 문장을 top-level evidence와 Trait evidence가 함께 써도 FAIL하지 않는다", () => {
    const output: ProductProfileAiOutput = {
      ...baseOutput,
      ai_product_traits: [
        {
          ...baseOutput.ai_product_traits[0],
          // top-level evidence(evidence[1].text = "calfskin leather")와 완전히 동일한 문장을
          // Trait evidence로도 그대로 사용 — 더 이상 이것만으로는 FAIL하지 않아야 한다.
          evidence: [{ source: "product_description", text: "calfskin leather" }],
        },
        baseOutput.ai_product_traits[1],
      ],
    };
    const result = validateTraitQuality(output, DESCRIPTION);
    expect(result.traits).toHaveLength(2);
  });

  it("Trait evidence가 officialDescription에 존재하지 않는(지어낸) 문장이면 FAIL한다", () => {
    const output: ProductProfileAiOutput = {
      ...baseOutput,
      ai_product_traits: [
        {
          ...baseOutput.ai_product_traits[0],
          evidence: [
            { source: "product_description", text: "a phrase that never appears in the description" },
          ],
        },
        baseOutput.ai_product_traits[1],
      ],
    };
    expect(() => validateTraitQuality(output, DESCRIPTION)).toThrow(TraitQualityValidationError);
  });

  it("evidence.source가 product_image면 grounding 검사 대상이 아니다(이미지 자체는 재검증 불가)", () => {
    const output: ProductProfileAiOutput = {
      ...baseOutput,
      ai_product_traits: [
        {
          ...baseOutput.ai_product_traits[0],
          evidence: [{ source: "product_image", text: "이 텍스트는 description 어디에도 없다" }],
        },
        baseOutput.ai_product_traits[1],
      ],
    };
    expect(() => validateTraitQuality(output, DESCRIPTION)).not.toThrow();
  });

  it("3개 중 1개가 Core4 재포장 → 그 Trait만 제외하고 2개 남아 PASS한다", () => {
    const output: ProductProfileAiOutput = {
      ...baseOutput,
      ai_product_traits: [
        ...baseOutput.ai_product_traits,
        {
          name: "Monochrome Mastery",
          reason: "전체적으로 무채색 톤이 두드러진다.",
          evidence: [{ source: "product_description", text: "black colorway" }],
        },
      ],
    };
    const result = validateTraitQuality(output, DESCRIPTION);
    expect(result.traits).toHaveLength(2);
    expect(result.traits.map((t) => t.name)).toEqual([
      "Bavarian Diamond Inspiration",
      "Functional Interior Artistry",
    ]);
  });

  it("2개 중 1개가 Core4 재포장 → 1개만 남아 FAIL한다", () => {
    const output: ProductProfileAiOutput = {
      ...baseOutput,
      ai_product_traits: [
        baseOutput.ai_product_traits[0],
        {
          name: "Monochrome Mastery",
          reason: "전체적으로 무채색 톤이 두드러진다.",
          evidence: [{ source: "product_description", text: "black colorway" }],
        },
      ],
    };
    expect(() => validateTraitQuality(output, DESCRIPTION)).toThrow(TraitQualityValidationError);
  });

  it("Soft warning만 있으면(Elegance) 전체 Trait 유지한 채 PASS한다", () => {
    const output: ProductProfileAiOutput = {
      ...baseOutput,
      ai_product_traits: [
        { ...baseOutput.ai_product_traits[0], name: "Professional Elegance" },
        baseOutput.ai_product_traits[1],
      ],
    };
    const result = validateTraitQuality(output, DESCRIPTION);
    expect(result.traits).toHaveLength(2);
    expect(result.warnings).toEqual([
      { traitName: "Professional Elegance", rule: "generic_wording", message: "generic wording detected" },
    ]);
  });

  it("high monogramDensity를 'Maximal Monogram Expression'으로 재포장하면 탐지한다", () => {
    const output: ProductProfileAiOutput = {
      ...baseOutput,
      ai_product_traits: [
        ...baseOutput.ai_product_traits,
        {
          name: "Maximal Monogram Expression",
          reason: "모노그램이 제품 전면에 강하게 드러난다.",
          evidence: [{ source: "product_description", text: "maxi monogram" }],
        },
      ],
    };
    const result = validateTraitQuality(output, DESCRIPTION);
    expect(result.traits.map((t) => t.name)).not.toContain("Maximal Monogram Expression");
  });

  it("material=signature_monogram일 때 'Signature Monogram Style'을 일반 규칙(값-토큰 전체 일치)으로 탐지한다", () => {
    const output: ProductProfileAiOutput = {
      ...baseOutput,
      core4: { ...baseOutput.core4, material: "signature_monogram", monogramDensity: "medium" },
      ai_product_traits: [
        ...baseOutput.ai_product_traits,
        {
          name: "Signature Monogram Style",
          reason: "시그니처 모노그램 패턴이 브랜드 정체성을 드러낸다.",
          evidence: [{ source: "product_description", text: "signature Visetos monogram pattern" }],
        },
      ],
    };
    const result = validateTraitQuality(output, DESCRIPTION);
    expect(result.traits.map((t) => t.name)).not.toContain("Signature Monogram Style");
  });

  it("monogramDensity=medium(non-none)일 때도 'monogram' 단어가 있으면 axis 고유 의미로 탐지한다(density 값과 무관)", () => {
    const output: ProductProfileAiOutput = {
      ...baseOutput,
      core4: { ...baseOutput.core4, material: "nylon", monogramDensity: "medium" },
      ai_product_traits: [
        ...baseOutput.ai_product_traits,
        {
          name: "Monogram Pattern Presence",
          reason: "모노그램 패턴이 표면 전체에 나타난다.",
          evidence: [{ source: "product_description", text: "signature Visetos monogram pattern" }],
        },
      ],
    };
    const result = validateTraitQuality(output, DESCRIPTION);
    expect(result.traits.map((t) => t.name)).not.toContain("Monogram Pattern Presence");
  });

  it("material=leather일 때 'Leather Luxury'처럼 값-단어를 그대로 쓴 name도 일반 규칙으로 탐지한다", () => {
    const output: ProductProfileAiOutput = {
      ...baseOutput,
      ai_product_traits: [
        ...baseOutput.ai_product_traits,
        {
          name: "Leather Luxury",
          reason: "가죽 소재의 고급스러움을 강조한다.",
          evidence: [{ source: "product_description", text: "premium leather trim" }],
        },
      ],
    };
    const result = validateTraitQuality(output, DESCRIPTION);
    expect(result.traits.map((t) => t.name)).not.toContain("Leather Luxury");
  });

  it("colorTone=mono여도 'Monogram'(모노그램)은 색상 축 재포장으로 오탐하지 않는다", () => {
    const output: ProductProfileAiOutput = {
      ...baseOutput,
      core4: { ...baseOutput.core4, colorTone: "mono", material: "nylon", monogramDensity: "none" },
      ai_product_traits: [
        ...baseOutput.ai_product_traits,
        {
          name: "Monogram Nostalgia",
          reason: "모노그램 디자인이 브랜드의 과거 캠페인을 연상시킨다.",
          evidence: [{ source: "product_description", text: "a nod to earlier campaigns" }],
        },
      ],
    };
    // monogramDensity가 none이라 axis 고유 의미(B) 규칙은 적용되지 않고, colorTone=mono의
    // mono/monochrome 정규식도 "Monogram"에는 매칭되지 않아야 한다(단어 경계 엄격 일치).
    const result = validateTraitQuality(output, DESCRIPTION);
    expect(result.traits.map((t) => t.name)).toContain("Monogram Nostalgia");
  });

  it("Functional Design처럼 수납 구조에 근거한 독립 Trait은 통과한다", () => {
    const output: ProductProfileAiOutput = {
      ...baseOutput,
      core4: { colorTone: "mono", silhouetteForm: "compact", material: "nylon", monogramDensity: "medium" },
      ai_product_traits: [
        {
          name: "Functional Design",
          reason: "지퍼 구획 3개로 실용성을 더한다.",
          evidence: [{ source: "product_description", text: "a trilogy of zipped compartments" }],
        },
        baseOutput.ai_product_traits[0],
      ],
    };
    const result = validateTraitQuality(output, DESCRIPTION);
    expect(result.traits.map((t) => t.name)).toEqual(["Functional Design", "Bavarian Diamond Inspiration"]);
  });

  it("Soft warning만 있으면(Craftsmanship 원문 복사) 전체 Trait 유지한 채 PASS한다", () => {
    const output: ProductProfileAiOutput = {
      ...baseOutput,
      ai_product_traits: [
        {
          name: "Heritage Craftsmanship",
          reason: "헤리티지 장인정신을 강조한다.",
          evidence: [{ source: "product_description", text: "heritage craftsmanship" }],
        },
        baseOutput.ai_product_traits[1],
      ],
    };
    const result = validateTraitQuality(output, DESCRIPTION);
    expect(result.traits).toHaveLength(2);
    expect(result.warnings).toEqual([
      {
        traitName: "Heritage Craftsmanship",
        rule: "craftsmanship_copied",
        message: "craftsmanship phrase copied from description",
      },
    ]);
  });
});
