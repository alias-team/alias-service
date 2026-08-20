import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServerClient } from "@/lib/database/supabase-server";
import { customerTasteProfileSchema } from "@/lib/validation/customer-taste.schema";
import type {
  Customer,
  CustomerProductSelection,
  CustomerTasteProfile,
  NewCustomerTasteProfile,
} from "@/types/customer";
import type { DataSource } from "@/types/event";

// TASK-301 DB 연결 2단계: customers / customer_product_selections / customer_taste_profiles
// 읽기·쓰기 repository. Source: documents/[개발 문서] 07_DATABASE_SCHEMA.md (4.3~4.5)
// AI 판단 로직(TASK-202)은 다루지 않는다 — DB read/write만 담당한다.

interface CustomerTasteProfileRow {
  id: string;
  customer_id: string;
  taste_summary: string;
  // core_preference/ai_traits는 jsonb라 Supabase가 구조를 보장하지 않는다 — 억지로
  // CorePreference/CustomerAiTrait[]로 캐스트하지 않고, 아래 toCustomerTasteProfile()에서
  // 기존 customerTasteProfileSchema(Zod)로 실제 검증한다(07_DATABASE_SCHEMA.md 10.3).
  core_preference: unknown;
  ai_traits: unknown;
  evidence_product_ids: string[];
  source: DataSource;
  is_current: boolean;
  created_at?: string;
  updated_at?: string;
}

function toCustomerTasteProfile(row: CustomerTasteProfileRow): CustomerTasteProfile {
  const validated = customerTasteProfileSchema.parse({
    taste_summary: row.taste_summary,
    core_preference: row.core_preference,
    ai_traits: row.ai_traits,
    evidence_product_ids: row.evidence_product_ids,
  });

  return {
    id: row.id,
    customer_id: row.customer_id,
    ...validated,
    source: row.source,
    is_current: row.is_current,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export interface CustomerRepository {
  findCustomerByCode(customerCode: string): Promise<Customer | null>;
  findSelectionsByCustomerId(
    customerId: string,
  ): Promise<CustomerProductSelection[]>;
  findCurrentTasteProfile(customerId: string): Promise<CustomerTasteProfile | null>;
  replaceCurrentTasteProfile(
    profile: NewCustomerTasteProfile,
  ): Promise<CustomerTasteProfile>;
}

export function createCustomerRepository(
  supabase: SupabaseClient = getSupabaseServerClient(),
): CustomerRepository {
  return {
    async findCustomerByCode(customerCode) {
      const { data, error } = await supabase
        .from("customers")
        .select("id,customer_code,display_name,description,source")
        .eq("customer_code", customerCode)
        .maybeSingle();

      if (error) throw new Error(`Failed to load customer: ${error.message}`);
      return data as Customer | null;
    },

    async findSelectionsByCustomerId(customerId) {
      const { data, error } = await supabase
        .from("customer_product_selections")
        .select("product_id,selection_type")
        .eq("customer_id", customerId);

      if (error) {
        throw new Error(
          `Failed to load customer product selections: ${error.message}`,
        );
      }
      return (data ?? []) as CustomerProductSelection[];
    },

    async findCurrentTasteProfile(customerId) {
      const { data, error } = await supabase
        .from("customer_taste_profiles")
        .select(
          "id,customer_id,taste_summary,core_preference,ai_traits,evidence_product_ids,source,is_current,created_at,updated_at",
        )
        .eq("customer_id", customerId)
        .eq("is_current", true)
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to load current Customer Taste Profile: ${error.message}`);
      }
      if (!data) return null;
      return toCustomerTasteProfile(data as CustomerTasteProfileRow);
    },

    async replaceCurrentTasteProfile(profile) {
      const { data, error } = await supabase
        .from("customer_taste_profiles")
        .insert(profile)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to save Customer Taste Profile: ${error.message}`);
      }

      const saved = toCustomerTasteProfile(data as CustomerTasteProfileRow);
      const { error: updateError } = await supabase
        .from("customer_taste_profiles")
        .update({ is_current: false })
        .eq("customer_id", profile.customer_id)
        .eq("is_current", true)
        .neq("id", saved.id);

      if (updateError) {
        throw new Error(
          `Saved the new profile but failed to clear older current profiles: ${updateError.message}`,
        );
      }
      return saved;
    },
  };
}
