# MCM Personal Editorial Engine — 최종 기획안

> **Service & AI Design Spec**
> 문서 상태: **Final (기획안 확정)** — 이 문서가 `02_PRD.md`의 기준이 된다
> 서비스명: **MY MCM — Personal Editorial Engine**

---

## 0. Executive Summary

### 한 줄 정의

**MCM 구매 고객의 실제 선택에서 Multimodal LLM이 미적 취향을 발견하고, 글로벌 MCM의 새로운 변화와 연결해 '이 고객에게 의미 있는 새로운 발견'이 존재할 때만 Editorial Story를 만들고, 그 Story들을 월 1회 하나의 개인 Magazine으로 발행하는 서비스다.**

### 핵심 메시지

> **내가 좋아하는 것을 또 추천하는 것이 아니라, 내 취향을 통해 아직 몰랐던 새로운 MCM을 발견한다.**

일반 추천 시스템은 고객과 가장 비슷한 상품을 찾는다. MY MCM은 고객의 취향과 충분히 연결되면서도 이미 알고 있는 취향을 반복하지 않는 새로운 맥락을 찾는다. **가장 유사한 상품이라도 새로운 이야기가 없다면 거절한다.**

### 발행 철학

> **We publish only when there is something worth saying.**

New Season Drop, City Signal, 구매 및 Wishlist 변화는 발행 명령이 아니라 탐색을 시작하는 Trigger다. Story 생성 여부는 Gatekeeper가, Magazine 발행 여부는 그달의 PASS Story 존재 여부가 결정한다.

**그달에 PASS Story가 0개면 Magazine을 발행하지 않는다.**

### 해커톤에서 증명할 단 하나의 장면

> 일반 추천 시스템이라면 선택할 "가장 비슷한 상품"을 MY MCM은 새로운 발견이 아니라는 이유로 `NONE` 처리하고, 고객의 취향과 연결되면서도 새로운 표현을 가진 후보만 Story로 만든다.

---

## 1. 문제 정의

### 1.1 MCM이 직접 말한 문제

> **"Customer Engagement, 즉, 고객과 더 가까이 다가가는 것입니다. 너무나 많은 시장, 매년 수많은 고객을 상대하다 보니 럭셔리 브랜드에서 신경을 많이 써야 할 맞춤형 케어가 많이 부족합니다. 따라서, AI를 고객이 원하는 것을 한발 앞서 제시하고, 또 지속적인 초개인화 고객관리에 관심이 많습니다."** [QA-4-3]

> **"글로벌 디지털 노마드이며 연령대는 Gen MZ입니다."**
> **"국내 매출도 대부분 면세 매출인 관계로, 실제로 글로벌 고객 기여도는 브랜드 매출의 90% 이상을 상회합니다."** [QA-4-1]

> **"기존 재방문 고객들의 LTV를 올리는 데 관심이 많고"** [QA-4-1]

MCM은 원인을 스스로 진단했다 — **시장이 너무 많고 고객이 너무 많아서 사람의 힘으로는 맞춤형 케어가 불가능하다.** 그리고 해법으로 AI를 지목했다. 이 서비스는 그 진단에 대한 응답이다.

### 1.2 현재의 문제

럭셔리 브랜드의 디지털 개인화는 구매 이력이나 관심 상품을 바탕으로 유사 상품을 추천하는 데 머무르기 쉽다.

- 고객이 이미 알고 있는 취향을 반복해서 보여준다.
- 제품 단위의 유사도는 설명하지만 브랜드와의 장기적 관계는 만들기 어렵다.
- 구매 이후 고객이 브랜드를 다시 방문할 이유가 약하다.
- AI가 필요한 이유가 "추천 문구 생성" 수준에 머무른다.

### 1.3 문제의 규모 — 실측 근거

| 근거 | 수치 | 의미 |
| --- | --- | --- |
| **럭셔리 리테일 반복 구매율** | **9.9%** | 10명 중 9명이 상당한 구매 후 다시 오지 않는다 |
| **구매 후 불만의 핵심** | 클라이언트가 **"비인격적이고 부조화한(impersonal and incongruous) 후속 연락"**을 핵심 불만으로 지목 | 접점이 있어도 관계가 만들어지지 않는다 |
| **VIC 인정 결핍** | **VIC 중 20% 미만**만 일관되게 인정받는다고 느낀다 | **최상위 고객조차 커버되지 않는다** |
| **두 번째 구매의 벽** | 두 번째 구매가 가장 어렵고, **그 이후 세 번째 확률이 크게 오른다** | 두 번째 구매가 LTV의 병목 |
| **리텐션의 경제학** | **리텐션 5% 향상 → 이익 25~95% 증가** (Bain) | 개선의 경제적 크기 |
| **기존 고객 전환 확률** | **60~70%** | 신규 획득 대비 압도적 |

**→ "구매 이후 연결이 끊긴다"는 이 팀이 만든 가설이 아니라 업계가 실측으로 확인한 문제다.**

### 1.4 해결하려는 문제

MCM 구매 이후에도 고객이 자신의 취향을 렌즈로 브랜드의 새로운 도시, 컬렉션, 제품, 문화적 맥락을 발견하게 한다. **Post-purchase Customer Engagement**와 장기적인 브랜드 관계 형성에 집중한다.

**의도적으로 스코프 밖:** 구매의향 이탈(장바구니·착장 후 미전환, [QA-4-4]). 이 솔루션의 메커니즘과 접점이 없으므로 억지로 붙이지 않는다.

### 1.5 타깃

- MCM 구매 경험이 있는 Existing Customer
- 취향을 해석할 최소 Evidence가 있는 고객 (§4.4)
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

### 2.1 2계층 구조 — Story와 Magazine

```text
Trigger 발생 시마다  →  Story 후보 탐색  →  Gatekeeper  →  PASS Story 누적
                                                              ↓
                                              월 1회  →  Monthly Magazine 발행
```

| 단위 | 정의 | 생성 시점 |
| --- | --- | --- |
| **Editorial Story** | **하나의 발견.** 고객 취향 × MCM 변화의 연결 하나 | Trigger 발생 시마다, Gatekeeper PASS일 때만 |
| **Monthly Magazine** | 그달 누적된 PASS Story들을 하나로 엮은 **발행물** | 월 1회, PASS Story가 1개 이상일 때만 |

**이 구조가 두 가지를 동시에 해결한다.**

| 문제 | 해결 |
| --- | --- |
| Trigger마다 발행하면 알림이 과도하다 | Story는 누적만 하고 알림은 월 1회 |
| 월 1회 하나만 고르면 그달의 발견을 놓친다 | 그달 PASS Story를 **모두** 수록 |

> **월 1회는 의무 발행 주기가 아니라 최대 발행 빈도다.**
> **PASS Story가 0개인 달에는 Magazine을 발행하지 않는다.**

### 2.2 MY MCM Archive

```text
MY MCM

2026. 03  —  MONTHLY ISSUE
             TOKYO / BERLIN — 2 stories

2026. 01  —  MONTHLY ISSUE
             SEOUL — 1 story

(2026. 02 — 발행 없음)
```

**발행이 없는 달이 아카이브에 그대로 드러나는 것이 이 서비스의 정직성이다.**

### 2.3 일반 추천과 MY MCM의 차이

| 구분 | 일반 Recommendation | MY MCM |
|---|---|---|
| 핵심 질문 | 무엇을 살 가능성이 높은가? | 지금 어떤 MCM 이야기가 이 고객에게 의미 있는가? |
| 선택 기준 | 높은 유사도·전환 가능성 | Personal Connection + New Discovery |
| 결과 | 여러 상품 추천 | 하나의 Story 또는 NONE |
| 유사 후보 | 우선 추천 | 이미 아는 취향의 반복이면 REJECT |
| 실패 처리 | 대체 상품 노출 | 발행하지 않음 |
| 발행 주기 | 상시 | 월 0~1회 |
| 고객 경험 | 상품 탐색 | 브랜드 세계의 발견 |

### 2.4 기존 서비스와의 정면 비교

| 서비스 | 하는 일 | 성과 | 우리와 갈리는 지점 |
| --- | --- | --- | --- |
| **Stylitics** | Complete the Look — 조합 제안, 쇼퍼블, 상시 노출 | **AOV +39%**, 주요 아웃피팅 프로그램 90%+ 구동 | 🟢 **거절하지 않는다.** 우리는 **가장 비슷한 후보를 REJECT**한다 |
| **Zalando** | AI 에디토리얼 비주얼 **생산** | 2025 Q4 에디토리얼 **70%가 AI 생성**, 비용 **−90%** | 🟢 **생산이지 판단이 아니다.** 원가 문제는 이미 풀렸다 |
| **Digital Wardrobe** (Whering·Acloset) | 고객이 자기 옷장 관리 | 무료~저가 | 🟢 **Reactive**이고 **브랜드 시즌 의도를 모른다** |
| **Ask Ralph** | 대화형 스타일리스트 | 2025.9 출시 | 🟢 **물으면 답한다.** 우리는 **묻지 않아도 발행되고 할 말 없으면 침묵한다** |
| **AI Clienteling Platform** | 오늘 연락할 고객·제품·메시지 표면화 | 시장 **$3.2B → $10.8B** | 🟢 **직원용 도구다** |
| **Burberry Insight Hub** | RFID가 콘텐츠 트리거 | 2023 도입 | 🟡 가장 가깝다. 차이는 **거절할 수 있다는 것** |
| **표준 CRM** | 신상품 → 배정 → 발송 | Send-Time·Suppression은 표준 기능 | 🟢 **출발점이 소유물**이고 **발행하지 않을 수 있다** |
| **Spotify Wrapped** | 연 1회 회고형 | TikTok 737억 뷰 | 🟢 **이벤트마다 진행형**, **전 세계 도시 데이터가 섞인다** |

### 2.5 왜 MCM이어야 하는가

**"다른 도시에서 이게 뜬다"는 정보의 가치가 브랜드마다 다르다.**

| | 일반 럭셔리 브랜드 | **MCM** |
| --- | --- | --- |
| "다른 도시" | 🔴 **안 가는 곳** | 🟢 **실제로 갈 수 있는 곳** |
| 근거 | — | **글로벌 고객 기여도가 매출의 90% 이상**, 주 타깃이 **"글로벌 디지털 노마드"** [QA-4-1] |

---

## 3. 전체 서비스 Flow

```text
[사전 준비 · 1회]
MCM Product / Campaign Image
        ↓
Multimodal LLM 기반 Product Core 5 Metadata 생성
        ↓
Rule Validation 후 Global MCM Intelligence 저장


[Story 생성 — Trigger 발생 시마다]

Personal Signal (구매·Wishlist 변화)  또는  Global Signal (Drop·City)
        ↓
① SEE — Taste Profile 갱신
   Core 5 (Rule)  +  AI-discovered Traits (AI)
        ↓
② Rule-based Candidate Retrieval
   기본: Core 5 2축 이상  /  확장: 1축 + Trait 관련성
        ↓
③ CONNECT — Cross-Context Meaning Discovery
   Customer Context → MCM Context → Bridge → Meaningful Extension
        ↓
④ EDIT — Editorial Angle 1~3개 생성
        ↓
⑤ Rule Validation Layer
   Evidence / Source / 동일 제품 중복 / Anchor 존재
        ↓
⑥ Independent AI Gatekeeper
        ↓
   PASS                          NONE
    ↓                             ↓
⑦ Story 생성 · 누적           Story 생성하지 않음
                                (Decision Log만 저장)


[Magazine 발행 — 월 1회]

해당 월 PASS Story 조회
        ↓
   1개 이상?  ──── 아니오 ──→  발행하지 않음
        ↓ 예
⑧ Monthly Magazine Generator
   Issue Title · Intro · Story 순서 · 최종 Copy · Editorial Flow
        ↓
⑨ Rule Validation → Magazine Template 렌더링
        ↓
⑩ MY MCM Monthly Magazine 발행
```

---

## 4. 데이터 인텔리전스 구조

### 4.1 Personal MCM Intelligence

- Purchase: 고객이 실제로 선택한 제품과 이미지
- Wishlist / Interest: 최근 관심 및 취향 확장 신호
- Customer Taste Profile: Core 5 (Rule) + AI-discovered Traits (AI)
- Past Stories: 이전에 발행된 도시, 제품, Angle, Evidence

### 4.2 Global MCM Intelligence

- 제품 및 컬렉션 메타데이터
- Product / Campaign / Store Image Asset
- 도시별 Product Availability
- New Season / New Drop
- City Signal과 서술형 설명
- Archive / Heritage Context

### 4.3 Core 5

Core 5는 고객을 고정 유형에 가두는 AI 결과가 아니라, 제품과 고객의 연결 가능성을 빠르게 찾기 위한 **Rule용 공통 메타데이터**다.

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
        ↓ 최신성 감쇠 적용
축별 가중 집계 → 최빈값 채택
```

🔒 **이 계산은 Rule이다. AI가 아니다.** 피칭에서도 그렇게 말한다. (R-10)

### 4.4 Taste Profile 생성 최소 조건

| 조건 | 값 |
| --- | --- |
| **Purchase** | **≥ 1개** |
| **Wishlist / 장바구니** | **≥ 1개** |

미달 시 `profile_status = insufficient`로 처리하고 **Story를 생성하지 않는다.**

**Purchase는 실제 선택을 보여주는 핵심 Evidence, Wishlist는 현재 관심과 취향 확장 방향을 보여주는 보조 Evidence다.**

> **상용화 시:** MCM이 구축하는 CRM의 구매·관심 행동 데이터를 동일한 Taste Engine의 입력으로 연동한다.

### 4.5 Brand Language — Editorial 표현 렌즈

다음 4개는 **취향 축이 아니다.** Editorial 작성 시 사용하는 브랜드 톤이다.

| 렌즈 | 성격 |
| --- | --- |
| **Heritage** | 1976년부터의 아카이브·유산 |
| **Mobility** | **이동하는 삶** — 매출의 90%+가 글로벌 고객이라는 MCM 구조와 직결 |
| **Personalization** | 개인의 표식 |
| **Craftsmanship** | 소재와 제작의 결과 |

> **Design Language = 제품을 분류하는 취향 축**
> **Brand Language = Editorial을 표현하는 방식**

🔒 **Craftsmanship 렌즈를 쓸 때 소재·제작 공정 설명을 생성하지 않는다.** 공개 제품 정보 범위 안에서만 서술한다. (R-8)

---

## 5. Trigger와 발행 빈도

### 5.1 Trigger

**Global Signal** — New Season Drop · City별 상품·컬렉션 변화 · 새 Campaign / Store / Archive Context · 상품 가용성 갱신

**Personal Signal** — 신규 구매 · Wishlist 추가·삭제 · 관심 제품 변화

```text
Global Signal OR Personal Signal
              ↓
Story 탐색 시작
```

### 5.2 Taste Profile 갱신 시점

**MVP에서는 Personal Signal이 발생할 때마다 즉시 갱신한다.**

| 처리 | 방식 |
| --- | --- |
| 기존 제품 | 이미지 분석 결과 **재사용** |
| 신규 추가 제품 | 이미지 분석 **신규 실행** |
| 삭제된 제품 | Evidence에서 **제외** |
| 이후 | 전체 Evidence 기준으로 Core 5와 Traits **재계산** |

**Global Signal만 발생한 경우 기존 Taste Profile을 재사용한다.**

> **상용화 시:** 고객·행동 데이터 규모가 커지면 배치 또는 조건부 갱신으로 최적화한다.

### 5.3 월 1회 발행 상한

Magazine은 **최대 월 1회** 발행한다. Story는 월 중 여러 개가 누적될 수 있다.

목적:

1. **비용 절감** — Magazine Generator 호출과 알림 발송을 월 1회로 제한
2. **UX 보호** — 럭셔리 Editorial의 희소성 유지, 알림 피로 방지

> 🔒 **강제 발행 하한선과 Heritage fallback은 존재하지 않는다.**
> 백업 콘텐츠가 있으면 "발행하지 않음"이 허구가 되고, 이 서비스의 유일한 구조적 차별점이 사라진다. (R-3)

### 5.4 ROI 관점의 호출 최적화

- Product 이미지 Metadata는 사전 계산·캐시한다.
- Taste Profile은 Personal Signal에만 갱신하고, 기존 제품 분석 결과는 재사용한다.
- Rule Retrieval로 후보를 먼저 줄인 뒤 소수 후보만 LLM에 전달한다.
- Rule Validation Layer에서 탈락한 Angle은 Gatekeeper 호출 없이 제외한다.
- Magazine Generator는 월 1회만 호출한다.

---

## 6. AI Logic ① SEE — Visual Taste Discovery

### 6.1 목적

고객이 실제로 선택하거나 관심을 보인 MCM 제품의 **이미지와 행동 데이터**를 Multimodal LLM이 함께 분석해 반복되는 시각적·미적 원칙을 발견한다.

별도의 독립 Vision 모델과 텍스트 LLM을 연결하는 구조가 아니라, MVP에서는 **Vision 기능이 포함된 하나의 Multimodal LLM**을 사용한다.

```text
Product Images
      +
Purchase / Wishlist / Product Metadata
      ↓
Multimodal LLM
      ↓
AI-discovered Traits + Evidence + Counter Evidence
```

⚠️ **SEE 단계의 AI 산출물은 `AI-discovered Traits`다.** `core5_summary`는 §4.3의 Rule로 별도 계산되며 AI 결과가 아니다.

### 6.2 Purchase와 Wishlist의 역할

> **Purchase = What you consistently choose**
> **Wishlist = Where your taste may be moving**

Wishlist만으로 강한 Trait를 확정하지 않는다. 구매 Evidence를 우선하고, Wishlist는 최근 변화나 확장 가능성을 설명할 때 사용한다.

🔒 **Wishlist에 담긴 제품 자체를 Editorial 지면에 직접 노출하지 않는다.** 노출하는 순간 Abandoned Cart 리타게팅과 구분되지 않는다. Wishlist는 **취향의 방향을 읽는 재료**이지 판매 대상이 아니다. (R-6)

### 6.3 AI-discovered Traits

Core 5만으로 설명하기 어려운 반복적 미감이나 관계를 동적으로 발견한다.

예: Muted Tonal Expression · Soft Structural Forms · Material-led Expression · Restrained Branding · Architectural Contrast

#### 생성 조건

- **최소 2개 이상의 실제 Evidence Product**에서 반복
- 단일 제품의 특징은 제외
- Core 5만으로 충분히 설명되는 특징은 제외
- Counter Evidence를 검토해도 유지
- 근거 Product ID가 실제 입력 데이터에 존재

#### 개수 제한 없음

🔒 **AI-discovered Traits에 고정된 최대 개수 제한을 두지 않는다.**

실제로 존재하는 유의미한 패턴을 임의로 제거하지 않기 위해서다. **유효한 Trait가 없다면 0개도 정상적인 결과다.**

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

`confidence`는 MVP에서 `medium`과 `high`만 사용한다. 정확히 2회 반복이면 `medium`, 3회 이상 반복되고 Counter Evidence를 통과하면 `high`.

🔒 **Trait는 제품과 선택 행동에 대한 서술이지 고객에 대한 규정이 아니다.** `"이 고객은 미니멀리스트다"`처럼 사람을 유형화하는 label을 생성하지 않는다. (R-1)

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

AI가 전체 글로벌 상품을 직접 읽지 않는다. Trigger가 발생하면 Rule이 후보를 좁힌다.

### 7.1 후보 기준

| 유형 | 조건 |
| --- | --- |
| **기본 후보** | Core 5 중 **2개 이상 연결** |
| **확장 후보** | Core 5 중 **1개 이상 연결** **AND** AI-discovered Trait와 **명확한 관련성 존재** |
| **제외** | Core 5 연결이 **0개** |

**확장 후보 경로가 중요하다.** Core 5 일치만 강하게 요구하면 Trait와 의미 있게 연결되는 새로운 후보를 놓친다.

### 7.2 왜 2축이고, 왜 확장 경로가 필요한가

```text
고객:   muted / structured / low_mono / smooth_leather / modern_minimal
Trait:  Quiet Architectural Form

후보 A: muted / structured / low_mono / grained / modern_minimal   → 4축
        🔴 너무 비슷하다 = 발견이 아니다

후보 B: cool_neutral / structured / low_mono / suede / heritage    → 2축
        🟢 색·소재·무드는 다른데 구조는 이어진다 = 발견

후보 C: saturated / structured / high_mono / nylon / bold_street   → 1축
        + Trait `Quiet Architectural Form`과 구조적으로 연결
        🟢 확장 후보로 통과 — Rule만으로는 놓칠 발견
```

> **Connected enough to feel personal, different enough to feel like discovery.**

**Rule은 명백히 무관한 것만 치우고, 최종 발행 적합성은 Gatekeeper가 판단한다.**

### 7.3 추가 필터

1. Global / City Signal과 직접 관련된 후보만 포함한다.
2. **이미 발행한 동일 제품**을 제외한다. (§7.4)
3. 필수 이미지 Asset, 제품 설명, Source가 없는 후보를 제거한다.
4. 판매 불가·비공개·지역 제한 후보를 제거한다.
5. LLM Context 한도에 맞춰 상위 후보만 CONNECT로 전달한다.

### 7.4 Past Story 중복 처리

🔒 **Retrieval 단계에서는 `이미 발행한 동일 제품`만 제외한다.**

동일하거나 유사한 취향 포인트가 과거에 등장했더라도 **새로운 제품이라면 새로운 Story 후보로 허용**한다. 같은 취향 축을 이유로 후보를 제거하면 고객의 핵심 취향과 연결되는 새 제품을 발견할 기회가 사라진다.

**대신 반복 방지는 2단으로 작동한다.**

| 단계 | 역할 |
| --- | --- |
| **Rule (Retrieval)** | 동일 **제품** 재발행 차단 |
| **AI (Gatekeeper)** | **Novelty 기준** — 과거 Story와 같은 이야기의 반복인지 판단 |

⚠️ **Gatekeeper의 Novelty가 유일한 서사 반복 방어선이 된다.** 새 제품·도시·컬렉션 Context를 반영해 Copy와 Story를 새롭게 구성해 동일 콘텐츠처럼 느껴지지 않게 한다.

---

## 8. AI Logic ② CONNECT — Cross-Context Connection

### 8.1 목적

Rule을 통과한 각 후보에 대해 "개인적으로 연결되지만, 단순 반복이 아닌 이유"를 실제 데이터에서 찾는다.

### 8.2 추론 순서

```text
Customer Context  →  MCM Context  →  Bridge  →  Meaningful Extension
```

#### Step 1. Customer Context

고객 측 Evidence만 읽고 어떤 미적 원칙이 안정적으로 존재하는지 정리한다.

반복 구매에서 확인된 Core 5 · AI-discovered Traits · Purchase와 Wishlist의 차이 · Evidence Product 이미지 · Counter Evidence · Past Story에서 이미 사용한 취향

> 이 고객의 실제 선택을 가장 구체적으로 설명하는 취향 원칙은 무엇이며, 어떤 Evidence가 이를 지지하는가?

#### Step 2. MCM Context

후보 제품만 보는 것이 아니라 제품을 둘러싼 브랜드 맥락을 읽는다.

Product 이미지와 Core 5 · Collection / Season · City Signal `description` · Campaign / Store / Archive Context · 기존 표현과 달라진 지점 · 사용 가능한 Source와 Asset

> 이 후보가 지금의 MCM에서 보여주는 구체적인 변화 또는 새로운 표현은 무엇인가?

#### Step 3. Bridge

두 Context의 공통 원칙을 한 문장으로 설명한다. "같은 색이라서" 같은 표면적 일치가 아니라 형태, 소재, 절제 방식, 문화적 표현 등 해석 가능한 관계여야 한다.

> 고객이 반복적으로 선택한 '절제된 구조감'은 Tokyo Collection의 깊은 Navy와 간결한 Hardware에서 유지되지만, 기존의 Brown 중심 선택과는 다른 도시적 표현으로 전환된다.

#### Step 4. Meaningful Extension

### 8.3 Meaningful Extension 판단 구조

🔒 **Anchor는 필수 조건, 나머지는 AI의 종합 판단이다.**

| 요소 | 성격 |
| --- | --- |
| **Anchor** — 고객의 기존 취향과 연결되는 지점 | 🔴 **필수.** 없으면 탈락 |
| **Newness** — 기존 선택과의 차이 | 🟡 AI 종합 판단 |
| **MCM Context** — Product / Collection / City / Brand 맥락 | 🟡 AI 종합 판단 |

**Newness와 MCM Context는 고정 점수나 하드필터로 쓰지 않는다.** 모두를 강한 하드필터로 걸면 후보가 지나치게 탈락해 발행 가능성이 사라진다. AI가 **단순 반복이 아닌 의미 있는 취향 확장인지 종합적으로 판단**한다.

```text
Connected enough to feel personal,
different enough to feel like discovery.
```

### 8.4 예시

| 항목 | 내용 |
| --- | --- |
| **Customer Context** | Brown, Structured Silhouette, Restrained Branding을 반복 구매. Trait `Quiet Architectural Form` 확인 |
| **MCM Context** | Tokyo New Season에서 Deep Navy, 정제된 구조, 최소화된 Hardware 신제품 공개 |
| **Bridge** | 조용한 구조감은 유지되지만 Tokyo의 Navy와 금속 디테일로 새로운 도시적 언어로 해석됨 |
| **Meaningful Extension** | 형태와 절제라는 Anchor는 유지, Brown 중심 표현을 색과 도시 맥락으로 확장 → **PASS 가능** |

반대로 Brown / Structured / Restrained가 그대로 반복된 후보는 Anchor는 강해도 `Meaningful Extension = false`다.

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
  "anchor": {
    "exists": true,
    "basis": ["trait:trait_01", "core5:silhouette"]
  },
  "meaningful_extension": {
    "is_extension": true,
    "new_dimension": "color_and_city_context",
    "reason": "기존 Brown 중심 선택을 Tokyo Deep Navy로 확장한다."
  }
}
```

Source가 실제 DB Record로 해석되지 않으면 해당 후보는 다음 단계로 넘기지 않는다.

---

## 9. AI Logic ③ EDIT — Editor · Rule Validation · Gatekeeper

### 9.1 3단 구조

```text
AI Editor  →  Rule Validation Layer  →  Independent AI Gatekeeper
(생성)         (객관 검증)                (편집 판단)
```

**객관적으로 검증 가능한 조건은 Rule이, 정답을 규칙으로 정의하기 어려운 편집적 가치는 AI가 판단한다.**

### 9.2 AI Editor

CONNECT 결과를 바탕으로 **서로 다른 Editorial 관점의 Angle을 최대 3개** 생성한다.

**활용 가능한 관점:**

| 관점 | 초점 |
| --- | --- |
| **Product 중심** | 제품 자체의 표현과 디테일 |
| **City / Brand Context 중심** | 도시와 브랜드 맥락 |
| **Customer Taste Extension 중심** | 고객 취향이 확장되는 방향 |

각 Angle은 한 문장 Angle · Customer Evidence · MCM Evidence · Bridge · Meaningful Extension · 예상 Headline · 반복되지 않는 이유를 포함한다.

🔒 **표현만 다른 중복 후보를 만들지 않는다.** 실제 Evidence가 없는 관점은 억지로 생성하지 않으며, **1~3개의 유효한 Angle을 생성**한다.

🔒 **Editor는 선택이나 PASS 여부를 결정하지 않는다.**

### 9.3 Rule Validation Layer

Gatekeeper 호출 **전에** 객관적으로 검증 가능한 항목을 확인한다.

| # | 검증 항목 |
| --- | --- |
| 1 | **Customer Evidence 존재 여부** |
| 2 | **MCM Source 유효성** |
| 3 | **동일 제품 중복 여부** |
| 4 | **고객 취향과 연결되는 Anchor 존재 여부** |
| 5 | Wishlist 제품명 직접 노출 여부 (R-6) |
| 6 | 고객 규정 표현 포함 여부 (R-1) |
| 7 | 출력 JSON Schema 유효성 |

**탈락한 Angle은 Gatekeeper에 전달하지 않는다.** 이 층이 AI 호출 비용을 줄이고 판단 기준을 명확하게 만든다.

### 9.4 Independent AI Gatekeeper

**필수조건을 통과한 Angle에 대해서만** 최종 편집 판단을 수행한다.

🔒 **별도 호출 · 익명화 · 순서 섞기.** 후보의 생성 순서나 이름을 제거하고 `A / B / C`로 전달하며, 가능한 경우 순서를 섞어 위치 편향도 줄인다.

**판단 기준:**

| # | 기준 | 질문 |
| --- | --- | --- |
| 1 | **Personal Relevance** | 고객 취향과 충분히 연결되는가? |
| 2 | **Novelty** | 기존 선택과 과거 Story를 반복하지 않는가? |
| 3 | **Discovery Value** | 고객이 몰랐던 MCM 맥락을 실제로 발견하게 하는가? |
| 4 | **Specificity** | 어느 고객에게나 적용될 일반 문장이 아닌가? |
| 5 | **Editorial Quality** | 하나의 Luxury Editorial로 발전시킬 만큼 구체적인가? |

**점수의 단순 합산으로 결정하지 않는다.** 후보별 근거를 서술형으로 종합 판단하되, 각 기준의 판정은 구조화해 감사 가능하게 남긴다. (R-4)

### 9.5 PASS/NONE 철학

```text
A / B / C / NONE
```

- `A / B / C`: 한 후보가 모든 필수 기준을 통과했을 때만 선택
- `NONE`: 후보가 없거나, 모든 후보가 단순 반복·근거 부족·일반적 이야기일 때

`NONE`은 시스템 실패가 아니다. **발행할 가치가 없음을 정확히 판단한 성공 결과**다.

🔒 **후보가 하나뿐이어도 자동 PASS하지 않는다.** 가장 유사한 후보도 새 발견이 아니면 REJECT한다. 빈 화면을 피하려고 약한 콘텐츠를 만들지 않는다.

Gatekeeper가 `NONE`을 반환하면 Story를 생성하지 않고 Decision Log만 저장한다.

---

## 10. Story 생성

Gatekeeper가 선택한 Angle을 바탕으로 Story 콘텐츠를 생성해 **해당 월에 누적**한다.

### 10.1 Story 구성

```text
HERO → STORY → CONNECTION → DISCOVERY → EXPERIENCE
```

`CONNECTION`은 추천 사유를 나열하는 "WHY YOU"가 아니다. 고객의 Evidence와 MCM Evidence를 이미지 및 Editorial 문장으로 병치해 연결을 자연스럽게 보여준다. 내부 추론과 점수는 고객에게 노출하지 않는다.

### 10.2 Copy 원칙

| 원칙 | 내용 |
| --- | --- |
| **고객의 소유물에서 시작한다** | *"당신의 [제품명]에서 시작된 이번 이야기…"* |
| 🔒 **고객을 규정하지 않는다** | ❌ *"당신은 미니멀한 사람입니다"*<br>⭕ *"당신이 선택해온 절제된 실루엣이 이번에는 도쿄에서 다른 모습으로 이어집니다"* |
| **제품 스펙을 나열하지 않는다** | 취향 속성은 문장 속에 녹인다 |
| **여정 조언을 하지 않는다** | 날씨·환율·맛집·일정 — 한 줄이라도 넣으면 여행 앱이 된다 |
| **Brand Language를 렌즈로 쓴다** | Heritage / Mobility / Personalization / Craftsmanship |
| **언어** | 영어, 럭셔리 매거진 에디토리얼 톤 |

### 10.3 Story JSON

```json
{
  "story_id": "S_0312",
  "customer_id": "...",
  "target_month": "2026-03",
  "city": "TOKYO",
  "decision_id": "D_0031",
  "hero": {
    "headline": "A Different Kind of Quiet",
    "image_asset_id": "tokyo_campaign_04"
  },
  "story": { "title": "Quiet, Reconsidered", "body": "..." },
  "connection": {
    "title": "The Shape of Quiet",
    "body": "...",
    "customer_evidence_asset_ids": ["purchase_101", "purchase_204"],
    "mcm_evidence_asset_ids": ["product_023", "tokyo_campaign_04"]
  },
  "discovery": { "product_id": "MCM_023", "image_asset_id": "product_023", "body": "..." },
  "experience": { "city": "Tokyo", "store_id": "STORE_TYO_01", "body": "..." },
  "source_ids": ["P_101", "P_204", "C_023", "CS_TYO_08"],
  "status": "accumulated"
}
```

### 10.4 이미지 처리 원칙

MVP에서는 생성형 이미지를 만들지 않는다. 기존 Product / Campaign / Store Asset을 사용하고, AI는 허용된 Asset 목록에서 섹션별 이미지를 선택한다.

> **AI = 편집장** · **MCM Asset = 잡지 소재** · **Template = 지면**

AI가 HTML/CSS를 생성하지 않는다. **무엇을 보여줄지는 AI가, 어떻게 보여줄지는 고정 Template이** 담당한다.

---

## 11. Monthly Magazine 생성

### 11.1 발행 조건

```text
월간 발행 시점
        ↓
해당 월 PASS Story 조회
        ↓
   1개 이상?  ── 아니오 ──→  🔒 발행하지 않음
        ↓ 예
Monthly Magazine Generator 실행
```

**MVP에서는 그달 PASS된 Story를 모두 수록하며 최대 개수 제한을 두지 않는다.**

> **상용화 시:** Story가 많아지면 발행 시점에 중복·다양성·편집적 가치를 고려해 최종 수록 Story를 선별하는 **Monthly Curation Layer**를 추가할 수 있다. MVP에서는 불필요한 기능 확장을 피한다.

### 11.2 Monthly Magazine Generator

**AI가 그달의 PASS Story들을 하나의 Editorial Issue로 편집한다.**

| AI 담당 | 내용 |
| --- | --- |
| **Monthly Issue Title** | 그달 Story들을 관통하는 제목 |
| **Intro** | 이번 호의 여는 글 |
| **Story 순서** | Editorial Flow에 맞는 배치 |
| **Story별 최종 Headline / Copy** | Magazine 맥락에 맞춘 조정 |
| **전체 Editorial Flow** | 흐름 구성 |

**UI는 AI가 매번 새롭게 디자인하지 않고 사전 정의된 Magazine Template으로 렌더링한다.**

> **AI = 콘텐츠 및 Editorial 편집**
> **Template = UI / Layout**

⚠️ **Generator는 판단이 아니라 편집 실행 단계다.** 발행 여부는 §11.1의 Rule이, Story 채택 여부는 §9의 Gatekeeper가 이미 결정했다. Generator에 발행 권한을 주지 않는다.

### 11.3 Magazine JSON

```json
{
  "magazine_id": "M_2603",
  "customer_id": "...",
  "issue_month": "2026-03",
  "issue_title": "Between Cities",
  "intro": "...",
  "story_order": ["S_0312", "S_0327"],
  "status": "published",
  "published_at": "2026-03-31T00:00:00Z"
}
```

### 11.4 발행 전 Rule Validation

- JSON Schema 유효성
- 수록 Story가 모두 해당 월 PASS Story인지
- Story의 Product·Asset·Source ID 존재 여부
- 허용되지 않은 주장·가격·재고 정보 포함 여부
- 월 1회 상한 재확인

검증 실패 시 자동 수정은 1회만 시도한다. 다시 실패하면 발행하지 않고 상태를 `validation_failed`로 기록한다.

---

## 12. Rule과 AI의 역할 구분

### 12.1 Rule의 역할

Rule은 **어떤 후보를 탐색할 것인지 통제하고, AI 결과를 객관적으로 검증한다.**

- Trigger 감지
- Taste Profile 최소 조건 확인
- Purchase / Wishlist 구분
- **`core5_summary` 가중 최빈값 계산**
- Global 후보 Retrieval (2축 / 1축+Trait / 0축 제외)
- 동일 제품 재발행 차단
- Evidence Product ID 검증 · Pattern당 최소 Evidence 수
- **Rule Validation Layer** (Evidence · Source · 중복 · Anchor)
- 월 1회 발행 상한
- DB / API Validation

### 12.2 AI의 역할

AI는 **Rule이 선별한 후보 안에서 새로운 의미를 해석하고 Editorial을 만든다.**

- 이미지 기반 제품 속성 인식 (Core 5 태깅)
- AI-discovered Traits 추론
- Cross-Context Connection 생성
- Meaningful Extension 종합 판단
- Editorial Angle 생성
- **Editorial Worthiness 판단 (Gatekeeper)**
- Story Narrative와 Asset 배치
- Monthly Magazine 편집

### 12.3 단계별 분담

| 단계 | Rule | AI |
|---|---|---|
| 준비 | Schema·Asset·ID 검증 | 이미지 기반 Product Metadata 초안 |
| Trigger | Signal 감지, 최소 조건, 월 상한 | 없음 |
| SEE | **`core5_summary` 계산**, Evidence·ID·Source 검증 | Trait 발견 |
| Retrieval | Core 5 / Trait 관련성 / 중복 / 가용성 | 없음 |
| CONNECT | Source 존재 검증 | Context 연결, Extension 판단 |
| EDIT | **Rule Validation Layer**, 익명화·순서 섞기 | Angle 생성, **발행 가치 판단** |
| Story | JSON·Asset·정책 검증 | Narrative, Asset 배치 |
| Magazine | 발행 조건·Schema 검증, Template 렌더링 | Title·Intro·순서·Flow 편집 |

> **Rule = Control / Validation / Retrieval**
> **AI = Interpretation / Meaning Discovery / Editorial Judgment**

```text
Rule → AI → Rule Validation → AI → Rule Validation
```

---

## 13. 설계 규칙

| # | 규칙 | 어기면 |
| --- | --- | --- |
| **R-1** | **고객을 규정하는 문장을 쓰지 않는다.** 주어는 항상 제품 또는 선택 행동 | 틀렸을 때 "브랜드가 나를 이렇게 본다고?"가 되어 관계가 훼손된다 |
| **R-2** | **아무것도 제안하지 않는 결과가 실제로 존재한다** | 추천 엔진과 구조가 같아진다 |
| **R-3** | **최소 발행 주기를 만들지 않는다. 백업 콘텐츠도 만들지 않는다** | "발행하지 않음"이 허구가 된다 |
| **R-4** | **점수·가중치 합산으로 후보를 고르지 않는다.** 서술형 종합 판단 | Score threshold와 구별되지 않는다 |
| **R-5** | **여정 자체에 대한 조언(날씨·환율·맛집·일정)을 한 줄도 하지 않는다** | 무료 여행 앱과 같은 범주가 된다 |
| **R-6** | **Wishlist 제품을 지면에 직접 노출하지 않는다** | Abandoned Cart 리타게팅과 구분되지 않는다 |
| **R-7** | **제품 이미지를 생성·변형하지 않는다.** 공식 Asset에서 선택·배치 | 제품 실루엣 왜곡 — MCM이 훼손 금지 가치로 지목한 항목 |
| **R-8** | **소재·제작·품질에 대한 설명을 생성하지 않는다** | 근거 없는 Craftsmanship 서술 |
| **R-9** | **구매 유도 CTA를 넣지 않는다** | Editorial이 아니라 카탈로그가 된다 |
| **R-10** | **`core5_summary`를 AI라고 주장하지 않는다** | "그거 최빈값 집계 아닌가요?"에 답할 수 없다 |
| **R-11** | **Monthly Magazine Generator에 발행 권한을 주지 않는다** | 편집 실행이 발행 판단을 대신하게 된다 |

---

## 14. 데이터베이스 설계

### 14.1 핵심 테이블

#### `customers`

| 필드 | 타입 | 설명 |
|---|---|---|
| `customer_id` | UUID | 고객 식별자 |
| `profile_status` | ENUM | insufficient / ready |
| `last_profiled_at` | TIMESTAMP | 최근 프로필 계산 시각 |
| `last_magazine_at` | TIMESTAMP | 최근 Magazine 발행 시각 |
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
| `ai_traits` | JSONB | Trait, Reason, Evidence, Counter Evidence (개수 제한 없음) |
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
| `retrieval_type` | ENUM | **basic (2축) / extended (1축+Trait)** |
| `cross_context` | JSONB | Customer/MCM/Bridge/Anchor/Extension |
| `editorial_angles` | JSONB | Editor 결과 1~3개 |
| `rule_validation` | JSONB | Rule Validation Layer 결과 |
| `status` | ENUM | retrieved / generated / rule_rejected / gatekeeper_rejected / selected |

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

#### `editorial_stories` ⭐ 신규

| 필드 | 타입 | 설명 |
|---|---|---|
| `story_id` | UUID | Story ID |
| `customer_id` | UUID | 고객 ID |
| `decision_id` | UUID | PASS 근거 |
| **`target_month`** | TEXT | **누적 대상 월 (YYYY-MM)** |
| `city_id` | UUID | 도시 |
| `product_id` | UUID | 발행 제품 (중복 차단용) |
| `story_json` | JSONB | Story 콘텐츠 |
| `status` | ENUM | **accumulated / included / expired** |
| `created_at` | TIMESTAMP | 생성 시각 |

#### `monthly_magazines` ⭐ 신규

| 필드 | 타입 | 설명 |
|---|---|---|
| `magazine_id` | UUID | Magazine ID |
| `customer_id` | UUID | 고객 ID |
| `issue_month` | TEXT | 발행 월 (YYYY-MM) |
| `issue_title` | TEXT | AI 생성 제목 |
| `intro` | TEXT | AI 생성 여는 글 |
| `story_order` | JSONB | 수록 Story ID 배열 |
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
               PASS       NONE
                 ↓         ↓
        editorial_stories  Decision Log만 저장
        (target_month 누적)
                 ↓
          [월 1회 발행 시점]
                 ↓
          Story 1개 이상? ── 아니오 ──→ 발행 없음
                 ↓ 예
         monthly_magazines
                 ↓
              PUBLISH
```

### 14.3 개인정보 및 운영 원칙

- AI 입력에는 고객의 직접 식별정보를 포함하지 않는다.
- 이미지와 행동 데이터 활용 동의 상태를 확인한다.
- Prompt와 Output에는 고객 ID 대신 일회성 내부 식별자를 사용한다.
- Model Version, Source, Decision을 저장해 판단을 재현할 수 있게 한다.
- 고객 데이터 삭제 요청 시 Event, Profile, Candidate, Story, Magazine 연결 데이터를 정책에 따라 삭제한다.

> **MCM 공식 입장:** *"고객 데이터는 개인 정보 이슈로 제공이 어렵습니다."* [QA-5-1] · *"'개인 식별 데이터가 오고 가지 않는다'는 전제 하에"* [QA-5-3]
> MVP는 더미 데이터로 구현하고, 실서비스에서 어떤 데이터가 API로 연결되는지를 설계에 명시한다.

---

## 15. API 및 Backend Flow

| Method | Endpoint | 역할 |
|---|---|---|
| `POST` | `/signals` | Global / Personal Signal 수신 |
| `POST` | `/customers/{id}/profile/recompute` | Personal Signal 기반 Taste 재계산 |
| `POST` | `/customers/{id}/stories/run` | Retrieval → CONNECT → Editor → Rule → Gatekeeper |
| `GET` | `/customers/{id}/stories?month=YYYY-MM` | 누적 Story 조회 |
| `POST` | `/customers/{id}/magazines/generate` | 월간 Magazine 생성·발행 |
| `GET` | `/customers/{id}/magazines` | Magazine Archive 조회 |
| `GET` | `/customers/{id}/magazines/{magazineId}` | Magazine Detail |
| `GET` | `/runs/{runId}/decision` | 데모용 Decision Log |

### 실행 상태

```text
[Story Run]
triggered → profile_ready → candidates_retrieved → connections_generated
→ angles_generated → rule_validated → gatekeeper_pass | gatekeeper_none
→ story_accumulated

[Magazine Run]
month_closed → stories_collected | no_stories
→ magazine_generated → validated → published
```

오류 상태: `profile_failed` · `ai_output_invalid` · `source_invalid` · `rule_rejected` · `validation_failed`

### 오류 처리

- AI Timeout: 지수 Backoff로 최대 1회 재시도 후 종료
- JSON Parsing 실패: Schema 오류와 함께 1회 Repair 요청
- Source 불일치: 즉시 REJECT
- Asset 누락: 다른 허용 Asset으로 1회 대체, 없으면 중단
- 동일 제품 재발행: Retrieval 단계에서 차단
- Partial Failure: 이전에 발행된 Magazine에는 영향 없음

---

## 16. 사용자 경험

### 16.1 MY MCM Archive

```text
MY MCM

2026. 03   MONTHLY ISSUE
           BETWEEN CITIES
           Tokyo · Berlin — 2 stories

2026. 01   MONTHLY ISSUE
           THE SHAPE OF QUIET
           Seoul — 1 story
```

### 16.2 Magazine Detail

```text
[ COVER ]
2026. 03 / BETWEEN CITIES / Large Editorial Image

[ INTRO ]
이번 호를 여는 글

[ STORY 01 ]
HERO → STORY → CONNECTION → DISCOVERY → EXPERIENCE

[ STORY 02 ]
...

[ END ]
Your next MCM story.
```

### 16.3 UI 원칙

- 영어 Copy를 기본으로 한다.
- 큰 이미지, 충분한 여백, Typography 중심의 Luxury Magazine 경험.
- 제품 스펙과 가격 나열을 최소화한다.
- 직접적인 구매 CTA를 MVP에서 제외한다.
- AI의 내부 점수와 추론 로그는 고객에게 노출하지 않는다.
- **고객 Evidence와 새로운 MCM Evidence를 시각적으로 병치**해 연결을 느끼게 한다.

---

## 17. MVP Scope

### 17.1 전제

- 팀: 2인 · 기간: 약 1주
- 목표: **핵심 AI 경험과 PASS/NONE Logic의 작동 증명**

### 17.2 MUST

1. 데모 고객 1~2명 — Purchase 3~5개 / Wishlist 2~3개 / Past Story 0~2개
2. Multimodal Taste Discovery — Core 5 요약(Rule) + AI-discovered Trait + Evidence + Counter Evidence
3. Global Signal Simulation — 예: `Tokyo — New Season Drop`
4. Rule-based Retrieval — 2축 기본 / 1축+Trait 확장 / 0축 제외
5. Cross-Context Connection — Anchor 필수 판정 포함
6. AI Editor — 서로 다른 관점의 Angle 1~3개
7. **Rule Validation Layer**
8. **Independent AI Gatekeeper — 익명화된 `A / B / C / NONE`**
9. **실제 REJECT 동작** — 가장 비슷하지만 새롭지 않은 후보의 Story 미생성
10. Story 생성 및 월별 누적
11. **Monthly Magazine 생성** — 2개 이상 Story를 하나로 묶는 장면
12. MY MCM UI — Archive + Magazine Detail
13. Decision Log — PASS/NONE 이유 확인 가능

### 17.3 SHOULD

- Taste Pattern과 Evidence 이미지 병치
- Purchase / Wishlist 구분 UI
- Counter Evidence 표시
- 확장 후보(1축+Trait) 경로 시연
- 발행 없는 달 표시

### 17.4 CUT

- 자체 Vision / Recommendation Model 학습 · Fine-tuning
- 별도 Vision Embedding Pipeline · Vector DB · 대규모 Clustering
- 실제 MCM POS / CRM 연동 · 수천 개 상품 실시간 분석
- 생성형 이미지
- 강제 발행 하한선 및 Heritage fallback
- Monthly Curation Layer (상용화 항목)
- 실제 이메일·메신저 발송 · 결제 · 구매 CTA
- 매출 임팩트 예측

---

## 18. 데모 시나리오

### Scene 0 — 문제와 차별점

```text
Recommendation: 가장 비슷한 것을 찾는다.
MY MCM: 나와 연결되지만 아직 알지 못했던 것을 찾는다.
```

### Scene 1 — SEE

고객의 Purchase 3~5개와 Wishlist 2~3개를 보여준다. `Discover My Taste` 실행 → Core 5 요약(Rule) + AI-discovered Trait + 근거 이미지 2개 이상 + Counter Evidence.

> 고정 카테고리만으로 고객을 규정하지 않습니다. 제품 이미지와 실제 선택 데이터를 함께 분석해 고객 고유의 반복 미감을 발견합니다.

### Scene 2 — SIGNAL & RETRIEVAL

```text
NEW SIGNAL — Tokyo: New Season Drop
        ↓
Candidate A (4축)  ·  Candidate B (2축)  ·  Candidate C (1축 + Trait)
```

**확장 후보 C가 Rule만으로는 걸러졌을 후보임을 보여준다.**

### Scene 3 — CONNECT

```text
Customer Context      Quiet Architectural Form
        ↓
MCM Context           Tokyo Deep Navy / Refined Hardware
        ↓
Bridge                절제된 구조감을 새로운 도시적 표현으로 연결
        ↓
Anchor                ✅ 존재
Meaningful Extension  Brown 중심 취향을 Color + City Context로 확장
```

### Scene 4 — REJECT ⭐ 핵심

Candidate A는 고객의 기존 Brown / Structured / Restrained 선택과 거의 동일하다.

```text
일반 추천 → High Similarity → Recommend
MY MCM   → No New Discovery → REJECT
```

> 가장 잘 맞는 상품조차 새로운 발견이 아니라면 Story를 만들지 않습니다. NONE은 실패가 아니라 저희 Editorial 기준이 작동한 결과입니다.

### Scene 5 — PASS & 누적

Candidate B가 PASS → Story 01 생성 및 3월에 누적.
두 번째 Signal(Berlin)로 Story 02 추가 누적.

### Scene 6 — MONTHLY MAGAZINE

```text
2026. 03  —  2 PASS Stories
                ↓
      Monthly Magazine Generator
                ↓
      BETWEEN CITIES
      Tokyo · Berlin
```

**여러 Story가 하나의 개인 Magazine으로 완성되는 과정을 보여준다.**

### Scene 7 — 발행 없는 달

```text
2026. 02  —  0 PASS Stories
                ↓
      🔒 발행하지 않음
```

> MY MCM은 정기 뉴스레터가 아닙니다. 말할 가치가 있을 때만 도착합니다.

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
Rule Validation Layer
              ↓
Gatekeeper Service ── Separate LLM Call
              ↓
Story Service → editorial_stories (월별 누적)
              ↓
Monthly Magazine Generator ── LLM (월 1회)
              ↓
Validation Service → monthly_magazines
              ↓
React / Next.js Magazine Template
```

### MVP 권장 Stack

Next.js / React / TypeScript · Next.js API Route 또는 FastAPI · PostgreSQL 또는 Supabase · Supabase Storage 또는 정적 Asset · Vision 지원 Multimodal LLM + 텍스트 LLM · JSON Schema / Zod 또는 Pydantic · Run ID 기반 구조화 로그

### 모델 호출 최적화

1. 제품 이미지 Metadata는 사전 계산한다.
2. Profile은 Personal Signal에만 갱신하고 기존 분석 결과를 재사용한다.
3. Rule Retrieval 후 소수 후보만 CONNECT에 전달한다.
4. **Rule Validation Layer에서 탈락한 Angle은 Gatekeeper를 호출하지 않는다.**
5. 구조화 출력을 강제한다.
6. Magazine Generator는 월 1회만 호출한다.

---

## 20. 개발 우선순위 및 일정

### Priority 0 — 데모 데이터와 성공 조건 고정

고객 1~2명 Asset · Global Signal 2개 · Candidate A/B/C · REJECT와 PASS의 기대 결과 명시 · JSON Schema와 Source ID 체계 확정

**완료 기준:** 동일 입력으로 REJECT Run과 PASS Run을 반복 시연할 수 있다.

### Priority 1 — 핵심 AI Logic

Multimodal Taste Discovery → Evidence/Counter Evidence 검증 → Rule Retrieval(2축·확장) → Cross-Context + Anchor → Editor 1~3 Angle → **Rule Validation Layer** → **Independent Gatekeeper**

**완료 기준:** UI 없이도 구조화 JSON과 Decision Log로 전체 판단 과정을 증명할 수 있다.

### Priority 2 — Story 누적과 Magazine

Story JSON 생성 → 월별 누적 → Monthly Magazine Generator → Validation → 상태 전이

**완료 기준:** NONE Run에서는 Story 0개, PASS Run에서는 Story 1개, 월말에 2개 Story가 하나의 Magazine으로 묶인다.

### Priority 3 — 사용자 경험

MY MCM Archive → Magazine Detail Template → Evidence 병치 → Demo Control Panel

**완료 기준:** 심사위원이 3분 내에 SEE → CONNECT → REJECT → PASS → MAGAZINE을 이해할 수 있다.

### 1주 일정

| Day | 목표 | 산출물 |
|---|---|---|
| Day 1 | 데이터·Schema·Prompt 계약 확정 | Demo Dataset, JSON Schema |
| Day 2 | SEE 구현 | Taste Profile + Evidence |
| Day 3 | Retrieval + CONNECT | Cross-Context JSON |
| Day 4 | Editor + Rule Validation + Gatekeeper | A/B/C/NONE Decision Log |
| Day 5 | Story 누적 + Magazine Generator | Story·Magazine JSON |
| Day 6 | Magazine UI + 통합 | Archive, Magazine Detail |
| Day 7 | 오류 처리·리허설 | REJECT/PASS/MAGAZINE 데모 완성 |

### 절대 후순위

모델 Fine-tuning · 대규모 최적화 · 실제 CRM 연동 · 복잡한 추천 점수 · 자동 알림 채널 · 생성형 이미지

---

## 21. Prompt 설계 원칙

### 21.1 SEE

- 이미지 관찰 내용과 행동 데이터를 분리해 입력한다.
- Pattern마다 최소 Evidence와 **Counter Evidence**를 요구한다.
- Core 5를 답안 목록으로 강제하지 않는다.
- **개수 제한을 두지 않되 생성 조건 미달 시 0개를 허용한다.**
- 민감 속성·정체성 추론을 금지한다. **(R-1)**
- JSON Schema 외 텍스트 출력을 금지한다.

### 21.2 CONNECT

- 추론 순서를 `Customer Context → MCM Context → Bridge → Meaningful Extension`으로 고정한다.
- 각 Context에 Source ID를 요구한다.
- **Anchor 존재 여부를 별도 필드로 반환하게 한다.**
- "유사함"과 "새로운 발견"을 별도 필드로 판단한다.
- 근거가 부족하면 `insufficient_evidence`를 반환하게 한다.

### 21.3 Editor

- **서로 다른 관점**(Product / City·Brand / Taste Extension)의 Angle만 생성한다.
- 카피 표현만 다른 중복 후보를 금지한다.
- **유효한 Angle이 1개뿐이면 1개만 반환한다.**
- **선택이나 PASS 여부를 결정하지 못하게 한다.**
- Wishlist 제품명을 Angle에 직접 등장시키지 않는다. **(R-6)**

### 21.4 Gatekeeper

- 후보를 익명화하고 순서를 섞는다.
- **후보가 하나여도 NONE을 허용한다.**
- 모든 필수 기준을 통과한 후보만 선택한다.
- 점수 합산이 아니라 기준별 판정과 최종 이유를 반환한다. **(R-4)**
- 근거가 없거나 지나치게 일반적인 문장은 REJECT한다.

### 21.5 Story

- 고객의 소유 제품에서 이야기를 시작한다.
- 고객을 유형화하는 문장을 금지한다. **(R-1)**
- 소재·제작 공정 설명을 생성하지 않는다. **(R-8)**
- 여정 조언을 금지한다. **(R-5)**
- 허용된 Asset ID 목록 밖의 이미지를 지정하지 못하게 한다.

### 21.6 Monthly Magazine Generator

- **수록 Story를 추가하거나 제외하지 못하게 한다.** 입력된 Story만 배치한다. **(R-11)**
- Story의 사실 내용을 바꾸지 못하게 한다.
- Title·Intro·순서·Flow만 담당한다.

---

## 22. 검증 전략과 KPI

### 22.1 AI Logic Test Set

| Test | 입력 | 기대 결과 |
|---|---|---|
| T1 반복 취향 | 유사 구조 3회 반복 | Trait + high confidence |
| T2 단발 특징 | 한 제품에만 존재 | Trait 미생성 |
| T3 잘못된 근거 | 존재하지 않는 Product ID | Rule REJECT |
| **T4 과도한 유사성** | 고객 소유품과 거의 동일 | **Gatekeeper NONE** |
| T5 의미 있는 확장 | 공통 원칙 + 새 도시/색 표현 | PASS 가능 |
| T6 근거 부족 | City description 없음 | Candidate REJECT |
| **T7 확장 후보** | Core 5 1축 + Trait 강한 관련성 | **Retrieval 통과** |
| **T8 Anchor 부재** | 고객 취향과 연결점 없음 | **Rule Validation REJECT** |
| T9 동일 제품 재발행 | 과거 Story와 같은 제품 | Retrieval 제거 |
| **T10 동일 취향 축 · 다른 제품** | 과거와 같은 축, 새 제품 | **Retrieval 통과 → Gatekeeper Novelty 판단** |
| T11 월 상한 | 같은 달 이미 발행 | Magazine 생성 차단 |
| **T12 PASS Story 0개** | 그달 PASS 없음 | **Magazine 미발행** |
| T13 Invalid JSON | Schema 위반 | 1회 Repair 후 실패 처리 |
| **T14 고객 규정 문장** | Trait label에 인물 규정 표현 | **Rule REJECT (R-1)** |
| **T15 Wishlist 노출** | Angle에 Wishlist 제품명 등장 | **Rule REJECT (R-6)** |

### 22.2 MVP 성공 지표

- Evidence ID Validation 성공률
- Gatekeeper의 PASS/NONE 일관성
- **가장 유사한 후보 REJECT 시연 성공 여부**
- **2개 이상 Story가 하나의 Magazine으로 묶이는 장면 완성 여부**
- JSON Schema 성공률
- 데모 Run 완주 시간

### 22.3 Business Hypothesis

구체적인 추가 매출액을 확정적으로 주장하지 않는다.

> **가설:** Personal Editorial을 받은 기존 MCM 고객은 일반 브랜드 콘텐츠만 받은 고객보다 브랜드 재방문과 장기 Engagement가 높아질 것이다.

### 22.4 실서비스 KPI

| 우선순위 | KPI | 검증 대상 |
| --- | --- | --- |
| **1** | **Magazine Open Rate** | "에디토리얼을 읽는가" — 최대 미검증 가설 |
| **2** | **Repeat Visit Rate** | "두 번째로 올 이유가 서비스 안에 있는가" |
| **3** | **PASS / NONE 비율** · **발행 월 비율** | "안 낼 수 있다"가 실제로 작동하는가 |
| 보조 | Story Completion Rate · Archive 재열람률 · 고객당 월 AI 비용 · Story 이후 제품·도시 탐색률 | |

🔴 **Repeat Purchase Rate·LTV는 해커톤 기간에 측정 불가**하므로 핵심 KPI로 잡지 않는다.

NONE 비율이 존재하는 것은 결함이 아니다. 지나치게 높으면 Retrieval이나 Global Signal 품질을, 지나치게 낮으면 Gatekeeper 기준이 약한지를 점검한다.

---

## 23. 리스크와 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| 이미지 기반 과잉 해석 | 허구의 취향 생성 | 최소 Evidence, Counter Evidence, Source 검증 |
| **LLM Self-approval** | 약한 후보 PASS | **Editor / Gatekeeper 분리 + Rule Validation Layer + 익명화 + 순서 섞기 + NONE 허용** |
| **서사 반복** | 같은 취향 축 Story가 반복 | **Gatekeeper Novelty가 유일한 방어선** — 새 Context 기반 Copy 재구성 필수 |
| AI 비용 증가 | ROI 악화 | 사전 계산, 이벤트 갱신, Retrieval, Rule Validation 선차단, 월 1회 Magazine |
| JSON 불안정 | 렌더링 실패 | Schema 강제, 1회 Repair, 발행 전 Validation |
| 고객 피로 | 럭셔리 경험 저하 | 월 0~1회, 발행 없는 달 정상화 |
| 개인정보 노출 | 신뢰·규제 문제 | 비식별화, 동의 확인, 최소 데이터 입력 |
| 예쁜 카피에 치우친 데모 | AI 당위성 약화 | REJECT 장면과 Decision Log를 데모 중심에 배치 |
| **Magazine Generator의 역할 확대** | 편집 실행이 발행 판단을 대신 | **R-11 — Generator에 Story 추가·제외 권한 없음** |
| 고객이 Editorial을 읽지 않을 가능성 | 서비스 전제 붕괴 | 최대 미검증 가설로 명시하고 KPI 1로 검증 |
| Wishlist 보유 고객 비율 미지수 | 대상 범위 불명 | 최소 조건(Purchase≥1 AND Wishlist≥1) 충족률을 실데이터로 확인 |

---

## 24. 향후 확장

1. 실제 CRM / POS / Wishlist 연동
2. **Monthly Curation Layer** — Story가 많아질 때 최종 수록 선별
3. Taste Profile **배치·조건부 갱신** 최적화
4. 고객별 Profile 변화 History와 설명
5. Global Signal 자동 수집 및 운영자 승인 Workflow
6. 다국어 Editorial
7. A/B Test 기반 발행 빈도 최적화
8. 운영자 Editorial Review Console
9. Brand Safety 및 Claim Policy 강화
10. 고객 피드백을 활용한 Gatekeeper Calibration

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
Anchor 위에서 Meaningful Extension을 종합 판단
        ↓
Rule Validation → 독립 Gatekeeper가 A / B / C / NONE
        ↓
PASS만 Story로 만들어 그달에 누적
        ↓
월 1회, Story가 있을 때만 Monthly Magazine 발행
        ↓
의미가 없으면 아무것도 발행하지 않음
```

**Personal Data → Taste Profile → Global Signal → Candidate Retrieval → AI Connection → Editorial Judgment → PASS Story → Monthly Personal Magazine**

> **Recommendation:** 당신이 좋아하는 것과 가장 비슷한 상품입니다.
> **MY MCM:** 당신의 취향과 연결되지만, 아직 당신이 발견하지 못한 MCM입니다.

그리고 그 이야기가 충분히 의미 있지 않다면:

> **NONE — We do not publish.**

---

## Appendix A. 심사 대응

### 왜 AI가 필요한가?

제품 이미지 여러 장에서 고정 분류로 설명되지 않는 반복 미감을 찾고, 고객의 개인 맥락과 도시·컬렉션의 서술형 맥락 사이에서 새로운 의미를 발견하며, **그 연결이 Editorial로 발행할 가치가 있는지를 질적으로 판단**해야 하기 때문이다.

특히 마지막 판단은 유사도 점수로 대체되지 않는다. **유사도가 중간이어도 쓸 이야기가 없을 수 있고, 그것은 써 봐야 안다.**

### 왜 Rule이 필요한가?

AI가 볼 수 있는 후보와 근거를 제한하고, ID·Source·중복·Anchor·발행 빈도·출력 형식을 검증해 비용과 환각을 통제하기 위해서다.

> **객관적으로 검증 가능한 조건 → Rule**
> **정답을 규칙으로 정의하기 어려운 편집적 가치 → AI**

### "취향 추출은 그냥 집계 아닌가요?"

**맞다. `core5_summary`는 Rule이다.** 그렇게 설계했고 그렇게 말한다. AI는 그 밖의 행동 패턴(AI-discovered Traits)을 찾고, 연결에 쓸 이야기가 있는지 판단하는 데 쓴다.

### 왜 Gatekeeper가 필요한가?

생성과 승인을 분리해 Self-approval Bias를 줄이고, AI가 만든 후보라도 발행 가치가 없으면 `NONE`으로 거절하기 위해서다. **후보가 하나뿐이어도 자동 PASS하지 않는다.**

### 왜 월 1회인가?

Story는 Trigger마다 만들어지지만 알림과 발행은 월 1회로 묶는다. AI 비용을 예측 가능하게 통제하고, 럭셔리 Editorial의 희소성을 유지하며, 알림 피로를 막는다. **이는 최대치이지 발행 의무가 아니다. 하한선은 존재하지 않는다.**

### "몇 달 아무것도 안 나가면 서비스가 죽은 건가요?"

**그것이 브랜드의 태도다.** 할 말이 없을 때 말하지 않는 것이 럭셔리다. Archive는 항상 열려 있고, **발행 없는 달이 아카이브에 그대로 드러난다.**

### "다른 럭셔리 브랜드도 되는 거 아닌가요?"

기술 구조는 그렇다. 다만 **"다른 도시에서 이게 뜬다"는 정보의 가치가 브랜드마다 다르다.** 매출의 90% 이상이 글로벌 고객인 MCM에서만 그 도시가 실제로 갈 수 있는 곳이 된다 [QA-4-1].

### "매출은 얼마나 오르나요?"

**확정적으로 주장하지 않는다.** 검증하려는 가설과 KPI를 제시한다. 문제의 경제적 크기는 **리텐션 5% 향상 시 이익 25~95% 증가**(Bain), **기존 고객 전환 확률 60~70%**로 설명한다.

### MVP가 반드시 증명해야 하는 것은?

> **가장 비슷한 후보조차 새로운 발견이 아니라면 REJECT하고, 실제로 의미 있는 확장이 성립할 때만 Story가 만들어지며, 그 Story들이 모여 하나의 Personal Magazine이 된다.**

---

## Appendix B. 근거 출처

**MCM 공식 Q&A (A급)**
QA-1-2 가설·검증 요구 · QA-1-3 one-off 경계 · QA-2-3 더미 데이터 허용 · QA-3-1 오프라인→온라인 · QA-4-1 고객·매출 구조 · QA-4-2 훼손 금지 가치 · QA-4-3 Customer Engagement · QA-4-4 구매 intent · QA-5-1 개인정보 · QA-5-3 Standalone·API 전제

**외부 근거**
럭셔리 반복 구매율 9.9% · VIC 중 20% 미만 인정 · 구매 후 비인격적 후속 연락 불만 (Bain·Altagamma 맥락) · Bain 리텐션 5% → 이익 25~95% · 기존 고객 전환 확률 60~70% · Stylitics AOV +39%, 주요 프로그램 90%+ 구동 · Zalando 에디토리얼 70% AI 생성·비용 −90% · AI Clienteling 시장 $3.2B(2025) → $10.8B(2034) · Spotify Wrapped TikTok 737억 뷰(2023) · McKinsey "brand-authored interpretation layers that demonstrate how the brand thinks"

---

## Appendix C. 브레인스토밍 반영 내역

| # | 합의 항목 | 반영 위치 | 판정 |
| --- | --- | --- | --- |
| 1 | 월간 Magazine 발행 방식 | §2.1 · §5.3 · §11 | 🟢 **구조 개선** — Story/Magazine 2계층 |
| 2 | Taste Profile 최소 조건 (Purchase≥1 AND Wishlist≥1) | §4.4 | 🟢 명확화 |
| 3 | Personal Signal마다 즉시 갱신 | §5.2 | 🟢 MVP 단순화 |
| 4 | Traits 개수 제한 없음, 0개 허용 | §6.3 | 🟢 개선 |
| 5 | Retrieval 확장 경로 (1축 + Trait) | §7.1 · §7.2 | 🟢 **발견 공간 확대** |
| 6 | Anchor 필수 + Newness/Context는 AI 판단 | §8.3 | 🟢 하드필터 축소 |
| 7 | Past Story 중복은 동일 제품만 제외 | §7.4 | 🟡 **주의 — §23 참조** |
| 8 | Angle 1~3개, 서로 다른 관점 | §9.2 | 🟢 개선 |
| 9 | Gatekeeper 앞 Rule Validation Layer | §9.3 | 🟢 **AI 필연성 방어 강화** |
| 10 | Monthly Story 개수 제한 없음 (MVP) | §11.1 | 🟢 MVP 단순화 |
| 11 | PASS 0개면 발행 없음 | §11.1 · §2.2 | 🟢 원칙 유지 |
| 12 | Monthly Magazine Generator | §11.2 | 🟡 **주의 — R-11 신설** |

### 🟡 주의가 필요한 두 항목

**① 합의 7 — Past Story 중복 완화**

동일 취향 축의 반복을 Retrieval에서 허용하면 **서사 반복 방어선이 Gatekeeper의 Novelty 하나로 줄어든다.** 새 제품·도시·Context를 반영한 Copy 재구성이 필수이며, **T10 테스트로 검증**한다.

**② 합의 12 — Monthly Magazine Generator**

AI 지점이 하나 늘었다. Generator가 **Story를 추가하거나 제외하면 발행 판단을 대신하게 된다.** 이를 막기 위해 **R-11을 신설**했고, §21.6 Prompt 원칙에 반영했다. **Generator는 편집 실행이지 판단이 아니다.**
