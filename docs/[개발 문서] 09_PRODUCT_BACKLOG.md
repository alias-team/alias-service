# [개발 문서] 09_PRODUCT_BACKLOG

담당자: 성경 이
상태: 완료
상태 (1): 시작 전
종료일: 08/17/2026
우선순위: 높음

# 09_PRODUCT_BACKLOG.md

# MCM Personal Editorial Engine MVP Product Backlog

## 1. Backlog Overview

### 목적

본 문서는 MCM Personal Editorial Engine MVP 구현을 위한 개발 실행 순서를 정의한다.

본 프로젝트는 단순 상품 추천 시스템이 아니라,

> 고객 취향(Customer Taste Profile)과 MCM 이벤트(Event Meaning), 제품(Product Intelligence)을 AI가 연결하여 의미 있는 발견만 선별하고 하나의 Personal Editorial Issue로 생성하는 AI Editorial Engine
> 

구현을 목표로 한다.

---

## 2. Development Principle

### 구현 우선순위

48시간 MVP 개발 환경 기준으로 아래 순서로 구현한다.

```
Project Setup

↓

Database / Seed Data

↓

AI Editorial Engine

↓

Personal Editorial Issue Generation

↓

Demo UI

↓

Deployment
```

---

## 3. MVP Architecture

```
Product Data

↓

Product Understanding Engine

↓

Product Profile
(Core4 + AI Traits + Evidence)

Customer Selection Data

↓

Customer Taste Discovery Engine

↓

Customer Taste Profile

Event Data

↓

Event Meaning Engine

↓

Event Meaning Profile

Customer Taste Profile
+
Event Meaning Profile
+
Event Related Products

↓

Meaning Matching Engine

↓

Product Candidate Results

↓

Product-level Gatekeeper

↓

PASS Product Pool

↓

Issue Composition Engine

↓

Personal Editorial Issue

↓

Email Experience
```

---

# Phase 0. Project Environment Setup

## Goal

Next.js 기반 MVP 개발 환경 구축 및 프로젝트 문서 연결

---

## TASK-001 Repository Initialization

### 작업

구현:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- pnpm 환경

Reference:

- 06_TECHNICAL_SPEC.md

Output:

```
실행 가능한 Next.js 프로젝트
```

---

## TASK-002 Project Structure Setup

생성 구조:

```
mcm-editorial-engine

├── src
│
├── documents
│   ├── 05_MVP_SCOPE.md
│   ├── 06_TECHNICAL_SPEC.md
│   ├── 07_DATABASE_SCHEMA.md
│   ├── 08_API_SPEC.md
│   └── CORE4_SCHEMA.md
│
├── supabase
│
├── seed
│
├── public
│
└── README.md
```

목적:

Codex / Claude Code가 모든 구현 시 기준 문서를 참고하도록 구성.

---

# Phase 1. Database & Seed Data

## Goal

AI Engine 실행에 필요한 Intelligence Data 구축

---

# TASK-101 Supabase Database Schema 구현

Reference:

- 07_DATABASE_SCHEMA.md

구현 Table:

```
products

product_profiles

customers

customer_product_selections

customer_taste_profiles

events

event_meaning_profiles

reasoning_runs

matching_results

gatekeeper_results

personal_editorials
```

Output:

Supabase Database Schema 생성

---

# TASK-102 Seed Data 구축

## Input

기존 Excel 기반 데이터

Process:

```
Excel

↓

Seed JSON

↓

Supabase Insert
```

저장 대상:

### Product

- Product Information
- Image
- Description

### Product Profile

- Core4
- AI Product Traits
- Evidence

### Customer

- Demo Customer

### Customer Taste Profile

- Core Preference
- AI Traits
- Evidence Products

### Event

- Campaign / Collection Data

### Event Meaning Profile

- Event Theme
- Brand Direction
- Event Traits

Output:

Demo Flow 실행 가능한 Seed Database

---

# Phase 2. AI Editorial Engine

## Goal

MCM Personal Editorial Engine 핵심 Pipeline 구현

---

# TASK-201 Product Understanding Engine

## 목적

제품 데이터를 AI가 이해하고 Product Profile 생성

Input:

```
Product Image

+

Product Description
```

Process:

```
Multimodal LLM

↓

Core4 Classification

↓

AI Product Trait Discovery

↓

Evidence Extraction
```

Output:

```
Product Profile

{
 Core4,
 AI Traits,
 Evidence
}
```

Reference:

CORE4_SCHEMA.md

---

# TASK-202 Customer Taste Discovery Engine

## 목적

고객 선택 데이터를 기반으로 취향 프로필 생성

Input:

```
Customer Product Selection

+

Product Profile
```

Process:

```
Purchase/Wishlist Products

↓

Pattern Analysis

↓

Core Preference Extraction

↓

AI Trait Discovery
```

Output:

```
Customer Taste Profile
```

---

# TASK-203 Event Meaning Engine

## 목적

MCM 이벤트의 브랜드 의미 분석

Input:

```
Campaign Data

Collection Information

Related Products
```

Output:

```
Event Meaning Profile

{
 Event Theme,
 Brand Direction,
 Event Traits,
 Evidence
}
```

---

# TASK-204 Meaning Matching Engine ⭐⭐⭐

## 목적

고객 취향과 이벤트 상품 각각을 비교하여 의미 연결 생성

중요:

하나의 이벤트에는 여러 상품이 존재한다.

따라서 상품 단위 Matching을 수행한다.

Process:

```
Customer Taste Profile

+

Event Meaning Profile

+

Event Related Product Profiles

↓

For Each Product:

Customer Preference Matching

+

Product Meaning Matching

+

Event Meaning Matching

↓

Meaning Bridge 생성
```

Output:

상품별 Candidate Result

예:

```
[
 {
  "productId":"001",
  "meaningBridge":{},
 },

 {
  "productId":"002",
  "meaningBridge":{},
 }
]
```

---

# TASK-205 Product-level Editorial Gatekeeper

## 목적

각 후보 상품별 Editorial 포함 여부 판단

PASS 조건:

- Customer Evidence 존재
- Product Evidence 존재
- Event Evidence 존재
- Meaning Bridge 존재
- Discovery Value 존재

결과:

```
PASS Product Pool

[
Product A,
Product C,
Product D
]
```

REJECT 상품:

Issue 생성 대상 제외

---

# TASK-206 Issue Composition Engine ⭐⭐⭐

## 목적

PASS된 여러 Product를 하나의 Personal Editorial Issue로 구성

중요:

상품 하나마다 Editorial을 생성하지 않는다.

Input:

```
PASS Product Pool

+

Event Meaning Profile
```

Output:

```
MY MCM ISSUE
```

포함:

- Title
- Editorial Theme
- Brand Story
- Personal Connection
- Product Discovery List
- Closing Message

---

# TASK-207 Personal Editorial Generator

## 목적

Issue 데이터를 실제 Editorial Content 형태로 생성

저장:

personal_editorials

Output:

```
Personal Editorial JSON
```

---

# Phase 3. API Integration

Reference:

08_API_SPEC.md

## TASK-301 API Route 구현

구현:

Knowledge Base:

```
GET /api/products

GET /api/customers

GET /api/events
```

Pipeline:

```
POST /api/reasoning/start

POST /api/matching

POST /api/gatekeeper
```

Editorial:

```
POST /api/editorials

GET /api/editorials/{id}
```

Email:

```
GET /api/email/{id}
```

---

# Phase 4. Demo Experience UI

## Goal

심사 Demo 화면 구현

---

# TASK-401 AI Knowledge Base Dashboard

구현:

- Product
- Customer
- Event 목록

---

# TASK-402 AI Reasoning Journey

화면:

```
Customer Taste

↓

Event Meaning

↓

Product Matching

↓

Meaning Bridge

↓

Gatekeeper
```

---

# TASK-403 Personal Editorial Issue Page

화면:

Digital Magazine Experience

구성:

- Hero
- Story
- Product Discovery
- Closing

---

# TASK-404 Email Preview

구현:

Editorial → Email View

---

# Phase 5. Deployment

## TASK-501 End-to-End Demo Flow 연결

최종 Flow:

```
Customer 선택

↓

Event 선택

↓

Engine 실행

↓

Product Matching

↓

PASS Product Collection

↓

Issue 생성

↓

Email Preview
```

---

## TASK-502 Demo Scenario 생성

필수:

PASS Case

REJECT Case

---

## TASK-503 Vercel Deployment

구성:

- Environment Variables
- Supabase Connection
- OpenAI API

---

# Codex / Claude Code 실행 방법

## 기본 원칙

한 번에 전체 프로젝트 구현 요청하지 않는다.

반드시 Phase 단위 또는 TASK 단위로 실행한다.

---

## 실행 Prompt Template

```
현재 프로젝트의 다음 TASK를 구현해주세요.

TASK:
[TASK 번호]

반드시 참고:
- documents/05_MVP_SCOPE.md
- documents/06_TECHNICAL_SPEC.md
- documents/07_DATABASE_SCHEMA.md
- documents/08_API_SPEC.md
- documents/CORE4_SCHEMA.md

구현 조건:
- 기존 서비스 방향 변경 금지
- MVP 범위 유지
- 새로운 테이블/기능 임의 추가 금지

구현 후 반드시 출력:

1. 변경된 파일 목록
2. 구현 내용 요약
3. 실행 방법
4. 테스트 결과
5. 다음 TASK 진행 가능 여부
```

---

## 예시

```
TASK-204 Meaning Matching Engine 구현해주세요.

Reference:
documents/CORE4_SCHEMA.md
documents/07_DATABASE_SCHEMA.md

목표:
Customer Taste Profile과 Event Related Product를 비교하여
상품별 Meaning Bridge와 Candidate Result를 생성해야 합니다.

주의:
상품 하나마다 판단하며,
최종 Editorial은 PASS 상품들을 묶어서 Issue 단위로 생성됩니다.
```

---

# 개발 Agent 운영 방식

추천:

```
TASK 실행

↓

Codex 결과 확인

↓

Claude Code Review

↓

수정 요청

↓

다음 TASK 진행
```

단, 48시간 MVP에서는 모든 TASK마다 완벽한 리뷰보다

```
Phase 완료 단위 검수
```

방식으로 진행한다.

---

# Final MVP Output

최종 구현 결과:

```
MCM Personal Editorial Engine

✓ Product Intelligence

✓ Customer Taste Discovery

✓ Event Meaning Analysis

✓ Product-level Meaning Matching

✓ Editorial Gatekeeper

✓ Personal Editorial Issue Generation

✓ Email Experience Preview

✓ Deployable Demo
```

### 시키는 방식

# Codex / Claude Code 실행 방식

## 기본 원칙

MCM Personal Editorial Engine은 문서 기반 개발을 진행한다.

AI Coding Agent에게 전체 프로젝트 구현을 한 번에 요청하지 않는다.

각 구현 단위별로 순차 실행한다.

```
Task 요청
↓
AI Agent 구현
↓
결과 확인
↓
다음 Task 진행
```

---

# 권장 실행 순서

## STEP 1. 프로젝트 환경 구축

요청:

```
Phase 0 Project Setup을 진행해주세요.

목표:
Next.js + TypeScript + Supabase 기반 프로젝트 초기 환경 구축

참고 문서:
- 06_TECHNICAL_SPEC.md

구현:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- pnpm 설정
- documents 폴더 구조 생성

완료 후:
1. 생성된 파일 목록
	src/, public/, package.json, components.json, 
	next.config.ts, tsconfig.json, documents/, supabase/, seed/ 등
	
2. 실행 방법
git switch dev
git pull origin dev
pnpm install
pnpm dev

3. 다음 단계 진행 가능 여부
정리해주세요.
✅ Phase 0 완료
✅ pnpm build 성공
✅ dev 브랜치 merge 완료
➡ 다음 단계: STEP 2. Database 구축
세부 TASK: TASK-101 Supabase Database Schema 구현
```

---

# STEP 2. Database 구축

요청:

```
TASK-101 Database Schema 구현해주세요.

참고:
- 07_DATABASE_SCHEMA.md

목표:
Supabase PostgreSQL 테이블 생성

구현:
- products
- product_profiles
- customers
- customer_product_selections
- customer_taste_profiles
- events
- event_meaning_profiles
- reasoning_runs
- matching_results
- gatekeeper_results
- personal_editorials

완료 후:
- 생성한 Schema 설명
- Migration 파일 위치
- 테스트 방법
정리해주세요.
```

---

# STEP 3. Seed Data 연결

요청:

```
TASK-102 Seed Data 구축해주세요.

참고:
- 07_DATABASE_SCHEMA.md

현재 가지고 있는 Excel 데이터를 기반으로
Supabase Seed Data 구조를 만들어주세요.

구현:
Excel
↓
Seed JSON
↓
Supabase Insert

대상:
- Products
- Product Profiles
- Customers
- Events
- AI Result Data

완료 후:
- Seed 실행 방법
- 생성 데이터 개수
- 확인 방법
정리해주세요.
```

---

# STEP 4. 핵심 Engine 구현 ⭐

여기는 한번에 다 시키면 안 됨.

순서:

---

## 4-1 Product Understanding

```
TASK-201 Product Understanding Engine 구현해주세요.

참고:
- CORE4_SCHEMA.md
- 07_DATABASE_SCHEMA.md

목표:
Product Image + Description 기반 Product Profile 생성

Output:
- Core4
- AI Product Traits
- Evidence

구현 후:
테스트 Product 1개로 결과 확인해주세요.
```

---

## 4-2 Customer Taste Engine

```
TASK-202 Customer Taste Discovery Engine 구현해주세요.

참고:
- 07_DATABASE_SCHEMA.md

목표:
Customer Selection Data와 Product Profile을 기반으로
Customer Taste Profile 생성

Output:
- Taste Summary
- Core Preference
- AI Traits
- Evidence Products
```

---

## 4-3 Event + Matching + Gatekeeper

여기는 묶어도 됨.

```
TASK-203~205 AI Editorial Pipeline 구현해주세요.

목표:

Event
↓
Event Meaning Analysis
↓
Event Related Products
↓
Customer Matching
↓
Meaning Bridge
↓
Product-level Gatekeeper

중요:
하나의 이벤트에는 여러 상품이 존재합니다.

각 상품마다:
PASS / REJECT 판단해야 합니다.

PASS 상품들은 이후 Issue 생성 단계에서 묶입니다.

참고:
- 05_MVP_SCOPE.md
- 07_DATABASE_SCHEMA.md
```

---

# STEP 5. Editorial Issue 생성

```
TASK-206~207 Personal Editorial Issue Generator 구현해주세요.

목표:

Product-level PASS 결과들을 하나의 Issue로 구성

주의:
상품 하나마다 Editorial 생성하지 않습니다.

Input:
- PASS Product Pool
- Event Meaning Profile

Output:
MY MCM ISSUE

포함:
- Title
- Brand Story
- Personal Connection
- Product Discovery List
- Closing Message
```

---

# STEP 6. API 연결

```
TASK-301 API Layer 구현해주세요.

참고:
- 08_API_SPEC.md

우선 MVP 핵심 API만 구현합니다.

필수:
- Product 조회
- Customer 조회
- Event 조회
- Reasoning Start
- Matching
- Gatekeeper
- Editorial 조회
- Email Preview
```

---

# STEP 7. 화면 구현

```
TASK-401 Demo UI 구현해주세요.

목표:
심사 Demo Experience 구현

필수 화면:
1. Knowledge Base
2. AI Reasoning Journey
3. Personal Editorial Issue
4. Email Preview
```

---

# STEP 8. Deploy

```
TASK-501 배포 준비해주세요.

구현:
- Environment Variable 설정
- Supabase 연결 확인
- OpenAI 연결 확인
- Vercel Deploy

최종 Demo Flow 테스트:
Customer 선택
→ Event 선택
→ Engine 실행
→ Issue 생성
→ Email Preview
```

---

## 실제 운영 순서 (48시간 기준)

```
1차:
Project Setup
+
DB
+
Seed Data

↓

2차:
Product Understanding
+
Customer Taste
+
Event Matching Pipeline

↓

3차:
Editorial Issue 생성

↓

4차:
Demo UI

↓

5차:
Deploy
```

---

그리고 Codex/Claude Code한테 매번 마지막에 이 문장 붙이는 게 좋음.

```
주의:
기존 문서의 서비스 방향, 데이터 구조, MVP 범위를 변경하지 마세요.
새로운 테이블이나 기능을 임의 추가하지 마세요.
구현 후 변경 파일과 다음 작업 가능 여부를 알려주세요.
```

### 문서

[https://app.notion.com](https://app.notion.com)