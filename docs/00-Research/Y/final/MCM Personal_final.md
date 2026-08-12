# MCM Personal Editorial Engine 수정사항 정리

기존 구조를 기반으로 논의하면서, 고객 취향을 더 풍부하게 반영하고 AI의 실제 역할을 명확하게 만드는 방향으로 수정했습니다.

---

## 1. 고객 취향 프로필 수정

**기존 3축**
- Color
- Silhouette
- Monogram

**변경 — Core 5**
- Color — 컬러/톤
- Silhouette — 실루엣
- Monogram — 모노그램 밀도
- Material — 레더의 결/마감 중심
- Design Language — 디자인 무드

Design Language는 데모 범위를 고려해:
→ Heritage / Archive
→ Modern Minimal
→ Bold / Street
으로 고정합니다.

**왜 늘렸나?**
고객의 취향이 기존 3개 축 안에서 설명되지 않을 수 있기 때문입니다. 다만 축을 무작정 늘리는 게 아니라, 아래 기준으로 Core 5를 구성했습니다.
- 눈에 보이는 스타일 요소인가
- 제품 데이터에 존재하는가
- 기존 축과 실제로 다른 것을 구분하는가
- 브랜드 가치와 충돌하지 않는가
- 7일 안에 구현 가능한 범위인가

---

## 2. AI-discovered traits 추가

Core 5만으로 설명되지 않는 반복적인 고객 행동·취향 패턴을 AI가 발견해서 보강 정보로 사용합니다.

예:
- "신제품을 반복적으로 빠르게 구매하는 경향"
- "여행 관련 제품에 지속적으로 관심을 보이는 패턴"

**구조**
```
고객 구매/관심 데이터
        ↓
AI 패턴 분석
        ↓
Core 5로 설명되지 않는
반복적·의미 있는 패턴 발견
        ↓
최대 2~3개 trait 생성
```

각 trait에는 다음을 저장합니다:
→ trait
→ reason
→ confidence
→ detected_at

**중요한 점**: 신호2(고객 구매·관심 변화)가 발생했을 때만 다시 계산합니다. 신호1만 발생했다면 고객 프로필을 다시 계산하지 않고 기존 프로필을 그대로 사용합니다.

---

## 3. Rule과 AI의 역할을 분리

기존에는 AI와 룰의 역할이 다소 섞여 있었기 때문에 명확하게 나눴습니다.

**Rule-based Filter** — AI를 호출하기 전에:
- 기준1. Core 5 연결 여부 → 5개 축 중 3개 이상 겹치는 후보
- 기준2. 이전 Issue와 중복 여부 → 같은 도시 + 같은 취향축 조합이 이미 사용됐는지 확인
→ 명백히 무관하거나 중복되는 후보 제거

여기까지는 완전히 룰 기반입니다.

---

## 4. AI 로직의 핵심 변경 ⭐

**기존 질문**: "이 제품을 이 고객에게 보여줘도 될까?"

**현재 질문**: "이 고객에게 지금 어떤 MCM 이야기를 보여주는 것이 가장 의미 있을까?"

즉 AI가 단순히 제품 추천 여부를 판단하는 게 아니라, 고객의 기존 맥락과 새로운 MCM 맥락 사이에서 의미 있는 연결을 발견하고, 여러 후보 중 가장 가치 있는 이야기를 선택하는 역할을 합니다.

---

## 5. 수정된 AI 로직 — STEP 1. Cross-Context Connection

룰 필터를 통과한 후보를 AI에게 전달합니다. AI는 각 후보에 대해:

**① Customer Basis** — 고객의 어떤 데이터와 연결되는가?
→ Core 5 / 과거 구매·관심 이력 / AI-discovered traits

**② MCM Basis** — MCM의 어떤 데이터와 연결되는가?
→ 제품 데이터 / 도시 데이터 / city_signal

**③ Bridge** — 두 데이터가 왜 연결되는가?

를 찾아냅니다. 그리고 단순한 설명이 아니라 실제 데이터 source까지 함께 기록합니다.

```
customer_basis
→ text + source

mcm_basis
→ text + source

bridge
→ 연결 관계
```

이렇게 하는 이유는: AI가 그럴듯한 이야기를 만들어내는 것이 아니라 실제 고객/MCM 데이터에 근거해서 연결하도록 하기 위해서입니다.

---

## 6. Meaningful Extension

그다음 AI는 연결의 성격을 봅니다.

❌ **단순 일치**: Brown을 좋아하는 고객 → Brown 신제품 (기존 취향을 그대로 반복)

✅ **취향 확장**: 미니 실루엣을 선호하는 고객 → 도쿄에서 같은 실루엣이 Modern Minimal 디자인으로 새롭게 해석된 제품 (기존 취향을 새로운 MCM 맥락으로 확장)

**중요한 점**: Meaningful Extension은 별도의 탈락 필터가 아닙니다. 후보를 비교할 때 사용하는 AI 판단 기준 중 하나입니다.

---

## 7. Candidate Comparison

후보가 여러 개라면 AI가 다음 3가지 관점에서 비교합니다.

**① Connection Strength** — 고객과 MCM을 연결하는 근거가 얼마나 구체적이고 설득력 있는가

**② Meaningful Extension** — 기존 취향이 얼마나 새로운 맥락으로 확장되는가

**③ Editorial Value** — 구체적인 디테일이 있고, 억지스럽지 않게 자연스러운 Editorial로 발전시킬 수 있는가

**중요한 원칙**: 점수나 가중치를 계산하지 않습니다. 예를 들어 `Connection 80점 + Extension 70점 + Editorial 90점` 같은 방식이 아니라, 각 후보의 근거를 보고 AI가 서술형으로 종합 판단합니다.

그래서 AI가 다음처럼 판단하게 됩니다:
> "A는 고객과의 직접적인 연결은 강하지만 기존 Issue와 유사한 맥락이고, B는 고객의 기존 취향을 새로운 도시의 디자인 언어로 확장하면서 더 풍부한 이야기를 만들 수 있기 때문에 이번 Issue에 더 적합하다."

---

## 8. 최종 선택

**후보가 2개 이상** → AI가 비교 → 가장 의미 있는 후보 1개 선택

**후보가 1개** → 비교할 필요는 없지만 해당 후보를 3가지 기준으로 판단 → 충분하면 발행 / 부족하면 발행하지 않음

**후보가 0개** → 일반적으로 발행하지 않음. 단, 마지막 Issue 이후 2개월이 지났다면 → 정반대매칭 시도 → 그래도 개인화 후보가 없으면 Heritage Editorial 발행 (기존 하한선 구조 유지)

---

## 9. Editorial Generation도 수정

AI가 선택한 이야기를 단순 추천 문구가 아니라 Personal Editorial로 만듭니다.

**YOUR PIECE**
STORY의 시작에서 고객이 실제로 가지고 있는 제품이나 경험을 짧게 언급합니다.
예: "당신의 [제품명]에서 시작된 이번 이야기…" (`customer_basis`의 실제 고객 데이터를 활용)
그래서 고객이 "내가 가진 것에서 이 이야기가 시작됐구나"라고 느끼게 합니다.

**고객을 규정하지 않는 카피**
고객을 특정 유형으로 단정하지 않습니다.
❌ "당신은 미니멀한 사람입니다."
⭕ "당신이 선택해온 절제된 실루엣이 이번에는 도쿄에서 다른 모습으로 이어집니다."
즉, 고객을 유형화하는 것이 아니라 고객의 실제 경험을 브랜드의 새로운 맥락과 연결합니다.

**Brand Language**
아래 4개는 새로운 취향 축이 아닙니다. Editorial을 작성할 때 사용하는 톤/브랜드 렌즈입니다.
→ Heritage / Mobility / Personalization / Craftsmanship

즉, Design Language = 제품을 분류하는 취향 축 / Brand Language = Editorial을 표현하는 방식으로 역할을 분리합니다.

---

## 10. 최종 사용자 흐름

```
[고객의 MCM 활동]
구매 / 관심
        │
        └──────────────┐
                       ↓
                 신호2 발생
                       │
                       ↓
              고객 프로필 갱신
              Core5 + AI traits
                       │
                       ↓
────────────────────────────────

[글로벌 MCM 변화]
신상품 / 판매 변화 / 시즌 / 도시 데이터
                       │
                       ↓
                 신호1 발생
                       │
                       ↓
────────────────────────────────

        신호1 OR 신호2
               ↓
       전체 도시 데이터 탐색
               ↓
       Rule-based Filter
       ├─ Core5 연결
       └─ 이전 Issue 중복 여부
               ↓
          후보 A / B / C
               ↓
      AI Meaning & Selection
               ↓
      Cross-Context Connection
       ├─ Customer Basis
       ├─ MCM Basis
       └─ Bridge
               ↓
       Candidate Comparison
       ├─ Connection Strength
       ├─ Meaningful Extension
       └─ Editorial Value
               ↓
       가장 의미 있는 이야기 선택
               ↓
       Editorial Generation
       ├─ YOUR PIECE
       ├─ 자연스러운 STORY
       └─ Brand Language
               ↓
       HERO → STORY → DISCOVERY
       → EXPERIENCE → END
               ↓
          Personal Issue 발행
               ↓
         고객이 새로운 MCM
           이야기/제품 발견
               ↓
       구매 / 관심 / 새로운 행동
               ↓
          다시 신호2 발생
               ↺
```

**2개월 하한선은 별도로**
```
마지막 Issue 이후 2개월 경과
        ↓
정반대매칭 시도
        ↓
의미 있는 후보 있음
→ Personal Editorial

의미 있는 후보 없음
→ Heritage Editorial
```

---

## 최종 결론

**기존**: "이 고객에게 어떤 제품을 추천할까?"

**현재**: "이 고객이 이미 가진 취향과 경험에서 출발해, 지금 MCM의 어떤 새로운 이야기를 보여주는 것이 가장 의미 있을까?"

그리고 역할은 명확하게 나뉩니다.

```
RULE
→ 후보를 좁힘

AI
→ 고객 × MCM 사이의 새로운 의미를 발견
→ 단순 반복과 취향 확장을 구분
→ 여러 후보 중 가장 가치 있는 이야기 선택

EDITORIAL AI
→ 선택된 이야기를 고객의 실제 경험에서 시작하는
   자연스러운 매거진으로 표현
```