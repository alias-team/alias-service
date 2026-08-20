# TASK-206 Issue Composition Engine Design

## Goal

Gatekeeper가 PASS로 판정한 동일 Event의 전체 Product Pool을 하나의 구조화된 `IssueComposition`으로 변환해 TASK-207 Editorial Generator에 전달한다.

## Scope

- Issue 생성 단위는 Event다.
- 동일 Event의 PASS Product를 하나의 Issue로 구성한다.
- PASS Product Pool 전체를 유지하며 Top-N 또는 최대 개수 제한을 적용하지 않는다.
- Issue Theme, Editorial Angle, Product Role, Discovery Direction, Brand Connection, Evidence를 구조화한다.
- Editorial 본문, UI/API, DB schema, migration, seed는 변경하지 않는다.

## Architecture

TASK-203과 동일하게 `types`, `validation`, `prompt`, `ai` 경계를 사용한다. 코드가 입력의 PASS 여부와 Event 일관성 및 출력 Product ID의 완전 일치를 결정론적으로 검증하고, 주입 가능한 generator가 편집 의미 필드를 생성하는 Hybrid Composition 방식이다.

## Input

`IssueCompositionInput`은 TASK-203이 생성한 하나의 `EventMeaningProfile`과 비어 있지 않은 `passProductPool`을 받는다. 각 Product에는 `event_id`, `decision: "PASS"`, 제품 정보, Gatekeeper editorial angle, matching reason, meaning bridge, extension, product profile, evidence가 포함된다.

Issue, Event Meaning Profile, Product Pool의 `event_id`가 서로 다르거나 PASS가 아닌 decision 또는 빈 Pool이면 AI 호출 전에 거부한다.

## Output Contract

```json
{
  "event_id": "",
  "issue_theme": "",
  "editorial_angle": "",
  "selected_products": [
    {
      "product_id": "",
      "product_role": "",
      "discovery_direction": ""
    }
  ],
  "brand_connection": {
    "event_theme": "",
    "brand_direction": "",
    "connection_narrative": ""
  },
  "evidence": []
}
```

모든 문자열은 trim 후 비어 있지 않아야 하며 `evidence`는 비어 있지 않은 문자열 배열이다. `selected_products`의 Product ID는 입력과 같은 순서로 정확히 한 번씩 나타나야 한다. 누락, 추가, 중복, 순서 변경은 모두 거부한다.

## AI Boundary

OpenAI Structured Outputs JSON Schema를 사용한다. 프롬프트는 Event를 Issue의 중심 주제로 삼고 각 Product를 개별 Discovery로 다루도록 지시하며, 제공된 근거 밖의 사실 생성과 Product 선별을 금지한다. 테스트에서는 generator를 주입해 네트워크 없이 실제 검증·조립 동작을 확인한다.

## Error Handling

입력과 AI 출력은 Zod로 검증한다. 교차 필드 규칙은 engine에서 명시적인 오류로 처리한다. OpenAI의 빈 응답과 잘못된 JSON은 TASK-203과 같은 형태로 원인을 구분해 오류를 발생시킨다.

## Testing

- 여러 PASS Product가 하나의 Issue가 되는지 검증한다.
- 3개를 초과한 Product도 전부 유지되는지 검증한다.
- 빈 Pool, 다른 Event 혼합, PASS가 아닌 Product를 거부한다.
- AI 출력의 Product 누락, 추가, 중복, 순서 변경을 거부한다.
- 필수 의미 필드와 evidence가 비어 있으면 거부한다.
