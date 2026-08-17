-- TASK-101: Database Schema
-- Source: documents/[개발 문서] 07_DATABASE_SCHEMA.md
-- MCM Personal Editorial Engine MVP 데이터베이스 설계

-- =============================================================================
-- 3. 공통 타입과 Enum
-- =============================================================================

create type event_type as enum ('collection', 'campaign', 'brand_event');
create type selection_type as enum ('purchase', 'wishlist');
create type gatekeeper_decision as enum ('PASS', 'REJECT');
create type data_source as enum ('seed', 'ai_generated');
create type reasoning_run_status as enum ('pending', 'processing', 'completed', 'failed');

-- =============================================================================
-- 4.1 products
-- =============================================================================

create table products (
  id uuid primary key default gen_random_uuid(),
  product_code text not null,
  name text not null,
  official_description text not null,
  image_url text not null,
  metadata jsonb default '{}'::jsonb,
  source data_source not null default 'seed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint products_product_code_key unique (product_code)
);

-- =============================================================================
-- 4.2 product_profiles
-- =============================================================================

create table product_profiles (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id),
  core4 jsonb not null,
  ai_product_traits jsonb not null default '[]'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  analysis_model text,
  source data_source not null default 'seed',
  is_current boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================================================
-- 4.3 customers
-- =============================================================================

create table customers (
  id uuid primary key default gen_random_uuid(),
  customer_code text not null,
  display_name text not null,
  description text,
  source data_source not null default 'seed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint customers_customer_code_key unique (customer_code)
);

-- =============================================================================
-- 4.4 customer_product_selections
-- =============================================================================

create table customer_product_selections (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers (id),
  product_id uuid not null references products (id),
  selection_type selection_type not null,
  selected_at timestamptz,
  source data_source not null default 'seed',
  created_at timestamptz not null default now(),

  constraint customer_product_selections_unique unique (customer_id, product_id, selection_type)
);

-- =============================================================================
-- 4.5 customer_taste_profiles
-- =============================================================================

create table customer_taste_profiles (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers (id),
  taste_summary text not null,
  core_preference jsonb not null,
  ai_traits jsonb not null default '[]'::jsonb,
  evidence_product_ids uuid[] not null default '{}',
  source data_source not null default 'seed',
  is_current boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================================================
-- 4.6 events
-- =============================================================================

create table events (
  id uuid primary key default gen_random_uuid(),
  event_code text not null,
  name text not null,
  event_type event_type not null,
  campaign_overview text not null,
  brand_message text not null,
  collection_concept text,
  related_product_ids uuid[] not null default '{}',
  source data_source not null default 'seed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint events_event_code_key unique (event_code)
);

-- =============================================================================
-- 4.7 event_meaning_profiles
-- =============================================================================

create table event_meaning_profiles (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id),
  event_theme text not null,
  brand_direction text not null,
  event_traits jsonb not null default '[]'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  analysis_model text,
  source data_source not null default 'seed',
  is_current boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================================================
-- 4.8 reasoning_runs
-- =============================================================================

create table reasoning_runs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers (id),
  event_id uuid not null references events (id),
  customer_taste_profile_id uuid not null references customer_taste_profiles (id),
  event_meaning_profile_id uuid not null references event_meaning_profiles (id),
  status reasoning_run_status not null default 'pending',
  source data_source not null default 'seed',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  error_message text,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- 4.9 matching_results
-- =============================================================================

create table matching_results (
  id uuid primary key default gen_random_uuid(),
  reasoning_run_id uuid not null references reasoning_runs (id),
  customer_evidence jsonb not null,
  product_event_evidence jsonb not null,
  meaning_bridge jsonb not null,
  candidate_product_ids uuid[] not null default '{}',
  is_valid boolean not null default false,
  validation_errors jsonb not null default '[]'::jsonb,
  analysis_model text,
  source data_source not null default 'seed',
  created_at timestamptz not null default now()
);

-- =============================================================================
-- 4.10 gatekeeper_results
-- =============================================================================

create table gatekeeper_results (
  id uuid primary key default gen_random_uuid(),
  reasoning_run_id uuid not null references reasoning_runs (id),
  matching_result_id uuid not null references matching_results (id),
  decision gatekeeper_decision not null,
  reason text not null,
  editorial_angle text,
  failed_rules jsonb not null default '[]'::jsonb,
  candidate_product_ids uuid[] not null default '{}',
  source data_source not null default 'seed',
  created_at timestamptz not null default now()
);

-- =============================================================================
-- 4.11 personal_editorials
-- =============================================================================

create table personal_editorials (
  id uuid primary key default gen_random_uuid(),
  gatekeeper_result_id uuid not null references gatekeeper_results (id),
  reasoning_run_id uuid not null references reasoning_runs (id),
  customer_id uuid not null references customers (id),
  event_id uuid not null references events (id),
  title text not null default 'MY MCM ISSUE',
  hero_image_url text,
  brand_story text not null,
  personal_connection text not null,
  product_discovery jsonb not null default '[]'::jsonb,
  closing_message text not null,
  editorial_content jsonb not null default '{}'::jsonb,
  generation_model text,
  source data_source not null default 'seed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================================================
-- 9.1 필수 Index
-- =============================================================================

create index idx_product_profiles_product_id on product_profiles (product_id);
create index idx_product_profiles_current on product_profiles (product_id) where is_current = true;

create index idx_customer_product_selections_customer_id on customer_product_selections (customer_id);
create index idx_customer_product_selections_product_id on customer_product_selections (product_id);

create index idx_customer_taste_profiles_customer_id on customer_taste_profiles (customer_id);
create index idx_customer_taste_profiles_current on customer_taste_profiles (customer_id) where is_current = true;

create index idx_event_meaning_profiles_event_id on event_meaning_profiles (event_id);
create index idx_event_meaning_profiles_current on event_meaning_profiles (event_id) where is_current = true;

create index idx_reasoning_runs_customer_event on reasoning_runs (customer_id, event_id);

create index idx_matching_results_reasoning_run_id on matching_results (reasoning_run_id);

create index idx_gatekeeper_results_reasoning_run_id on gatekeeper_results (reasoning_run_id);
create index idx_gatekeeper_results_decision on gatekeeper_results (decision);

create index idx_personal_editorials_reasoning_run_id on personal_editorials (reasoning_run_id);
create index idx_personal_editorials_customer_event on personal_editorials (customer_id, event_id);
