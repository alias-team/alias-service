1. docs/superpowers/specs/2026-08-19-task-403-1-editorial-layout-spec.md
# TASK-403-1 Editorial Layout Specification

## 목적

TASK-207 Personal Editorial Output을 실제 Email Magazine 형태로 표현하기 위한
Editorial Layout 구조를 정의한다.

본 단계에서는 디자인 스타일보다 **콘텐츠 배치 구조와 읽는 흐름**을 확정한다.

---

# Layout Principle

## Target Environment

- Desktop Email Experience 기준
- Luxury Brand Newsletter / Digital Magazine 형태
- Email container width 기준 설계
- Mobile은 추후 반응형 변환

---

# Editorial Reading Flow

전체 Editorial은 일반적인 카드형 UI가 아닌
Magazine Layout 기반의 Z-pattern reading flow를 따른다.

IMAGE
 ↓
TITLE
 ↓
STORY
TEXT
 ↓
IMAGE
 ↓
STORY

좌우 대칭보다 비대칭 배치를 사용하여
Luxury Editorial 느낌을 유지한다.

---

# Page Structure

## 1. Header

[MCM LOGO]
MY MCM ISSUE 01
HERITAGE IN MOTION
"Your taste meets a new expression
of MCM heritage."

구성:

- Brand Logo
- Issue Number
- Editorial Title
- Hero Message


---

## 2. Section Divider

각 주요 Chapter 시작 전 Section Bar 사용.

Example:

━━━━━━━━━━━━━━━━
YOUR DISCOVERY
━━━━━━━━━━━━━━━━

Style:

- MCM Heritage Brown 계열
- Chapter 구분 목적
- 콘텐츠 제목 강조


---

# 3. Hero Section

Purpose:

Editorial 첫 인상을 담당하는 Main Visual 영역.

Structure:

[ EVENT / CAMPAIGN IMAGE ]

Source:

TASK-207 Output

brand_story.image_url

---

# 4. Brand Story Section

Structure:

TITLE
[ IMAGE ]
TEXT

Content:

- Event Meaning
- Brand Story
- Collection Narrative


Data:

brand_story.title
brand_story.content

---

# 5. Discovery Section

Product discovery는 단순 Product Card가 아닌
Editorial Story Block 형태로 표현한다.


## Product Layout Pattern

Z-pattern 유지.


Example:


### Product Block A

┌──────────────┐
│              │
│   IMAGE 01   │
│              │
└──────────────┘
Product Name
Connection Story


### Product Block B

Product Name
Connection Story
┌──────────────┐
│              │
│   IMAGE 02   │
│              │
└──────────────┘


읽는 순서:

Product 01
→ Image → Text

Product 02
→ Text → Image


---

# 6. Closing

Structure:

MCM
Editorial Team
Discover your next
MCM story

---

# 완료 기준

- Email 화면 기준 레이아웃 확정
- Product Z-pattern 확정
- Component 구조 정의 완료