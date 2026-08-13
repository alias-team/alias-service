# 100초 데모 시나리오 (최종)

> 2026-08-13 확정. Challenge 3 기준. 오프라인 접점 요소는 스코프 아님(Challenge 02 관련 우려는 무관하여 폐기).

## 0. 목표 / 원칙

**목표**: 고객의 새로운 Personal Signal을 시작으로 Vision을 통해 취향 Profile을 갱신하고, MCM의 Global Context와 연결해 후보를 선별한 뒤 Editorial Story를 축적하고 Monthly Magazine으로 발행하는 전체 핵심 플로우를 100초 안에 보여준다.

**데모 원칙**: 실제 Signal 자동 감지나 실제 이메일 발송은 구현하지 않고, 데모용 버튼과 사전 세팅된 데이터를 통해 핵심 흐름을 시뮬레이션한다.

## 1. 핵심 플로우

메일 도착 → MY MCM → Personal Signal 버튼 → Vision → Taste Profile → Global Context → Retrieval → Rule Validation → AI Gatekeeper → Editorial Story → Issue 축적 → Monthly Magazine

## 2. 100초 전체 시나리오

| 시간 | 화면 / 액션 | 시스템 동작 | 보여줄 핵심 |
| --- | --- | --- | --- |
| 0–7s | 📩 메일함에 `Your August MCM Magazine` 도착 → 클릭 | 완성된 Magazine 목업 열기 | 최종 결과물을 먼저 보여줌 |
| 7–15s | MY MCM 진입 → 기존 Issue 01/02가 쌓여 있는 피드 확인 | 기존 Issue 데이터는 미리 세팅 | 일회성 추천이 아닌 지속되는 서비스 |
| 15–22s | `[SIMULATE PERSONAL SIGNAL]` 버튼 클릭 | Wishlist/장바구니 추가 Signal 발생 | 데모에서 고객 행동을 시뮬레이션 |
| 22–32s | 추가된 제품 이미지 → Vision Analysis → Taste Profile 변화 | Vision 결과를 기반으로 Core4/Trait 갱신 | 고객의 행동을 제품 취향으로 구조화 |
| 32–40s | Tokyo/MCM Global Context 등장 | Personal Profile과 Global Context 결합 | Personal + Global 연결 |
| 40–48s | Core4 Retrieval → 후보 3개 등장 | Core4 기반 후보 생성 | Rule 기반 후보 탐색 |
| 48–63s | AI Processing → Rule Validation → AI Gatekeeper → 후보 3개 판정 | PASS / REJECT | 취향이 맞는다고 모두 발행하지 않음 |
| 63–68s | PASS 후보 → Editorial Story 생성 | PASS Story 생성 | 상품 추천 → Editorial |
| 68–78s | 기존 Issue들과 함께 새로운 Story가 누적되는 모습 | Gatekeeper PASS Story 저장 | Story를 쌓아 월간 Magazine으로 발행 |
| 78–91s | AI Editor → Monthly Magazine 생성 | PASS Story들을 하나의 Magazine으로 편집 | 최종 콘텐츠 생성 |
| 91–100s | 완성된 Magazine → 메일 화면 → `Your August MCM Magazine` 확인 | 최종 결과 표시 | 전체 Loop 완성 |

## 3. 구간별 상세

### 3.1 0–7s — Magazine 도착
화면: 메일 UI.
```
MCM
Your August MCM Magazine
A new issue is ready for you.
[OPEN MAGAZINE]
```
메일을 클릭한다.

목적: 서비스의 최종 결과물인 Magazine을 먼저 보여준다. 실제 이메일 발송이 아니라 데모용 Mail UI로 구현한다.

### 3.2 7–15s — 기존 MY MCM
화면:
```
MY MCM
Issue 01
Issue 02
...
```
기존 Issue가 이미 누적된 상태를 짧게 보여준다.

목적: 이 서비스가 한 번 추천하고 끝나는 것이 아니라 고객의 취향과 Editorial이 지속적으로 쌓이는 서비스라는 것을 보여준다.

### 3.3 15–20s — Personal Signal 발생
화면: MY MCM 화면의 데모용 버튼.
```
DEMO
[ SIMULATE PERSONAL SIGNAL ]
```
버튼을 클릭한다.

시스템 동작:
```
Personal Signal
  ↓
Wishlist / 장바구니 추가
  ↓
Taste Profile 갱신
```

목적: 실제 서비스에서는 고객의 행동이 Signal이 되지만, 데모에서는 버튼 클릭으로 Signal 발생을 시뮬레이션한다.

참고: 이번 데모에서는 Personal Signal을 메인 Trigger로 사용한다. Global Signal은 별도의 Trigger로 작동할 수 있지만, 100초 안에서는 두 개의 Trigger를 모두 실행하기보다 Personal Signal 하나를 명확하게 보여주고 Global Context를 이후 연결하는 방식으로 진행한다.

## 4. Vision + Taste Profile (20–30s)
화면: 새로 추가된 제품 이미지가 등장한다.
```
AI VISION
Color        Warm Neutral
Silhouette   Structured
Monogram     Medium
Material     Visetos Canvas
```
분석 결과가 Taste Profile에 반영된다.
```
TASTE PROFILE
Color        Warm Neutral
Silhouette   Structured
Monogram     Medium
Material     Visetos Canvas
```

시스템 동작: 새 제품 이미지 Vision 분석 → 기존 분석 결과는 재사용 → Core4 업데이트 → 조건을 충족하면 AI-discovered Trait 업데이트.

핵심: 고객 행동 → Vision → Taste Profile 갱신

## 5. Global Context 결합 (30–38s)
화면: Tokyo/MCM Global Context가 등장한다.
```
TOKYO
Current MCM Context
New Collection
Local Trend
```
그리고:
```
YOUR TASTE
      +
TOKYO CONTEXT
```
가 연결된다.

핵심: 고객의 Personal 정보만 보는 것이 아니라 MCM/도시의 현재 Context와 연결해 새로운 의미를 찾는다는 것을 보여준다.

## 6. Candidate Retrieval (38–46s)
화면:
```
CUSTOMER TASTE
        +
TOKYO CONTEXT
        ↓
CORE4 RETRIEVAL
        ↓
┌─────────┐ ┌─────────┐ ┌─────────┐
│Product A│ │Product B│ │Product C│
└─────────┘ └─────────┘ └─────────┘
```
후보 3개가 동시에 등장한다.

시스템 동작:
- 기본 경로: Core4 2축 이상 일치 → 후보 포함
- 후보가 0개인 경우에만: Core4 1축 이상 + 관련 Trait → 보조 경로를 적용한다.

데모: Retrieval의 세부 계산이나 Rarity/Top-N 등은 보여주지 않고 후보가 생성되는 결과만 보여준다.

## 7. Rule Validation + AI Gatekeeper (46–61s)
이 구간은 내부 AI Processing 화면으로 전환한다. 후보 3개 동시 표시.
```
                  AI GATEKEEPER
┌────────────┐ ┌────────────┐ ┌────────────┐
│ Candidate A│ │ Candidate B│ │ Candidate C│
│            │ │            │ │            │
│ Tokyo Tote │ │ Boston Bag │ │ Backpack   │
│            │ │            │ │            │
│   PASS ✓   │ │ REJECT ✕   │ │ REJECT ✕   │
│ New Context│ │ Past Issue │ │ Low        │
│            │ │ Similar    │ │ Discovery  │
└────────────┘ └────────────┘ └────────────┘
```

처리 순서:
1. Rule Validation — Evidence 존재 / Source 유효성 / 동일 제품 중복 여부 / 고객 취향 Anchor 존재 여부 등
2. Independent AI Gatekeeper — Evidence Grounding / Specificity / Novelty / Discovery Value
3. PASS / REJECT

연출: 후보 3개가 동시에 등장 → Rule Validation 결과 표시 → PASS/REJECT 판정 표시 → REJECT 후보는 흐려짐 → PASS 후보만 강조 → Editorial Story로 이동.

핵심 메시지: "취향에 맞는다고 모두 보여주는 것이 아니라, 새로운 발견이 될 수 있는지까지 판단합니다."

※ PASS/REJECT는 실제 고객 화면에 노출하지 않는 내부 판단 과정이다. 실제 Gatekeeper는 Rule을 통과한 후보들을 종합적으로 비교하여 발행 가치가 가장 높은 1개를 PASS하며, 적합한 후보가 없으면 NONE으로 처리한다. 데모에서는 이 비교 과정을 직관적으로 보여주기 위해 후보별 판단 결과를 PASS/REJECT 형태로 시각화한다.

## 8. Editorial Story (61–68s)
PASS된 후보만 Editorial Story로 전환한다.
```
ISSUE STORY
TOKYO × YOUR TASTE
[Product Image]
고객의 취향과 Tokyo Context가
어떻게 연결되는지 보여주는 Editorial Copy
```

목적: 상품 추천 → Editorial Story로 전환되는 것을 보여준다.

## 9. Issue 축적 (68–80s)
화면: 기존 Issue들과 새롭게 생성된 Story가 누적되는 모습을 보여준다.
```
MY MCM
Issue 01
Issue 02
Issue 03
...
```
새로운 PASS Story가 다음 Issue의 콘텐츠로 쌓인다.

시스템 동작: 한 달 동안 Gatekeeper를 통과한 PASS 결과들을 Editorial Story로 축적한다. 월 1회 하나의 MY MCM Magazine으로 묶어 발행한다.

핵심: Trigger가 발생할 때마다 바로 Issue를 보내는 것이 아니라, 한 달 동안 의미 있는 Story를 쌓은 뒤 하나의 Magazine으로 발행한다. 충분한 PASS Story가 축적되지 않으면 해당 월의 Magazine은 발행하지 않는다.

※ 실제 한 달을 기다리는 것이 아니라 데모에서는 미리 준비한 Issue/Story 데이터를 이용해 월간 축적 과정을 시뮬레이션한다.

## 10. Monthly Magazine 생성 (80–91s)
화면:
```
PASS STORIES
      ↓
   AI EDITOR
      ↓
MY MCM
AUGUST ISSUE
```

AI가 담당하는 편집(기획안에 정의된 대로): Issue Title/Intro, Story 순서, Story별 최종 Copy.

화면의 레이아웃은 미리 정의된 Magazine Template으로 렌더링한다. 즉: AI = 콘텐츠 편집 / Template = Magazine UI·레이아웃.

## 11. 91–100s — Magazine 도착
완성된 Magazine Cover를 보여준 후 메일 화면으로 돌아온다.
```
MCM
Your August MCM Magazine
is ready.
[OPEN MAGAZINE]
```
→ Magazine 첫 화면을 보여주며 종료.

마지막 메시지: "당신만이 읽을 수 있는 매거진, 세상에 단 한 부"(초안. 더 시적인 대안: "당신의 취향이, 당신만의 매거진이 됩니다" — 확정 필요시 논의)

## 12. 데모에서 구현할 것 / 안 할 것

**핵심 인터랙션**
- SIMULATE PERSONAL SIGNAL 버튼
- Wishlist/장바구니 Signal 발생
- Vision 분석
- Taste Profile 갱신
- Global Context 표시
- Core4 Retrieval
- 후보 3개 생성
- Rule Validation
- AI Gatekeeper
- PASS / REJECT
- Editorial Story 생성
- Issue 축적
- Monthly Magazine 생성
- Magazine 확인

**데모용 사전 세팅**
- 기존 Issue 01/02
- Global Context
- 후보 제품
- 이전 Editorial Story
- 메일 도착 화면

**구현하지 않는 것**
- 실제 Signal 자동 감지
- 실제 한 달 대기
- 실제 이메일 발송 API
- 카카오톡 연동
- AI 내부 추론 전체 과정
- Rarity / Top-N 등의 내부 계산 시각화
- Material 다중보류 예외 Retrieval

## 13. 100초 핵심 메시지

고객의 새로운 취향 신호를 AI가 이해하고, MCM의 현재 Context와 연결해 새로운 발견이 될 수 있는 이야기만 선별한 뒤, 한 달에 한 번 나만의 MCM Magazine으로 전달합니다.

전체 흐름: 메일 도착 → MY MCM/기존 Issue → Personal Signal 버튼 → Vision → Taste Profile → Global Context → Core4 Retrieval → Rule Validation → AI Gatekeeper → PASS Story → Issue 축적 → Monthly Magazine → 메일로 도착

## 14. 논의 이력 요약 (참고)

- 오프닝 Trigger: Signal 2(Personal Signal)를 메인으로 사용하고, Signal 1(Global Context)은 이후 결합하는 방식으로 정리
- 오프닝 구조: 완성된 Magazine을 메일로 먼저 보여준 뒤 MY MCM → Signal → Processing → Magazine으로 돌아오는 Loop 구조로 정리
- Gatekeeper 시각화: 실제 로직은 PASS/NONE이지만, 데모에서는 후보 간 비교 과정을 직관적으로 보여주기 위해 PASS/REJECT 형태로 시각화
