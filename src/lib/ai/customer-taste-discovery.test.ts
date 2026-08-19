import { describe, expect, it } from "vitest";

import {
  computeCorePreference,
  discoverCustomerTaste,
} from "./customer-taste-discovery";
import type { CustomerTasteInput, SelectedProductProfile } from "@/types/customer";

const profiles: SelectedProductProfile[] = [
  {
    product_id: "P1",
    core4: { colorTone: "mono", silhouetteForm: "compact", material: "nylon", monogramDensity: "medium" },
    ai_product_traits: [],
  },
  {
    product_id: "P2",
    core4: { colorTone: "mono", silhouetteForm: "structured", material: "signature_monogram", monogramDensity: "medium" },
    ai_product_traits: [],
  },
  {
    product_id: "P3",
    core4: { colorTone: "mono", silhouetteForm: "structured", material: "leather", monogramDensity: "high" },
    ai_product_traits: [],
  },
  {
    product_id: "P4",
    core4: { colorTone: "mono", silhouetteForm: "structured", material: "signature_monogram", monogramDensity: "medium" },
    ai_product_traits: [],
  },
  {
    product_id: "P5",
    core4: { colorTone: "mono", silhouetteForm: null, material: "leather", monogramDensity: "none" },
    ai_product_traits: [],
  },
];

const input: CustomerTasteInput = {
  customerId: "CUST-A",
  selections: [
    { product_id: "P1", selection_type: "purchase" },
    { product_id: "P2", selection_type: "purchase" },
    { product_id: "P3", selection_type: "wishlist" },
    { product_id: "P4", selection_type: "wishlist" },
    { product_id: "P5", selection_type: "wishlist" },
  ],
  productProfiles: profiles,
};

describe("computeCorePreference", () => {
  it("축마다 2개 이상 제품에서 반복된 값만 포함한다 (단순 다수결이 아니라 반복 근거 확인)", () => {
    const result = computeCorePreference(profiles);

    expect(result.colorTone).toEqual(["mono"]); // 5/5
    expect(result.silhouetteForm).toEqual(["structured"]); // 3/5, compact(1)/null은 제외
    expect(result.monogramDensity).toEqual(["medium"]); // 3/5, high(1)/none(1)은 제외
    // material: signature_monogram(2), leather(2) 둘 다 반복, nylon(1)은 제외
    expect(result.material.sort()).toEqual(["leather", "signature_monogram"]);
  });

  it("아무 값도 2회 이상 반복되지 않으면 빈 배열을 반환한다(억지로 채우지 않음)", () => {
    const noRepeat: SelectedProductProfile[] = [
      { product_id: "A", core4: { colorTone: "mono", silhouetteForm: null, material: null, monogramDensity: null }, ai_product_traits: [] },
      { product_id: "B", core4: { colorTone: "warm_neutral", silhouetteForm: null, material: null, monogramDensity: null }, ai_product_traits: [] },
    ];
    const result = computeCorePreference(noRepeat);
    expect(result.colorTone).toEqual([]);
  });

  it("배열형 Core4는 각 원소를 개별 관측치로 센다", () => {
    const withArray: SelectedProductProfile[] = [
      { product_id: "A", core4: { colorTone: null, silhouetteForm: null, material: ["leather", "signature_monogram"], monogramDensity: null }, ai_product_traits: [] },
      { product_id: "B", core4: { colorTone: null, silhouetteForm: null, material: "leather", monogramDensity: null }, ai_product_traits: [] },
    ];
    const result = computeCorePreference(withArray);
    expect(result.material).toEqual(["leather"]); // leather 2회(배열 원소 + 단일), signature_monogram 1회
  });
});

describe("discoverCustomerTaste", () => {
  it("여러 제품 근거를 가진 유효한 AI 결과는 최종 Customer Taste Profile로 검증/반환된다", async () => {
    const result = await discoverCustomerTaste(input, async () => ({
      taste_summary: "이동성과 실용성을 반영한 소재를 반복적으로 선택한다.",
      ai_traits: [
        {
          name: "Mobile Utility Focus",
          reason: "여러 제품에서 이동/기기 수납 관련 서사가 반복된다.",
          evidenceProductIds: ["P1", "P2"],
        },
      ],
    }));

    expect(result.core_preference.colorTone).toEqual(["mono"]);
    expect(result.ai_traits).toHaveLength(1);
    expect(result.evidence_product_ids).toEqual(expect.arrayContaining(["P1", "P2"]));
  });

  it("입력에 없는 product_id를 근거로 인용하면 검증에 실패한다(환각 방지)", async () => {
    await expect(
      discoverCustomerTaste(input, async () => ({
        taste_summary: "요약",
        ai_traits: [
          { name: "Trait", reason: "이유", evidenceProductIds: ["P1", "UNKNOWN_ID"] },
        ],
      })),
    ).rejects.toThrow();
  });

  it("단일 제품만 근거로 삼은 Trait은 검증에 실패한다", async () => {
    await expect(
      discoverCustomerTaste(input, async () => ({
        taste_summary: "요약",
        ai_traits: [{ name: "Trait", reason: "이유", evidenceProductIds: ["P1"] }],
      })),
    ).rejects.toThrow();
  });

  it("같은 product_id를 중복 나열해 배열 길이만 채운 Trait은 검증에 실패한다", async () => {
    await expect(
      discoverCustomerTaste(input, async () => ({
        taste_summary: "요약",
        ai_traits: [{ name: "Trait", reason: "이유", evidenceProductIds: ["P1", "P1"] }],
      })),
    ).rejects.toThrow();
  });
});
