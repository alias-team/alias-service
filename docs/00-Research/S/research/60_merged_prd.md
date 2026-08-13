# MCM Personal Editorial Engine

> **Final PRD & AI Design Spec — Hackathon Submission**
> 문서 상태: Final
> 서비스명: **MY MCM — Personal Editorial Engine**

---

## 0. Executive Summary

### 한 줄 정의

**MCM 구매 고객의 실제 선택에서 Multimodal LLM이 미적 취향을 발견하고, 글로벌 MCM의 새로운 변화와 연결해 '이 고객에게 의미 있는 새로운 발견'이 존재할 때만 개인 Editorial을 발행하는 서비스다.**

### 핵심 메시지

> **내가 좋아하는 것을 또 추천하는 것이 아니라, 내 취향을 통해 아직 몰랐던 새로운 MCM을 발견한다.**

일반 추천 시스템은 고객과 가장 비슷한 상품을 찾는다. MY MCM은 고객의 취향과 충분히 연결되면서도 이미 알고 있는 취향을 반복하지 않는 새로운 맥락을 찾는다. 가장 유사한 상품이라도 새로운 이야기가 없다면 거절하고, 발행할 가치가 있는 발견이 있을 때만 `MY MCM Issue`를 만든다.

### 발행 철학

> **We publish only when there is something worth saying.**

New Season Drop, City Signal, 구매 및 Wishlist 변화는 발행 명령이 아니라 탐색을 시작하는 Trigger다. 최종 발행 여부는 Gatekeeper가 결정한다.

### 해커톤에서 증명할 단 하나의 장면

> 일반 추천 시스템이라면 선택할 "가장 비슷한 상품"을 MY MCM은 새로운 발견이 아니라는 이유로 `NONE` 처리하고, 고객의 취향과 연결되면서도 새로운 표현을 가진 후보만 `PASS`한다.

---

## 1. 문제 정의

### 1.1 MCM이 직접 말한 문제

> **"Customer Engagement, 즉, 고객과 더 가까이 다가가는 것입니다. 너무나 많은 시장, 매년 수많은 고객을 상대하다 보니 럭셔리 브랜드에서 신경을 많이 써야 할 맞춤형 케어가 많이 부족합니다. 따라서, AI를 고객이 원하는 것을 한발 앞서 제시하고, 또 지속적인 초개인화 고객관리에 관심이 많습니다."**
> — MCM 공식 Q&A [QA-4-3]

> **"글로벌 디지털 노마드이며 연령대는 Gen MZ입니다."**
> **"국내 매출도 대부분 면세 매출인 관계로, 실제로 글로벌 고객 기여도는 브랜드 매출의 90% 이상을 상회합니다."**
> — MCM 공식 Q&A [QA-4-1]

> **"기존 재방문 고객들의 LTV를 올리는 데 관심이 많고"**
> — MCM 공식 Q&A [QA-4-1]

MCM은 원인을 스스로 진단했다 — **시장이 너무 많고 고객이 너무 많아서 사람의 힘으로는 맞춤형 케어가 불가능하다.** 그리고 그 해법으로 AI를 지목했다. 이 서비스는 그 진단에 대한 응답이다.

### 1.2 현재의 문제

럭셔리 브랜드의 디지털 개인화는 구매 이력이나 관심 상품을 바탕으로 유사 상품을 추천하는 데 머무르기 쉽다. 이 방식은 전환에는 도움이 될 수 있지만 다음 한계가 있다.

- 고객이 이미 알고 있는 취향을 반복해서 보여준다.
- 제품 단위의 유사도는 설명하지만 브랜드와의 장기적 관계는 만들기 어렵다.
- 구매 이후 고객이 브랜드를 다시 방문할 이유가 약하다.
- AI가 필요한 이유가 "추천 문구 생성" 수준에 머무른다.

### 1.3 문제의 규모 — 실측 근거

| 근거 | 수치 | 의미 |
| --- | --- | --- |
| **럭셔리 리테일 반복 구매율** | **9.9%** | 10명 중 9명이 상당한 구매 후 다시 오지 않는다 |
| **구매 후 불만의 핵심** | 클라이언트가 **"비인격적이고 부조화한(impersonal and incongruous) 후속 연락"**을 핵심 불만 지점으로 지목 | 구매 후 접점이 있어도 관계가 만들어지지 않는다 |
| **VIC 인정 결핍** | **VIC 중 20% 미만**만 일관되게 인정받는다고 느낀다 | **최상위 고객조차 커버되지 않는다** |
| **두 번째 구매의 벽** | 두 번째 구매가 가장 어렵고, **그 이후 세 번째 확률이 크게 오른다** | 두 번째 구매가 LTV의 병목이다 |
| **리텐션의 경제학** | **리텐션 5% 향상 → 이익 25~95% 증가** (Bain) | 개선의 경제적 크기 |
| **기존 고객 전환 확률** | **60~70%** | 신규 획득 대비 압도적 |

**→ "구매 이후 연결이 끊긴다"는 이 팀이 만든 가설이 아니라 업계가 실측으로 확인한 문제다.**

### 1.4 해결하려는 문제

MCM 구매 이후에도 고객이 자신의 취향을 렌즈로 브랜드의 새로운 도시, 컬렉션, 제품, 문화적 맥락을 발견하게 한다. 즉, 판매 직전의 추천보다 **Post-purchase Customer Engagement**와 장기적인 브랜드 관계 형성에 집중한다.

**의도적으로 스코프 밖에 둔 것:** 구매의향 이탈(장바구니·착장 후 미전환, [QA-4-4]). 이 솔루션의 메커니즘과 접점이 없으므로 억지로 붙이지 않는다.

### 1.5 타깃

- MCM 구매 경험이 있는 Existing Customer
- 구매 이력과 관심 행동 등 취향을 해석할 최소 Evidence가 있는 고객
- 구매 이후 브랜드와의 연결이 약해진 고객
- 데이터가 부족한 신규·단순 방문 고객은 대상에서 제외하며 기존 Catalogue·Campaign 경험을 유지한다.

### 1.6 서비스가 지켜야 할 원칙

1. **Grounded** — 모든 판단은 실제 고객 및 MCM 데이터에 근거한다.
2. **Discovery-first** — 유사도가 아니라 새로운 발견의 가치를 우선한다.
3. **Editorial, not Recommendation** — 상품 목록이 아니라 하나의 이야기로 전달한다.
4. **Selective Publishing** — 발행하지 않는 결정을 정상 결과로 인정한다.
5. **Cost-aware** — Rule로 탐색 범위를 줄이고 필요한 순간에만 AI를 호출한다.

---

## 2. 핵심 서비스 — MY MCM

고객마다 개인화된 Digital Luxury Magazine Archive인 `MY MCM`이 생성된다.

```text
MY MCM
├─ ISSUE 01 — SEOUL
├─ ISSUE 02 — BERLIN
├─ ISSUE 03 — TOKYO
└─ ...
```

Issue는 정기 발행물이 아니다. 새로운 Global 또는 Personal Signal이 들어오면 탐색을 시작하고, 의미 있는 Editorial Angle이 Gatekeeper를 통과할 때만 새 Issue를 발행한다.

### 2.1 일반 추천과 MY MCM의 차이

| 구분 | 일반 Recommendation | MY MCM |
|---|---|---|
| 핵심 질문 | 무엇을 살 가능성이 높은가? | 지금 어떤 MCM 이야기가 이 고객에게 의미 있는가? |
| 선택 기준 | 높은 유사도·전환 가능성 | Personal Connection + New Discovery |
| 결과 | 여러 상품 추천 | 하나의 Editorial Issue 또는 NONE |
| 유사 후보 | 우선 추천 | 이미 아는 취향의 반복이면 REJECT |
| 실패 처리 | 대체 상품 노출 | 발행하지 않음 |
| 고객 경험 | 상품 탐색 | 브랜드 세계의 발견 |

### 2.2 기존 서비스와의 정면 비교

이 영역에는 이미 성숙한 서비스들이 있다. **알고도 다르게 가는 이유**를 명시한다.

| 서비스 | 하는 일 | 성과 | 우리와 갈리는 지점 |
| --- | --- | --- | --- |
| **Stylitics** | Complete the Look — 조합 제안, 쇼퍼블, 상시 노출 | **AOV +39%**, 주요 아웃피팅 프로그램의 90%+ 구동 | 🟢 **거절하지 않는다.** PDP에는 항상 무언가 뜬다. 우리는 **가장 비슷한 후보를 REJECT**한다 |
| **Zalando** | AI 에디토리얼 비주얼 **생산** | 2025 Q4 에디토리얼의 **70%가 AI 생성**, 제작 6~8주 → 3~4일, **비용 −90%** | 🟢 **생산이지 판단이 아니다.** 매거진 제작 원가 문제는 이미 풀렸다. 우리는 **무엇을 실을지·낼지**로 경쟁한다 |
| **Digital Wardrobe** (Whering·Acloset·Indyx) | 고객이 자기 옷장을 관리, AI 스타일링 | 무료~저가 | 🟢 **Reactive** — 고객이 열어야 작동한다. 그리고 **브랜드의 시즌 의도를 모른다** |
| **Ask Ralph** (Ralph Lauren·Microsoft) | 대화형 스타일리스트, 쇼퍼블 아웃핏 | 2025.9 출시 | 🟢 **물으면 답한다.** 우리는 **묻지 않아도 발행되고, 할 말 없으면 침묵한다** |
| **AI Clienteling Platform** | 오늘 연락할 고객·추천할 제품·보낼 메시지를 표면화 | **시장 $3.2B(2025) → $10.8B(2034)** | 🟢 **직원용 도구다.** 우리는 고객이 직접 읽는다 |
| **Burberry Customer Insight Hub** | RFID 태그가 관련 콘텐츠를 트리거 | 2023 도입 | 🟡 가장 가깝다. 차이는 **거절할 수 있다는 것** |
| **표준 CRM** | 신상품 출시 → 배정 → 발송. Send-Time Optimization·Suppression은 표준 기능 | — | 🟢 **출발점이 신상품이 아니라 고객의 소유물**이고, **발행하지 않을 수 있다** |
| **Spotify Wrapped** | 연 1회 회고형 개인화 | TikTok 해시태그 737억 뷰(2023) | 🟢 **이벤트마다 진행형**이고, 고객 데이터만이 아니라 **전 세계 도시 데이터가 함께 섞인다** |

### 2.3 왜 MCM이어야 하는가

**"다른 도시에서 이게 뜬다"는 정보의 가치가 브랜드마다 다르다.**

| | 일반 럭셔리 브랜드 | **MCM** |
| --- | --- | --- |
| "다른 도시" | 🔴 **안 가는 곳.** 흥미로울 수는 있으나 행동으로 이어지지 않는다 | 🟢 **실제로 갈 수 있는 곳** |
| 근거 | — | **글로벌 고객 기여도가 매출의 90% 이상**, 주 타깃이 **"글로벌 디지털 노마드"** [QA-4-1] |

**도시 축은 MCM의 고객 구성 위에서만 의미를 갖는다.**

---

## 3. 전체 서비스 Flow

```text
[사전 준비]
MCM Product / Campaign Image
        ↓
Multimodal LLM 기반 Product Metadata 생성
        ↓
Rule Validation 후 Global MCM Intelligence 저장

[고객 단위 실행]
Purchase / Wishlist 변화 또는 Global / City Signal
        ↓
① SEE — Visual Taste Discovery
        ↓
Rule-based Candidate Retrieval
        ↓
② CONNECT — Cross-Context Meaning Discovery
        ↓
Editorial Angle A / B / C 생성
        ↓
③ EDIT — Independent Gatekeeper
        ↓
       A / B / C / NONE
        ↓
PASS                      NONE
 ↓                          ↓
④ CREATE                 발행하지 않음
Issue JSON 생성
 ↓
Rule Validation
 ↓
⑤ PUBLISH
MY MCM Issue 발행
```

핵심 AI 경험은 **SEE → CONNECT → EDIT → CREATE → PUBLISH**로 설명한다. 실행 제어는 전체 구간 앞뒤의 Rule Layer가 담당한다.

---

## 4. 데이터 인텔리전스 구조

### 4.1 Personal MCM Intelligence

- Purchase: 고객이 실제로 선택한 제품과 이미지
- Wishlist / Interest: 최근 관심 및 취향 확장 신호
- Customer Taste Profile: 구조화된 Core 5 메타데이터
- AI-discovered Traits: 이미지와 행동을 함께 해석해 발견한 동적 취향 패턴
- Past Issues: 이전에 발행된 도시, 제품, Angle, Evidence

### 4.2 Global MCM Intelligence

- 제품 및 컬렉션 메타데이터
- Product / Campaign / Store Image Asset
- 도시별 Product Availability
- New Season / New Drop
- City Signal과 서술형 설명
- Archive / Heritage Context

### 4.3 Core 5의 위치

Core 5는 고객을 고정 유형에 가두는 AI 결과가 아니라, 제품과 고객의 연결 가능성을 빠르게 찾기 위한 **Rule용 공통 메타데이터**다.

1. **Color** — 색상과 톤
2. **Silhouette** — 제품 형태와 구조감
3. **Monogram** — 브랜딩·모노그램 밀도
4. **Material** — 소재, 결, 광택, 마감
5. **Design Language** — Heritage, Modern Minimal, Bold/Street 등 디자인 표현

Core 5는 후보 Retrieval과 명시적 검증에 사용한다. 반면, Core 5로 설명되지 않는 고객 고유의 미감은 AI-discovered Traits로 보완한다. 이 구조는 Rule의 재현성과 AI의 해석력을 동시에 확보한다.

#### Core 5 열거형 값

| 축 | 허용 값 |
| --- | --- |
| `color_tone` | `warm_neutral` · `cool_neutral` · `muted` · `saturated` · `mono` |
| `silhouette` | `structured` · `soft` · `compact` · `oversized` |
| `monogram_density` | `none` · `low` · `medium` · `high` |
| `material` | `smooth_leather` · `grained` · `suede` · `nylon` · `mixed` |
| `design_language` | `heritage_archive` · `modern_minimal` · `bold_street` |

🔒 **자유 텍스트를 허용하지 않는다.** `"warm neutral"`과 `"warm-toned neutral"`이 섞이면 집계가 깨진다.

#### `core5_summary` 계산 — Rule

```text
items = purchase_events(weight = 2) + interest_events(weight = 1)
        ↓ 최신성 감쇠 적용 (오래된 이벤트일수록 가중치 하향)
축별 가중 집계 → 최빈값 채택
        ↓
총 가중치 합 < 최소 기준 → profile_status = 'insufficient'
```

🔒 **이 계산은 Rule이다. AI가 아니다.** 피칭에서도 그렇게 말한다. (설계 규칙 R-10)

### 4.4 Brand Language — Editorial 표현 렌즈

다음 4개는 **취향 축이 아니다.** Editorial을 작성할 때 사용하는 브랜드 톤이다.

| 렌즈 | 성격 |
| --- | --- |
| **Heritage** | 1976년부터의 아카이브·유산 |
| **Mobility** | **이동하는 삶** — 매출의 90%+가 글로벌 고객이라는 MCM의 구조와 직결된다 |
| **Personalization** | 개인의 표식 |
| **Craftsmanship** | 소재와 제작의 결과 |

> **Design Language = 제품을 분류하는 취향 축**
> **Brand Language = Editorial을 표현하는 방식**

🔒 **Craftsmanship 렌즈를 쓸 때 소재·제작 공정에 대한 설명을 생성하지 않는다.** 공개된 제품 정보 범위 안에서만 서술한다. (설계 규칙 R-8)

---

## 5. Trigger와 발행 빈도

### 5.1 Trigger

**Global Signal**

- New Season Drop
- City별 상품·컬렉션 변화
- 새로운 Campaign / Store / Archive Context
- 상품 가용성 또는 주요 데이터 갱신

**Personal Signal**

- 신규 구매
- Wishlist 추가·삭제
- 관심 제품 변화

```text
Global Signal OR Personal Signal
              ↓
Editorial 탐색 가능 여부 확인
```

Personal Signal이 있을 때만 Customer Taste Profile과 AI-discovered Traits를 재계산한다. Global Signal만 발생한 경우 기존 프로필을 재사용한다.

### 5.2 월 1회 발행 상한

한 고객에게 Personal Editorial은 **최대 월 1회**만 발행한다. Trigger와 후보가 여러 번 발생해도 월간 발행 한도를 넘으면 다음 실행 후보로 보류하거나 폐기한다.

목적은 두 가지다.

1. **비용 절감** — 불필요한 Multimodal/LLM 호출과 콘텐츠 생성 호출을 줄여 고객당 AI 비용을 예측 가능하게 만든다.
2. **UX 보호** — 럭셔리 Editorial의 희소성을 유지하고, 잦은 발행으로 인한 알림 피로와 콘텐츠 가치 하락을 방지한다.

상한은 "매월 반드시 한 번 발행"한다는 뜻이 아니다. **월 0~1회**가 정상 범위이며, 가치가 없으면 몇 달간 `NONE`일 수 있다.

> 🔒 **강제 발행 하한선과 Heritage fallback은 존재하지 않는다.**
> 백업 콘텐츠가 있으면 "발행하지 않음"이 허구가 되고, 이 서비스의 유일한 구조적 차별점이 사라진다. (설계 규칙 R-3)

### 5.3 ROI 관점의 프로필 갱신

- 구매와 Wishlist 변화는 빈도가 낮아 이벤트 기반 재계산 비용이 제한적이다.
- Global Signal마다 고객 이미지를 다시 분석하지 않고 저장된 Taste Profile을 재사용한다.
- Product Image 분석 결과는 사전 계산 및 캐시한다.
- Rule Retrieval로 후보를 먼저 줄인 뒤 소수 후보만 LLM에 전달한다.
- 월 1회 발행 상한으로 생성·발행 호출량을 통제한다.

---

## 6. AI Logic ① SEE — Visual Taste Discovery

### 6.1 목적

고객이 실제로 선택하거나 관심을 보인 MCM 제품의 **이미지와 행동 데이터**를 Multimodal LLM이 함께 분석해 반복되는 시각적·미적 원칙을 발견한다.

별도의 독립 Vision 모델과 텍스트 LLM을 연결하는 구조가 아니라, MVP에서는 **Vision 기능이 포함된 하나의 Multimodal LLM**을 사용한다. 모델은 제품 이미지를 보고, 구매·Wishlist 구분과 제품 메타데이터를 함께 읽은 뒤 고객 단위 패턴을 추론한다.

```text
Product Images
      +
Purchase / Wishlist / Product Metadata
      ↓
Multimodal LLM
      ↓
Visual Understanding + Cross-item Reasoning
      ↓
AI-discovered Traits + Evidence + Counter Evidence
```

⚠️ **SEE 단계의 AI 산출물은 `AI-discovered Traits`다.** `core5_summary`는 §4.3의 Rule로 별도 계산되며, AI 결과가 아니다.

### 6.2 Purchase와 Wishlist의 역할

- **Purchase = Taste Foundation**
  고객이 실제로 반복해서 선택해온 미감이며 가장 강한 Evidence다.
- **Wishlist / Interest = Taste Expansion**
  최근 취향이 어느 방향으로 확장되고 있는지 보여주는 보조 Evidence다.

> **Purchase = What you consistently choose**
> **Wishlist = Where your taste may be moving**

Wishlist만으로 강한 Trait를 확정하지 않는다. 구매 Evidence를 우선하고, Wishlist는 최근 변화나 확장 가능성을 설명할 때 사용한다.

🔒 **Wishlist에 담긴 제품 자체를 Editorial 지면에 직접 노출하지 않는다.** 노출하는 순간 Abandoned Cart 리타게팅과 구분되지 않는다. Wishlist는 **취향의 방향을 읽는 재료**이지 판매 대상이 아니다. (설계 규칙 R-6)

### 6.3 AI-discovered Traits

Core 5만으로 설명하기 어려운 반복적 미감이나 관계를 동적으로 발견한다.

예:

- Muted Tonal Expression
- Soft Structural Forms
- Material-led Expression
- Restrained Branding
- Architectural Contrast

#### 생성 조건

- 최소 2개 이상의 실제 Evidence Product가 있다.
- 단일 제품의 특징이 아니라 반복되는 패턴이다.
- Core 5 단순 조합만으로 충분히 설명되지 않는다.
- 반대되는 Counter Evidence를 검토해도 유지된다.
- 근거 Product ID가 실제 입력 데이터에 존재한다.

#### 저장 예시

```json
{
  "trait_id": "trait_01",
  "label": "Muted Tonal Expression",
  "reason": "서로 다른 색상의 제품이지만 낮은 대비와 절제된 톤이 반복된다.",
  "evidence_product_ids": ["P_101", "P_204", "W_031"],
  "counter_evidence_product_ids": ["P_155"],
  "confidence": "high",
  "detected_at": "2026-08-12T09:00:00Z",
  "model_version": "multimodal-llm-v1"
}
```

`confidence`는 MVP에서 `medium`과 `high`만 사용한다. 정확히 2회 반복이면 `medium`, 3회 이상 반복되고 Counter Evidence를 통과하면 `high`로 기록한다.

Traits는 무한히 누적하지 않는다. Personal Signal 발생 시 전체 Evidence를 기준으로 다시 계산하고 최신 Snapshot으로 덮어쓴다. 과거 Snapshot은 감사와 데모를 위해 별도 History로 보관할 수 있다.

🔒 **Trait는 제품과 선택 행동에 대한 서술이지 고객에 대한 규정이 아니다.** `"이 고객은 미니멀리스트다"`처럼 사람을 유형화하는 label을 생성하지 않는다. (설계 규칙 R-1)

#### AI-discovered Traits 생성 방식

AI-discovered Traits는 Multimodal LLM(Vision 기능 포함)이 고객이 실제로 구매하거나 관심을 보인 제품 이미지를 이해하고, 구매·관심 데이터를 함께 분석하여 생성한다. Core 5와 같은 구조화된 취향 정보만으로 설명하기 어려운 반복적인 선택 패턴을 AI가 추론하며, 이를 통해 고객의 취향이 어떤 방향으로 형성되고 확장되고 있는지를 보조적으로 해석한다.

즉, **Core 5는 Rule 기반 후보 탐색을 위한 구조화된 기준**이고, **AI-discovered Traits는 고객의 숨은 취향과 행동 패턴을 발견하기 위한 AI 기반 해석 정보**다.

### 6.4 Evidence Grounding

```text
Taste Pattern: Muted Tonal Expression

Evidence
- Purchase P_101
- Purchase P_204
- Wishlist W_031

Reason
서로 다른 제품군에서도 낮은 색 대비와 절제된 톤이 반복된다.

Counter Evidence
- Purchase P_155: 강한 대비가 있으나 단발성 선택으로 확인됨
```

AI는 패턴을 발견하고, Rule은 다음을 검증한다.

- Evidence가 최소 2개인지
- Product ID가 실제 고객 입력에 존재하는지
- Purchase와 Wishlist 출처가 정확한지
- 허용되지 않은 속성이나 개인정보를 추론하지 않았는지
- 출력 JSON Schema가 유효한지

---

## 7. Rule-based Candidate Retrieval

AI가 전체 글로벌 상품을 직접 읽지 않는다. Trigger가 발생하면 Rule이 Global MCM Intelligence에서 후보를 좁힌다.

### 7.1 입력

- Customer Core 5 Snapshot
- AI-discovered Traits의 검색용 Keyword
- Global / City Signal
- Product Core 5 Metadata
- 과거 Issue와 Candidate History
- Asset Availability

### 7.2 필터 규칙

1. Global / City Signal과 직접 관련된 후보만 포함한다.
2. Core 5 중 **2개 이상** 연결되는 후보를 기본 통과시킨다.
3. AI-discovered Trait와 명시적 관련 Metadata가 있으면 보조 후보로 포함할 수 있다.
4. 과거 Issue와 동일한 `city + product + editorial_angle` 조합을 제거한다.
5. 필수 이미지 Asset, 제품 설명, Source가 없는 후보를 제거한다.
6. 판매 불가·비공개·지역 제한 후보를 제거한다.
7. LLM Context 한도에 맞춰 상위 후보만 CONNECT 단계로 전달한다.

### 7.3 왜 3축이 아니라 2축인가

```text
고객:   muted / structured / low_mono / smooth_leather / modern_minimal

후보 A: muted / structured / low_mono / grained / modern_minimal   → 4축 겹침
        🔴 너무 비슷하다 = 발견이 아니다

후보 B: cool_neutral / structured / low_mono / suede / heritage    → 2축 겹침
        🟢 색·소재·무드는 다른데 구조는 이어진다 = 발견
```

**3축 이상을 요구하면 후보 B가 AI에게 도달하지 못한다.** 이 서비스가 찾는 것은 다음 지점이다.

> **Connected enough to feel personal, different enough to feel like discovery.**

2축 기준은 AI가 Cross-Context Connection을 탐색할 여지를 남기기 위한 최소 조건이다. **Rule은 명백히 무관한 것만 치우고, 최종 발행 적합성은 Gatekeeper가 판단한다.**

---

## 8. AI Logic ② CONNECT — Cross-Context Connection

### 8.1 목적

Rule을 통과한 각 후보에 대해 "개인적으로 연결되지만, 단순 반복이 아닌 이유"를 실제 데이터에서 찾는다.

### 8.2 추론 순서

Cross-Context Connection은 반드시 다음 네 단계로 수행한다.

```text
Customer Context
        ↓
MCM Context
        ↓
Bridge
        ↓
Meaningful Extension
```

#### Step 1. Customer Context — 고객에게 이미 존재하는 취향의 근거

AI는 먼저 고객 측 Evidence만 읽고 어떤 미적 원칙이 안정적으로 존재하는지 정리한다.

- 반복 구매에서 확인된 Core 5
- AI-discovered Traits
- Purchase와 Wishlist의 차이
- Evidence Product 이미지
- Counter Evidence
- Past Issue에서 이미 사용한 취향과 이야기

출력 질문:

> 이 고객의 실제 선택을 가장 구체적으로 설명하는 취향 원칙은 무엇이며, 어떤 Evidence가 이를 지지하는가?

#### Step 2. MCM Context — 지금 MCM에서 새롭게 발생한 맥락

후보 제품만 보는 것이 아니라 해당 제품을 둘러싼 브랜드 맥락을 읽는다.

- Product 이미지와 Core 5
- Collection / Season 정보
- City Signal 및 `description`
- Campaign / Store / Archive Context
- 제품이 기존 표현과 달라진 지점
- 사용할 수 있는 Source와 Asset

출력 질문:

> 이 후보가 지금의 MCM에서 보여주는 구체적인 변화 또는 새로운 표현은 무엇인가?

#### Step 3. Bridge — 두 Context가 연결되는 이유

Customer Context와 MCM Context 사이의 공통 원칙을 한 문장으로 설명한다. Bridge는 "같은 색이라서" 같은 표면적 일치가 아니라 형태, 소재, 절제 방식, 문화적 표현 등 해석 가능한 관계여야 한다.

예:

> 고객이 반복적으로 선택한 '절제된 구조감'은 Tokyo Collection의 깊은 Navy와 간결한 Hardware에서 유지되지만, 기존의 Brown 중심 선택과는 다른 도시적 표현으로 전환된다.

#### Step 4. Meaningful Extension — 새로운 발견이 되는 이유

마지막으로 이 연결이 단순 반복인지 취향의 의미 있는 확장인지 판정한다.

확인 질문:

1. 고객이 이미 소유하거나 과거 Issue에서 본 것과 무엇이 다른가?
2. 새로운 색, 도시, 소재, 문화, 디자인 언어 중 어떤 축이 확장되는가?
3. 차이가 너무 커서 개인적 연결이 사라지지는 않는가?
4. 한 문단 이상의 Editorial로 발전시킬 구체적 내용이 있는가?

```text
Connected enough to feel personal,
different enough to feel like discovery.
```

### 8.3 AI 추론 방식

Cross-Context Connection은 고객의 실제 선택에서 형성된 취향(**Customer Context**)과 MCM의 새로운 변화(**MCM Context**)를 함께 해석하여, 둘 사이에 왜 새로운 발견이 되는지를 AI가 추론하는 단계다.

AI는 단순히 고객과 가장 비슷한 제품을 찾는 것이 아니라, **고객의 기존 취향이 새로운 컬렉션이나 도시의 맥락에서 어떻게 확장될 수 있는지**를 분석하고, 이를 **Bridge** 형태의 설명으로 생성한다. 이후 이 결과를 바탕으로 Editorial로 발전시킬 가치가 있는지 판단한다.

### 8.4 예시

**Customer Context**
Brown, Structured Silhouette, Restrained Branding을 반복 구매했으며, AI-discovered Trait로 `Quiet Architectural Form`이 확인됨.

**MCM Context**
Tokyo New Season에서 Deep Navy, 정제된 구조, 최소화된 Hardware를 사용한 신제품이 공개됨.

**Bridge**
고객이 선호하는 조용한 구조감은 유지되지만 Tokyo의 Navy와 금속 디테일을 통해 새로운 도시적 언어로 해석됨.

**Meaningful Extension**
형태와 절제라는 개인적 연결은 유지하면서 Brown 중심의 익숙한 표현을 색과 도시 맥락에서 확장하므로 PASS 가능한 발견이다.

반대로 Brown / Structured / Restrained가 그대로 반복된 후보는 연결 강도는 높아도 `Meaningful Extension = false`다.

### 8.5 구조화 출력

```json
{
  "candidate_id": "C_023",
  "customer_context": {
    "summary": "Quiet Architectural Form을 반복적으로 선택한다.",
    "sources": ["purchase:P_101", "purchase:P_204", "trait:trait_01"]
  },
  "mcm_context": {
    "summary": "Tokyo Drop이 절제된 구조를 Deep Navy로 재해석한다.",
    "sources": ["product:C_023", "city_signal:CS_TYO_08"]
  },
  "bridge": "절제된 구조감은 유지되지만 색과 도시 표현이 확장된다.",
  "meaningful_extension": {
    "is_extension": true,
    "new_dimension": "color_and_city_context",
    "reason": "기존 Brown 중심 선택을 Tokyo Deep Navy로 확장한다."
  }
}
```

Source가 실제 DB Record로 해석되지 않으면 해당 후보는 다음 단계로 넘기지 않는다.

---

## 9. AI Logic ③ EDIT — Editor + Gatekeeper

### 9.1 생성과 판정의 분리

하나의 AI 호출이 자신이 만든 이야기를 스스로 승인하면 Self-approval Bias가 생길 수 있다. 이를 줄이기 위해 Editor와 Gatekeeper를 별도 호출과 별도 Prompt로 분리한다.

### 9.2 AI Editor

Editor는 CONNECT 결과를 바탕으로 서로 다른 Editorial Angle을 최대 3개 생성한다.

각 Angle은 다음을 포함한다.

- 한 문장 Angle
- Customer Evidence
- MCM Evidence
- Bridge
- Meaningful Extension
- 예상 Headline
- 반복되지 않는 이유

세 후보는 단순 카피 변형이 아니라 서로 다른 이야기의 관점이어야 한다. 충분한 Angle이 하나뿐이면 억지로 세 개를 채우지 않는다.

### 9.3 AI Gatekeeper

Gatekeeper에는 후보의 생성 순서나 이름을 제거하고 `A / B / C`로 익명화하여 전달한다. 가능한 경우 순서를 섞어 위치 편향도 줄인다.

판단 기준:

1. **Evidence Grounding** — 모든 핵심 주장이 실제 Source에 근거하는가?
2. **Specificity** — 어느 고객에게나 적용될 일반 문장이 아닌가?
3. **Personal Connection** — 고객 취향과 충분히 연결되는가?
4. **Novelty** — 기존 선택과 과거 Issue를 반복하지 않는가?
5. **Discovery Value** — 고객이 몰랐던 MCM의 맥락을 실제로 발견하게 하는가?
6. **Editorial Value** — 하나의 Luxury Editorial로 발전시킬 만큼 구체적인가?

점수의 단순 합산으로 결정하지 않는다. 후보별 근거를 서술형으로 종합 판단하되, 각 기준의 PASS/FAIL은 구조화해 감사 가능하게 남긴다. (설계 규칙 R-4)

### 9.4 PASS/NONE 철학

Gatekeeper의 정상 출력은 다음뿐이다.

```text
A / B / C / NONE
```

- `A / B / C`: 한 후보가 모든 필수 기준을 통과했을 때만 선택
- `NONE`: 후보가 없거나, 모든 후보가 단순 반복·근거 부족·일반적 이야기일 때 선택

`NONE`은 시스템 실패가 아니다. **발행할 가치가 없음을 정확히 판단한 성공 결과**다. 후보가 하나뿐이어도 자동 PASS하지 않으며, 가장 유사한 후보도 새 발견이 아니면 REJECT한다. 빈 화면을 피하려고 약한 콘텐츠를 발행하지 않는다.

Gatekeeper가 `NONE`을 반환하면 Issue Record를 생성하지 않고 Decision Log만 저장한다.

---

## 10. AI Logic ④ CREATE — Personal Editorial 생성

Gatekeeper가 선택한 Angle을 바탕으로 Digital Magazine에 들어갈 구조화 콘텐츠를 생성한다.

### 10.1 입력

```text
Selected Editorial Angle
+ Customer Taste / Evidence
+ Global / City Context
+ Selected Product / Collection
+ Available MCM Image Assets
+ Past Issue Context
```

### 10.2 Issue 구성

```text
HERO → STORY → CONNECTION → DISCOVERY → EXPERIENCE → END
```

`CONNECTION`은 추천 사유를 나열하는 "WHY YOU"가 아니다. 고객의 Evidence와 MCM Evidence를 이미지 및 Editorial 문장으로 병치해 연결을 자연스럽게 보여준다. 내부 추론과 점수는 고객에게 노출하지 않는다.

### 10.3 Copy 원칙

| 원칙 | 내용 |
| --- | --- |
| **고객의 소유물에서 시작한다** | *"당신의 [제품명]에서 시작된 이번 이야기…"* — 고객이 "내가 가진 것에서 이 이야기가 시작됐구나"라고 느끼게 한다 |
| 🔒 **고객을 규정하지 않는다** | ❌ *"당신은 미니멀한 사람입니다"*<br>⭕ *"당신이 선택해온 절제된 실루엣이 이번에는 도쿄에서 다른 모습으로 이어집니다"* |
| **제품 스펙을 나열하지 않는다** | 취향 속성은 문장 속에 녹인다 |
| **여정 자체에 대한 조언을 하지 않는다** | 날씨·환율·맛집·일정 — 한 줄이라도 넣으면 여행 앱이 된다 |
| **Brand Language를 렌즈로 쓴다** | Heritage / Mobility / Personalization / Craftsmanship (§4.4) |
| **언어** | 영어, 럭셔리 매거진 에디토리얼 톤 |

### 10.4 Issue JSON

```json
{
  "issue_number": "03",
  "city": "TOKYO",
  "editorial_angle_id": "EA_03_B",
  "hero": {
    "headline": "A Different Kind of Quiet",
    "subheadline": "Tokyo, seen through your taste",
    "image_asset_id": "tokyo_campaign_04"
  },
  "story": {
    "title": "Quiet, Reconsidered",
    "body": "..."
  },
  "connection": {
    "title": "The Shape of Quiet",
    "body": "...",
    "customer_evidence_asset_ids": ["purchase_101", "purchase_204"],
    "mcm_evidence_asset_ids": ["product_023", "tokyo_campaign_04"]
  },
  "discovery": {
    "product_id": "MCM_023",
    "image_asset_id": "product_023",
    "body": "..."
  },
  "experience": {
    "city": "Tokyo",
    "store_id": "STORE_TYO_01",
    "body": "..."
  },
  "closing": {
    "text": "Your next MCM story."
  },
  "source_ids": ["P_101", "P_204", "C_023", "CS_TYO_08"]
}
```

### 10.5 이미지 처리 원칙

MVP에서는 생성형 이미지를 만들지 않는다. 기존 Product / Campaign / Store Asset을 사용하고, AI는 허용된 Asset 목록에서 섹션별 이미지를 선택한다.

> **AI = 편집장**
> **MCM Asset = 잡지 소재**
> **Frontend Template = 지면**

AI가 HTML/CSS를 생성하지 않는다. 무엇을 보여줄지는 AI가 결정하고, 어떻게 보여줄지는 고정된 Luxury Magazine Template이 담당한다.

---

## 11. AI Logic ⑤ PUBLISH — 검증 및 발행

```text
Issue JSON
    ↓
Schema / Source / Asset / Policy Validation
    ↓
issues DB 저장
    ↓
Fixed Magazine Template에 주입
    ↓
MY MCM Issue 공개
```

### 발행 전 Rule Validation

- JSON Schema 유효성
- 선택된 Product와 Asset 존재 여부
- 모든 Source ID 존재 여부
- 허용되지 않은 주장·가격·재고 정보 포함 여부
- 과거 Issue 중복 여부 재검사
- 월 1회 상한 재검사
- Gatekeeper Decision이 PASS인지

검증 실패 시 자동 수정은 1회만 시도한다. 다시 실패하면 발행하지 않고 상태를 `validation_failed`로 기록한다.

---

## 12. Rule과 AI의 역할 구분

### 12.1 Rule의 역할

Rule은 **어떤 후보를 탐색할 것인지 통제하고 검증한다.**

- Trigger 감지
- 고객 최소 데이터 조건 확인
- Purchase / Wishlist 구분
- **`core5_summary` 가중 최빈값 계산**
- Global 후보 Retrieval
- 동일 Issue 중복 방지
- Evidence Product ID 검증
- Pattern당 최소 Evidence 수
- 월 1회 발행 상한
- DB / API Validation

### 12.2 AI의 역할

AI는 **Rule이 선별한 후보 안에서 고객과 MCM 사이의 새로운 의미를 해석하고 Editorial을 생성한다.**

- 이미지 기반 제품 속성 인식 (Core 5 태깅)
- AI-discovered Traits 추론
- Cross-Context Connection 생성
- Meaningful Extension 판단
- Editorial Angle 생성
- **Editorial Worthiness 판단 (Gatekeeper)**
- Editorial Narrative와 Asset 배치 결정

### 12.3 단계별 분담

| 단계 | Rule이 담당 | AI가 담당 |
|---|---|---|
| 준비 | Schema, Asset, Product ID 검증 | 이미지 기반 Product Metadata 초안 생성 |
| Trigger | Signal 감지, 월 상한, 실행 조건 | 없음 |
| SEE | **`core5_summary` 계산**, 최소 Evidence·ID·Source 검증 | 이미지와 행동을 함께 해석해 Trait 발견 |
| Retrieval | Core 5, 지역, 중복, 가용성 필터 | 없음 |
| CONNECT | Source 존재 여부 검증 | Customer Context와 MCM Context의 의미 연결 |
| EDIT | 후보 익명화·순서 섞기·출력 검증 | Angle 생성, 발행 가치 판단 |
| CREATE | JSON, Asset, 정책 검증 | Editorial Narrative와 Asset 배치 결정 |
| PUBLISH | DB 저장, 월 상한 재확인, Template 렌더링 | 없음 |

> **Rule = Control / Validation / Retrieval**
> **AI = Interpretation / Meaning Discovery / Editorial Judgment**

Rule은 "무엇을 볼 수 있는가"를 통제하고 AI는 "그 안에 어떤 의미가 있는가"를 판단한다. 이후 Rule이 AI 결과를 다시 검증한다.

```text
Rule → AI → Rule Validation
```

이 구조는 비용, 재현성, 근거성, 운영 안정성을 동시에 확보한다.

---

## 13. 설계 규칙 — 구현 중 어기면 안 되는 것

| # | 규칙 | 어기면 |
| --- | --- | --- |
| **R-1** | **고객을 규정하는 문장을 쓰지 않는다.** 주어는 항상 제품 또는 선택 행동 | 틀렸을 때 "브랜드가 나를 이렇게 본다고?"가 되어 관계가 훼손된다 |
| **R-2** | **아무것도 제안하지 않는 호가 실제로 존재한다** | 추천 엔진과 구조가 같아진다 |
| **R-3** | **최소 발행 주기를 만들지 않는다. 백업 콘텐츠도 만들지 않는다** | "발행하지 않음"이 허구가 된다 |
| **R-4** | **점수·가중치 합산으로 후보를 고르지 않는다.** 서술형 종합 판단 | Score threshold와 구별되지 않는다 |
| **R-5** | **여정 자체에 대한 조언(날씨·환율·맛집·일정)을 한 줄도 하지 않는다** | 무료 여행 앱과 같은 범주가 된다 |
| **R-6** | **Wishlist 제품을 지면에 직접 노출하지 않는다** | Abandoned Cart 리타게팅과 구분되지 않는다 |
| **R-7** | **제품 이미지를 생성·변형하지 않는다.** 공식 Asset에서 선택·배치 | 제품 실루엣 왜곡 — MCM이 훼손 금지 가치로 지목한 항목 |
| **R-8** | **소재·제작·품질에 대한 설명을 생성하지 않는다** | 근거 없는 Craftsmanship 서술 |
| **R-9** | **구매 유도 CTA를 넣지 않는다** | Editorial이 아니라 카탈로그가 된다 |
| **R-10** | **`core5_summary`를 AI라고 주장하지 않는다** | "그거 최빈값 집계 아닌가요?"에 답할 수 없다 |

---

## 14. 데이터베이스 설계 및 흐름

### 14.1 핵심 테이블

#### `customers`

| 필드 | 타입 | 설명 |
|---|---|---|
| `customer_id` | UUID | 고객 식별자 |
| `profile_status` | ENUM | insufficient / ready |
| `last_profiled_at` | TIMESTAMP | 최근 프로필 계산 시각 |
| `last_issue_at` | TIMESTAMP | 최근 발행 시각 |
| `consent_status` | ENUM | 데이터 활용 동의 상태 |

#### `customer_product_events`

| 필드 | 타입 | 설명 |
|---|---|---|
| `event_id` | UUID | 이벤트 ID |
| `customer_id` | UUID | 고객 ID |
| `product_id` | UUID | 제품 ID |
| `event_type` | ENUM | purchase / wishlist_add / wishlist_remove / interest |
| `occurred_at` | TIMESTAMP | 발생 시각 |

#### `products`

| 필드 | 타입 | 설명 |
|---|---|---|
| `product_id` | UUID | 제품 ID |
| `name` | TEXT | 제품명 |
| `collection_id` | UUID | 컬렉션 ID |
| `city_id` | UUID | 관련 도시 |
| `core5` | JSONB | 구조화 Metadata |
| `description` | TEXT | 제품 설명 |
| `availability_status` | ENUM | 공개·가용 상태 |

#### `assets`

| 필드 | 타입 | 설명 |
|---|---|---|
| `asset_id` | UUID | Asset ID |
| `asset_type` | ENUM | product / campaign / store / archive |
| `uri` | TEXT | 이미지 위치 |
| `product_id` | UUID? | 관련 제품 |
| `usage_status` | ENUM | 사용 가능 여부 |

#### `city_signals`

| 필드 | 타입 | 설명 |
|---|---|---|
| `signal_id` | UUID | Signal ID |
| `city_id` | UUID | 도시 ID |
| `signal_type` | ENUM | new_drop / campaign / store / archive / availability |
| `description` | TEXT | AI가 해석할 서술형 맥락 |
| `source_ids` | JSONB | 근거 데이터 |
| `active_from` | TIMESTAMP | 유효 시작일 |

#### `taste_profiles`

| 필드 | 타입 | 설명 |
|---|---|---|
| `profile_id` | UUID | Snapshot ID |
| `customer_id` | UUID | 고객 ID |
| `core5_summary` | JSONB | **Rule 계산 결과** |
| `ai_traits` | JSONB | Trait, Reason, Evidence, Counter Evidence |
| `model_version` | TEXT | 생성 모델 버전 |
| `created_at` | TIMESTAMP | 생성 시각 |
| `is_current` | BOOLEAN | 현재 Snapshot 여부 |

#### `editorial_candidates`

| 필드 | 타입 | 설명 |
|---|---|---|
| `candidate_id` | UUID | 후보 ID |
| `customer_id` | UUID | 고객 ID |
| `signal_id` | UUID | Trigger Signal |
| `product_id` | UUID | 후보 제품 |
| `cross_context` | JSONB | Customer/MCM/Bridge/Extension |
| `editorial_angle` | JSONB | Editor 결과 |
| `status` | ENUM | retrieved / generated / rejected / selected |

#### `gatekeeper_decisions`

| 필드 | 타입 | 설명 |
|---|---|---|
| `decision_id` | UUID | 판정 ID |
| `customer_id` | UUID | 고객 ID |
| `anonymous_candidates` | JSONB | A/B/C 입력 Snapshot |
| `selected_label` | ENUM | A / B / C / NONE |
| `criteria_result` | JSONB | 기준별 판정과 이유 |
| `model_version` | TEXT | 판정 모델 버전 |
| `created_at` | TIMESTAMP | 판정 시각 |

#### `issues`

| 필드 | 타입 | 설명 |
|---|---|---|
| `issue_id` | UUID | Issue ID |
| `customer_id` | UUID | 고객 ID |
| `issue_number` | INTEGER | 고객별 순번 |
| `decision_id` | UUID | PASS 근거 |
| `issue_json` | JSONB | Magazine 콘텐츠 |
| `status` | ENUM | draft / validation_failed / published |
| `published_at` | TIMESTAMP | 발행 시각 |

### 14.2 전체 DB 흐름

```text
products + assets + city_signals
               │
               ├──────────────┐
               │              │
customer_product_events       │
               ↓              │
         taste_profiles       │
               │              │
               └──────┬───────┘
                      ↓
          editorial_candidates
                      ↓
          gatekeeper_decisions
                 ┌────┴────┐
                 │         │
               PASS       NONE
                 ↓         ↓
               issues   Decision Log만 저장
                 ↓
              PUBLISH
```

### 14.3 개인정보 및 운영 원칙

- AI 입력에는 고객의 직접 식별정보를 포함하지 않는다.
- 이미지와 행동 데이터 활용 동의 상태를 확인한다.
- Prompt와 Output에는 고객 ID 대신 일회성 내부 식별자를 사용한다.
- Model Version, Source, Decision을 저장해 판단을 재현할 수 있게 한다.
- 고객 데이터 삭제 요청 시 Event, Profile, Candidate, Issue 연결 데이터를 정책에 따라 삭제한다.

> **MCM 공식 입장:** *"고객 데이터는 개인 정보 이슈로 제공이 어렵습니다."* [QA-5-1] · *"'개인 식별 데이터가 오고 가지 않는다'는 전제 하에 시도해 볼 수 있는 것이 있을 텐데요."* [QA-5-3]
> MVP는 더미 데이터로 구현하고, 실서비스에서 어떤 데이터가 API로 연결되는지를 설계에 명시한다.

---

## 15. API 및 Backend Flow

### 핵심 Endpoint 예시

| Method | Endpoint | 역할 |
|---|---|---|
| `POST` | `/signals` | Global / Personal Signal 수신 |
| `POST` | `/customers/{id}/profile/recompute` | Personal Signal 기반 Taste 재계산 |
| `POST` | `/customers/{id}/editorial/run` | Retrieval부터 Gatekeeper까지 실행 |
| `GET` | `/customers/{id}/editorial/status/{runId}` | 비동기 실행 상태 확인 |
| `GET` | `/customers/{id}/issues` | Issue Archive 조회 |
| `GET` | `/customers/{id}/issues/{issueId}` | Issue Detail 조회 |
| `GET` | `/runs/{runId}/decision` | 데모용 Decision Log 조회 |

### 실행 상태

```text
triggered
→ profile_ready
→ candidates_retrieved
→ connections_generated
→ gatekeeper_pass | gatekeeper_none
→ issue_generated
→ validated
→ published
```

오류 상태는 `profile_failed`, `ai_output_invalid`, `source_invalid`, `validation_failed`로 구분한다.

### 오류 처리

- AI Timeout: 지수 Backoff로 최대 1회 재시도 후 종료
- JSON Parsing 실패: Schema 오류와 함께 1회 Repair 요청
- Source 불일치: 즉시 REJECT
- Asset 누락: 다른 허용 Asset으로 1회 대체, 없으면 발행 중단
- 중복 Issue 발견: 발행 중단 및 Decision Log 기록
- Partial Failure: 이전에 발행된 Issue에는 영향 없음

---

## 16. 사용자 경험 및 화면 구성

### 16.1 MY MCM Archive

```text
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

### 16.2 Issue Detail

```text
[ HERO ]
TOKYO / ISSUE 03 / Large Editorial Image

[ STORY ]
Editorial Headline + Story

[ CONNECTION ]
Customer Evidence Image ↔ New MCM Evidence Image

[ DISCOVERY ]
Related Collection / Product

[ EXPERIENCE ]
City / Store Context

[ END ]
Your next MCM story.
```

### UI 원칙

- 영어 Copy를 기본으로 한다.
- 큰 이미지, 충분한 여백, Typography 중심의 Luxury Magazine 경험을 제공한다.
- 제품 스펙과 가격 나열을 최소화한다.
- 직접적인 구매 CTA를 MVP에서 제외한다.
- AI의 내부 점수와 추론 로그는 고객에게 노출하지 않는다.
- 고객 Evidence와 새로운 MCM Evidence는 시각적으로 병치해 연결을 느끼게 한다.

---

## 17. MVP Scope

### 17.1 전제와 목표

- 팀: 2인
- 기간: 약 1주
- 목표: 실서비스 완성이 아니라 **핵심 AI 경험과 PASS/NONE Logic의 작동 증명**

### 17.2 MUST

1. 데모 고객 1~2명
   - Purchase 이미지 3~5개
   - Wishlist 이미지 2~3개
   - Past Issue 0~2개
2. Multimodal Taste Discovery
   - Core 5 요약 (Rule)
   - AI-discovered Trait
   - Evidence와 Counter Evidence
3. Global Signal Simulation
   - 예: `Tokyo — New Season Drop`
4. Rule-based Retrieval
   - 최소 2축 연결
   - 중복 및 Asset 검증
5. Cross-Context Connection
   - Customer Context → MCM Context → Bridge → Meaningful Extension
6. AI Editor
   - 서로 다른 Editorial Angle 최대 3개
7. AI Gatekeeper
   - 익명화된 `A / B / C / NONE`
8. **실제 REJECT 동작**
   - 가장 비슷하지만 새롭지 않은 후보의 Issue 미생성
9. Issue JSON 생성 및 검증
10. MY MCM UI
    - PASS Issue를 Magazine Template으로 표시
11. Decision Log
    - 데모에서 PASS/NONE 이유를 확인 가능

### 17.3 SHOULD

- Taste Pattern과 Evidence 이미지 병치
- Purchase / Wishlist 구분 UI
- Counter Evidence 표시
- Past Issue 비교
- Issue Archive 완성도 개선
- 월 1회 상한 시뮬레이션

### 17.4 CUT

- 자체 Vision / Recommendation Model 학습
- Fine-tuning
- 별도 Vision Embedding Pipeline
- Vector DB와 대규모 Clustering
- 실제 MCM POS / CRM 연동
- 수천 개 상품의 실시간 분석
- 생성형 이미지
- 강제 발행 하한선 및 Heritage fallback
- 실제 이메일·메신저 발송
- 결제 및 구매 CTA
- 매출 임팩트 예측

---

## 18. 데모 시나리오

데모의 핵심은 예쁜 Editorial 자체보다 **AI가 근거를 찾고, 선택하고, 거절하는 Logic**을 증명하는 것이다.

### Scene 0 — 문제와 차별점

화면에 두 문장을 제시한다.

```text
Recommendation: 가장 비슷한 것을 찾는다.
MY MCM: 나와 연결되지만 아직 알지 못했던 것을 찾는다.
```

### Scene 1 — SEE

고객의 Purchase 3~5개와 Wishlist 2~3개 이미지를 보여준다.

`Discover My Taste`를 실행하면 다음을 반환한다.

- Core 5 요약 (Rule)
- `Quiet Architectural Form` 등 AI-discovered Trait
- 근거 이미지 2개 이상
- Counter Evidence

전달 메시지:

> 고정 카테고리만으로 고객을 규정하지 않습니다. 제품 이미지와 실제 선택 데이터를 함께 분석해 고객 고유의 반복 미감을 발견합니다.

### Scene 2 — SIGNAL

```text
NEW SIGNAL
Tokyo — New Season Drop
```

Rule이 제품 후보를 줄이고 CONNECT 단계가 실행된다.

### Scene 3 — CONNECT

화면에서 네 단계를 순서대로 보여준다.

```text
Customer Context
Quiet Architectural Form
        ↓
MCM Context
Tokyo Deep Navy / Refined Hardware
        ↓
Bridge
기존의 절제된 구조감을 새로운 도시적 표현으로 연결
        ↓
Meaningful Extension
Brown 중심 취향을 Color + City Context로 확장
```

### Scene 4 — REJECT ⭐

Candidate A는 고객의 기존 Brown / Structured / Restrained 선택과 거의 동일하다.

```text
일반 추천 → High Similarity → Recommend
MY MCM   → No New Discovery → REJECT
```

Gatekeeper는 `NONE` 또는 A를 제외한 다른 후보를 선택한다. Candidate A만 있는 Run에서는 Issue가 생성되지 않는다.

전달 메시지:

> 가장 잘 맞는 상품조차 새로운 발견이 아니라면 발행하지 않습니다. NONE은 실패가 아니라 저희 Editorial 기준이 작동한 결과입니다.

### Scene 5 — PASS

Candidate B는 기존 구조감과 절제된 브랜딩을 유지하면서 Tokyo Deep Navy와 새로운 Hardware 표현을 제공한다.

```text
Personal Connection + New Discovery → PASS
```

Gatekeeper가 선택한 Angle로 Issue JSON이 생성된다.

### Scene 6 — PUBLISH

최종 화면에서 `MY MCM ISSUE 03 — TOKYO — A Different Kind of Quiet`을 Magazine 형태로 보여준다.

마무리 메시지:

> MY MCM은 상품을 더 많이 추천하는 AI가 아니라, 고객에게 말할 가치가 있는 순간을 선택하는 AI Personal Editor입니다.

---

## 19. 기술 아키텍처

```text
Customer Events / Global Signals
              ↓
        Trigger Service
              ↓
Profile Service ── Multimodal LLM
              ↓
Candidate Retrieval Service ── PostgreSQL
              ↓
Meaning & Editor Service ── LLM
              ↓
Gatekeeper Service ── Separate LLM Call
              ↓
Validation & Issue Service
              ↓
PostgreSQL / Object Storage
              ↓
React / Next.js Magazine Template
```

### MVP 권장 Stack

- Frontend: Next.js / React / TypeScript
- Backend: Next.js API Route 또는 FastAPI
- Database: PostgreSQL 또는 Supabase
- Asset Storage: Supabase Storage 또는 정적 Demo Asset
- AI: Vision 입력을 지원하는 Multimodal LLM + 텍스트 LLM 호출
- Validation: JSON Schema / Zod 또는 Pydantic
- Logging: Run ID 기반 구조화 로그

### 모델 호출 최적화

1. 제품 이미지 Metadata는 사전 계산한다.
2. Profile은 Personal Signal에만 갱신한다.
3. Rule Retrieval 후 소수 후보만 CONNECT에 전달한다.
4. CONNECT, Editor, Gatekeeper의 구조화 출력을 강제한다.
5. Issue Generation은 Gatekeeper PASS 이후에만 실행한다.
6. 월 1회 발행 상한을 AI 호출 전에 확인한다.

---

## 20. 개발 우선순위 및 일정

### Priority 0 — 데모 데이터와 성공 조건 고정

- 고객 1~2명의 Purchase / Wishlist Asset 준비
- Global Signal과 Candidate A/B 준비
- REJECT와 PASS의 기대 결과 명시
- JSON Schema 및 Source ID 체계 확정

**완료 기준:** 동일 입력으로 REJECT Run과 PASS Run을 반복 시연할 수 있다.

### Priority 1 — 핵심 AI Logic

1. Multimodal Taste Discovery
2. Evidence / Counter Evidence 검증
3. Rule-based Retrieval
4. Cross-Context Connection
5. Editor 3 Angle
6. Independent Gatekeeper A/B/C/NONE

**완료 기준:** UI 없이도 구조화 JSON과 Decision Log로 전체 판단 과정을 증명할 수 있다.

### Priority 2 — Issue 생성과 DB Flow

1. Issue JSON 생성
2. Schema / Source / Asset Validation
3. Issue 및 Decision 저장
4. PASS만 Issue를 만드는 상태 전이

**완료 기준:** NONE Run에서는 Issue가 0개, PASS Run에서는 검증된 Issue가 1개 생성된다.

### Priority 3 — 사용자 경험

1. MY MCM Archive
2. Issue Detail Template
3. Customer Evidence와 MCM Evidence 병치
4. Demo Control Panel

**완료 기준:** 심사위원이 3분 내에 SEE, CONNECT, REJECT, PASS, PUBLISH를 이해할 수 있다.

### 1주 예시 일정

| Day | 목표 | 산출물 |
|---|---|---|
| Day 1 | 데이터·Schema·Prompt 계약 확정 | Demo Dataset, JSON Schema |
| Day 2 | SEE 구현 | Taste Profile + Evidence |
| Day 3 | Retrieval + CONNECT | Cross-Context JSON |
| Day 4 | Editor + Gatekeeper | A/B/C/NONE Decision Log |
| Day 5 | CREATE + DB | Issue JSON, 상태 전이 |
| Day 6 | Magazine UI + 통합 | Archive, Issue Detail |
| Day 7 | 오류 처리·리허설 | REJECT/PASS 데모 완성 |

### 개발 중 절대 후순위로 둘 것

- 모델 Fine-tuning
- 대규모 데이터 최적화
- 실제 CRM 연동
- 복잡한 추천 점수
- 자동 알림 채널
- 생성형 이미지

---

## 21. Prompt 설계 방향

### 21.1 SEE Prompt 원칙

- 이미지를 실제로 관찰한 내용과 행동 데이터를 분리해 입력한다.
- Pattern마다 최소 Evidence와 Counter Evidence를 요구한다.
- Core 5를 답안 목록으로 강제하지 않는다.
- 개인의 민감 속성이나 정체성을 추론하지 못하게 한다. **(R-1)**
- JSON Schema 외 텍스트 출력을 금지한다.

### 21.2 CONNECT Prompt 원칙

- 추론 순서를 `Customer Context → MCM Context → Bridge → Meaningful Extension`으로 고정한다.
- 각 Context에 Source ID를 요구한다.
- "유사함"과 "새로운 발견"을 별도 필드로 판단한다.
- Past Issue와의 차이를 명시하게 한다.
- 근거가 부족하면 `insufficient_evidence`를 반환하게 한다.

### 21.3 Editor Prompt 원칙

- 최대 3개의 서로 다른 Angle만 생성한다.
- 카피 표현만 다른 중복 후보를 금지한다.
- **선택이나 PASS 여부를 Editor가 결정하지 못하게 한다.**
- Wishlist 제품명을 Angle에 직접 등장시키지 않는다. **(R-6)**

### 21.4 Gatekeeper Prompt 원칙

- 고객과 후보를 익명화하고 순서를 섞는다.
- **후보가 하나여도 NONE을 허용한다.**
- 모든 필수 기준을 통과한 후보만 선택한다.
- 점수 합산이 아니라 기준별 판정과 최종 이유를 반환한다. **(R-4)**
- 근거가 없거나 지나치게 일반적인 문장은 REJECT한다.

### 21.5 CREATE Prompt 원칙

- 고객의 소유 제품에서 이야기를 시작한다.
- 고객을 유형화하는 문장을 금지한다. **(R-1)**
- 소재·제작 공정에 대한 설명을 생성하지 않는다. **(R-8)**
- 여정 자체에 대한 조언을 금지한다. **(R-5)**
- 허용된 Asset ID 목록 밖의 이미지를 지정하지 못하게 한다.

---

## 22. 검증 전략과 성공 지표

### 22.1 AI Logic Test Set

| Test | 입력 | 기대 결과 |
|---|---|---|
| T1 반복 취향 | 유사한 구조가 3회 반복 | Trait + high confidence |
| T2 단발 특징 | 한 제품에만 존재 | Trait 미생성 |
| T3 잘못된 근거 | 존재하지 않는 Product ID | Rule REJECT |
| **T4 과도한 유사성** | 고객 소유품과 거의 동일 | **Gatekeeper NONE** |
| T5 의미 있는 확장 | 공통 원칙 + 새 도시/색 표현 | PASS 가능 |
| T6 근거 부족 | City description 없음 | Candidate REJECT |
| T7 과거 Issue 중복 | 동일 도시·제품·Angle | Retrieval 제거 |
| T8 월 상한 | 같은 달 이미 발행 | 실행 또는 발행 차단 |
| T9 Invalid JSON | Schema 위반 출력 | 1회 Repair 후 실패 처리 |
| **T10 고객 규정 문장** | Trait label에 인물 규정 표현 | **Rule REJECT (R-1)** |
| **T11 Wishlist 노출** | Angle에 Wishlist 제품명 등장 | **Rule REJECT (R-6)** |

### 22.2 MVP 성공 지표

- Evidence ID Validation 성공률
- Gatekeeper의 PASS/NONE 일관성
- **가장 유사한 후보 REJECT 시연 성공 여부**
- Issue JSON Schema 성공률
- 데모 Run 완주 시간
- 사용자 또는 심사위원의 차별점 이해도

### 22.3 Business Hypothesis

구체적인 추가 매출액을 확정적으로 주장하지 않는다. 실제 MCM 데이터가 없기 때문이다.

> **가설:** Personal Editorial을 받은 기존 MCM 고객은 일반 브랜드 콘텐츠만 받은 고객보다 브랜드 재방문과 장기 Engagement가 높아질 것이다.

### 22.4 실서비스 확장 KPI

| 우선순위 | KPI | 검증 대상 |
| --- | --- | --- |
| **1** | **Issue Open Rate** | "에디토리얼을 읽는가" — 이 서비스 최대의 미검증 가설 |
| **2** | **Repeat Visit Rate** | "두 번째로 올 이유가 서비스 안에 있는가" |
| **3** | **PASS / NONE 비율** | "안 낼 수 있다"가 실제로 작동하는가. 100% 발행이면 차별점이 허구다 |
| 보조 | Issue Completion Rate · Archive 재열람률 · 고객당 월 AI 비용 · Issue 이후 제품·도시 탐색률 | |

🔴 **Repeat Purchase Rate·LTV는 해커톤 기간에 측정 불가**하므로 핵심 KPI로 잡지 않는다.

NONE 비율이 존재하는 것은 결함이 아니다. 다만 지나치게 높으면 Retrieval이나 Global Signal의 품질을, 지나치게 낮으면 Gatekeeper의 기준이 약한지를 점검한다.

---

## 23. 리스크와 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| 이미지 기반 과잉 해석 | 허구의 취향 생성 | 최소 Evidence, Counter Evidence, Source 검증 |
| **LLM Self-approval** | 약한 후보 PASS | **Editor와 Gatekeeper 호출 분리 + 익명화 + 순서 섞기 + NONE 허용** |
| 후보 편향 | 같은 도시·제품 반복 | Past Issue 중복 Rule |
| AI 비용 증가 | ROI 악화 | 사전 계산, 이벤트 갱신, Retrieval, 월 상한 |
| JSON 불안정 | UI 렌더링 실패 | Schema 강제, 1회 Repair, 발행 전 Validation |
| 고객 피로 | 럭셔리 경험 저하 | 월 0~1회, NONE 정상화 |
| 개인정보 노출 | 신뢰·규제 문제 | 비식별화, 동의 확인, 최소 데이터 입력 |
| 예쁜 카피에 치우친 데모 | AI 당위성 약화 | REJECT 장면과 Decision Log를 데모 중심에 배치 |
| **고객이 Editorial을 읽지 않을 가능성** | 서비스 전제 붕괴 | 최대 미검증 가설로 명시하고 KPI 1로 검증 |
| **최소 조건 충족 고객 비율 미지수** | 도달 범위 불명 | 반복 구매율 9.9% 환경에서 관심 행동 누적률을 실데이터로 확인 |

---

## 24. 향후 확장

MVP 검증 이후 다음 순서로 확장한다.

1. 실제 CRM / POS / Wishlist 연동
2. 고객별 Profile 변화 History와 설명
3. Global Signal 자동 수집 및 운영자 승인 Workflow
4. 다국어 Editorial
5. A/B Test 기반 발행 빈도 최적화
6. 운영자 Editorial Review Console
7. Brand Safety 및 Claim Policy 강화
8. 고객 피드백을 활용한 Gatekeeper Calibration
9. Store Appointment 등 선택적 Experience 연결

Fine-tuning과 Vector DB는 데이터 규모와 성능 문제가 실제로 확인된 뒤 검토한다.

---

## 25. 최종 정의

```text
Personal Data + Global MCM Signal
        ↓
Rule로 탐색 범위와 근거를 통제
        ↓
Multimodal LLM이 고객의 시각적 취향을 발견
        ↓
AI가 Customer Context와 MCM Context를 연결
        ↓
Meaningful Extension이 있는 Editorial Angle 생성
        ↓
독립 Gatekeeper가 A / B / C / NONE 판단
        ↓
PASS만 Issue 생성·검증·발행
        ↓
의미가 없으면 아무것도 발행하지 않음
```

MY MCM의 핵심은 더 많은 상품을 추천하는 것이 아니다. 고객의 실제 취향을 이해하고, 지금의 MCM에서 그 취향이 새롭게 확장될 수 있는 단 하나의 이야기를 찾는 것이다.

> **Recommendation:** 당신이 좋아하는 것과 가장 비슷한 상품입니다.
> **MY MCM:** 당신의 취향과 연결되지만, 아직 당신이 발견하지 못한 MCM입니다.

그리고 그 이야기가 충분히 의미 있지 않다면:

> **NONE — We do not publish.**

---

## Appendix A. 해커톤 심사 대응 요약

### 왜 AI가 필요한가?

제품 이미지 여러 장에서 고정 분류로 설명되지 않는 반복 미감을 찾고, 고객의 개인 맥락과 도시·컬렉션의 서술형 맥락 사이에서 새로운 의미를 발견하며, **그 연결이 Editorial로 발행할 가치가 있는지를 질적으로 판단**해야 하기 때문이다.

특히 마지막 판단은 유사도 점수로 대체되지 않는다. **유사도가 중간이어도 쓸 이야기가 없을 수 있고, 그것은 써 봐야 안다.**

### 왜 Rule이 필요한가?

AI가 볼 수 있는 후보와 근거를 제한하고, ID·Source·중복·발행 빈도·출력 형식을 검증해 비용과 환각을 통제하기 위해서다.

### "취향 추출은 그냥 집계 아닌가요?"

**맞다. `core5_summary`는 Rule이다.** 그렇게 설계했고 그렇게 말한다. AI는 그 밖의 행동 패턴(AI-discovered Traits)을 찾고, 연결에 쓸 이야기가 있는지 판단하는 데 쓴다.

### 왜 Gatekeeper가 필요한가?

생성과 승인을 분리해 Self-approval Bias를 줄이고, AI가 만든 후보라도 발행 가치가 없으면 `NONE`으로 거절하기 위해서다. **후보가 하나뿐이어도 자동 PASS하지 않는다.**

### 왜 월 1회인가?

AI 비용을 예측 가능하게 통제하면서 럭셔리 Editorial의 희소성을 유지하고 고객 피로를 방지하기 위해서다. **이는 최대치이지 발행 의무가 아니다.** 하한선은 존재하지 않는다.

### "6개월 아무것도 안 나가면 서비스가 죽은 건가요?"

**그것이 브랜드의 태도다.** 할 말이 없을 때 말하지 않는 것이 럭셔리다. 대신 Archive는 항상 열려 있다.

### "다른 럭셔리 브랜드도 되는 거 아닌가요?"

기술 구조는 그렇다. 다만 **"다른 도시에서 이게 뜬다"는 정보의 가치가 브랜드마다 다르다.** 매출의 90% 이상이 글로벌 고객인 MCM에서만 그 도시가 실제로 갈 수 있는 곳이 된다 [QA-4-1].

### "매출은 얼마나 오르나요?"

**확정적으로 주장하지 않는다.** 검증하려는 가설과 KPI를 제시한다. 문제의 경제적 크기는 **리텐션 5% 향상 시 이익 25~95% 증가**(Bain), **기존 고객 전환 확률 60~70%**로 설명한다.

### MVP가 반드시 증명해야 하는 것은?

> **가장 비슷한 후보조차 새로운 발견이 아니라면 REJECT하고, 실제로 의미 있는 확장이 성립할 때만 새로운 MY MCM Issue가 만들어진다.**

---

## Appendix B. 근거 출처

**MCM 공식 Q&A (A급)**
QA-1-2 가설·검증 요구 · QA-1-3 one-off 경계 · QA-2-3 더미 데이터 허용 · QA-3-1 오프라인→온라인 · QA-4-1 고객·매출 구조 · QA-4-2 훼손 금지 가치(브랜드 평판·UVP·Silhouette·Craftsmanship) · QA-4-3 Customer Engagement · QA-4-4 구매 intent · QA-5-1 개인정보 · QA-5-3 Standalone·API 전제

**외부 근거**
럭셔리 반복 구매율 9.9% · VIC 중 20% 미만 인정 · 구매 후 비인격적 후속 연락 불만 (Bain·Altagamma 맥락) · Bain 리텐션 5% → 이익 25~95% · 기존 고객 전환 확률 60~70% · Stylitics AOV +39%, 주요 프로그램 90%+ 구동 · Zalando 에디토리얼 70% AI 생성·비용 −90% · AI Clienteling 시장 $3.2B(2025) → $10.8B(2034) · Spotify Wrapped TikTok 737억 뷰(2023) · McKinsey "brand-authored interpretation layers that demonstrate how the brand thinks"
