# MCM Personal Editorial Engine — 최종 기획안

> 작성일: 2026-08-11 · 팀 2인 · 개발 기간 약 1주 · 내부 평가 77/100
>
> **근거 표기:** `Fact` = 공식 Q&A 또는 확인된 외부 자료 · `Inference` = 논리적 해석 · `Hypothesis` = 검증 대상

---

# 1. 한 줄 정의

> ## **당신만이 읽을 수 있는 매거진, 세상에 단 한 부.**

MCM 구매 고객이 선택해 온 제품에서 반복되는 미적 취향을 AI가 읽고, 전 세계 MCM의 새로운 변화가 발생했을 때 **그 고객에게만 의미 있는 새로운 발견이 존재하는지 판단**한다. **실제로 이야기할 가치가 있을 때만** Personal Editorial을 발행한다.

## 핵심 철학

> ### **We publish only when there is something worth saying.**

**"발행하지 않음"은 이 서비스의 정상 출력이다.** 이것이 추천 엔진·CRM·뉴스레터와 구별되는 유일한 구조적 지점이다.

## 목적

| ❌ 아니다 | ⭕ 이다 |
| --- | --- |
| 고객이 좋아하는 상품을 다시 추천하는 것 | **고객의 취향을 렌즈 삼아, 아직 몰랐던 새로운 MCM을 발견하게 하는 것** |

---

# 2. 트랙

**Challenge 03 — 360도 고객경험** 중 **"구매 이후 지속적 연결·로열티 형성"** 파트.

**의도적으로 스코프 밖:** 구매의향 이탈(장바구니·착장 후 미전환, QA-4-4). 이 솔루션의 메커니즘과 접점이 없으므로 억지로 붙이지 않는다.

---

# 3. 문제 정의

## 3.1 MCM이 직접 말한 것 [Fact]

> **"Customer Engagement, 즉, 고객과 더 가까이 다가가는 것입니다. 너무나 많은 시장, 매년 수많은 고객을 상대하다 보니 럭셔리 브랜드에서 신경을 많이 써야 할 맞춤형 케어가 많이 부족합니다. 따라서, AI를 고객이 원하는 것을 한발 앞서 제시하고, 또 지속적인 초개인화 고객관리에 관심이 많습니다."** [QA-4-3]

> **"글로벌 디지털 노마드이며 연령대는 Gen MZ입니다."** · **"글로벌 고객 기여도는 브랜드 매출의 90% 이상을 상회합니다."** [QA-4-1]

> **"기존 재방문 고객들의 LTV를 올리는 데 관심이 많고"** [QA-4-1]

## 3.2 문제 진술

MCM 고객의 90% 이상은 국경을 넘나들며 소비하는 글로벌 노마드다. 이들의 구매와 관심 데이터는 전 세계 도시에 파편화되어 쌓이므로, **오프라인 직원의 힘만으로는 한 고객의 전체 여정을 파악해 개인화된 케어를 제공하는 것이 구조적으로 불가능하다.**

그 결과 구매 이후의 연결이 끊긴다.

## 3.3 외부 근거 [Fact]

| 근거 | 수치 |
| --- | --- |
| **럭셔리 리테일 반복 구매율** | **9.9%** — 10명 중 9명이 상당한 구매 후 다시 오지 않는다 |
| **구매 후 불만의 핵심** | 클라이언트가 **"비인격적이고 부조화한(impersonal and incongruous) 후속 연락"**을 핵심 불만 지점으로 지목 |
| **VIC 인정 결핍** | **VIC 중 20% 미만만** 일관되게 인정받는다고 느낀다 |
| **두 번째 구매의 벽** | 두 번째 구매를 만드는 것이 가장 어렵고, **그 이후 세 번째 확률이 크게 오른다** |
| **리텐션의 경제학** | **리텐션 5% 향상 → 이익 25~95% 증가** (Bain) |
| **기존 고객 전환 확률** | **60~70%** |

**→ "구매 이후 연결이 끊긴다"는 이 팀이 구성한 가설이 아니라 업계가 실측으로 확인한 문제다.**

---

# 4. 타깃

**MCM 구매 이력이 최소 1회 이상 있는 Existing Customer.**

| 항목 | 내용 |
| --- | --- |
| 정의 | 글로벌 디지털 노마드 · Gen MZ [QA-4-1, Fact] |
| 신규 고객 | 🔴 **대상 아님.** 기존 Lookbook·Campaign을 본다. 첫 구매 이후부터 대상이 된다 |
| 데이터 부족 고객 | 🟢 **발행하지 않는다.** 별도 대체 콘텐츠를 만들지 않는다 |

**신규 고객 획득 서비스가 아니라 구매 이후 Engagement / LTV 서비스다.**

---

# 5. AI 로직

## 5.1 전체 파이프라인

```
┌─ [사전 준비 · 1회] ───────────────────────────────────────┐
│  제품 이미지  →  Vision LLM  →  Core 5 태그               │
│                                 (열거형 · 사람 검수)       │
└───────────────────────────────────────────────────────────┘

[Signal]  New Season Drop / City Signal / 고객 행동 변화
              신호1 또는 신호2, 둘 중 하나만 발생해도 트리거
                            ↓
[RULE]    Guardrail — 최소 데이터 · 월 1회 상한 · 동일 Issue 중복
                            ↓
[RULE]    취향 프로필 = 상호작용 제품의 Core 5 가중 최빈값
[AI]      + AI-discovered traits (Core 5 밖 행동 패턴 2~3개)
                            ↓
[RULE]    후보 Retrieval — 전 세계 도시 데이터 중 ▶2축 이상◀ 겹침
                            ↓
[AI]      Cross-Context Connection — 후보마다
          ① Customer Basis (text + source)
          ② MCM Basis (text + source)
          ③ Bridge (왜 연결되는가)
                            ↓
[AI]      Editor — 각 후보의 가장 강한 Editorial Angle 작성
                            ↓
[AI] ★    Gatekeeper — Angle을 ▶익명·순서 섞어◀ 받고 판정
          "발행할 가치가 있는 것을 고르되, ▶없으면 없다고 답하라◀"
                            ↓
                   ┌────────┴────────┐
                 PASS              REJECT
                   ↓                  ↓
[AI]      Editorial Generation    ▶ 아무것도 발행하지 않음 ◀
                   ↓
[RULE]    최종 Validation → MY MCM Issue 발행
```

## 5.2 Rule / AI 역할 분담

| RULE (deterministic) | AI (judgment) |
| --- | --- |
| Signal 감지 | **Core 5 밖 행동 패턴 발견** |
| 최소 데이터 조건 | **Global × Personal 연결 발견** |
| **취향 프로필 집계 (가중 최빈값)** | **단순 반복과 취향 확장의 구분** |
| 후보 Retrieval (2축 겹침) | **Editorial Angle 작성** |
| 월 1회 상한 · 중복 방지 | **★ 발행 가치 판정 (Gatekeeper)** |
| Evidence ID 존재 검증 | **Editorial Narrative 생성** |
| DB / API validation | |

> **RULE = "언제 AI가 움직일 수 있는가"**
> **AI = "무엇이 이 고객에게 의미 있는가"**

### Rule의 역할

Rule은 **어떤 후보를 탐색할 것인지 통제하고 검증한다.**

- Trigger 감지
- 고객 최소 데이터 조건 확인
- Purchase / Wishlist 구분
- Global 후보 Retrieval
- 동일 Issue 중복 방지
- Evidence Product ID 검증
- Pattern당 최소 Evidence 수
- DB / API Validation

### AI의 역할

AI는 **Rule이 선별한 후보 안에서 고객과 MCM 사이의 새로운 의미를 해석하고 Editorial을 생성한다.**

- 이미지 기반 제품 속성 인식 (Core 5 태깅)
- AI-discovered Traits 추론
- Cross-Context Connection 생성
- Meaningful Extension 판단
- Editorial Angle 생성
- **Editorial Worthiness 판단 (Gatekeeper)**
- Editorial Narrative 생성

> **Rule = Control · Validation · Retrieval**
> **AI = Interpretation · Meaning Discovery · Editorial Judgment**

## 5.3 취향 프로필

### Core 5 [RULE로 집계]

| 축 | 열거형 값 |
| --- | --- |
| **Color / Tone** | `warm_neutral` · `cool_neutral` · `muted` · `saturated` · `mono` |
| **Silhouette** | `structured` · `soft` · `compact` · `oversized` |
| **Monogram Density** | `none` · `low` · `medium` · `high` |
| **Material** | `smooth_leather` · `grained` · `suede` · `nylon` · `mixed` |
| **Design Language** | `heritage_archive` · `modern_minimal` · `bold_street` |

**계산:** 상호작용 제품의 태그를 **가중 집계 → 축별 최빈값**
**가중치:** Purchase = **취향의 기반** / Wishlist·Interest = **확장 방향** (역할 분리. 충돌 시 Purchase 우선)
**최신성:** 오래된 데이터는 가중치 하향

🔒 **Core 5 추출은 룰이다. 이것을 AI라고 주장하지 않는다.**

### AI-discovered traits [AI]

**Core 5로 설명되지 않는 반복 패턴 2~3개.** 제품 속성이 아니라 **행동·시간 차원**이므로 Core 5 밖이다.

```json
{
  "trait": "신제품을 반복적으로 빠르게 구매하는 경향",
  "evidence_product_ids": ["A", "C"],
  "reason": "...",
  "confidence": 0.78,
  "detected_at": "..."
}
```

**갱신 시점:** 신호2(고객 행동 변화) 발생 시에만. 신호1만 발생하면 기존 프로필을 그대로 쓴다.

### AI-discovered Traits 생성 방식

AI-discovered Traits는 Multimodal LLM(Vision 기능 포함)이 고객이 실제로 구매하거나 관심을 보인 제품 이미지를 이해하고, 구매·관심 데이터를 함께 분석하여 생성한다. Core 5와 같은 구조화된 취향 정보만으로 설명하기 어려운 반복적인 선택 패턴을 AI가 추론하며, 이를 통해 고객의 취향이 어떤 방향으로 형성되고 확장되고 있는지를 보조적으로 해석한다.

즉, **Core 5는 Rule 기반 후보 탐색을 위한 구조화된 기준**이고, **AI-discovered Traits는 고객의 숨은 취향과 행동 패턴을 발견하기 위한 AI 기반 해석 정보**이다.

## 5.4 후보 Retrieval — 왜 2축인가

```
고객:   muted / structured / low_mono / smooth_leather / modern_minimal

후보 A: muted / structured / low_mono / grained / modern_minimal   → 4축 겹침
        🔴 너무 비슷하다 = 발견이 아니다

후보 B: cool_neutral / structured / low_mono / suede / heritage    → 2축 겹침
        🟢 색·소재·무드는 다른데 구조는 이어진다 = 발견
```

**3축 이상을 요구하면 B가 AI에게 도달하지 못한다.** 룰은 **명백히 무관한 것만** 치우고, 판단은 AI가 한다.

> **Connected enough to feel personal, different enough to feel like discovery.**

## 5.5 Cross-Context Connection

각 후보에 대해 AI가 **양쪽 근거와 연결 이유**를 실제 데이터 source와 함께 반환한다.

```json
{
  "customer_basis": { "text": "...", "source": ["product_A", "trait_2"] },
  "mcm_basis":      { "text": "...", "source": ["tokyo_signal_03", "product_X"] },
  "bridge":         "..."
}
```

**그럴듯한 이야기를 지어내지 못하게 하는 장치다.** 시스템은 source ID의 존재 여부를 deterministic하게 검증한다.

### AI 추론 방식

Cross-Context Connection은 고객의 실제 선택에서 형성된 취향(**Customer Context**)과 MCM의 새로운 변화(**MCM Context**)를 함께 해석하여, 둘 사이에 왜 새로운 발견이 되는지를 AI가 추론하는 단계다.

AI는 단순히 고객과 가장 비슷한 제품을 찾는 것이 아니라, **고객의 기존 취향이 새로운 컬렉션이나 도시의 맥락에서 어떻게 확장될 수 있는지**를 분석하고, 이를 **Bridge** 형태의 설명으로 생성한다. 이후 이 결과를 바탕으로 Editorial로 발전시킬 가치가 있는지 판단한다.

## 5.6 Meaningful Extension

| ❌ 단순 일치 | ⭕ 취향 확장 |
| --- | --- |
| Brown을 좋아하는 고객 → Brown 신제품 | 미니 실루엣을 선호하는 고객 → 도쿄에서 **같은 실루엣이 Modern Minimal로 새롭게 해석된** 제품 |

**별도 탈락 필터가 아니라 Gatekeeper의 판정 기준 중 하나다.**

## 5.7 ★ Gatekeeper — 이 서비스의 핵심

**Editor가 후보별 Angle을 작성한 뒤, 별도 호출에서 판정한다.**

| 원칙 | 이유 |
| --- | --- |
| **별도 AI 호출** | 같은 대화에서 자기가 쓴 것을 평가하면 거의 항상 통과시킨다 |
| **익명 · 순서 섞음** | 어느 후보인지, 누가 썼는지 모르게 |
| **🔒 "없으면 없다" 허용** | **"하나는 반드시 고르라"고 하면 항상 발행된다** |

### 판정 기준 4개

| # | 기준 | 질문 |
| --- | --- | --- |
| 1 | **Evidence Grounding** | 실제 고객·MCM 데이터로 뒷받침되는가 |
| 2 | **Specificity** | 아무 고객에게나 할 수 있는 문장이 아닌가 |
| 3 | **Novelty** | 과거 Issue나 고객의 기존 선택을 단순 반복하는가 |
| 4 | **Discovery Value** | "비슷해서 추천"을 넘어 새로운 MCM을 발견할 이유가 있는가 |

🔒 **점수·가중치를 계산하지 않는다.** `Connection 80 + Extension 70` 같은 방식이 아니라 근거를 보고 **서술형으로 종합 판단**한다.

## 5.8 발행하지 않는 조건

| 상황 | 결과 |
| --- | --- |
| 최소 데이터 미달 (서로 다른 제품 3개 미만) | **발행하지 않음** |
| 2축 이상 겹치는 후보 0개 | **발행하지 않음** |
| Gatekeeper가 "없음" 판정 | **발행하지 않음** |
| 월 1회 상한 초과 | 발행하지 않음 |

🔒 **최소 발행 주기(하한선)가 없다. 3개월, 6개월 동안 아무것도 발행되지 않을 수 있다.**
🔒 **Heritage 대체 콘텐츠를 만들지 않는다.** 백업이 있으면 "발행하지 않음"이 허구가 된다.

## 5.9 Editorial Generation

| 원칙 | 내용 |
| --- | --- |
| **YOUR PIECE에서 시작** | 고객이 실제로 가진 제품에서 이야기가 출발한다. *"당신의 [제품명]에서 시작된 이번 이야기…"* |
| 🔒 **고객을 규정하지 않는다** | ❌ *"당신은 미니멀한 사람입니다"* → ⭕ *"당신이 선택해온 절제된 실루엣이 이번에는 도쿄에서 다른 모습으로 이어집니다"* |
| **제품 스펙을 나열하지 않는다** | 취향 속성은 문장 속에 녹인다 |
| **구매 유도 CTA 없음** | 매장·도시는 라벨로만 |
| **언어** | 전체 영어, 럭셔리 매거진 에디토리얼 톤 |

### Brand Language — 표현 렌즈 (취향 축 아님)

`Heritage` · `Mobility` · `Personalization` · `Craftsmanship`

> **Design Language = 제품을 분류하는 취향 축**
> **Brand Language = Editorial을 표현하는 방식**

---

# 6. 사용자 흐름

```
[고객의 MCM 활동] 구매 / 관심
              ↓ 신호2
       고객 프로필 갱신 (Core 5 + traits)
              │
[글로벌 MCM 변화] 신상품 / 도시 데이터 / 시즌
              ↓ 신호1
              │
       ┌──────┴──────┐  둘 중 하나만 발생해도 트리거
              ↓
       전 세계 도시 데이터 탐색
              ↓
       Rule Filter (2축 겹침 · 중복 제외)
              ↓
       후보 A / B / C
              ↓
       Cross-Context → Editor → ★ Gatekeeper
              ↓
       ┌──────┴──────┐
     PASS          REJECT
       ↓              ↓
  Issue 발행     아무것도 안 함
       ↓
  알림 (국내 카카오톡 / 해외 이메일)
       ↓
  MY MCM에서 확인
       ↓
  새로운 도시 · 제품 발견
       ↓
  구매 / 관심 → 다시 신호2  ↺
```

**핵심 사용자 반응:** *"어? 내가 좋아하는 스타일이 다른 도시에서는 이렇게 나오는구나."*

---

# 7. UI

**쇼핑몰이 아니라 Digital Luxury Magazine.** 큰 이미지 · 여백 · 타이포그래피 중심 · 제품 스펙 미나열 · **구매 CTA 없음**.

## 7.1 MY MCM (피드)

Issue 01 / 02 / 03… 누적. 최신 Issue 강조. 도시·테마·대표 이미지. 스크롤로 아카이브처럼 탐색.

## 7.2 Issue Detail (세로 스크롤 한 페이지)

```
[ HERO ]        TOKYO / ISSUE 03 / 대형 Editorial 이미지
      ↓
[ STORY ]       AI가 쓴 Editorial — 제목 + 본문
      ↓
[ WHY YOU ]     왜 이 이야기가 당신에게 연결됐는지
                🔒 Evidence 제품 이미지를 나란히 노출
      ↓
[ DISCOVERY ]   TOKYO — 이번에 발견된 MCM (에디토리얼 이미지)
      ↓
[ EXPERIENCE ]  MCM TOKYO — 매장·도시 (구매 링크 아닌 라벨)
      ↓
[ END ]         Your next MCM story
```

🔒 **WHY YOU 섹션의 Evidence 이미지 병치가 중요하다.** AI가 근거로 든 제품을 화면에 나란히 보여주면 **검증을 보는 사람이 직접 할 수 있다.** 비용 0에 설득력이 가장 크다.

---

# 8. MVP 스코프 (2인 · 1주)

## 8.1 MUST — 시간이 부족해도 버리지 않는다

| # | 항목 | 이유 |
| --- | --- | --- |
| **1** | **★ Gatekeeper의 REJECT** | **유일한 구조적 차별점.** 이것이 없으면 추천 엔진 + LLM 카피다 |
| **2** | **Editorial Angle 생성** | 없으면 매거진이 아니다 |
| **3** | **Evidence 이미지 병치** | 비용 0, 검증 효과 최대 |

## 8.2 SHOULD

| # | 항목 | 비고 |
| --- | --- | --- |
| 4 | Vision 자동 태깅 | 🔒 **사전 실행 + JSON 저장 + 사람 검수.** 막히면 손 태깅으로 즉시 전환 |
| 5 | AI-discovered traits | Core 5 밖 유일한 통로 |
| 6 | Purchase / Wishlist 역할 분리 | 설명력 |

## 8.3 CUT

confidence 수치 노출 · Phase/Stage 로직 · 정반대매칭 · 월 상한 실동작 · 다양성 순위 알고리즘(Gatekeeper의 Novelty로 대체)

## 8.4 시뮬레이션으로 대체

신호1·2 실시간 감지 → **버튼 클릭** · Issue 누적 상태 → **DB에 미리 세팅** · 알림 발송 → **목업 화면**

## 8.5 데이터

| 항목 | 방식 |
| --- | --- |
| 데모 고객 | **1~2명** |
| 고객당 구매 제품 | 3~5개 (이미지) |
| 고객당 관심 제품 | 2~3개 |
| Global 후보 | **서울 / 도쿄 / 파리 / 베를린 4개 도시 × 각 5~10개 제품** |
| 제품 태그 | Vision 사전 실행 → JSON 저장 → 사람 검수 |
| 정적 데이터 | JSON 파일 |
| 동적 데이터 (Issue 이력) | **Supabase** — 중복 체크·Novelty 판정이 이력에 의존하고, 서버리스 환경에서 파일 쓰기가 불안정 |

**Standalone 원칙:** 실제 서비스에서는 MCM POS·CRM 데이터가 API로 연결된다는 전제를 설계에 명시한다. [QA-5-3, Fact]

## 8.6 개발 순서 (뒤에서부터 트리밍)

```
1. 데이터 준비 + Core 5 태깅 (Vision 또는 손)
2. 취향 프로필 계산 + 2축 Retrieval               [RULE]
3. ★ Editor → Gatekeeper 2단 호출               [핵심]
4. MY MCM 피드 + Issue Detail UI
5. AI-discovered traits
6. 시뮬레이션 버튼
```

---

# 9. 데모 시나리오 — REJECT를 반드시 보여준다

| # | 케이스 | 설계 | 판정 |
| --- | --- | --- | --- |
| **1** | **PASS** | 고객: muted · structured · low_mono<br>후보: **Tokyo — cool_neutral · structured · low_mono · heritage** | 🟢 색은 다르나 구조와 절제가 이어진다 |
| **2** | **애매** | 좋은 후보지만 **Issue 02에서 이미 `structured` 축을 다뤘다** | 🟡 Novelty로 판정 |
| **3** | **🔴 REJECT (핵심)** | 고객: brown · structured<br>후보: **brown · structured 신상** | **가장 비슷한 것을 거절한다** |

> ## **3번이 데모의 핵심이다.**
> **추천 엔진이라면 최고점을 줄 후보를 우리는 거절한다. 이 한 장면이 서비스의 정체성을 설명 없이 전달한다.**

**⚠️ 취향과 완전히 무관한 REJECT(형광 컬렉션 등)는 약하다.** 그건 룰로도 걸러지므로 AI를 증명하지 못한다.

---

# 10. Business Hypothesis

**구체적인 추가 매출액을 확정적으로 주장하지 않는다.** 실제 MCM 데이터가 없기 때문이다.

## 가설

> **Personal Editorial을 받은 기존 MCM 고객은 일반 브랜드 콘텐츠만 받은 고객보다 브랜드 재방문과 장기 Engagement가 높아질 것이다.**

## MVP 핵심 KPI — 3개

| # | KPI | 무엇을 검증하는가 |
| --- | --- | --- |
| **1** | **Issue Open Rate** | **"에디토리얼을 읽는가"** — 이 서비스 최대의 미검증 가설 |
| **2** | **MY MCM Repeat Visit Rate** | **"두 번째로 올 이유가 서비스 안에 있는가"** |
| **3** | **발행 / 미발행 비율** | **"안 낼 수 있다"가 실제로 작동하는가.** 100% 발행이면 차별점이 허구다 |

🔴 **Repeat Purchase Rate · LTV는 해커톤 기간에 측정 불가**하므로 KPI로 잡지 않는다.

## 시장 규모 근거 [Fact]

리텐션 5% 향상 → 이익 25~95% 증가 (Bain) · 기존 고객 전환 확률 60~70% · 럭셔리 반복 구매율 9.9% · 두 번째 구매 이후 세 번째 확률 급증

---

# 11. 경쟁 서비스와의 차이

| 서비스 | 하는 일 | 우리와 갈리는 지점 |
| --- | --- | --- |
| **Stylitics** (AOV +39%) | 조합 제안, 쇼퍼블, 상시 노출 | 🟢 **미루지 않고 거절하지 않는다.** PDP에는 항상 무언가 뜬다 |
| **Zalando** (에디토리얼 70% AI, 비용 −90%) | 에디토리얼 비주얼 **생산** | 🟢 **생산이지 판단이 아니다** |
| **Digital Wardrobe** (Whering·Acloset) | 고객이 자기 옷장을 관리 | 🟢 **Reactive vs Proactive**, 그리고 브랜드 시즌 의도를 모른다 |
| **Ask Ralph** | 물으면 답한다 | 🟢 **Reactive** |
| **Burberry Insight Hub** | RFID가 콘텐츠 트리거 | 🟡 가장 가깝다. 차이는 **거절할 수 있다는 것** |
| **표준 CRM** | 신상품 → 배정 → 발송 | 🟢 **출발점이 신상품이 아니라 소유물**, 그리고 **발행하지 않을 수 있다** |
| **Spotify Wrapped** | 연 1회 회고 | 🟢 **이벤트마다 진행형**, 그리고 **전 세계 도시 데이터가 섞인다** |

## MCM이어야 하는 이유

**"다른 도시에서 이게 뜬다"는 정보의 가치가 브랜드마다 다르다.**

| | 일반 럭셔리 | **MCM** |
| --- | --- | --- |
| 다른 도시 | 🔴 안 가는 곳 | 🟢 **실제로 갈 수 있는 곳** — 매출의 90% 이상이 글로벌 고객 [QA-4-1, Fact] |

---

# 12. 심사 대응

| 질문 | 답 |
| --- | --- |
| **"이거 추천 엔진 아닌가요?"** | 🟢 추천 엔진은 항상 무언가 제안합니다. 저희는 **가장 비슷한 후보를 거절합니다.** 데모 3번을 보십시오 |
| **"취향 추출은 그냥 집계 아닌가요?"** | 🟢 **맞습니다. Core 5는 룰입니다.** AI는 그 밖의 행동 패턴을 찾고, 연결에 쓸 이야기가 있는지 **써 봐서** 판단합니다 |
| **"왜 AI인가요?"** | 🟢 **유사도 점수로는 "할 말이 있는지"를 알 수 없습니다.** 유사도가 중간이어도 쓸 이야기가 없을 수 있고, 그건 **써 봐야 압니다** |
| **"LLM이 자기 결과를 통과시키지 않나요?"** | 🟢 **생성과 판정을 별도 호출로 분리**하고, Gatekeeper에게 **익명·순서 섞어** 주며 **"없으면 없다"를 허용**합니다 |
| **"6개월 안 나가면 서비스가 죽은 건가요?"** | 🟡 **그것이 브랜드의 태도입니다.** 할 말이 없을 때 말하지 않는 것이 럭셔리입니다 |
| **"다른 브랜드도 되는 거 아닌가요?"** | 🟡 기술 구조는 그렇습니다. 다만 **매출의 90%+가 이동 고객인 브랜드에서만** "다른 도시"가 갈 수 있는 곳이 됩니다 |
| **"매출은 얼마나 오르나요?"** | 🟢 **확정적으로 주장하지 않습니다.** 저희가 검증하려는 가설과 KPI를 제시합니다 |

---

# 13. 남은 위험 (숨기지 않는다)

| # | 위험 | 성격 |
| --- | --- | --- |
| **1** | **고객이 에디토리얼을 실제로 읽는가** — 근거 0 | `Hypothesis` · KPI 1로 검증 |
| **2** | **Gatekeeper가 같은 모델이라 편향을 공유한다** | 익명화·"없음" 허용으로 완화. **완전 해결 아님** |
| **3** | **최소 조건을 만족하는 고객이 몇 %인지 모른다** — 반복 구매율 9.9% | `Hypothesis` |
| **4** | **MCM 브랜드 언어가 판단 축이 아니라 표현 렌즈에만 있다** | Brand Language는 Editorial 톤이지 판단 기준이 아니다 |
| **5** | **이미지 해석의 정확성을 검증할 방법이 눈으로 보는 것뿐이다** | Evidence 병치로 완화 |
| **6** | **MCM 자체 데이터가 전무하다** | 모든 수치가 산업 데이터 |

---

# 14. 설계 규칙 (구현 중 어기면 안 됨)

| # | 규칙 |
| --- | --- |
| **R-1** | **고객을 규정하는 문장을 쓰지 않는다.** 주어는 항상 제품 |
| **R-2** | **아무것도 제안하지 않는 호가 실제로 존재한다** |
| **R-3** | **최소 발행 주기를 만들지 않는다.** 백업 콘텐츠도 만들지 않는다 |
| **R-4** | **점수·가중치로 후보를 고르지 않는다.** 서술형 종합 판단 |
| **R-5** | **여정 자체에 대한 조언(날씨·환율·맛집)을 한 줄도 하지 않는다** |
| **R-6** | **위시리스트 제품을 지면에 직접 노출하지 않는다** |
| **R-7** | **제품 이미지를 생성·변형하지 않는다.** 공식 에셋에서 선택·배치 |
| **R-8** | **소재·제작·품질에 대한 설명을 생성하지 않는다** |
| **R-9** | **구매 유도 CTA를 넣지 않는다** |
| **R-10** | **Core 5를 AI라고 주장하지 않는다** |

---

# 15. 내부 평가

```
E-01  Customer Engagement          12 / 14
E-02  AI Necessity                  9 / 12
E-03  Proactivity                   9 / 10
E-04  Purchase Intent               3 / 9    ← 의도적 스코프 제외
E-05  Usage Frequency               5 / 8
E-06  Problem Definition            6 / 8
E-07  Brand Fit                     6 / 7
E-08  Global Gen MZ                 6 / 6    ← 만점
E-09  Hypothesis Quality            6 / 6    ← 만점
E-10  Single Core Capability        4 / 5
E-11  Demo                          5 / 5    ← 만점
E-12  Channel Fit                   3 / 4
E-13  Standalone MVP                3 / 3    ← 만점
E-14  2인 · 1주                     2 / 3
──────────────────────────────────────────
소계                               79
Guardrail 감점                     −2
최종                               77
```

**GATE 4개 전부 통과 · 핵심 3축(CE + AI + Proactivity) 30점**

---

## 부록 — 이 기획안의 근거 체계

**A급 (MCM 공식 Q&A):** QA-1-2 가설·검증 · QA-1-3 one-off 경계 · QA-2-3 더미 허용 · QA-3-1 오프라인→온라인 · QA-4-1 고객·매출 구조 · QA-4-2 훼손 금지 가치 · QA-4-3 Customer Engagement · QA-5-1 개인정보 · QA-5-3 Standalone

**외부 근거:** 럭셔리 반복 구매율 9.9% · VIC 20% 미만 인정 · 구매 후 후속 연락 불만 · Bain 리텐션 5%→이익 25~95% · 기존 고객 전환 60~70% · Stylitics AOV +39% · Zalando 에디토리얼 70%·비용 −90% · McKinsey "brand-authored interpretation layers"

**내부 검증 이력:** `31` Problem 검증 → `34` AI Necessity Kill Test → `44`~`46` 시장 레퍼런스 → `53` AI 역할 도출 → `54`~`58` 반복 재평가