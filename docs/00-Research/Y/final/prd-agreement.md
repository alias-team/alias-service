# PRD 구체화 전 합의 사항

> 최종기획안(2026-08-11)을 베이스로, Core축 실제 검증 및 Retrieval/Gatekeeper 구조를 구체화한 최종 결정본

## 1. 공통적으로 합의된 방향

| 항목 | 내용 |
| --- | --- |
| Trigger | Personal Signal 발생 시 Profile을 갱신한다. 짧은 시간 내 여러 신호가 발생하면 Debounce로 묶어 처리한다. |
| Core / Trait | Core는 기본적인 시각 취향을 구조화하고, Trait는 Core만으로 설명하기 어려운 반복적인 행동 패턴을 보완한다. |
| Meaningful Extension | 고객 취향을 Anchor로 MCM/도시 Context와 연결해 새로운 의미가 있는지 AI가 판단한다. |
| Editorial | 고객 취향과 MCM/Context의 근거를 바탕으로 서로 다른 관점의 Editorial을 생성한다. |
| AI Gatekeeper | Evidence Grounding / Specificity / Novelty / Discovery Value를 바탕으로 최종 발행 가치를 종합 판단한다. |
| Issue Novelty | 과거 Issue를 참고해 반복을 줄이되, 단순 유사성만으로 자동 탈락시키지는 않는다. |

## 2. 주요 설계 사항 및 최종 결정

### 2.1 Minimum Data

**검토된 방향**
- Purchase ≥ 1 + Wishlist/장바구니 ≥ 1
- Purchase ≥ 1 + 전체 서로 다른 제품 ≥ 3

**결정된 방향**
Purchase ≥ 1 + Wishlist/장바구니 ≥ 2

**결정 근거**
- Purchase = 실제 선택을 보여주는 핵심 Evidence
- Wishlist/장바구니 = 관심·취향 확장을 보여주는 보조 Evidence
- 데이터포인트가 총 3개(구매1+장바구니2) 이상 확보되어야 취향축 최빈값 계산이 안정적이며, Wishlist를 최소 2개 이상 요구함으로써 단순 반복 구매가 아니라 관심 확장 신호가 프로필에 반드시 포함되도록 한다.
- 조건 미달 시 `insufficient`로 처리, 프로필 생성하지 않음

### 2.2 Trait의 Retrieval 활용

**검토된 방향**
- Core4 2축 이상만 Retrieval
- Core4 2축 이상 OR Core4 1축 + 관련 Trait (모든 후보에 상시 병렬 적용)

**결정된 방향**
Retrieval은 **Core4 2축 이상 일치를 기본 경로로 우선 시도**한다. 이 결과가 **0개인 경우에만** Core4 1축 이상 + 관련 AI-discovered Trait를 보조 경로로 추가 적용한다. 그래도 0개면 후보 없음을 그대로 허용한다.

즉:
1. Core4 2축 이상 매칭 → 후보 있음 → 그대로 사용 (Trait 경로는 실행되지 않음)
2. 1번 결과 0개 → Core4 1축 이상 + 관련 Trait 매칭 시도 → 후보 있으면 사용
3. 2번도 0개 → 후보 없음 허용 (발행하지 않음)

Trait가 없는 고객은 2번 단계가 자연스럽게 스킵될 뿐이며, 시스템이 깨지거나 별도 처리가 필요하지 않다.

**결정 근거**
- Trait는 Core를 대체하는 기준이 아니라, Core만으로는 후보가 전혀 없을 때만 열리는 보조 경로다.
- Trait 품질이 아직 검증되지 않은 상태이므로(초기 테스트는 Category를 대리값으로 사용) 영향 범위를 최소화해야 한다. 순차적 fallback 구조는 원래 0건이었던 케이스에만 개입하고 나머지 대다수 케이스는 건드리지 않는다.
  - 실측 비교: "항상 병렬 OR" 방식은 표본 32건 전체에 영향을 줘 평균 후보 수가 13.31→15.31로 상승했지만, "순차 fallback" 방식은 원래 0건이던 케이스에만 개입한다.
- 최종기획안의 Rule/AI 역할 분리("Retrieval = Rule, Trait = AI 해석") 원칙을 평상시에는 그대로 유지하면서, 예외 상황에서만 최소한으로 개입한다.
- Trait는 최소 2개 이상의 Evidence에서 반복적으로 나타나는 행동 패턴을 기반으로 생성하며, Category/용도는 Trait로 간주하지 않는다.

**검증 메모**: 초기 테스트에서는 Category를 Trait의 대리값으로 사용했기 때문에, 1축+Trait 경로의 메커니즘(정상 작동, 트레잇 없는 고객도 안전한 폴백)은 확인했지만 Trait 자체의 실제 취향 연결 품질까지 검증된 것은 아니다.

### 2.3 Gatekeeper 구조

**검토된 방향**
- Rule Validation → Independent AI Gatekeeper
- Retrieval 후 AI Gatekeeper에서 종합 판단

**결정된 방향**
Rule Validation → Independent AI Gatekeeper의 2단계 구조를 유지한다.

**Rule Validation** — 객관적으로 검증 가능한 조건을 먼저 확인한다.
- Evidence 존재
- Source 유효성
- 동일 제품 중복 여부
- 고객 취향 Anchor 존재 여부 등

**Independent AI Gatekeeper** — Rule을 통과한 Angle을 대상으로:
- Evidence Grounding
- Specificity
- Novelty
- Discovery Value

를 점수화하지 않고 서술형으로 종합 판단한다. 최종적으로 발행 가치가 가장 높은 Angle을 PASS하고, 적합한 후보가 없으면 NONE으로 처리한다.

**결정 근거**
- 객관적으로 검증 가능한 조건과 편집적 가치 판단의 역할을 분리한다. Rule = 객관적 조건 검증 / AI = 의미와 편집적 가치 판단.
- AI가 객관적인 조건까지 임의로 판단하지 않도록 2단계 구조를 유지한다.
- 최종기획안 5.2절의 RULE 항목("Evidence Product ID 검증", "동일 Issue 중복")과도 일치한다.

### 2.4 Issue Novelty

**검토된 방향**
- 동일 product_id만 Rule로 제외
- 동일 제품 제외 + 최근 Issue 3개를 AI에게 참고자료로 제공

**결정된 방향**
동일 제품의 단순 중복 발행은 Rule로 제외한다. 단, 동일 제품이라도 새로운 도시·컬렉션·Context와 결합되어 새로운 의미를 제공하는 경우에는 자동으로 차단하지 않고 AI가 Novelty를 판단한다.

- 동일 product_id + 동일 Context(같은 도시/컬렉션 반복) → **Rule 단계에서 제외**
- 동일 product_id + 새로운 도시·컬렉션·Context와 결합 → Rule 통과, **AI가 Novelty 판단**
- 다른 제품 → 후보로 허용, 최근 Issue 3개를 참고자료로 제공하고 AI가 반복성 판단

**결정 근거**
- 고객의 취향은 지속적으로 반복될 수 있기 때문에, 같은 취향 포인트가 다시 등장한다는 이유만으로 후보를 차단하면 안 된다.
- 완전히 동일한 반복(같은 제품·같은 맥락)은 비용을 들이지 않고 Rule로 걸러내고, 같은 제품이라도 새로운 맥락에서 다시 의미를 가질 가능성은 AI가 판단하도록 한다.
- 이렇게 하면 "단순 유사성만으로 자동 REJECT하지 않는다"는 원칙과 "완전 동일 반복은 걸러야 한다"는 실용성을 동시에 만족한다.

## 3. 검증 과정에서 확인된 미해결 사항

- ### Material 다중보류 문제

Core4 기반 Retrieval을 실제 MCM 제품 데이터에 적용하는 과정에서, **Material·Silhouette·Monogram 등의 값이 여러 축에서 동시에 `보류`되는 일부 제품은 Core4 2축 이상 매칭이 불가능해 후보가 0개가 되는 현상**을 확인했다.

`보류 = unknown`으로 처리하는 방식도 테스트했지만, Retrieval 조건 자체가 `Core4 2축 이상`이기 때문에 0건 문제가 실질적으로 해결되지는 않았다.

따라서 현재 MVP에서는 **근거가 불확실한 값을 임의로 매핑해 후보를 만드는 별도 예외 Retrieval Rule을 추가하지 않는다.**

> **향후 실제 카탈로그 데이터가 확장되면 Material/Silhouette 등의 태깅 커버리지를 확대하고, 해당 제품군의 후보 생성률을 재검토한다.**