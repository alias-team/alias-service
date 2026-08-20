import { describe, expect, it } from "vitest";

import { adaptIssueCompositionToEditorialInput, toBrandAsset } from "./issue-composition-to-editorial";
import { editorialGeneratorInputSchema } from "@/lib/validation/editorial.schema";
import type { CustomerTasteProfile } from "@/types/customer";
import type { BrandAsset } from "@/types/editorial";
import type { Event, EventMeaningProfile, RelatedProductProfile } from "@/types/event";
import type { IssueComposition, PassProductCandidate } from "@/types/issue-composition";
import type { Product } from "@/types/product";

const EVENT_ID = "6ebeb5f4-f60f-45df-9008-f0641f7166af";

const event: Event = {
  id: EVENT_ID,
  event_code: "EVT_TRAVEL_EDIT_2026",
  name: "MCM Travel | Edit",
  event_type: "brand_event",
  campaign_overview: "A campaign about mobility.",
  brand_message: "Designed for modern nomads.",
  collection_concept: null,
  related_product_ids: ["p1", "p2"],
  hero_image_url: "/images/travel-edit-hero.jpg",
  official_url: "https://www.mcmworldwide.com/travel-edit",
  source: "seed",
};

const eventMeaningProfile: EventMeaningProfile = {
  id: "event-meaning-1",
  event_id: EVENT_ID,
  event_theme: "Mobility",
  brand_direction: "Modern movement",
  event_traits: ["Mobility"],
  evidence: [{ source: "brand_message", text: "Designed for modern nomads." }],
  analysis_model: "gpt-5-mini",
  source: "ai_generated",
  is_current: true,
};

const customerTasteProfile: CustomerTasteProfile = {
  id: "taste-profile-1",
  customer_id: "customer-1",
  taste_summary: "구조적인 헤리티지 소재를 반복 선택합니다.",
  core_preference: {
    colorTone: ["mono"],
    silhouetteForm: ["structured"],
    material: ["leather"],
    monogramDensity: ["medium"],
  },
  ai_traits: [
    {
      name: "Heritage-oriented Style",
      reason: "구조적 형태와 모노그램을 반복 선택합니다.",
      evidenceProductIds: ["p1", "p2"],
    },
  ],
  evidence_product_ids: ["p1", "p2"],
  source: "ai_generated",
  is_current: true,
};

const brandAsset: BrandAsset = { image_url: "/images/brand-hero.jpg" };

function passProduct(productId: string, name: string): PassProductCandidate {
  return {
    event_id: EVENT_ID,
    product_id: productId,
    decision: "PASS",
    product: {
      name,
      category: "bag",
      collection: "Travel Collection",
      image_url: `/images/${productId}.jpg`,
    },
    product_profile: {
      core4: { material: "leather" },
      ai_product_traits: [{ name: "Heritage Style", reason: "reason" }],
    },
    editorial_angle: "Heritage adapted for movement",
    matching_reason: "The product extends an established preference.",
    meaning_bridge: "Familiar craft expressed through movement.",
    extension: "A mobile expression of heritage.",
    evidence: [`${productId} supports mobile use.`],
  };
}

function product(productId: string, description: string): Product {
  return {
    id: productId,
    product_code: `CODE-${productId}`,
    name: `Product ${productId}`,
    category: "bag",
    collection: "Travel Collection",
    official_description: description,
    image_url: `/images/${productId}.jpg`,
    metadata: {},
  };
}

function productProfile(productId: string, evidence: unknown[]): RelatedProductProfile {
  return {
    id: `profile-${productId}`,
    product_id: productId,
    core4: { material: "leather" },
    ai_product_traits: [{ name: "Heritage Style", reason: "reason" }],
    evidence,
  };
}

function issueComposition(productIds: string[]): IssueComposition {
  return {
    event_id: EVENT_ID,
    issue_theme: "Heritage in Motion",
    editorial_angle: "Familiar craft for contemporary movement",
    selected_products: productIds.map((productId, index) => ({
      product_id: productId,
      product_role: index === 0 ? "Theme anchor" : "Theme extension",
      discovery_direction: "A mobile expression of heritage",
    })),
    brand_connection: {
      event_theme: "Mobility",
      brand_direction: "Modern movement",
      connection_narrative: "The Event carries familiar craft into motion.",
    },
    evidence: ["The supplied products support mobile use."],
  };
}

function baseContext() {
  return {
    eventMeaningProfile,
    customerTasteProfile,
    event,
    brandAsset,
    products: [product("p1", "Product p1 description."), product("p2", "Product p2 description.")],
    productProfiles: [
      productProfile("p1", [{ source: "product_description", text: "p1 evidence" }]),
      productProfile("p2", [{ source: "product_description", text: "p2 evidence" }]),
    ],
  };
}

describe("adaptIssueCompositionToEditorialInput", () => {
  it("assembles a complete EditorialGeneratorInput that passes the existing schema", () => {
    const composition = issueComposition(["p1", "p2"]);
    const passProductPool = [passProduct("p1", "Product One"), passProduct("p2", "Product Two")];

    const result = adaptIssueCompositionToEditorialInput(
      composition,
      passProductPool,
      baseContext(),
    );

    expect(() => editorialGeneratorInputSchema.parse(result)).not.toThrow();
    expect(result.issue_composition).toEqual(composition);
    expect(result.event_meaning_profile).toEqual(eventMeaningProfile);
    expect(result.event).toEqual({ event_id: EVENT_ID, event_type: "brand_event" });
    expect(result.brand_asset).toEqual(brandAsset);
  });

  it("converts customer_taste_profile.core_preference into the Record<string, unknown> shape TASK-207 expects", () => {
    const result = adaptIssueCompositionToEditorialInput(
      issueComposition(["p1", "p2"]),
      [passProduct("p1", "Product One"), passProduct("p2", "Product Two")],
      baseContext(),
    );

    expect(result.customer_taste_profile).toEqual({
      id: "taste-profile-1",
      customer_id: "customer-1",
      taste_summary: customerTasteProfile.taste_summary,
      core_preference: {
        colorTone: ["mono"],
        silhouetteForm: ["structured"],
        material: ["leather"],
        monogramDensity: ["medium"],
      },
      ai_traits: customerTasteProfile.ai_traits,
      evidence_product_ids: customerTasteProfile.evidence_product_ids,
      source: "ai_generated",
      is_current: true,
    });
  });

  it("joins each product's description/evidence to the correct product_id even when upstream arrays are in a different order", () => {
    const composition = issueComposition(["p1", "p2"]);
    const passProductPool = [passProduct("p2", "Product Two"), passProduct("p1", "Product One")];
    const context = {
      ...baseContext(),
      products: [product("p2", "Second description."), product("p1", "First description.")],
      productProfiles: [
        productProfile("p2", [{ source: "product_description", text: "second evidence" }]),
        productProfile("p1", [{ source: "product_description", text: "first evidence" }]),
      ],
    };

    const result = adaptIssueCompositionToEditorialInput(composition, passProductPool, context);

    const byId = new Map(result.products.map((p) => [p.product_id, p]));
    expect(byId.get("p1")).toMatchObject({
      product_id: "p1",
      product_name: "Product One",
      description: "First description.",
    });
    expect(byId.get("p1")?.product_profile.evidence).toEqual([
      { source: "product_description", text: "first evidence" },
    ]);
    expect(byId.get("p2")).toMatchObject({
      product_id: "p2",
      product_name: "Product Two",
      description: "Second description.",
    });
    expect(byId.get("p2")?.product_profile.evidence).toEqual([
      { source: "product_description", text: "second evidence" },
    ]);
    expect(result.products.map((p) => p.product_id)).toEqual(["p1", "p2"]);
  });

  it("rejects when a selected product has no matching passProductPool entry", () => {
    const composition = issueComposition(["p1", "p2"]);
    const passProductPool = [passProduct("p1", "Product One")];

    expect(() =>
      adaptIssueCompositionToEditorialInput(composition, passProductPool, baseContext()),
    ).toThrow();
  });

  it("rejects when upstream Product data is missing for a selected product", () => {
    const composition = issueComposition(["p1", "p2"]);
    const passProductPool = [passProduct("p1", "Product One"), passProduct("p2", "Product Two")];
    const context = { ...baseContext(), products: [product("p1", "desc")] };

    expect(() =>
      adaptIssueCompositionToEditorialInput(composition, passProductPool, context),
    ).toThrow();
  });

  it("rejects when upstream Product Profile data is missing for a selected product", () => {
    const composition = issueComposition(["p1", "p2"]);
    const passProductPool = [passProduct("p1", "Product One"), passProduct("p2", "Product Two")];
    const context = {
      ...baseContext(),
      productProfiles: [productProfile("p1", [])],
    };

    expect(() =>
      adaptIssueCompositionToEditorialInput(composition, passProductPool, context),
    ).toThrow();
  });

  it("rejects a duplicate product_id within passProductPool", () => {
    const composition = issueComposition(["p1"]);
    const passProductPool = [passProduct("p1", "Product One"), passProduct("p1", "Duplicate")];

    expect(() =>
      adaptIssueCompositionToEditorialInput(composition, passProductPool, baseContext()),
    ).toThrow();
  });

  it("rejects a duplicate id within the upstream products list", () => {
    const composition = issueComposition(["p1"]);
    const passProductPool = [passProduct("p1", "Product One")];
    const context = {
      ...baseContext(),
      products: [product("p1", "desc"), product("p1", "duplicate desc")],
    };

    expect(() =>
      adaptIssueCompositionToEditorialInput(composition, passProductPool, context),
    ).toThrow();
  });

  it("rejects mismatched event_id between IssueComposition and EventMeaningProfile", () => {
    const composition = { ...issueComposition(["p1", "p2"]), event_id: "OTHER_EVENT" };
    const passProductPool = [passProduct("p1", "Product One"), passProduct("p2", "Product Two")];

    expect(() =>
      adaptIssueCompositionToEditorialInput(composition, passProductPool, baseContext()),
    ).toThrow();
  });

  it("rejects mismatched event_id between IssueComposition and the Event", () => {
    const composition = issueComposition(["p1", "p2"]);
    const passProductPool = [passProduct("p1", "Product One"), passProduct("p2", "Product Two")];
    const context = { ...baseContext(), event: { ...event, id: "OTHER_EVENT_UUID" } };

    expect(() =>
      adaptIssueCompositionToEditorialInput(composition, passProductPool, context),
    ).toThrow();
  });
});

describe("toBrandAsset", () => {
  it("derives BrandAsset.image_url from Event.hero_image_url", () => {
    expect(toBrandAsset(event)).toEqual({ image_url: "/images/travel-edit-hero.jpg" });
  });

  it("throws a clear error when the Event has no hero_image_url yet", () => {
    expect(() => toBrandAsset({ ...event, hero_image_url: null })).toThrow(
      /hero_image_url/i,
    );
  });
});
