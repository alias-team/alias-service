**“MCM Q&A 반영사항 / 기획 정합성 체크” 문서에 해당.**

# MCM Q&A 반영사항 및 기획 정합성

> MCM 공식 Q&A 내용을 기준으로 현재 `MCM Personal Editorial Engine`의 방향이 실제 브랜드 상황 및 해커톤 Scope와 맞는지 확인하고, 개발·발표 과정에서 주의해야 할 사항을 정리한다.

---

## 1. 결론

현재 기획은 MCM Q&A와 **전반적으로 높은 정합성**을 가진다.

특히 아래 4가지 방향은 Q&A와 직접적으로 맞는다.

1. **Standalone MVP → 향후 MCM API 연동**
2. **Synthetic / Simulated Data를 활용한 MVP 검증**
3. **CDP 기반은 존재하지만 글로벌 고객 데이터의 실질적 통합 활용에는 어려움이 존재**
4. **구매 이력 + 관심 행동 데이터를 활용한 개인화 가능성**

다만 실제 MCM 데이터를 현재 실시간으로 활용하는 것처럼 표현해서는 안 되며,
**ROI 및 브랜드 기여도에 대한 설명은 추가 보완이 필요하다.**

---

# 2. Standalone MVP + 향후 API 연동

## MCM Q&A

MCM의 실제 이커머스 시스템과 Live Data를 해커톤에서 직접 연결하는 것은 Scope상 어렵다.

대신,

> 개인정보가 오가지 않는 Standalone 서비스로 설계하고,
> 향후 특정 데이터가 API로 연결되는 것을 전제로 기획하는 방향

을 권장했다.

## 현재 기획

현재 MVP 구조는 이에 부합한다.

### Hackathon MVP

```text
Synthetic Customer Data
+
Purchase / Wishlist Data
+
Curated MCM Product Data
+
Simulated Global Signal
        ↓
Standalone AI Personal Editor
```

### Actual Service

```text
MCM POS / CRM / CDP / Product Data
        ↓
API
        ↓
AI Personal Editorial Engine
```

따라서 해커톤에서는 실제 MCM 시스템 연동을 시도하지 않고,
**Standalone 구조에서 핵심 AI Logic이 작동하는 것을 증명한다.**

---

# 3. Synthetic Data 사용

## MCM Q&A

합성(가상) 데이터를 활용하여 가설을 검증하는 방식도
**유효한 Prototype으로 인정 가능**하다고 답변했다.

## 현재 기획

MVP에서는 다음 데이터를 Synthetic / Simulated Data로 구성한다.

### Customer

```text
Demo Customer A

Purchase
- Product A
- Product B
- Product C

Wishlist / Interest
- Product D
- Product E
```

### Global Signal

```text
Tokyo
New Season Drop
```

### Past Issue

```text
ISSUE 01
ISSUE 02
```

이를 이용하여

```text
Taste Discovery
→ Meaning Discovery
→ Editorial Gate
→ PASS / REJECT
→ MY MCM Issue
```

전체 AI Logic을 검증한다.

### 주의

발표 및 데모에서는 반드시

- `Synthetic Customer Data`
- `Simulated Global Signal`

임을 명시한다.

실제 MCM 고객/판매 데이터를 사용하는 것처럼 표현하지 않는다.

---

# 4. Purchase / Wishlist 데이터 활용

## MCM Q&A

MCM은 이론적으로 고객의

- 구매 이력
- 장바구니
- Wishlist
- 기타 온라인 행동

등을 연결할 수 있다.

다만 고객 로그인 강제가 어렵고,
현재는 결제 정보·메일 주소 등을 통한 간접 Tracking도 활용하고 있다.

즉 **모든 고객 행동 데이터가 완벽하게 실시간 통합되어 있다고 볼 수는 없다.**

## 현재 기획

우리 서비스에서는 다음 데이터를 활용한다.

### Purchase = Taste Foundation

고객이 실제로 반복해서 선택한 미감.

### Wishlist / Interest = Taste Expansion

고객의 취향이 최근 어느 방향으로 확장되고 있는지를 보여주는 보조 Evidence.

```text
Purchase
+
Wishlist / Interest
        ↓
Visual Taste Discovery
```

이 구조 자체는 Q&A와 충돌하지 않는다.

### 주의해야 할 표현

#### 사용하지 않기

> MCM은 현재 모든 고객의 구매/Wishlist 데이터를 실시간으로 통합 관리하고 있다.

#### 권장 표현

> 실제 서비스에서는 MCM의 CDP/CRM 등에서 식별 가능한 고객의 구매 및 관심 데이터를 API로 제공받는 것을 전제로 한다.

---

# 5. CDP와 문제정의의 연결

## MCM Q&A

MCM은 CDP 도입을 통해 고객 데이터의 **이론적인 통합 관리 기반**은 마련했다.

하지만 실제로는

- 지역별 매장
- E-commerce
- Social Media
- Messenger
- 국가별 주요 Platform

등 고객 행동과 채널이 서로 달라
**실질적인 글로벌 통합 관리에는 어려움이 존재한다.**

## 현재 서비스와의 연결

따라서 문제를

> “MCM은 고객 데이터를 통합하지 못하고 있다.”

라고 정의하면 안 된다.

보다 정확한 문제 정의는 다음과 같다.

> **MCM은 CDP를 통해 고객 데이터를 통합 관리할 기반을 마련했지만, 글로벌 시장별 채널과 고객 행동이 달라 이를 일관된 개인화 경험으로 전환하는 데 현실적인 어려움이 존재한다.**

우리 서비스는 이 데이터를 단순 Recommendation Score로 사용하는 것이 아니라,

```text
Customer Data
        ↓
Visual Taste Interpretation
        ↓
Global MCM 변화와 연결
        ↓
Personal Editorial Experience
```

로 전환한다.

즉 핵심은 **데이터 통합 시스템 자체를 새로 만드는 것이 아니라, 존재하는 고객 데이터를 새로운 Personalization Experience로 활용하는 것**이다.

---

# 6. Global Signal 표현 주의

기존 기획에서 사용한

> “Global MCM Data에서 새로운 변화 발생”

이라는 표현은 실제 MCM 글로벌 판매 데이터를
MVP가 실시간으로 사용하는 것처럼 오해될 가능성이 있다.

따라서 MVP와 실제 서비스를 명확하게 구분한다.

## MVP

```text
Curated MCM Product Data
+
Simulated New Season / City Signal
```

예:

```text
Tokyo — New Season Drop
```

## Actual Service

```text
MCM Product / POS / CDP Data
        ↓
API
        ↓
Global Signal Detection
```

즉 MVP에서는 Signal 자체를 시뮬레이션하고,
**Signal 이후 AI가 어떤 판단을 하는지를 실제 구현한다.**

---

# 7. ROI / 브랜드 기여도 보완

## MCM Q&A

수익성 평가에서는 서비스 자체의 독립적인 수익 모델보다

> **MCM의 브랜드 매출과 고객 경험에 발생하는 정량적·정성적 기여**

를 중요하게 평가한다.

동시에

> **배보다 배꼽이 커지지 않는 ROI**

를 고려해야 한다.

## 현재 서비스의 ROI 논리

MY MCM은 새로운 대규모 데이터 수집 시스템이나 별도 Hardware를 요구하는 서비스가 아니다.

기존 MCM이 보유하고 있는

```text
Customer Data
+
Product Data
+
Product Images
+
Brand / Editorial Assets
```

를 활용한다.

여기에 AI Personal Editor를 결합한다.

```text
Existing MCM Assets
        +
Multimodal AI / LLM
        ↓
Personal Editorial
        ↓
Customer Engagement
        ↓
MY MCM Revisit
        ↓
Brand / City / Store Discovery
        ↓
Retention / Repeat Purchase / LTV 기여
```

따라서 핵심 ROI 논리는

> **기존 데이터와 브랜드 콘텐츠 자산을 활용하여 비교적 낮은 추가 운영 비용으로 기존 고객과의 지속적인 접점을 만드는 것**

이다.

---

# 8. 향후 측정 KPI

MVP에서 실제 성과를 증명하는 것은 어렵기 때문에,
실서비스 도입 이후 아래 지표를 통해 효과를 검증할 수 있도록 설계한다.

## Experience KPI

- Issue Open Rate
- Issue Read Completion Rate
- MY MCM Revisit Rate
- Issue Save / Share
- Store / City Discovery Interaction

## Business KPI

- MY MCM 이용 고객 Retention
- Repeat Purchase Rate
- Issue 노출군 vs 비노출군 재방문율
- Issue 이후 매장 방문 / 구매 전환
- Customer LTV 변화

※ 구체적인 매출 상승률이나 추가 매출 금액은 실제 MCM 데이터가 없으므로 MVP 단계에서는 임의로 확정하지 않는다.

---

# 9. Persona Bot 관련

MCM Q&A에서 언급한 `Persona Bot`은 필수 요구사항이 아니라
**Synthetic Data와 AI를 활용할 수 있는 하나의 예시**로 이해한다.

따라서 현재 서비스를 Persona Bot 형태로 변경할 필요는 없다.

현재 MVP 역시 Synthetic Customer를 이용하여

```text
Customer Behavior
        ↓
Visual Taste Discovery
        ↓
Meaning Discovery
        ↓
Editorial Decision
```

을 검증하기 때문에 Q&A에서 허용한 Prototype 방향과 부합한다.

---

# 10. 개발 및 발표 시 반드시 지킬 원칙

### ① 실제 MCM Live Data를 사용한다고 주장하지 않는다.

MVP:

> Synthetic Customer + Curated Product Data + Simulated Signal

Actual Service:

> MCM CDP / CRM / POS / Product Data API 연동

으로 구분한다.

### ② MCM의 데이터 통합이 전혀 안 되어 있다고 주장하지 않는다.

CDP 기반은 존재하지만,
**글로벌 시장별 고객 행동과 채널 차이 때문에 실질적인 활용에 어려움이 있다**고 정의한다.

### ③ Purchase / Wishlist가 모든 고객에게 완벽하게 존재한다고 가정하지 않는다.

식별 가능한 고객 데이터가 제공되는 상황을 전제로 한다.

### ④ Synthetic Data임을 명시한다.

Prototype 검증용 가상 데이터임을 Demo/PPT에서 표시한다.

### ⑤ ROI는 근거 없는 매출 숫자로 만들지 않는다.

`월 추가 매출 1,900만원` 등의 임의 추정값보다

**기존 자산 활용 → 낮은 추가 비용 → Engagement → Retention/LTV**

구조와 측정 KPI를 제시한다.

---

# 11. 최종 정리

현재 `MCM Personal Editorial Engine`은 MCM Q&A와 전반적으로 높은 정합성을 가진다.

특히:

```text
Standalone MVP
        ↓
Synthetic Data로 AI Logic 검증
        ↓
향후 MCM API 연결
        ↓
기존 Customer / Product Data 활용
        ↓
Personal Editorial Experience
        ↓
Engagement / Retention / LTV 기여
```

라는 구조가 MCM이 제시한 해커톤 Scope와 잘 맞는다.

따라서 현재 서비스 방향을 변경할 필요는 없으며,
개발 및 발표에서는 다음 세 가지를 명확하게 구분한다.

**1. 지금 실제로 구현하는 것**
> Standalone AI Personal Editorial MVP

**2. 지금 가정하는 데이터**
> Synthetic Customer / Curated Product / Simulated Global Signal

**3. 실제 도입 시 연결되는 것**
> MCM CDP / CRM / POS / Product Data API

핵심은 새로운 데이터 시스템을 만드는 것이 아니라,

> **MCM이 이미 가지고 있는 고객·상품·브랜드 자산을 AI가 해석하여, 기존 고객에게 지속적인 개인화 브랜드 경험으로 돌려주는 것**

이다.
```
