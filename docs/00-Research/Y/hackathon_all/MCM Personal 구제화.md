1. 서비스 한 줄 정의
고객의 개인 취향과 MCM의 글로벌 데이터를 AI가 연결해, 고객에게만 의미 있는 새로운 MCM Editorial을 발행하고 새로운 도시와 브랜드 경험을 발견하게 하는 Personal Magazine.

핵심 경험

```
Global MCM 변화
        +
고객의 개인 취향/행동
        ↓
AI가 의미 있는 연결 발견
        ↓
Personal Editorial Issue
        ↓
고객이 새로운 MCM 도시/매장 발견
```

2. 문제 정의
글로벌 럭셔리 브랜드는 매년 많은 고객과 다양한 시장을 상대하기 때문에 모든 고객에게 지속적인 초개인화 케어를 제공하기 어렵다.
현재의 개인화는 주로
구매 이력 → 상품 추천
에 머무르기 쉽다.
하지만 럭셔리 고객에게 필요한 것은 단순한 상품 추천이 아니라,
“내 취향을 바탕으로 브랜드의 새로운 세계를 발견하는 경험”
이다.

(출처: Salesforce State of the Connected Customer — 소비자 52%는 브랜드가 항상 개인화된 제안을 해주길 기대하지만, 실제로 자신의 니즈를 이해받고 있다고 느끼는 소비자는 34%에 불과)

3. 타깃
Global Digital Nomad / Gen MZ

* 여러 도시를 이동하며 생활/여행
* 글로벌 MCM 매장을 경험할 가능성이 높음
* 단순 구매보다 브랜드 경험과 발견에 관심
* 기존 고객의 지속적인 Engagement / LTV 향상

4. 핵심 AI Logic ⭐
핵심 질문
“MCM의 새로운 변화 중, 지금 이 고객에게 ‘새로운 발견’이 될 만한 것은 무엇인가?”
AI가 모든 제품을 추천하는 것이 아니라,
Global 변화와 Personal 취향 사이에 새로운 의미가 만들어졌을 때만 Editorial을 발행한다.

Signal 1 — Global Signal
MCM 글로벌 데이터에서 새로운 변화 발생.
예:
Tokyo에서 새로운 Mini Bag 컬렉션이 주목받기 시작

```
도시
제품
컬러
실루엣
모노그램 밀도
트렌드
```

Signal 2 — Personal Signal
고객의 새로운 행동/취향 변화.
예:
고객이 최근 Brown / Minimal Silhouette 제품을 구매
또는
특정 제품에 관심 표시
↓
고객 Taste Profile 업데이트

```
Color
Silhouette
Monogram Density
```

Signal 1과 Signal 2는 순서가 정해져 있지 않음 — 둘 중 하나만 발생해도 트리거된다.

5. Signal 3 — AI Meaning Match ⭐⭐⭐
Signal 1 또는 Signal 2가 발생했다고 바로 발행하지 않는다.
Global 후보와 고객 취향을 먼저 룰 기반으로 필터링한다.

기준 1 — 취향 연결
고객이 좋아하는 취향 축과 후보가 연결되는가?

기준 2 — 중복 방지
고객에게 이미 보여준 이야기와 동일하지 않은가?
↓
후보가 남으면

기준 3 — AI 판단
Claude에게:
Global Signal + 고객 Taste Profile + 최근 Issue
를 전달.
Claude가 판단:
“이 연결이 고객에게 새로운 의미 있는 발견인가?”

YES

```
의미 있는 이유
+
Editorial Headline
+
Editorial Caption
```

생성
→ Issue 발행

NO
→ 발행하지 않음

6. Issue 발행 보조 로직
Phase
Issue가 쌓일수록 콘텐츠의 방향을 변화시킨다.

```
Phase 1
→ 취향과 직접 연결되는 Discovery

Phase 2
→ 더 다양한 새로운 발견
```

Stage와 Phase 관계
Stage는 고객의 데이터 성숙도, Phase는 그 안에서 콘텐츠를 고르는 우선순위 규칙 — 둘이 이렇게 이어짐

```
Stage 0 (프로필 미확정)
→ 취향 데이터 부족한 신규 고객
→ 개인화 Issue 대신 MCM Heritage Editorial 제공
→ 최소 데이터 기준 통과 시 자동으로 Stage 1 전환

Stage 1 = Phase 1 (Issue 01~02)
→ 비교할 지난 Issue가 부족한 시기
→ 매칭강도 우선 (신뢰 구축)

Stage 2 = Phase 2 (Issue 03~)
→ 비교 가능한 지난 Issue 충분
→ 다양성 → 최신성 → 매칭강도 순 우선순위
```

발행 빈도

* 너무 자주 발행하지 않음
* 월 1회 상한선
* 일정 기간 새로운 의미가 없으면 정반대 취향을 활용한 Discovery 시도

※ 세부 로직은 구현 단계에서 단계적으로 적용.

7. User Flow

```
① Signal 1(Global 변화) 또는 Signal 2(Personal 변화) 발생
     — 둘 중 하나만 있어도 트리거
                ↓
② 발생한 신호를 Global 데이터 전체 및
   고객 Taste Profile과 대조
                ↓
③ 기준 1·2 룰 필터
                ↓
④ Claude가 기준 3 판단
                ↓
       ┌──────────────┐
       │ 의미 있음?   │
       └──────────────┘
          ↓ YES    ↓ NO
          ↓        → 발행하지 않음
⑤ Personal Editorial 생성
                ↓
⑥ MY MCM에 Issue 발행
                ↓
⑦ 고객이 Editorial을 읽음
                ↓
⑧ 새로운 도시 / MCM 매장 발견
                ↓
⑨ 다음 MCM 경험으로 연결
```

핵심 사용자 행동
“어? 내가 좋아하는 스타일이 다른 도시에서는 이렇게 나오는구나.”
→ “다음에 그 도시/매장에 가봐야겠다.”

8. Editorial UI 방향
쇼핑몰이 아닌 Digital Luxury Magazine

* Editorial 중심
* 영어 기본
* 큰 이미지
* 여백 중심
* 타이포그래피 중심
* 제품 스펙을 직접 나열하지 않음
* AI의 판단을 자연스러운 Editorial 문장으로 표현
* 직접적인 구매 유도 CTA 없음 (매장/도시 정보는 구매 링크가 아닌 라벨 형태로만 제공)