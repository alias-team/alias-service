# TASK-403-2 Editorial JSON Mapping Plan


## Goal

TASK-207 Personal Editorial Output JSON을
TASK-403 Editorial Component와 연결한다.


---

# Implementation Steps


## Step 1. Mock Editorial JSON 준비

TASK-207 Output Schema 기반 Mock JSON 생성

Input:

- email_header
- editorial.cover
- editorial.brand_story
- editorial.discovery_chapters
- editorial.closing_message


---

## Step 2. Component Data Contract 정의

Editorial Component별 필요한 Props 정의


예:

EditorialHeaderProps
HeroSectionProps
BrandStoryProps
ProductStoryBlockProps
EditorialFooterProps


---

## Step 3. JSON Field Mapping 구현


Mapping:

TASK-207 JSON
        ↓
Editorial Component


### Header

cover.title
cover.subtitle
cover.hero_message


→ Editorial Header


---

### Hero

brand_story.image_url


→ Hero Image


---

### Brand Story

brand_story.title
brand_story.content


→ Brand Story Section


---

### Discovery

discovery_chapters[]

↓

chapter_title
chapter_intro
products[]


Product:

product_name
image_url
discovery_story
connection_reason


→ Product Editorial Block


---

### Closing

closing_message


→ Footer


---

## Step 4. Static Rendering Validation

API 연결 없이:

Mock JSON
 ↓
Component
 ↓
Editorial Preview

확인


---

# Validation Checklist

- 모든 TASK-207 Output Field 정상 출력
- Product 순서 유지
- Image Mapping 정상
- Story Content 정상 표시
- Component 재사용 가능 구조


---

# Output

TASK-403-3 Render Validation 진행 가능 상태