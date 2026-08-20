# TASK-206 Issue Composition Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 동일 Event의 전체 PASS Product Pool을 TASK-207 입력용 `IssueComposition`으로 변환한다.

**Architecture:** TASK-203의 types/validation/prompt/ai 구조를 유지한다. 결정론적 코드가 Pool 불변조건과 Product 완전 보존을 담당하고, 주입 가능한 AI generator가 편집 의미 구조를 생성한다.

**Tech Stack:** TypeScript, Zod 4, OpenAI Responses API Structured Outputs, Vitest

**Spec:** `docs/superpowers/specs/2026-08-18-task-206-issue-composition-design.md`

## Global Constraints

- PASS Product Pool 전체를 유지한다.
- Top-N 또는 최대 N 제한을 구현하지 않는다.
- 서로 다른 Event의 Product Pool을 혼합하지 않는다.
- Editorial 본문, UI/API, DB schema, migration, seed를 변경하지 않는다.
- TASK-203의 types / validation / ai / prompt 패턴을 유지한다.

---

### Task 1: Issue Composition Contract and Engine

**Files:**
- Create: `src/types/issue-composition.ts`
- Create: `src/lib/validation/issue-composition.schema.ts`
- Create: `src/lib/ai/prompts/issue-composition.prompt.ts`
- Create: `src/lib/ai/issue-composition.ts`
- Test: `src/lib/ai/issue-composition.test.ts`

**Interfaces:**
- Consumes: `composeIssue(input: IssueCompositionInput, generate?: IssueCompositionGenerator): Promise<IssueComposition>`
- Produces: snake_case `IssueComposition` Output Contract for TASK-207

- [x] **Step 1: Write failing behavior tests**

Create tests with literal fixtures that assert one Issue preserves every same-Event PASS Product and emits the exact snake_case contract. Add separate tests for more than three products, mixed Events, non-PASS products, empty pools, and generator Product ID mismatch.

- [x] **Step 2: Run tests to verify RED**

Run: `pnpm test src/lib/ai/issue-composition.test.ts`

Expected: FAIL because `./issue-composition` does not exist.

- [x] **Step 3: Add types and strict schemas**

Define `PassProductCandidate`, `IssueCompositionInput`, `SelectedProductComposition`, `BrandConnection`, and `IssueComposition`. Add strict Zod input/output schemas plus an OpenAI-compatible JSON Schema whose required keys exactly match the Output Contract.

- [x] **Step 4: Add prompt builder and engine**

Build a prompt containing Event Meaning and every PASS Product. Implement OpenAI Structured Output generation, JSON parsing, Zod validation, pre-generation Event/PASS checks, and post-generation exact ordered Product ID checks.

- [x] **Step 5: Run focused tests to verify GREEN**

Run: `pnpm test src/lib/ai/issue-composition.test.ts`

Expected: all Issue Composition tests pass with no warnings.

- [x] **Step 6: Run repository verification**

Run: `pnpm test && pnpm lint && pnpm exec tsc --noEmit`

Expected: all commands exit 0.
