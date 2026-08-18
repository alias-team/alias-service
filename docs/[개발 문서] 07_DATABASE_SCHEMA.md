# [개발 문서] 07_DATABASE_SCHEMA

상태: 완료
상태 (1): 시작 전

# **07_DATABASE_SCHEMA.md**

## **MCM Personal Editorial Engine MVP 데이터베이스 설계**

## **1. Database Overview**

### **1.1 DB 역할**

이 데이터베이스는 MCM Personal Editorial Engine MVP의 데모 경험을 위한 Intelligence 데이터와 AI 결과를 저장한다.

text

```
Product Data    ↓Product Profile    ↓Customer Taste Profile    ↓Event Meaning Profile    ↓AI Meaning Matching Result    ↓Meaning Bridge    ↓Editorial Gatekeeper Result    ↓Personal Editorial    ↓Email Experience
```

DB는 실제 CRM·CMS 운영 데이터를 관리하지 않는다.

제품·고객·이벤트의 사전 생성 데이터와 AI Pipeline 결과를 저장하고, 이벤트 실행부터 이메일 미리보기까지의 대표 Demo Flow를 재현하는 것이 목적이다.

### **1.2 저장 대상**

| **영역** | **저장 데이터** |
| --- | --- |
| Product Intelligence | 제품 기본 정보, Product Profile, Core4, AI Product Traits, Evidence |
| Customer Intelligence | 데모 고객, 구매·위시리스트 선택 데이터, Customer Taste Profile |
| Event Intelligence | 이벤트 기본 정보, Event Meaning Profile |
| AI Reasoning | 실행 기록, Matching Result, Meaning Bridge, Gatekeeper 판단 |
| Editorial Experience | Personal Editorial JSON, Email Preview용 콘텐츠 |

### **1.3 MVP 데이터 전략**

- Seed Data를 우선 사용한다.
- 대표 PASS·REJECT 시나리오를 사전 생성 데이터로 제공한다.
- 선택 기능에서 생성한 일부 AI Pipeline 결과는 DB에 저장할 수 있다.
- 실제 CRM 연동은 포함하지 않는다.
- 실제 CMS 연동은 포함하지 않는다.
- 실제 고객 개인정보를 저장하지 않는다.
- 고객은 데모용 식별자와 표시 이름만 저장한다.
- AI 호출 또는 JSON 검증 실패 시 사전 생성 결과를 Fallback으로 사용할 수 있다.

---

## **2. ERD / Entity Relationship**

text

```
products    └── product_profilescustomers    └── customer_product_selections            └── productscustomers    └── customer_taste_profilesevents    └── event_meaning_profilesreasoning_runs    ├── customers    ├── events    ├── matching_results    └── gatekeeper_results            └── personal_editorialsmatching_results    ├── customer_taste_profiles    ├── event_meaning_profiles    └── gatekeeper_results
```

### **관계 요약**

| **부모 테이블** | **자식 테이블** | **관계** | **설명** |
| --- | --- | --- | --- |
| products | product_profiles | 1:1 또는 1:N | 제품별 현재 Profile 1개를 기본으로 사용하며, AI 재분석 결과를 추가 저장할 수 있다. |
| customers | customer_product_selections | 1:N | 데모 고객은 여러 구매·위시리스트 선택 데이터를 가질 수 있다. |
| products | customer_product_selections | 1:N | 하나의 제품은 여러 고객의 선택 근거가 될 수 있다. |
| customers | customer_taste_profiles | 1:N | 고객별 초기 Profile과 선택적 갱신 결과를 저장할 수 있다. |
| events | event_meaning_profiles | 1:1 또는 1:N | 이벤트별 현재 Meaning Profile 1개를 기본으로 사용한다. |
| customers | reasoning_runs | 1:N | 한 고객에 대해 여러 이벤트 실행을 기록할 수 있다. |
| events | reasoning_runs | 1:N | 하나의 이벤트는 여러 고객 대상으로 실행될 수 있다. |
| reasoning_runs | matching_results | 1:1 | 한 번의 MVP 실행은 하나의 대표 Matching Result를 생성한다. |
| matching_results | gatekeeper_results | 1:1 | 매칭 결과는 하나의 PASS 또는 REJECT 판단으로 이어진다. |
| gatekeeper_results | personal_editorials | 1:0..1 | PASS 결과만 Personal Editorial을 생성할 수 있다. |

---

## **3. 공통 타입과 Enum**

Supabase PostgreSQL에서는 아래 Enum을 먼저 생성한다.

sql

```sql
createtypeevent_typeas enum ('collection','campaign','brand_event');createtypeselection_typeas enum ('purchase','wishlist');createtypegatekeeper_decisionas enum ('PASS','REJECT');createtypedata_sourceas enum ('seed','ai_generated');createtypereasoning_run_statusas enum ('pending','processing','completed','failed');
```

### **Enum 기준**

| **Enum** | **값** | **용도** |
| --- | --- | --- |
| event_type | collection, campaign, brand_event | 이벤트 유형 |
| selection_type | purchase, wishlist | 고객의 제품 선택 유형 |
| gatekeeper_decision | PASS, REJECT | 에디토리얼 발행 판단 |
| data_source | seed, ai_generated | Seed Data 또는 AI 생성 결과 구분 |
| reasoning_run_status | pending, processing, completed, failed | AI Editorial Engine 실행 상태 |

---

# **4. Table Schema 상세**

## **4.1 products**

### **Purpose**

제품의 기본 정보를 저장한다.

실제 상품 관리용 테이블이 아니라 Product Profile과 이벤트 관련 제품을 연결하기 위한 Seed Product 기준 테이블이다.

| **Column** | **Data Type** | **PK/FK** | **Nullable** | **Default** | **Description** |
| --- | --- | --- | --- | --- | --- |
| id | uuid | PK | No | **`gen_random_uuid()`** | 내부 제품 식별자 |
| product_code | text | Unique | No | - | 데모에서 사용하는 제품 코드 |
| name | text | - | No | - | 제품명 |
| official_description | text | - | No | - | 전처리된 공식 제품 설명 |
| image_url | text | - | No | - | 대표 제품 이미지 URL |
| metadata | jsonb | - | Yes | **`'{}'::jsonb`** | 카테고리, 컬렉션, 색상명 등 선택 메타데이터 |
| source | data_source | - | No | **`'seed'`** | 데이터 생성 출처 |
| created_at | timestamptz | - | No | **`now()`** | 생성 시각 |
| updated_at | timestamptz | - | No | **`now()`** | 수정 시각 |

### **제약 조건**

sql

```sql
constraint products_product_code_keyunique (product_code)
```

### **metadata 예시**

json

```json
{"category":"backpack","collection":"Visetos","officialColor":"Cognac","season":"FW2026"}
```

---

## **4.2 product_profiles**

### **Purpose**

제품 이미지, 공식 설명, 메타데이터를 AI가 분석한 Product Understanding 결과를 저장한다.

| **Column** | **Data Type** | **PK/FK** | **Nullable** | **Default** | **Description** |
| --- | --- | --- | --- | --- | --- |
| id | uuid | PK | No | **`gen_random_uuid()`** | Product Profile 식별자 |
| product_id | uuid | FK → products.id | No | - | 연결된 제품 |
| core4 | jsonb | - | No | - | Color/Tone, Silhouette/Form, Material, Monogram Density |
| ai_product_traits | jsonb | - | No | **`'[]'::jsonb`** | AI Product Trait 목록 |
| evidence | jsonb | - | No | **`'[]'::jsonb`** | 이미지·공식 설명 기반 근거 |
| analysis_model | text | - | Yes | - | 분석에 사용한 AI 모델명 |
| source | data_source | - | No | **`'seed'`** | Seed 또는 AI 생성 결과 |
| is_current | boolean | - | No | **`true`** | 제품의 현재 대표 Profile 여부 |
| created_at | timestamptz | - | No | **`now()`** | 생성 시각 |
| updated_at | timestamptz | - | No | **`now()`** | 수정 시각 |

### **핵심 규칙**

- MVP 기본값으로 제품마다 **`is_current = true`**인 Profile은 하나만 유지한다.
- AI Product Trait은 2~3개를 기준으로 저장한다.
- 각 Trait에는 이름, 이유, Evidence가 있어야 한다.
- **`core4`**의 값은 허용된 Enum 또는 **`null`**만 허용한다.
- 검증에 실패한 AI 결과는 저장하지 않는다.

### **core4 예시**

json

```json
{"colorTone":"cognac","silhouetteForm":"structured_backpack","material":"visetos_coated_canvas","monogramDensity":"high"}
```

### **ai_product_traits 예시**

json

```json
[  {"name":"Modern Heritage","reason":"상징적인 Visetos 모노그램과 구조적인 형태를 결합한다.","evidence": [      {"source":"product_description","text":"시그니처 Visetos 캔버스와 클래식한 백팩 실루엣을 사용한다."      }    ]  },  {"name":"Urban Functionality","reason":"도시 이동에 적합한 수납 구조와 착용 방식을 제공한다.","evidence": [      {"source":"product_image","text":"전면 포켓과 조절 가능한 스트랩이 확인된다."      }    ]  }]
```

---

## **4.3 customers**

### **Purpose**

MVP Demo Experience에 사용하는 데모 고객 정보를 저장한다.

실제 CRM 고객, 이메일 주소, 주문 이력, 개인정보는 저장하지 않는다.

| **Column** | **Data Type** | **PK/FK** | **Nullable** | **Default** | **Description** |
| --- | --- | --- | --- | --- | --- |
| id | uuid | PK | No | **`gen_random_uuid()`** | 내부 고객 식별자 |
| customer_code | text | Unique | No | - | 데모 고객 코드 |
| display_name | text | - | No | - | 화면에 표시할 익명화된 고객명 |
| description | text | - | Yes | - | 데모 시나리오용 간단한 설명 |
| source | data_source | - | No | **`'seed'`** | 데이터 생성 출처 |
| created_at | timestamptz | - | No | **`now()`** | 생성 시각 |
| updated_at | timestamptz | - | No | **`now()`** | 수정 시각 |

### **예시**

text

```
customer_code: DEMO-CUSTOMER-001display_name: MCM 고객 Adescription: 구조적인 형태와 헤리티지 표현이 있는 제품을 반복 선택한 데모 고객
```

---

## **4.4 customer_product_selections**

### **Purpose**

데모 고객의 구매 또는 위시리스트 기반 제품 선택 데이터를 저장한다.

Customer Taste Discovery의 근거가 되는 최소 데이터다.

| **Column** | **Data Type** | **PK/FK** | **Nullable** | **Default** | **Description** |
| --- | --- | --- | --- | --- | --- |
| id | uuid | PK | No | **`gen_random_uuid()`** | 선택 데이터 식별자 |
| customer_id | uuid | FK → customers.id | No | - | 연결된 데모 고객 |
| product_id | uuid | FK → products.id | No | - | 선택한 제품 |
| selection_type | selection_type | - | No | - | purchase 또는 wishlist |
| selected_at | timestamptz | - | Yes | - | 데모용 선택 시점 |
| source | data_source | - | No | **`'seed'`** | 데이터 생성 출처 |
| created_at | timestamptz | - | No | **`now()`** | 생성 시각 |

### **제약 조건**

sql

```sql
constraint customer_product_selections_uniqueunique (customer_id, product_id, selection_type)
```

### **구현 기준**

- 실제 주문 번호, 결제 금액, 배송 정보는 저장하지 않는다.
- 데모에서는 고객당 2~5개의 선택 제품이면 충분하다.
- P1 고객 취향 Profile 갱신은 이 테이블의 선택 데이터를 추가한 뒤 임시 또는 신규 Profile을 생성하는 방식으로 처리할 수 있다.

---

## **4.5 customer_taste_profiles**

### **Purpose**

Customer Taste Discovery AI가 생성한 고객 취향 Profile을 저장한다.

| **Column** | **Data Type** | **PK/FK** | **Nullable** | **Default** | **Description** |
| --- | --- | --- | --- | --- | --- |
| id | uuid | PK | No | **`gen_random_uuid()`** | Customer Taste Profile 식별자 |
| customer_id | uuid | FK → customers.id | No | - | 연결된 데모 고객 |
| taste_summary | text | - | No | - | 고객의 취향 요약 |
| core_preference | jsonb | - | No | - | Core4 기준의 고객 선호 |
| ai_traits | jsonb | - | No | **`'[]'::jsonb`** | 반복 패턴 기반 AI Trait |
| evidence_product_ids | uuid[] | FK 논리 참조 → products.id | No | **`'{}'`** | 취향 근거가 되는 제품 ID 목록 |
| source | data_source | - | No | **`'seed'`** | Seed 또는 AI 생성 결과 |
| is_current | boolean | - | No | **`true`** | 고객의 현재 대표 Taste Profile 여부 |
| created_at | timestamptz | - | No | **`now()`** | 생성 시각 |
| updated_at | timestamptz | - | No | **`now()`** | 수정 시각 |

### **핵심 규칙**

- **`evidence_product_ids`**에는 최소 2개의 제품 ID를 저장하는 것을 권장한다.
- AI Trait은 단일 제품만으로 생성하지 않는다.
- 고객별 현재 Profile은 MVP에서 하나만 사용한다.
- 실제 고객 세그먼트나 CRM 속성은 저장하지 않는다.

### **core_preference 예시**

json

```json
{"colorTone": ["cognac","neutral"],"silhouetteForm": ["structured","compact"],"material": ["visetos_coated_canvas","leather"],"monogramDensity": ["medium","high"]}
```

### **ai_traits 예시**

json

```json
[  {"name":"Heritage-oriented Style","reason":"모노그램과 구조적 형태를 가진 제품을 반복 선택한다.","evidenceProductIds": ["제품 UUID 1","제품 UUID 2"    ]  }]
```

---

## **4.6 events**

### **Purpose**

새 컬렉션, 캠페인, 브랜드 이벤트의 기본 정보를 저장한다.

실제 CMS 이벤트 관리 기능이 아니라 Event Trigger Simulation에 사용하는 Seed Event 테이블이다.

| **Column** | **Data Type** | **PK/FK** | **Nullable** | **Default** | **Description** |
| --- | --- | --- | --- | --- | --- |
| id | uuid | PK | No | **`gen_random_uuid()`** | 내부 이벤트 식별자 |
| event_code | text | Unique | No | - | 데모 이벤트 코드 |
| name | text | - | No | - | 이벤트명 |
| event_type | event_type | - | No | - | collection, campaign, brand_event |
| campaign_overview | text | - | No | - | 캠페인 또는 이벤트 개요 |
| brand_message | text | - | No | - | 브랜드 메시지 |
| collection_concept | text | - | Yes | - | 컬렉션 콘셉트 |
| related_product_ids | uuid[] | FK 논리 참조 → products.id | No | **`'{}'`** | 이벤트 관련 제품 ID 목록 |
| source | data_source | - | No | **`'seed'`** | 데이터 생성 출처 |
| created_at | timestamptz | - | No | **`now()`** | 생성 시각 |
| updated_at | timestamptz | - | No | **`now()`** | 수정 시각 |

### **구현 기준**

- MVP에서는 이벤트를 1~3개만 Seed Data로 제공한다.
- 실제 이벤트 등록, 수정, 삭제 기능은 제공하지 않는다.
- 이벤트당 관련 제품은 1~3개를 기준으로 유지한다.

---

## **4.7 event_meaning_profiles**

### **Purpose**

Event Meaning Analysis 결과를 저장한다.

이벤트 자체의 브랜드 의미를 구조화하며, 고객 관련성이나 발행 여부는 포함하지 않는다.

| **Column** | **Data Type** | **PK/FK** | **Nullable** | **Default** | **Description** |
| --- | --- | --- | --- | --- | --- |
| id | uuid | PK | No | **`gen_random_uuid()`** | Event Meaning Profile 식별자 |
| event_id | uuid | FK → events.id | No | - | 연결된 이벤트 |
| event_theme | text | - | No | - | 이벤트의 핵심 주제 |
| brand_direction | text | - | No | - | 이벤트가 제시하는 브랜드 방향 |
| event_traits | jsonb | - | No | **`'[]'::jsonb`** | 이벤트의 의미적 특성 |
| evidence | jsonb | - | No | **`'[]'::jsonb`** | 이벤트 정보 기반 근거 |
| analysis_model | text | - | Yes | - | 분석에 사용한 AI 모델명 |
| source | data_source | - | No | **`'seed'`** | Seed 또는 AI 생성 결과 |
| is_current | boolean | - | No | **`true`** | 이벤트의 현재 대표 Profile 여부 |
| created_at | timestamptz | - | No | **`now()`** | 생성 시각 |
| updated_at | timestamptz | - | No | **`now()`** | 수정 시각 |

### **event_traits 예시**

json

```json
["Modern Heritage","Urban Mobility","Refined Utility"]
```

### **evidence 예시**

json

```json
[  {"source":"event_data","text":"새 컬렉션은 MCM의 헤리티지를 도시적 이동 경험으로 재해석한다."  },  {"source":"collection_concept","text":"가볍고 유연한 구조를 통해 일상적 사용성을 강조한다."  }]
```

---

---

## **4.8 reasoning_runs**

### **Purpose**

이벤트 Trigger 이후 AI Editorial Engine이 실행된 기록을 저장한다.

실제 대규모 작업 큐나 운영 로그가 아니라, 데모 흐름과 AI Reasoning Journey 화면을 연결하는 기준 레코드다.

| **Column** | **Data Type** | **PK/FK** | **Nullable** | **Default** | **Description** |
| --- | --- | --- | --- | --- | --- |
| id | uuid | PK | No | **`gen_random_uuid()`** | 실행 식별자 |
| customer_id | uuid | FK → customers.id | No | - | 분석 대상 데모 고객 |
| event_id | uuid | FK → events.id | No | - | 선택된 이벤트 |
| customer_taste_profile_id | uuid | FK → customer_taste_profiles.id | No | - | 실행 시 사용한 고객 취향 Profile |
| event_meaning_profile_id | uuid | FK → event_meaning_profiles.id | No | - | 실행 시 사용한 이벤트 의미 Profile |
| status | reasoning_run_status | - | No | **`'pending'`** | 실행 상태 |
| source | data_source | - | No | **`'seed'`** | Seed 또는 AI 실행 결과 |
| started_at | timestamptz | - | No | **`now()`** | 실행 시작 시각 |
| completed_at | timestamptz | - | Yes | - | 실행 완료 시각 |
| error_message | text | - | Yes | - | 실패 시 오류 메시지 |
| created_at | timestamptz | - | No | **`now()`** | 생성 시각 |

### **상태 전이**

text

```
pending    ↓processing    ↓completedprocessing    ↓failed
```

### **구현 기준**

- 대표 Demo Flow는 사전 생성된 **`completed`** 실행 기록을 사용할 수 있다.
- 실시간 AI 실행 시 **`pending → processing → completed/failed`**로 상태를 갱신한다.
- AI Reasoning Journey 화면은 **`reasoning_runs.id`**를 기준으로 결과를 조회한다.

---

## **4.9 matching_results**

### **Purpose**

AI Meaning Matching의 결과를 저장한다.

고객 근거, 제품·이벤트 근거, Meaning Bridge, 후보 제품을 하나의 결과로 관리한다.

| **Column** | **Data Type** | **PK/FK** | **Nullable** | **Default** | **Description** |
| --- | --- | --- | --- | --- | --- |
| id | uuid | PK | No | **`gen_random_uuid()`** | Matching Result 식별자 |
| reasoning_run_id | uuid | FK → reasoning_runs.id | No | - | 연결된 AI 실행 기록 |
| customer_evidence | jsonb | - | No | - | 고객 취향과 근거 제품 기반 Evidence |
| product_event_evidence | jsonb | - | No | - | 제품·이벤트 기반 Evidence |
| meaning_bridge | jsonb | - | No | - | 고객 취향과 새 브랜드 표현의 연결 |
| candidate_product_ids | uuid[] | FK 논리 참조 → products.id | No | **`'{}'`** | 후보 제품 ID 목록 |
| is_valid | boolean | - | No | **`false`** | 필수 구조와 Evidence 검증 통과 여부 |
| validation_errors | jsonb | - | No | **`'[]'::jsonb`** | 검증 실패 사유 목록 |
| analysis_model | text | - | Yes | - | 분석에 사용한 AI 모델명 |
| source | data_source | - | No | **`'seed'`** | Seed 또는 AI 생성 결과 |
| created_at | timestamptz | - | No | **`now()`** | 생성 시각 |

### **customer_evidence 예시**

json

```json
{"summary":"고객은 구조적인 형태와 MCM 헤리티지가 드러나는 제품을 반복 선택했다.","corePreferenceEvidence": ["structured silhouette","high monogram density"  ],"traitEvidence": ["Modern Heritage","Structured Form Preference"  ],"evidenceProductIds": ["제품 UUID 1","제품 UUID 2"  ]}
```

### **product_event_evidence 예시**

json

```json
{"summary":"새 컬렉션은 구조적 헤리티지를 유지하면서 도시적 이동 경험으로 확장한다.","eventEvidence": ["Urban Mobility","Modern Heritage"  ],"productEvidence": ["lightweight structure","refined utility"  ],"relatedProductIds": ["제품 UUID 3"  ]}
```

### **meaning_bridge 예시**

json

```json
{"existingPreference":"고객은 구조적인 형태와 헤리티지 표현이 있는 제품을 선호한다.","newBrandExpression":"새 컬렉션은 헤리티지를 더 가볍고 도시적인 이동 경험으로 확장한다.","connectionReason":"기존의 구조적 헤리티지 선호를 유지하면서 새로운 사용 맥락을 제공한다.","discoveryValue":"단순 반복 추천이 아니라 고객 취향의 새로운 브랜드 발견으로 제안할 수 있다."}
```

---

## **4.10 gatekeeper_results**

### **Purpose**

Matching Result를 검증해 Personal Editorial 발행 가능 여부를 PASS 또는 REJECT로 저장한다.

| **Column** | **Data Type** | **PK/FK** | **Nullable** | **Default** | **Description** |
| --- | --- | --- | --- | --- | --- |
| id | uuid | PK | No | **`gen_random_uuid()`** | Gatekeeper Result 식별자 |
| reasoning_run_id | uuid | FK → reasoning_runs.id | No | - | 연결된 AI 실행 기록 |
| matching_result_id | uuid | FK → matching_results.id | No | - | 판단 대상 Matching Result |
| decision | gatekeeper_decision | - | No | - | PASS 또는 REJECT |
| reason | text | - | No | - | 판단 이유 |
| editorial_angle | text | - | Yes | - | PASS 시 사용할 에디토리얼 방향 |
| failed_rules | jsonb | - | No | **`'[]'::jsonb`** | REJECT 또는 검증 실패 규칙 목록 |
| candidate_product_ids | uuid[] | FK 논리 참조 → products.id | No | **`'{}'`** | 최종 후보 제품 ID 목록 |
| source | data_source | - | No | **`'seed'`** | Seed 또는 AI 생성 결과 |
| created_at | timestamptz | - | No | **`now()`** | 생성 시각 |

### **핵심 규칙**

text

```
PASS 조건- Customer Evidence가 존재한다.- Product/Event Evidence가 존재한다.- Meaning Bridge가 존재한다.- 새로운 발견 가치가 존재한다.- 필수 ID와 JSON 구조가 유효하다.REJECT 조건- 기존 취향의 단순 반복이다.- Evidence가 누락됐다.- Meaning Bridge가 없다.- 새로운 발견 가치가 없다.- 필수 필드 또는 JSON 구조가 유효하지 않다.
```

### **구현 제약**

- **`decision = 'PASS'`**인 결과만 Personal Editorial을 생성할 수 있다.
- **`decision = 'REJECT'`**이면 **`editorial_angle`**은 **`null`**일 수 있다.
- REJECT 결과는 이메일 미리보기로 이어지지 않는다.

---

## **4.11 personal_editorials**

### **Purpose**

PASS된 Gatekeeper Result를 기반으로 생성된 Personal Editorial 결과를 저장한다.

Email Preview와 선택적 테스트 이메일 전달의 단일 콘텐츠 원본으로 사용한다.

| **Column** | **Data Type** | **PK/FK** | **Nullable** | **Default** | **Description** |
| --- | --- | --- | --- | --- | --- |
| id | uuid | PK | No | **`gen_random_uuid()`** | Personal Editorial 식별자 |
| gatekeeper_result_id | uuid | FK → gatekeeper_results.id | No | - | PASS Gatekeeper Result |
| reasoning_run_id | uuid | FK → reasoning_runs.id | No | - | 연결된 AI 실행 기록 |
| customer_id | uuid | FK → customers.id | No | - | 대상 데모 고객 |
| event_id | uuid | FK → events.id | No | - | 연결된 이벤트 |
| title | text | - | No | **`'MY MCM ISSUE'`** | 에디토리얼 제목 |
| hero_image_url | text | - | Yes | - | 히어로 이미지 URL |
| brand_story | text | - | No | - | 이벤트·브랜드 스토리 |
| personal_connection | text | - | No | - | 고객 선택 근거 기반 개인 연결 |
| product_discovery | jsonb | - | No | **`'[]'::jsonb`** | 제품 발견 콘텐츠 목록 |
| closing_message | text | - | No | - | 마무리 메시지 |
| editorial_content | jsonb | - | No | **`'{}'::jsonb`** | 이메일 렌더링용 전체 Editorial JSON |
| generation_model | text | - | Yes | - | 생성에 사용한 AI 모델명 |
| source | data_source | - | No | **`'seed'`** | Seed 또는 AI 생성 결과 |
| created_at | timestamptz | - | No | **`now()`** | 생성 시각 |
| updated_at | timestamptz | - | No | **`now()`** | 수정 시각 |

### **product_discovery 예시**

json

```json
[  {"productId":"제품 UUID 3","productName":"제품명","imageUrl":"/images/product-03.jpg","description":"고객의 구조적 헤리티지 선호를 도시적 이동 경험으로 확장하는 제품이다."  }]
```

### **editorial_content 예시**

json

```json
{"title":"MY MCM ISSUE","heroImageUrl":"/images/editorial-hero.jpg","brandStory":"새 컬렉션은 MCM의 헤리티지를 도시적 이동 경험으로 재해석한다.","personalConnection":"고객이 선택해 온 구조적 형태와 헤리티지 표현은 이번 컬렉션의 새로운 방향과 연결된다.","productDiscovery": [    {"productId":"제품 UUID 3","productName":"제품명","imageUrl":"/images/product-03.jpg","description":"새로운 브랜드 발견을 제공하는 제품 설명"    }  ],"closingMessage":"MCM의 새로운 표현을 고객의 기존 취향 맥락에서 발견해 보세요."}
```

### **핵심 규칙**

- PASS Gatekeeper Result에만 생성한다.
- **`product_discovery`**는 최대 3개 제품을 기준으로 한다.
- 고객 성격이나 라이프스타일을 근거 없이 단정하는 문구를 저장하지 않는다.
- Email Preview는 **`editorial_content`** 또는 개별 콘텐츠 컬럼을 사용해 렌더링한다.

---

# **5. JSONB 설계 기준**

## **5.1 JSONB를 사용하는 이유**

MVP의 AI 결과는 구조화되어야 하지만, 분석 결과의 표현 방식은 반복 검증 과정에서 달라질 수 있다.

Core4, Trait, Evidence, Meaning Bridge, Editorial Content를 모두 과도하게 분리하면 2명 개발 환경에서 테이블과 조인 구조가 복잡해진다.

따라서 다음 기준으로 JSONB를 사용한다.

- AI 응답 구조를 유연하게 저장한다.
- Zod Schema 기반으로 저장 전 구조를 검증한다.
- 화면에 필요한 결과를 하나의 레코드에서 빠르게 조회한다.
- Seed Data와 실시간 AI 결과를 같은 구조로 관리한다.
- MVP 이후 실제 분석 요구가 확정되면 필요한 필드만 별도 컬럼으로 분리한다.

## **5.2 JSONB 적용 대상**

| **테이블** | **JSONB 컬럼** | **저장 내용** |
| --- | --- | --- |
| products | metadata | 제품 카테고리, 컬렉션, 공식 색상 등 선택 정보 |
| product_profiles | core4 | Color/Tone, Silhouette/Form, Material, Monogram Density |
| product_profiles | ai_product_traits | AI Product Trait, 이유, Evidence |
| product_profiles | evidence | 제품 이미지·설명 근거 |
| customer_taste_profiles | core_preference | 고객의 Core4 선호값 |
| customer_taste_profiles | ai_traits | 고객 취향 Trait과 근거 제품 |
| event_meaning_profiles | event_traits | 이벤트 의미 특성 목록 |
| event_meaning_profiles | evidence | 이벤트 의미 분석 근거 |
| matching_results | customer_evidence | 고객 취향과 근거 제품 |
| matching_results | product_event_evidence | 이벤트·제품 근거 |
| matching_results | meaning_bridge | 기존 취향과 새 브랜드 표현의 연결 |
| matching_results | validation_errors | AI 결과 검증 실패 사유 |
| gatekeeper_results | failed_rules | PASS·REJECT 판단에 사용한 실패 규칙 |
| personal_editorials | product_discovery | 제품 발견 콘텐츠 목록 |
| personal_editorials | editorial_content | Email Preview용 전체 콘텐츠 |

## **5.3 JSONB 관리 원칙**

text

```
AI 응답 생성    ↓Zod Schema 검증    ↓필수 필드·Enum·Evidence 검증    ↓검증 통과 결과만 JSONB 저장    ↓화면과 Email Template에서 재사용
```

### **JSONB 사용 시 주의사항**

- UI에서 자주 정렬·필터링하는 값은 일반 컬럼으로 둔다.
    - 예: **`decision`**, **`event_id`**, **`customer_id`**, **`source`**, **`is_current`**
- AI 결과의 상세 표현은 JSONB로 둔다.
    - 예: Trait, Evidence, Meaning Bridge
- JSONB 내부 값만 신뢰하지 않고, 서버에서 반드시 Schema Validation을 수행한다.
- JSONB는 운영 분석이나 복잡한 검색을 위한 구조가 아니라 MVP Demo Flow를 위한 구조다.

---

# **6. 핵심 데이터 구조 반영**

## **6.1 Product Profile**

text

```
Product Profile├── Product Information│   └── products├── Core4│   └── product_profiles.core4├── AI Product Traits│   └── product_profiles.ai_product_traits└── Evidence    └── product_profiles.evidence
```

## **6.2 Customer Taste Profile**

text

```
Customer Taste Profile├── Taste Summary│   └── customer_taste_profiles.taste_summary├── Core Preference│   └── customer_taste_profiles.core_preference├── AI Traits│   └── customer_taste_profiles.ai_traits└── Evidence Products    └── customer_taste_profiles.evidence_product_ids
```

## **6.3 Event Meaning Profile**

text

```
Event Meaning Profile├── Event Theme│   └── event_meaning_profiles.event_theme├── Brand Direction│   └── event_meaning_profiles.brand_direction├── Event Traits│   └── event_meaning_profiles.event_traits└── Evidence    └── event_meaning_profiles.evidence
```

## **6.4 Matching Result**

text

```
Matching Result├── Customer Evidence│   └── matching_results.customer_evidence├── Product/Event Evidence│   └── matching_results.product_event_evidence├── Meaning Bridge│   └── matching_results.meaning_bridge└── Candidate Product IDs    └── matching_results.candidate_product_ids
```

## **6.5 Gatekeeper Result**

text

```
Gatekeeper Result├── Decision│   └── gatekeeper_results.decision├── Reason│   └── gatekeeper_results.reason├── Editorial Angle│   └── gatekeeper_results.editorial_angle└── Failed Rules    └── gatekeeper_results.failed_rules
```

## **6.6 Personal Editorial**

text

```
Personal Editorial├── Title│   └── personal_editorials.title├── Brand Story│   └── personal_editorials.brand_story├── Personal Connection│   └── personal_editorials.personal_connection├── Product Discovery│   └── personal_editorials.product_discovery├── Closing Message│   └── personal_editorials.closing_message└── Email Rendering JSON    └── personal_editorials.editorial_content
```

---

# **7. MVP 단순화 원칙**

## **7.1 제외**

아래 테이블과 범위는 MVP DB에 포함하지 않는다.

text

```
- 사용자 인증 테이블- 권한 관리 테이블- 실제 CRM 고객 테이블- 실제 주문 시스템 테이블- 결제 데이터- CMS 관리 테이블- 제품·고객·이벤트 CRUD 이력 테이블- 관리자 로그 시스템- Analytics 테이블- 이메일 캠페인 관리 테이블- 이메일 수신자 대량 발송 테이블- Push·카카오·앱 알림 테이블- 실시간 이벤트 처리 테이블
```

## **7.2 포함**

text

```
- Demo Customer- Seed Product- Seed Event- Product Intelligence 결과- Customer Intelligence 결과- Event Intelligence 결과- AI Meaning Matching 결과- Meaning Bridge- PASS / REJECT 결과- Personal Editorial 결과- Email Preview용 콘텐츠
```

---

# **8. Seed Data 구조**

## **8.1 Seed Data 목적**

Seed Script는 대표 Demo Flow를 언제든 재현할 수 있도록 기본 데이터를 생성한다.

text

```
Seed Product    ↓Seed Product Profile    ↓Demo Customer + Product Selection    ↓Seed Customer Taste Profile    ↓Seed Event + Event Meaning Profile    ↓Seed Reasoning Run    ↓Seed Matching Result    ↓Seed Gatekeeper Result    ↓Seed Personal Editorial
```

## **8.2 Seed 대상 테이블**

| **테이블** | **Seed 역할** |
| --- | --- |
| products | 데모에서 보여줄 제품 기본 정보 |
| product_profiles | 사전 분석된 Product Intelligence |
| customers | 익명화된 데모 고객 |
| customer_product_selections | 구매·위시리스트 기반 고객 선택 근거 |
| customer_taste_profiles | 사전 생성된 Customer Taste Profile |
| events | 시뮬레이션할 컬렉션·캠페인·브랜드 이벤트 |
| event_meaning_profiles | 사전 생성된 Event Meaning Profile |
| reasoning_runs | 대표 고객과 이벤트 조합의 실행 기록 |
| matching_results | Customer Evidence, Product/Event Evidence, Meaning Bridge |
| gatekeeper_results | PASS 사례와 REJECT 사례 |
| personal_editorials | PASS 사례의 Personal Editorial과 Email Preview 데이터 |

## **8.3 최소 Seed 시나리오**

### **PASS 시나리오**

text

```
Demo Customer A    +구조적 실루엣·헤리티지 표현 선호    +새 컬렉션의 Modern Heritage / Urban Mobility    ↓Meaning Bridge 생성    ↓Gatekeeper PASS    ↓Personal Editorial 생성    ↓Email Preview 표시
```

### **REJECT 시나리오**

text

```
Demo Customer B    +고객 근거 또는 새 브랜드 표현 부족    ↓Meaning Bridge 약함 또는 없음    ↓Gatekeeper REJECT    ↓발행하지 않음
```

## **8.4 Seed Script 실행 순서**

bash

```bash
pnpmdb:seed
```

권장 실행 순서:

text

```
1. products 생성2. product_profiles 생성3. customers 생성4. customer_product_selections 생성5. customer_taste_profiles 생성6. events 생성7. event_meaning_profiles 생성8. reasoning_runs 생성9. matching_results 생성10. gatekeeper_results 생성11. personal_editorials 생성
```

---

# **9. Index 및 관계 설계**

MVP에서는 화면 조회와 대표 Demo Flow에 필요한 최소 Index만 만든다.

## **9.1 필수 Index**

sql

```sql
createindexidx_product_profiles_product_idon product_profiles(product_id);createindexidx_product_profiles_currenton product_profiles(product_id)where is_current= true;createindexidx_customer_product_selections_customer_idon customer_product_selections(customer_id);createindexidx_customer_product_selections_product_idon customer_product_selections(product_id);createindexidx_customer_taste_profiles_customer_idon customer_taste_profiles(customer_id);createindexidx_customer_taste_profiles_currenton customer_taste_profiles(customer_id)where is_current= true;createindexidx_event_meaning_profiles_event_idon event_meaning_profiles(event_id);createindexidx_event_meaning_profiles_currenton event_meaning_profiles(event_id)where is_current= true;createindexidx_reasoning_runs_customer_eventon reasoning_runs(customer_id, event_id);createindexidx_matching_results_reasoning_run_idon matching_results(reasoning_run_id);createindexidx_gatekeeper_results_reasoning_run_idon gatekeeper_results(reasoning_run_id);createindexidx_gatekeeper_results_decisionon gatekeeper_results(decision);createindexidx_personal_editorials_reasoning_run_idon personal_editorials(reasoning_run_id);createindexidx_personal_editorials_customer_eventon personal_editorials(customer_id, event_id);
```

## **9.2 관계 설계 원칙**

- 화면 조회의 기준은 **`customer_id`**, **`event_id`**, **`reasoning_run_id`**, **`editorial_id`**다.
- Profile 테이블은 **`is_current = true`** 기준으로 현재 결과를 조회한다.
- 실행 단위의 결과 연결은 **`reasoning_runs.id`**를 기준으로 한다.
- 후보 제품은 MVP 속도를 위해 UUID 배열로 저장한다.
- 후보 제품의 상세 정보는 필요할 때 **`products`**와 **`product_profiles`**에서 조회한다.
- MVP에서는 JSONB GIN Index를 기본으로 추가하지 않는다.

# **10. Database Constraints**

## **10.1 필수 ID 존재**

아래 관계는 필수로 유지한다.

text

```
product_profiles.product_idcustomer_product_selections.customer_idcustomer_product_selections.product_idcustomer_taste_profiles.customer_idevent_meaning_profiles.event_idreasoning_runs.customer_idreasoning_runs.event_idreasoning_runs.customer_taste_profile_idreasoning_runs.event_meaning_profile_idmatching_results.reasoning_run_idgatekeeper_results.reasoning_run_idgatekeeper_results.matching_result_idpersonal_editorials.gatekeeper_result_idpersonal_editorials.reasoning_run_idpersonal_editorials.customer_idpersonal_editorials.event_id
```

## **10.2 필수 Evidence 존재**

서버 API는 DB 저장 전 아래를 검증한다.

| **대상** | **필수 검증** |
| --- | --- |
| Product Profile | AI Product Trait마다 이유와 Evidence 존재 |
| Customer Taste Profile | 근거 제품 ID 존재, AI Trait은 복수 제품 근거 권장 |
| Event Meaning Profile | Event Theme, Brand Direction, Evidence 존재 |
| Matching Result | Customer Evidence, Product/Event Evidence, Meaning Bridge 존재 |
| Gatekeeper PASS | 새로운 발견 가치, 후보 제품, Editorial Angle 존재 |
| Personal Editorial | Title, Brand Story, Personal Connection, Product Discovery, Closing Message 존재 |

## **10.3 JSON 구조 검증**

DB Check Constraint만으로 복잡한 JSON 구조를 완전히 검증하지 않는다.

Next.js API Layer에서 Zod Schema를 사용해 검증한 뒤 저장한다.

text

```
OpenAI Response    ↓JSON Parse    ↓Zod Schema Validation    ↓필수 ID·Enum·Evidence 검증    ↓DB Insert 또는 Update
```

## **10.4 Gatekeeper와 Editorial 생성 제약**

애플리케이션 레벨에서 아래 규칙을 강제한다.

text

```
gatekeeper_results.decision = PASS    ↓personal_editorials 생성 허용gatekeeper_results.decision = REJECT    ↓personal_editorials 생성 금지
```

필요하면 **`personal_editorials`** 저장 전 Gatekeeper Decision을 확인하는 서버 함수를 사용한다.

---

# **11. Supabase 구현 메모**

## **11.1 권장 접근 방식**

text

```
개발 초기- 로컬 JSON 파일과 TypeScript 타입으로 화면을 빠르게 만든다.데모 통합- Supabase PostgreSQL에 Seed Data를 저장한다.- 화면은 Supabase에서 데이터를 조회한다.선택 AI 기능- Next.js 서버에서 OpenAI 호출- Zod 검증- ai_generated 결과를 DB에 저장
```

## **11.2 RLS 적용 범위**

MVP는 실제 사용자 인증과 고객 접근을 제공하지 않으므로, 복잡한 RLS 정책을 만들지 않는다.

권장 기준:

- Supabase 접근은 서버 전용으로 제한한다.
- 클라이언트는 Next.js Route Handler 또는 Server Action을 통해 데이터를 조회한다.
- **`service_role`** 키는 서버 환경변수에서만 사용한다.
- 실제 운영 환경의 고객 데이터와 인증 정책은 MVP 이후 별도 설계한다.

---

# **12. Database Final Summary**

## **12.1 전체 테이블 목록**

| **구분** | **테이블** |
| --- | --- |
| Product Intelligence | products, product_profiles |
| Customer Intelligence | customers, customer_product_selections, customer_taste_profiles |
| Event Intelligence | events, event_meaning_profiles |
| AI Reasoning | reasoning_runs, matching_results, gatekeeper_results |
| Editorial Experience | personal_editorials |

## **12.2 테이블 관계 구조**

text

```
products    └── product_profilescustomers    └── customer_product_selections            └── productscustomers    └── customer_taste_profilesevents    └── event_meaning_profilescustomers + events    ↓reasoning_runs    ↓matching_results    ↓gatekeeper_results    ↓ PASS만 허용personal_editorials    ↓Email Preview Experience
```

## **12.3 데이터 생성 Flow**

text

```
Seed Product    ↓Product Profile    ↓Demo Customer Selection    ↓Customer Taste Profile    ↓Seed Event    ↓Event Meaning Profile    ↓Reasoning Run    ↓Matching Result + Meaning Bridge    ↓Gatekeeper PASS / REJECT    ↓PASS 시 Personal Editorial    ↓Email HTML Preview
```

## **12.4 MVP 최소 DB 범위**

이 DB 설계는 실제 MCM CRM·CMS 운영을 위한 구조가 아니다.

MVP에서 필요한 범위는 다음과 같다.

text

```
- Seed Product- Demo Customer- Seed Event- Intelligence Profile 저장- AI Meaning Matching 결과 저장- Meaning Bridge 저장- Gatekeeper 판단 저장- Personal Editorial 저장- Email Preview 렌더링 데이터 제공
```

> ***이 구조는 05_MVP_SCOPE의 End-to-End AI Experience와 06_TECHNICAL_SPEC의 도메인 모델을 유지하면서, 이후 08_API_SPEC과 09_PRODUCT_BACKLOG에서 API 책임과 개발 작업 단위로 바로 나눌 수 있는 최소 Supabase PostgreSQL 설계다.***
> 

### 프로젝트 정보

프로젝트의 목표와 맥락에 대한 개요를 제공합니다.

### 액션 아이템

- [ ]  

### 문서

[https://app.notion.com](https://app.notion.com)