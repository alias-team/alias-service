파일명:
`docs/[개발 문서] 10_API_DEMO_FLOW.md`

```md
# API Demo Flow Specification

> TASK-301 Demo API 범위 및 Frontend 연결 흐름 정의 문서

---

# 1. 목적

본 문서는 MCM Personal Editorial Engine MVP 데모 구현을 위해,
기존 AI Pipeline(TASK-201~207)을 Frontend UI와 연결하기 위한 최소 API 범위를 정의한다.

운영 환경을 위한 전체 API 설계가 아닌,
해커톤 데모에서 사용자가 Event를 실행하고 Personal Editorial Issue가 생성되는 전체 경험을 구현하는 것을 목표로 한다.

TASK-301은 새로운 AI Logic을 구현하는 영역이 아니라,
이미 구현된 AI Module들을 하나의 Demo Experience로 연결하는 Backend Orchestration Layer 역할을 담당한다.

---

# 2. Demo Scope

## 포함 범위

- Event 실행 Trigger
- AI Pipeline 실행 요청
- Pipeline Orchestration
- Editorial Issue 생성 결과 반환
- 생성된 Editorial 결과 조회
- Frontend Editorial / Email Experience 연결

## 제외 범위

아래 API는 현재 MVP 데모 범위에서는 구현하지 않는다.

- Product 조회 API
- Customer 조회 API
- Event 목록 조회 API
- 개별 Matching API
- 개별 Gatekeeper API
- 개별 Editorial Generator API
- 운영용 CMS API

필요 시 운영 환경에서 확장한다.

---

# 3. Demo User Flow

```
User
 |
 | Event 실행 버튼 클릭
 |
 ↓
Frontend
 |
 | POST /api/reasoning/start
 |
 ↓
TASK-301 API Layer
 |
 ↓
Pipeline Orchestration Service
 |
 ↓
AI Pipeline Execution

TASK-202
Customer Taste Profile

↓

TASK-203
Event Meaning Profile

↓

TASK-204
Meaning Matching

↓

TASK-205
Gatekeeper

↓

TASK-206
Issue Composition

↓

TASK-207
Editorial Generator

 |
 ↓
Editorial Result 생성
 |
 ↓
Frontend Rendering
 |
 ↓
TASK-403 Editorial Experience
 |
 ↓
TASK-404 Email Experience
```

---

# 4. Architecture Responsibility

## TASK-301 API Layer

담당:

- Frontend 요청 수신
- Request Validation
- Pipeline 실행 요청
- Orchestration Service 호출
- 결과 반환

담당하지 않음:

- Customer Taste 분석 Logic
- Event Meaning 분석 Logic
- Product Matching Logic
- Gatekeeper 판단 Logic
- Editorial 생성 Logic

---

# AI Layer Responsibility

각 TASK가 담당한다.

## TASK-202

Customer Taste Profile 생성

담당:
- 고객 구매/관심 데이터 기반 취향 분석
- Customer Profile 구조화

---

## TASK-203

Event Meaning Profile 생성

담당:
- Event 의미 분석
- Brand/Event Context 구조화

---

## TASK-204

Meaning Matching

담당:
- Customer ↔ Event Matching
- Customer ↔ Product Matching
- Meaning Bridge 생성
- Extension Result 생성

담당하지 않음:
- PASS/REJECT 판단
- Editorial 생성

---

## TASK-205

Gatekeeper

담당:
- Matching 결과 기반 Editorial 발행 가능 여부 판단
- PASS Product Pool 생성

---

## TASK-206

Issue Composition

담당:
- PASS Product Pool 기반 Editorial Issue 구성
- Event 단위 Issue 생성

---

## TASK-207

Editorial Generator

담당:
- Personal Editorial Content 생성
- 최종 Editorial 결과 생성

---

# 5. API Endpoint

## 5.1 Start Reasoning

### POST `/api/reasoning/start`

전체 Personal Editorial 생성 Pipeline 실행 API

Frontend Event 실행 버튼에서 호출한다.

---

## Request

```json
{
  "customerId": "CUSTOMER_001",
  "eventId": "EVENT_001"
}
```

---

## Processing Flow

API Route는 직접 AI Logic을 수행하지 않는다.

처리 흐름:

```
Request
 |
 ↓
TASK-301 API Route

 |
 ↓

Pipeline Orchestration Service

 |
 ↓

TASK-202~207 Service 호출

 |
 ↓

Editorial Result 생성
```

---

## Response

```json
{
  "success": true,
  "editorialId": "EDITORIAL_001",
  "status": "completed"
}
```

---

# 5.2 Editorial 조회

## GET `/api/editorials/{id}`

생성된 Personal Editorial 결과 조회 API

Frontend Editorial Experience 화면에서 사용한다.

---

## Response

```json

{
  "success": true,
  "data": {
    "editorialId": "EDITORIAL_001",
    "editorial": {
      "email_header": {},
      "editorial": {},
      "evidence": []
    }
  },
  "error": null
}

```

---

# 6. Recommended Backend Structure

MVP 기준 추천 구조:

```
src/
├── app/
│   └── api/
│       ├── reasoning/
│       │   └── start/
│       │       └── route.ts
│       │
│       └── editorials/
│           └── [id]/
│               └── route.ts
│
├── features/
│   └── editorial/
│       ├── reasoning.service.ts
│       └── editorial.service.ts
│
├── lib/
│   └── ai/
│       ├── taste-analysis.ts
│       ├── meaning-matching.ts
│       ├── gatekeeper.ts
│       ├── issue-composition.ts
│       └── editorial-generator.ts
│
└── types/
    └── api.ts
```

---

# 7. Layer Responsibility

## Route Layer

역할:

- HTTP 요청 처리
- Input Validation
- Service 호출
- Response 반환

예:

```
POST /api/reasoning/start

↓

reasoning.service.ts 호출
```

---

## Service Layer

역할:

- 전체 Pipeline 실행 순서 관리
- TASK Module 연결
- 결과 조합

예:

```
reasoning.service.ts

TASK-202 호출
 ↓
TASK-203 호출
 ↓
TASK-204 호출
 ↓
TASK-205 호출
 ↓
TASK-206 호출
 ↓
TASK-207 호출
```

---

## AI Layer

역할:

각 TASK별 실제 AI 판단 수행

예:

```
Customer Taste
Meaning Matching
Gatekeeper
Editorial Generation
```

---

# 8. MVP Demo Decision

현재 데모에서는 모든 API를 개별적으로 분리하지 않는다.

하나의 Pipeline 실행 Endpoint를 통해
사용자가 Editorial 생성 경험을 완료하는 것을 우선한다.

구현 우선순위:

1.

```
POST /api/reasoning/start
```

목적:
- Event 실행 Trigger
- 전체 AI Pipeline 실행


2.

```
GET /api/editorials/{id}
```

목적:
- Editorial 결과 제공
- TASK-403 연결


---

# 9. Future Expansion

운영 환경에서는 다음 API로 확장 가능하다.

```
GET /products

GET /customers

GET /events

POST /matching

POST /gatekeeper

POST /editorials

POST /email
```

---

# 10. Implementation Priority

## Phase 1

TASK-301 API 구현

- API Route 생성
- Pipeline Service 연결
- Editorial 결과 반환

↓

## Phase 2

Frontend 연결

- Event Landing Page
- Generate Button
- AI Persona Magazine 생성 Loading 화면

↓

## Phase 3

Existing UI 연결

- TASK-403 Editorial Experience
- TASK-404 Email Experience

---

# Summary

TASK-301은 새로운 AI 기능을 개발하는 영역이 아니다.

완성된 TASK-202~207 AI Pipeline을 하나의 사용자 경험으로 연결하는 Backend Orchestration Layer이다.

MVP에서는 최소 API만 구현하여,

```
Event 실행
 ↓
AI Pipeline 실행
 ↓
Editorial 생성
 ↓
Frontend Rendering
```

전체 Demo Experience 완성을 목표로 한다.
```

