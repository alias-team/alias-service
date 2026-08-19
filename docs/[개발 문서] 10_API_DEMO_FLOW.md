# API Demo Flow Specification

> TASK-301 Demo API 범위 및 Frontend 연결 흐름 정의 문서

---

# 1. 목적

본 문서는 MCM Personal Editorial Engine의 MVP 데모 구현을 위해,
기존 AI Pipeline(TASK-201~207)을 Frontend UI와 연결하기 위한 최소 API 범위를 정의한다.

운영 환경을 위한 전체 API 설계가 아닌,
해커톤 데모에서 고객이 Event를 선택하고 Personal Editorial Issue가 생성되는 경험을 구현하는 것을 목표로 한다.

---

# 2. Demo Scope

## 포함 범위

- Event 실행 Trigger
- AI Pipeline 실행 요청
- Editorial Issue 생성 결과 반환
- 생성된 Editorial 조회
- Email Experience 화면 연결

## 제외 범위

아래 API는 현재 MVP 데모 범위에서는 구현하지 않는다.

- Product 조회 API
- Customer 조회 API
- Event 목록 조회 API
- 개별 Matching API
- 개별 Gatekeeper API
- 개별 Editorial Generator API
- 운영용 CMS API

필요 시 이후 확장한다.

---

# 3. Demo User Flow
User
 |
 | Event 선택
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

---

# 4. API Endpoint

## 4.1 Start Reasoning

### POST `/api/reasoning/start`

전체 Personal Editorial 생성 Pipeline 실행 API

### Request

```json
{
  "customerId": "CUSTOMER_001",
  "eventId": "EVENT_001"
}
Processing
API는 입력받은 Customer와 Event를 기준으로 전체 AI Pipeline을 실행한다.
실행 순서:
Customer Data
+
Event Data

↓

Customer Taste Analysis

↓

Meaning Matching

↓

Gatekeeper Evaluation

↓

Issue Composition

↓

Editorial Generation
Response
{
  "success": true,
  "editorialId": "EDITORIAL_001",
  "status": "completed"
}
4.2 Editorial 조회
GET /api/editorials/{id}
생성된 Personal Editorial 결과 조회 API
Frontend Editorial 화면에서 사용한다.
Response
{
  "id": "EDITORIAL_001",
  "event_id": "EVENT_001",
  "issue_theme": "Heritage in Motion",
  "selected_products": [],
  "brand_connection": {},
  "evidence": []
}
5. Architecture Responsibility
API Layer (TASK-301)
담당:
Frontend 요청 수신
Pipeline 실행 Orchestration
Service Layer 호출
결과 반환
담당하지 않음:
AI 판단 Logic
Product Matching
Gatekeeper 판단
Editorial 생성 Logic
AI Layer
각 TASK가 담당한다.
TASK-202
Customer Taste

TASK-203
Event Meaning

TASK-204
Meaning Matching

TASK-205
Gatekeeper

TASK-206
Issue Composition

TASK-207
Editorial Generator
6. MVP Demo Decision
현재 데모에서는 전체 API를 분리하지 않고,
하나의 Pipeline 실행 Endpoint를 통해 사용자 경험을 완성하는 것을 우선한다.
이후 운영 환경에서는 다음 API로 확장 가능하다.
GET /products
GET /customers
GET /events

POST /matching
POST /gatekeeper
POST /editorials
POST /email
7. Implementation Priority
/api/reasoning/start
Event 실행 버튼 연결
전체 AI Pipeline Trigger

/api/editorials/{id}
Editorial 화면 데이터 제공

Frontend 연결
TASK-403 Editorial Experience
TASK-404 Email Experience

Summary
TASK-301은 새로운 AI Logic을 만드는 영역이 아니라,
완성된 AI Pipeline을 하나의 Demo Experience로 연결하는 Backend Orchestration Layer이다.
MVP에서는 최소 API만 구현하고,
추후 운영 환경에서 세부 API로 확장한다.