# MCM Personal Editorial Engine --- 실행 기획안

> **문서 목적**\
> PRD 이전 단계에서 팀이 동일한 서비스 구조와 AI Logic, MVP 범위, 데모
> 방향을 공유하기 위한 실행 기준 문서.

------------------------------------------------------------------------

## 1. 서비스 개요

### 한 줄 정의

**MCM 구매 고객의 실제 선택에서 AI가 미적 취향을 발견하고, 글로벌 MCM의
새로운 변화와 연결해 '이 고객에게 의미 있는 새로운 발견'이 존재할 때만
Personal Editorial을 발행하는 서비스.**

### 핵심 메시지

> **내가 좋아하는 것을 또 추천하는 것이 아니라, 내 취향을 통해 아직
> 몰랐던 새로운 MCM을 발견한다.**

기존 추천 시스템이 고객과 가장 비슷한 상품을 찾는다면, MY MCM은 고객의
취향과 연결되면서도 **이미 알고 있는 취향의 반복이 아닌 새로운 발견**을
찾는다.

### 문제 정의

기존 디지털 개인화는 주로 구매 이력 기반 유사 상품 추천에 머무르기 쉽다.
우리는 상품 추천이 아니라 **고객의 취향을 렌즈로 새로운 MCM의 세계를
발견하게 하는 Post-purchase Customer Engagement**에 집중한다.

### Target

-   MCM 구매 경험이 있는 Existing Customer
-   구매 이력과 관심 행동 등 취향을 해석할 충분한 Evidence가 있는 고객
-   데이터가 부족하면 억지로 Personal Editorial을 발행하지 않음
-   신규/단순 방문 고객은 기존 Catalogue·Campaign 경험 유지

------------------------------------------------------------------------

## 2. 핵심 서비스 --- MY MCM

고객마다 개인화된 **Digital Luxury Magazine**인 `MY MCM`이 생성된다.

``` text
MY MCM
├─ ISSUE 01
├─ ISSUE 02
├─ ISSUE 03
└─ ...
```

Issue는 정기적으로 강제 발행하지 않는다.

> **We publish only when there is something worth saying.**

New Season Drop, City Signal 등은 **발행 조건이 아니라 탐색 Trigger**다.
AI가 실제로 고객에게 의미 있는 새로운 이야기가 있다고 판단한 경우에만
Issue를 발행한다.

------------------------------------------------------------------------

## 3. 전체 서비스 Flow

```text
고객의 MCM 구매 / 관심 데이터
        ↓
① SEE — Visual Taste Discovery
        ↓
New Season / City / Global Signal
        ↓
Global MCM 후보 탐색
        ↓
② CONNECT — Meaning Discovery
        ↓
Editorial Angle A / B / C 생성
        ↓
③ EDIT — Editorial Gate
        ↓
   A / B / C / NONE
        ↓
PASS                 NONE
 ↓                     ↓
④ CREATE            발행하지 않음
Personal Editorial 자동 생성
 ↓
⑤ PUBLISH
MY MCM Issue 자동 발행
```

핵심 AI 경험은 **SEE → CONNECT → EDIT → CREATE → PUBLISH**로 설명한다.

# 4. AI Logic

## 4.1 SEE --- Visual Taste Discovery

고객이 실제로 선택한 **MCM 제품 이미지 자체**를 Multimodal AI가 보고
반복되는 시각적·미적 패턴을 발견한다.

기존처럼 `Color / Silhouette / Monogram Density` 등의 고정 Taste Axis에
고객을 분류하지 않는다.

핵심 질문:

> **What recurring visual or aesthetic principles best explain the
> pieces this customer has actually chosen?**

예시 결과: - Muted Tonal Expression - Soft Structural Forms -
Material-led Expression - Restrained Branding

위 패턴은 사전 분류표가 아니라 **고객의 실제 선택 이미지에서 동적으로
발견되는 결과**다.

## 4.2 Purchase / Wishlist 역할

### Purchase = Taste Foundation

**고객이 실제로 반복해서 선택해온 미감.** Taste Discovery의 기반
Evidence.

### Wishlist / Interest = Taste Expansion

**고객의 취향이 최근 어느 방향으로 확장되고 있는지 보여주는 보조
Evidence.**

> **Purchase = What you consistently choose**\
> **Wishlist = Where your taste may be moving**

## 4.3 Evidence Grounding

모든 Taste Pattern에 실제 근거 제품을 연결한다.

``` text
Taste Pattern
Muted Tonal Expression

Evidence
- Purchase A
- Purchase B
- Purchase C

Reason
서로 다른 색상을 선택했지만,
세 제품 모두 절제된 톤과 낮은 시각적 대비를 반복적으로 보여준다.
```

MVP 검증 장치: 1. 최소 2개 이상의 Evidence 요구 2. Evidence Product ID가
실제 입력에 존재하는지 Rule 검증 3. Counter Evidence 탐색 4. Taste
Pattern과 실제 Evidence 이미지를 병치

> **AI = Pattern Discovery**\
> **Rule = Evidence Validation**

## 4.4 CONNECT --- Meaning Discovery

New Season Drop / City Signal은 발행 조건이 아니라 새로운 Editorial
가능성을 탐색하는 Trigger다.

AI 입력: - Customer Taste Pattern - Taste Evidence - Global / City
Signal - 관련 MCM Product / Collection - Past Issues

핵심 질문:

> **이 Global MCM 변화가 이 고객의 취향과 연결되면서도, 이미 알고 있는
> 취향의 반복이 아닌 새로운 발견이 될 수 있는가?**

> **Connected enough to feel personal, different enough to feel like
> discovery.**

## 4.5 추천 시스템과의 차이

고객이 `Brown / Structured / Restrained` 미감에 반복적으로 반응했다고
가정한다.

**Candidate A --- 매우 유사**

``` text
Brown / Structured / Restrained 신상품
일반 Recommendation → High Similarity → Recommend
MY MCM → 이미 알고 있는 취향의 반복 → REJECT
```

**Candidate B --- 연결되지만 새로운 표현**

``` text
Tokyo Deep Navy
기존 구조감과 절제된 표현은 연결되지만 새로운 컬러 표현
MY MCM → Personal Connection + New Discovery → PASS
```

> **Recommendation = 가장 비슷한 것을 찾는다.**\
> **MY MCM = 나와 연결되지만 아직 알지 못했던 것을 찾는다.**

## 4.6 EDIT --- Editor + Gatekeeper

Self-approval 편향을 줄이기 위해 **생성과 판정을 분리**한다.

### STEP A --- AI Editor

Customer Taste + Evidence + Global Candidate + Past Issues를 보고 **서로
다른 Editorial Angle 3개**를 생성한다.

### STEP B --- AI Gatekeeper

별도 AI 호출에서 후보를 `A / B / C`로 익명화해 전달한다.

판단 기준: 1. Evidence Grounding 2. Specificity 3. Novelty 4. Discovery
Value

출력:

``` text
A / B / C / NONE
```

세 후보 모두 충분하지 않으면:

``` text
NONE → Issue 생성하지 않음
```

------------------------------------------------------------------------


## 4.7 CREATE — Personal Editorial 자동 생성

Gatekeeper가 `A / B / C` 중 하나를 PASS시키면 AI가 선택된 Editorial Angle을 바탕으로 **실제 Digital Magazine Issue에 들어갈 콘텐츠 전체를 자동 생성**한다.

AI 입력:

```text
Selected Editorial Angle
+
Customer Taste / Evidence
+
Global / City Context
+
Selected Product / Collection
+
Available MCM Image Assets
+
Past Issue Context
```

AI는 다음과 같은 구조화된 Issue JSON을 반환한다.

```json
{
  "issue_number": "03",
  "city": "TOKYO",
  "hero": {
    "headline": "A Different Kind of Quiet",
    "subheadline": "Tokyo, seen through your taste",
    "image_id": "tokyo_campaign_04"
  },
  "story": {
    "title": "Quiet, Reconsidered",
    "body": "..."
  },
  "why_you": {
    "title": "Why this found you",
    "body": "..."
  },
  "discovery": {
    "product_id": "MCM_023",
    "image_id": "product_023",
    "body": "..."
  },
  "experience": {
    "city": "Tokyo",
    "store": "MCM Tokyo",
    "body": "..."
  },
  "closing": {
    "text": "Your next MCM story."
  }
}
```

즉 AI는 Caption 하나만 작성하는 것이 아니라 **Headline / Story / Why This Story / Discovery / City Context / 사용할 Product와 Image Asset까지 편집**한다.

### 이미지 처리 원칙

MVP에서는 AI 이미지 생성까지 하지 않는다. MCM의 기존 Product / Campaign / Store 이미지를 사용하고, AI는 사용 가능한 Asset 목록 중 어떤 이미지를 어느 Section에 사용할지 선택한다.

> **AI = 편집장**  
> **MCM Asset = 잡지 소재**  
> **Frontend Template = 지면**

## 4.8 PUBLISH — MY MCM 자동 발행

AI가 생성한 Issue JSON을 DB에 저장하고, 프론트의 고정 Magazine Template에 주입한다.

```text
AI Issue JSON
        ↓
DB 저장
        ↓
React Magazine Template
        ↓
MY MCM ISSUE 03 자동 생성
```

AI가 매번 HTML/CSS를 새로 생성하는 구조가 아니다. **무엇을 보여줄지는 AI가 결정하고, 어떻게 보여줄지는 미리 만든 Luxury Magazine Template이 담당한다.**

고객마다 같은 Template을 사용하더라도 도시, 제품, 이미지, Headline, Story, Why You가 달라지므로 서로 다른 Personal Magazine Issue가 만들어진다.

# 5. Rule의 역할

Rule은 Taste Pattern을 미리 정의하지 않는다.

### Rule

-   Signal / Trigger 감지
-   고객 최소 데이터 조건
-   Purchase / Wishlist 구분
-   Global 후보 Retrieval
-   동일 Issue 중복 방지
-   Evidence Product ID 검증
-   Pattern당 최소 Evidence 수
-   DB / API Validation

### AI

-   이미지 기반 Visual Taste Discovery
-   Global × Personal Meaning Discovery
-   Editorial Angle 생성
-   Editorial Worthiness 판단
-   Editorial Narrative 생성

> **Rule = Control / Validation / Retrieval**\
> **AI = Interpretation / Meaning / Editorial Judgment**

------------------------------------------------------------------------

# 6. MVP Scope

**전제: 2인 팀 / 약 1주.** 목표는 실서비스 완성이 아니라 **핵심 AI
경험의 작동 증명**이다.

## MUST

1.  데모 고객 1\~2명
    -   Purchase 이미지 3\~5개
    -   Wishlist / Interest 이미지 2\~3개
    -   Past Issue 일부
2.  Multimodal Taste Discovery
    -   Taste Pattern + Evidence + Counter Evidence
3.  Global Signal Simulation
    -   예: `New Tokyo Season Drop`
4.  AI Editor
    -   Editorial Angle 3개 생성
5.  AI Gatekeeper
    -   익명 `A / B / C / NONE`
6.  실제 REJECT 동작
    -   의미 없는 Candidate에서는 Issue 미생성
7.  MY MCM UI
    -   PASS된 Issue를 Digital Luxury Magazine 형태로 노출

## SHOULD

-   Taste Pattern + Evidence 이미지 시각화
-   Purchase / Wishlist 구분 UI
-   Counter Evidence 표시
-   Past Issue 비교
-   Issue Archive 완성도 개선

## CUT

-   자체 Vision / Recommendation Model 학습
-   Fine-tuning
-   Vision Embedding Pipeline
-   Vector DB / 대규모 Clustering
-   실제 MCM POS / CRM 연동
-   수천 개 상품 실시간 분석
-   복잡한 Stage / Phase
-   정반대 매칭
-   강제 발행 하한선
-   실제 카카오톡 / 이메일 발송
-   매출 임팩트 예측

------------------------------------------------------------------------

# 7. 화면 구성

## 7.1 MY MCM

``` text
MY MCM

ISSUE 03
TOKYO
A DIFFERENT KIND OF QUIET

ISSUE 02
BERLIN
...

ISSUE 01
SEOUL
...
```

개인 Editorial Archive처럼 탐색한다.

## 7.2 Issue Detail

``` text
[ HERO ]
TOKYO / ISSUE 03 / Large Editorial Image

[ STORY ]
Editorial Headline + AI Generated Story

[ WHY THIS STORY ]
고객 취향과 Global 변화의 연결

[ DISCOVERY ]
관련 MCM Collection / Product

[ EXPERIENCE ]
MCM TOKYO / 도시·매장 정보

[ END ]
Your next MCM story.
```

UI 원칙: - 영어 기본 - 큰 이미지와 충분한 여백 - Typography 중심 - 제품
스펙 나열 최소화 - 직접적인 구매 CTA 없음 - 상품 진열보다 하나의
이야기를 읽는 경험

------------------------------------------------------------------------

# 8. 데모 시나리오

데모의 핵심은 **예쁜 Editorial 생성보다 AI가 선택하고 거절하는 Logic을
증명하는 것**이다.

## Scene 1 --- SEE

고객의 Purchase / Saved 제품 이미지를 보여준다.

`Discover My Taste` 실행 → AI가 Taste Pattern을 생성하고 Evidence
이미지를 함께 표시.

전달 메시지: \> 미리 정의된 취향 카테고리에 고객을 분류하는 것이 아니라,
고객이 실제 선택한 제품 이미지에서 반복되는 미적 패턴을 AI가 발견합니다.

## Scene 2 --- Global Signal

``` text
NEW SIGNAL
Tokyo — New Season Drop
```

Trigger 실행.

## Scene 3 --- REJECT ⭐

고객 기존 취향과 거의 완전히 유사한 Candidate.

``` text
일반 추천 → High Similarity → Recommend
MY MCM → REJECT
"This repeats what the customer already knows."
```

Issue는 생성되지 않는다.

전달 메시지: \> 저희는 가장 잘 맞는 상품을 추천하는 시스템이 아닙니다.
이미 알고 있는 취향의 반복이라면 오히려 발행하지 않습니다.

## Scene 4 — PASS

다른 Candidate는 고객 취향과 연결되지만 새로운 표현을 제공한다.

AI Editor:

```text
Angle A
Angle B
Angle C
```

Gatekeeper:

```text
Candidate B — PASS
```

## Scene 5 — CREATE ⭐

PASS된 Angle을 바탕으로 AI가 실제 Magazine Issue JSON을 생성한다.

화면에는 예를 들어 다음 상태를 보여줄 수 있다.

```text
Generating your next MCM story...
```

이후 Headline / Story / Why This Story / Product / Image가 채워진다.

## Scene 6 — PUBLISH ⭐

MY MCM 화면으로 이동한다.

기존:

```text
ISSUE 01
ISSUE 02
```

새로운 Issue:

```text
ISSUE 03 — TOKYO
```

가 자동으로 추가된다.

Issue Detail을 클릭하면 완성된 Personal Magazine을 확인할 수 있다.

### 최종 전달 메시지

> **AI가 고객이 이미 좋아하는 것을 다시 추천하는 것이 아니라, 그 취향을 통해 아직 발견하지 못한 새로운 MCM을 찾아 하나의 Personal Magazine으로 직접 편집·발행합니다.**

# 9. 데모 Test Case

### CASE A --- PASS

`Connected + New → PASS → Issue 발행`

### CASE B --- AMBIGUOUS

`Good Connection + Past Issue와 유사 → Gatekeeper Novelty 판단`

### CASE C --- REJECT ⭐

`Very High Similarity + No New Discovery → REJECT → 미발행`

**취향이 안 맞아서 REJECT하는 것이 아니라, 너무 잘 맞지만 새로운 발견이
아니기 때문에 REJECT해야 한다.**

------------------------------------------------------------------------

# 10. 기술 흐름

```text
Customer Data
(Purchase Images + Wishlist Images)
        ↓
Multimodal AI
Visual Taste Discovery
        ↓
Taste Pattern + Evidence + Counter Evidence
        ↓
Global Signal
        ↓
Candidate Retrieval
        ↓
AI Editor
Angle A / B / C
        ↓
AI Gatekeeper
A / B / C / NONE
        ↓
PASS                    NONE
 ↓                        ↓
Editorial Generator      No Issue
 ↓
Issue JSON
 ↓
DB
 ↓
React Magazine Template
 ↓
MY MCM Issue
```

# 11. 개발 우선순위

UI보다 **AI Logic PoC를 먼저 검증**한다.

## Day 1 — Gatekeeper PoC
- PASS / AMBIGUOUS / REJECT 테스트 데이터 작성
- `A / B / C / NONE` 구현
- REJECT가 안정적으로 발생하는지 확인

## Day 2 — Visual Taste Discovery PoC
- Purchase / Wishlist 이미지 입력
- Taste Pattern / Evidence / Counter Evidence 확인

## Day 3 — Editor + Gatekeeper 연결

```text
Taste
→ Global Candidate
→ Angle A/B/C
→ Gatekeeper
```

## Day 4 — Editorial Generator
PASS된 Angle에서 Headline / Story / Why This Story / Discovery / Experience / Image IDs를 포함한 Issue JSON 생성.

## Day 5 — MY MCM UI
- Magazine Template
- Issue Detail
- Archive

## Day 6 — DB / 전체 Flow

```text
PASS → Generate → Save → Publish
NONE → No Issue
```

## Day 7 — Demo QA / 촬영
- 프롬프트 안정화
- 데모 데이터 고정
- PASS / REJECT 검증
- Issue 자동 생성 검증
- 영상 촬영

# 12. 데모 촬영 원칙

영상에서는 기술 설명을 길게 하기보다 **추천 시스템과 다른 결과가 나오는 순간 + AI가 실제 Magazine을 자동 생성하는 순간**을 명확하게 보여준다.

반드시 촬영할 장면:

1. 고객의 실제 Purchase / Wishlist 이미지
2. AI Visual Taste Discovery
3. Taste Pattern + Evidence
4. Tokyo Signal 발생
5. **High Similarity Candidate → REJECT**
6. 새로운 Candidate → PASS
7. **AI가 Magazine Issue JSON 자동 생성**
8. **MY MCM에 ISSUE 03 자동 추가**
9. 완성된 Magazine Detail

가장 중요한 두 장면:

> **“가장 비슷하지만 새로운 발견이 아니어서 REJECT합니다.”**

> **“PASS된 이야기는 AI가 실제 Personal Magazine Issue로 자동 편집·발행합니다.”**

# 13. 향후 실서비스 고도화

MVP에서는 기존 Multimodal AI / LLM API를 사용한다.

``` text
MCM Product Images
+
POS / CRM / Customer Interaction Data
        ↓
Vision Embedding
+
Customer Taste Representation
        ↓
Large-scale Candidate Retrieval
        ↓
Personalization / Recommendation Model
        ↓
AI Personal Editorial Engine
```

향후 Vision Embedding, 실제 POS/CRM 연결, Customer Taste Representation,
대규모 Retrieval, Personalization Model, Fine-tuning, 장기 Editorial
반응 학습 등을 고려한다.

------------------------------------------------------------------------

# 14. 최종 핵심 원칙

### 우리가 만드는 것

**AI Personal Editor**

### AI의 역할

-   **SEE** --- 실제 선택 제품에서 미적 취향 발견
-   **CONNECT** --- 취향과 Global MCM 변화 사이의 의미 탐색
-   **EDIT** --- 개인적이면서 새로운 이야기만 발행

### Rule의 역할

조건 통제, Evidence 검증, 데이터 처리 및 Retrieval.

### Recommendation과의 차이

> **Recommendation:** "당신이 좋아하는 것과 가장 비슷한 상품입니다."\
> **MY MCM:** "당신의 취향과 연결되지만, 아직 당신이 발견하지 못한
> MCM입니다."

### 발행 원칙

> **We publish only when there is something worth saying.**

### MVP가 반드시 증명해야 하는 것

> **가장 비슷한 상품조차 새로운 발견이 아니라면 REJECT하고, 실제로
> 새로운 이야기가 성립할 때만 새로운 MY MCM Issue가 만들어진다.**
