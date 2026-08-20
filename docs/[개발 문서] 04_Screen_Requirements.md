# [개발 문서]04_Screen_Requirements

담당자: 성경 이
상태: 완료
상태 (1): 시작 전
종료일: 08/16/2026
우선순위: 높음

# **04_SCREEN_REQUIREMENTS.md**

## **MCM Personal Editorial Engine MVP 화면 요구사항**

## **1. 문서 목적**

MCM Personal Editorial Engine MVP에서 실제로 만들 화면의 구조와 사용자 경험을 정의한다.

본 문서는 AI 내부 로직이 아닌, **MCM 담당자가 AI Engine 결과를 확인하고 최종 고객 경험까지 검증하는 화면 흐름**에 집중한다.

### **MVP 화면 흐름**

text

```
AI Knowledge Base Dashboard        ↓Intelligence Detail        ↓AI Reasoning Journey        ↓Personal Editorial Preview        ↓Customer Email Experience
```

### **MVP 범위**

- 사전 구축된 제품, 고객, 이벤트 데이터 조회
- AI Engine 실행 결과와 판단 근거 시각화
- Personal Editorial 미리보기
- HTML 이메일 미리보기 및 테스트 이메일 전달
- AI Pipeline 검증을 위한 선택 데모 상호작용

### **제외 범위**

- 로그인 및 회원가입
- CRM·CMS 운영 화면
- 제품·고객·이벤트 CRUD
- 실제 고객 대상 이메일 대량 발송
- 이메일 자동화 및 성과 분석
- 실시간 데이터 수집 및 실시간 이벤트 감지

---

# **Screen 1. AI Knowledge Base Dashboard**

## **목적**

사전 구축된 Product Intelligence, Customer Intelligence, Event Intelligence의 준비 상태와 요약 정보를 한 화면에서 확인한다.

담당자는 각 Intelligence 영역으로 이동하거나, 선택 데모 기능을 실행할 수 있다.

## **사용자 행동**

- Product Intelligence Card를 선택해 제품 분석 결과 상세 화면으로 이동한다.
- Customer Intelligence Card를 선택해 고객 취향 분석 결과 상세 화면으로 이동한다.
- Event Intelligence Card를 선택해 이벤트 의미 분석 결과 상세 화면으로 이동한다.
- 선택적으로 Test Product Analysis를 실행한다.
- 선택적으로 Refresh Taste Profile을 실행한다.

## **화면 구성 요소**

### **상단 영역**

- 화면 제목: **`AI Knowledge Base`**
- 화면 설명: 사전 구축된 AI 분석 결과를 확인하는 데모 환경이라는 안내
- 현재 데이터 준비 상태 요약
    - Product Intelligence 준비 완료 수
    - Customer Intelligence 준비 완료 수
    - Event Intelligence 준비 완료 수

### **Product Intelligence Card**

- 대표 제품 이미지
- 분석 완료 제품 수
- 최근 분석 제품명 또는 제품 요약
- Product Profile 준비 상태
- 상세 보기 버튼

### **Customer Intelligence Card**

- 데모 고객 이름 또는 식별자
- Customer Taste Profile 요약
- 분석 완료 고객 수
- 대표 AI Trait
- 상세 보기 버튼

### **Event Intelligence Card**

- 이벤트명
- 이벤트 유형
- 캠페인 또는 컬렉션 요약
- Event Meaning Profile 준비 상태
- 상세 보기 버튼

### **Optional Demo Feature: Test Product Analysis**

AI Product Understanding 검증을 위한 데모 상호작용이다. 실제 제품 등록이나 제품 관리 기능은 제공하지 않는다.

- Product Image Upload
- Product Description Input
- Optional Product Metadata Input
- 분석 실행 버튼
- 분석 진행 상태
- Product Profile 결과 영역

### **Optional Demo Feature: Refresh Taste Profile**

Customer Taste Discovery 검증을 위한 데모 상호작용이다. 실제 고객 관리나 CRM 연동 기능은 제공하지 않는다.

- 데모 고객 선택 영역
- 기존 고객 선택 데이터 표시
- 추가 구매 또는 위시리스트 제품 선택 영역
- 취향 프로필 갱신 버튼
- 갱신 전후 Customer Taste Profile 비교 영역

## **Input**

- 사전 구축된 Product Profile
- 사전 구축된 Customer Taste Profile
- 사전 구축된 Event Meaning Profile
- Test Product Analysis용 제품 이미지
- Test Product Analysis용 제품 설명
- 선택 제품 메타데이터
- Refresh Taste Profile용 데모 고객 선택 데이터

## **Output**

- Intelligence별 준비 상태와 요약 정보
- 선택한 Intelligence 상세 화면 진입
- Test Product Analysis 결과
    - Core4
    - AI Product Trait
    - Evidence
- 갱신된 Customer Taste Profile
    - Taste Summary
    - Core Preference
    - AI Traits
    - Evidence Products

## **처리 상태**

- 초기 로딩: Intelligence Card의 요약 데이터를 불러오는 상태를 표시한다.
- 분석 중: 제품 분석 실행 후 분석 진행 상태와 안내 문구를 표시한다.
- 갱신 중: 고객 취향 프로필 갱신 중임을 표시하고 중복 실행을 막는다.
- 완료: 분석 또는 갱신 결과 영역을 자동으로 표시한다.

## **예외 상황**

- 사전 구축된 Intelligence 데이터가 없으면 해당 카드에 빈 상태와 안내를 표시한다.
- 제품 이미지 또는 제품 설명이 없으면 Test Product Analysis를 실행하지 않고 필수 입력 안내를 표시한다.
- 제품 분석에 실패하면 결과를 저장하지 않고 오류 안내와 재시도 버튼을 표시한다.
- 선택 가능한 제품 또는 연결된 Product Profile이 없으면 Refresh Taste Profile을 실행하지 않는다.
- 고객 취향 프로필 갱신에 실패하면 기존 프로필을 유지하고 실패 사유를 표시한다.

---

# **Screen 2. Intelligence Detail**

## **목적**

선택한 Product Intelligence, Customer Intelligence 또는 Event Intelligence의 상세 결과와 Evidence를 읽기 전용으로 확인한다.

담당자는 AI가 생성한 결과를 확인한 뒤 이벤트 실행 흐름으로 이동할 수 있다.

## **사용자 행동**

- 대시보드에서 선택한 Intelligence의 상세 정보를 확인한다.
- Product Profile의 구조화된 속성과 AI Product Trait을 확인한다.
- Customer Taste Profile의 취향 요약과 근거 제품을 확인한다.
- Event Meaning Profile의 브랜드 메시지와 이벤트 특성을 확인한다.
- 대시보드로 돌아가거나 다른 Intelligence 상세 화면으로 이동한다.
- Event Intelligence 상세 화면에서 이벤트 실행을 시작한다.

## **화면 구성 요소**

### **공통 상단 영역**

- 뒤로 가기 버튼
- Intelligence 유형 표시
- 선택한 데이터의 이름 또는 식별자
- 분석 완료 상태
- 분석 기준 시점 또는 데모 데이터 안내

### **Product Profile Detail**

- 제품 대표 이미지
- 제품 정보
    - 제품명
    - 제품 ID
    - 선택 메타데이터
- Official Description
- Core4
    - Color / Tone
    - Silhouette / Form
    - Material
    - Monogram Density
- AI Product Trait
- Evidence
    - 제품 설명 내 근거 문장
    - 이미지 또는 메타데이터 기반 근거

### **Customer Taste Profile Detail**

- 데모 고객 식별 정보
- Taste Summary
- Core Preference
    - Color / Tone
    - Silhouette / Form
    - Material
    - Monogram Density
- AI Traits
- Evidence Products
    - 구매 또는 위시리스트 제품
    - 각 제품의 Product Profile 연결 정보

### **Event Meaning Profile Detail**

- 이벤트명
- Event Type
- Campaign Overview
- Brand Message
- Collection Concept
- Related Products
- Event Theme
- Brand Direction
- Event Traits
- 이벤트 실행 버튼

### **Evidence 표시 공통 구조**

- 각 분석 결과 옆에 Evidence 영역을 제공한다.
- Evidence는 결과와 연결된 근거 문장, 제품, 이벤트 정보로 구성한다.
- Evidence가 없는 항목은 근거 없음 상태로 구분해 표시한다.

## **Input**

- 선택한 Product Profile
- 선택한 Customer Taste Profile
- 선택한 Event Meaning Profile
- 각 Profile에 연결된 Evidence 데이터

## **Output**

- 선택한 Intelligence의 상세 분석 결과
- 결과별 Evidence
- Event Trigger 진입점

## **처리 상태**

- 초기 로딩: 선택한 Profile과 Evidence를 불러오는 상태를 표시한다.
- 부분 로딩: Profile은 먼저 표시하고 Evidence는 준비되는 대로 표시한다.
- 완료: 전체 분석 결과와 Evidence를 표시한다.

## **예외 상황**

- 선택한 Profile을 찾을 수 없으면 데이터 없음 안내와 대시보드 이동 버튼을 표시한다.
- 일부 Evidence를 불러오지 못하면 나머지 결과는 유지하고 해당 영역에 오류 안내를 표시한다.
- 연결된 제품 이미지가 없으면 기본 이미지 또는 이미지 없음 상태를 표시한다.
- Event Meaning Profile이 준비되지 않은 이벤트는 실행 버튼을 비활성화하고 안내를 표시한다.

---

# **Screen 3. AI Reasoning Journey**

## **목적**

선택한 이벤트가 고객 취향과 어떻게 연결되었는지, 그리고 에디토리얼 발행이 PASS 또는 REJECT 되었는지를 순서대로 보여준다.

담당자는 AI 내부 처리 과정을 조작하지 않고, 저장된 판단 결과와 근거를 이해한다.

## **사용자 행동**

- 사전 구축된 이벤트를 선택하고 Event Trigger를 실행한다.
- AI Editorial Engine Running 상태를 확인한다.
- Event Meaning, Customer Evidence, Product/Event Evidence를 순서대로 확인한다.
- Meaning Bridge를 확인한다.
- Editorial Gatekeeper의 PASS 또는 REJECT와 판단 이유를 확인한다.
- PASS이면 Personal Editorial Preview로 이동한다.
- REJECT이면 발행 불가 이유를 확인하고 대시보드로 돌아간다.

## **화면 구성 요소**

### **Event Trigger 영역**

- 선택된 이벤트명
- 이벤트 유형
- 캠페인 또는 컬렉션 요약
- 브랜드 메시지
- Trigger New Event 버튼
- 이벤트 실행 상태

### **AI Editorial Engine Running 영역**

- 실행 단계 진행 표시
    1. Event Meaning 확인
    2. Customer Evidence 확인
    3. Product/Event Evidence 확인
    4. Meaning Bridge 생성
    5. Editorial Gatekeeper 판단
- 현재 진행 단계 강조 표시
- 실행 완료 또는 실패 상태

### **Event Meaning 영역**

- Event Theme
- Brand Direction
- Event Traits
- 브랜드 메시지 요약
- 이벤트 의미 근거

### **Customer Evidence 영역**

- 고객 Taste Summary
- Core Preference
- AI Traits
- 근거 제품 목록
- 고객 취향과 연결된 근거 설명

### **Product/Event Evidence 영역**

- 이벤트 관련 제품 이미지
- 제품명 및 제품 요약
- Product Core4
- AI Product Trait
- 이벤트 또는 제품이 가진 새로운 표현
- 제품 또는 이벤트 근거 설명

### **Meaning Bridge 영역**

- 기존 고객 취향
- 새로운 브랜드 표현
- 두 요소를 연결하는 의미 문장
- 새로운 발견 가치 설명

### **Editorial Gatekeeper 영역**

- 최종 상태 배지
    - PASS
    - REJECT
- 판단 이유
- Editorial Angle
- PASS 시 Personal Editorial Preview 버튼
- REJECT 시 대시보드로 돌아가기 버튼

## **Input**

- 선택한 Event Meaning Profile
- 데모 고객의 Customer Taste Profile
- 이벤트 관련 Product Profile
- 사전 생성된 고객 근거
- 사전 생성된 제품 또는 이벤트 근거
- Meaning Bridge
- Editorial Gatekeeper 판단 결과

## **Output**

- 이벤트 기반 AI Reasoning Journey
- Event Meaning
- Customer Evidence
- Product/Event Evidence
- Meaning Bridge
- PASS 또는 REJECT 결과
- PASS 시 Personal Editorial Preview 진입

## **처리 상태**

- 실행 전: 선택된 이벤트와 실행 버튼을 표시한다.
- 실행 중: AI Editorial Engine Running 상태와 단계별 진행 상태를 표시한다.
- 단계 완료: 완료된 단계는 결과 요약과 확인 상태를 표시한다.
- 완료: Gatekeeper 결과를 표시한다.
- 발행 가능: PASS 결과일 때 Personal Editorial Preview 버튼을 활성화한다.
- 발행 불가: REJECT 결과일 때 발행 불가 이유를 강조 표시한다.

## **예외 상황**

- 실행 가능한 이벤트가 없으면 빈 상태와 이벤트 데이터 필요 안내를 표시한다.
- 고객 프로필, 이벤트 프로필 또는 제품 프로필이 누락되면 실행을 중단하고 누락된 데이터를 안내한다.
- 특정 추론 단계의 결과가 없으면 해당 단계에 결과 없음 상태를 표시한다.
- 필수 근거가 부족하면 Gatekeeper는 REJECT 상태로 표시한다.
- 실행 결과를 불러오지 못하면 오류 상태와 대시보드로 돌아가기 버튼을 표시한다.

---

# **Screen 4. Personal Editorial Preview**

## **목적**

PASS된 AI 판단 결과가 고객에게 전달될 Personal Editorial로 어떻게 구성되는지 확인한다.

담당자는 실제 고객 경험에 가까운 콘텐츠 흐름을 미리 확인한 뒤 이메일 미리보기로 이동한다.

## **사용자 행동**

- AI Reasoning Journey의 PASS 결과에서 Personal Editorial Preview를 연다.
- Brand Story를 읽는다.
- Personal Connection을 읽는다.
- Product Discovery를 확인한다.
- Email Preview로 이동한다.
- 이전 AI Reasoning Journey로 돌아간다.

## **화면 구성 요소**

### **상단 영역**

- 에디토리얼 제목
- Hero Image
- 선택된 이벤트명
- 고객 식별 정보 또는 데모 고객 표시
- AI Reasoning Journey로 돌아가기 버튼
- Email Preview 버튼

### **Brand Story**

- 브랜드 또는 이벤트 스토리
- 컬렉션의 핵심 메시지
- 이벤트가 제시하는 새로운 브랜드 방향

### **Personal Connection**

- 고객의 기존 취향 요약
- 근거 제품
- 고객 취향과 이벤트를 연결하는 개인화 문장
- Meaning Bridge 요약

### **Product Discovery**

- 추천 제품 이미지
- 제품명
- 제품 특징
- 제품이 고객 취향을 새로운 방식으로 확장하는 이유
- 관련 제품이 여러 개인 경우 제품 카드 목록

### **Closing Message**

- 에디토리얼의 마무리 문장
- 이메일 미리보기 이동 버튼

## **Input**

- PASS된 Editorial Candidate
- Personal Editorial 콘텐츠
- Event Meaning Profile
- Customer Taste Profile
- 선택된 Product Profile
- Hero Image 및 제품 이미지

## **Output**

- 고객에게 전달될 Personal Editorial 미리보기
- Brand Story
- Personal Connection
- Product Discovery
- Email Preview 진입

## **처리 상태**

- 초기 로딩: Personal Editorial 콘텐츠와 이미지를 불러오는 상태를 표시한다.
- 콘텐츠 준비 중: 텍스트와 제품 카드 영역에 로딩 상태를 표시한다.
- 완료: 전체 에디토리얼 콘텐츠와 이메일 미리보기 버튼을 표시한다.

## **예외 상황**

- PASS 결과가 없으면 이 화면에 진입하지 못하도록 하고 AI Reasoning Journey로 이동시킨다.
- 에디토리얼 콘텐츠가 누락되면 미리보기를 표시하지 않고 생성 결과 없음 안내를 표시한다.
- Hero Image 또는 제품 이미지가 없으면 기본 이미지 또는 이미지 없음 상태를 표시한다.
- 일부 제품 정보가 없으면 나머지 콘텐츠는 표시하고 누락된 제품 영역에 안내를 표시한다.

---

# **Screen 5. Customer Email Experience**

## **목적**

Personal Editorial이 고객에게 전달되는 HTML 이메일 경험을 미리 확인한다.

MVP에서는 이메일 미리보기 중심이며, 테스트 이메일 전달은 선택 구현 범위로 제한하며, 실제 고객 대상 대량 발송은 제공하지 않는다.

## **사용자 행동**

- Personal Editorial Preview에서 Email Preview를 연다.
- HTML 이메일 형태로 렌더링된 콘텐츠를 확인한다.
- 테스트 이메일 주소를 입력하거나 선택한다.
- 테스트 이메일 전달을 실행한다.
- 전달 성공 또는 실패 상태를 확인한다.
- 고객 관점의 이메일 콘텐츠를 확인한다.

## **화면 구성 요소**

### **Email Preview 상단 영역**

- 이메일 제목
- 발신자 표시
- 수신자 테스트 주소 표시
- 미리보기 모드 표시
- Personal Editorial Preview로 돌아가기 버튼

### **Hero Image 영역**

- 이벤트 또는 컬렉션 Hero Image
- 브랜드 로고 또는 브랜드 식별 요소
- 에디토리얼 제목

### **Brand Story 영역**

- 브랜드 또는 이벤트 스토리
- 컬렉션 메시지
- 브랜드 방향

### **Personal Connection 영역**

- 고객의 취향과 연결된 개인화 문장
- 근거 기반의 부드러운 안내 문구
- 고객 성격을 단정하지 않는 표현

### **Product Discovery 영역**

- 제품 이미지
- 제품명
- 제품 특징
- 새로운 발견 가치 설명
- 제품 상세 이동은 MVP 범위에서 제공하지 않는다.

### **테스트 이메일 전달 영역**

- 테스트 이메일 주소 입력 또는 선택
- 테스트 이메일 전달 버튼
- 전송 중 상태
- 전달 성공 또는 실패 메시지
- 재시도 버튼

## **Input**

- PASS된 Personal Editorial 콘텐츠
- HTML 이메일 템플릿
- Hero Image
- 제품 이미지
- 수신 동의된 테스트 이메일 주소

## **Output**

- HTML Email Preview
- 브랜드 스토리
- 개인 연결
- 제품 발견 콘텐츠
- 테스트 이메일 전달 결과

## **처리 상태**

- 렌더링 중: 이메일 템플릿과 콘텐츠를 결합하는 상태를 표시한다.
- 미리보기 완료: HTML 이메일 미리보기를 표시한다.
- 전송 중: 테스트 이메일 전달 중 상태와 중복 실행 방지 상태를 표시한다.
- 전송 완료: 테스트 이메일 전달 완료 메시지를 표시한다.
- 전송 실패: 실패 사유와 재시도 버튼을 표시한다.

## **예외 상황**

- Personal Editorial 콘텐츠가 없으면 Email Preview를 렌더링하지 않고 원인을 안내한다.
- Hero Image 또는 제품 이미지가 없으면 기본 이미지 또는 이미지 없음 상태를 표시한다.
- 테스트 이메일 주소가 없거나 유효하지 않으면 전달을 실행하지 않고 입력 안내를 표시한다.
- 수신 동의되지 않은 테스트 이메일 주소에는 전달하지 않고 안내를 표시한다.
- 이메일 렌더링에 실패하면 오류 상태와 재시도 안내를 표시한다.
- 테스트 이메일 전달에 실패하면 실패 사유를 표시하고 재시도할 수 있도록 한다.

---

## **MVP 화면 검증 기준**

- 담당자는 AI Knowledge Base Dashboard에서 사전 구축된 제품·고객·이벤트 Intelligence를 확인할 수 있다.
- 담당자는 Intelligence Detail에서 Profile과 Evidence를 확인할 수 있다.
- 담당자는 Event Trigger 이후 AI Reasoning Journey에서 판단 근거와 PASS·REJECT 결과를 확인할 수 있다.
- PASS 결과는 Personal Editorial Preview와 Customer Email Experience로 이어진다.
- 선택 데모 기능을 통해 제품 분석과 고객 취향 프로필 갱신 결과를 확인할 수 있다.
- 운영 관리, CRUD, 실제 대량 발송 기능 없이도 End-to-End 개인 에디토리얼 경험을 검증할 수 있다.

### 문서

[https://app.notion.com](https://app.notion.com)