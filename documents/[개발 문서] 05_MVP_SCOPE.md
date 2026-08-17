# [개발 문서]05_MVP_SCOPE

담당자: 성경 이
상태: 완료
상태 (1): 시작 전
시작일: 08/16/2026
종료일: 08/16/2026
우선순위: 보통
팀: PM
메모: 매니페스트에 이거 넣고 PRD 요청

### version 01 << manyfast 만드는 초기 문서용

# MVP Scope

## 목적

MCM Personal Editorial Engine의 핵심 가치는

> **고객 취향과 MCM의 새로운 변화를 AI가 연결하여, 의미 있는 Personal Editorial 경험을 생성하는 것**
> 

MVP에서는 실제 MCM 운영 시스템(CRM, CMS 등)을 구축하는 것이 아니라,

**AI가 제품·고객·이벤트를 이해하는 Intelligence Layer를 구축하고, 새로운 브랜드 변화가 발생했을 때 의미 있는 연결을 찾아 Personal Editorial로 전달하는 End-to-End Experience 검증**에 집중한다.

---

# MVP Core Experience

MVP의 핵심 흐름:

```
AI Knowledge Base 구축

(Product Intelligence)
        ↓
(Customer Intelligence)
        ↓
(Event Intelligence)

        ↓

New MCM Event Trigger

        ↓

AI Meaning Matching

        ↓

Editorial Gatekeeper

        ↓

Personal Editorial Generation

        ↓

Email Editorial Experience
```

---

# 1. AI Knowledge Base

## 목적

MCM Personal Editorial Engine이 고객에게 의미 있는 Editorial을 생성하기 위해 필요한 제품·고객·이벤트 이해 데이터를 구축한다.

MVP에서는 실제 MCM 내부 시스템과 연동하지 않고, 사전 구축된 데이터를 기반으로 AI Knowledge Base를 구성한다.

구성:

```
AI Knowledge Base

├── Product Intelligence
├── Customer Intelligence
└── Event Intelligence
```

---

# 2. Product Intelligence

## Product Understanding AI

## 목적

제품 이미지와 공식 정보를 기반으로 AI가 제품의 디자인 요소와 의미적 특징을 분석하고 Product Profile을 생성한다.

Product Profile은 이후:

- Customer Taste Discovery
- AI Meaning Matching
- Personal Editorial Generation

의 기반 데이터로 활용된다.

---

## Product Understanding Flow

```
Product Image

+

Product Description

+

Product Metadata

        ↓

Multimodal LLM
(Vision + Text Analysis)

        ↓

Feature Extraction

        ↓

Core4 Classification

        ↓

AI Product Trait Generation

        ↓

Product Profile 저장
```

---

# Product Profile

제품의 구조화된 특징과 의미적 표현을 함께 저장한다.

---

## Core4

제품 비교 및 AI Matching 기준으로 활용하는 구조화된 속성.

구성:

```
Core4

├── Color / Tone
├── Silhouette / Form
├── Material
└── Monogram Density
```

---

## AI Product Trait

Core4만으로 설명하기 어려운 제품의 디자인 방향과 의미적 특징.

예:

```
Quiet Luxury

Modern Heritage

Urban Functionality
```

---

## Product Profile Data

```
Product Profile

├── Product Information
├── Product Image
├── Official Description
├── Core4
├── AI Product Trait
└── Evidence
```

---

## MVP 구현 방식

MVP에서는 Multimodal LLM 기반 Product Understanding Pipeline을 구현한다.

다만 데모에서는 안정적인 실행을 위해 사전에 분석 완료된 Product Profile을 Knowledge Base에 저장하여 활용한다.

데모 화면에서는:

- Product Profile
- Core4
- AI Product Trait
- 분석 근거

를 확인할 수 있다.

---

## Optional Feature

신규 제품 분석 테스트 기능 제공.

Flow:

```
Product Image 입력

+

Description 입력

        ↓

Multimodal LLM Analysis

        ↓

Product Profile 생성

        ↓

Knowledge Base 추가
```

목적:

AI Product Understanding 기능 검증.

---

# 3. Customer Intelligence

## Customer Taste Discovery AI

## 목적

고객의 구매 및 관심 데이터를 기반으로 AI가 고객 취향 구조를 발견하고 Customer Taste Profile을 생성한다.

---

## Customer Taste Discovery Flow

```
Customer Data

(Purchase / Wishlist)

        ↓

Product Profile 기반 분석

        ↓

Customer Taste Profile 생성
```

---

# Customer Taste Profile

```
Customer Taste Profile

├── Taste Summary
├── Core Preference
├── AI Traits
└── Evidence Products
```

---

## Core Preference

구조화된 취향 기준.

```
Color / Tone

Silhouette / Form

Material

Monogram Density
```

---

## AI Traits

Core Preference만으로 설명하기 어려운 고객의 반복적인 취향 방향.

예:

```
Quiet Luxury

Heritage-oriented Style

Structured Form Preference
```

---

## MVP 구현 방식

- 실제 CRM 연동 없음
- 사전 구축된 Customer Data 활용
- 구매 및 Wishlist 데이터를 기반으로 Customer Taste Profile 생성

데모에서는:

- Customer Taste Profile
- Evidence Products
- AI Traits

를 확인한다.

---

## Optional Feature

Customer Taste Profile Refresh 기능 제공.

Flow:

```
Customer Selection Data

+

Product Profile

        ↓

Customer Taste Discovery AI

        ↓

Updated Taste Profile
```

---

# 4. Event Intelligence

## Event Meaning Analysis

## 목적

새로운 MCM 컬렉션 또는 브랜드 이벤트가 발생했을 때, 이벤트가 가진 브랜드 의미를 AI가 이해한다.

---

## Event Meaning Profile

저장 데이터:

```
Event Meaning Profile

├── Event Type
├── Campaign Overview
├── Brand Message
├── Collection Concept
├── Event Theme
├── Brand Direction
└── Event Traits
```

---

## Event Meaning Analysis Flow

```
Event Data

+

Brand Message

+

Collection Concept

+

Related Products

        ↓

LLM Meaning Analysis

        ↓

Event Meaning Profile 생성
```

---

## MVP 구현 방식

실제 MCM CMS 및 캠페인 시스템과 연동하지 않는다.

사전 구축된 이벤트 데이터를 기반으로 Event Intelligence를 제공한다.

---

# 5. Event Trigger Simulation

## 목적

새로운 MCM 변화가 발생했을 때 AI Editorial Engine이 실행되는 경험을 제공한다.

---

## MVP 방식

실제 운영:

```
New Collection Launch

+

Campaign Update

+

Product Release

        ↓

Automatic Event Trigger
```

---

MVP:

```
[Trigger New Event]

        ↓

AI Meaning Matching 실행

        ↓

Personal Editorial 생성
```

---

# 6. AI Meaning Matching Engine

## 목적

고객 취향과 새로운 MCM 변화 사이의 의미 있는 연결을 발견한다.

단순 상품 유사도가 아닌:

> 기존 취향이 새로운 브랜드 경험으로 확장될 수 있는가
> 

를 판단한다.

---

## Matching Flow

```
Customer Taste Profile

+

Event Meaning Profile

+

Product Profile

        ↓

Customer Evidence 생성

        ↓

Product/Event Evidence 생성

        ↓

Meaning Bridge 생성

        ↓

Meaningful Extension 판단

        ↓

Editorial Gatekeeper
```

---

# Matching Result

```
PASS

or

REJECT
```

---

## PASS 조건

- 고객 취향 근거 존재
- 제품 또는 이벤트 근거 존재
- 새로운 발견 가치 존재

---

## REJECT 조건

- 기존 취향 단순 반복
- 연결 근거 부족
- 새로운 경험 가치 부족

---

# 7. Editorial Gatekeeper

## 목적

발행 가치가 있는 연결만 Personal Editorial 생성 대상으로 선정한다.

---

## Output

```
Editorial Candidate

├── Decision
├── Reason
└── Editorial Angle
```

---

# 8. Personal Editorial Generation AI

## 목적

Gatekeeper를 통과한 연결 결과를 고객이 이해할 수 있는 Personal Editorial 콘텐츠로 변환한다.

---

## Input

```
PASS Issue Candidate

+

Customer Taste Profile

+

Event Meaning Profile

+

Product Profile
```

---

## Output

```
Personal Editorial

├── Editorial Title
├── Brand/Event Story
├── Personal Connection
├── Product Discovery
└── Closing Message
```

---

## MVP 구현 방식

LLM 기반 Editorial Generation 구현.

생성 결과는 Email Template에 연결 가능한 JSON 형태로 관리한다.

---

# 9. Email Editorial Experience

## 목적

생성된 Personal Editorial을 고객이 실제 경험하는 형태로 전달한다.

---

## Flow

```
Personal Editorial JSON

        ↓

Email Template Binding

        ↓

HTML Rendering

        ↓

Customer Email Experience
```

---

## MVP 구현 범위

포함:

- Email Preview
- HTML Email Rendering
- 테스트 이메일 전달

제외:

- 실제 고객 대상 대량 발송
- 이메일 마케팅 자동화
- 성과 분석

---

# 10. Excluded Features

MVP에서는 아래 기능을 구현하지 않는다.

## 실제 MCM 시스템 연동

제외:

- 실제 CRM 연동
- 실제 CMS 연동
- 실제 주문 시스템 연동

## 운영 관리 시스템

제외:

- 고객 관리 시스템
- 제품 관리 시스템
- 이벤트 관리 시스템
- 관리자 CMS

## 실시간 Pipeline

제외:

- 실시간 구매 이벤트 처리
- 실시간 Wishlist Tracking
- 실시간 Crawling

## Multi-channel Experience

제외:

- Push Notification
- Kakao Message
- App Notification

## Advanced Analytics

제외:

- Conversion Tracking
- A/B Testing
- Engagement Analytics

---

# 11. Demo Data Strategy

MVP에서는 AI Knowledge Base를 사전 구축한다.

```
Product Data

        ↓

Product Profile

Customer Data

        ↓

Customer Taste Profile

Event Data

        ↓

Event Meaning Profile
```

---

이후:

```
New MCM Event Trigger

        ↓

AI Meaning Matching

        ↓

Personal Editorial Generation

        ↓

Email Experience
```

를 실행한다.

---

# 12. MVP Success Criteria

## Success 1

AI가 제품 이미지와 정보를 기반으로 Product Profile을 생성할 수 있다.

---

## Success 2

AI가 고객 선택 데이터를 기반으로 Customer Taste Profile을 생성할 수 있다.

---

## Success 3

AI가 새로운 MCM 이벤트의 브랜드 의미를 분석할 수 있다.

---

## Success 4

AI가 고객 취향과 이벤트·제품 사이의 Meaning Bridge를 생성할 수 있다.

---

## Success 5

Gatekeeper가 단순 반복 추천과 새로운 발견 가치를 구분할 수 있다.

---

## Success 6

PASS 결과가 Personal Editorial과 Email Experience로 연결될 수 있다.

---

# MVP 한 줄 정의

> **MCM Personal Editorial Engine MVP는 Multimodal AI와 LLM을 활용해 제품·고객·브랜드 변화를 의미 데이터로 구조화하고, AI Meaning Matching을 통해 고객에게 새로운 MCM 브랜드 경험을 제공하는 End-to-End Editorial Engine을 검증한다.**
> 

---

---

### 최종 버전

# **05_MVP_SCOPE.md**

## **MCM Personal Editorial Engine MVP 개발 범위**

## **1. 목적**

MCM Personal Editorial Engine MVP는 제품·고객·이벤트 데이터를 AI가 의미 데이터로 구조화하고, 새로운 브랜드 변화와 고객 취향 사이의 **Meaningful Connection**을 찾아 Personal Editorial과 Email Experience로 전달하는 **AI Experience Layer**를 검증한다.

이 MVP는 CRM·CMS 운영 시스템을 만드는 프로젝트가 아니다.

사전 준비된 데모 데이터를 활용해 AI 판단 흐름과 최종 고객 경험을 빠르게 검증하는 데 집중한다.

---

## **2. 개발 전제**

| **항목** | **기준** |
| --- | --- |
| 개발 인력 | 2명 |
| 개발 기간 | 짧은 MVP 개발 기간 |
| 개발 방식 | Codex / Claude Code 기반 바이브코딩 |
| 서비스 형태 | Desktop Web App |
| 데이터 전략 | 사전 생성 데이터 우선, 일부 AI 분석 실시간 실행 |
| 핵심 검증 | AI 의미 연결, 발행 판단, 에디토리얼·이메일 경험 |
| 제외 방향 | 운영 시스템, 대규모 자동화, 실시간 데이터 처리 |

### **개발 원칙**

1. **AI Flow를 먼저 완성한다.**
    
    화면은 AI 판단과 결과를 이해시키는 Experience Layer로 만든다.
    
2. **데모 안정성을 우선한다.**
    
    핵심 Profile은 사전 생성 데이터로 제공하고, 선택 기능에서만 AI 분석을 실행한다.
    
3. **데이터 관리 기능을 만들지 않는다.**
    
    제품·고객·이벤트 등록, 수정, 삭제 기능은 제공하지 않는다.
    
4. **한 개의 대표 시나리오를 완주한다.**
    
    이벤트 선택부터 PASS 또는 REJECT, Personal Editorial, Email Preview까지 끊기지 않아야 한다.
    

---

## **3. MVP 핵심 Flow**

text

```
AI Knowledge Base(Product Intelligence+ Customer Intelligence+ Event Intelligence)        ↓New Event Trigger        ↓AI Meaning Matching        ↓Meaning Bridge        ↓Editorial Gatekeeper        ↓Personal Editorial Generation        ↓Email Experience
```

### **대표 데모 시나리오**

text

```
사전 구축된 제품·고객·이벤트 데이터 확인        ↓새 MCM 이벤트 선택        ↓고객 취향과 이벤트·제품의 의미 연결 분석        ↓Meaning Bridge 생성        ↓Editorial Gatekeeper의 PASS 또는 REJECT 확인        ↓PASS 시 Personal Editorial 생성        ↓HTML Email Preview 확인
```

---

# **4. P0 — 반드시 구현할 범위**

P0는 MVP 데모가 성립하기 위한 최소 기능이다.

모든 P0 기능은 하나의 대표 고객, 이벤트, 제품 그룹만으로도 동작해야 한다.

---

## **4.1 AI Knowledge Base**

### **목적**

사전 구축된 Product Intelligence, Customer Intelligence, Event Intelligence를 읽기 전용으로 보여준다.

담당자는 AI가 어떤 데이터를 근거로 판단하는지 확인할 수 있어야 한다.

### **포함 범위**

- Product Intelligence 조회
- Customer Intelligence 조회
- Event Intelligence 조회
- 각 Profile의 핵심 정보와 Evidence 표시
- Intelligence 상태 표시
- 상세 화면 이동

### **제외 범위**

- 제품 등록·수정·삭제
- 고객 등록·수정·삭제
- 이벤트 등록·수정·삭제
- 실제 CRM·CMS 연동
- 데이터 권한 관리
- 운영용 검색·필터·정렬 기능

### **최소 화면 구성**

text

```
AI Knowledge Base Dashboard├── Product Intelligence Card├── Customer Intelligence Card├── Event Intelligence Card└── Intelligence 준비 상태
```

---

## **4.2 Product Intelligence**

### **목적**

제품 이미지, 공식 설명, 메타데이터를 기반으로 제품의 구조화된 특징과 의미적 특징을 보여준다.

### **입력 데이터**

text

```
Product Input├── Product ID├── Product Name├── Product Image├── Official Description└── Product Metadata
```

### **Product Profile 구조**

text

```
Product Profile├── Product Information├── Product Image├── Official Description├── Core4│   ├── Color / Tone│   ├── Silhouette / Form│   ├── Material│   └── Monogram Density├── AI Product Traits└── Evidence
```

### **구현 기준**

- 데모용 Product Profile은 사전 생성 JSON으로 제공한다.
- Product Profile 생성 Pipeline은 별도 함수 또는 API 구조로 만든다.
- 결과는 JSON 형식으로 검증한다.
- Core4는 허용된 값 또는 **`null`**만 저장한다.
- AI Product Trait은 2~3개로 제한한다.
- 각 Trait에는 근거 문장 또는 근거 필드를 포함한다.

### **최소 데이터 예시**

json

```json
{"productId":"MCM-001","name":"Stark Visetos Backpack","core4": {"colorTone":"Cognac","silhouetteForm":"Structured Backpack","material":"Visetos Coated Canvas","monogramDensity":"High"  },"traits": [    {"name":"Modern Heritage","evidence":"MCM의 상징적인 Visetos 모노그램과 구조적인 실루엣을 결합한다."    },    {"name":"Urban Functionality","evidence":"일상 이동에 적합한 백팩 형태와 수납 구조를 제공한다."    }  ]}
```

---

## **4.3 Customer Intelligence**

### **목적**

고객의 구매·위시리스트 이력과 연결된 Product Profile을 바탕으로 Customer Taste Profile을 보여준다.

### **입력 데이터**

text

```
Customer Input├── Customer ID├── Purchase Product IDs└── Wishlist Product IDs
```

### **Customer Taste Profile 구조**

text

```
Customer Taste Profile├── Customer Summary├── Taste Summary├── Core Preference│   ├── Color / Tone│   ├── Silhouette / Form│   ├── Material│   └── Monogram Density├── AI Traits└── Evidence Products
```

### **구현 기준**

- 데모 고객 1~3명을 사전 정의한다.
- 고객별 구매 또는 위시리스트 제품을 사전 정의한다.
- Customer Taste Profile은 사전 생성 데이터로 제공한다.
- 프로필 생성 함수는 Product Profile 배열을 입력받는 구조로 만든다.
- AI Trait은 단일 제품이 아닌 복수 제품의 반복 패턴 또는 의미 연결을 근거로 한다.

### **제외 범위**

- 실제 고객 개인정보
- 실제 CRM 데이터 조회
- 실시간 구매 이력 반영
- 고객 세그먼트 관리
- 고객 프로필 편집

---

## **4.4 Event Intelligence**

### **목적**

새 컬렉션, 캠페인 또는 브랜드 이벤트가 가진 브랜드 의미를 구조화해 보여준다.

### **Event Meaning Profile 구조**

text

```
Event Meaning Profile├── Event ID├── Event Type├── Campaign Overview├── Brand Message├── Collection Concept├── Related Product IDs├── Event Theme├── Brand Direction├── Event Traits└── Evidence
```

### **구현 기준**

- 데모 이벤트 1~3개를 사전 정의한다.
- 이벤트별 Event Meaning Profile은 사전 생성 데이터로 제공한다.
- 이벤트 분석 함수는 이벤트 설명, 브랜드 메시지, 컬렉션 콘셉트, 관련 제품을 입력받는다.
- 이벤트 분석 결과는 고객 관련성이나 발행 여부를 판단하지 않는다.

### **제외 범위**

- 실제 CMS 연동
- 실시간 컬렉션 출시 감지
- 이벤트 관리 화면
- 캠페인 등록·수정·삭제

---

## **4.5 New Event Trigger**

### **목적**

담당자가 사전 구축된 이벤트를 선택해 AI Editorial Engine의 검증 흐름을 시작한다.

### **사용자 Flow**

text

```
Event Intelligence 확인        ↓Trigger New Event 선택        ↓사전 구축 이벤트 선택        ↓AI Meaning Matching 실행
```

### **구현 기준**

- 실제 자동 이벤트 감지 대신 이벤트 선택 UI를 제공한다.
- 이벤트를 선택하면 AI Reasoning Journey로 이동한다.
- 선택된 이벤트 ID를 이후 모든 단계의 기준값으로 사용한다.
- 실행 중 상태를 짧게 보여주되, 장시간 비동기 처리 구조는 필수가 아니다.

---

## **4.6 AI Meaning Matching**

### **목적**

Customer Taste Profile, Event Meaning Profile, 관련 Product Profile을 비교해 고객과 새로운 브랜드 변화 사이의 근거 기반 연결을 생성한다.

### **입력**

text

```
AI Meaning Matching Input├── Customer Taste Profile├── Event Meaning Profile└── Related Product Profiles
```

### **처리 Flow**

text

```
Customer Taste Profile        +Event Meaning Profile        +Related Product Profiles        ↓Customer Evidence 생성        ↓Product/Event Evidence 생성        ↓Meaning Bridge 생성        ↓Editorial Gatekeeper 입력 생성
```

### **출력 구조**

text

```
Matching Result├── Customer Evidence├── Product/Event Evidence├── Meaning Bridge├── Candidate Product IDs└── Validation Result
```

### **Customer Evidence**

고객의 기존 선택에서 확인되는 취향 근거다.

text

```
Customer Evidence├── Taste Summary├── Related Core Preference├── Related AI Traits└── Evidence Products
```

### **Product/Event Evidence**

새 이벤트 또는 관련 제품이 제공하는 새로운 브랜드 표현의 근거다.

text

```
Product/Event Evidence├── Event Theme├── Brand Direction├── Product Core4├── Product Traits└── Evidence
```

### **구현 기준**

- P0에서는 이벤트당 후보 제품 1~3개만 분석한다.
- 매칭 결과는 반드시 고객 근거, 제품·이벤트 근거, 연결 문장을 포함한다.
- 단순 색상 또는 카테고리 일치만으로 연결을 확정하지 않는다.
- 결과는 JSON 형식으로 반환하고 화면은 해당 JSON을 읽기 전용으로 표시한다.

---

## **4.7 Meaning Bridge**

### **목적**

고객의 기존 취향과 새로운 MCM 브랜드 표현 사이의 연결 이유를 한 문장 또는 짧은 문단으로 생성한다.

### **구조**

text

```
Meaning Bridge├── Existing Customer Preference├── New Brand Expression├── Connection Reason└── Discovery Value
```

### **예시**

text

```
기존 고객은 구조적인 형태와 MCM 헤리티지가 드러나는 제품을 반복적으로 선택했다.새 컬렉션은 이러한 취향을 유지하면서도 더 가볍고 도시적인 이동 경험으로 확장한다.따라서 이 제품은 반복 추천이 아니라 고객 취향의 새로운 브랜드 발견으로 제안할 수 있다.
```

### **구현 기준**

- Meaning Bridge는 Gatekeeper와 Personal Editorial의 공통 입력으로 사용한다.
- 근거 없는 성격 단정 표현을 사용하지 않는다.
- 고객 데이터, 이벤트 데이터, 제품 데이터 중 최소 2개 이상의 근거를 참조한다.
- 화면에는 고객 근거와 제품·이벤트 근거를 함께 보여준다.

---

## **4.8 Editorial Gatekeeper**

### **목적**

단순 반복 추천을 차단하고, 새로운 발견 가치가 있는 후보만 Personal Editorial 생성 대상으로 통과시킨다.

### **입력**

text

```
Gatekeeper Input├── Customer Evidence├── Product/Event Evidence├── Meaning Bridge└── Validation Result
```

### **출력**

text

```
Editorial Candidate├── Decision: PASS | REJECT├── Reason├── Editorial Angle└── Candidate Product IDs
```

### **PASS 조건**

- 고객 취향 근거가 있다.
- 제품 또는 이벤트 근거가 있다.
- 기존 취향과 다른 새로운 브랜드 표현이 있다.
- Meaning Bridge가 두 근거를 자연스럽게 연결한다.
- 필수 데이터 형식이 유효하다.

### **REJECT 조건**

- 기존 취향의 단순 반복이다.
- 고객 근거 또는 제품·이벤트 근거가 부족하다.
- 새로운 발견 가치가 없다.
- Meaning Bridge가 생성되지 않았거나 근거가 없다.
- 필수 필드나 JSON 형식이 유효하지 않다.

### **구현 기준**

- P0에서는 명시적 규칙 기반 검증과 LLM 판단을 함께 사용한다.
- 필수 필드 검증은 코드로 처리한다.
- Editorial Angle 생성은 LLM 또는 사전 준비된 결과를 활용한다.
- PASS와 REJECT 모두 데모 가능한 결과를 준비한다.
- REJECT 결과에서는 Personal Editorial과 Email Experience로 이동하지 않는다.

---

## **4.9 Personal Editorial Generation**

### **목적**

PASS된 후보를 고객이 이해할 수 있는 브랜드 콘텐츠로 변환한다.

### **입력**

text

```
Personal Editorial Input├── PASS Editorial Candidate├── Customer Taste Profile├── Event Meaning Profile├── Selected Product Profiles└── Meaning Bridge
```

### **출력 구조**

text

```
Personal Editorial├── Editorial Title├── Brand Story├── Personal Connection├── Product Discovery├── Closing Message└── Hero Image URL
```

### **콘텐츠 규칙**

- 고객 성격을 단정하지 않는다.
- 고객의 실제 선택과 검증된 연결을 중심으로 작성한다.
- 브랜드 스토리, 개인 연결, 제품 발견이 하나의 흐름으로 이어져야 한다.
- 일반적인 할인 문구나 단순 상품 추천 문구는 제외한다.
- PASS 후보에 대해서만 생성한다.

### **구현 기준**

- 결과는 이메일 템플릿에 바로 연결할 수 있는 JSON으로 생성한다.
- P0에서는 대표 이벤트와 고객 조합 1~2개에 대한 사전 생성 Editorial을 준비한다.
- 실시간 생성 기능은 API 또는 함수 구조로 유지한다.
- 생성 실패 시 사전 준비된 데모 Editorial을 보여주는 방식은 허용한다.

---

## **4.10 Email Preview Experience**

### **목적**

생성된 Personal Editorial이 고객에게 전달되는 HTML 이메일 경험을 보여준다.

### **화면 구성**

text

```
Customer Email Experience├── Hero Image├── MY MCM ISSUE├── Brand Story├── Personal Connection├── Product Discovery└── Closing Message
```

### **구현 기준**

- Desktop Web App 안에서 이메일 클라이언트 형태의 Preview를 제공한다.
- Personal Editorial JSON을 HTML 템플릿에 바인딩한다.
- 이메일 미리보기 화면은 실제 고객 화면과 유사한 콘텐츠 구조를 유지한다.
- 테스트 이메일 전달은 선택 구현으로 둔다.
- 실제 고객 대상 대량 발송은 제공하지 않는다.

### **제외 범위**

- 이메일 캠페인 관리
- 이메일 예약 발송
- 수신자 목록 관리
- 오픈율·클릭률 분석
- A/B 테스트
- 다중 채널 메시지 발송

---

# **5. P1 — 데모 강화 범위**

P1은 P0가 완성된 후 데모의 설득력을 높이는 기능이다.

P1이 없어도 핵심 End-to-End Flow는 동작해야 한다.

---

## **5.1 Test Product Analysis**

### **목적**

제품 이미지와 설명을 입력하면 Product Understanding AI가 새로운 Product Profile을 생성하는 모습을 보여준다.

### **범위**

text

```
Product Image Upload        +Product Description Input        +Optional Metadata        ↓Product Understanding AI        ↓Product Profile Result
```

### **구현 기준**

- 실제 운영 제품 등록 기능이 아니다.
- 분석 결과를 영구 저장하지 않아도 된다.
- 제품 이미지 1장과 텍스트 설명만 지원한다.
- 결과는 Core4, AI Product Trait, Evidence로 표시한다.
- 분석 실패 시 오류 안내와 재시도만 제공한다.

---

## **5.2 Refresh Taste Profile**

### **목적**

데모 고객의 선택 제품을 추가했을 때 Customer Taste Profile이 어떻게 달라지는지 보여준다.

### **범위**

text

```
Demo Customer 선택        +추가 제품 선택        ↓Customer Taste Discovery AI        ↓Updated Customer Taste Profile
```

### **구현 기준**

- 실제 고객 데이터 변경 기능이 아니다.
- 사전 정의된 제품 목록에서만 추가할 수 있다.
- 갱신 전후 Taste Summary와 Evidence Products를 비교해 보여준다.
- 결과를 영구 저장하지 않아도 된다.

---

## **5.3 AI Reasoning Journey Animation**

### **목적**

AI Engine의 판단 순서를 직관적으로 보여준다.

### **범위**

text

```
Event Meaning        ↓Customer Evidence        ↓Product/Event Evidence        ↓Meaning Bridge        ↓Editorial Gatekeeper
```

### **구현 기준**

- 실제 장시간 처리 시간을 만들 필요는 없다.
- 단계별로 0.5~1.5초 정도의 진행 상태를 보여줄 수 있다.
- 각 단계 완료 후 결과 카드가 나타나는 방식으로 구성한다.
- 네트워크 지연이나 복잡한 작업 큐는 MVP 범위에서 제외한다.

---

# **6. P2 — 확장 가능 기능**

P2는 MVP 검증 이후에 검토한다.

P0와 P1 개발 범위에 포함하지 않는다.

| **영역** | **확장 기능** |
| --- | --- |
| 데이터 연동 | 실제 CRM 연동 |
| 데이터 연동 | 실제 CMS 연동 |
| 데이터 연동 | 주문·위시리스트 시스템 연동 |
| 이벤트 | 자동 이벤트 감지 |
| 이벤트 | 새 컬렉션·캠페인 실시간 반영 |
| 이메일 | 실제 고객 대상 대량 발송 |
| 이메일 | 이메일 마케팅 자동화 |
| 분석 | 이메일 참여 분석 |
| 분석 | 구매 전환 분석 |
| 실험 | A/B 테스트 |
| 채널 | Push Notification |
| 채널 | 카카오 메시지 |
| 채널 | 앱 알림 |
| 운영 | 고객·제품·이벤트 관리 기능 |
| 운영 | 권한과 승인 워크플로우 |

---

# **7. 사전 생성 데이터 전략**

## **7.1 목적**

짧은 개발 기간과 데모 안정성을 고려해, 핵심 Profile은 사전 생성 데이터를 우선 사용한다.

다만 향후 실제 AI Pipeline으로 교체할 수 있도록 입력·출력 데이터 구조와 호출 경계는 유지한다.

---

## **7.2 사전 생성 대상**

| **데이터** | **MVP 방식** |
| --- | --- |
| Product Profile | 사전 생성 JSON 제공 |
| Customer Taste Profile | 사전 생성 JSON 제공 |
| Event Meaning Profile | 사전 생성 JSON 제공 |
| AI Meaning Matching Result | 대표 시나리오 사전 생성 결과 제공 |
| Gatekeeper PASS/REJECT | 각각 최소 1개 사례 제공 |
| Personal Editorial | PASS 사례 기준 사전 생성 결과 제공 |
| Email HTML | 템플릿 기반 렌더링 |

---

## **7.3 실제 AI 호출 대상**

| **기능** | **MVP 호출 방식** |
| --- | --- |
| Test Product Analysis | 선택적 실시간 Multimodal LLM 호출 |
| Refresh Taste Profile | 선택적 LLM 호출 또는 규칙 기반 재계산 |
| Editorial Generation | 실시간 호출 가능 구조 유지 |
| Meaning Matching | 실시간 호출 가능 구조 유지 |

### **안정성 원칙**

- AI 호출 실패 시 데모가 중단되지 않아야 한다.
- 대표 시나리오는 사전 생성 결과로 항상 재현 가능해야 한다.
- AI 응답은 화면에 직접 사용하지 않고 JSON 검증 후 사용한다.
- 필수 필드 누락 시 REJECT 또는 오류 상태로 처리한다.
- API 키와 민감 정보는 클라이언트에 노출하지 않는다.

---

# **8. 최소 기술 구조**

## **8.1 권장 구성**

text

```
Desktop Web App├── 프론트엔드│   ├── Dashboard│   ├── Intelligence Detail│   ├── Event Trigger│   ├── AI Reasoning Journey│   ├── Personal Editorial Preview│   └── Email Preview│├── API / Server Layer│   ├── 데모 데이터 조회│   ├── AI 호출 프록시│   ├── JSON 검증│   ├── Matching 실행│   ├── Gatekeeper 실행│   └── Editorial 생성│└── Demo Data Layer    ├── productProfiles.json    ├── customerTasteProfiles.json    ├── eventMeaningProfiles.json    ├── matchingResults.json    ├── gatekeeperResults.json    └── editorials.json
```

---

## **8.2 구현 경계**

### **프론트엔드 책임**

- 페이지 전환
- 카드·상세 정보 표시
- AI Reasoning Journey 시각화
- PASS·REJECT 상태 표시
- Personal Editorial 미리보기
- Email Preview 렌더링
- 로딩·오류·빈 상태 표시

### **서버 책임**

- 데모 데이터 반환
- LLM API 호출
- 입력값 검증
- AI 응답 JSON 검증
- Gatekeeper 규칙 검증
- 민감 정보 보호

### **데이터 책임**

- 대표 제품, 고객, 이벤트 데이터 준비
- Profile JSON 관리
- PASS·REJECT 사례 관리
- 이미지 URL 또는 로컬 이미지 관리

---

# **9. 핵심 데이터 계약**

## **9.1 공통 원칙**

- 모든 AI 결과는 JSON 구조를 따른다.
- 필수 필드는 코드에서 검증한다.
- 화면은 검증된 결과만 표시한다.
- 근거 없는 텍스트는 결과로 사용하지 않는다.
- 각 연결 결과는 Evidence를 포함한다.

---

## **9.2 Gatekeeper 최소 입력 계약**

json

```json
{"customerEvidence": {"summary":"고객의 기존 취향 요약","evidenceProductIds": ["MCM-001","MCM-002"]  },"productEventEvidence": {"eventId":"EVENT-001","productIds": ["MCM-003"],"summary":"새 이벤트 또는 제품의 브랜드 표현"  },"meaningBridge": {"connectionReason":"기존 취향과 새 브랜드 표현의 연결 이유","discoveryValue":"새로운 발견 가치"  }}
```

---

## **9.3 Gatekeeper 최소 출력 계약**

json

```json
{"decision":"PASS","reason":"고객의 구조적 실루엣 선호와 새 컬렉션의 도시적 기능성이 근거 기반으로 연결된다.","editorialAngle":"헤리티지 선호를 도시적 이동 경험으로 확장하는 새로운 발견","candidateProductIds": ["MCM-003"]}
```

---

## **9.4 Personal Editorial 최소 출력 계약**

json

```json
{"title":"MY MCM ISSUE","heroImageUrl":"/images/editorial-hero.jpg","brandStory":"새 컬렉션이 제시하는 브랜드 변화","personalConnection":"고객의 기존 선택과 새 표현의 연결","productDiscovery": [    {"productId":"MCM-003","name":"제품명","imageUrl":"/images/product.jpg","description":"이 제품이 제공하는 새로운 발견"    }  ],"closingMessage":"에디토리얼 마무리 메시지"}
```

---

# **10. 화면별 개발 우선순위**

| **화면** | **우선순위** | **핵심 목적** |
| --- | --- | --- |
| AI Knowledge Base Dashboard | P0 | 사전 구축 Intelligence 확인 |
| Product Intelligence Detail | P0 | Product Profile과 Evidence 확인 |
| Customer Intelligence Detail | P0 | Customer Taste Profile 확인 |
| Event Intelligence Detail | P0 | Event Meaning Profile 확인 |
| Event Trigger | P0 | 대표 이벤트 선택 및 실행 |
| AI Reasoning Journey | P0 | AI 판단 근거와 순서 확인 |
| Gatekeeper PASS/REJECT | P0 | 발행 판단 확인 |
| Personal Editorial Preview | P0 | 고객용 콘텐츠 확인 |
| Customer Email Experience | P0 | HTML 이메일 경험 확인 |
| Test Product Analysis | P1 | Product Understanding AI 데모 |
| Refresh Taste Profile | P1 | Customer Taste Discovery AI 데모 |
| Reasoning Journey Animation | P1 | AI 처리 경험 강화 |

---

# **11. 개발 Backlog 초안**

## **P0 Backlog**

1. 데모 데이터 JSON 구조 정의
2. 대표 제품·고객·이벤트 데이터 준비
3. Product Profile, Customer Taste Profile, Event Meaning Profile 데이터 작성
4. AI Knowledge Base Dashboard 만들기
5. Intelligence Detail 화면 만들기
6. Event Trigger 화면 만들기
7. AI Meaning Matching 입력·출력 구조 만들기
8. Meaning Bridge 생성 로직 만들기
9. Editorial Gatekeeper 규칙 만들기
10. PASS·REJECT 결과 화면 만들기
11. Personal Editorial JSON 구조 만들기
12. Personal Editorial Preview 만들기
13. HTML Email Preview 만들기
14. 로딩·오류·빈 상태 처리
15. 대표 PASS·REJECT 시나리오 검증

## **P1 Backlog**

1. 제품 분석 테스트 입력 화면 만들기
2. 제품 이미지·설명 기반 AI 분석 연결
3. 고객 취향 갱신 데모 만들기
4. AI Reasoning Journey 단계 애니메이션 추가
5. 테스트 이메일 전달 연결

## **P2 Backlog**

1. CRM·CMS 연동 설계
2. 실제 이벤트 감지 구조 설계
3. 이메일 자동 발송 구조 설계
4. 고객 동의와 개인정보 처리 설계
5. 성과 분석과 실험 구조 설계

---

# **12. MVP 완료 기준**

MVP는 아래 조건을 모두 만족하면 완료로 판단한다.

1. 사전 생성된 Product Intelligence, Customer Intelligence, Event Intelligence를 화면에서 확인할 수 있다.
2. 담당자가 새 이벤트를 선택해 AI Editorial Engine Flow를 시작할 수 있다.
3. AI Meaning Matching 결과에 고객 근거와 제품·이벤트 근거가 함께 표시된다.
4. Meaning Bridge가 기존 고객 취향과 새로운 브랜드 표현을 연결한다.
5. Gatekeeper가 PASS와 REJECT를 구분하고 이유를 표시한다.
6. PASS 결과만 Personal Editorial로 이어진다.
7. Personal Editorial이 Brand Story, Personal Connection, Product Discovery를 포함한다.
8. Personal Editorial이 HTML Email Preview로 렌더링된다.
9. 실제 CRM·CMS, CRUD, 실시간 Pipeline, 대량 이메일 발송 기능이 포함되지 않는다.
10. 대표 PASS 시나리오와 대표 REJECT 시나리오가 모두 재현 가능하다.

---

# **13. 최종 범위 요약**

text

```
P0:사전 구축 Intelligence→ 이벤트 선택→ AI Meaning Matching→ Meaning Bridge→ Gatekeeper PASS/REJECT→ Personal Editorial→ Email PreviewP1:제품 분석 테스트→ 고객 취향 갱신→ AI 추론 여정 애니메이션P2:실제 CRM/CMS 연동→ 자동 이벤트 감지→ 실제 이메일 마케팅 자동화
```

> ***MCM Personal Editorial Engine MVP는 운영 시스템을 만드는 프로젝트가 아니라, AI가 제품·고객·이벤트의 의미를 연결하고 고객에게 새로운 MCM 브랜드 발견을 전달할 수 있는지 검증하는 End-to-End AI Experience Layer다.***
> 

### 문서

[https://app.notion.com](https://app.notion.com)