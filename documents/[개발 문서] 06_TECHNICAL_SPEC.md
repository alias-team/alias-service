# [개발 문서] 06_TECHNICAL_SPEC

담당자: 성경 이
상태: 완료
상태 (1): 시작 전

# **06_TECHNICAL_SPEC.md**

## **MCM Personal Editorial Engine MVP 기술 설계**

## **1. Technical Overview**

MCM Personal Editorial Engine은 실제 CRM·CMS 운영 시스템이 아니라, 제품·고객·이벤트 데이터를 AI가 이해하고 **Meaningful Connection**을 생성한 뒤 Personal Editorial과 Email Experience로 보여주는 AI Experience Layer다.

MVP는 사전 생성 데이터를 중심으로 안정적인 데모 흐름을 제공한다. 선택 기능에서 OpenAI Multimodal LLM을 호출할 수 있도록 구조를 만들되, AI 호출 실패가 대표 데모를 막지 않도록 한다.

text

```
Desktop Web AppFrontend    ↓Next.js Backend / API Layer    ↓AI Processing Layer    ↓Supabase Database + Seed Data    ↓Personal Editorial JSON    ↓Email HTML Preview
```

### **전체 AI Flow**

text

```
AI Knowledge Base├── Product Intelligence├── Customer Intelligence└── Event Intelligence        ↓New Event Trigger        ↓AI Meaning Matching        ↓Meaning Bridge        ↓Editorial Gatekeeper        ↓Personal Editorial Generation        ↓Email Experience
```

---

## **2. System Architecture**

### **2.1 구조 원칙**

- Next.js 단일 애플리케이션으로 만든다.
- 별도 마이크로서비스는 만들지 않는다.
- AI 처리와 데이터 조회는 Next.js 서버 영역에서 처리한다.
- 대표 데모는 Seed Data와 사전 생성 JSON으로 항상 재현 가능해야 한다.
- 실제 AI 호출은 선택 기능과 확장 가능한 Pipeline 구조에 사용한다.
- 화면은 운영 관리가 아닌 AI 결과 검증과 고객 경험 확인에 집중한다.

### **2.2 구성 요소**

text

```
┌──────────────────────────────────────────────┐│                Frontend Layer                ││ Next.js App Router / React / TypeScript      ││                                              ││ - AI Knowledge Base Dashboard                ││ - Intelligence Detail                        ││ - Event Trigger                              ││ - AI Reasoning Journey                       ││ - Personal Editorial Preview                 ││ - Email Preview Experience                   │└──────────────────────┬───────────────────────┘                       │                       ▼┌──────────────────────────────────────────────┐│             Backend / API Layer               ││ Next.js Route Handler / Server Action         ││                                              ││ - Demo Data 조회                              ││ - Product Analysis 실행                       ││ - Taste Profile 갱신                          ││ - Meaning Matching 실행                       ││ - Gatekeeper 검증                             ││ - Editorial 생성                              ││ - Email 렌더링 데이터 제공                    │└──────────────────────┬───────────────────────┘                       │          ┌────────────┴────────────┐          ▼                         ▼┌─────────────────────┐   ┌─────────────────────┐│  AI Processing Layer │   │   Data Layer         ││                     │   │                     ││ - OpenAI 호출        │   │ - Supabase PostgreSQL││ - Prompt 구성        │   │ - Seed Data          ││ - JSON 응답 검증     │   │ - 사전 생성 JSON     ││ - Fallback 처리      │   │ - 이미지 URL         │└─────────────────────┘   └─────────────────────┘          │          ▼┌──────────────────────────────────────────────┐│              External Services                ││                                              ││ - OpenAI Multimodal LLM                       ││ - Supabase                                    ││ - Vercel                                      ││ - 선택: Resend 테스트 이메일                  │└──────────────────────────────────────────────┘
```

### 2.3 Demo Execution Mode

```
MVP는 Demo Mode와 AI Execution Mode를 분리한다.

Demo Mode:
- Seed JSON 기반
- 항상 동일한 결과 재현
- 심사 시나리오 사용

AI Execution Mode:
- OpenAI API 호출
- Test Product Analysis
- Refresh Taste Profile
- Editorial Generation 검증
```

---

## **3. 역할별 책임**

### **3.1 Frontend**

Frontend는 AI 처리 결과와 사용자 흐름을 보여주는 역할만 맡는다.

포함:

- AI Knowledge Base Dashboard 표시
- Product, Customer, Event Intelligence 상세 표시
- 이벤트 선택과 실행 시작
- AI Reasoning Journey 단계별 표시
- PASS와 REJECT 결과 표시
- Personal Editorial 미리보기
- Email Preview 렌더링
- 로딩, 오류, 빈 상태 표시

제외:

- 제품·고객·이벤트 CRUD
- 관리자 관리 화면
- 실제 CRM·CMS 화면
- AI API Key 직접 호출
- 민감 데이터 처리

---

### **3.2 Backend / API Layer**

Backend는 데이터 조회, AI 호출, 응답 검증, Gatekeeper 판단을 담당한다.

포함:

- Seed Data 또는 Supabase 데이터 조회
- OpenAI API 호출
- AI 입력 데이터 조합
- JSON Schema Validation
- Core4 Enum 검증
- 필수 Evidence 검증
- Gatekeeper 규칙 검증
- Personal Editorial JSON 반환
- AI 실패 시 사전 생성 결과 반환

제외:

- 복잡한 비동기 작업 큐
- 실시간 이벤트 스트림
- 대량 이메일 발송
- 장기 데이터 분석

---

### **3.3 AI Processing Layer**

AI Processing Layer는 각 AI Pipeline의 입력을 정리하고, 구조화된 JSON 결과를 반환한다.

포함:

- Product Understanding
- Customer Taste Discovery
- Event Meaning Analysis
- AI Meaning Matching
- Meaning Bridge 생성
- Editorial Angle 생성
- Personal Editorial Generation

원칙:

- AI 응답을 그대로 화면에 사용하지 않는다.
- 반드시 Validation을 통과한 JSON만 사용한다.
- 실패 시 오류 상태 또는 사전 생성 결과를 반환한다.
- 고객 성격을 단정하는 문장을 만들지 않는다.
- 모든 Matching 결과에는 Evidence를 포함한다.

---

### **3.4 Database / Data Layer**

MVP의 데이터 계층은 Supabase PostgreSQL 또는 로컬 Seed Data를 함께 사용한다.

포함:

- 제품 기본 정보
- Product Profile
- 고객 데모 데이터
- Customer Taste Profile
- 이벤트 기본 정보
- Event Meaning Profile
- 대표 Matching Result
- PASS / REJECT Gatekeeper Result
- Personal Editorial JSON

권장 방식:

text

```
개발 초기:로컬 JSON Seed Data 사용데모 안정화:Supabase에 Seed Data 저장선택 기능:AI 호출 결과를 임시 저장하거나 별도 결과 테이블에 기록
```

---

### **3.5 외부 서비스**

| **서비스** | **용도** | **MVP 기준** |
| --- | --- | --- |
| OpenAI | 이미지·텍스트 분석, 구조화된 AI 결과 생성 | 사용 |
| Supabase | PostgreSQL, 선택적 Storage | 사용 가능 |
| Vercel | Next.js 배포 | 사용 |
| Resend | 선택적 테스트 이메일 전달 | 선택 |
| CRM | 고객 데이터 운영 | 제외 |
| CMS | 제품·이벤트 운영 | 제외 |

---

## **4. Tech Stack**

### **4.1 Frontend**

| **기술** | **선택 이유** |
| --- | --- |
| Next.js | App Router, 서버 기능, 배포를 하나의 프로젝트에서 처리할 수 있다. |
| React | 화면을 카드·패널·미리보기 단위로 나누기 좋다. |
| TypeScript | AI 응답과 데이터 구조를 타입으로 관리해 오류를 줄인다. |
| Tailwind CSS | 짧은 기간에 Desktop Web App UI를 빠르게 만들 수 있다. |
| shadcn/ui | 카드, 버튼, 다이얼로그, 탭, 상태 배지 같은 공통 UI를 빠르게 구성한다. |

### **4.2 Backend**

| **기술** | **선택 이유** |
| --- | --- |
| Next.js Route Handler | API 서버를 별도로 만들지 않고 서버 기능을 제공할 수 있다. |
| Next.js Server Action | 간단한 폼 기반 AI 실행 요청에 사용할 수 있다. |
| Zod | AI 응답, API 입력, DB 데이터의 JSON 구조를 검증한다. |

### **4.3 Database**

| **기술** | **선택 이유** |
| --- | --- |
| Supabase PostgreSQL | 관계형 데이터와 JSON 데이터를 함께 다루기 쉽다. |
| Supabase Storage | 제품 이미지와 에디토리얼 이미지를 저장할 수 있다. |
| Seed Script | 대표 데모 시나리오를 언제든 동일하게 복원할 수 있다. |

### **4.4 AI**

| **기술** | **선택 이유** |
| --- | --- |
| OpenAI Multimodal LLM | 제품 이미지와 설명을 함께 분석할 수 있다. |
| OpenAI Text LLM | 취향 분석, 이벤트 의미 분석, Meaning Bridge, Editorial 생성에 사용한다. |
| Structured JSON Output | 화면과 후속 Pipeline이 안정적으로 결과를 사용할 수 있다. |

### **4.5 Deployment**

| **기술** | **선택 이유** |
| --- | --- |
| Vercel | Next.js 배포와 환경변수 관리가 간단하다. |
| Supabase | 별도 데이터베이스 서버 운영 없이 MVP 데이터를 관리할 수 있다. |

---

## **5. Application Structure**

text

```
src├── app│   ├── page.tsx│   ├── layout.tsx│   ├── knowledge-base│   │   ├── page.tsx│   │   ├── product│   │   │   └── [productId]│   │   │       └── page.tsx│   │   ├── customer│   │   │   └── [customerId]│   │   │       └── page.tsx│   │   └── event│   │       └── [eventId]│   │           └── page.tsx│   ││   ├── event-trigger│   │   └── page.tsx│   ││   ├── reasoning│   │   └── [runId]│   │       └── page.tsx│   ││   ├── editorial│   │   └── [editorialId]│   │       └── page.tsx│   ││   ├── email-preview│   │   └── [editorialId]│   │       └── page.tsx│   ││   └── api│       ├── products│       │   ├── route.ts│       │   └── analyze│       │       └── route.ts│       ├── customers│       │   └── refresh-taste│       │       └── route.ts│       ├── events│       │   └── route.ts│       ├── matching│       │   └── route.ts│       ├── reasoning│       │   └── [runId]│       │       └── route.ts│       ├── editorials│       │   └── route.ts│       └── email│           └── render│               └── route.ts│├── components│   ├── ui│   ├── layout│   │   ├── app-header.tsx│   │   ├── page-container.tsx│   │   └── back-navigation.tsx│   ├── knowledge-base│   │   ├── intelligence-card.tsx│   │   ├── intelligence-status-badge.tsx│   │   ├── product-profile-panel.tsx│   │   ├── customer-taste-panel.tsx│   │   ├── event-meaning-panel.tsx│   │   └── evidence-panel.tsx│   ├── reasoning│   │   ├── reasoning-step.tsx│   │   ├── reasoning-timeline.tsx│   │   ├── customer-evidence-card.tsx│   │   ├── event-evidence-card.tsx│   │   ├── meaning-bridge-card.tsx│   │   └── gatekeeper-result-card.tsx│   ├── editorial│   │   ├── editorial-hero.tsx│   │   ├── brand-story-section.tsx│   │   ├── personal-connection-section.tsx│   │   ├── product-discovery-card.tsx│   │   └── editorial-preview.tsx│   └── email│       ├── email-shell.tsx│       ├── email-editorial-template.tsx│       └── email-delivery-status.tsx│├── features│   ├── knowledge-base│   │   ├── product.service.ts│   │   ├── customer.service.ts│   │   ├── event.service.ts│   │   └── knowledge-base.repository.ts│   ├── reasoning│   │   ├── matching.service.ts│   │   ├── meaning-bridge.service.ts│   │   ├── gatekeeper.service.ts│   │   └── reasoning-run.service.ts│   ├── editorial│   │   ├── editorial.service.ts│   │   └── editorial.repository.ts│   └── email│       ├── email-renderer.service.ts│       └── test-email.service.ts│├── lib│   ├── ai│   │   ├── openai-client.ts│   │   ├── product-understanding.ts│   │   ├── customer-taste-discovery.ts│   │   ├── event-meaning-analysis.ts│   │   ├── meaning-matching.ts│   │   ├── editorial-generation.ts│   │   └── prompts│   │       ├── product-understanding.prompt.ts│   │       ├── customer-taste.prompt.ts│   │       ├── event-meaning.prompt.ts│   │       ├── matching.prompt.ts│   │       └── editorial.prompt.ts│   ├── database│   │   ├── supabase-server.ts│   │   ├── supabase-browser.ts│   │   └── seed.ts│   ├── validation│   │   ├── product-profile.schema.ts│   │   ├── customer-taste.schema.ts│   │   ├── event-meaning.schema.ts│   │   ├── matching-result.schema.ts│   │   ├── gatekeeper.schema.ts│   │   └── editorial.schema.ts│   ├── constants│   │   ├── core4.ts│   │   ├── gatekeeper.ts│   │   └── demo-scenarios.ts│   └── utils│       ├── format.ts│       └── fallback.ts│├── data│   ├── products│   │   ├── products.seed.json│   │   └── product-profiles.seed.json│   ├── customers│   │   ├── customers.seed.json│   │   └── customer-taste-profiles.seed.json│   ├── events│   │   ├── events.seed.json│   │   └── event-meaning-profiles.seed.json│   ├── reasoning│   │   ├── matching-results.seed.json│   │   └── gatekeeper-results.seed.json│   └── editorials│       └── editorials.seed.json│└── types    ├── product.ts    ├── customer.ts    ├── event.ts    ├── reasoning.ts    ├── editorial.ts    └── api.ts
```

---

## **6. 핵심 도메인 모델**

### **6.1 Product Profile**

ts

```tsx
typeCore4= {colorTone:string|null;silhouetteForm:string|null;material:string|null;monogramDensity:string|null;};typeEvidence= {source:"product_description"|"product_image"|"customer_history"|"event_data";text:string;};typeProductTrait= {name:string;reason:string;evidence:Evidence[];};typeProductProfile= {id:string;productId:string;productName:string;imageUrl:string;officialDescription:string;metadata?:Record<string,string>;core4:Core4;traits:ProductTrait[];evidence:Evidence[];source:"seed"|"ai_generated";createdAt:string;};
```

### **6.2 Customer Taste Profile**

ts

```tsx
typeCustomerTasteProfile= {id:string;customerId:string;customerLabel:string;tasteSummary:string;corePreference:Core4;aiTraits:ProductTrait[];evidenceProductIds:string[];source:"seed"|"ai_generated";createdAt:string;};
```

---

### **6.3 Event Meaning Profile**

ts

```tsx
typeEventMeaningProfile= {id:string;eventId:string;eventName:string;eventType:"collection"|"campaign"|"brand_event";campaignOverview:string;brandMessage:string;collectionConcept:string;relatedProductIds:string[];eventTheme:string;brandDirection:string;eventTraits:string[];evidence:Evidence[];source:"seed"|"ai_generated";createdAt:string;};
```

---

### **6.4 Meaning Matching Result**

ts

```tsx
typeCustomerEvidence= {summary:string;corePreferenceEvidence:string[];traitEvidence:string[];evidenceProductIds:string[];};typeProductEventEvidence= {summary:string;eventEvidence:string[];productEvidence:string[];relatedProductIds:string[];};typeMeaningBridge= {existingPreference:string;newBrandExpression:string;connectionReason:string;discoveryValue:string;};typeMatchingResult= {id:string;customerId:string;eventId:string;customerEvidence:CustomerEvidence;productEventEvidence:ProductEventEvidence;meaningBridge:MeaningBridge;candidateProductIds:string[];isValid:boolean;};
```

---

### **6.5 Editorial Gatekeeper Result**

ts

```tsx
typeGatekeeperDecision="PASS"|"REJECT";typeGatekeeperResult= {id:string;matchingResultId:string;decision:GatekeeperDecision;reason:string;editorialAngle?:string;candidateProductIds:string[];failedRules?:string[];createdAt:string;};
```

---

### **6.6 Personal Editorial**

ts

```tsx
typeProductDiscovery= {productId:string;productName:string;imageUrl:string;description:string;};typePersonalEditorial= {id:string;customerId:string;eventId:string;gatekeeperResultId:string;title:string;heroImageUrl:string;brandStory:string;personalConnection:string;productDiscovery:ProductDiscovery[];closingMessage:string;createdAt:string;};
```

---

## **7. AI Pipeline Architecture**

## **7.1 Product Understanding**

### **목적**

제품 이미지, 공식 설명, 메타데이터를 분석해 Product Profile을 만든다.

### **Input**

text

```
- Product Image- Official Description- Product Metadata
```

### **Process**

text

```
Product Image + Description + Metadata        ↓OpenAI Multimodal LLM Analysis        ↓Core4 Extraction        ↓AI Product Trait Generation        ↓Evidence Extraction        ↓Product Profile JSON Validation
```

### **Output**

text

```
Product Profile├── Core4├── AI Product Traits└── Evidence
```

### **구현 규칙**

- 제품 이미지 1장을 기본 입력으로 사용한다.
- Core4는 허용 Enum 또는 **`null`**만 반환한다.
- AI Product Trait은 2~3개만 생성한다.
- 각 Trait에 이유와 Evidence를 포함한다.
- Validation 실패 시 저장하지 않고 오류를 반환한다.
- 대표 데모 화면은 사전 생성 Product Profile을 사용한다.

---

## **7.2 Customer Taste Discovery**

### **목적**

구매·위시리스트 제품과 Product Profile을 분석해 Customer Taste Profile을 만든다.

### **Input**

text

```
- Purchase Product IDs- Wishlist Product IDs- Product Profiles
```

### **Process**

text

```
Customer Product History        +Related Product Profiles        ↓Preference Analysis        ↓Core Preference Extraction        ↓Repeated Trait Discovery        ↓Evidence Product Selection        ↓Customer Taste Profile Validation
```

### **Output**

text

```
Customer Taste Profile├── Taste Summary├── Core Preference├── AI Traits└── Evidence Products
```

### **구현 규칙**

- AI Trait은 단일 제품만으로 만들지 않는다.
- 최소 2개 제품의 반복 패턴 또는 의미 연결을 근거로 한다.
- 실제 CRM 데이터는 사용하지 않는다.
- 데모 고객의 Profile은 사전 생성 JSON을 기본값으로 사용한다.
- Refresh Taste Profile 기능은 선택 제품만 추가하는 데모 수준으로 만든다.

---

## **7.3 Event Meaning Analysis**

### **목적**

새 컬렉션, 캠페인, 브랜드 이벤트의 의미를 Event Meaning Profile로 구조화한다.

### **Input**

text

```
- Event Data- Brand Message- Collection Concept- Related Products
```

### **Process**

text

```
Event Data        +Brand Message        +Collection Concept        +Related Product Profiles        ↓LLM Meaning Analysis        ↓Event Theme Extraction        ↓Brand Direction Extraction        ↓Event Trait Generation        ↓Event Meaning Profile Validation
```

### **Output**

text

```
Event Meaning Profile├── Event Theme├── Brand Direction├── Event Traits└── Evidence
```

### **구현 규칙**

- 이 단계에서는 고객 관련성이나 발행 여부를 판단하지 않는다.
- Event Meaning Profile은 사전 생성 데이터로 제공한다.
- 실제 CMS, 캠페인 시스템, 이벤트 자동 감지는 제외한다.

---

## **7.4 AI Meaning Matching**

### **목적**

고객 취향과 새 브랜드 변화 사이의 근거 기반 연결을 만든다.

### **Input**

text

```
- Customer Taste Profile- Event Meaning Profile- Related Product Profiles
```

### **Process**

text

```
Customer Taste Profile        +Event Meaning Profile        +Product Profiles        ↓Customer Evidence 생성        ↓Product/Event Evidence 생성        ↓Meaning Bridge 생성        ↓Candidate Product Selection        ↓Matching Result Validation
```

### **Output**

text

```
Matching Result├── Customer Evidence├── Product/Event Evidence├── Meaning Bridge└── Candidate Product IDs
```

### **구현 규칙**

- 단순 색상, 카테고리, 키워드 일치만으로 연결하지 않는다.
- 고객 근거와 제품·이벤트 근거가 모두 있어야 한다.
- Meaning Bridge는 기존 취향과 새로운 표현의 차이를 설명해야 한다.
- 후보 제품은 이벤트당 1~3개로 제한한다.
- 결과가 불완전하면 Gatekeeper에서 REJECT 처리할 수 있도록 반환한다.

---

## **7.5 Meaning Bridge**

### **목적**

고객의 과거 선택과 새 브랜드 표현의 연결 이유를 만든다.

### **Input**

text

```
- Customer Evidence- Product/Event Evidence
```

### **Output**

text

```
Meaning Bridge├── Existing Customer Preference├── New Brand Expression├── Connection Reason└── Discovery Value
```

### **생성 규칙**

- 고객의 성격이나 라이프스타일을 단정하지 않는다.
- 실제 선택 제품과 Product Profile을 근거로 사용한다.
- 이벤트의 브랜드 메시지 또는 제품 특성을 근거로 사용한다.
- 연결 이유와 새로운 발견 가치를 분리해 반환한다.
- 근거가 부족하면 빈 문장을 만들지 않고 Validation 실패로 처리한다.

---

## **7.6 Editorial Gatekeeper**

### **목적**

Meaningful Extension이 있는 후보만 Personal Editorial 생성 대상으로 통과시킨다.

### **Input**

text

```
- Customer Evidence- Product/Event Evidence- Meaning Bridge- Candidate Product IDs
```

### **Gatekeeper 규칙**

text

```
PASS 조건1. Customer Evidence가 존재한다.2. Product/Event Evidence가 존재한다.3. Meaning Bridge가 존재한다.4. 새로운 브랜드 표현 또는 발견 가치가 존재한다.5. 필수 ID와 JSON 구조가 유효하다.REJECT 조건1. 고객 취향의 단순 반복이다.2. Evidence가 누락됐다.3. Meaning Bridge가 없다.4. 새로운 발견 가치가 없다.5. 필수 필드 또는 Enum이 유효하지 않다.
```

### **처리 방식**

text

```
1차: 코드 기반 필수 필드 검증        ↓2차: 명시적 Gatekeeper 규칙 평가        ↓3차: 필요 시 LLM이 Editorial Angle 생성        ↓PASS 또는 REJECT 반환
```

### **Output**

text

```
Editorial Candidate├── Decision├── Reason├── Editorial Angle└── Candidate Product IDs
```

---

## **7.7 Personal Editorial Generation**

### **목적**

PASS 후보와 Meaning Bridge를 고객용 콘텐츠로 변환한다.

### **Input**

text

```
- PASS Candidate- Customer Taste Profile- Event Meaning Profile- Product Profiles- Meaning Bridge
```

### **Process**

text

```
PASS Candidate        +Meaning Bridge        +Customer / Event / Product Context        ↓Editorial Prompt 생성        ↓OpenAI Text LLM        ↓Personal Editorial JSON        ↓Editorial JSON Validation
```

### **Output**

text

```
Personal Editorial├── MY MCM ISSUE├── Brand Story├── Personal Connection├── Product Discovery└── Closing Message
```

### **생성 규칙**

- PASS 결과에 대해서만 실행한다.
- 할인, 구매 압박, 일반 추천 문구를 제외한다.
- Brand Story, Personal Connection, Product Discovery가 하나의 흐름으로 이어져야 한다.
- 고객 성격을 단정하지 않는다.
- Product Discovery는 최대 3개 제품까지만 보여준다.
- Validation 실패 시 사전 생성 Editorial을 Fallback으로 사용할 수 있다.

---

## **8. Data Flow**

text

```
Product Data        ↓Product Understanding        ↓Product Profile        ↓Customer Purchase / Wishlist Data        +Product Profile        ↓Customer Taste Discovery        ↓Customer Taste ProfileEvent Data        ↓Event Meaning Analysis        ↓Event Meaning ProfileCustomer Taste Profile        +Event Meaning Profile        +Related Product Profiles        ↓AI Meaning Matching        ↓Customer Evidence        +Product/Event Evidence        ↓Meaning Bridge        ↓Editorial Gatekeeper        ↓PASS        ↓Personal Editorial Generation        ↓Personal Editorial JSON        ↓Email HTML Rendering        ↓Customer Email Experience
```

### **MVP 데이터 처리 기준**

text

```
기본 데모:Seed Data / 사전 생성 JSON 사용선택 AI 기능:OpenAI 호출        ↓Validation        ↓임시 결과 표시 또는 저장AI 실패:사전 생성 결과 반환또는 오류 상태 표시
```

---

## **9. API / Service Layer Structure**

상세 REST API 계약보다 서비스 책임을 우선한다.

### **9.1 Product Service**

text

```
책임- Product 목록 조회- Product Profile 조회- Product Analysis 실행- Product Profile Validation
```

주요 함수 예시:

ts

```tsx
getProducts():Promise<Product[]>getProductProfile(productId: string):Promise<ProductProfile>analyzeProduct(input: ProductAnalysisInput):Promise<ProductProfile>
```

---

### **9.2 Customer Service**

text

```
책임- 데모 고객 조회- Customer Taste Profile 조회- 선택 제품 기반 Taste Profile 갱신
```

주요 함수 예시:

ts

```tsx
getCustomers():Promise<Customer[]>getCustomerTasteProfile(customerId: string):Promise<CustomerTasteProfile>refreshTasteProfile(  customerId: string,  additionalProductIds: string[]):Promise<CustomerTasteProfile>
```

---

### **9.3 Event Service**

text

```
책임- 데모 이벤트 조회- Event Meaning Profile 조회- 이벤트 선택 상태 생성
```

주요 함수 예시:

ts

```tsx
getEvents():Promise<Event[]>getEventMeaningProfile(eventId: string):Promise<EventMeaningProfile>
```

---

### **9.4 Matching Service**

text

```
책임- AI Meaning Matching 실행- Customer Evidence 생성- Product/Event Evidence 생성- Meaning Bridge 생성- Matching Result Validation
```

주요 함수 예시:

ts

```tsx
runMeaningMatching(input: {  customerId: string;  eventId: string;}):Promise<MatchingResult>;
```

---

### **9.5 Gatekeeper Service**

text

```
책임- 필수 데이터 검증- Meaningful Extension 규칙 평가- PASS 또는 REJECT 결정- Editorial Angle 생성
```

주요 함수 예시:

ts

```tsx
evaluateEditorialCandidate(  matchingResult: MatchingResult):Promise<GatekeeperResult>;
```

---

### **9.6 Editorial Service**

text

```
책임- PASS Candidate 기반 Editorial 생성- Personal Editorial JSON Validation- 사전 생성 Editorial Fallback 제공
```

주요 함수 예시:

ts

```tsx
generateEditorial(input: {  gatekeeperResultId: string;}):Promise<PersonalEditorial>;
```

---

### **9.7 Email Service**

text

```
책임- Personal Editorial JSON을 Email View Model로 변환- HTML Email Preview 렌더링- 선택적 테스트 이메일 전달
```

주요 함수 예시:

ts

```tsx
getEmailPreview(editorialId: string):Promise<PersonalEditorial>renderEmailHtml(editorial: PersonalEditorial): stringsendTestEmail?(editorialId:string,recipient:string):Promise<void>
```

---

## **10. AI Response Validation**

AI 응답은 MVP 안정성을 위해 반드시 검증한다.

### **10.1 Validation 순서**

text

```
OpenAI Response        ↓JSON Parsing        ↓Zod Schema Validation        ↓Required Field Check        ↓Enum Validation        ↓Evidence Check        ↓정상 결과 또는 Fallback 반환
```

---

### **10.2 JSON Schema Validation**

모든 AI 결과는 각 도메인 Schema를 통과해야 한다.

대상:

- Product Profile
- Customer Taste Profile
- Event Meaning Profile
- Matching Result
- Gatekeeper Result
- Personal Editorial

예시:

ts

```tsx
constProductProfileSchema= z.object({  productId: z.string().min(1),  productName: z.string().min(1),  core4: z.object({    colorTone: z.string().nullable(),    silhouetteForm: z.string().nullable(),    material: z.string().nullable(),    monogramDensity: z.string().nullable(),  }),  traits: z.array(    z.object({      name: z.string().min(1),      reason: z.string().min(1),      evidence: z.array(        z.object({          source: z.string(),          text: z.string().min(1),        })      ).min(1),    })  ).min(2).max(3),});
```

---

### **10.3 Required Field Check**

필수 필드가 없으면 결과를 저장하거나 화면에 사용하지 않는다.

| **결과** | **필수 필드** |
| --- | --- |
| Product Profile | Product ID, Core4, Traits, Evidence |
| Customer Taste Profile | Customer ID, Taste Summary, Evidence Product IDs |
| Event Meaning Profile | Event ID, Event Theme, Brand Direction |
| Matching Result | Customer Evidence, Product/Event Evidence, Meaning Bridge |
| Gatekeeper Result | Decision, Reason, Candidate Product IDs |
| Personal Editorial | Title, Brand Story, Personal Connection, Product Discovery |

---

### **10.4 Enum Validation**

Core4에는 허용된 값만 저장한다.

예시:

ts

```tsx
constMonogramDensity= ["none","low","medium","high",]asconst;
```

원칙:

- 알 수 없는 값은 **`null`**로 처리하거나 Validation 실패로 처리한다.
- 화면에서는 허용된 값 또는 **`정보 없음`**만 표시한다.
- AI가 새로운 Enum을 임의로 만들지 못하도록 Prompt와 Schema를 함께 사용한다.

---

### **10.5 Evidence 검증**

모든 AI 판단에는 근거가 있어야 한다.

검증 기준:

text

```
Product Profile- 각 Trait에 제품 이미지 또는 공식 설명 근거가 있어야 한다.Customer Taste Profile- 각 취향 항목에 Evidence Product ID가 있어야 한다.Event Meaning Profile- 이벤트 주제와 브랜드 방향에 Event Data 근거가 있어야 한다.Matching Result- Customer Evidence가 있어야 한다.- Product/Event Evidence가 있어야 한다.- Meaning Bridge가 있어야 한다.Gatekeeper PASS- 고객 근거, 제품·이벤트 근거, 새로운 발견 가치가 모두 있어야 한다.
```

---

### **10.6 Fallback 처리**

대표 데모는 AI 호출 실패에도 동작해야 한다.

text

```
AI 호출 성공        ↓Validation 성공        ↓실시간 AI 결과 사용AI 호출 실패 또는 Validation 실패        ↓대표 시나리오인지 확인        ↓사전 생성 JSON 반환사전 생성 결과도 없는 경우        ↓오류 상태와 재시도 안내 표시
```

Fallback 대상:

- Product Profile
- Customer Taste Profile
- Event Meaning Profile
- Matching Result
- Gatekeeper PASS / REJECT
- Personal Editorial

---

## **11. Database Structure**

### **11.1 MVP 권장 테이블**

text

```
productsproduct_profilescustomerscustomer_product_selectionscustomer_taste_profileseventsevent_meaning_profilesreasoning_runsmatching_resultsgatekeeper_resultspersonal_editorials
```

### **11.2 최소 관계**

text

```
products    └── product_profilescustomers    └── customer_product_selections            └── productscustomers    └── customer_taste_profilesevents    └── event_meaning_profilesreasoning_runs    ├── customers    ├── events    ├── matching_results    └── gatekeeper_resultsgatekeeper_results    └── personal_editorials
```

### **11.3 단순화 원칙**

- MVP에서는 복잡한 권한 테이블을 만들지 않는다.
- 실제 고객 개인정보를 저장하지 않는다.
- 고객은 **`customerId`**, 표시 이름, 데모 선택 이력만 사용한다.
- AI 결과 중 유연한 구조는 **`jsonb`** 컬럼을 활용할 수 있다.
- 대표 시나리오 데이터는 Seed Script로 생성한다.

---

## **12. 화면과 기술 구조 연결**

| **화면** | **주요 데이터** | **주요 서비스** |
| --- | --- | --- |
| AI Knowledge Base Dashboard | Intelligence 요약, 상태 | Product / Customer / Event Service |
| Product Intelligence Detail | Product Profile, Evidence | Product Service |
| Customer Intelligence Detail | Customer Taste Profile, Evidence Products | Customer Service |
| Event Intelligence Detail | Event Meaning Profile, Evidence | Event Service |
| Event Trigger | Event 목록, 선택 상태 | Event Service |
| AI Reasoning Journey | Matching Result, Gatekeeper Result | Matching / Gatekeeper Service |
| REJECT Result | Gatekeeper REJECT Result | Gatekeeper Service |
| Personal Editorial Preview | Personal Editorial JSON | Editorial Service |
| Email Preview Experience | Personal Editorial JSON, HTML Template | Email Service |

---

## **13. Deployment Structure**

### **13.1 Local Development**

text

```
Developer Local Environment├── Next.js Development Server├── Local JSON Seed Data 또는 Supabase Dev Project├── .env.local└── OpenAI API Key
```

권장 실행 흐름:

bash

```bash
pnpminstallpnpmdevpnpmseed
```

---

### **13.2 Environment Variables**

env

```
# OpenAIOPENAI_API_KEY=# Supabase ServerSUPABASE_URL=SUPABASE_SERVICE_ROLE_KEY=# Supabase BrowserNEXT_PUBLIC_SUPABASE_URL=NEXT_PUBLIC_SUPABASE_ANON_KEY=# Optional Test EmailRESEND_API_KEY=TEST_EMAIL_RECIPIENT=# AppNEXT_PUBLIC_APP_URL=
```

원칙:

- **`OPENAI_API_KEY`**는 서버에서만 사용한다.
- **`SUPABASE_SERVICE_ROLE_KEY`**는 클라이언트에 노출하지 않는다.
- 클라이언트에서 필요한 값만 **`NEXT_PUBLIC_`** 접두사를 사용한다.
- **`.env.local`**은 저장소에 올리지 않는다.
- Vercel 환경변수에 개발·미리보기·운영 값을 분리해 등록한다.

---

### **13.3 Production Deployment**

text

```
Git Repository        ↓Vercel Git Integration        ↓Preview Deployment        ↓Production Deployment        ↓Supabase Production Project        +OpenAI API
```

배포 기준:

- **`main`** 브랜치 병합 시 Production Deployment를 실행한다.
- Pull Request마다 Preview Deployment를 생성한다.
- Seed Data는 Production에서도 재현 가능해야 한다.
- OpenAI 호출은 요청 수와 오류를 최소 수준으로 기록한다.
- 대표 Demo Flow는 외부 서비스 장애 시에도 Fallback JSON으로 동작해야 한다.

---

## **14. MVP Technical Constraints**

### **포함 범위**

text

```
- Desktop Web App- Next.js 기반 단일 애플리케이션- Seed Data- Product Intelligence- Customer Intelligence- Event Intelligence- AI Meaning Matching- Meaning Bridge- Editorial Gatekeeper- Personal Editorial Generation- Email Preview Experience- 선택적 AI Pipeline 실행- JSON Schema Validation- 사전 생성 JSON Fallback
```

### **제외 범위**

text

```
- 실제 CRM 연동- 실제 CMS 연동- 실제 주문 시스템 연동- 제품/고객/이벤트 CRUD- 실시간 데이터 Pipeline- 실시간 구매·위시리스트 추적- 실시간 이벤트 감지- 대량 이메일 발송- 이메일 마케팅 자동화- 관리자 운영 기능- 복잡한 역할·권한 관리- 다중 채널 메시지 발송- 성과 분석, A/B 테스트, 전환 추적- 마이크로서비스 구조- 작업 큐, 이벤트 스트리밍 기반 구조
```

---

## **15. 구현 순서**

### **1단계 — 프로젝트와 데이터 기반**

text

```
1. Next.js + TypeScript + Tailwind 설정2. Supabase 연결3. 도메인 Type 정의4. Zod Schema 정의5. Seed Data 작성6. Seed Script 작성
```

### **2단계 — AI Knowledge Base Experience**

text

```
1. AI Knowledge Base Dashboard2. Product Intelligence Detail3. Customer Intelligence Detail4. Event Intelligence Detail5. Evidence Panel
```

### **3단계 — 핵심 AI Flow**

text

```
1. Event Trigger2. Matching Service3. Meaning Bridge 생성4. Gatekeeper 규칙5. PASS / REJECT 화면6. AI Reasoning Journey
```

### **4단계 — 최종 고객 경험**

text

```
1. Personal Editorial JSON2. Personal Editorial Preview3. Email HTML Template4. Email Preview Experience
```

### **5단계 — 데모 강화**

text

```
1. Test Product Analysis2. Refresh Taste Profile3. Reasoning Journey Animation4. 선택적 테스트 이메일 전달
```

---

## **16. MVP 완료 기준**

기술적으로 MVP는 아래 조건을 만족해야 한다.

1. 사전 생성된 Product, Customer, Event Intelligence를 조회할 수 있다.
2. 담당자가 사전 구축 이벤트를 선택해 대표 AI Flow를 시작할 수 있다.
3. Matching Result에 Customer Evidence와 Product/Event Evidence가 함께 표시된다.
4. Meaning Bridge가 기존 취향과 새 브랜드 표현을 연결한다.
5. Gatekeeper가 PASS와 REJECT를 명확한 이유와 함께 반환한다.
6. PASS만 Personal Editorial Generation으로 이어진다.
7. Personal Editorial은 JSON 구조를 통과한다.
8. Personal Editorial이 Email Preview로 정상 렌더링된다.
9. AI 응답은 Schema, 필수 필드, Enum, Evidence 검증을 거친다.
10. AI 호출 실패 시 대표 데모는 사전 생성 JSON으로 계속 진행할 수 있다.
11. 실제 CRM·CMS, CRUD, 실시간 Pipeline, 대량 이메일 발송이 포함되지 않는다.

---

## **17. 최종 기술 방향**

text

```
단일 Next.js 애플리케이션        +Supabase Seed Data        +OpenAI 기반 선택적 AI Pipeline        +Zod 기반 응답 검증        +사전 생성 JSON Fallback        +Vercel 배포
```

> ***MCM Personal Editorial Engine MVP의 기술 목표는 운영 시스템을 확장하는 것이 아니라, AI가 제품·고객·이벤트의 의미를 근거 기반으로 연결하고, 그 결과를 Personal Editorial과 Email Experience로 안정적으로 보여주는 End-to-End Experience를 빠르게 만드는 것이다.***
> 

### 프로젝트 정보

프로젝트의 목표와 맥락에 대한 개요를 제공합니다.

### 액션 아이템

- [ ]  

### 문서

[https://app.notion.com](https://app.notion.com)