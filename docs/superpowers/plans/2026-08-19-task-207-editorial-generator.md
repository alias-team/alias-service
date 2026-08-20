# TASK-207 Personal Editorial Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** TASK-206 `IssueComposition`과 검증된 고객·Event·Product Context를 기반으로 TASK-301이 저장할 수 있는 Personal Editorial JSON을 생성한다.

**Architecture:** TASK-203/TASK-206의 types / validation / prompt / ai 구조를 유지한다. LLM은 Editorial 콘텐츠와 Product ID 참조만 생성하고, 엔진이 고정 sender, 원본 Event Type, Brand Asset 및 Product Metadata를 직접 결합한 뒤 전체 Product 보존을 검증한다.

**Tech Stack:** TypeScript, Zod 4, OpenAI Responses API Structured Outputs, Vitest

**Spec:** `docs/superpowers/specs/2026-08-19-task-207-editorial-generator-design.md`

## Global Constraints

- TASK-206 `IssueComposition`을 유일한 Gatekeeper 결과 입력으로 사용한다.
- PASS Product 전체를 유지하며 Top-N 제한을 두지 않는다.
- `brand_asset.image_url`을 `brand_story.image_url`에 직접 매핑한다.
- `events.event_type`의 `collection | campaign | brand_event` 값을 `story_type`에 변환 없이 매핑한다.
- Product ID, Product Name, Product Image URL은 원본 Product Context로 검증하고 결합한다.
- Product 추천 문구와 AI 분석을 직접 노출하는 문구를 생성하지 않는다.
- DB 저장, Repository, Service, API, DB schema, migration, seed를 변경하지 않는다.

---

### Task 1: Editorial Generator Contract and Validation

**Files:**
- Create: `src/types/editorial.ts`
- Create: `src/lib/validation/editorial.schema.ts`
- Test: `src/lib/ai/editorial-generator.test.ts`

**Interfaces:**
- Consumes: `generateEditorial(input: EditorialGeneratorInput, generate?: EditorialGenerator): Promise<PersonalEditorial>`
- Produces: TASK-301 저장 입력으로 사용할 `PersonalEditorial`

- [x] **Step 1: Write failing contract and integrity tests**

테스트는 정상 Editorial 생성, Brand Asset/Event Type 직접 매핑, 4개 이상 Product 전체 유지, Product 누락·추가·중복·metadata 변경 차단, Event 불일치, 빈 콘텐츠와 필수 section 누락 거부를 검증한다.

- [x] **Step 2: Run the focused tests and verify RED**

Run: `pnpm test src/lib/ai/editorial-generator.test.ts`

Expected: FAIL because `./editorial-generator` and `@/types/editorial` do not exist.

- [x] **Step 3: Add strict input, draft, and final output schemas**

Input Schema는 `IssueComposition`, Event Meaning Profile, Customer Taste Profile, Event, Brand Asset, Product Context를 검증한다. Draft Schema는 LLM 생성 콘텐츠와 Product ID 참조를 검증하며, final Schema는 직접 결합된 metadata를 포함한 Output Contract를 검증한다.

### Task 2: Prompt and Editorial Engine

**Files:**
- Create: `src/lib/ai/prompts/editorial-generator.prompt.ts`
- Create: `src/lib/ai/editorial-generator.ts`
- Test: `src/lib/ai/editorial-generator.test.ts`

**Interfaces:**
- Consumes: Task 1의 `EditorialGeneratorInput`, `EditorialDraft`
- Produces: `generateEditorial(...)`

- [x] **Step 1: Implement the prompt builder**

영문 Luxury Editorial tone, 근거 외 사실 생성 금지, 추천 표현 금지, IssueComposition의 Product 전체 사용을 지시하고 모든 입력 Context를 JSON으로 전달한다.

- [x] **Step 2: Implement the injected generator and OpenAI boundary**

TASK-203/TASK-206과 동일하게 Responses API Structured Outputs, 빈 응답 오류, JSON parse 오류, generator 주입을 구현한다.

- [x] **Step 3: Implement deterministic hydration and integrity checks**

Issue/Event/Profile ID 일치와 Product Context의 정확한 집합·순서를 검증한다. Draft의 모든 chapter를 flatten해 Product ID가 입력과 같은 순서로 정확히 한 번씩 존재하는지 확인한 뒤 sender, story type, Brand Asset, Product Name/Image URL을 직접 결합한다.

- [x] **Step 4: Run focused tests and verify GREEN**

Run: `pnpm test src/lib/ai/editorial-generator.test.ts`

Expected: all TASK-207 tests pass.

### Task 3: Repository Verification

**Files:**
- Modify: none

- [x] **Step 1: Run full verification**

Run: `pnpm test && pnpm lint && pnpm exec tsc --noEmit`

Expected: all commands exit 0.
