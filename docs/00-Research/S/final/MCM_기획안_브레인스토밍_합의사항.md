# MCM 기획안 브레인스토밍 합의사항

> 기존 기획안에서 PRD 작성 전 구체화가 필요하거나 해석이 달라질 수 있는 부분을 정리한 문서입니다.  
> 아래 내용을 함께 확인하고 합의한 뒤 최종 기획안 및 PRD에 반영합니다.

---

## 1. 월간 Magazine 발행 방식

### 논의점
Trigger가 발생할 때마다 Issue를 즉시 발행하면 고객에게 알림이 지나치게 자주 전달될 수 있음.  
반대로 월 1회만 하나의 Story를 선택하면 그달 발생한 의미 있는 발견들을 놓칠 수 있음.

### 해결방안
- Trigger 발생 시마다 기존 AI Pipeline을 실행한다.
- Gatekeeper를 통과한 결과는 즉시 발행하지 않고 **Editorial Story 형태로 해당 월에 누적**한다.
- 누적된 PASS Story들을 **월 1회 하나의 `MY MCM Monthly Magazine`으로 묶어 발행**한다.
- PASS Story가 없는 달은 Magazine을 발행하지 않는다.

즉, **월 1회는 의무 발행 주기가 아니라 최대 발행 빈도**이며, 기존의 "할 말이 있을 때만 발행한다"는 원칙을 유지한다.

---

## 2. Customer Taste Profile 생성 최소 조건

### 논의점
구매 제품 하나만으로 고객의 전체 취향을 정의하면 단일 선택을 과잉 일반화할 수 있음.  
반대로 Wishlist/장바구니만으로는 실제 선택 취향을 충분히 설명하기 어려움.

### 해결방안
MVP에서는 다음을 최소 조건으로 설정한다.

- **Purchase ≥ 1개**
- **Wishlist / 장바구니 ≥ 1개**

Purchase는 실제 선택을 보여주는 핵심 Evidence, Wishlist/장바구니는 현재 관심 및 취향 확장 방향을 보여주는 보조 Evidence로 활용한다.

조건 미달 시 `profile_status = insufficient`로 처리한다.

향후 상용화 시에는 **MCM이 구축하는 CRM의 구매·관심 행동 데이터를 동일한 Taste Engine의 입력 데이터로 연동**한다.

AI-discovered Trait는 별도의 조건으로 **최소 2개 이상의 Evidence Product에서 반복 패턴이 발견될 때만 생성**한다.

---

## 3. Personal Signal 발생 시 Taste Profile 갱신

### 논의점
신규 구매, Wishlist/장바구니 변화 등 Personal Signal이 발생했을 때 Taste Profile을 언제 갱신할지 기준이 필요함.

### 해결방안
MVP에서는 **Personal Signal이 발생할 때마다 Taste Profile을 즉시 갱신**한다.

- 기존 제품의 이미지 분석 결과는 재사용
- 새롭게 추가된 제품만 이미지 분석
- 삭제된 제품은 Evidence에서 제외
- 이후 전체 Evidence 기준으로 Core 5와 AI-discovered Traits 재계산

상용화 이후 고객 및 행동 데이터 규모가 커질 경우에는 **배치 또는 조건부 갱신 방식으로 최적화**할 수 있다.

---

## 4. AI-discovered Traits 생성 방식

### 논의점
AI-discovered Traits의 최대 개수를 고정할 경우 실제로 존재하는 유의미한 취향 패턴을 임의로 제거할 가능성이 있음.

### 해결방안
AI-discovered Traits에는 **고정된 최대 개수 제한을 두지 않는다.**

대신 기존 생성 조건을 충족한 Trait만 생성한다.

- 최소 2개 이상의 Evidence Product에서 반복
- 단일 제품의 특징은 제외
- Core 5만으로 충분히 설명되는 특징은 제외
- Counter Evidence 검토
- 실제 Product Evidence에 근거

유효한 Trait가 없다면 **0개도 정상적인 결과로 허용**한다.

Core 5는 고객 취향의 기본적인 시각 속성을 구조화하는 공통 기준으로 사용하고, AI-discovered Traits는 Core 5로 설명하기 어려운 복합적인 취향 패턴을 보완한다.

---

## 5. Candidate Retrieval 기준

### 논의점
Core 5 일치만 지나치게 강하게 요구하면 AI-discovered Trait와 의미 있게 연결되는 새로운 후보를 놓칠 수 있음.

### 해결방안

**기본 후보**
- Core 5 중 **2개 이상 연결**

**확장 후보**
- Core 5 중 **1개 이상 연결**
- 동시에 AI-discovered Trait와 명확한 관련성이 존재

Core 5 연결이 0개인 후보는 Retrieval 단계에서 제외한다.

이후 실제로 의미 있는 연결인지는 CONNECT 및 Gatekeeper 단계에서 판단한다.

---

## 6. Meaningful Extension 판단 기준

### 논의점
취향 연결, 새로움, MCM Context를 모두 강한 하드필터로 설정하면 후보가 지나치게 많이 탈락해 발행 가능성이 낮아질 수 있음.

### 해결방안
고객의 기존 취향과 연결되는 **Anchor는 필수 조건**으로 설정한다.

그 위에서 AI가 다음 요소를 종합적으로 해석한다.

- 기존 선택과의 차이 및 새로움(Newness)
- 현재 MCM의 Product / Collection / City / Brand Context

Newness와 MCM Context는 고정된 점수나 하드필터로 사용하지 않고, AI가 **단순 반복이 아닌 의미 있는 취향 확장인지 종합적으로 판단**한다.

---

## 7. Past Issue 중복 처리

### 논의점
동일한 취향 포인트가 과거 Story에서 사용됐다는 이유만으로 새로운 후보까지 제외하면 고객의 핵심 취향과 연결되는 새로운 제품을 발견할 기회를 제한할 수 있음.

### 해결방안
기본적으로 **이미 발행한 동일 제품의 반복 발행만 제외**한다.

동일하거나 유사한 취향 포인트가 과거에 등장했더라도 **새로운 제품이라면 새로운 Story 후보로 허용**한다.

다만 새로운 제품·도시·컬렉션 등 현재 Context를 반영해 카피와 Editorial Story를 새롭게 구성하여 동일 콘텐츠처럼 느껴지지 않도록 한다.

---

## 8. Editorial Angle 생성

### 논의점
같은 Connection에 대해 표현만 조금씩 바꾼 A/B/C를 생성하면 여러 Angle을 만드는 의미가 없음.

### 해결방안
AI Editor는 동일 Connection을 기반으로 **서로 다른 Editorial 관점의 Angle을 최대 3개 생성**한다.

활용 가능한 관점 예시:

- Product 중심
- City / Brand Context 중심
- Customer Taste Extension 중심

실제 Evidence가 없는 관점은 억지로 생성하지 않는다.

따라서 항상 3개를 채우는 것이 아니라 **1~3개의 유효한 Angle을 생성**하고 Gatekeeper가 이를 비교한다.

---

## 9. Gatekeeper 판단 방식

### 논의점
최종 PASS/NONE 판단을 전적으로 AI에게 맡기면 판단 기준이 불명확하고 결과가 임의적으로 보일 수 있음.

### 해결방안
Gatekeeper 판단 전 **Rule Validation Layer**를 둔다.

Rule에서 객관적으로 검증 가능한 항목을 먼저 확인한다.

- Customer Evidence 존재 여부
- MCM Source 유효성
- 동일 제품 중복 여부
- 고객 취향과 연결되는 Anchor 존재 여부

필수조건을 통과한 Editorial Angle에 대해서만 **Independent AI Gatekeeper가 최종 편집 판단**을 수행한다.

AI는 Personal Relevance, Discovery Value, Editorial Quality 등을 종합적으로 고려하여 가장 발행 가치가 높은 Angle 하나를 선택한다.

적합한 Angle이 없다면 `NONE`을 반환한다.

즉,

**객관적으로 검증 가능한 조건 → Rule**  
**정답을 규칙으로 정의하기 어려운 편집적 가치 → AI**

로 역할을 분리한다.

---

## 10. Monthly Magazine 내 Story 개수

### 논의점
한 달 동안 PASS Story가 많이 발생할 경우 모두 Magazine에 포함할지 별도 선별할지 기준이 필요함.

### 해결방안

**MVP**
- 해당 월에 PASS된 Story를 모두 Monthly Magazine에 수록
- 별도의 최대 Story 개수 제한은 두지 않음

**상용화**
- PASS Story가 많아질 경우 발행 시점에 중복·다양성·편집적 가치를 고려해 최종 수록 Story를 선별하는 **Monthly Curation Layer** 추가 가능

MVP 단계에서는 불필요한 기능 확장을 피한다.

---

## 11. PASS Story가 없는 달

해당 월에 Gatekeeper를 통과한 Story가 **0개라면 Monthly Magazine을 발행하지 않는다.**

따라서 MY MCM은 단순한 정기 Newsletter가 아니라 **발행할 가치가 있는 발견이 존재할 때만 전달되는 Personal Editorial**이라는 원칙을 유지한다.

---

## 12. Monthly Magazine 생성 방식

### 논의점
PASS Story를 단순히 나열할지, AI가 하나의 Magazine으로 다시 편집할지 구조를 명확히 할 필요가 있음.

### 해결방안
월간 발행 시점에 **AI Monthly Magazine Generator가 해당 월의 PASS Story들을 하나의 Editorial Issue로 편집**한다.

AI 담당 영역:
- Monthly Issue Title
- Intro
- Story 순서
- Story별 최종 Headline / Copy
- 전체 Editorial Flow

UI는 AI가 매번 새롭게 디자인하지 않고 **사전에 정의된 Magazine Template을 사용해 렌더링**한다.

즉,

**AI = 콘텐츠 및 Editorial 편집**  
**Template = UI / Layout**

구조로 분리한다.

### MVP Demo Flow

`Trigger 발생`
→ `Candidate Retrieval`
→ `CONNECT`
→ `Editor`
→ `Rule Validation`
→ `Gatekeeper PASS / NONE`
→ `PASS Story 누적`
→ `Monthly Magazine Generator`
→ `MY MCM Monthly Magazine 발행`

데모에서는 PASS와 REJECT가 실제로 발생하고, 최종적으로 여러 PASS Story가 하나의 개인화 Magazine으로 완성되는 과정까지 보여주는 것을 목표로 한다.

---

## 최종 방향

이번 브레인스토밍에서는 기존 기획안의 핵심 구조를 변경하기보다, PRD 작성 시 해석이 달라질 수 있는 부분을 구체화했다.

핵심 방향은 다음과 같다.

**Personal Data → Taste Profile → Global Signal → Candidate Retrieval → AI Connection → Editorial Judgment → PASS Story → Monthly Personal Magazine**

위 내용을 최종 기획안에 반영한 뒤 이를 기준으로 PRD를 작성한다.