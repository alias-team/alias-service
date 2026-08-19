# TASK-403-2 Editorial JSON Mapping Specification


## 목적

TASK-207 Personal Editorial JSON Output을
Editorial UI Component와 연결하기 위한 Mapping 정의.


---

# Input

Source:

TASK-207 Personal Editorial


Structure:

```json
{
 email_header,
 editorial:{
   cover,
   brand_story,
   discovery_chapters,
   closing_message
 }
}
Mapping Rules
Header
JSON:
editorial.cover
Mapping:
title
subtitle
hero_message
→ Editorial Header
Hero Image
JSON:
brand_story.image_url
→ Hero Section Image
Brand Story
JSON:
brand_story.title
brand_story.content
→ Brand Story Section
Discovery Chapter
JSON:
discovery_chapters[]
Mapping:
chapter_title
chapter_intro
products[]
Product Story
Product JSON:
{
 product_id,
 product_name,
 image_url,
 discovery_story,
 connection_reason
}
Mapping:
image_url
↓
Product Image


product_name
↓
Product Title


connection_reason
↓
Personal Connection Story


discovery_story
↓
Editorial Description
Closing
JSON:
closing_message
→ Footer
Constraint
Product metadata는 UI에서 변경하지 않는다.
TASK-207 Output 구조 유지
UI는 JSON Consumer 역할만 수행한다.

---

# 4. `docs/superpowers/plans/2026-08-19-task-403-2-editorial-json-mapping.md`

```md
# TASK-403-2 Editorial JSON Mapping Plan


## Goal

TASK-207 Output JSON을 Editorial Component에 연결한다.


---

# Steps


## Step 1

Mock Editorial JSON 생성


Source:

TASK-207 schema


---

## Step 2

Component Props 정의


예:

EditorialHeaderProps
BrandStoryProps
ProductStoryProps


---

## Step 3

JSON Field Mapping


확인:

- title 출력
- image 출력
- story 출력
- product order 유지


---

## Step 4

Static Rendering 확인


API 연결 없이:

JSON
↓
Component
↓
Email Preview


확인


---

# Output

TASK-403-3 Mock Data Validation 준비 완료