# [매니페스트]AI Logic 최종 정리

담당자: 성경 이
상태: 완료
상태 (1): 시작 전
시작일: 08/13/2026
종료일: 08/16/2026
우선순위: 높음
팀: AI

### Evidence Grounding 원칙 (추가)

모든 AI 판단 결과는 반드시 실제 Product 데이터 기반 근거(Evidence) 를 포함한다.

공통 원칙에 해당

서비스의 포인트

> LLM이 고객과 제품 데이터를 기반으로 취향 패턴을 발견하고, 모든 판단을 실제 Evidence와 연결해 Editorial 발행 여부를 결정합니다.
> 

#### 1. Product Understanding AI

제품 Trait 생성 시:

Input:

- Product Image
- Product Description

Output:

```
{
 "core4": {
   "material": "leather",
   "silhouette": "soft"
 },

 "product_traits": [
   {
    "trait": "heritage inspired",
    "reason": "Visetos pattern and classic structured design",
    "evidence": [
      "image",
      "description"
    ]
   }
 ]
}
```

의미:

AI가 "Heritage 느낌입니다"라고 말하는 게 아니라 왜 그렇게 판단했는지 저장.

---

### 2. Customer Taste Discovery AI

고객 Profile 생성 시:

Input:

Customer가 구매한 제품들의 Product Profile

↓

Output:

```
{
 "customer_traits": [
  {
   "trait": "material-led expression",

   "reason":
   "Customer repeatedly selected leather products with minimal branding",

   "evidence_products": [
    "Leather Tote",
    "Leather Backpack"
   ]
  }
 ]
}
```

즉:

AI:

"이 고객은 소재 중심 취향입니다" 라고 끝나는 게 아니라,

"왜냐하면 이 제품들을 계속 선택했기 때문" 이라는 근거 연결.

---

### 3. AI Meaning Matching

여기가 제일 중요.

Event Product와 Customer Profile 연결할 때:

Output:

```
{
 "connection": {
   "customer_basis":
   "Customer prefers soft leather products",

   "product_basis":
   "Tokyo collection introduces soft leather silhouette",

   "bridge":
   "Existing preference is expressed through a new Tokyo color language"
 }
}
```

즉 AI가:

"잘 맞음" 이라고 하는 게 아니라

- 고객 쪽 근거
- 제품 쪽 근거
- 둘 사이 연결 을 만들어야 함.

---

### 4. Gatekeeper 판단 기준에도 Evidence 포함

Gatekeeper 질문:

> "이 연결이 실제 데이터에 기반한 새로운 발견인가?"
> 

판단:

PASS:

```
Evidence:
Customer selected leather + low monogram products repeatedly.

New Product:
Same material preference,
different Tokyo expression.

Decision:
PASS
```

REJECT:

```
Evidence:
Only similarity is color.

Decision:
Existing preference repetition.
REJECT
```

---

그래서 최종적으로 아래의 내용이 최종 구조에 해당

```
AI Output 구조

{
 Result,
 Reason,
 Evidence
}
```

---

---

### 1. Product Understanding AI Detail

#### 목적

: MCM의 전체 Product를 AI가 이해 가능한 형태로 구조화한다.

제품 이미지와 설명 데이터를 기반으로:

- 정형화된 제품 특징(Core4)
- Core4만으로 설명하기 어려운 추가 특징(AI Product Trait) 을 추출하여 **Product Profile을 생성**한다.

생성된 Product Profile은 이후:

- Customer Taste Discovery (Customer Profile)
- AI Meaning Matching 에서 공통 데이터로 활용된다.

으로 고객 취향과 신규 제품을 연결하기 위한 기반 데이터로 활용된다.

#### INPUT DATA

- 최종 Input Data Schema (Product Understanding)
    
    MVP Product 수 → **30개** 
    
    - 고객 구매 제품 3~5개
    - 후보 제품 5~10개
    - 나머지 제품 DB
    
    ```
    MCM Product Data
    
    ├── Product Image
    │   └── 대표 이미지 1장
    │
    ├── Product Description
    │   └── 크롤링 후 전처리 데이터
    │
    └── Product Metadata
        ├── product_id
        ├── product_name
        ├── category
        ├── collection
        └── season
    
            ↓
    
    Multimodal LLM
    
            ↓
    
    Product Profile 생성
    ```
    
    ---
    

### 1. Product Image

역할:

- 제품의 형태
- 전체적인 색감
- 모노그램 표현
- 디자인 분위기 분석에 활용

---

- MCM 공식 홈페이지 대표 제품 이미지 사용
- MVP에서는 대표 이미지 1장 사용
- 추후 실서비스에서 아래의 내용으로 확장 할 예정이지만, 현재 MVP 기준으로는 대표 이미지 1장
    
    ```
    대표 이미지
    +
    상세 이미지
    +
    착용 이미지
    ```
    

### 2. Product Description

역할:

- 이미지만으로 판단하기 어려운 아래의 내용들을 보완할 수 있기 때문
- 소재
- 컬러
- 형태
- 브랜드 표현
- 제품 설명 기반 특징 등을 분석 보조

장점:

- 불필요한 마케팅 문구 제거
- LLM이 핵심 특징에 집중 가능
- Core4 Extraction 정확도 증가

---

- MCM 공식 홈페이지 Product Description 활용
- 단, Raw Description 전체를 그대로 사용하는 것이 아니라 AI 분석에 필요한 정보 중심으로 전처리한다.
- MCM 공식 홈페이지 제품 부분을 **크롤링 후 전처리해서 AI Input으로 제공**
    - 이러한 방식이 좋은 이유는 아래와 같음
        - 불필요한 마케팅 문구 제거
        - LLM이 핵심 특징에 집중 가능
        - Core4 Extraction 정확도 증가

예:

Before

```
Discover our iconic Visetos backpack...
This timeless piece...
Free shipping information...
```

After (전처리 이후)

```
Material:
Visetos canvas

Color:
Cognac

Form:
Structured backpack

Design:
Signature Visetos pattern
```

### 3. Product Metadata

역할:

- 제품 관리 및 연결을 위한 기본 정보

---

- MCM 공식 홈페이지에서 가져와서 넣기
- 어떤 Metadata를 만들건지 정해야함
- 만약 없다면, 데모를 위해서 우리가 임의로 작성하기

예:

```json
{
 "product_id": 
 "product_name": 
 "category": 
 "collection": 
 "season": 
}
```

위의 내용으로 정한 이유:

- 지금 Event Trigger는 데모에서 Simulation으로 처리하므로 launch_date같은건 필요 없어서 뺌
- Product Analysis와 직접 관계 없음
- 나중에 실제 운영 단계에서 추가 가능

#### AI Process

- 전체 FLOW 참고
    
    ```json
    Product Image
    +
    Processed Product Description
    +
    Product Metadata
    
            ↓
    
    Multimodal LLM
    
            ↓
    
    ┌───────────────── ┐
    │ Core4 Extraction │
    │ (Structured Data)│
    └───────────────── ┘
    
            +
    
    ┌───────────────── ┐ 
    │ Product Trait    │
    │ Discovery        │
    │ (Semantic Data)  │
    └───────────────── ┘
    
            ↓
    
    Product Profile DB
    ```
    

| 구분 | 누가 정의 하는가 | AI 역할 |
| --- | --- | --- |
| Core4 | 사람(우리) | 정해진 값 중 선택 |
| Product Trait | AI | 제품의 추가 의미 발견 |

#### Step 1. Core4 Extraction

Core4 역할
: 제품 추천 필터가 아니라, 
 고객과 제품을 동일한 기준으로 표현하기 위한 공통 언어(Common Representation) 역할을 한다.

```json
고객 제품:
고객이 선택한 미감

신규 제품:
제품이 가진 미감

두 데이터를 동일한 기준으로 표현하여 AI Matching이 가능하도록 한다.
```

#### Core4 Schema Definition

- 4개의 축과 그에 따른 속성값 info
    
    #### 1. Color / Tone
    
    제품의 전체적인 색감과 톤
    
    Value:
    
    ```
    - warm_neutral
    - cool_neutral
    - muted
    - saturated
    - mono
    - null(판정 근거 부족 또는 분류 불가 시)
    ```
    
    ---
    
    #### 2. Silhouette / Form
    
    제품의 형태적 특징
    
    Value:
    
    ```
    - structured
    - soft
    - compact
    - envelope
    - null(판정 근거 부족 또는 분류 불가 시)
    ```
    
    ---
    
    #### 3. Material
    
    제품 Body 소재 기준
    
    Value:
    
    ```
    - signature_monogram
    - leather
    - nylon
    - textil
    - null(판정 근거 부족 또는 분류 불가 시)
    ```
    
    ---
    
    #### 4. Monogram Density
    
    모노그램 표현 정도
    
    Value:
    
    ```
    - none
    - low
    - medium
    - high
    - null(판정 근거 부족 또는 분류 불가 시)
    ```
    

---

- 구조
    
    ```json
    Core4 Attribute
            ↓
    각 Attribute가 가질 수 있는 Value Range(enum)
            ↓
    Multimodal LLM이 이미지/설명 보고 선택
    ```
    

**AI:**

```
Multimodal LLM 

: 이걸 이용해 enume값 매칭하는 AI를 의미
* 사람이 하나하나 태깅하지 않음
```

**AI Prompt 방향**

```
Analyze this MCM product.

Based on the product image and description,
identify additional aesthetic or brand characteristics
that are not fully represented by Core4.

Consider:
- design mood
- visual identity
- craftsmanship
- lifestyle context
- brand expression

Return 2-3 traits with reasons.
```

```jsx
Analyze this MCM product using the product image and the following product data:
material, description, product_details_bullets, base_color, colorway_name.

Do NOT use product_name as evidence for any classification.
Marketing names do not reliably reflect actual product structure and may cause misclassification.

STEP 1 — Core4 Classification

Classify the product for each Core4 attribute using ONLY the predefined values
and the rules below.

Return each Core4 attribute as an array of one or more predefined values.
If multiple values are returned, each value must be clearly supported by
independent evidence within the same attribute.

Do not return multiple values simply because the evidence is ambiguous.

If classification is not possible or evidence is insufficient, return null.
Never invent a new Core4 value.

color_tone (warm_neutral, cool_neutral, muted, saturated, mono)
- Base this ONLY on base_color and colorway_name. Do NOT use the product image
  as evidence for this attribute.
  
- Check colorway_name first for muted signal words:
  pastel, sky, dusty, soft, sage, pale, powder, ash, ashy,
  faded, blush, khaki, moss, olive, taupe → muted
- "denim" is not a muted signal word.
- Darkness alone (e.g. Navy / Navy Blazer) is not a muted signal.
- If the product body itself is metallic, not just hardware → null
- Otherwise use base_color:
  Cognac / Brown / Beige → warm_neutral
  Grey → cool_neutral
  Black / White → mono
  Orange / Red / Blue / Green / Pink → saturated
- No reliable representative color → null

silhouette_form (structured, soft, compact, envelope)
- Base this ONLY on the product image.
- Check in this order and stop at the first match:
  1. near-zero depth / flat form → envelope
  2. volume + flat panels meeting at angular corners → structured
  3. volume + continuous curved surface + taut + no sagging → compact
  4. volume + sagging / wrinkling / asymmetric deformation → soft
- For worn/on-model shots, judge the product's intrinsic panel, seam, and
  structural features rather than deformation caused by the wearer.
- If unclear → null

material (signature_monogram, leather, nylon, textile)
- Base this ONLY on the material field text. Do NOT use the product image
  as evidence for this attribute.
  
Check in this order:

1. "monogram" + ("canvas" | "jacquard" | "print")
   OR "visetos" + "canvas"
   → signature_monogram

2. "nylon" OR "econyl"
   → nylon

3. "leather" / "suede" / "calfskin" / "lambskin" / "goatskin"
   → leather

4. "fabric" / "wool" / "cotton" / "silk" / "polyester" / "spandex"
   → textile

- Earlier rules take priority over later rules.
- Use the product's Main / Body material only.
- Ignore trim and accessory details such as pull tabs and hang tags.
- If two materials are co-equal with no clear main material → null
- No match → null

monogram_density (none, low, medium, high)
- Base this ONLY on material, description, and product_details_bullets text.
  Do NOT use the product image as evidence for this attribute.
  
- Literal "Maxi" in classification evidence → high
- Product Name does NOT count as evidence for "Maxi".
- "Mega", "maximalist", "oversized", "enlarged" do NOT count as high.
- Visetos / Lauretos / Embossed Monogram /
  Diamond monogram jacquard / Diamond monogram motif /
  monogram print across the main body or overall pattern,
  with no Maxi evidence → medium
- Monogram evidence limited to trim, accent, handle, pocket,
  or a specific compartment → low
- Product data confirmed present, but no monogram evidence → none
- Insufficient data → null

STEP 2 — Product Traits

Identify 2–3 additional aesthetic or brand characteristics
that are not captured by Core4.

Consider:
- design mood
- visual identity
- craftsmanship
- lifestyle context
- brand expression

For each trait, provide:
- trait
- reason
- evidence source(s)

Return the result using the Product Profile output schema defined below.
```

---

#### OUTPUT JSON

최종 저장 형태:

```json
{
  "product_id": "MCM_001",

  "core4": {
    "color_tone": ["warm_neutral"],
    "silhouette_form": ["structured"],
    "monogram_density": ["medium"],
    "material": ["signature_monogram"]
  },

  "product_traits": [
    {
      "trait": ["heritage inspired"],
      "reason": "Uses MCM signature Visetos pattern with classic structure",
      "evidence": [
        "product_image",
        "description"
      ]
    }
  ]
}
```

#### Rule Validation

#### Core4 Validation

- 정의된 enum 값만 허용
- enum 외 값 생성 시 reject
- 필수 Attribute 누락 시 reject
- 판단 불가능한 경우 null 허용
- 각 Core4 속성은 하나 이상의 값을 가질 수 있으며, 실제 제품에서 복수의 특성이 명확히 확인되는 경우 여러 값을 허용한다. 단, 서로 다른 개념을 억지로 동일 축에 포함하지 않으며 Core4로 표현되지 않는 디자인 특징은 AI Product Trait으로 분리한다.
- **Core4 Schema 정의**에 “필드는 기본적으로 배열(Array) 형태로 저장 가능

---

#### Product Trait Validation

- Trait 개수 제한 (MVP 기준 2~3개)
- Reason 포함 필수
- 불명확한 Trait은 제외

---

#### Data Validation

- Product ID 필수
- JSON Format 검증
- 필수 Attribute 존재 여부 확인

---

#### Product Understanding AI 최종 결과

#### Product Profile DB

```
Product

├── Product Metadata
│
├── Core4
│
├── AI Product Traits
│
└── Evidence
```

#### Evidence

: AI가 추출한 Core4 및 Product Trait 결과가 **어떤 제품 정보에 기반하여 판단되었는지 기록하는 근거 데이터**

- 저장 형태 (MVP)
    
    #### Core4 Evidence
    
    Core4는 객관적 속성이므로 간단한 근거만 저장.
    
    예:
    
    ```
    {
     "material": {
       "value": "visetos_canvas",
       "evidence": "Visetos canvas mentioned in product description"
     }
    }
    ```
    
    ---
    
    #### Product Trait Evidence
    
    Trait은 AI 해석 결과이므로 근거와 이유 저장.
    
    예:
    
    ```
    {
     "trait": "heritage inspired",
    
     "reason":
     "Uses MCM signature Visetos pattern and classic structure",
    
     "evidence":[
       "Visetos canvas",
       "structured backpack silhouette"
     ]
    }
    ```
    
- 최종 JSON 예시
    
    ```json
    {
     "product_id":"MCM001",
    
     "core4":{
       "color_tone":{
         "value":"warm_neutral",
         "evidence":"Cognac color mentioned in description"
       },
    
       "silhouette":{
         "value":"structured",
         "evidence":"Structured backpack silhouette"
       },
    
       "material":{
         "value":"visetos_canvas",
         "evidence":"Visetos canvas material"
       },
    
       "monogram_density":{
         "value":"medium",
         "evidence":"Signature Visetos monogram pattern"
       }
     },
    
     "product_traits":[
       {
        "trait":"heritage inspired",
        "reason":"Uses MCM signature pattern and classic design",
        "evidence":[
          "Visetos pattern",
          "classic backpack form"
        ]
       }
     ]
    }
    ```
    

---

```
Product Profile

├── Product Metadata
│
├── Core4
│    ├── Color/Tone
│    ├── Silhouette/Form
│    ├── Material
│    └── Monogram Density
│
└── AI Product Traits
```

이 Product Profile은 이후 아래와 같은 곳에서 활용

```
Product Profile
        ↓
Customer Taste Discovery
        ↓
AI Meaning Matching
```

---

---

### 2. Customer Taste Discovery AI

#### 목적

고객이 선택한 제품들의 Product Profile(Core4 + AI Product Trait)을 분석하여, 고객이 반복적으로 선택하는 미적 특징과 취향 패턴을 발견하고 Customer Taste Profile을 생성한다.

기존 Product Recommendation처럼 유사 상품을 찾는 것이 아니라,

> "이 고객은 어떤 MCM의 미적 표현을 지속적으로 선택하는가?"
> 

를 이해하는 단계이다.

#### INPUT

Customer CRM Data를 기반으로 분석한다.

#### Customer Data

```json
{
  "customer_id": "CUSTOMER_001",

  "purchase_history": [
    "PRODUCT_001",
    "PRODUCT_002"
  ],

  "wishlist": [
    "PRODUCT_003"
  ]
}
```

---

#### Product Profile 조회

Customer가 선택한 Product ID를 기반으로 Product Profile DB에서 데이터를 가져온다.

```
Customer Product List

        ↓

Product Profile DB 조회

        ↓

Product Profile

├── Core4
├── AI Product Traits
└── Evidence
```

- Example:
    
    ```json
    {
     "product_id":"PRODUCT_001",
    
     "core4":{
       "color_tone":"warm_neutral",
       "silhouette":"soft",
       "material":"leather",
       "monogram_density":"low"
     },
    
     "product_traits":[
       {
        "trait":"heritage-oriented",
        "reason":"Uses classic MCM design elements"
       }
     ]
    }
    ```
    

#### AI Process

### Step 1. Core4 Pattern Analysis

LLM은 고객이 선택한 여러 Product Profile의 Core4를 비교한다.

분석 대상:

- Color/Tone
- Silhouette/Form
- Material
- Monogram Density

목적:

고객이 반복적으로 선택하는 제품 속성을 발견한다.

- Example
    
    Customer Products:
    
    ```
    Product A
    Material: leather
    
    Product B
    Material: leather
    
    Product C
    Material: leather
    ```
    
    AI 판단:
    
    ```
    {
     "material":"leather"
    }
    ```
    

---

### Step 2. Semantic Pattern Discovery

단순 동일 값 반복뿐 아니라, 서로 다른 값이라도 의미적으로 연결되는 경우 상위 개념으로 확장한다.

LLM은 Product Profile 간 의미 관계를 분석한다.

- Example 1 — Color
    
    Input:
    
    ```
    red
    purple
    orange
    ```
    
    ↓
    
    Output:
    
    ```
    Expressive Color Preference
    
    Core Preference:
    saturated
    
    AI-discovered Trait:
    High-impact Color Expression
    
    Reason:
    Across different hues, the customer repeatedly selects products
    with strong visual color presence.
    ```
    
- Example 2 — Branding
    
    Input:
    
    ```
    high monogram
    medium monogram
    bold pattern
    ```
    
    ↓
    
    Output:
    
    ```
    Expressive Branding Preference
    
    Core Preference:
    monogram_density: high / medium
    
    AI-discovered Trait:
    Visible Brand Expression
    
    Reason:
    The customer repeatedly selects products where MCM's
    visual identity is prominently expressed rather than understated.
    ```
    
- Example 3 — Material
    
    Input:
    
    ```
    leather tote
    leather backpack
    leather mini bag
    ```
    
    ↓
    
    Output:
    
    ```
    Material Preference
    
    Core Preference:
    leather
    
    AI-discovered Trait:
    Material-Driven Taste
    
    Reason:
    The customer repeatedly selects leather products
    across different product categories and forms.
    ```
    

---

### AI Reasoning Principle

Customer Taste Discovery는 단순 Rule 기반 분류가 아니다.

하지만 LLM이 자유롭게 취향을 생성하는 것도 아니다.

아래의 원칙 기반으로 취향을 생성한다.

원칙:

```
Structured Product Data
+
LLM Semantic Reasoning
+
Product Evidence
```

#### AI Prompt

#### AI Prompt

```
You are analyzing a customer's MCM product selections.

Based on the customer's selected Product Profiles,
identify recurring aesthetic preferences and meaningful taste patterns.

Analyze:

1. Repeated Core4 attributes
2. Repeated Product Traits
3. Semantic relationships between different attributes

Do not create preferences without evidence from selected products.

Return:

- Core Preferences
- AI-discovered Traits
- Taste Summary
- Evidence Products
```

#### Output JSON

#### Customer Taste Profile 예시

```json
{
  "customer_id":"CUSTOMER_001",

  "taste_summary":
  "Customer prefers refined leather expressions with soft silhouettes and classic heritage aesthetics.",

  "core_preference":{

    "color_tone":{
      "value":"warm_neutral",

      "evidence_products":[
        "PRODUCT_001",
        "PRODUCT_002"
      ]
    },

    "silhouette":{
      "value":"soft",

      "evidence_products":[
        "PRODUCT_001",
        "PRODUCT_003"
      ]
    },

    "material":{
      "value":"leather",

      "evidence_products":[
        "PRODUCT_001",
        "PRODUCT_002",
        "PRODUCT_003"
      ]
    },

    "monogram_density":{
      "value":"low",

      "evidence_products":[
        "PRODUCT_002"
      ]
    }
  },

  "ai_traits":[

    {
      "trait":"Material Preference",

      "reason":
      "Customer repeatedly selected leather-based products.",

      "evidence_products":[
        "PRODUCT_001",
        "PRODUCT_002",
        "PRODUCT_003"
      ]
    },

    {
      "trait":"Heritage-oriented Style",

      "reason":
      "Customer selected multiple products containing classic MCM design expressions.",

      "evidence_products":[
        "PRODUCT_001",
        "PRODUCT_002"
      ]
    }

  ]
}
```

#### Taste Generation Rule

#### Core Preference

생성 기준:

- 고객이 선택한 Product Profile에서 반복적으로 나타나는 Core4 특징 분석
- 단순 동일 값 반복뿐 아니라 의미적으로 연결 가능한 경우 상위 개념으로 확장 가능

---

#### AI Trait

생성 기준:

- 여러 Product Profile에서 반복 또는 의미적 연결 발견
- Evidence Product ID 필수
- 단일 제품 기반 생성 제한

---

#### Rule Validation

#### Core Preference

- Product Profile DB에 존재하는 Core4 값 기반 생성
- 새로운 Core4 Value 생성 불가
- Evidence Product ID 필수
- Customer Core Preference는 여러 제품의 선택 패턴을 종합하기 때문에 각 Core4 축에서 복수의 선호값을 가질 수 있다.

---

#### AI Trait

- 근거 없는 Trait 생성 방지
- Evidence Product 최소 2개 권장
- 지나친 추론 제한

#### Profile Update Logic

#### 목적

Customer Profile은 고정값이 아니라 고객 행동 변화에 따라 최신 상태로 유지한다.

---

#### Trigger

Customer CRM 변경:

- 신규 구매
- Wishlist 추가

---

#### Process

```
Customer CRM Update

        ↓

Customer Product List 조회

        ↓

Product Profile DB 조회

        ↓

Customer Taste Discovery AI 재실행

        ↓

Customer Profile 전체 재생성

        ↓

DB Update
```

---

#### MVP 방식

전체 Profile 재생성 방식 ⭕ | 기존 Profile 수정 방식 ❌ 

이유:

- 구현 단순
- 최신 구매 패턴 반영 가능
- 이전 취향 데이터 누적 오류 방지

---

### 3. AI Meaning Matching 🦴🦴🦴 : STEP 5로 이루어져 있음

#### 목적

MCM의 새로운 브랜드 변화(Event)가 발생했을 때, 
해당 이벤트와 관련된 제품이 특정 고객에게 의미 있는 새로운 발견인지 판단한다.

단순히 고객과 제품의 유사도를 계산하는 것이 아니라,

> MCM이 전달하는 새로운 브랜드 방향성과 고객의 기존 취향, 그리고 이벤트에 포함된 제품을 연결하여 의미 있는 Personal Editorial 발행 여부를 판단한다.
> 

#### Overview Flow

```
MCM Event 발생

        ↓

Event Meaning Analysis

        ↓

Customer ↔ Event Matching

        ↓

Customer ↔ Product Matching

        ↓

Meaning Bridge 생성

        ↓

Extension 판단

        ↓

Editorial Gatekeeper

        ↓

PASS / REJECT

        ↓

Issue Candidate 생성
```

#### Event Trigger

#### 목적

MCM의 새로운 변화(Global Signal)가 발생했을 때 
고객과의 의미 있는 연결 여부를 판단하기 위해 AI Matching Pipeline을 실행한다.

---

#### Event Type

MVP 기준:

### (1) Product / Collection Event

- New Season Drop
- New Collection Launch
- Collaboration Launch

---

### (2) Global Experience Event

Global Digital Nomad 고객 경험을 고려하여 브랜드 변화 이벤트도 포함한다.

- City Collection / Regional Launch
- Local Store Event
- City Exclusive Product
- Fashion / Cultural Event
- Campaign 발생

---

#### Event 처리 방식

### Production

실제 서비스에서는 아래의  방식으로 실행된다.

```
MCM Product / Business Data Event

        ↓

Automatic Trigger
```

예:

- 신규 컬렉션 출시
- 특정 도시 이벤트 발생
- 신규 제품 공개

---

#### MVP Demo

MVP에서는 Event Trigger를 Simulation 방식으로 구현한다.

단, 사용자가 보는 화면에서는 아래처럼 실제 서비스에서 자동 감지된 것처럼 표현한다.

```
SYSTEM EVENT DETECTED

Tokyo New Collection Launch

Analyzing customer relevance...
```

#### Matching Input

#### 목적

AI Meaning Matching은 이미 구축된 Profile 데이터와 MCM Event/Campaign 데이터를 기반으로 
고객에게 의미 있는 새로운 브랜드 경험인지 판단한다.

새로운 제품이나 고객 데이터를 다시 분석하는 단계가 아니다.

---

### 1) Customer Input

#### Customer Taste Profile

```
Customer Profile

├── Core Preference
└── AI Traits
```

역할:

> 고객이 기존에 어떤 미적 방향성을 가지고 있는지 이해한다.
> 
- 예시
    
    ```json
    {
      "customer_id":"CUSTOMER_001",
    
      "core_preference":{
        "material":[
          "leather"
        ],
        "silhouette":[
          "soft"
        ],
        "color_tone":[
          "warm_neutral"
        ],
        "monogram_density":[
          "low"
        ]
      },
    
      "ai_traits":[
        "Heritage-oriented Style"
      ]
    }
    ```
    

---

### 2) Event Input

#### Event / Campaign Context의 목적

현재 MCM에서 발생한 새로운 변화가 어떤 브랜드 방향성을 가지는지 이해한다.

Event는 MCM 내부 데이터 기반으로 생성되어 있다고 가정한다.

---

구성:

```
Event Profile

├── Event Type
├── Campaign Overview
├── Brand Message
├── Collection Concept
└── Related Products
```

- 예시
    
    ```json
    {
     "event_id":"TOKYO_COLLECTION_001",
    
     "event_type":
     "New Collection Launch",
    
     "campaign_overview":
     "MCM introduces a new collection that reinterprets heritage through modern expression.",
    
     "brand_message":
     "Connecting MCM's heritage craftsmanship with contemporary design.",
    
     "collection_concept":
     "Modern Heritage",
    
     "related_products":[
       "PRODUCT_001",
       "PRODUCT_002"
     ]
    }
    ```
    

---

### 3) Product Input

#### Event Related Product Profile

- Event에 포함된 신규 제품들의 이미 분석된 Product Profile을 활용한다.

```
Product Profile

├── Core4
└── AI Product Traits
```

- 예시
    
    ```json
    {
     "product_id":"PRODUCT_001",
    
     "core4":{
       "material":[
         "leather"
       ],
       "silhouette":[
         "soft"
       ],
       "color_tone":[
         "muted"
       ],
       "monogram_density":[
         "medium"
       ]
     },
    
     "product_traits":[
       "Modern Heritage"
     ]
    }
    ```
    

#### AI Meaning Matching Logic

#### 참고

| 단계 | 역할 |
| --- | --- |
| Event Meaning Analysis | MCM 이벤트 의미 분석 |
| Customer ↔ Event Matching | 브랜드 변화가 고객에게 의미 있는지 판단 |
| Customer ↔ Product Matching | 실제 제품이 고객 취향과 연결되는지 판단 |
| Event Profile DB | MCM 이벤트 원본 정보 구조화(Meaning Matching에 제공) |

```
Event Meaning Analysis

↓

Customer ↔ Event Matching

↓

Customer ↔ Product Matching

↓

Extension Definition

↓

Editorial Gatekeeper

↓

PASS

↓

Personal Editorial Generation AI
```

### Step 1. Event Meaning Analysis

#### 목적

: MCM에서 발생한 새로운 Event / Campaign이 어떤 브랜드 방향성과 디자인 의미를 가지는지 분석한다.

단순히 이벤트 정보를 요약하는 것이 아니라,

> "이번 MCM의 새로운 변화가 어떤 미적 방향성과 브랜드 메시지를 전달하는가?" 를 구조화하여 
 이후 Customer Matching의 기준으로 활용한다.
> 

---

#### Input

#### Event Profile DB

: MVP에서는 사전에 정제된 Event Profile 데이터를 활용한다.
  Production 환경에서는 MCM 내부 CMS / Marketing Data 기반으로 자동 생성된다.

---

#### Event Profile Structure

```
Event Profile

├── Event Type
├── Campaign Overview
├── Brand Message
├── Collection Concept
└── Related Products
```

---

#### Input Example

```json
{
 "event_id":"TOKYO_COLLECTION_001",

 "event_type":
 "New Collection Launch",

 "campaign_overview":
 "MCM introduces a new collection that reinterprets heritage through modern expression.",

 "brand_message":
 "Connecting MCM's heritage craftsmanship with contemporary design.",

 "collection_concept":[
   "Modern Heritage"
 ],

 "related_products":[
   "PRODUCT_001",
   "PRODUCT_002"
 ]
}
```

---

### AI Process

: LLM은 Event Profile 데이터를 기반으로 해당 이벤트의 브랜드 의미를 분석한다.

#### 분석 대상

#### 1. Event Theme

이번 이벤트/컬렉션의 핵심 주제

### 2. Brand Direction

MCM이 이번 변화를 통해 전달하려는 브랜드 방향

### 3. Event Traits

이벤트가 표현하는 디자인/미적 특징

---

### LLM Prompt

#### System Prompt

```
You are an AI luxury brand analyst for MCM.

Your task is to analyze a MCM event or campaign and extract its core brand meaning, design direction, and aesthetic characteristics.

Do not evaluate customer relevance.
Do not recommend products.

Only analyze the event itself based on the provided information.
```

#### User Prompt

```
Analyze the following MCM event information.

Identify:

1. The core theme of this event or collection.
2. The brand message MCM wants to communicate.
3. The aesthetic/design direction represented by this event.
4. Meaningful traits that describe this event.

Event Information:

Event Type:
{event_type}

Campaign Overview:
{campaign_overview}

Brand Message:
{brand_message}

Collection Concept:
{collection_concept}
```

---

### Output JSON

```json
{
 "event_theme":
 "Modern Heritage",

 "brand_direction":
 "Reinterpreting MCM's heritage through contemporary design language",

 "event_traits":[
   "Contemporary Heritage",
   "Refined Expression",
   "Craftsmanship"
 ],

 "summary":
 "This collection presents a modern interpretation of MCM's heritage identity."
}
```

### Output Usage

Event Meaning Analysis 결과는 이후 Customer Matching 단계에서 활용된다.

Flow:

```
Event Profile DB

↓

Event Meaning Analysis

↓

Event Meaning Profile

↓

Customer ↔ Event Matching
```

---

### Step 2. Customer ↔ Event Matching

#### 목적

: Event Meaning Analysis에서 추출된 MCM Event의 브랜드 방향성과 고객의 기존 취향 프로필을 비교하여, 
  해당 이벤트가 고객에게 의미 있는 브랜드 경험으로 연결될 수 있는지 판단한다.

단순한 키워드 일치가 아니라,

> 고객이 기존에 가지고 있는 미적 취향 방향과 
MCM이 새롭게 제안하는 브랜드 방향성이 같은 취향 맥락 안에서 연결되는지 판단한다.
> 

---

### Input

#### 1) Customer Taste Profile

- 기존 Customer Taste Discovery AI에서 생성된 고객 프로필을 활용한다.

```
Customer Profile

├── Taste Summary
├── Core Preference
└── AI Traits
```

- 설명
    
    #### Taste Summary
    
    - 고객이 추구하는 전체적인 미적 방향성을 표현
    - LLM이 고객의 전체 취향 방향성을 이해하기 위한 핵심 Input.
        
        ```
        {
         "taste_summary":
         "Customer prefers refined leather expressions with soft silhouettes and classic heritage aesthetics."
        }
        ```
        
    
    ---
    
    #### Core Preference
    
    - 구체적인 취향 근거 확인용
    - Taste Summary의 근거가 되는 구조화된 취향 데이터
        
        ```json
        {
         "material":{
           "value":"leather",
        
           "evidence_products":[
             "PRODUCT_001",
             "PRODUCT_002"
           ]
         },
        
         "silhouette":{
           "value":"soft",
        
           "evidence_products":[
             "PRODUCT_001",
             "PRODUCT_003"
           ]
         }
        }
        ```
        
    
    ---
    
    ### AI Traits
    
    - 고객의 반복 패턴에서 발견된 의미적 취향.
    - 고객 취향의 의미적 방향성을 보완
        
        ```json
        {
         "trait":
         "Heritage-oriented Style",
        
         "reason":
         "Customer selected multiple products containing classic MCM design expressions.",
        
         "evidence_products":[
           "PRODUCT_001",
           "PRODUCT_002"
         ]
        }
        ```
        
    
    ---
    

#### 2) Event Meaning Profile

- Step 1에서 생성된 Event 분석 결과를 활용한다.
- 이번 MCM 이벤트가 전달하는 브랜드 방향성을 표현한다.

```
Event Meaning Profile

├── Event Theme
├── Brand Direction
└── Event Traits
```

- 예시
    
    ```json
    {
     "event_theme":
     "Modern Heritage",
    
     "brand_direction":
     "Reinterpreting MCM's heritage through contemporary design language",
    
     "event_traits":[
       "Contemporary Heritage",
       "Refined Expression",
       "Craftsmanship"
     ]
    }
    ```
    

---

### AI Matching Logic

### 1) Overall Meaning Matching

#### 목적

: 고객의 Taste Summary와 Event Meaning Profile을 비교하여 전체적인 취향 방향성이 연결되는지 판단한다.

비교:

```
Customer Taste Summary

        +

Event Brand Direction
```

---

- 예시
    
    Customer:
    
    ```
    Customer prefers refined leather expressions
    with classic heritage aesthetics.
    ```
    
    Event:
    
    ```
    Reinterpreting MCM's heritage
    through contemporary design language.
    ```
    
    ↓
    
    결과:
    
    ```
    Meaning Connection Exists
    ```
    

### 2) Trait Level Matching

#### 목적

: 고객 AI Trait과 Event Trait 사이의 의미적 관계를 분석한다.

단순 문자열 일치가 아니라:

> 두 Trait이 같은 미적 방향성을 표현하는가? 를 판단한다.
> 
- 예시
    
    Customer Trait:
    
    ```
    Heritage-oriented Style
    ```
    
    Event Trait:
    
    ```
    Contemporary Heritage
    ```
    
    ↓
    
    ```
    Semantic Connection Exists
    ```
    

---

### 3) Evidence Validation

#### 목적

: LLM의 판단이 실제 고객 데이터 기반인지 확인한다.

활용:

```
Core Preference

+

Evidence Products
```

- 예시
    
    LLM 결과:
    
    > Customer prefers heritage-based leather expressions.
    > 
    
    검증:
    
    ```
    Material:
    leather
    
    Evidence:
    PRODUCT_001
    PRODUCT_002
    PRODUCT_003
    ```
    

---

### LLM Prompt

#### System Prompt

```
You are an AI luxury personalization analyst for MCM.

Your task is to determine whether a customer's existing aesthetic preferences are meaningfully connected with a new MCM event direction.

Do not analyze specific products.
Do not generate recommendations.

Only evaluate the relationship between the customer taste profile and the event meaning.
```

---

#### User Prompt

```
Analyze the relationship between the customer's taste profile and the MCM event meaning.

Determine:

1. Whether the customer's existing aesthetic direction aligns with the event direction.
2. What aesthetic or brand meaning connects them.
3. Why this event could be relevant to this customer.

Customer Taste Profile:

{customer_taste_profile}

Event Meaning Profile:

{event_meaning_profile}
```

---

### Output JSON

```json
{
 "connection":true,

 "matching_reason":
 "The customer's preference for heritage expressions aligns with MCM's modern interpretation of heritage.",

 "connected_traits":[
   {
    "customer_trait":
    "Heritage-oriented Style",

    "event_trait":
    "Contemporary Heritage"
   }
 ],

 "evidence":[
   "leather preference",
   "heritage-oriented style trait"
 ],

 "confidence":
 "high"
}
```

#### Output Usage

: Step 2 결과는 이후 Product Matching 단계에서 활용한다.

Flow:

```
Customer Taste Profile

+

Event Meaning Profile

↓

Customer ↔ Event Matching

↓

Customer ↔ Product Matching
```

---

### Step 3. Customer ↔ Product Matching

#### 목적

: Event에 포함된 신규 Product Profile과 Customer Taste Profile을 비교하여, 
  해당 제품이 고객의 기존 취향과 연결되는지 판단한다.

단순 제품 유사도를 계산하는 것이 아니라,

> 고객이 기존에 선호해온 디자인 방향을 기반으로 해당 제품이 의미 있는 확장 가능성을 가지는지 판단한다.
> 

---

### Input

#### 1) Customer Taste Profile

Customer Taste Discovery AI에서 생성된 고객 프로필을 활용한다.

```
Customer Profile

├── Taste Summary
├── Core Preference
└── AI Traits
```

- 예시
    
    ```json
    {
     "customer_id":"CUSTOMER_001",
    
     "taste_summary":
     "Customer prefers refined leather expressions with soft silhouettes and classic heritage aesthetics.",
    
     "core_preference":{
    
       "material":{
         "value":"leather"
       },
    
       "silhouette":{
         "value":"soft"
       },
    
       "monogram_density":{
         "value":"low"
       }
     },
    
     "ai_traits":[
       {
        "trait":
        "Heritage-oriented Style"
       }
     ]
    }
    ```
    

#### 2) Event Related Product Profile

: Step 2에서 의미 연결이 확인된 Event에 포함된 제품을 대상으로 한다.

전체 Product DB가 아니라 아래의 내용처럼 이벤트에 해당되는 제품만을 활용한다.

```
Event Related Products

↓

Product Profile
```

구조:

```
Product Profile

├── Core4
└── AI Product Traits
```

- 예시
    
    ```json
    {
     "product_id":"PRODUCT_001",
    
     "core4":{
    
       "material":[
         "leather"
       ],
    
       "silhouette":[
         "soft"
       ],
    
       "color_tone":[
         "muted"
       ],
    
       "monogram_density":[
         "medium"
       ]
     },
    
     "product_traits":[
       "Modern Heritage"
     ]
    }
    ```
    

---

### AI Matching Logic

#### 핵심 원칙

: Product Matching은 단순 Similarity Matching이 아니다.

구조:

```
Core4

= 객관적인 제품-취향 비교 기준

AI Product Trait

= 제품의 디자인/브랜드 의미 연결 근거

LLM

= 고객 취향 방향과 제품 의미가 연결되는지 판단
```

---

### 1) Core4 Connection Analysis

#### 목적

Customer Core Preference와 Product Core4를 비교하여 객관적인 연결 요소를 확인한다.

비교 대상:

- Color / Tone
- Silhouette / Form
- Material
- Monogram Density
- 예시
    
    Customer:
    
    ```
    Material:
    leather
    
    Silhouette:
    soft
    
    Monogram Density:
    low
    ```
    
    Product:
    
    ```
    Material:
    leather
    
    Silhouette:
    soft
    
    Monogram Density:
    medium
    ```
    
    결과:
    
    ```
    Core4 Connection
    
    - Material Match
    - Silhouette Match
    - Monogram Related
    ```
    

---

### 2) AI Trait Connection Analysis

#### 목적

: Customer AI Trait과 Product AI Trait 사이의 의미적 연결을 분석한다.

단순 문자열 비교가 아니라:

> 두 Trait이 같은 미적 방향성을 표현하는가? 를 판단한다.
> 
- 예시
    
    Customer Trait:
    
    ```
    Heritage-oriented Style
    ```
    
    Product Trait:
    
    ```
    Modern Heritage
    ```
    
    ↓
    
    결과:
    
    ```
    Semantic Connection Exists
    ```
    

---

### 3) Product Meaning Evaluation

#### 목적

: Core4 Connection과 AI Trait Connection을 종합하여, 제품이 고객 취향 방향과 어떤 관계를 가지는지 판단한다.

---

### LLM 판단

#### 1️⃣ 단순 일치

```
Customer:

Brown Leather Preference

Product:

Brown Leather Bag
```

결과:

```
Existing Preference Repetition
```

#### 2️⃣ 의미 있는 연결

```
Customer:

Heritage-oriented Style

Product:

Modern Heritage Design

Event:

Modern Heritage Campaign
```

결과:

```
Meaningful Connection Exists
```

---

### LLM Prompt

#### System Prompt

```
You are an AI luxury personalization analyst for MCM.

Your task is to analyze whether a new product meaningfully connects with a customer's existing aesthetic preferences.

Use Core4 as objective comparison evidence and AI Traits as semantic connection evidence.

Do not decide final editorial publication.
Do not generate marketing content.

Only analyze the relationship between customer taste and product characteristics.
```

#### User Prompt

```
Analyze the relationship between the customer's taste profile and the product profile.

Determine:

1. What objective Core4 connections exist.
2. What semantic connections exist between customer traits and product traits.
3. How the product meaning connects with the customer's existing taste.

Customer Taste Profile:

{customer_taste_profile}

Product Profile:

{product_profile}
```

---

### Output JSON

```json
{
 "connection":true,

 "core4_connections":[
   {
    "attribute":"material",

    "customer_value":
    "leather",

    "product_value":
    "leather"
   },

   {
    "attribute":"silhouette",

    "customer_value":
    "soft",

    "product_value":
    "soft"
   }
 ],

 "trait_connections":[
   {
    "customer_trait":
    "Heritage-oriented Style",

    "product_trait":
    "Modern Heritage"
   }
 ],

 "matching_reason":
 "The product maintains the customer's preference for heritage expressions while introducing a modern interpretation.",

}
```

---

#### Output Usage

Step 3 결과는 Step 4 Extension Definition에서 활용한다.

Flow:

```
Customer ↔ Event Matching Result

+

Customer ↔ Product Matching Result

↓

Extension Definition
```

---

### Step 4. Extension Definition

#### 목적

: Customer ↔ Event Matching 결과와 Customer ↔ Product Matching 결과를 기반으로, 
   해당 MCM Event와 Product가 고객의 기존 취향을 어떻게 확장하는지 판단한다.

단순히 고객과 제품이 비슷한지 판단하는 것이 아니라,

> 기존 취향을 유지하면서 새로운 MCM 경험으로 확장되는 의미가 존재하는지 판단한다.
> 

---

### Input

#### 1) Customer ↔ Event Matching Result

: Step 2에서 생성된 결과를 활용한다.

```
Customer ↔ Event Matching

├── Connection
├── Matching Reason
└── Connected Meaning
```

- 예시
    
    ```json
    {
     "connection":true,
    
     "matching_reason":
     "Customer's preference for heritage aesthetics aligns with MCM's modern heritage direction.",
    
     "connected_meaning":
     "Heritage expression"
    }
    ```
    

---

#### 2) Customer ↔ Product Matching Result

: Step 3에서 생성된 결과를 활용한다.

```
Customer ↔ Product Matching

├── Core4 Connections
├── Trait Connections
└── Matching Reason
```

- 예시
    
    ```json
    {
     "core4_connections":[
       "material_match",
       "silhouette_match"
     ],
    
     "trait_connections":[
       {
        "customer_trait":
        "Heritage-oriented Style",
    
        "product_trait":
        "Modern Heritage"
       }
     ],
    
     "matching_reason":
     "The product maintains the customer's heritage preference while introducing a modern interpretation."
    }
    ```
    

---

### AI Process

: LLM은 Event와 Product가 고객에게 제공하는 새로운 의미 방향을 판단한다.

핵심 질문:

> "이 제품은 고객이 이미 좋아하는 것을 반복하는가, 아니면 기존 취향에서 새로운 방향으로 확장되는가?"
> 

---

### Extension 판단 기준

#### 1. Existing Preference Repetition

: 기존 취향을 그대로 반복하는 경우.

- 고객이 좋아하는 요소와 일치하지만
- 새로운 발견 요소는 부족함
- 예시
    
    Customer:
    
    ```
    Brown Leather Preference
    ```
    
    Event:
    
    ```
    Brown Leather Collection
    ```
    
    Product:
    
    ```
    Brown Leather Bag
    ```
    
    결과:
    
    ```
    Existing preference repetition
    ```
    

---

#### 2. Meaningful Extension

: 기존 취향을 유지하면서 새로운 표현 방향을 제시하는 경우

- 기존 고객 취향과 연결됨
- 새로운 MCM 표현 방식으로 확장됨
- 예시
    
    Customer:
    
    ```
    Heritage-oriented Style
    ```
    
    Event:
    
    ```
    Modern Heritage Campaign
    ```
    
    Product:
    
    ```
    Modern Heritage Design
    ```
    
    결과:
    
    ```
    Meaningful Extension
    ```
    

---

### LLM Prompt

#### System Prompt

```
You are an AI luxury personalization analyst for MCM.

Your task is to determine how a new MCM event and product extend a customer's existing aesthetic preference.

Do not decide final editorial publication.
Do not generate marketing content.

Only analyze whether the connection represents repetition or meaningful extension.
```

#### User Prompt

```
Analyze how this MCM event and product extend the customer's existing taste.

Determine:

1. What existing customer preference is connected.
2. What new direction or expression the event/product introduces.
3. Whether this represents a meaningful extension or simple repetition.

Customer-Event Matching Result:

{customer_event_result}

Customer-Product Matching Result:

{customer_product_result}
```

---

#### Output JSON

```json
{
 "extension_type":
 "meaningful_extension",

 "existing_preference":
 "Heritage-oriented Style",

 "new_expression":
 "Modern interpretation of heritage aesthetics",

 "extension_reason":
 "The product expands the customer's existing heritage preference through MCM's contemporary design direction."
}
```

---

#### Output Usage

Extension 결과는 이후 Editorial Gatekeeper AI의 최종 발행 판단 기준으로 활용한다.

Flow:

```
Customer ↔ Event Matching

+

Customer ↔ Product Matching

↓

Extension Definition

↓

Editorial Gatekeeper AI
```

---

### Step 5. Editorial Gatekeeper AI

#### 목적

: Extension Definition 결과를 기반으로, 
   해당 MCM Event/Product 연결이 고객에게 실제 의미 있는 Editorial 경험을 제공할 수 있는지 최종 판단한다.

모든 연결된 제품을 발행하지 않고,

> "이 연결은 단순한 취향 반복인가, 아니면 고객에게 새로운 MCM 발견을 제공하는가?" 를 판단한다.
> 

---

### Input

Editorial Gatekeeper는 이전 Matching 결과를 종합하여 판단한다.

**Rule Validation을 통과한 결과만 Gatekeeper Input으로 사용한다.**

```
Gatekeeper Input

├── Customer ↔ Event Matching Result
├── Customer ↔ Product Matching Result
├── Meaning Bridge
└── Extension Result
```

---

#### 1) Customer ↔ Event Matching Result

Event와 고객 취향 사이의 의미적 연결 결과.

- 예시
    
    ```json
    {
     "connection":true,
    
     "matching_reason":
     "Customer's preference for heritage aesthetics aligns with MCM's modern heritage direction."
    }
    ```
    

#### 2) Customer ↔ Product Matching Result

제품과 고객 취향 사이의 연결 근거.

포함:

```
├── Core4 Connections
├── Trait Connections
└── Matching Reason
```

- 예시
    
    ```json
    {
     "core4_connections":[
       "material_match",
       "silhouette_match"
     ],
    
     "trait_connections":[
       "Heritage-oriented Style ↔ Modern Heritage"
     ],
    
     "matching_reason":
     "The product maintains the customer's heritage preference while introducing a modern interpretation."
    }
    ```
    

#### 3) Meaning Bridge

고객 취향과 MCM 변화가 왜 연결되는지 설명하는 핵심 의미.

- 예시
    
    ```
    The customer's appreciation for heritage expressions connects with MCM's new modern interpretation of classic design language.
    ```
    

#### 4) Extension Result

Step 4에서 판단한 확장 가능성.

- 예시
    
    ```json
    {
     "extension_type":
     "meaningful_extension",
    
     "extension_reason":
     "The product expands the customer's existing heritage preference through MCM's contemporary design direction."
    }
    ```
    

---

### AI 판단 기준

### 1. Connection Evidence

#### 목적

실제 고객 데이터와 MCM 데이터 기반의 연결인지 확인한다.

확인:

```
Customer Profile

+

Product Profile

+

Event Meaning Profile
```

---

판단:

- PASS 가능
- REJECT 가능

---

### 2. Meaningful Extension

#### 목적

기존 취향 반복이 아닌 새로운 발견 가치가 있는지 판단한다.

---

- PASS 가능
    - 의미: 기존 취향을 유지하면서 새로운 MCM 방향으로 확장.
- EJECT 가능
    - 의미: 좋아하는 요소는 같지만 새로운 발견 가치 부족.

---

### LLM Prompt

#### System Prompt

```
You are an AI editorial curator for MCM.

Your task is to decide whether a customer-product-event connection should become a Personal Editorial.

Evaluate whether the connection provides meaningful discovery or only repeats an existing preference.

Do not generate editorial content.
Only make the final publication decision.
```

#### User Prompt

```
Determine whether this MCM connection should become a Personal Editorial.

Evaluate:

1. Whether there is sufficient connection evidence.
2. Whether this represents a meaningful extension or simple repetition.
3. Whether this provides a new MCM discovery experience for the customer.

Customer-Event Matching Result:

{customer_event_result}

Customer-Product Matching Result:

{customer_product_result}

Extension Result:

{extension_result}
```

---

### Output JSON

#### PASS

```json
{
 "decision":"PASS",

 "reason":
 "The event and product connect with the customer's existing aesthetic direction while providing a meaningful extension.",

 "editorial_angle":
 "A modern interpretation of the customer's heritage preference."
}
```

---

#### REJECT

```json
{
 "decision":"REJECT",

 "reason":
 "The product repeats the customer's existing preference without providing meaningful discovery."
}
```

---

### Output Usage

PASS 결과만 Personal Editorial Generation AI로 전달한다.

```
Editorial Gatekeeper

        ↓

PASS

        ↓

Personal Editorial Generation AI
```

---

#### Rule Validation

#### 목적

LLM 결과를 그대로 사용하지 않고, 사전에 정의된 규칙과 데이터 구조를 기반으로 결과의 유효성을 검증한다.

AI 판단의 자유도는 유지하면서, 잘못된 결과 생성이나 데이터 오류를 방지한다.

---

### Validation 대상

```
AI Output

↓

Rule Validation

↓

Valid Result
```

검증 대상:

- Event Meaning Result
- Matching Result
- Extension Result
- Gatekeeper Input

---

### Validation Rule

#### 1. Required Field Validation

필수 데이터 존재 여부 확인.

검증:

- Product ID 존재
- Customer ID 존재
- Event ID 존재
- Decision 값 존재

예:

```json
{
 "product_id": null
}
```

↓

Reject

---

### 2. Enum Validation

정의된 값만 허용한다.

특히 Product Profile의 Core4는 사전에 정의된 enum 기반으로 관리한다.

예:

허용:

```json
{
 "material":
 "leather"
}
```

비허용:

```json
{
 "material":
 "luxury_leather_style"
}
```

처리:

```
Invalid Value → Reject
```

---

### 3. Output Format Validation

LLM Output JSON 구조 검증.

검증:

- JSON Format
- Required Key
- Data Type

예:

정상:

```json
{
 "decision":"PASS"
}
```

비정상:

```json
PASS. This product is good.
```

↓

Reject

---

### 4. Connection Evidence Validation

AI가 판단한 연결이 실제 데이터 기반인지 확인한다.

검증:

```json
AI Reason

↓

Evidence Check

↓

Customer Profile / Product Profile / Event Profile 존재 확인
```

예:

AI Output:

```
Customer prefers heritage expression
```

검증:

Customer AI Trait:

```
Heritage-oriented Style
```

존재 여부 확인.

---

### 5. Extension Validation

Extension 결과 검증.

조건:

Meaningful Extension으로 판단되려면:

필수:

```
Customer Connection Exists

+

Product Connection Exists

+

New Expression Exists
```

---

예:

❌ Reject

```
Customer:

Brown Leather

Product:

Brown Leather

Extension:

Same Brown Leather Preference
```

이 경우:

```
{
 "extension_type":
 "meaningful_extension"
}
```

이면 Validation 실패.

---

### Validation Output

#### Valid

```json
{
 "validation":"PASS"
}
```

---

#### Invalid

```json
{
 "validation":"REJECT",

 "reason":
 "Missing evidence for customer-product connection."
}
```

---

---

### 4.**Personal Editorial Generation AI**

#### 목적

Editorial Gatekeeper를 통과한 **Event / Product 연결 결과**를 기반으로, MCM의 새로운 브랜드 변화와 고객의 취향이 어떻게 연결되는지를 하나의 **Personal Editorial 콘텐츠**로 생성한다.

단순 제품 추천문이나 상품 설명을 생성하는 것이 아니라,

> **브랜드 스토리 + 고객 취향 연결 + 새로운 발견** 을 하나의 Editorial로 변환하는 단계이다.
> 

#### 핵심 한 줄

> **MCM의 새로운 Event를 하나의 Editorial Theme으로 구성하고, 고객 취향과의 연결을 설명한 뒤, PASS된 각 Product를 기존 취향에서 확장되는 새로운 발견으로 보여준다.**
> 

#### INPUT

#### 목적

: Personal Editorial Generation AI는 앞 단계에서 이미 검증된 데이터를 기반으로 콘텐츠를 생성한다.

#### 역할

: 고객에게 소개할 실제 제품의 특징과 **취향 확장 방향**을 이해하기 위한 Input이다.

### Personal Editorial Generation AI Input 4개

1. Issue Candidate
2. Event Meaning Profile
3. Customer Taste Profile
4. Selected Product Profile(s)

---

### 1) Issue Candidate

 : Editorial Gatekeeper를 통과한 결과를 활용한다.

#### Issue Candidate

- Event ID
- Selected Product IDs
- Matching Reason
- Meaning Bridge
- Extension
- Gatekeeper Decision

#### 예시

```json
{
  "issue_candidate_id": "ISSUE_001",
  "event_id": "TOKYO_COLLECTION_001",
  "selected_product_ids": [
    "PRODUCT_001",
    "PRODUCT_002"
  ],
  "meaning_bridge": "The customer's heritage preference connects with MCM's modern interpretation.",
  "extension": "The event introduces a contemporary expression of the customer's existing aesthetic direction.",
  "gatekeeper_decision": "PASS"
}
```

---

### 2) Event Meaning Profile

: AI Meaning Matching의 **Event Meaning Analysis 결과**를 활용한다.

#### Event Meaning Profile

- Event Theme
- Brand Direction
- Event Traits

#### 역할

이번 Editorial에서 전달할 **MCM의 새로운 브랜드 변화와 방향성**을 이해하기 위한 Input이다.

#### 예시

```json
{
  "event_theme": "Modern Heritage",
  "brand_direction": "Reinterpreting MCM's heritage through contemporary design language.",
  "event_traits": [
    "Contemporary Heritage",
    "Refined Expression",
    "Craftsmanship"
  ]
}
```

---

### 3) Customer Taste Profile

Customer Taste Discovery AI에서 생성된 고객 프로필을 활용한다.

### Customer Taste Profile

- Taste Summary
- Core Preference
- AI Traits

특히 `taste_summary`는 Core Preference와 AI Traits를 종합한 **고객의 전체적인 미적 방향성**을 표현하므로, Personal Connection 생성의 핵심 Input으로 활용한다.

#### 예시

```json
{
  "customer_id": "CUSTOMER_001",
  "taste_summary": "Customer prefers refined leather expressions with soft silhouettes and classic heritage aesthetics.",
  "core_preference": {
    "material": {
      "value": "leather"
    },
    "silhouette": {
      "value": "soft"
    }
  },
  "ai_traits": [
    {
      "trait": "Heritage-oriented Style"
    }
  ]
}
```

---

### 4) Selected Product Profile(s)

: Editorial Gatekeeper에서 PASS된 제품들의 Product Profile을 활용한다.

### Selected Product Profile

- Product Information
- Core4
- AI Product Traits
- Official Product Image

---

# 

#### Editorial Generation Logic

### 핵심 원칙

: Personal Editorial은 다음 세 가지 흐름을 중심으로 생성한다.

> **“이번 MCM에는 이런 변화가 생겼고 → 그 변화 중 이 부분이 고객의 기존 취향과 연결되며 → 그 안의 제품들이 고객 취향을 새로운 방향으로 확장한다.”** 라는 Editorial Story를 생성한다.
> 

```
Brand / Event Story

        ↓

Personal Connection

        ↓

Product Discovery
```

---

### Step 1. Brand / Event Story Generation

#### 목적

: 이번 MCM Event가 어떤 브랜드 변화인지 고객이 이해할 수 있는 **Editorial Story**로 변환한다.

### Input

**Event Meaning Profile**

활용 데이터:

- Event Theme
- Brand Direction
- Event Traits

### AI 생성

- Editorial Title
- Brand / Event Story

### 예시

> **A Modern Interpretation of Heritage**
> 
> 
> MCM revisits its heritage codes through a contemporary point of view, bringing a new expression to familiar design language.
> 

이 단계에서는 고객 개인화보다 **이번 MCM Event 자체의 이야기**를 우선한다.

---

### Step 2. Personal Connection Generation

#### 목적

이번 MCM의 브랜드 변화가 **왜 이 고객에게 의미 있는지**를 설명한다.

### Input

특히 Customer Taste Profile의 `taste_summary`를 중심으로 Event Meaning과의 연결을 해석한다.

```
Customer Taste Profile

+

Meaning Bridge

+

Customer ↔ Event Matching Result
```

### AI 생성

**Personal Connection**

### 예시

> Your preference for refined leather and heritage-driven expressions naturally connects with this new interpretation of MCM's design language.
> 

### 표현 원칙

고객을 단정적으로 성격화하지 않는다.

❌

> You are a minimalist person. 보다는,
> 

⭕️

> Your previous selections show a preference for refined leather and restrained heritage expressions.
> 

처럼 **실제 선택 데이터를 기반으로 표현한다.**

---

### Step 3. Product Discovery Generation

#### 목적

PASS된 제품들을 단순 추천 상품으로 나열하지 않고, 고객의 기존 취향에서 **어떤 새로운 표현을 발견할 수 있는지** 설명한다.

### Input

```
Selected Product Profile

+

Extension Result

+

Customer ↔ Product Matching Result
```

### AI 생성

각 제품별로 **Product Discovery Story**를 생성한다.

### 예시

❌ 일반 상품 설명

> This bag is made of leather and has a soft silhouette.
> 

⭕️ Personal Editorial

> This piece carries forward your preference for refined leather, while introducing a more contemporary expression of heritage.
> 

즉 제품 설명의 핵심은, **“제품에 무엇이 있는가”** 보다 
**“이 제품이 고객의 기존 취향을 어떻게 새로운 방향으로 확장하는가”** 에 둔다.

---

#### Multiple PASS Candidate Handling

### 목적

한 Event에서 여러 제품이 PASS되더라도 제품별 추천 리스트를 생성하지 않고, 
**하나의 Event 중심 Personal Editorial 안에 여러 Product Discovery**를 구성한다.

### 핵심 구조

```
Event
=
Editorial의 큰 카테고리

Product
=
Event 안의 개별 Discovery
```

### Flow

```
Multiple PASS Products

        ↓

Event Theme을 중심으로
Editorial Story 구성

        ↓

Product별 Extension 정리

        ↓

One Personal Editorial Issue
```

### 예시

```
Tokyo New Collection

        ↓

Brand / Event Story
"이번 MCM의 새로운 변화"

        ↓

Personal Connection
"이 변화가 고객의 이런 취향과 연결"

        ↓

Product Discovery A
"기존 취향에서 A 방향으로 확장"

Product Discovery B
"기존 취향에서 B 방향으로 확장"

Product Discovery C
"기존 취향에서 C 방향으로 확장"

        ↓

Closing Discovery Message
```

따라서,

### ❌ Recommendation

```
Recommended Products:

1. Bag
2. Wallet
3. Accessory
```

가 아니라,

### ⭕️ Editorial

```
Tokyo Collection

A Modern Interpretation of Heritage

Your preference for refined leather and heritage expressions
continues through a new MCM direction.

Product A
→ Contemporary heritage expression

Product B
→ A more restrained interpretation

Product C
→ A new material expression
```

형태로 구성한다.

#### Editorial Output Structure

#### 역할

: AI가 생성하는 최종 콘텐츠 필드는 다음과 같다.

### Personal Editorial Output

1. Editorial Title
2. Brand / Event Story
3. Personal Connection
4. Product Discovery
5. Closing Discovery Message

---

### 1) Editorial Title

Issue 전체를 대표하는 제목.

### 예시

> A Modern Interpretation of Heritage
> 

---

### 2) Brand / Event Story

이번 MCM Event / Campaign이 어떤 변화인지 설명한다.

---

### 3) Personal Connection

해당 변화가 고객의 기존 취향과 **왜 연결되는지** 설명한다.

---

### 4) Product Discovery

PASS된 각 제품이 고객 취향을 **어떤 새로운 방향으로 확장하는지** 설명한다.

제품이 여러 개인 경우 배열 형태로 생성한다.

---

### 5) Closing Discovery Message

Editorial 전체의 의미를 짧게 마무리한다.

### 예시

> A familiar sensibility, seen through a new MCM expression.
> 

#### Visual Asset Selection

### 원칙

AI는 새로운 MCM Product Image를 생성하거나 기존 이미지를 수정하지 않는다.

**MCM 공식 Asset만 활용한다.**

### Visual Structure

```
Event Visual Assets

+

Selected Product Images

        ↓

Editorial Visual Set
```

### 활용

**Hero Image**

Event / Campaign 대표 이미지

**Product Image**

각 PASS Product의 공식 이미지

**Secondary Event Image**

필요한 경우 Event / Collection 보조 이미지

### 핵심 원칙

> AI는 Visual을 생성하는 것이 아니라, 이미 존재하는 **MCM 공식 Asset을 Editorial 구성에 맞게 선택한다.**
> 

---

#### Editorial Tone Rule

Editorial은 일반 추천 서비스나 AI 스타일리스트가 아닌 **Luxury Fashion Editorial 톤**으로 작성한다.

### 참고 방향

Chanel 등 Luxury Fashion House Editorial에서 사용하는 **정제되고 절제된 매거진 문체**

### Tone

- Luxury editorial
- Elegant
- Refined
- Concise
- Restrained
- Brand-first
- Discovery-oriented

### 금지 방향

- 과도한 판매 문구
- `"Recommended for you"`
- 직접적인 구매 유도
- 과도한 개인화 표현
- 캐주얼한 AI Assistant 톤

### 예시

❌

> We think you'll absolutely love this bag!
> 

⭕️

> A familiar heritage expression returns in a more contemporary form.
> 

---

#### Hallucination Prevention Rule

Personal Editorial Generation AI는 **새로운 브랜드 사실이나 제품 정보를 생성하지 않는다.**

이미 검증된 Input 데이터를 **Editorial 문장으로 재구성하는 역할만 수행한다.**

### Event / Campaign

Event 관련 내용은 다음 데이터에 존재하는 정보만 사용한다.

```
Event Profile
+
Event Meaning Profile
```

### Product

Product 관련 내용은 다음 데이터에 존재하는 정보만 사용한다.

```
Product Profile
+
Product Information
```

### Customer

Customer 관련 내용은 다음 데이터에 존재하는 정보만 사용한다.

```
Customer Taste Profile
+
Matching Results
```

### 생성 금지

제공되지 않은 다음 정보를 임의로 생성하지 않는다.

- 브랜드 스토리
- 도시 / 문화 맥락
- 소재
- 제품 특징
- 고객 행동
- 고객 성격
- 가격
- 출시 정보

#### LLM Prompt

## System Prompt

```
You are a luxury editorial writer for MCM.

Your task is to transform validated customer-event-product connections into a refined Personal Editorial.

Write in the tone of a high-end luxury fashion magazine:
- elegant
- concise
- restrained
- editorial, not promotional

Do not use sales-heavy language.
Do not say "recommended for you."
Do not exaggerate personalization.
Do not invent product, campaign, customer, city, or brand facts.

Use only the provided:
- Event information
- Customer Taste Profile
- Matching results
- Extension result
- Product information

The editorial should follow this narrative:

1. Introduce the new MCM event or brand change.
2. Explain how this direction connects with the customer's existing taste.
3. Present each selected product as a new discovery or extension of that taste.
4. End with a concise editorial closing message.

If multiple products are provided, treat the Event as the main editorial theme and each product as an individual discovery within the same story.
```

---

## User Prompt

```
Create one Personal Editorial using the following validated data.

Issue Candidate:
{issue_candidate}

Event Meaning Profile:
{event_meaning_profile}

Customer Taste Profile:
{customer_taste_profile}

Selected Product Profiles:
{selected_product_profiles}

Generate:

1. Editorial Title
2. Brand / Event Story
3. Personal Connection
4. One Product Discovery Story for each selected product
5. Closing Discovery Message

Requirements:

- Base the Brand / Event Story only on the provided Event data.
- Base personalization only on the provided Customer Profile and Matching results.
- Base each Product Discovery only on the corresponding Product Profile and Extension result.
- Do not introduce facts that are not present in the input.
- Keep the writing concise and refined.
- Maintain a luxury fashion editorial tone.
- Avoid product recommendation language and purchase-oriented copy.

Return the result in the required JSON format.
```

---

#### OUTPUT

### Output JSON

```json
{
  "issue_id": "ISSUE_001",
  "customer_id": "CUSTOMER_001",
  "event_id": "EVENT_001",

  "editorial_title": "A Modern Interpretation of Heritage",

  "brand_event_story": "MCM reinterprets its heritage through a contemporary point of view.",

  "personal_connection": "Your preference for refined leather and heritage-driven expressions naturally connects with this new direction.",

  "product_discoveries": [
    {
      "product_id": "PRODUCT_001",
      "product_story": "A softer expression introduces a more contemporary interpretation of the heritage aesthetic already present in your selections."
    },
    {
      "product_id": "PRODUCT_002",
      "product_story": "A restrained expression extends your existing preference into another interpretation of MCM heritage."
    }
  ],

  "closing_discovery_message": "A familiar sensibility, seen through a new MCM expression.",

  "visual_assets": {
    "hero_image": "EVENT_IMAGE_URL",
    "product_images": [
      {
        "product_id": "PRODUCT_001",
        "image_url": "PRODUCT_IMAGE_URL"
      },
      {
        "product_id": "PRODUCT_002",
        "image_url": "PRODUCT_IMAGE_URL"
      }
    ]
  },

  "delivery_type": "email_editorial"
}
```

#### Rule Validation

### 목적

AI가 생성한 Editorial 결과가 정의된 형식과 실제 데이터 범위를 벗어나지 않는지 최종 검증한다.

```
Editorial Generation

        ↓

Rule Validation

        ↓

Final Personal Editorial
```

---

### Validation Rule

### 1. Required Field Validation

필수 Output 존재 여부를 확인한다.

- Editorial Title
- Brand / Event Story
- Personal Connection
- Product Discovery
- Closing Discovery Message

---

### 2. JSON Format Validation

정의된 JSON Schema에 맞는지 확인한다.

---

### 3. Product ID Validation

`product_discoveries`에 포함된 Product ID가 실제 Editorial Gatekeeper에서 PASS된 Product인지 검증한다.

```
Generated Product ID

        ↓

PASS Product IDs 확인

        ↓

Valid / Reject
```

---

### 4. Fact Grounding Validation

Editorial에 포함된 내용이 Input 데이터에 실제 존재하는지 검증한다.

```
Event Claim
→ Event Profile

Product Claim
→ Product Profile

Customer Claim
→ Customer Taste Profile / Matching Result
```

근거 없는 정보가 포함되면 **Reject 또는 재생성**한다.

---

### 5. Tone / Forbidden Expression Validation

다음과 같은 표현이 포함되지 않았는지 확인한다.

- `"Recommended for you"`
- 과도한 구매 유도
- 과장된 개인화 표현
- Input에 존재하지 않는 브랜드 주장

---

### Delivery

Rule Validation을 통과한 Editorial은 고객에게 **Email Editorial** 형태로 전달한다.

MVP에서는 **Email을 최종 고객 접점**으로 사용한다.

```
Final Personal Editorial

        ↓

Email Delivery

        ↓

Customer reads Personal Editorial
```

향후 **MCM My Page 내부 Personal Editorial Archive**로 확장할 수 있다.

---

#### Final Flow

```
Editorial Gatekeeper

        ↓

PASS Issue Candidate

        ↓

Personal Editorial Generation AI

        ↓

Brand / Event Story

        ↓

Personal Connection

        ↓

Product Discovery
(Event 중심 + Multiple Products)

        ↓

Closing Discovery Message

        ↓

Official MCM Visual Asset Selection

        ↓

Rule Validation

        ↓

Final Personal Editorial

        ↓

Email Delivery
```

---

---

### 5.Email Editorial Rendering & Delivery Layer

#### 목적

Personal Editorial Generation AI에서 생성된 **Editorial JSON**을 사전에 정의된 **Email Editorial Template**에 자동으로 매핑하고, 최종 HTML Email로 렌더링한 뒤 고객 이메일로 발송한다.

AI가 매번 새로운 레이아웃을 생성하는 방식이 아니라,

> **AI는 콘텐츠를 생성하고, Template은 디자인 구조를 담당하며, Rendering Layer가 JSON과 Template을 연결하고, Email Delivery Service가 실제 발송을 담당한다.**
> 

### 핵심 한 줄

> **AI가 생성한 Personal Editorial JSON을 사전에 정의된 MCM Email Editorial Template에 Binding하여 HTML Email을 생성하고, Email Delivery Service API를 통해 고객에게 실제 발송한다.**
> 

#### 전체 구조

```
Personal Editorial Generation AI

        ↓

Editorial JSON

        ↓

Rule Validation

        ↓

Email Editorial Template

        ↓

JSON Data Binding

        ↓

Final HTML Email

        ↓

Email Delivery Service API

        ↓

Customer Email Delivery
```

#### Input

#### 역할

Rendering Layer는 Personal Editorial Generation AI에서 최종 검증된 **Editorial JSON**을 Input으로 사용한다.

### Input Example

```json
{
  "issue_id": "ISSUE_001",
  "customer_id": "CUSTOMER_001",
  "event_id": "EVENT_001",

  "editorial_title":
  "A Modern Interpretation of Heritage",

  "brand_event_story":
  "MCM reinterprets its heritage through a contemporary point of view.",

  "personal_connection":
  "Your preference for refined leather and heritage-driven expressions naturally connects with this new direction.",

  "product_discoveries": [
    {
      "product_id": "PRODUCT_001",
      "product_story":
      "A softer expression introduces a more contemporary interpretation of the heritage aesthetic already present in your selections."
    },
    {
      "product_id": "PRODUCT_002",
      "product_story":
      "A restrained expression extends your existing preference into another interpretation of MCM heritage."
    }
  ],

  "closing_discovery_message":
  "A familiar sensibility, seen through a new MCM expression.",

  "visual_assets": {
    "hero_image": "EVENT_IMAGE_URL",

    "product_images": [
      {
        "product_id": "PRODUCT_001",
        "image_url": "PRODUCT_IMAGE_URL"
      },
      {
        "product_id": "PRODUCT_002",
        "image_url": "PRODUCT_IMAGE_URL"
      }
    ]
  }
}
```

#### Email Editorial Template

#### 목적

- MCM의 브랜드 경험과 이메일 가독성을 고려한 **사전 정의 Editorial Layout / Grid**를 사용한다.
- AI가 Layout을 직접 생성하거나 변경하지 않는다.
- MVP에서는 아래 단일 Template을 우선 사용한다.

본 Template은 MVP 개발을 위한 초기 구조이며, 이후 Layout / Grid / Typography / Visual Styling은 자유롭게 변경할 수 있다.

Editorial JSON은 콘텐츠 의미 중심으로 유지하므로 Template 변경이 AI Logic에 영향을 주지 않는다.

```
┌──────────────────────────┐
│        MCM LOGO          │
│                          │
│      {{hero_image}}      │
│                          │
│   {{editorial_title}}    │
│                          │
│ {{brand_event_story}}    │
├──────────────────────────┤
│                          │
│ {{personal_connection}}  │
│                          │
├──────────────────────────┤
│ {{product_image_1}}      │
│ {{product_story_1}}      │
│                          │
│ {{product_image_2}}      │
│ {{product_story_2}}      │
├──────────────────────────┤
│ {{closing_message}}      │
└──────────────────────────┘
```

#### JSON Data Binding

#### 목적

Editorial JSON의 각 콘텐츠 필드를 Email Template의 대응 Component에 자동으로 연결한다.

```
editorial_title
        ↓
Editorial Title Component
```

```
brand_event_story
        ↓
Brand / Event Story Component
```

```
personal_connection
        ↓
Personal Connection Component
```

```
product_discoveries[]
        ↓
Product Discovery Component
```

```
visual_assets
        ↓
Hero / Product Image Component
```

```
closing_discovery_message
        ↓
Closing Component
```

#### Multiple Product Rendering

한 Event에서 여러 제품이 PASS된 경우에도 AI가 별도의 새로운 Layout을 생성하지 않는다.

`product_discoveries[]` 배열의 개수만큼 **Product Discovery Component를 반복 렌더링**한다.

```
product_discoveries[0]
        ↓
Product Discovery Component

product_discoveries[1]
        ↓
Product Discovery Component

product_discoveries[2]
        ↓
Product Discovery Component
```

예:

```
PASS Product 1개
→ Product Discovery Component 1개

PASS Product 3개
→ Product Discovery Component 3개
```

#### Visual Asset Binding Rule

AI가 새로운 MCM 이미지를 생성하거나 기존 제품 이미지를 수정하지 않는다.

Personal Editorial Generation AI에서 선택된 **MCM 공식 Visual Asset**을 Template 이미지 영역에 매핑한다.

```
Event Hero Image
        ↓
Hero Image Component
```

```
Product Image
        ↓
각 Product Discovery Component
```

#### Template Design Principle

### 핵심 원칙

Template은 AI Logic과 분리하여 관리한다.

```
AI Logic
        ↓
Editorial JSON
        ↓
Template
        ↓
Final Email
```

따라서 Layout이나 Grid가 변경되더라도:

- AI Prompt
- AI Matching Logic
- Editorial Generation Logic
- Editorial JSON Schema 를 다시 설계할 필요가 없다.

#### JSON 설계 원칙

Editorial JSON은 특정 Layout에 종속되지 않고 **콘텐츠 의미 중심**으로 구성한다.

### 사용

```
editorial_title

brand_event_story

personal_connection

product_discoveries[]

closing_discovery_message

visual_assets
```

### 사용하지 않음

```
left_column_text

top_right_image

second_row_title
```

이처럼 화면 위치 기준 필드는 사용하지 않는다.

#### MVP 구현 방식

MVP에서는 개발 속도를 우선하여 아래와 같은 구조로 구현한다.

Template 디자인은 이후 변경 가능하다.

```
1 Editorial JSON Schema

+

1 Email Editorial Template

+

Dynamic Data Binding
```

#### Email Delivery Logic

### 목적

렌더링된 Final HTML Email을 실제 고객 이메일 주소로 발송한다.

MVP에서는 Gmail API를 직접 구현하지 않고, **Email Delivery Service API**를 사용한다.

---

### Flow

```
Final HTML Email

        ↓

Customer ID 기준
Customer Email 조회

        ↓

Email Delivery Service API

        ↓

Email Send

        ↓

Delivery Status 저장
```

---

### Customer Email Lookup

`customer_id`를 기준으로 Customer DB에서 실제 이메일 주소를 조회한다.

예:

```
{
  "customer_id": "CUSTOMER_001",
  "email": "customer@example.com"
}
```

#### Email Delivery Service in MVP

MVP에서는 Email Delivery 전용 서비스를 활용한다.

역할:

```
To
+
Subject
+
Rendered HTML
        ↓
Email Delivery API
        ↓
Send
```

즉 최종적으로:

```
From:
MCM

To:
customer@example.com

Subject:
Your Personal Editorial

Body:
Rendered Personal Editorial HTML
```

형태로 발송된다.

#### Delivery Status

#### 목적

메일 발송 결과를 간단하게 저장한다.

### 예시

```json
{
  "issue_id": "ISSUE_001",

  "customer_id": "CUSTOMER_001",

  "email": "customer@example.com",

  "delivery_status": "sent"
}
```

MVP 기준 상태값은 최소한으로 관리한다.

```
pending
sent
failed
```

#### MVP Delivery Flow 최종

### MVP Delivery Flow

```
Personal Editorial JSON

        ↓

Template Rendering

        ↓

Final HTML Email

        ↓

Customer Email Lookup

        ↓

Email Delivery Service API

        ↓

Actual Email Send

        ↓

Customer receives Email

        ↓

Customer reads Personal Editorial
```

---

### Production 확장 방향

실제 운영에서는 MCM 내부 CRM / Email Marketing Infrastructure와 연결할 수 있다.

```
MVP

Email Delivery Service API

        ↓

Production

MCM CRM
+
Customer Communication Infrastructure
```

또한 동일한 Editorial JSON을 활용하여 향후:

- MCM My Page
- Personal Editorial Archive
- 다른 CRM Channel

등으로 확장할 수 있다.

---

### Final Flow

```
Personal Editorial Generation AI

        ↓

Editorial JSON

        ↓

Rule Validation

        ↓

Email Editorial Template

        ↓

JSON Data Binding

        ↓

Dynamic Product Component Rendering

        ↓

Official MCM Visual Asset Binding

        ↓

Final HTML Personal Editorial

        ↓

Customer Email Lookup

        ↓

Email Delivery Service API

        ↓

Email Delivery

        ↓

Customer reads Personal Editorial
```

---

# 역할 분리

| Layer | 역할 |
| --- | --- |
| Personal Editorial Generation AI | Editorial 콘텐츠 생성 |
| Editorial JSON | AI 결과를 구조화된 데이터로 전달 |
| Email Editorial Template | Layout / Grid / Visual Structure 정의 |
| Rendering Layer | JSON을 Template에 Binding |
| Email Delivery Service | 실제 이메일 발송 |
| Customer DB | 고객 이메일 조회 |
| Delivery Status | 발송 결과 저장 |

---

---

---

---

---

[https://app.notion.com](https://app.notion.com)