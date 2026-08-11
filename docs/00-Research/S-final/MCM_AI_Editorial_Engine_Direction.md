# MCM Personal Edit — AI Editorial Engine 방향 정리

## 1. 초기 아이디어 방향

### 목표

단순히 MCM 제품을 추천하는 서비스가 아니라,

**고객이 구매한 MCM 제품을 기반으로 브랜드와 다시 연결되고, 자연스럽게 컬렉션 확장으로 이어지는 경험 제공**

을 목표로 함.

기존 럭셔리 구매 흐름:

```
제품 구매
↓
사용
↓
브랜드와의 접점 종료
```

문제:

첫 구매 이후 브랜드와 다시 만나는 계기가 부족함.

---

### 초기 아이디어

고객이 구매한 제품을 기반으로:

- 기존 제품
- 현재 시즌 제품
- 관심 제품

을 연결해 개인화된 매거진 제공.

예:

고객:

```
구매:
Stark Backpack

관심:
Silver Charm
```

↓

AI:

"당신이 가진 Stark Backpack은 이번 시즌 이렇게 확장됩니다."

↓

Personal Magazine 제공

---

# 2. 기존 추천 시스템과의 차별화 고민

초기 방향에서 발생한 문제:

단순히:

```
구매 제품
+
신제품

↓

추천
```

이면 일반적인 CRM 추천과 차이가 없음.

예:

"가방 샀으니 이 참 어울립니다"

는 기존 커머스 추천과 동일.

따라서 AI 역할을 재정의해야 함.

---

# 3. Purchase History + Wishlist 기반 Personalization 방향

## Input Data

### 1) Purchase History

가장 중요한 데이터.

고객이 실제 구매한 MCM 제품.

의미:

> 고객이 과거에 선택한 MCM 경험


예:

```
2022 SS Stark Backpack
Black / Monogram

2024 FW Wallet
Leather
```

이를 통해:

"이 고객이 어떤 MCM 요소를 지속적으로 선택했는가"

파악.

---

### 2) Wishlist / Cart

두 번째 데이터.

단순 구매 추천 데이터가 아님.

의미:

> 고객이 앞으로 관심을 가지고 있는 MCM 방향


예:

```
Wishlist:
Silver Charm
```

해석:

❌ "Silver Charm 구매하세요"

⭕ "현재 고객이 가진 제품에서 Personalization 요소로 확장하려는 관심"

---

# 4. Mood Engine 고민

초기 생각:

Purchase History + Wishlist

↓

Customer Mood 생성

예:

- Heritage Traveler
- Modern Collector
- Personalized Traveler


하지만 문제 발생.

## 문제

Mood는 고객을 특정 유형으로 분류하는 것처럼 보임.

예:

"당신은 Personalized Traveler입니다."

↓

위험:

- MBTI식 고객 분류처럼 보임
- 실제 셀러 경험과 다름
- 잘못 판단했을 때 브랜드가 고객을 규정하는 느낌

---

# 5. 방향 전환: Mood → Reading

## 핵심 변경

고객을 분석해서 라벨링하는 것이 아니라,

**고객이 가진 MCM 제품을 브랜드 관점에서 해석한다.**

---

기존:

```
당신은 이런 고객입니다.
```

↓

변경:

```
당신이 가진 MCM 제품은 이번 시즌 이렇게 읽힙니다.
```

---

## Example

기존:

❌

"당신은 Heritage Traveler입니다."

---

변경:

⭕


"당신의 Stark Backpack은 이번 시즌 Personal Detail을 통해 새로운 방식으로 확장됩니다."

---

차이:

| Mood | Reading |
|---|---|
| 고객 중심 | 제품 중심 |
| 고객 정체성 정의 | 브랜드 관점 해석 |
| 틀리면 거부감 | 브랜드 해석으로 받아들임 |

---

# 6. 최종 방향: AI Brand Editorial Engine

## 핵심 정의

AI가 고객을 분류하거나 상품을 추천하는 것이 아니라,

> 고객이 가진 MCM 제품을 브랜드 세계관 안에서 다시 해석하고, 새로운 시즌과 연결하는 Editorial Engine


---

## AI가 하는 일

### ❌ 하지 않는 것

- 상품 추천
- 고객 유형 분류
- 구매 유도 문구 생성


---

### ⭕ 하는 것

"이번 시즌 MCM 안에서 이 고객의 제품을 어떤 관점으로 보여줄 것인가?"

판단.

---

# 7. AI Engine 구조

## Layer 1. Data / Rule Layer

AI 필요 X

담당:

- 제품 정보 조회
- 제품 속성
- 시즌 컬렉션 정보
- 이전 Editorial 기록

---

## Layer 2. AI Reasoning Layer

핵심 AI 영역.

판단:

### 1) 어떤 Product Reading을 열 것인가?

예:

Stark Backpack

가능한 해석:

- Travel Heritage
- Personalization
- Everyday Companion


중 어떤 관점으로 이번 시즌 연결할지 판단.

---

### 2) 연결점이 없을 때 어떻게 할 것인가?

중요:

추천 엔진:

"비슷한 제품 추천"

하지만 Editorial Engine:

"이번 시즌 새로운 해석이 필요하지 않음"

이라는 판단 가능.

---

### 3) 이전 Reading과 중복되지 않는 새로운 관점 선택

예:

고객 A

1회차:
Travel Reading

다음 시즌:

Heritage Reading


고객 B

1회차:
Heritage Reading

다음 시즌:

Personalization Reading


같은 제품이어도 경험이 달라짐.

---

## Layer 3. LLM Generation Layer

LLM 역할:

판단 X

표현 O


이미 선택된 Reading을:

- 매거진 문구
- Editorial Content
- 브랜드 스토리

형태로 생성.

---

# 8. 최종 서비스 Flow

```
Customer Data

(Purchase History)
+
(Wishlist / Cart)

↓

MCM Product Understanding

↓

AI Editorial Reasoning

"이번 시즌 이 제품을 어떻게 읽을 것인가"

↓

New Season Collection 연결

↓

Personal MCM Edit 생성
```

---

# 9. 결과물 예시

## MY MCM EDIT

### Chapter 01

## YOUR PIECE

당신이 선택한 MCM

```
Stark Backpack
```

---

### Chapter 02

## THIS SEASON'S READING

AI 해석:

"이번 시즌 MCM은 당신의 아이코닉 백을 Personal Expression의 관점에서 새롭게 확장합니다."

---

### Chapter 03

## NEW SEASON CONNECTION

현재 시즌 제품 중:

기존 제품의 새로운 해석과 연결되는 제품 소개

---

# 10. 기존 CRM 추천과의 차이

## CRM Recommendation

```
제품 구매
↓
관련 제품 추천
↓
구매 유도
```

---

## MCM AI Editorial

```
내가 가진 제품
↓
브랜드 관점 해석
↓
새로운 의미 부여
↓
시즌 경험 확장
```

---

핵심 차이:

> 추천이 아니라 브랜드가 고객의 기존 선택을 다시 해석해주는 경험

그래서 내가 갖고 있는 제품을 새 시즌이 뉴드랍 될 때, 그거랑 연관되서 매거진에 싣고 싶음

---

# 11. 현재 남은 고민

## 1) MCM만의 차별성

필요한 것:

MCM 제품이 가진 브랜드 언어 정의.

예:

- Heritage
- Mobility
- Personalization
- Craftsmanship

등.

단,

고객을 분류하는 기준이 아니라

제품을 해석하는 기준으로 사용.

---

## 2) MVP 구현 방식

실제 MCM 데이터 없음.

따라서:

Dummy Data 기반.

필요 데이터:

### Product Database

```
제품명
카테고리
시즌
컬러
소재
브랜드 키워드
제품 Story
```

### Customer Database

```
구매 제품
Wishlist
이전 Editorial 기록
```

---

# 최종 한 줄 정의

> MCM Personal Edit는 AI가 고객을 분석해 상품을 추천하는 서비스가 아니라, 고객이 가진 MCM 제품을 브랜드의 시선으로 재해석하고 시즌마다 새로운 의미를 부여하는 AI Editorial Experience이다.

---
