# TASK-207 Personal Editorial Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** TASK-206 IssueComposition 결과와 고객/브랜드/Product Context를 기반으로 Personal Editorial JSON을 생성한다.

**Architecture:** TASK-206 Output을 Input Contract로 사용한다. Product Metadata는 직접 매핑하고, Editorial Content는 OpenAI Structured Output 기반으로 생성한다. TASK-203/TASK-206의 types / validation / prompt / ai 구조를 유지한다.

**Tech Stack:** TypeScript, Zod 4, OpenAI Responses API Structured Outputs, Vitest

**Spec:** `docs/superpowers/specs/2026-08-19-task-207-editorial-generator-design.md`

---

## Global Constraints

- TASK-206 IssueComposition을 기준으로 Editorial을 생성한다.
- PASS Product Pool 전체를 유지한다.
- Product ID, Product Name, Image URL은 AI가 생성하지 않는다.
- Product Metadata는 Source Data에서 직접 매핑한다.
- Editorial Content만 LLM이 생성한다.
- Product Recommendation 문구 생성 금지.
- AI 분석 결과를 고객에게 직접 노출하지 않는다.
- DB schema 변경 금지.
- migration 수정 금지.
- seed 수정 금지.
- UI/API 구현 금지.

---

## Task 1: Editorial Generator Contract

**Files:**

- Create: `src/types/editorial.ts`

**Interfaces:**

Consumes:

```ts
generateEditorial(
 input: EditorialGeneratorInput,
 generate?: EditorialGenerator
): Promise<PersonalEditorial>
Produces:
Personal Editorial JSON Contract for personal_editorials.editorial_content
Define:
EditorialGeneratorInput
PersonalEditorial
EmailHeader
Cover
OpeningMessage
BrandStory
DiscoveryChapter
ProductDiscovery
ClosingMessage

Step 1: Write failing behavior tests
Create tests with fixtures that verify:
Valid Input creates Editorial JSON
Required sections exist
Product metadata is preserved
Product information is not modified

Step 2: Run tests to verify RED
Run:
pnpm test src/lib/ai/editorial-generator.test.ts
Expected:
FAIL because implementation does not exist.
Task 2: Add Editorial Validation Schema
Files:
Create:
src/lib/validation/editorial.schema.ts
Implement:
Zod Input Schema
Zod Output Schema
OpenAI JSON Schema
Validate:
Required Output
email_header
cover
opening_message
brand_story
discovery_chapters
closing_message
Product Integrity
product_id exists in input
product_name matches source data
image_url matches source data
Content
Empty content rejected
Invalid structure rejected

Step 3: Add strict schemas
Create schemas matching Personal Editorial JSON Contract.
Task 3: Add Editorial Prompt Builder
Files:
Create:
src/lib/ai/prompts/editorial-generator.prompt.ts
Purpose:
Generate luxury editorial content.
Prompt Requirements:
Must:
Write in English.
Connect Customer Taste and MCM Brand Direction.
Create editorial storytelling.
Explain why products are meaningful discoveries.
Must NOT:
Mention AI analysis.
Write recommendation style copy.
Invent product information.
Change product metadata.
Create unsupported brand facts.

Step 4: Implement prompt builder
Build prompt using:
Input:
IssueComposition
EventMeaningProfile
CustomerTasteProfile
Product Data
Gatekeeper Result
Task 4: Implement Editorial Generator Engine
Files:
Create:
src/lib/ai/editorial-generator.ts
Implementation:
Follow TASK-203/TASK-206 pattern:
Input
 ↓
Prompt Builder
 ↓
OpenAI Structured Output
 ↓
JSON Parse
 ↓
Zod Validation
 ↓
PersonalEditorial Return
Required:
OpenAI Responses API Structured Output
Generator injection for tests
Error handling

Step 5: Add Product Discovery Generation
Rules:
Direct Mapping:
product_id
product_name
image_url
LLM Generation:
discovery_story
connection_reason
Task 5: Add Tests
Files:
Create:
src/lib/ai/editorial-generator.test.ts
Test Cases:
Generation
Creates Personal Editorial JSON
Generates Cover
Generates Brand Story
Generates Discovery Chapters
Product Validation
Unknown product rejected
Product name modification rejected
Image URL modification rejected
Content Validation
Empty content rejected
Missing section rejected

Step 6: Run focused tests
Run:
pnpm test src/lib/ai/editorial-generator.test.ts
Expected:
All Editorial Generator tests pass.
Task 6: Repository Verification
Run:
pnpm test && pnpm lint && pnpm exec tsc --noEmit
Expected:
All commands exit 0.
Completion Output
After implementation report:
Created files
Modified files
TASK-207 Input → Output data flow
Generated Personal Editorial JSON example
Test result
TASK-401 UI implementation readiness