# [개발 문서] 08_API_SPEC

담당자: 성경 이
상태: 완료
상태 (1): 시작 전
종료일: 08/17/2026
우선순위: 높음

# **08_API_SPEC.md**

## **MCM Personal Editorial Engine MVP API 명세**

## **1. API Overview**

### **1.1 API Layer 역할**

API Layer는 Frontend 화면이 AI Knowledge Base, AI Reasoning Journey, Personal Editorial, Email Experience를 구현할 수 있도록 데이터 조회와 AI Pipeline 실행 인터페이스를 제공한다.

text

```
Frontend    ↓Next.js API Route Handler    ↓Service Layer    ↓Supabase PostgreSQL / AI Processing Layer
```

### **1.2 Frontend와 Backend 책임 분리**

| **구분** | **책임** |
| --- | --- |
| Frontend | 화면 렌더링, 사용자 선택, 로딩·오류 상태 표시, API 응답 기반 UI 구성 |
| API Route Handler | 요청 검증, Service 호출, 공통 응답 형식 반환 |
| Service Layer | 데이터 조회, AI Pipeline 실행, Gatekeeper 판단, Editorial 생성 |
| Supabase | Seed Data, Intelligence Profile, AI 실행 결과, Editorial 결과 저장 |
| AI Processing Layer | OpenAI 호출, Prompt 구성, JSON 응답 검증, Fallback 처리 |

### **1.3 AI Pipeline 호출 방식**

text

```
Frontend 요청    ↓Next.js API Route Handler    ↓Service Layer    ↓Supabase에서 입력 데이터 조회    ↓OpenAI 호출 또는 Seed Result 조회    ↓Zod Validation    ↓DB 저장    ↓Frontend 응답 반환
```

### **1.4 MVP API 원칙**

- 실제 CRM API는 제공하지 않는다.
- 실제 CMS API는 제공하지 않는다.
- 실제 주문 API는 제공하지 않는다.
- 실제 이메일 발송 API는 제공하지 않는다.
- Seed Data 조회를 기본으로 한다.
- AI 호출은 선택 기능 또는 AI Pipeline 검증용으로 제공한다.
- 대표 Demo Flow는 사전 생성 JSON으로 재현 가능해야 한다.
- AI 응답은 검증된 JSON만 Frontend에 반환한다.
- 실제 인증·권한·대규모 트래픽 대응 구조는 MVP 범위에서 제외한다.

---

## **2. API Architecture**

text

```
┌──────────────────────────────────────────────┐│                  Frontend                    ││                                              ││ - AI Knowledge Base Dashboard                ││ - Intelligence Detail                        ││ - Event Trigger                              ││ - AI Reasoning Journey                       ││ - Personal Editorial Preview                 ││ - Email Experience                           │└──────────────────────┬───────────────────────┘                       │ HTTP Request                       ▼┌──────────────────────────────────────────────┐│          Next.js API Route Handler            ││                                              ││ /api/products                                ││ /api/customers                               ││ /api/events                                  ││ /api/reasoning                               ││ /api/matching                                ││ /api/gatekeeper                              ││ /api/editorials                              ││ /api/email                                   │└──────────────────────┬───────────────────────┘                       │                       ▼┌──────────────────────────────────────────────┐│                Service Layer                 ││                                              ││ Product Service                              ││ Customer Service                             ││ Event Service                                ││ Matching Service                             ││ Gatekeeper Service                           ││ Editorial Service                            ││ Email Service                                │└───────────────┬───────────────────┬──────────┘                │                   │                ▼                   ▼┌──────────────────────┐  ┌──────────────────────┐│ Supabase PostgreSQL  │  │ AI Processing Layer  ││                      │  │                      ││ - Seed Data          │  │ - OpenAI             ││ - Profile Data       │  │ - Prompt Builder     ││ - Reasoning Result   │  │ - JSON Validation    ││ - Editorial Data     │  │ - Fallback           │└──────────────────────┘  └──────────────────────┘
```

### **2.1 Frontend**

- API 응답을 기반으로 화면을 구성한다.
- AI 결과를 직접 생성하거나 수정하지 않는다.
- API Key를 보유하거나 OpenAI를 직접 호출하지 않는다.
- 로딩, 빈 상태, 오류 상태를 표시한다.
- PASS 결과일 때만 Personal Editorial 미리보기로 이동한다.

### **2.2 Next.js API Route Handler**

- 요청 Body와 Path Parameter를 검증한다.
- Service Layer를 호출한다.
- 공통 JSON 응답 형식을 반환한다.
- 내부 오류 메시지나 API Key를 노출하지 않는다.
- HTTP 상태 코드를 설정한다.

### **2.3 Service Layer**

- Supabase 조회와 저장을 담당한다.
- AI Pipeline 입력 데이터를 조합한다.
- OpenAI 응답을 검증한다.
- Gatekeeper 규칙을 평가한다.
- 대표 Demo Flow의 Seed Result와 Fallback을 제공한다.

### **2.4 Supabase / AI Processing Layer**

- Supabase는 제품, 고객, 이벤트, Intelligence Profile, 실행 결과, Editorial을 저장한다.
- AI Processing Layer는 Product Understanding, Customer Taste Discovery, Meaning Matching, Editorial Generation을 처리한다.
- AI 결과는 저장 전 Zod Schema와 Evidence 규칙을 통과해야 한다.

---

## **3. API Convention**

## **3.1 Base URL**

text

```
/api
```

예시:

text

```
GET /api/productsPOST /api/reasoning/startGET /api/editorials/{editorialId}
```

---

## **3.2 Content Type**

http

```
Content-Type:application/json
```

이미지 입력이 필요한 제품 분석 테스트는 **`multipart/form-data`**를 사용한다.

http

```
Content-Type:multipart/form-data
```

---

## **3.3 Success Response Format**

json

```json
{"success":true,"data": {},"error":null}
```

목록 조회 예시:

json

```json
{"success":true,"data": {"items": [],"total":0  },"error":null}
```

---

## **3.4 Error Response Format**

json

```json
{"success":false,"data":null,"error": {"code":"NOT_FOUND","message":"데이터를 찾을 수 없습니다."  }}
```

---

## **3.5 HTTP Status 기준**

| **Status** | **Code 예시** | **사용 상황** |
| --- | --- | --- |
| 200 | OK | 정상 조회, 정상 실행, 정상 생성 |
| 400 | INVALID_REQUEST | 필수 입력 누락, 형식 오류, 잘못된 ID |
| 404 | NOT_FOUND | 제품, 고객, 이벤트, 실행 결과를 찾을 수 없음 |
| 422 | VALIDATION_FAILED | AI 결과의 JSON 구조, Evidence, Enum 검증 실패 |
| 500 | INTERNAL_ERROR | 서버 오류, Supabase 오류, 예상하지 못한 처리 실패 |
| 503 | AI_SERVICE_UNAVAILABLE | AI 호출 실패 및 Fallback 결과 없음 |

---

## **3.6 공통 Error Code**

| **Code** | **Description** |
| --- | --- |
| INVALID_REQUEST | 요청 Body, Query, Path Parameter가 유효하지 않음 |
| NOT_FOUND | 요청한 데이터가 없음 |
| PROFILE_NOT_FOUND | 필요한 Product, Customer, Event Profile이 없음 |
| VALIDATION_FAILED | JSON Schema, 필수 필드, Enum, Evidence 검증 실패 |
| GATEKEEPER_REJECTED | Gatekeeper가 REJECT를 반환함 |
| EDITORIAL_NOT_ALLOWED | PASS 결과가 아니어서 Editorial 생성 불가 |
| AI_RESPONSE_INVALID | AI 응답을 JSON으로 변환하거나 검증할 수 없음 |
| AI_SERVICE_UNAVAILABLE | OpenAI 호출 실패 또는 응답 불가 |
| INTERNAL_ERROR | 처리 중 예상하지 못한 오류 발생 |

---

## **4. Knowledge Base API**

## **4.1 Product Intelligence 목록 조회**

### **Endpoint**

http

```
GET /api/products
```

### **목적**

제품 목록과 Product Intelligence 준비 상태를 조회한다.

### **사용 화면**

- AI Knowledge Base Dashboard
- Product Intelligence 목록

### **Query Parameter**

| **Parameter** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| **`limit`** | number | No | 반환할 최대 제품 수. 기본값은 20이다. |
| **`offset`** | number | No | 목록 시작 위치. 기본값은 0이다. |

### **Response**

json

```json
{"success":true,"data": {"items": [      {"productId":"uuid","productCode":"DEMO-PRODUCT-001","productName":"MCM 백팩","imageUrl":"/images/products/product-001.jpg","profileStatus":"ready","source":"seed"      }    ],"total":1  },"error":null}
```

### **Response Field**

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| productId | string | 제품 UUID |
| productCode | string | 데모 제품 코드 |
| productName | string | 제품명 |
| imageUrl | string | 대표 이미지 URL |
| profileStatus | string | **`ready`** 또는 **`missing`** |
| source | string | **`seed`** 또는 **`ai_generated`** |
| total | number | 전체 제품 수 |

### **Service 처리**

text

```
products 조회    ↓현재 Product Profile 조회    ↓Profile 존재 여부로 상태 생성    ↓목록 반환
```

---

## **4.2 Product Profile 상세 조회**

### **Endpoint**

http

```
GET /api/products/{productId}
```

### **목적**

선택한 제품의 Product Information과 Product Profile을 조회한다.

### **사용 화면**

- Product Intelligence 상세

### **Path Parameter**

| **Parameter** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| productId | uuid | Yes | 제품 UUID |

### **Response**

json

```json
{"success":true,"data": {"product": {"productId":"uuid","productCode":"DEMO-PRODUCT-001","productName":"MCM 백팩","officialDescription":"제품 공식 설명","imageUrl":"/images/products/product-001.jpg","metadata": {"category":"backpack","collection":"Visetos"      }    },"profile": {"profileId":"uuid","core4": {"colorTone":"cognac","silhouetteForm":"structured_backpack","material":"visetos_coated_canvas","monogramDensity":"high"      },"aiProductTraits": [        {"name":"Modern Heritage","reason":"시그니처 모노그램과 구조적 형태를 결합한다.","evidence": [            {"source":"product_description","text":"Visetos 캔버스와 클래식한 백팩 실루엣을 사용한다."            }          ]        }      ],"evidence": [        {"source":"product_image","text":"전면 포켓과 조절 가능한 스트랩이 확인된다."        }      ],"source":"seed"    }  },"error":null}
```

### **오류**

| **Status** | **Code** | **상황** |
| --- | --- | --- |
| 404 | NOT_FOUND | 제품이 없음 |
| 404 | PROFILE_NOT_FOUND | 제품은 있으나 현재 Product Profile이 없음 |

---

## **4.3 Customer Intelligence 목록 조회**

### **Endpoint**

http

```
GET /api/customers
```

### **목적**

데모 고객 목록과 Customer Taste Profile 준비 상태를 조회한다.

### **사용 화면**

- AI Knowledge Base Dashboard
- Customer Intelligence 목록

### **Response**

json

```json
{"success":true,"data": {"items": [      {"customerId":"uuid","customerCode":"DEMO-CUSTOMER-001","displayName":"MCM 고객 A","tasteProfileStatus":"ready","source":"seed"      }    ],"total":1  },"error":null}
```

### **Response Field**

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| customerId | string | 데모 고객 UUID |
| customerCode | string | 데모 고객 코드 |
| displayName | string | 익명화된 화면 표시 이름 |
| tasteProfileStatus | string | **`ready`** 또는 **`missing`** |
| source | string | **`seed`** 또는 **`ai_generated`** |

---

## **4.4 Customer Taste Profile 상세 조회**

### **Endpoint**

http

```
GET /api/customers/{customerId}
```

### **목적**

선택한 데모 고객의 Customer Taste Profile과 근거 제품을 조회한다.

### **사용 화면**

- Customer Intelligence 상세

### **Path Parameter**

| **Parameter** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| customerId | uuid | Yes | 데모 고객 UUID |

### **Response**

json

```json
{"success":true,"data": {"customer": {"customerId":"uuid","customerCode":"DEMO-CUSTOMER-001","displayName":"MCM 고객 A","description":"구조적인 형태와 헤리티지 표현이 있는 제품을 반복 선택한 데모 고객"    },"tasteProfile": {"profileId":"uuid","tasteSummary":"구조적인 형태와 헤리티지 표현이 드러나는 제품을 반복적으로 선택한다.","corePreference": {"colorTone": ["cognac","neutral"],"silhouetteForm": ["structured","compact"],"material": ["visetos_coated_canvas","leather"],"monogramDensity": ["medium","high"]      },"aiTraits": [        {"name":"Heritage-oriented Style","reason":"모노그램과 구조적 형태를 가진 제품을 반복 선택한다.","evidenceProductIds": ["uuid","uuid"]        }      ],"evidenceProducts": [        {"productId":"uuid","productName":"MCM 백팩","imageUrl":"/images/products/product-001.jpg","selectionType":"purchase"        }      ],"source":"seed"    }  },"error":null}
```

### **오류**

| **Status** | **Code** | **상황** |
| --- | --- | --- |
| 404 | NOT_FOUND | 고객이 없음 |
| 404 | PROFILE_NOT_FOUND | 고객은 있으나 Customer Taste Profile이 없음 |

---

## **4.5 Event Intelligence 목록 조회**

### **Endpoint**

http

```
GET /api/events
```

### **목적**

사전 구축 이벤트 목록과 Event Meaning Profile 준비 상태를 조회한다.

### **사용 화면**

- AI Knowledge Base Dashboard
- Event Intelligence 목록
- Event Trigger 화면

### **Response**

json

```json
{"success":true,"data": {"items": [      {"eventId":"uuid","eventCode":"DEMO-EVENT-001","eventName":"MCM 새 컬렉션","eventType":"collection","eventMeaningProfileStatus":"ready","source":"seed"      }    ],"total":1  },"error":null}
```

### **Response Field**

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| eventId | string | 이벤트 UUID |
| eventCode | string | 데모 이벤트 코드 |
| eventName | string | 이벤트명 |
| eventType | string | **`collection`**, **`campaign`**, **`brand_event`** |
| eventMeaningProfileStatus | string | **`ready`** 또는 **`missing`** |
| source | string | **`seed`** 또는 **`ai_generated`** |

---

## **4.6 Event Meaning Profile 상세 조회**

### **Endpoint**

http

```
GET /api/events/{eventId}
```

### **목적**

선택한 이벤트의 기본 정보와 Event Meaning Profile을 조회한다.

### **사용 화면**

- Event Intelligence 상세
- Event Trigger 선택 상세

### **Path Parameter**

| **Parameter** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| eventId | uuid | Yes | 이벤트 UUID |

### **Response**

json

```json
{"success":true,"data": {"event": {"eventId":"uuid","eventCode":"DEMO-EVENT-001","eventName":"MCM 새 컬렉션","eventType":"collection","campaignOverview":"새 컬렉션 소개","brandMessage":"MCM 헤리티지를 도시적 이동 경험으로 확장한다.","collectionConcept":"Modern Heritage and Urban Mobility","relatedProducts": [        {"productId":"uuid","productName":"MCM 백팩","imageUrl":"/images/products/product-001.jpg"        }      ]    },"meaningProfile": {"profileId":"uuid","eventTheme":"Modern Heritage","brandDirection":"헤리티지를 도시적 이동 경험으로 재해석한다.","eventTraits": ["Urban Mobility","Refined Utility"      ],"evidence": [        {"source":"event_data","text":"새 컬렉션은 MCM 헤리티지를 도시적 이동 경험으로 확장한다."        }      ],"source":"seed"    }  },"error":null}
```

---

## **5. Optional AI Demo API**

## **5.1 Test Product Analysis**

### **Endpoint**

http

```
POST /api/products/analyze
```

### **목적**

Product Understanding AI Pipeline을 테스트한다.

실제 Product 등록이나 CMS 제품 관리 기능이 아니다.

### **사용 화면**

- Product Intelligence 상세
- 제품 분석 테스트

### **Request**

**`multipart/form-data`** 형식을 사용한다.

| **Field** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| image | file | Yes | 제품 대표 이미지 1장 |
| description | string | Yes | 제품 설명 |
| metadata | string | No | JSON 문자열 형태의 선택 메타데이터 |
| saveResult | boolean | No | 결과 저장 여부. 기본값은 **`false`**다. |

### **Request 예시**

text

```
image: product-image.jpgdescription: Visetos 캔버스와 가죽 트리밍으로 구성된 구조적 백팩입니다.metadata: {"category":"backpack","collection":"Visetos"}saveResult: false
```

### **Process**

text

```
Product Image    +Product Description    +Optional Metadata    ↓OpenAI Multimodal LLM    ↓Product Profile 생성    ↓Zod Schema Validation    ↓Evidence 검증    ↓선택적으로 Product Profile 저장    ↓Response 반환
```

### **Response**

json

```json
{"success":true,"data": {"productProfile": {"core4": {"colorTone":"cognac","silhouetteForm":"structured_backpack","material":"visetos_coated_canvas","monogramDensity":"high"      },"aiProductTraits": [        {"name":"Modern Heritage","reason":"시그니처 모노그램과 구조적 형태를 결합한다.","evidence": [            {"source":"product_description","text":"Visetos 캔버스와 구조적인 형태가 설명에 포함된다."            }          ]        }      ],"evidence": [        {"source":"product_image","text":"제품 전면에 반복 모노그램 패턴이 확인된다."        }      ],"source":"ai_generated"    },"saved":false  },"error":null}
```

### **Validation**

- 이미지와 제품 설명이 모두 있어야 한다.
- Core4는 허용 Enum 또는 **`null`**만 허용한다.
- AI Product Trait은 2~3개여야 한다.
- Trait마다 이유와 Evidence가 있어야 한다.
- Validation 실패 결과는 저장하지 않는다.

---

## **5.2 Refresh Taste Profile**

### **Endpoint**

http

```
POST /api/customers/{customerId}/refresh-taste
```

### **목적**

데모 고객의 추가 제품 선택을 기반으로 Customer Taste Profile 갱신 결과를 생성한다.

실제 CRM 업데이트나 실시간 고객 행동 분석 기능이 아니다.

### **사용 화면**

- Customer Intelligence 상세
- 고객 취향 프로필 갱신

### **Path Parameter**

| **Parameter** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| customerId | uuid | Yes | 데모 고객 UUID |

### **Request**

json

```json
{"additionalSelections": [    {"productId":"uuid","selectionType":"wishlist"    }  ],"saveResult":false}
```

### **Request Field**

| **Field** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| additionalSelections | array | Yes | 추가할 데모 제품 선택 |
| additionalSelections[].productId | uuid | Yes | 선택 제품 UUID |
| additionalSelections[].selectionType | string | Yes | **`purchase`** 또는 **`wishlist`** |
| saveResult | boolean | No | 갱신 결과 저장 여부. 기본값은 **`false`**다. |

### **Process**

text

```
현재 Customer Product Selection    +추가 Product Selection    +연결된 Product Profile    ↓Customer Taste Discovery    ↓Updated Customer Taste Profile    ↓Zod Validation    ↓선택적으로 저장    ↓Response 반환
```

### **Response**

json

```json
{"success":true,"data": {"previousProfile": {"profileId":"uuid","tasteSummary":"기존 취향 요약"    },"updatedProfile": {"tasteSummary":"갱신된 취향 요약","corePreference": {"colorTone": ["cognac","neutral"],"silhouetteForm": ["structured","compact"],"material": ["visetos_coated_canvas"],"monogramDensity": ["medium","high"]      },"aiTraits": [        {"name":"Modern Heritage","reason":"복수 제품에서 헤리티지 표현과 구조적 실루엣이 반복된다.","evidenceProductIds": ["uuid","uuid","uuid"]        }      ],"evidenceProductIds": ["uuid","uuid","uuid"],"source":"ai_generated"    },"saved":false  },"error":null}
```

### **Validation**

- 추가 제품은 유효한 **`products.id`**여야 한다.
- 선택 제품마다 현재 Product Profile이 있어야 한다.
- AI Trait은 최소 2개 제품을 Evidence로 사용해야 한다.
- 결과 저장 시 기존 Profile은 유지하고 새 Profile을 생성한다.
- 저장한 결과만 **`is_current = true`**로 변경할 수 있다.

---

## **6. Event Trigger API**

## **6.1 AI Editorial Engine 실행 시작**

### **Endpoint**

http

```
POST /api/reasoning/start
```

### **목적**

선택한 데모 고객과 이벤트를 기준으로 AI Editorial Engine 실행을 시작한다.

### **사용 화면**

- Event Trigger
- 이벤트 선택 화면

### **Request**

json

```json
{"customerId":"uuid","eventId":"uuid","mode":"demo"}
```

### **Request Field**

| **Field** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| customerId | uuid | Yes | 분석 대상 데모 고객 |
| eventId | uuid | Yes | 선택한 이벤트 |
| mode | string | No | **`demo`** 또는 **`ai`**. 기본값은 **`demo`**다. |

### **Process**

text

```
Customer Taste Profile 조회    +Event Meaning Profile 조회    +Event Related Product Profile 조회    ↓Reasoning Run 생성    ↓demo 모드    └── 사전 생성 Matching / Gatekeeper Result 연결ai 모드    └── AI Meaning Matching 실행            ↓        Gatekeeper 판단    ↓Reasoning Run 완료
```

### **Response**

json

```json
{"success":true,"data": {"reasoningRunId":"uuid","status":"completed","mode":"demo","nextPath":"/reasoning/uuid"  },"error":null}
```

### **처리 기준**

- **`mode = demo`**는 Seed Data 기반 대표 실행 결과를 사용한다.
- **`mode = ai`**는 Matching Service와 Gatekeeper Service를 호출한다.
- 필수 Profile이 없으면 실행하지 않는다.
- REJECT는 정상 실행 결과이며 HTTP 200으로 반환한다.
- AI 호출 실패 시 대표 Demo Flow에 해당하면 Fallback Result를 반환할 수 있다.

---

## **7. AI Reasoning API**

## **7.1 Reasoning Journey 조회**

### **Endpoint**

http

```
GET /api/reasoning/{runId}
```

### **목적**

AI Reasoning Journey 화면에 필요한 실행 결과를 순서대로 조회한다.

### **사용 화면**

- AI Reasoning Journey
- REJECT 결과 화면
- PASS 이후 Personal Editorial 미리보기 진입

### **Path Parameter**

| **Parameter** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| runId | uuid | Yes | Reasoning Run UUID |

### **Response**

json

```json
{"success":true,"data": {"reasoningRun": {"reasoningRunId":"uuid","status":"completed","customerId":"uuid","eventId":"uuid","source":"seed","startedAt":"2026-08-17T09:00:00Z","completedAt":"2026-08-17T09:00:03Z"    },"eventMeaning": {"eventTheme":"Modern Heritage","brandDirection":"헤리티지를 도시적 이동 경험으로 재해석한다.","eventTraits": ["Urban Mobility","Refined Utility"],"evidence": []    },"matchingResult": {"customerEvidence": {"summary":"고객은 구조적 형태와 헤리티지 표현을 반복 선택했다.","corePreferenceEvidence": ["structured silhouette"],"traitEvidence": ["Modern Heritage"],"evidenceProductIds": ["uuid","uuid"]      },"productEventEvidence": {"summary":"새 컬렉션은 구조적 헤리티지를 도시적 이동 경험으로 확장한다.","eventEvidence": ["Urban Mobility"],"productEvidence": ["lightweight structure"],"relatedProductIds": ["uuid"]      },"meaningBridge": {"existingPreference":"구조적 헤리티지 표현을 선호한다.","newBrandExpression":"헤리티지를 더 가볍고 도시적인 이동 경험으로 확장한다.","connectionReason":"기존 취향을 유지하면서 새로운 사용 맥락을 제공한다.","discoveryValue":"단순 반복이 아닌 새로운 브랜드 발견을 제공한다."      },"candidateProductIds": ["uuid"]    },"gatekeeperResult": {"gatekeeperResultId":"uuid","decision":"PASS","reason":"고객 근거, 제품·이벤트 근거, 새로운 발견 가치가 모두 확인됐다.","editorialAngle":"구조적 헤리티지에서 도시적 이동으로의 확장","failedRules": []    },"editorial": {"editorialId":"uuid","available":true    }  },"error":null}
```

### **REJECT 응답 기준**

json

```json
{"success":true,"data": {"gatekeeperResult": {"decision":"REJECT","reason":"새로운 브랜드 표현과 고객 취향의 연결 근거가 부족합니다.","editorialAngle":null,"failedRules": ["MISSING_DISCOVERY_VALUE"      ]    },"editorial": {"editorialId":null,"available":false    }  },"error":null}
```

---

## **8. Matching API**

```
## Matching API 사용 기준

`/api/reasoning/start`는 실제 MCM Personal Editorial Engine의 대표 Demo Flow 실행을 위한 Entry Point이다.

사용자가 고객과 이벤트를 선택하면 해당 API를 통해 전체 Pipeline 실행을 시작한다.

Flow:

Customer Taste Profile 조회
↓
Event Meaning Profile 조회
↓
AI Meaning Matching
↓
Meaning Bridge 생성
↓
Editorial Gatekeeper
↓
Personal Editorial 생성

`/api/matching`은 AI Meaning Matching Pipeline 자체를 독립적으로 테스트하고 검증하기 위한 Internal API로 사용한다.

대표 사용자 Flow에서는 직접 호출하지 않는다.
```

## **8.1 AI Meaning Matching 실행**

### **Endpoint**

http

```
POST /api/matching
```

### **목적**

Customer Taste Profile, Event Meaning Profile, 관련 Product Profile을 사용해 AI Meaning Matching을 실행한다.

이 API는 AI Pipeline 검증 또는 독립적인 Matching 테스트에 사용한다.

일반적인 대표 Demo Flow는 **`/api/reasoning/start`**를 우선 사용한다.

### **Request**

json

```json
{"customerId":"uuid","eventId":"uuid","saveResult":true}
```

### **Request Field**

| **Field** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| customerId | uuid | Yes | 분석 대상 고객 |
| eventId | uuid | Yes | 분석 대상 이벤트 |
| saveResult | boolean | No | Matching Result 저장 여부. 기본값은 **`true`**다. |

### **Process**

text

```
Customer Taste Profile 조회    +Event Meaning Profile 조회    +Related Product Profile 조회    ↓AI Meaning Matching    ↓Customer Evidence 생성    ↓Product/Event Evidence 생성    ↓Meaning Bridge 생성    ↓Candidate Product 선정    ↓Zod Validation    ↓선택적 저장
```

### **Response**

json

```json
{"success":true,"data": {"matchingResultId":"uuid","customerEvidence": {"summary":"고객은 구조적인 형태와 헤리티지 표현을 반복 선택했다.","corePreferenceEvidence": ["structured silhouette","high monogram density"      ],"traitEvidence": ["Modern Heritage"      ],"evidenceProductIds": ["uuid","uuid"]    },"productEventEvidence": {"summary":"새 컬렉션은 헤리티지를 도시적 이동 경험으로 확장한다.","eventEvidence": ["Urban Mobility"      ],"productEvidence": ["refined utility"      ],"relatedProductIds": ["uuid"]    },"meaningBridge": {"existingPreference":"구조적 헤리티지 표현을 선호한다.","newBrandExpression":"새 컬렉션은 더 가볍고 도시적인 사용 경험을 제안한다.","connectionReason":"기존 취향의 형태 언어를 유지하면서 새로운 사용 맥락을 제공한다.","discoveryValue":"반복 추천이 아닌 브랜드 표현의 확장을 발견하게 한다."    },"candidateProductIds": ["uuid"],"isValid":true,"source":"ai_generated"  },"error":null}
```

### **Validation**

- Customer Taste Profile이 있어야 한다.
- Event Meaning Profile이 있어야 한다.
- 이벤트 관련 Product Profile이 있어야 한다.
- Customer Evidence, Product/Event Evidence, Meaning Bridge가 모두 있어야 한다.
- 후보 제품은 1~3개만 허용한다.
- Evidence 부족 시 **`422 VALIDATION_FAILED`**를 반환한다.

---

## **9. Gatekeeper API**

## **9.1 Editorial 발행 가능 여부 판단**

### **Endpoint**

http

```
POST /api/gatekeeper
```

### **목적**

Matching Result를 평가해 Personal Editorial 발행 가능 여부를 PASS 또는 REJECT로 결정한다.

### **Request**

기존 저장 결과를 사용하는 방식을 기본으로 한다.

json

```json
{"matchingResultId":"uuid","reasoningRunId":"uuid"}
```

### **Request Field**

| **Field** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| matchingResultId | uuid | Yes | 평가 대상 Matching Result |
| reasoningRunId | uuid | Yes | 연결할 Reasoning Run |

### **Process**

text

```
Matching Result 조회    ↓필수 ID 검증    ↓Customer Evidence 검증    ↓Product/Event Evidence 검증    ↓Meaning Bridge 검증    ↓새로운 발견 가치 검증    ↓PASS 또는 REJECT 저장
```

### **PASS Response**

json

```json
{"success":true,"data": {"gatekeeperResultId":"uuid","decision":"PASS","reason":"고객 근거, 제품·이벤트 근거, 새로운 발견 가치가 모두 확인됐다.","editorialAngle":"구조적 헤리티지에서 도시적 이동으로의 확장","candidateProductIds": ["uuid"],"failedRules": []  },"error":null}
```

### **REJECT Response**

json

```json
{"success":true,"data": {"gatekeeperResultId":"uuid","decision":"REJECT","reason":"고객의 기존 선택과 이벤트의 새 브랜드 표현을 잇는 근거가 부족하다.","editorialAngle":null,"candidateProductIds": ["uuid"],"failedRules": ["MISSING_MEANING_BRIDGE","INSUFFICIENT_DISCOVERY_VALUE"    ]  },"error":null}
```

### **Gatekeeper 규칙**

text

```
PASS- Customer Evidence가 존재한다.- Product/Event Evidence가 존재한다.- Meaning Bridge가 존재한다.- 새로운 발견 가치가 존재한다.- 후보 제품이 존재한다.- 필수 ID와 JSON 구조가 유효하다.REJECT- 기존 취향의 단순 반복이다.- Evidence가 누락됐다.- Meaning Bridge가 없다.- 새로운 발견 가치가 없다.- 필수 ID 또는 JSON 구조가 유효하지 않다.
```

### **후속 처리**

text

```
PASS    ↓POST /api/editorials 호출 가능REJECT    ↓Personal Editorial 생성 불가    ↓REJECT 결과 화면 표시
```

---

## **10. Editorial API**

## **10.1 Personal Editorial 생성**

### **Endpoint**

http

```
POST /api/editorials
```

### **목적**

PASS된 Gatekeeper Result를 기반으로 Personal Editorial을 생성하고 저장한다.

### **Request**

json

```json
{"gatekeeperResultId":"uuid","mode":"demo"}
```

### **Request Field**

| **Field** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| gatekeeperResultId | uuid | Yes | PASS Gatekeeper Result UUID |
| mode | string | No | **`demo`** 또는 **`ai`**. 기본값은 **`demo`**다. |

### **Process**

text

```
Gatekeeper Result 조회    ↓PASS 여부 확인    ↓Reasoning Run 조회    ↓Customer Taste Profile + Event Meaning Profile + Product Profile 조회    ↓demo 모드    └── 사전 생성 Personal Editorial 반환ai 모드    └── OpenAI Editorial Generation 실행    ↓Personal Editorial JSON 검증    ↓DB 저장
```

### **Response**

json

```json
{"success":true,"data": {"editorialId":"uuid","title":"MY MCM ISSUE","heroImageUrl":"/images/editorial-hero.jpg","brandStory":"새 컬렉션은 MCM의 헤리티지를 도시적 이동 경험으로 재해석합니다.","personalConnection":"고객이 선택해 온 구조적 형태와 헤리티지 표현은 이번 컬렉션의 새로운 방향과 연결됩니다.","productDiscovery": [      {"productId":"uuid","productName":"MCM 백팩","imageUrl":"/images/products/product-001.jpg","description":"구조적 헤리티지 선호를 더 가볍고 도시적인 이동 경험으로 확장하는 제품입니다."      }    ],"closingMessage":"MCM의 새로운 표현을 고객의 기존 취향 맥락에서 발견해 보세요.","source":"seed"  },"error":null}
```

### **오류**

| **Status** | **Code** | **상황** |
| --- | --- | --- |
| 404 | NOT_FOUND | Gatekeeper Result가 없음 |
| 400 | EDITORIAL_NOT_ALLOWED | Gatekeeper Result가 REJECT임 |
| 422 | VALIDATION_FAILED | 생성된 Editorial JSON이 유효하지 않음 |
| 503 | AI_SERVICE_UNAVAILABLE | AI 생성 실패 및 Fallback Editorial 없음 |

---

## **10.2 Personal Editorial 조회**

### **Endpoint**

http

```
GET /api/editorials/{editorialId}
```

### **목적**

저장된 Personal Editorial JSON을 조회한다.

### **사용 화면**

- Personal Editorial Preview

### **Path Parameter**

| **Parameter** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| editorialId | uuid | Yes | Personal Editorial UUID |

### **Response**

json

```json
{"success":true,"data": {"editorialId":"uuid","reasoningRunId":"uuid","customerId":"uuid","eventId":"uuid","title":"MY MCM ISSUE","heroImageUrl":"/images/editorial-hero.jpg","brandStory":"브랜드·이벤트 스토리","personalConnection":"고객 선택 근거 기반 개인 연결","productDiscovery": [      {"productId":"uuid","productName":"MCM 백팩","imageUrl":"/images/products/product-001.jpg","description":"제품 발견 설명"      }    ],"closingMessage":"마무리 메시지","source":"seed","createdAt":"2026-08-17T09:00:00Z"  },"error":null}
```

---

## **11. Email Experience API**

## **11.1 Email Preview 조회**

### **Endpoint**

http

```
GET /api/email/{editorialId}
```

### **목적**

Personal Editorial을 Email Experience에 맞는 View Model로 변환해 반환한다.

### **사용 화면**

- 이메일 에디토리얼 미리보기
- 고객 이메일 에디토리얼 화면

### **Path Parameter**

| **Parameter** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| editorialId | uuid | Yes | Personal Editorial UUID |

### **Process**

text

```
Personal Editorial 조회    ↓Email View Model 생성    ↓HTML Email Template 바인딩용 데이터 반환
```

### **Response**

json

```json
{"success":true,"data": {"editorialId":"uuid","emailSubject":"MY MCM ISSUE | 새로운 브랜드 발견","previewText":"고객의 기존 선택과 연결되는 MCM의 새로운 표현을 확인해 보세요.","heroImage": {"url":"/images/editorial-hero.jpg","alt":"MCM 새 컬렉션"    },"content": {"title":"MY MCM ISSUE","brandStory":"브랜드·이벤트 스토리","personalConnection":"고객 선택 근거 기반 개인 연결","productDiscovery": [        {"productId":"uuid","productName":"MCM 백팩","imageUrl":"/images/products/product-001.jpg","description":"제품 발견 설명"        }      ],"closingMessage":"마무리 메시지"    }  },"error":null}
```

### **구현 기준**

- API는 HTML 문자열보다 Email Template에 전달할 데이터를 우선 반환한다.
- Frontend는 React 기반 Email Preview Template에 데이터를 바인딩한다.
- 필요하면 **`renderEmailHtml()`** Service로 HTML을 생성할 수 있다.
- 실제 고객 대상 이메일 발송은 제공하지 않는다.

---

## **11.2 Test Email 전달**

### **Endpoint**

http

```
POST /api/email/send-test
```

### **목적**

담당자가 Personal Editorial 기반 이메일을 테스트 주소로 전달한다.

이 API는 선택 기능이다. 실제 고객 대량 발송, 캠페인 자동화, 성과 측정은 포함하지 않는다.

### **Request**

json

```json
{"editorialId":"uuid","recipient":"test@example.com"}
```

### **Request Field**

| **Field** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| editorialId | uuid | Yes | Personal Editorial UUID |
| recipient | string | Yes | 테스트 수신 이메일 주소 |

### **Process**

text

```
Personal Editorial 조회    ↓Email View Model 생성    ↓HTML Email 렌더링    ↓선택적 이메일 서비스 호출    ↓전달 결과 반환
```

### **Response**

json

```json
{"success":true,"data": {"editorialId":"uuid","recipient":"test@example.com","status":"sent","sentAt":"2026-08-17T09:30:00Z"  },"error":null}
```

### **검증 기준**

- 유효한 Personal Editorial이 있어야 한다.
- **`recipient`**은 이메일 형식이어야 한다.
- 테스트용 수신 주소만 사용한다.
- MVP에서는 전달 이력을 별도 테이블에 저장하지 않아도 된다.
- Resend 등 외부 이메일 서비스 연결은 선택 사항이다.

---

## **12. API-Service Mapping**

| **API 영역** | **Endpoint** | **Service** | **주요 책임** |
| --- | --- | --- | --- |
| Product API | **`GET /api/products`** | Product Service | Product Intelligence 목록 조회 |
| Product API | **`GET /api/products/{productId}`** | Product Service | Product Profile 상세 조회 |
| Product API | **`POST /api/products/analyze`** | Product Service | Product Understanding AI 테스트 |
| Customer API | **`GET /api/customers`** | Customer Service | Customer Intelligence 목록 조회 |
| Customer API | **`GET /api/customers/{customerId}`** | Customer Service | Customer Taste Profile 조회 |
| Customer API | **`POST /api/customers/{customerId}/refresh-taste`** | Customer Service | Customer Taste Profile 갱신 |
| Event API | **`GET /api/events`** | Event Service | Event Intelligence 목록 조회 |
| Event API | **`GET /api/events/{eventId}`** | Event Service | Event Meaning Profile 조회 |
| Reasoning API | **`POST /api/reasoning/start`** | Reasoning Run Service | AI Editorial Engine 실행 시작 |
| Reasoning API | **`GET /api/reasoning/{runId}`** | Reasoning Run Service | AI Reasoning Journey 조회 |
| Matching API | **`POST /api/matching`** | Matching Service | AI Meaning Matching 실행`(Internal Pipeline Test용)` |
| Gatekeeper API | **`POST /api/gatekeeper`** | Gatekeeper Service | PASS·REJECT 판단 |
| Editorial API | **`POST /api/editorials`** | Editorial Service | Personal Editorial 생성 |
| Editorial API | **`GET /api/editorials/{editorialId}`** | Editorial Service | Personal Editorial 조회 |
| Email API | **`GET /api/email/{editorialId}`** | Email Service | Email Preview 데이터 조회 |
| Email API | **`POST /api/email/send-test`** | Email Service | 테스트 이메일 전달 |

---

## **13. Validation & Error Handling**

## **13.1 공통 요청 Validation**

모든 API는 요청 처리 전에 다음을 검증한다.

text

```
Path Parameter    ↓Query Parameter    ↓Request Body    ↓UUID 형식 검증    ↓필수 필드 검증    ↓Service Layer 호출
```

사용 도구:

text

```
Zod
```

예시:

ts

```tsx
constStartReasoningSchema= z.object({  customerId: z.string().uuid(),  eventId: z.string().uuid(),  mode: z.enum(["demo","ai"]).default("demo"),});
```

---

## **13.2 AI 결과 처리 Flow**

text

```
OpenAI Response    ↓JSON Parse    ↓Zod Validation    ↓Required Field Check    ↓Enum Validation    ↓Evidence Validation    ↓Supabase 저장    ↓Frontend 반환
```

### **필수 검증 기준**

| **결과** | **검증 기준** |
| --- | --- |
| Product Profile | Core4, 2~3개 Trait, 각 Trait의 이유와 Evidence |
| Customer Taste Profile | Taste Summary, Core Preference, 복수 제품 기반 Evidence |
| Event Meaning Profile | Event Theme, Brand Direction, Event Traits, Evidence |
| Matching Result | Customer Evidence, Product/Event Evidence, Meaning Bridge, 후보 제품 |
| Gatekeeper PASS | 유효한 Evidence, 새로운 발견 가치, Editorial Angle |
| Personal Editorial | Title, Brand Story, Personal Connection, Product Discovery, Closing Message |

---

## **13.3 AI 오류 처리**

### **AI 응답 오류**

text

```
OpenAI 호출 실패    ↓대표 Demo Flow 여부 확인    ↓사전 생성 JSON Fallback 반환    ↓Fallback도 없으면 503 반환
```

json

```json
{"success":false,"data":null,"error": {"code":"AI_SERVICE_UNAVAILABLE","message":"AI 분석 결과를 생성하지 못했습니다."  }}
```

### **JSON Parse 실패**

json

```json
{"success":false,"data":null,"error": {"code":"AI_RESPONSE_INVALID","message":"AI 응답 형식을 처리할 수 없습니다."  }}
```

### **필수 필드 누락**

json

```json
{"success":false,"data":null,"error": {"code":"VALIDATION_FAILED","message":"필수 분석 정보가 누락되었습니다."  }}
```

### **Evidence 부족**

json

```json
{"success":false,"data":null,"error": {"code":"VALIDATION_FAILED","message":"판단 근거가 부족해 결과를 사용할 수 없습니다."  }}
```

### **데이터 없음**

json

```json
{"success":false,"data":null,"error": {"code":"PROFILE_NOT_FOUND","message":"AI 실행에 필요한 Intelligence Profile을 찾을 수 없습니다."  }}
```

---

## **13.4 Frontend 처리 기준**

| **API 상태** | **Frontend 처리** |
| --- | --- |
| 200 + PASS | AI Reasoning Journey 표시 후 Personal Editorial 진입 허용 |
| 200 + REJECT | REJECT 이유 표시, Editorial 진입 차단 |
| 400 | 입력값 오류 안내 |
| 404 | 빈 상태 또는 데이터 없음 안내 |
| 422 | AI 결과 검증 실패 안내, 재시도 또는 Demo Result 사용 |
| 503 | AI 분석 실패 안내, 대표 Demo라면 Fallback 결과 표시 |
| 500 | 일반 오류 상태와 재시도 안내 |

---

## **14. MVP API 제외 범위**

아래 API는 MVP에 포함하지 않는다.

text

```
- Authentication API- User Management API- Role Management API- CRM Sync API- CMS API- Product CRUD API- Customer CRUD API- Event CRUD API- Order API- Payment API- Real-time Event API- Webhook API- Bulk Email API- Email Campaign API- Marketing Automation API- Analytics API- A/B Test API- Notification API
```

---

## **15. 권장 Next.js Route 구조**

text

```
src/app/api├── products│   ├── route.ts│   ├── [productId]│   │   └── route.ts│   └── analyze│       └── route.ts│├── customers│   ├── route.ts│   └── [customerId]│       ├── route.ts│       └── refresh-taste│           └── route.ts│├── events│   ├── route.ts│   └── [eventId]│       └── route.ts│├── reasoning│   ├── start│   │   └── route.ts│   └── [runId]│       └── route.ts│├── matching│   └── route.ts│├── gatekeeper│   └── route.ts│├── editorials│   ├── route.ts│   └── [editorialId]│       └── route.ts│└── email    ├── [editorialId]    │   └── route.ts    └── send-test        └── route.ts
```

---

## **16. API Final Summary**

## **16.1 Core P0 API**

MVP Demo Flow를 구성하는 필수 API다.

| **API** | **Endpoint** | **목적** |
| --- | --- | --- |
| Product Intelligence 목록 | **`GET /api/products`** | AI Knowledge Base 제품 목록 |
| Product Profile 상세 | **`GET /api/products/{productId}`** | 제품 분석 결과와 Evidence 조회 |
| Customer Intelligence 목록 | **`GET /api/customers`** | 데모 고객 목록 |
| Customer Taste Profile 상세 | **`GET /api/customers/{customerId}`** | 고객 취향과 근거 제품 조회 |
| Event Intelligence 목록 | **`GET /api/events`** | 이벤트 목록 조회 |
| Event Meaning Profile 상세 | **`GET /api/events/{eventId}`** | 이벤트 의미 분석 결과 조회 |
| Event Trigger | **`POST /api/reasoning/start`** | AI Editorial Engine 실행 시작 |
| Reasoning Journey 조회 | **`GET /api/reasoning/{runId}`** | AI 판단 흐름과 PASS·REJECT 조회 |
| Matching | **`POST /api/matching`** | AI Meaning Matching 실행 |
| Gatekeeper | **`POST /api/gatekeeper`** | 발행 가능 여부 판단 |
| Editorial 생성 | **`POST /api/editorials`** | PASS 결과의 Personal Editorial 생성 |
| Editorial 조회 | **`GET /api/editorials/{editorialId}`** | Personal Editorial 미리보기 |
| Email Preview | **`GET /api/email/{editorialId}`** | Email Experience 렌더링 데이터 |

## **16.2 P1 API**

AI Pipeline 검증과 선택적 데모 상호작용을 위한 API다.

| **API** | **Endpoint** | **목적** |
| --- | --- | --- |
| Product Analysis | **`POST /api/products/analyze`** | 제품 이미지·설명 기반 Product Understanding 테스트 |
| Refresh Taste Profile | **`POST /api/customers/{customerId}/refresh-taste`** | 데모 고객 취향 Profile 갱신 |
| Test Email | **`POST /api/email/send-test`** | 테스트 주소 대상 이메일 전달 |

## **16.3 최종 Flow**

text

```
AI Knowledge Base 조회    ↓Event Trigger    ↓AI Meaning Matching    ↓Meaning Bridge 생성    ↓Editorial Gatekeeper    ↓PASS    ↓Personal Editorial 생성    ↓Email Preview 렌더링
```

> ***이 API 구조는 Seed Data 기반 Demo Experience를 우선 제공하면서, 필요한 구간만 OpenAI 기반 AI Pipeline으로 교체·검증할 수 있도록 구성한다. 실제 CRM·CMS 운영 API를 만들지 않고도 MCM Personal Editorial Engine의 핵심 AI Experience를 구현할 수 있다.***
> 

### 프로젝트 정보

프로젝트의 목표와 맥락에 대한 개요를 제공합니다.

### 액션 아이템

- [ ]  

### 문서

[https://app.notion.com](https://app.notion.com)