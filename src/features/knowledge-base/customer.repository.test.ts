import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import { createCustomerRepository } from "./customer.repository";
import type { NewCustomerTasteProfile } from "@/types/customer";

describe("CustomerRepository", () => {
  describe("findCustomerByCode", () => {
    it("returns the customer for an existing customer_code", async () => {
      const row = {
        id: "6ebeb5f4-f60f-45df-9008-f0641f7166af",
        customer_code: "DEMO-CUSTOMER-A",
        display_name: "MCM 고객 A",
        description: "구조적인 형태와 헤리티지 표현이 있는 제품을 반복 선택한 데모 고객",
        source: "seed",
      };
      const table = {
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: row, error: null }),
          }),
        }),
      };
      const supabase = { from: () => table } as unknown as SupabaseClient;

      const customer = await createCustomerRepository(supabase).findCustomerByCode(
        "DEMO-CUSTOMER-A",
      );

      expect(customer).toEqual(row);
    });

    it("returns null when no customer matches the customer_code", async () => {
      const table = {
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: null, error: null }),
          }),
        }),
      };
      const supabase = { from: () => table } as unknown as SupabaseClient;

      const customer = await createCustomerRepository(supabase).findCustomerByCode(
        "UNKNOWN-CODE",
      );

      expect(customer).toBeNull();
    });

    it("throws when Supabase returns an error", async () => {
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
        createCustomerRepository(supabase).findCustomerByCode("DEMO-CUSTOMER-A"),
      ).rejects.toThrow(/connection refused/);
    });
  });

  describe("findSelectionsByCustomerId", () => {
    it("returns the customer's purchase/wishlist selections", async () => {
      const rows = [
        { product_id: "p1", selection_type: "purchase" },
        { product_id: "p2", selection_type: "wishlist" },
      ];
      const table = {
        select: () => ({
          eq: async () => ({ data: rows, error: null }),
        }),
      };
      const supabase = { from: () => table } as unknown as SupabaseClient;

      const selections = await createCustomerRepository(
        supabase,
      ).findSelectionsByCustomerId("customer-1");

      expect(selections).toEqual(rows);
    });

    it("throws when Supabase returns an error", async () => {
      const table = {
        select: () => ({
          eq: async () => ({ data: null, error: { message: "timeout" } }),
        }),
      };
      const supabase = { from: () => table } as unknown as SupabaseClient;

      await expect(
        createCustomerRepository(supabase).findSelectionsByCustomerId("customer-1"),
      ).rejects.toThrow(/timeout/);
    });
  });

  describe("findCurrentTasteProfile", () => {
    const row = {
      id: "taste-profile-1",
      customer_id: "customer-1",
      taste_summary: "구조적인 헤리티지 제품을 반복 선택합니다.",
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
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    };

    it("returns the current Taste Profile, validating the stored jsonb shape", async () => {
      const table = {
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: row, error: null }),
            }),
          }),
        }),
      };
      const supabase = { from: () => table } as unknown as SupabaseClient;

      const profile = await createCustomerRepository(supabase).findCurrentTasteProfile(
        "customer-1",
      );

      expect(profile).toEqual(row);
    });

    it("returns null when the customer has no current Taste Profile", async () => {
      const table = {
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: null, error: null }),
            }),
          }),
        }),
      };
      const supabase = { from: () => table } as unknown as SupabaseClient;

      const profile = await createCustomerRepository(supabase).findCurrentTasteProfile(
        "customer-1",
      );

      expect(profile).toBeNull();
    });

    it("throws when the stored core_preference/ai_traits jsonb does not match the schema", async () => {
      const table = {
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: { ...row, core_preference: { colorTone: ["not_a_real_value"] } },
                error: null,
              }),
            }),
          }),
        }),
      };
      const supabase = { from: () => table } as unknown as SupabaseClient;

      await expect(
        createCustomerRepository(supabase).findCurrentTasteProfile("customer-1"),
      ).rejects.toThrow();
    });

    it("throws when Supabase returns an error", async () => {
      const table = {
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: null,
                error: { message: "connection refused" },
              }),
            }),
          }),
        }),
      };
      const supabase = { from: () => table } as unknown as SupabaseClient;

      await expect(
        createCustomerRepository(supabase).findCurrentTasteProfile("customer-1"),
      ).rejects.toThrow(/connection refused/);
    });
  });

  describe("replaceCurrentTasteProfile", () => {
    const newProfile: NewCustomerTasteProfile = {
      customer_id: "customer-1",
      taste_summary: "구조적인 헤리티지 제품을 반복 선택합니다.",
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
    const saved = { id: "taste-profile-2", ...newProfile };

    it("inserts the new current profile before clearing older current profiles", async () => {
      const operations: string[] = [];
      const table = {
        insert: () => {
          operations.push("insert");
          return { select: () => ({ single: async () => ({ data: saved, error: null }) }) };
        },
        update: () => {
          operations.push("update");
          return {
            eq: () => ({
              eq: () => ({
                neq: async () => ({ data: null, error: null }),
              }),
            }),
          };
        },
      };
      const supabase = { from: () => table } as unknown as SupabaseClient;

      const result = await createCustomerRepository(supabase).replaceCurrentTasteProfile(
        newProfile,
      );

      expect(operations).toEqual(["insert", "update"]);
      expect(result).toEqual(saved);
    });

    it("throws when the insert fails", async () => {
      const table = {
        insert: () => ({
          select: () => ({
            single: async () => ({ data: null, error: { message: "insert failed" } }),
          }),
        }),
      };
      const supabase = { from: () => table } as unknown as SupabaseClient;

      await expect(
        createCustomerRepository(supabase).replaceCurrentTasteProfile(newProfile),
      ).rejects.toThrow(/insert failed/);
    });

    it("throws when clearing older current profiles fails", async () => {
      const table = {
        insert: () => ({
          select: () => ({ single: async () => ({ data: saved, error: null }) }),
        }),
        update: () => ({
          eq: () => ({
            eq: () => ({
              neq: async () => ({ data: null, error: { message: "update failed" } }),
            }),
          }),
        }),
      };
      const supabase = { from: () => table } as unknown as SupabaseClient;

      await expect(
        createCustomerRepository(supabase).replaceCurrentTasteProfile(newProfile),
      ).rejects.toThrow(/update failed/);
    });
  });
});
