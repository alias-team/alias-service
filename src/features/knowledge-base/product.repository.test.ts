import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import { createProductRepository } from "./product.repository";

describe("ProductRepository", () => {
  it("returns the product for an existing product_code, extracting category/collection from metadata", async () => {
    const row = {
      id: "6ebeb5f4-f60f-45df-9008-f0641f7166af",
      product_code: "MMVGSTT04CO001",
      name: "Ottomar Cabin Trolley in Visetos",
      official_description: "Clad in classic cognac...",
      image_url: "https://images.mcmworldwide.com/i/mcmworldwide/MMVGSTT04CO001_01",
      metadata: { category: "Trolley", collection: "Visetos", officialColor: "Cognac" },
    };
    const table = {
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: row, error: null }),
        }),
      }),
    };
    const supabase = { from: () => table } as unknown as SupabaseClient;

    const product = await createProductRepository(supabase).findByProductCode(
      "MMVGSTT04CO001",
    );

    expect(product).toEqual({
      id: row.id,
      product_code: "MMVGSTT04CO001",
      name: row.name,
      category: "Trolley",
      collection: "Visetos",
      official_description: row.official_description,
      image_url: row.image_url,
      metadata: row.metadata,
    });
  });

  it("returns null when no product matches the product_code", async () => {
    const table = {
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: null, error: null }),
        }),
      }),
    };
    const supabase = { from: () => table } as unknown as SupabaseClient;

    const product = await createProductRepository(supabase).findByProductCode(
      "UNKNOWN_CODE",
    );

    expect(product).toBeNull();
  });

  it("throws when Supabase returns an error for a single product_code lookup", async () => {
    const table = {
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: null,
            error: { message: "connection refused" },
          }),
        }),
      }),
    };
    const supabase = { from: () => table } as unknown as SupabaseClient;

    await expect(
      createProductRepository(supabase).findByProductCode("MMVGSTT04CO001"),
    ).rejects.toThrow(/connection refused/);
  });

  it("does not query Supabase when given an empty product_code list", async () => {
    const supabase = {
      from: () => {
        throw new Error("Supabase must not be queried");
      },
    } as unknown as SupabaseClient;

    const products = await createProductRepository(supabase).findByProductCodes([]);

    expect(products).toEqual([]);
  });

  it("returns every matching product keyed by its own product_code for a multi-code lookup", async () => {
    const rows = [
      {
        id: "id-1",
        product_code: "MMVGSTT04CO001",
        name: "Ottomar Cabin Trolley in Visetos",
        official_description: "desc-1",
        image_url: "url-1",
        metadata: { category: "Trolley" },
      },
      {
        id: "id-2",
        product_code: "MMKGSVE09BK001",
        name: "Stark Packable Backpack in Monogram Nylon",
        official_description: "desc-2",
        image_url: "url-2",
        metadata: {},
      },
    ];
    const table = {
      select: () => ({
        in: async () => ({ data: rows, error: null }),
      }),
    };
    const supabase = { from: () => table } as unknown as SupabaseClient;

    const products = await createProductRepository(supabase).findByProductCodes([
      "MMVGSTT04CO001",
      "MMKGSVE09BK001",
    ]);

    const byCode = new Map(products.map((p) => [p.product_code, p]));
    expect(byCode.get("MMVGSTT04CO001")).toMatchObject({
      product_code: "MMVGSTT04CO001",
      category: "Trolley",
    });
    expect(byCode.get("MMKGSVE09BK001")).toMatchObject({
      product_code: "MMKGSVE09BK001",
      category: null,
    });
    expect(products).toHaveLength(2);
  });

  it("throws when Supabase returns an error for a multi-code lookup", async () => {
    const table = {
      select: () => ({
        in: async () => ({ data: null, error: { message: "timeout" } }),
      }),
    };
    const supabase = { from: () => table } as unknown as SupabaseClient;

    await expect(
      createProductRepository(supabase).findByProductCodes(["MMVGSTT04CO001"]),
    ).rejects.toThrow(/timeout/);
  });

  describe("findByProductIds", () => {
    it("returns the current product_profiles for the given product_id list", async () => {
      const rows = [
        {
          id: "pp-1",
          product_id: "p1",
          core4: { colorTone: "mono", silhouetteForm: "structured", material: "leather", monogramDensity: "medium" },
          ai_product_traits: [{ name: "Trait", reason: "reason", evidence: [] }],
          evidence: [{ source: "product_description", text: "text" }],
        },
      ];
      const table = {
        select: () => ({
          in: () => ({ eq: async () => ({ data: rows, error: null }) }),
        }),
      };
      const supabase = { from: () => table } as unknown as SupabaseClient;

      const profiles = await createProductRepository(supabase).findByProductIds(["p1"]);

      expect(profiles).toEqual(rows);
    });

    it("does not query Supabase when given an empty product_id list", async () => {
      const supabase = {
        from: () => {
          throw new Error("Supabase must not be queried");
        },
      } as unknown as SupabaseClient;

      const profiles = await createProductRepository(supabase).findByProductIds([]);

      expect(profiles).toEqual([]);
    });

    it("throws when Supabase returns an error", async () => {
      const table = {
        select: () => ({
          in: () => ({ eq: async () => ({ data: null, error: { message: "timeout" } }) }),
        }),
      };
      const supabase = { from: () => table } as unknown as SupabaseClient;

      await expect(
        createProductRepository(supabase).findByProductIds(["p1"]),
      ).rejects.toThrow(/timeout/);
    });
  });
});
