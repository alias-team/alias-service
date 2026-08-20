import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import { createCustomerTasteService } from "./customer-taste.service";
import { createCustomerRepository } from "./customer.repository";
import { createProductRepository } from "./product.repository";
import { discoverCustomerTaste, toCustomerProfileContext } from "@/lib/ai/customer-taste-discovery";
import { gatekeeperInputSchema } from "@/lib/validation/gatekeeper.schema";
import type { Customer, CustomerProductSelection, NewCustomerTasteProfile } from "@/types/customer";
import type { RelatedProductProfile } from "@/types/event";

const CUSTOMER_ID = "6ebeb5f4-f60f-45df-9008-f0641f7166af";

const customer: Customer = {
  id: CUSTOMER_ID,
  customer_code: "DEMO-CUSTOMER-A",
  display_name: "MCM 고객 A",
  description: null,
  source: "seed",
};

const selections: CustomerProductSelection[] = [
  { product_id: "p1", selection_type: "purchase" },
  { product_id: "p2", selection_type: "purchase" },
];

const relatedProfiles: RelatedProductProfile[] = [
  {
    id: "pp1",
    product_id: "p1",
    core4: { colorTone: "mono", silhouetteForm: "structured", material: "leather", monogramDensity: "medium" },
    ai_product_traits: [
      {
        name: "Heritage-oriented Style",
        reason: "구조적 형태와 헤리티지 소재를 사용합니다.",
        evidence: [{ source: "product_description", text: "구조적 형태" }],
      },
      {
        name: "Structured Silhouette",
        reason: "구조적인 실루엣을 가집니다.",
        evidence: [{ source: "product_description", text: "구조적인 실루엣" }],
      },
    ],
    evidence: [],
  },
  {
    id: "pp2",
    product_id: "p2",
    core4: { colorTone: "mono", silhouetteForm: "structured", material: "leather", monogramDensity: "medium" },
    ai_product_traits: [
      {
        name: "Heritage-oriented Style",
        reason: "구조적 형태와 헤리티지 소재를 사용합니다.",
        evidence: [{ source: "product_description", text: "구조적 형태" }],
      },
      {
        name: "Structured Silhouette",
        reason: "구조적인 실루엣을 가집니다.",
        evidence: [{ source: "product_description", text: "구조적인 실루엣" }],
      },
    ],
    evidence: [],
  },
];

function mockAnalyzer(input: Parameters<typeof discoverCustomerTaste>[0]) {
  return discoverCustomerTaste(input, async () => ({
    taste_summary: "구조적인 헤리티지 소재를 반복 선택합니다.",
    ai_traits: [
      {
        name: "Heritage-oriented Style",
        reason: "구조적 형태와 헤리티지 소재를 반복 선택합니다.",
        evidenceProductIds: ["p1", "p2"],
      },
    ],
  }));
}

describe("createCustomerTasteService", () => {
  it("reads customer + selections + product profiles, runs the analyzer with a mock generator, and saves the result", async () => {
    const savedProfiles: NewCustomerTasteProfile[] = [];
    let requestedProductIds: string[] | undefined;

    const repository = {
      findCustomerByCode: async (code: string) => {
        expect(code).toBe("DEMO-CUSTOMER-A");
        return customer;
      },
      findSelectionsByCustomerId: async (id: string) => {
        expect(id).toBe(CUSTOMER_ID);
        return selections;
      },
      findCurrentTasteProfile: async () => null,
      replaceCurrentTasteProfile: async (profile: NewCustomerTasteProfile) => {
        savedProfiles.push(profile);
        return { id: "taste-profile-1", ...profile };
      },
    };

    const service = createCustomerTasteService({
      customerRepository: repository,
      findProductProfiles: async (productIds) => {
        requestedProductIds = productIds;
        return relatedProfiles;
      },
      analyzer: mockAnalyzer,
    });

    const result = await service.generateTasteProfile("DEMO-CUSTOMER-A");

    expect(requestedProductIds).toEqual(["p1", "p2"]);
    expect(savedProfiles).toHaveLength(1);
    expect(savedProfiles[0]).toMatchObject({
      customer_id: CUSTOMER_ID,
      taste_summary: "구조적인 헤리티지 소재를 반복 선택합니다.",
      source: "ai_generated",
      is_current: true,
    });
    expect(result.id).toBe("taste-profile-1");
  });

  it("fails without calling the analyzer or findProductProfiles when the customer does not exist", async () => {
    let analyzed = false;
    const service = createCustomerTasteService({
      customerRepository: {
        findCustomerByCode: async () => null,
        findSelectionsByCustomerId: async () => {
          throw new Error("must not be called");
        },
        findCurrentTasteProfile: async () => null,
        replaceCurrentTasteProfile: async () => {
          throw new Error("must not save");
        },
      },
      findProductProfiles: async () => {
        throw new Error("must not be called");
      },
      analyzer: async () => {
        analyzed = true;
        throw new Error("must not analyze");
      },
    });

    await expect(service.generateTasteProfile("UNKNOWN-CODE")).rejects.toThrow(
      "Customer not found: UNKNOWN-CODE",
    );
    expect(analyzed).toBe(false);
  });

  it("fails without calling the analyzer when the customer has no selections", async () => {
    let analyzed = false;
    const service = createCustomerTasteService({
      customerRepository: {
        findCustomerByCode: async () => customer,
        findSelectionsByCustomerId: async () => [],
        findCurrentTasteProfile: async () => null,
        replaceCurrentTasteProfile: async () => {
          throw new Error("must not save");
        },
      },
      findProductProfiles: async () => {
        throw new Error("must not be called");
      },
      analyzer: async () => {
        analyzed = true;
        throw new Error("must not analyze");
      },
    });

    await expect(service.generateTasteProfile("DEMO-CUSTOMER-A")).rejects.toThrow();
    expect(analyzed).toBe(false);
  });

  it("produces a saved profile that projects cleanly via toCustomerProfileContext", async () => {
    const service = createCustomerTasteService({
      customerRepository: {
        findCustomerByCode: async () => customer,
        findSelectionsByCustomerId: async () => selections,
        findCurrentTasteProfile: async () => null,
        replaceCurrentTasteProfile: async (profile: NewCustomerTasteProfile) => ({
          id: "taste-profile-1",
          ...profile,
        }),
      },
      findProductProfiles: async () => relatedProfiles,
      analyzer: mockAnalyzer,
    });

    const result = await service.generateTasteProfile("DEMO-CUSTOMER-A");
    const context = toCustomerProfileContext(result);

    expect(() =>
      gatekeeperInputSchema.shape.customer_profile.parse(context),
    ).not.toThrow();
  });

  it("wires the real customer/event repositories (mock Supabase) with a mock AI generator end to end", async () => {
    const customerRow = {
      id: CUSTOMER_ID,
      customer_code: "DEMO-CUSTOMER-A",
      display_name: "MCM 고객 A",
      description: null,
      source: "seed",
    };
    const selectionRows = [
      { product_id: "p1", selection_type: "purchase" },
      { product_id: "p2", selection_type: "purchase" },
    ];
    let savedRow: unknown;

    const tables: Record<string, unknown> = {
      customers: {
        select: () => ({
          eq: () => ({ maybeSingle: async () => ({ data: customerRow, error: null }) }),
        }),
      },
      customer_product_selections: {
        select: () => ({ eq: async () => ({ data: selectionRows, error: null }) }),
      },
      customer_taste_profiles: {
        insert: (row: Record<string, unknown>) => {
          savedRow = { id: "taste-profile-1", ...row };
          return { select: () => ({ single: async () => ({ data: savedRow, error: null }) }) };
        },
        update: () => ({
          eq: () => ({ eq: () => ({ neq: async () => ({ data: null, error: null }) }) }),
        }),
      },
      product_profiles: {
        select: () => ({
          in: () => ({ eq: async () => ({ data: relatedProfiles, error: null }) }),
        }),
      },
    };
    const supabase = { from: (table: string) => tables[table] } as unknown as SupabaseClient;

    const customerRepository = createCustomerRepository(supabase);
    const productRepository = createProductRepository(supabase);

    const service = createCustomerTasteService({
      customerRepository,
      findProductProfiles: productRepository.findByProductIds,
      analyzer: mockAnalyzer,
    });

    const result = await service.generateTasteProfile("DEMO-CUSTOMER-A");

    expect(result.customer_id).toBe(CUSTOMER_ID);
    expect(savedRow).toBeDefined();
  });
});
