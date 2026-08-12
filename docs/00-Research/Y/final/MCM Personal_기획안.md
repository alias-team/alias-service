# MCM Personal Editorial Engine 기획안

## 1. 서비스 개요

**서비스명**: MY MCM — Personal Editorial Engine

**한 줄 정의**
고객의 실제 구매·관심 데이터와 글로벌 MCM 데이터를 AI가 연결해, 고객에게 이미 익숙한 취향을 반복 추천하는 것이 아니라 새로운 의미와 맥락을 발견하고 이를 개인 맞춤형 Editorial로 제공하는 서비스

**핵심 가치**
기존 개인화 서비스는 고객이 좋아하는 상품과 비슷한 상품을 추천하는 데 집중한다. MY MCM은 단순한 상품 추천을 넘어, "내가 이미 좋아하는 것에서 출발해, 내가 아직 발견하지 못한 새로운 MCM을 발견하는 경험"을 제공한다.

---

## 2. 문제 정의

현재 럭셔리 브랜드의 개인화는 주로 구매 이력이나 관심 상품을 기반으로 유사 상품을 추천하는 방식에 집중되어 있다. 하지만 고객이 MCM에서 제품을 구매한 이후에도 브랜드와 지속적으로 관계를 형성하기 위해서는 단순히 새로운 상품을 보여주는 것보다, "내 취향과 연결되는 새로운 브랜드의 이야기"를 발견하게 하는 경험이 필요하다.

따라서 MY MCM은 상품 추천 시스템이 아니라 고객의 취향을 기반으로 새로운 MCM의 맥락을 발견하게 하는 Personal Editorial Engine을 목표로 한다.

---

## 3. 핵심 서비스 구조

MY MCM은 크게 두 종류의 데이터를 결합한다.

**Global MCM Intelligence** — 도시별 MCM 제품 및 변화 데이터
- 신상품 / 시즌 컬렉션 변화 / 판매 데이터 변화 / 특정 제품 및 스타일 변화
- 도시별 제품 데이터
- City Signal의 서술형 맥락

**Personal MCM Intelligence** — 고객의 실제 행동 데이터
- 구매 이력 / 관심(Wishlist) / 고객의 기존 취향
- AI가 발견한 반복 패턴

```
Global MCM Intelligence
          +
Personal MCM Intelligence
          ↓
   AI Meaning Discovery
          ↓
Personal Editorial
```

즉, "무엇을 좋아하는 고객인가?"에서 끝나는 것이 아니라 "그 취향을 통해 지금 MCM에서 어떤 새로운 이야기를 발견할 수 있는가?"까지 연결한다.

---

## 4. 고객 취향 프로필 — Core 5

고객의 취향을 구조화하기 위해 5개의 취향 축을 사용한다.

1. **Color** — 컬러 / 톤
2. **Silhouette** — 제품의 실루엣
3. **Monogram** — 모노그램 밀도
4. **Material** — 레더 내부의 결 / 마감 (Smooth / Pebble / Suede 등)
5. **Design Language** — 디자인 무드 (Heritage/Archive / Modern Minimal / Bold/Street)

Core 5는 AI가 고객을 특정 유형으로 규정하기 위한 것이 아니라, Rule 기반 후보 필터를 위한 구조화된 기준으로 사용한다.

---

## 5. AI-discovered Traits

Core 5만으로 설명되지 않는 고객의 반복적인 구매·관심 패턴은 AI가 별도로 발견한다.

```
고객 구매 / 관심 데이터
        ↓
AI Pattern Analysis
        ↓
Core 5만으로 설명되지 않는
반복적·의미 있는 패턴인가?
        ↓
YES → AI-discovered trait 저장
NO  → 저장하지 않음
```

**생성 조건**
- 최소 2회 이상 반복되는 패턴
- Core 5만으로 설명하기 어려운 패턴
- 실제 데이터에 근거가 있는 패턴

**저장 구조**
```json
{
  "trait": "...",
  "reason": "...",
  "confidence": "medium | high",
  "detected_at": "..."
}
```
`confidence`는 지나치게 세분화하지 않고: medium → 정확히 2회 반복 / high → 3회 이상 반복

**중요한 원칙**: AI-discovered traits는 누적해서 계속 쌓는 것이 아니라 재계산 시 새롭게 발견된 값으로 덮어쓴다. 또한 이 정보는 신호2가 발생했을 때만 갱신한다 — 신호1만 발생하면 기존 고객 프로필을 그대로 사용한다.

---

## 6. Trigger — 언제 새로운 Editorial을 탐색하는가

**신호 1 — Global Signal**: 도시별 제품 데이터에 갱신이 발생함 (신상품 입고 / 시즌 컬렉션 교체 / 판매 데이터 업데이트 / 특정 제품·스타일 변화)

**신호 2 — Personal Signal**: 고객의 구매 또는 관심 데이터가 변화함 (새로운 제품 구매 / Wishlist 추가 / 관심 상품 변화)

```
신호1 OR 신호2
        ↓
Editorial 탐색 시작
```

둘이 동시에 발생할 필요는 없다. 단, 신호2가 발생했을 때만 고객 프로필과 AI-discovered traits를 갱신한다.

---

## 7. Rule-based Filter

Trigger가 발생하면 전체 도시의 MCM 제품 데이터를 대상으로 후보를 탐색한다. AI가 바로 모든 후보를 판단하는 것이 아니라, 먼저 사람이 정의한 명확한 조건으로 후보를 줄인다.

**기준 1 — 취향축 연결**: Core 5 중 3개 이상 겹치는 후보를 통과시킨다. 명백하게 고객 취향과 무관한 제품을 먼저 제거한다.

**기준 2 — 이전 Issue 중복 제거**: 이전에 발행한 Issue와 같은 이야기가 반복되지 않도록 확인한다. 중복 판단의 "각도"는 기준1에서 매칭된 Core 5 취향 축 조합으로 정의한다. 따라서 "같은 도시 + 같은 취향축 조합이 과거 Issue에서 사용되었는가?"를 Rule로 확인한다.

이 단계에는 AI를 사용하지 않는다.

---

## 8. AI Meaning Discovery

Rule을 통과한 후보를 대상으로 AI가 실제로 의미 있는 연결을 발견한다.

### 8-1. Cross-Context Connection

각 후보에 대해:

**Customer Basis** — 고객의 어떤 데이터와 연결되는가? (Core 5 / AI-discovered traits / 과거 구매 / 관심 데이터)

**MCM Basis** — MCM의 어떤 데이터와 연결되는가? (제품 Core 5 / Product 정보 / City Signal / `city_signals.description`의 서술형 맥락)

**Bridge** — 고객 데이터와 MCM 데이터가 왜 연결되는가?를 AI가 한 문장으로 설명한다.

그리고 각 근거에는 실제 데이터의 `source`를 연결한다.

```json
{
  "customer_basis": { "text": "...", "source": "..." },
  "mcm_basis": { "text": "...", "source": "..." },
  "bridge": "..."
}
```

이를 통해 AI가 단순히 그럴듯한 설명을 만들어내는 것이 아니라 실제 데이터에 근거한 연결을 발견하도록 한다.

---

## 9. Candidate Comparison

여러 후보가 존재한다면 AI가 후보들을 비교하여 이번 Issue에 가장 의미 있는 이야기 하나를 선택한다.

**① Connection Strength** — 고객과 MCM을 연결하는 근거가 얼마나 구체적이고 설득력 있는가

**② Meaningful Extension ⭐** — 단순한 취향 일치가 아니라 기존 취향이 새로운 맥락으로 확장되는가를 판단한다.
- 단순 일치: Brown을 좋아하는 고객 → Brown 신제품 (기존 취향의 단순 반복)
- 의미 있는 확장: 미니 실루엣을 선호하는 고객 → 도쿄에서 같은 실루엣이 Modern Minimal 디자인 언어로 새롭게 해석된 제품 (기존 취향에서 출발하지만 새로운 맥락과 표현을 제공)
- 애매한 경우에는 보수적으로 단순 일치로 판단한다.

**③ Editorial Value** — 해당 연결을 실제 Editorial로 만들 가치가 있는가. 충분한 구체적 디테일이 있는가, 억지스럽지 않게 자연스러운 Editorial 문장으로 발전할 수 있는가.

**중요한 원칙**: 세 기준을 점수로 합산하지 않는다 (`Connection 80 + Extension 90 + Editorial 70 = 240` 같은 방식 아님). 각 후보의 근거와 맥락을 AI가 서술형으로 종합하여 판단한다. 그래야 단순한 가중치 기반 추천 알고리즘과 차별화된다.

---

## 10. 최종 후보 선택

**후보 0개**: 일반적으로 발행하지 않는다. 단, 마지막 Issue 이후 2개월이 경과하면 하한선 로직을 발동한다.
```
일반 후보 없음 → 정반대매칭 시도 → 그래도 없음 → Heritage Editorial 발행
```

**후보 1개**: 비교할 후보가 없더라도 자동 발행하지 않는다. 해당 후보를 3가지 기준으로 판단 → 충분하면 발행 / 부족하면 발행하지 않음

**후보 2개 이상**:
```
후보 A/B/C → 각 후보 Meaning 분석 → 3가지 기준으로 비교 → 가장 가치 있는 후보 1개 선택
```
모든 후보가 부족하면 NONE → 발행하지 않음으로 처리한다.

---

## 11. Editorial Generation

AI가 최종 선택된 의미를 Editorial로 표현한다.

출력: `headline` + `caption`

고객에게는 AI의 내부 판단 과정이나 `reason`을 그대로 보여주지 않는다. "왜 당신과 연결되는지"를 별도의 추천 설명으로 제공하지 않고, Editorial 문장 자체에 자연스럽게 녹인다.

---

## 12. Issue 구조

```
HERO → STORY → DISCOVERY → EXPERIENCE → END
```

**WHY YOU 제거**: 기존의 `WHY YOU` 섹션은 제거한다. "왜 당신에게 추천하는지"를 별도의 섹션으로 설명하면 CRM이나 상품 추천 서비스처럼 느껴질 수 있기 때문이다. 대신 고객과 연결되는 맥락을 STORY 안에 자연스럽게 녹인다.

---

## 13. 전체 AI 로직

```
① Trigger
신호1 OR 신호2
        ↓
② [신호2인 경우만] 고객 프로필 갱신
Core5 + AI-discovered traits
        ↓
③ Rule-based Filter
Core5 연결 + 이전 Issue 중복 제거
        ↓
후보 A / B / C
        ↓
④ AI Meaning Discovery — Cross-Context Connection
Customer Basis + MCM Basis + Bridge
        ↓
⑤ AI Candidate Comparison
Connection Strength + Meaningful Extension + Editorial Value
        ↓
가장 의미 있는 후보 선택
        ↓
⑥ Editorial Generation
Headline + Caption
        ↓
⑦ Issue 발행
HERO → STORY → DISCOVERY → EXPERIENCE → END
```

---

## 14. Rule과 AI의 역할 구분

**Rule이 담당**: Trigger 감지 / Core 5 기반 후보 필터 / 이전 Issue 중복 제거 / 데이터 존재 여부 확인 / 명확한 조건 검증

**AI가 담당**: 고객의 반복적인 숨은 패턴 발견 / 고객과 MCM의 비정형 맥락 연결 / Cross-Context Connection 발견 / 단순 일치와 의미 있는 취향 확장 구분 / 여러 후보의 질적 비교 / 가장 의미 있는 Editorial 선택 / Editorial 문장 생성

**핵심**: Rule은 "무엇을 볼 것인가"를 통제하고, AI는 "그 안에서 어떤 의미가 있는가"를 판단한다.

---

## 15. 사용자 흐름

**Stage 0 — 데이터가 부족한 고객**
```
로그인 → 고객 데이터 부족 → 프로필 미확정 → Heritage Editorial 제공
→ 데이터 축적 → 최소 기준 충족 → Stage 1 전환
```
Stage 0에서는 개인화 매칭을 억지로 하지 않고 Heritage 중심 콘텐츠를 제공한다.

**Stage 1 / 2 — 프로필 확정 고객**

Day 0:
```
로그인 → 최소 데이터 기준 충족 → 고객 프로필 확정 → Phase 1 → Issue 01
```
Issue 01에서는 매칭 강도를 우선한다.

이후:
```
새로운 구매/관심 변화 OR 도시별 MCM 데이터 갱신 → Trigger
→ Rule Filter → AI Meaning Discovery → Editorial 생성 → Issue 발행
```

Issue 03부터 Phase 2로 진입하여 다양성을 더욱 중요하게 고려한다.
```
Phase 1 → 매칭강도 우선
Phase 2 → 다양성 → 최신성 → 매칭강도
```
단, 이는 AI의 점수 계산 공식이 아니라 후보 비교 시 참고하는 맥락적 우선순위다.

---

## 16. 2개월 하한선

고객과 의미 있는 새로운 연결이 장기간 발생하지 않는 경우를 대비한다.

```
마지막 Issue → 2개월 동안 새로운 Issue 없음 → 정반대매칭 시도
→ 가능한 경우 Editorial 발행 → 그래도 불가능 → Heritage Editorial 발행
```

이를 통해 개인화 콘텐츠가 장기간 중단되어 고객이 서비스를 잊는 것을 방지한다.

---

## 17. 서비스의 차별점

일반적인 AI 추천: "이 고객에게 어떤 상품을 추천할까?"
MY MCM: "이 고객에게 지금 어떤 MCM 이야기가 가장 의미 있을까?"

**① 단순 속성 매칭이 아니다** — Core 5 Rule을 통해 단순 후보를 좁힌 후 AI가 비정형 맥락까지 해석한다.

**② 기존 취향을 반복하지 않는다** — AI는 표면적 일치 vs 의미 있는 취향 확장을 구분한다.

**③ 여러 후보 중 하나의 이야기를 선택한다** — 단순히 "추천 가능"한 제품을 나열하는 것이 아니라, 이번 Issue에서 가장 가치 있는 하나의 이야기를 선택하는 Editorial 판단을 수행한다.

---

## 18. MVP 범위

MVP에서는 실제 MCM 내부 시스템과 실시간 연동하지 않고 구조화된 더미 데이터를 사용한다.

**MVP 데이터**: 고객 Purchase / 고객 Wishlist·Interest / Core 5가 포함된 MCM 제품 데이터 / 도시별 MCM 데이터 / City Signal / 과거 Issue 기록

**MVP AI**: AI-discovered traits / Cross-Context Connection / Meaningful Extension / Candidate Comparison / Editorial Generation

**MVP의 핵심 검증**: "고객과 가장 비슷한 제품을 추천하는 것이 아니라, 고객의 기존 취향에서 출발해 새로운 의미가 있는 MCM 이야기를 AI가 발견하고 선택할 수 있는가?"를 증명한다.

---

## 19. 최종 AI 로직 한 줄

고객의 구조화된 취향과 반복 패턴을 기반으로 후보를 Rule로 좁힌 뒤, AI가 고객의 기존 맥락과 새로운 MCM 맥락 사이의 의미 있는 연결과 취향 확장을 발견하고, 여러 후보 중 가장 Editorial 가치가 높은 하나의 이야기를 선택해 콘텐츠로 생성한다.

---

## 20. 최종 서비스 한 줄

MY MCM은 고객이 이미 좋아하는 것을 다시 추천하는 서비스가 아니라, 자신의 취향을 통해 아직 발견하지 못한 새로운 MCM의 의미와 이야기를 발견하게 하는 Personal Editorial Engine이다.

**전체 구조 최단 요약**
```
Global MCM Data + Personal Data
 ↓ Core5 / AI-discovered traits
 ↓ Rule Filter
 ↓ Cross-Context Connection
 ↓ Meaningful Extension
 ↓ Candidate Comparison
 ↓ Editorial Generation
 ↓ Personal MCM Issue
```

---

## 21. 전체 데이터 구조 (테이블 스키마)

Issue를 만들기 위해 AI가 실제로 참조하는 원본 데이터 구조는 아래와 같다. (Supabase 테이블 기준)

```
customers
├─ id
├─ name
├─ purchase_history   (jsonb: [{ product_id, purchased_at, city }])
├─ interest_history    (jsonb: [{ product_id, interested_at, type }])
├─ taste_profile        (jsonb: { color, silhouette, monogram, material, design_language, confidence })
├─ ai_discovered_traits (jsonb: [{ trait, reason, confidence, detected_at }])
└─ created_at

products
├─ id
├─ name
├─ city
├─ color / silhouette / monogram / material / design_language   (Core5 태그)
├─ image_id
└─ category (참고용, 필터링에 사용 안 함)

city_signals
├─ id
├─ city
├─ description   (서술형 맥락 — Cross-Context Connection의 mcm_basis 재료)
├─ related_product_ids (jsonb)
├─ detected_at
└─ processed (bool)

issues
├─ (21번 섹션의 Issue JSON 전체가 그대로 한 행으로 저장됨)
```

- `taste_profile`은 Core5 5개 축 + `confidence`(Stage0 여부 판단용)로 구성된다.
- `ai_discovered_traits`는 5번 섹션에서 정의한 구조 그대로 저장하며, 신호2 발생 시에만 덮어쓴다.
- `city_signals.description`이 Cross-Context Connection에서 AI가 `mcm_basis.source`로 인용하는 실제 원문이다.

---

## 22. Issue 데이터 구조 (실제 스키마)

발행되는 Issue 하나는 아래와 같은 구조화된 JSON으로 저장된다.

```json
{
  "issue_id": "issue_003",
  "customer_id": "cust_001",
  "issue_number": 3,
  "type": "discovery",
  "city": "Tokyo",
  "hero": {
    "headline": "A Different Kind of Quiet",
    "image_id": "tokyo_campaign_04"
  },
  "story": {
    "caption": "..."
  },
  "discovery": {
    "product_id": "MCM_023",
    "image_id": "product_023",
    "body": "..."
  },
  "experience": {
    "city": "Tokyo",
    "store": "MCM Tokyo"
  },
  "connection": {
    "customer_basis": { "text": "...", "source": "purchase_014" },
    "mcm_basis": { "text": "...", "source": "city_signal_009" },
    "bridge": "..."
  },
  "extension_type": "genuine_extension",
  "comparison_reason": "...",
  "axis_used": ["silhouette", "design_language"],
  "published_at": "2026-08-12T00:00:00Z"
}
```

- `connection`·`extension_type`·`comparison_reason`은 고객 화면에 노출되지 않는다. 백엔드 검증·로그·STORY 문장 생성 재료로만 쓰인다.
- `axis_used`는 기준2(이전 Issue 중복 판단)에서 "같은 도시 + 같은 각도" 여부를 다음 판단 때 조회하기 위해 저장해둔다.
- 고객 화면에는 `hero`·`story`·`discovery`·`experience` 값만 템플릿에 삽입되어 노출된다.

---

## 23. 에러 처리

AI 파이프라인 도중 실패가 발생했을 때의 기본 원칙: **애매하면 발행하지 않는다.** 잘못된 근거로 Issue를 발행하는 것이 Issue를 아예 발행하지 않는 것보다 리스크가 크다.

- **Claude API 호출 실패**(타임아웃/서버 오류) → Issue를 생성하지 않고 종료. 재시도는 1회만 자동으로 하고, 그래도 실패하면 로그만 남긴다.
- **Claude 응답 JSON 파싱 실패**(형식이 깨진 경우) → 그대로 저장하지 않고 1회 재요청. 재요청도 실패하면 Issue 생성하지 않음.
- **`source`가 존재하지 않는 데이터를 가리키는 경우**(예: 실제로 없는 `purchase_id`를 인용) → Cross-Context Connection이 근거 없는 연결을 만든 것으로 간주해 해당 후보를 탈락시킨다. 이는 AI 착시(할루시네이션) 방지의 마지막 안전장치다.
- **Supabase 호출 실패** → 사용자에게는 노출하지 않고, 다음 배치/트리거 때 재시도한다.

---

## 24. 실행 타이밍 — 언제 파이프라인이 실행되는가

```
신호2(고객 행동) 발생
  → 즉시 체크: 이 고객, 마지막 발행 후 한 달이 지났는가?
     → 안 지났으면 → AI 호출 자체를 하지 않음 (월 1회 상한선 우선 체크로 비용 절약)
     → 지났으면 → 프로필 갱신 → Rule Filter → AI Meaning Discovery 즉시 실행

신호1(도시 데이터 갱신) 발생
  → 실시간으로 고객 한 명씩 체크하지 않고 배치로 처리
     (예: 하루 1회, 그날 새로 갱신된 도시 데이터를 발행 대상 후보
     전체 고객 프로필과 한 번에 대조)
  → 이때도 월 1회 상한선을 통과한 고객만 AI 호출 대상으로 남김
```

- 데모에서는 이를 실시간으로 보여줘야 하므로, 시뮬레이션 버튼으로 "신호 발생 → 즉시 파이프라인 실행"하는 방식을 그대로 사용한다.
- 실제 서비스라면 신호2는 즉시 처리하고 신호1은 배치(예: 하루 1회)로 처리하는 것이 API 비용·서버 부하 면에서 현실적이다.

---

## 25. 매거진 자동 생성 메커니즘

AI가 실제로 만드는 것은 텍스트뿐이다(headline, caption, discovery body 등). 레이아웃·색상·폰트·이미지는 개발자가 미리 만들어둔 고정 템플릿이 담당한다.

```
AI가 생성한 Issue JSON
        ↓
DB(issues 테이블) 저장
        ↓
React 고정 Magazine Template이 issue_id로 데이터를 불러옴
        ↓
정해진 자리에 자동 삽입:
   HERO       → 도시명 + 미리 준비된 대표 이미지 + headline
   STORY      → caption
   DISCOVERY  → 기존 제품 이미지 + body
   EXPERIENCE → 도시/매장 정보(고정 텍스트)
   END        → "Your next MCM story" 고정 문구
        ↓
고객이 MY MCM 접속 시 완성된 페이지 노출
```

AI가 매번 레이아웃을 새로 창작하는 게 아니라, 블로그·뉴스레터처럼 "고정 템플릿 + 동적 텍스트" 방식이라 기술적 리스크가 없다. 이미지도 AI가 생성하지 않고 기존 제품·캠페인 이미지(`image_id`)를 그대로 사용한다.

---

## 26. 데모 시나리오

1. **취향 확인**: 데모 고객의 Core 5 프로필과 과거 Issue 01~02를 화면에 보여준다.
2. **신호1 시뮬레이션**: "Tokyo — New Season Drop" 버튼 클릭으로 도시 데이터 갱신을 발생시킨다.
3. **Rule Filter 통과 확인**: Core5 3개 이상 겹치는 후보들이 걸러지는 과정을 화면에 짧게 노출한다.
4. **REJECT 케이스 시연 ⭐**: 고객 기존 취향과 표면적으로만 일치하는 후보를 하나 포함시켜, AI가 "단순 일치"로 판단해 후보에서 제외되는 과정을 보여준다.
   > "이미 알고 있는 취향의 반복이라면, 저희는 오히려 발행하지 않습니다."
5. **PASS 케이스 시연**: 다른 후보는 Cross-Context Connection에서 구체적 근거(customer_basis/mcm_basis/bridge)를 찾아내고, Meaningful Extension에서 "취향 확장"으로 판단되는 과정을 보여준다.
6. **Candidate Comparison**: 후보가 여럿이면, AI가 서술형으로 후보들을 비교하는 과정(점수 계산이 아님)을 텍스트로 노출한다.
7. **Editorial Generation → 자동 발행**: "Generating your next MCM story..." 로딩 후, Issue 03이 MY MCM 피드에 자동으로 추가되는 것을 보여준다.
8. **Issue Detail 확인**: 완성된 매거진 페이지(HERO→STORY→DISCOVERY→EXPERIENCE→END)를 열람한다.

**핵심 전달 메시지**
> "가장 비슷한 상품을 추천하는 게 아니라, 이미 아는 취향의 반복이면 오히려 발행하지 않고, 진짜 새로운 발견이 있을 때만 AI가 직접 편집해서 매거진으로 발행합니다."

---

## 27. 개발 우선순위 (7일 기준)

1. **Day 1**: 더미 데이터(Core5 태그 포함) + 취향 프로필 계산 + Rule Filter(기준1·2)
2. **Day 2**: Cross-Context Connection — Claude API 연동, customer_basis/mcm_basis/bridge + source 출력 검증
3. **Day 3**: Meaningful Extension + Candidate Comparison(점수화 없이 서술형 비교) 프롬프트 완성
4. **Day 4**: Editorial Generation — Issue JSON 전체 생성 및 DB 저장
5. **Day 5**: 프론트엔드 — MY MCM 피드 + Issue Detail 고정 템플릿
6. **Day 6**: Stage0(헤리티지) + 2개월 하한선 + 정반대매칭 연결, 시뮬레이션 버튼 완성
7. **Day 7**: 통합 테스트(PASS/REJECT 케이스 검증) + 데모 데이터 고정 + 영상 촬영

---

## 28. MVP CUT — 시간이 부족할 때 자르는 순서

7일 안에 모든 걸 완성하지 못할 가능성을 대비해, 무엇을 반드시 지키고 무엇부터 덜어낼지 미리 등급을 매겨둔다. 막판에 급하게 판단하지 않기 위한 기준이다.

**반드시 있어야 함 — AI당위성의 핵심, 자를 수 없음**
- Cross-Context Connection (customer_basis/mcm_basis/bridge + source)
- Meaningful Extension 판단 (표면적 일치 vs 취향 확장 구분)
- Candidate Comparison (서술형 비교, 점수화 아님)
- Editorial Generation (headline/caption)
- MY MCM 피드 + Issue Detail 화면

**없어도 데모는 성립함 — 실시간 대신 시뮬레이션으로 대체**
- 신호1·2 실시간 감지 → 버튼 클릭으로 수동 트리거
- Phase1→Phase2 자동전환 → 데모 계정에 Issue 개수를 미리 세팅해서 즉시 시연
- 카카오톡/이메일 실제 발송 → 목업 화면만

**제일 먼저 잘라도 됨 — 로드맵으로만 언급**
1. 정반대매칭형 A/B/C 전체 로테이션 → A타입 예시 1개만
2. 2개월 하한선 + Heritage Editorial fallback 전체 흐름
3. Stage0(데이터 부족 고객) 처리 로직
4. 헤리티지 소재 라이브러리 전체 → 2~3개 예시만

트리밍은 아래에서 위로, 즉 4번부터 먼저 잘라낸다.