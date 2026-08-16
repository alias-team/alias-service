## 데모 시나리오 개념

#### 1. Internal — MCM 내부 시스템 (AI Engine)

#### 2. External — Customer Experience (고객 화면)

---

## 전체 100초 DEMO FLOW Conclusion

> "AI가 고객 취향을 발견하고, 그 취향을 기반으로 새로운 MCM을 발견한다"
> 

🦴  목적 : AI가 고객을 이해하고 → 새로운 MCM 변화를 발견하고 → 의미 있는 Editorial을 만든다 를 보여줘야 함

🦴 보여줘야 하는 핵심 : **Event → Matching → Gatekeeper → Magazine**

🦴 실제 운영에서는

- 신규 제품 등록 시 Multimodal AI가 제품 정보를 분석해 Product Profile을 생성함
- 고객 Profile과 지속적으로 비교함
- 데모에서는 이미 분석된 Product DB를 기반으로 Editorial 생성 과정을 보여줌
- In production, events are detected automatically from MCM product and business data.
This demo simulates the event trigger.

🦴 핵심 : **서비스처럼 보이게 포장해야 함** 

- 시작 : 이미 Profile 있는 고객
- 핵심 시연 : Event → AI 판단 → Magazine 생성
- 설명 : 고객 행동 변화 시 Profile 자동 업데이트
    - 주의 사항
        
        
        ### ⭕ 프로덕트 시연처럼 보이는 방식
        
        ```
        고객
        ↓
        AI가 취향 이해
        ↓
        MCM 새로운 변화 감지
        ↓
        AI가 의미 판단
        ↓
        개인 Editorial 도착
        ```
        
        ### ❌ 개발 데모처럼 보이는 방식
        
        ```
        Event Simulation 버튼
        ↓
        Candidate JSON
        ↓
        Gatekeeper
        ```
        

---

#### 0️⃣ 0~10초 : 문제 상황 + 고객 등장 (External 관점)

#### Persona 설정 및 확인

- 페르소나 설정
- 고객이 구매한 물건들 띄우기
- 첫 구매 이후 브랜드와 지속적으로 연결될 가능성이 높은 고객

MCM 내부 입장:

> "이 고객은 이미 MCM 제품을 구매했지만, 아직 브랜드와 지속적으로 연결될 가능성이 높은 고객이다. 다음 구매와 브랜드 경험을 위해 Personal Engagement를 제공한다." 라는 명분이 생김.
> 

> MCM은 고객의 구매와 관심 데이터를 기반으로 AI Taste Profile을 지속적으로 업데이트합니다.
> 

```
MCM Customer

Sarah (<- Persona)

Existing Customer

Purchase History:
- Visetos Backpack
- Leather Tote

Wishlist:
- Mini Bag
```

자막:

> "MCM already knows what customers bought.
> 
> 
> But can it understand what they truly like?"
> 

---

### 1️⃣ & 2️⃣ 10~25초 : AI가 고객 이해

- 이 서비스는 고객 취향을 AI가 이해하는걸 알려주는 자막을 작성
- Profile을 카드 형태로 UI  작성
    - 이미 구축하여 해당 profile의 data DB에 저장해놓은 상태이지만, 심사위원들이 이해하기 쉽게 프로필 띄우기
    - 내부에 해당 고객의 Profile이 이미 작성 되어있음을 알려주기

#### [ Customer Profile ]

```
AI Taste Discovery

Analyzing customer's MCM journey...

↓

Customer Taste Profile

Warm Neutral
Soft Structure
Leather Preference
Restrained Branding
```

---

### 3️⃣ 25~40초 : MCM 새로운 변화 발생

서비스 화면처럼 제공 해야 함

- 새로운 브랜드 변화가 발생했고, 이 변화가 누구에게 의미 있는지 찾는다는걸 보여주는 식으로 구성해야 함

```
MCM GLOBAL SIGNAL DETECTED

Tokyo New Season Collection Launch

Finding customers who may discover this story...

-

Product Profile Ready
```

데모 자막으로는 이런 식이면 충분:

> **A new MCM collection has been launched.The AI Editorial Engine analyzes whether this new change is meaningful for existing customers.**
> 

> Product profiles are generated when new items are registered.
> 

---

### 4️⃣ 40~65초 : AI Editor 판단 ⭐⭐⭐

- 여기가 핵심이며 우리의 차별점 전달. 그래서 제일 잘 만들어야 함 강조 빡 !!!!
- 하지만 이 사이에 이미 event 발생한 product들에 대한 profile이 이미 내부에서 db에 저장해놨다는걸 알려줘야함
- AI matching 및 Gatekeeper에 해당

```
Finding meaningful connection...
```

후보 분석:

Candidate A

Candidate B

```
Similar to customer's previous choices

REJECT

Reason:
Already known preference
```

```
Connected to customer's taste

+
New Tokyo expression

PASS
```

---

### 5️⃣  65~90초 : Personal Editorial 생성

- 서비스의 핵심은 "글 생성"이 아니라 "편집 판단이므로 이게 더 잘 드러나게 만들기

고객 화면:

```
MCM

Creating your personal MCM story...

Based on:
✓ Your previous choices
✓ Tokyo Collection
✓ AI discovered connection
```

클릭.

Editorial:

```
TOKYO

A Different Kind of Quiet

Your preference for
restrained leather expression
continues in a new way.
```

---

### 6️⃣ 90~100초 : 마무리

> 당신의 취향이, 당신만의 매거진이 됩니다
> 
- 생성된 Editorial은 MCM 공식 My Page 또는 이메일 링크를 통해 고객에게 제공되며, 향후 Issue Archive 형태로 축적 가능
- 고객에게 메일이 전달 되었다고 가정하여 해당 UI를 만들어 Personal Magazine을 열고 보는거까지 데모 진행

고객 화면:

```
Mail을 받고 생성된 매거진을 확인하는 화면
```

클릭하여 Editorial을 보여주며 영상을 마무리

```
TOKYO

A Different Kind of Quiet

Your preference for
restrained leather expression
continues in a new way.
```

---

그래서 영상에서는 **자동 감지처럼 표현하고**, 발표 자료/문서에서만:

> MVP에서는 Event Trigger를 Simulation 방식으로 구현했으며, 실제 서비스에서는 MCM Product / CRM Data Event 기반으로 자동 감지됩니다
> 

지금 요구사항이 "프로덕트 핵심 플로우"라는 점에서는 이게 더 맞음. 우리 서비스는 결국 고객이 받는 경험이 주인공이어야 함.

