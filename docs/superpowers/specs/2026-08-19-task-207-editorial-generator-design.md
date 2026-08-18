# TASK-207 Personal Editorial Generator Specification

## 1. Overview

### Goal

TASK-207 Personal Editorial Generator는 TASK-206 Issue Composition 결과를 기반으로 하나의 Personal Editorial Magazine Content를 생성한다.

단순 상품 추천 문구 생성이 아니라,

> Customer Taste + MCM Event Meaning + Product Discovery를 연결한 Luxury Editorial Content 생성

을 목표로 한다.

---

## 2. Pipeline Position

```text
TASK-203
Event Meaning Engine
        |
        v
TASK-205
Gatekeeper
        |
        v
TASK-206
Issue Composition Engine
        |
        v
TASK-207
Personal Editorial Generator
        |
        v
personal_editorials
```

TASK-207 책임:

- Issue 구조를 실제 Editorial Content로 변환
- Magazine 형태 JSON 생성
- DB `personal_editorials.editorial_content` 저장용 데이터 생성

---

# 3. Input Contract

TASK-207은 아래 Input을 전달받는다.

## Input Structure

```json
{
  "issue_composition": {},

  "event_meaning_profile": {},

  "customer_taste_profile": {},

  "products": [],

  "gatekeeper_results": []
}
```

---

# 3.1 Issue Composition

Source:

TASK-206 Output

Purpose:

Issue 전체 방향 결정


```json
{
  "event_id": "",
  "issue_theme": "",
  "editorial_angle": "",

  "selected_products": [
    {
      "product_id": "",
      "product_role": "",
      "discovery_direction": ""
    }
  ]
}
```

사용:

- Cover Theme
- Editorial Direction
- Discovery Chapter 구성

---

# 3.2 Event Meaning Profile

Source:

TASK-203

DB:

`event_meaning_profiles`


Fields:

```json
{
  "event_theme": "",
  "brand_direction": "",
  "event_traits": [],
  "evidence": []
}
```


사용:

- Brand Story 생성
- Event Context 설명
- Luxury Brand Narrative 생성

---

# 3.3 Customer Taste Profile

Source:

DB:

`customer_taste_profiles`


Fields:

```json
{
  "taste_summary": "",
  "core_preference": {},
  "ai_traits": [],
  "evidence_product_ids": []
}
```


사용:

- Personal Connection 생성
- Product 연결 이유 생성

주의:

AI는 "고객 취향 분석 결과"를 직접 노출하지 않는다.

Bad:

```
Your taste profile shows that you like structured bags.
```

Good:

```
Your previous choices reveal a connection with refined structured silhouettes.
```

---

# 3.4 Product Data

Source:

DB:

`products`

Mapping:

| Field | Source |
|-|-|
| product_id | products.id |
| product_name | products.name |
| image_url | products.image_url |
| description | products.official_description |


Example:

```json
{
 "product_id":"",
 "product_name":"",
 "image_url":"",
 "description":""
}
```

---

# 3.5 Product Profile

Source:

DB:

`product_profiles`


Fields:

```json
{
 "core4": {},
 "ai_product_traits": [],
 "evidence": []
}
```


Purpose:

Product 의미 생성 근거

---

# 3.6 Gatekeeper Result

Source:

TASK-205


Fields:

```json
{
 "product_id":"",
 "reason":"",
 "editorial_angle":"",
 "meaning_bridge":"",
 "extension":"",
 "evidence":[]
}
```

Purpose:

Product와 Customer 연결 이유 생성

---

# 4. Output Contract

TASK-207 Output:

Personal Editorial JSON


```json
{
  "email_header": {
    "sender": "MCM Editorial Team",
    "subject": "",
    "preview": ""
  },

  "editorial": {

    "cover": {
      "title": "",
      "subtitle": "",
      "hero_message": ""
    },


    "opening_message": {
      "title": "",
      "content": ""
    },


    "brand_story": {
      "story_type": "campaign | collection | heritage",
      "image_url": "",
      "title": "",
      "content": ""
    },


    "discovery_chapters": [
      {
        "chapter_title": "",
        "chapter_intro": "",

        "products": [
          {
            "product_id": "",
            "product_name": "",
            "image_url": "",

            "discovery_story": "",

            "connection_reason": ""
          }
        ]
      }
    ],


    "closing_message": {
      "content": "",
      "cta_label": ""
    }

  }
}
```

---

# 5. Generation Responsibility

## Direct Mapping (AI 생성 금지)

아래 값은 Input 그대로 사용한다.

```text
product_id
product_name
image_url
brand_story.image_url
```

이유:

AI hallucination 방지.

---

## LLM Generation

AI 생성 대상:

```text
email_header.subject
email_header.preview

cover.title
cover.subtitle
cover.hero_message

opening_message

brand_story.title
brand_story.content

chapter_title
chapter_intro

discovery_story
connection_reason

closing_message
```

---

# 6. Editorial Generation Rules

## Brand Tone

Language:

English

Style:

Luxury Editorial Tone


금지:

```
Recommended Product
You may like this item
AI thinks you prefer...
```

사용:

```
Discovery
Journey
Expression
Connection
Movement
Heritage
```

---

# 7. Discovery Chapter Logic

Input:

TASK-206 selected_products


Rule:

- PASS Product 전체 사용
- Top-N 제한 없음
- Product 제거 금지


Example:

Input:

```
Product A
Product B
Product C
Product D
Product E
```

Output:

```
Discovery Chapter 01
- Product A
- Product B


Discovery Chapter 02
- Product C
- Product D


Discovery Chapter 03
- Product E
```

---

# 8. Validation Rules

## Required

필수 존재:

```text
email_header
cover
opening_message
brand_story
discovery_chapters
closing_message
```


## Product Validation

검증:

- Output product_id는 Input Product 목록에 존재해야 함
- 존재하지 않는 Product 생성 금지
- product_name/image_url 변경 금지


## Content Validation

검증:

- 빈 문자열 금지
- JSON Schema validation 통과 필수

---

# 9. DB Storage

Table:

`personal_editorials`

저장:

```json
editorial_content
```

형태:

```json
{
 "cover": {},
 "opening_message": {},
 "brand_story": {},
 "discovery_chapters": [],
 "closing_message": {}
}
```

기존 DB Schema 변경 없음.

---

# 10. MVP Scope

구현 범위:

필수:

- Input 조합
- OpenAI Structured Output 호출
- JSON Schema Validation
- Editorial JSON 생성
- personal_editorials 저장

제외:

- CMS
- Brand Asset Management
- 다국어 번역
- 자동 이미지 수집
- 구매 CTA 최적화

---

