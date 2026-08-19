// TASK-102: Seed Data 구축
// Source: documents/[개발 문서] 07_DATABASE_SCHEMA.md (8장 Seed Data 구조)
//
// Seed JSON (seed/*.json) -> Supabase Insert
//
// 기본 실행은 DRY RUN이다 (네트워크 호출 없음, 파일 검증 + 실행 계획만 출력).
// 실제 Supabase Insert를 수행하려면 --apply 플래그가 필요하다.
//
//   pnpm db:seed          # dry run (검증 + 계획만 출력)
//   pnpm db:seed:apply    # 실제 Insert 수행 (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 필요)

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SEED_DIR = path.join(ROOT, "seed");

const APPLY = process.argv.includes("--apply");

// ---------------------------------------------------------------------------
// .env.local / .env 간이 로더 (process.env에 이미 있는 값은 덮어쓰지 않는다)
// ---------------------------------------------------------------------------
function loadDotEnv(file) {
  const filePath = path.join(ROOT, file);
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}
loadDotEnv(".env.local");
loadDotEnv(".env");

// ---------------------------------------------------------------------------
// Seed JSON 로드
// ---------------------------------------------------------------------------
function readJson(file) {
  return JSON.parse(readFileSync(path.join(SEED_DIR, file), "utf8"));
}

const sourceProducts = readJson("mcm_seed_source_30.json");
const productProfilesFile = readJson("mcm_seed_product_profiles_final.json");
const customersFile = readJson("mcm_seed_customers_selections_final.json");
const tasteProfilesFile = readJson("mcm_seed_customer_taste_profiles_final.json");
const eventsFile = readJson("mcm_seed_events_final.json");
const eventMeaningFile = readJson("mcm_seed_event_meaning_profiles.json");

// ---------------------------------------------------------------------------
// 사전 검증 (natural key 참조 무결성) — 네트워크 호출 전에 항상 수행한다.
// ---------------------------------------------------------------------------
function validate() {
  const errors = [];

  const productCodes = new Set(sourceProducts.map((p) => p.product_id));
  for (const p of sourceProducts) {
    if (!p.description) errors.push(`products: ${p.product_id} official_description 누락`);
    if (!p.image_url) errors.push(`products: ${p.product_id} image_url 누락`);
  }

  for (const pp of productProfilesFile.product_profiles) {
    if (!productCodes.has(pp.product_code)) {
      errors.push(`product_profiles: 알 수 없는 product_code ${pp.product_code}`);
    }
  }

  const customerCodes = new Set(customersFile.customers.map((c) => c.customer_code));
  for (const sel of customersFile.customer_product_selections) {
    if (!customerCodes.has(sel.customer_code)) {
      errors.push(`customer_product_selections: 알 수 없는 customer_code ${sel.customer_code}`);
    }
    if (!productCodes.has(sel.product_code)) {
      errors.push(`customer_product_selections: 알 수 없는 product_code ${sel.product_code}`);
    }
  }

  for (const tp of tasteProfilesFile.customer_taste_profiles) {
    if (!customerCodes.has(tp.customer_code)) {
      errors.push(`customer_taste_profiles: 알 수 없는 customer_code ${tp.customer_code}`);
    }
    for (const pid of tp.evidence_product_ids ?? []) {
      if (!productCodes.has(pid)) {
        errors.push(`customer_taste_profiles(${tp.customer_code}): 알 수 없는 evidence product_code ${pid}`);
      }
    }
  }

  const eventCodes = new Set(eventsFile.events.map((e) => e.event_code));
  for (const e of eventsFile.events) {
    for (const pid of e.related_product_ids ?? []) {
      if (!productCodes.has(pid)) {
        errors.push(`events(${e.event_code}): 알 수 없는 related product_code ${pid}`);
      }
    }
  }

  for (const emp of eventMeaningFile.event_meaning_profiles) {
    if (!eventCodes.has(emp.event_code)) {
      errors.push(`event_meaning_profiles: 알 수 없는 event_code ${emp.event_code}`);
    }
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Seed JSON -> DB Row 매핑 (자연키는 이후 실제 Insert 시 UUID로 치환된다)
// ---------------------------------------------------------------------------
function buildProductRows() {
  return sourceProducts.map((p) => ({
    product_code: p.product_id,
    name: p.product_name,
    official_description: p.description,
    image_url: p.image_url,
    metadata: {
      category: p.category ?? null,
      officialColor: p.color_name ?? null,
      rawMaterialText: p.material ?? null,
    },
    source: "seed",
  }));
}

function buildProductProfileRows(productCodeToId) {
  return productProfilesFile.product_profiles.map((pp) => ({
    product_id: productCodeToId.get(pp.product_code),
    core4: pp.core4,
    ai_product_traits: pp.ai_product_traits ?? [],
    evidence: pp.evidence ?? [],
    analysis_model: pp.analysis_model ?? null,
    source: pp.source ?? "seed",
    is_current: pp.is_current ?? true,
  }));
}

function buildCustomerRows() {
  return customersFile.customers.map((c) => ({
    customer_code: c.customer_code,
    display_name: c.display_name,
    description: c.description ?? null,
    source: c.source ?? "seed",
  }));
}

function buildSelectionRows(customerCodeToId, productCodeToId) {
  return customersFile.customer_product_selections.map((s) => ({
    customer_id: customerCodeToId.get(s.customer_code),
    product_id: productCodeToId.get(s.product_code),
    selection_type: s.selection_type,
    selected_at: s.selected_at ?? null,
    source: s.source ?? "seed",
  }));
}

function buildTasteProfileRows(customerCodeToId, productCodeToId) {
  return tasteProfilesFile.customer_taste_profiles.map((tp) => ({
    customer_id: customerCodeToId.get(tp.customer_code),
    taste_summary: tp.taste_summary,
    core_preference: tp.core_preference,
    ai_traits: tp.ai_traits ?? [],
    evidence_product_ids: (tp.evidence_product_ids ?? []).map((code) => productCodeToId.get(code)),
    source: tp.source ?? "seed",
    is_current: tp.is_current ?? true,
  }));
}

function buildEventRows() {
  return eventsFile.events.map((e) => ({
    event_code: e.event_code,
    name: e.name,
    event_type: e.event_type,
    campaign_overview: e.campaign_overview,
    brand_message: e.brand_message,
    collection_concept: e.collection_concept ?? null,
    related_product_ids: [], // placeholder, mapProductIds() 로 치환
    _related_product_codes: e.related_product_ids ?? [],
    source: e.source ?? "seed",
  }));
}

function buildEventMeaningRows(eventCodeToId) {
  return eventMeaningFile.event_meaning_profiles.map((emp) => ({
    event_id: eventCodeToId.get(emp.event_code),
    event_theme: emp.event_theme,
    brand_direction: emp.brand_direction,
    event_traits: emp.event_traits ?? [],
    evidence: emp.evidence ?? [],
    analysis_model: emp.analysis_model ?? null,
    source: emp.source ?? "seed",
    is_current: emp.is_current ?? true,
  }));
}

// ---------------------------------------------------------------------------
// Supabase REST(PostgREST) Insert
// ---------------------------------------------------------------------------
async function insertRows(table, rows) {
  if (rows.length === 0) return [];
  const url = `${process.env.SUPABASE_URL}/rest/v1/${table}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`INSERT ${table} 실패 (HTTP ${res.status}): ${text}`);
  }
  return res.json();
}

function codeMap(insertedRows, codeField, idField = "id") {
  const map = new Map();
  for (const row of insertedRows) map.set(row[codeField], row[idField]);
  return map;
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
async function main() {
  console.log("== TASK-102 Seed Data ==");
  console.log(APPLY ? "모드: APPLY (실제 Supabase Insert 수행)" : "모드: DRY RUN (검증 + 계획만 출력, 네트워크 호출 없음)");
  console.log("");

  const errors = validate();
  if (errors.length > 0) {
    console.error("사전 검증 실패 — 아래 오류를 해결한 뒤 다시 실행하세요:");
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log("사전 검증 통과: 모든 natural key(FK 참조)가 정합함.");
  console.log("");

  const plan = [
    ["products", sourceProducts.length],
    ["product_profiles", productProfilesFile.product_profiles.length],
    ["customers", customersFile.customers.length],
    ["customer_product_selections", customersFile.customer_product_selections.length],
    ["customer_taste_profiles", tasteProfilesFile.customer_taste_profiles.length],
    ["events", eventsFile.events.length],
    ["event_meaning_profiles", eventMeaningFile.event_meaning_profiles.length],
  ];
  console.log("실행 계획 (Insert 순서 = FK 의존 순서):");
  for (const [table, count] of plan) console.log(`  ${table}: ${count}건`);
  console.log("");

  if (!APPLY) {
    console.log("실제 Insert 없이 종료합니다. 적용하려면: pnpm db:seed:apply");
    return;
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 환경변수가 필요합니다 (.env.local 또는 쉘 환경변수).");
    process.exit(1);
  }
  console.log(`대상 Supabase: ${process.env.SUPABASE_URL}`);
  console.log("");

  // 1. products
  const insertedProducts = await insertRows("products", buildProductRows());
  const productCodeToId = codeMap(insertedProducts, "product_code");
  console.log(`products: ${insertedProducts.length}건 Insert 완료`);

  // 2. product_profiles
  const insertedProductProfiles = await insertRows(
    "product_profiles",
    buildProductProfileRows(productCodeToId)
  );
  console.log(`product_profiles: ${insertedProductProfiles.length}건 Insert 완료`);

  // 3. customers
  const insertedCustomers = await insertRows("customers", buildCustomerRows());
  const customerCodeToId = codeMap(insertedCustomers, "customer_code");
  console.log(`customers: ${insertedCustomers.length}건 Insert 완료`);

  // 4. customer_product_selections
  const insertedSelections = await insertRows(
    "customer_product_selections",
    buildSelectionRows(customerCodeToId, productCodeToId)
  );
  console.log(`customer_product_selections: ${insertedSelections.length}건 Insert 완료`);

  // 5. customer_taste_profiles
  const insertedTasteProfiles = await insertRows(
    "customer_taste_profiles",
    buildTasteProfileRows(customerCodeToId, productCodeToId)
  );
  console.log(`customer_taste_profiles: ${insertedTasteProfiles.length}건 Insert 완료`);

  // 6. events
  const eventRowsRaw = buildEventRows();
  const eventRows = eventRowsRaw.map(({ _related_product_codes, ...row }) => ({
    ...row,
    related_product_ids: _related_product_codes.map((code) => productCodeToId.get(code)),
  }));
  const insertedEvents = await insertRows("events", eventRows);
  const eventCodeToId = codeMap(insertedEvents, "event_code");
  console.log(`events: ${insertedEvents.length}건 Insert 완료`);

  // 7. event_meaning_profiles
  const insertedEventMeaning = await insertRows(
    "event_meaning_profiles",
    buildEventMeaningRows(eventCodeToId)
  );
  console.log(`event_meaning_profiles: ${insertedEventMeaning.length}건 Insert 완료`);

  console.log("");
  console.log("Seed 완료.");
}

main().catch((err) => {
  console.error("Seed 실패:", err.message);
  process.exit(1);
});
