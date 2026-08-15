# Core4 Schema Definition & Validation

## TL;DR

- Core4는 `Color / Tone`, `Silhouette / Form`, `Material`, `Monogram Density` 4개 축으로 구성한다.
- MCM 공식 제품 데이터를 기준으로 `Bags 30 → Non-Bags 24 → Holdout → Regression → Vision Holdout` 순서로 검증했다.
- 현재 MVP 기준 추가 Value 확장 없이 **Core4 Schema LOCK**.

---

# 1. Core4 목적

Core4는 단순 추천 필터가 아니라,
고객이 선호한 제품과 신규 제품을 **동일한 기준으로 표현하기 위한 Common Representation**이다.

사람이 축과 가능한 Value를 정의하고,
AI는 제품 Evidence를 바탕으로 정해진 Value 중 하나 이상을 선택한다. 기본적으로 단일 Value를 사용하며, 동일 축에서 복수 특성이 명확하게 공존하는 경우에만 복수 Value를 허용한다.

판정 근거가 부족하면 억지로 분류하지 않고 `null` 처리한다.

---

# 2. Final Schema

| Axis | Values |
|---|---|
| Color / Tone | `warm_neutral`, `cool_neutral`, `muted`, `saturated`, `mono` |
| Silhouette / Form | `structured`, `soft`, `compact`, `envelope` |
| Material | `signature_monogram`, `leather`, `nylon`, `textile` |
| Monogram Density | `none`, `low`, `medium`, `high` |

> `null`은 정식 Value가 아니라 **판정 근거 부족 / 분류 불가 상태**를 의미한다.

---

# 3. Schema 설계 원칙

Core4 Value는 다음 기준으로 검토했다.

1. MCM 공식 제품 데이터에서 근거를 확보할 수 있는가
2. 이미지 또는 공식 제품 정보로 일관되게 판별 가능한가
3. 다른 축과 의미가 과도하게 중복되지 않는가
4. 고객의 반복적인 취향을 표현할 수 있는가
5. Retrieval / Matching에 활용 가능한가
6. Value가 과도하게 늘어나지 않는가
7. Core4 Attribute는 기본적으로 단일 Value를 사용하되,
        동일 축에서 복수 특성이 명확하게 확인되는 경우 여러 Value를 허용하며 Array 형태로 저장한다.
        단순한 판단의 애매함을 이유로 복수값을 부여하지 않는다.
8. 브랜드에 근거 없는 의미를 부여하지 않는가

제품의 세부 분위기나 추가적인 의미는 Core4가 아닌
`Product Trait Discovery`에서 다룬다.

---

# 4. Axis별 최종 규칙

## 4.1 Color / Tone

### Values

- `warm_neutral`
- `cool_neutral`
- `muted`
- `saturated`
- `mono`

### 사용 데이터

- `base_color`
- `colorway_name`

### 판정 순서

1. `colorway_name`의 muted 신호단어 확인
2. Metallic Body 여부 확인
3. 해당하지 않으면 `base_color` 기준 판정
4. 대표색을 신뢰성 있게 결정할 수 없으면 `null`

### Base Color Mapping

| base_color | Value |
|---|---|
| Cognac | `warm_neutral` |
| Brown | `warm_neutral` |
| Beige | `warm_neutral` |
| Grey | `cool_neutral` |
| Black | `mono` |
| White | `mono` |
| Orange | `saturated` |
| Red | `saturated` |
| Blue | `saturated` |
| Green | `saturated` |
| Pink | `saturated` |

### Muted 신호단어

`colorway_name`에 아래 단어가 포함되면 `base_color`보다 우선하여 `muted`로 판정한다.

- `pastel`
- `sky`
- `dusty`
- `soft`
- `sage`
- `pale`
- `powder`
- `ash`
- `ashy`
- `faded`
- `blush`
- `khaki`
- `moss`
- `olive`
- `taupe`

### 주요 예외

- `Denim`은 muted 신호단어가 아니다.
- `Navy Blazer`처럼 단순히 어두운 색이라는 이유만으로 `muted`로 판정하지 않는다.
- Gold / Silver가 Hardware에만 사용되면 Body Color 판정에 사용하지 않는다.
- Body 자체가 Metallic이고 기존 Value로 신뢰성 있게 분류할 수 없으면 `null`.
- `Multi`는 대표색을 객관적으로 특정할 수 있을 때만 해당 대표색을 사용하고, 그렇지 않으면 `null`.
- Product Name은 판정 Evidence로 사용하지 않는다.

### 검증 사례

| 실제 표현 | 결과 |
|---|---|
| Soft Pink | `muted` |
| Khaki Moss | `muted` |
| Visetos Green | `saturated` |
| Valentine Red | `saturated` |
| Orangeade + base_color Orange | `saturated` |

### Holdout

**19 / 19 정상 판정**

→ Color / Tone **LOCK**

---

## 4.2 Silhouette / Form

### Values

- `structured`
- `soft`
- `compact`
- `envelope`

### 정의

제품 크기가 아니라 **제품이 형태를 유지하는 방식**을 표현한다.

`compact`는 작은 제품이라는 뜻이 아니다.

### 판정 기준

| Value | 기준 |
|---|---|
| `envelope` | near-zero depth, flat form |
| `structured` | flat panel, angular junction, 구조적 형태 유지 |
| `compact` | continuous curved volume, taut surface, 고정된 volume |
| `soft` | sagging, wrinkle, gravity-driven deformation |

### 판정 순서

Flat / near-zero depth  → `envelope`

Volume + flat panel / angular junction  →`structured`

Continuous curved + taut  → `compact`

Sagging / wrinkle / deformation  → `soft`

판정 근거가 부족하면 `null`.

### Vision-first

Silhouette은 **Product Image를 우선 Evidence**로 사용한다.

Product Name과 Product Description은 Runtime 분류 Evidence로 사용하지 않는다.

### Cross-category 검증 사례

| Product | 결과 |
|---|---|
| Boot | `structured` |
| Neoprene Vest | `structured` |
| Phone Case | `compact` |
| SIGG Bottle | `compact` |

### RTW 처리

- standalone product shot 우선
- 착용 이미지만 있으면 착용자에 의해 생긴 변형보다 제품 자체의 panel / seam / 구조를 우선
- 여전히 불명확하면 `null`

### Fresh Vision Holdout

새로운 이미지 10개로 별도 검증했다.

최신 검증 사례:

| Product | 결과 |
|---|---|
| Pina Studded Tote | `compact` |
| Backpack | `structured` |

전체 결과:

**10 / 10 정상 판정 / Misclassification 0**

→ Silhouette / Form **LOCK**

---

## 4.3 Material

### Values

- `signature_monogram`
- `leather`
- `nylon`
- `textile`

### 기본 원칙

제품의 **Main / Body 소재**를 기준으로 한다.

Trim, Pull tab처럼 부속 부분의 소재는 Core4 Material 판정에서 제외한다.

### Multi-value 예외

기본적으로 Main / Body 소재를 기준으로 단일 Value를 사용한다.

다만 reversible, detachable equal parts, respectively 등
서로 독립적이고 대등한 Main / Body 구조가 존재하고,
각 구조의 Material Value가 실제로 다른 경우에는 복수 Value를 Array로 기록한다.

Body / Trim 관계는 복수값 대상이 아니며 기존처럼 Body 소재만 판정한다.

예:
- MWHGATA014B001 → ["signature_monogram", "leather"]
- MXBFSCJ04BK080 → ["leather", "signature_monogram"]

### 판정 우선순위

1. `signature_monogram`
2. `nylon`
3. `leather`
4. `textile`
5. `null`

### signature_monogram

다음 조건을 사용한다.

- `monogram + canvas`
- `monogram + jacquard`
- `monogram + print`
- `Visetos + canvas`

### nylon

- `nylon`
- `ECONYL`

### leather

- `leather`
- `suede`
- `calfskin`
- `lambskin`
- `goatskin`

`Vegan Leather`는 자동으로 leather에 포함하지 않는다.

### textile

- `fabric`
- `wool`
- `cotton`
- `silk`
- `polyester`
- `spandex`

### 현재 null 처리

- Rubber
- TPU
- Aluminum
- Vegan Leather

현재 데이터 기준 별도 Value를 추가할 만큼 반복성과 Retrieval 의미가 충분하지 않아 새로운 Value를 만들지 않았다.

### 검증 과정에서 수정한 문제

**Pull tab 오추출**

초기에는 부속 소재인 `Calf leather pull tab`이 Body Material처럼 추출되는 문제가 있었다.

→ `pull tab`을 부속 표현으로 제외하도록 수정.

**Monogram Print 누락**

`Visetos monogram all-over print`가 초기 Material Keyword에서 누락됐다.

→ `monogram all-over print`, `monogram print` 추가.

### Regression

Holdout 수정 후 기존 Bags 30개를 다시 확인했고,
새 규칙으로 인한 새로운 구조적 Regression은 확인되지 않았다.

→ Material **LOCK**

---

## 4.4 Monogram Density

### Values

- `none`
- `low`
- `medium`
- `high`

### high

Material 또는 Product Details Evidence에 literal `Maxi`가 존재할 때만 적용한다.

다음 표현은 `high` 판정 근거로 사용하지 않는다.

- `Mega`
- `maximalist`
- `oversized`
- `enlarged`

Product Name의 `Maxi`도 Evidence로 사용하지 않는다.

### medium

제품 주요 Body / Pattern 전체에 다음 모노그램이 사용되는 경우:

- `Visetos`
- `Lauretos`
- `Embossed Monogram`
- `Diamond monogram jacquard`
- `Diamond monogram motif`
- `monogram print`

단, `Maxi` Evidence가 없어야 한다.

### low

모노그램이 제품 전체가 아니라 특정 부분에 제한되는 경우:

- trim
- accent
- handle
- pocket
- specific compartment

### none

제품 정보를 정상적으로 확인했고 모노그램 Evidence가 없는 경우.

### null

모노그램 존재 여부를 판단할 Evidence 자체가 부족한 경우.

> `none` = 확인했지만 없음  
> `null` = 확인할 근거가 부족함

### Multi-value 예외

기본적으로 단일 Density Value를 사용한다.

다만 reversible 또는 독립적인 대등 파트처럼
서로 다른 면 / 파트가 동등하게 존재하고,
각 면 / 파트의 Monogram Density가 실제로 다른 경우에는
복수 Value를 Array로 기록한다.

Trim / accent / handle / pocket 등 부수적 사용은 배열 대상이 아니며
기존 low 규칙을 적용한다.

예:
- MWHGATA014B001 → ["high", "none"]
- MXBFSCJ04BK080 → ["none", "medium"]

### Evidence Source

초기에는 Product Description을 사용했지만,
Cross-category 검증에서 모노그램 정보가 `PRODUCT DETAILS`에만 존재하는 제품을 발견했다.

최종 Evidence:

- Product Description
- PRODUCT DETAILS 전체 Bullet

Crawler도 `product_details_bullets`를 저장하도록 수정했다.

### 재검증

- 미확정 none 4건 → `none` 확인
- Calf Leather Body + Visetos Trim → `low`
- Visetos monogram all-over print → `medium`

→ Monogram Density **LOCK**

---

# 5. Product Name을 Evidence에서 제외한 이유

`product_name`은 Metadata로 저장하지만 Core4 판정에는 사용하지 않는다.

Marketing Name에 포함된 `Maxi`, `Monogram`, `Visetos` 같은 표현이
실제 제품 구조와 동일한 의미를 보장하지 않기 때문이다.

따라서 Core4 Classification에서는 실제 제품 Image / Description / Product Details / Structured Data를 사용한다.

---

# 6. null 처리

`null`은 새로운 Core4 Value가 아니다.

판정 근거가 부족하거나 기존 Value로 신뢰성 있게 분류할 수 없을 때 사용한다.

예:

```json
{
  "material": null
}
```

Matching 시:

- Value 존재 → 정상 비교
- `null` → 해당 축 비교 제외

`unknown`이라는 문자열을 Value로 두지 않는 이유는
두 제품의 `"unknown"` 값이 같다고 해서 실제 취향이 같다는 의미는 아니기 때문이다.

---

# 7. Validation Flow

Core4는 MCM 공식 제품 데이터를 수집·확인하여 단계적으로 검증했다.

```text
Schema Candidate
        ↓
Bags 30 Primary Validation
        ↓
Rule 수정
        ↓
Non-Bags 24 Cross-category Validation
        ↓
Holdout 19
(Color / Material / Monogram)
        ↓
구조적 Gap 수정
        ↓
Bags 30 Regression Check
        ↓
Silhouette Fresh Vision Holdout 10
        ↓
10 / 10 정상
        ↓
Core4 LOCK
```

### Phase 1 — Bags 30

초기 Core4 Value와 판정 Rule을 실제 MCM Bags 제품으로 검증.

### Phase 2 — Non-Bags 24

Shoes / Accessories / RTW / Lifestyle로 확장하여
Bags에서 만든 규칙이 다른 Category에서도 유지되는지 확인.

초기 수집 결과:

- 23개 확인
- 1개 NOT_FOUND

이 과정에서 Textile 범위, Product Details Monogram Evidence,
Silhouette의 Category-independent 정의를 보완했다.

### Phase 3 — Holdout 19

Color / Material / Monogram을 새로운 제품으로 검증.

- Color: **19 / 19**
- Material / Monogram: 일부 Extraction Gap 발견 후 최소 범위 수정

### Phase 4 — Regression

수정된 규칙 때문에 기존 Bags 30개의 정상 판정이 깨지지 않는지 재확인.

새 규칙으로 인한 새로운 구조적 Regression 없음.

### Phase 5 — Silhouette Vision Holdout

새로운 이미지 10개로 Vision 중심 검증.

**10 / 10 정상 / Misclassification 0**

---

# 8. Value를 더 늘리지 않은 이유

새로운 사례가 하나 발견될 때마다 Value를 추가하지 않는다.

새 Value는 다음 조건을 만족할 때만 고려한다.

- 반복적으로 등장하는가
- 기존 Value와 의미적으로 다른가
- 고객 취향 표현에 의미가 있는가
- Retrieval에 실제로 필요한가

기존 상위 Value로 의미 있게 통합할 수 있으면 기존 Value를 사용하고,
신뢰성 있게 표현할 수 없으면 `null` 처리한다.

---

# 9. Final Output

```json
{
  "color_tone": ["warm_neutral"],
  "silhouette_form": ["structured"],
  "material": ["signature_monogram"],
  "monogram_density": ["medium"]
}
```
복수값 예시:

```json
{
  "color_tone": ["mono"],
  "silhouette_form": ["structured"],
  "material": ["leather", "signature_monogram"],
  "monogram_density": ["none", "medium"]
}
```

판정 불가 축:

```json
{
  "color_tone": ["mono"],
  "silhouette_form": null,
  "material": ["leather"],
  "monogram_density": ["none"]
}
```

---

# 10. Final Decision

Core4는 다음 검증 과정을 완료했다.

**MCM 공식 제품 데이터 확인  
→ Bags Primary Validation  
→ Cross-category Validation  
→ Holdout  
→ Rule 보완  
→ Regression  
→ Vision Holdout**

현재 MVP 기준 Core4 Schema와 판정 규칙은 확정한다.

새로운 패턴이 향후 실제 데이터에서 **반복적으로** 확인되는 경우에만
별도 검증 후 Value 추가 여부를 재검토한다.

**Status: LOCKED**