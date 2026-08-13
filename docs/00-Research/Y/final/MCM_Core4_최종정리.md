# MCM Core4 최종 정리

처음에는 Core5를 목표로 했지만, 검증 결과 Design Language를 축에서 제외해서 최종은 **Core4**로 정리됐다.

---

## 1. Color / Tone 🔒

**무엇을 보는 축인가?**
제품의 대표 색이 어떤 색감의 성격을 가지는지 분류한다.

| 값 | 쉽게 말하면 | 판정 기준 |
|---|---|---|
| warm_neutral | 따뜻하고 무난한 색 | Cognac / Brown / Beige |
| cool_neutral | 차갑고 무난한 색 | 차가운 계열의 중립색 |
| muted | 탁하고 부드러운 색 | pastel / dusty / sage / sky / pale / powder / ash(y) / faded / blush / soft / khaki / moss / denim / olive / taupe 등 |
| saturated | 선명하고 쨍한 색 | 기본 Blue / Green / Pink / Orange 등 |
| mono | 검정·흰색처럼 색감이 거의 없는 색 | Black / White |

**판정 Rule**
- Cognac / Brown / Beige → warm_neutral
- Black / White → mono
- Orange → saturated
- Blue / Green / Pink → 기본적으로 saturated
- 단, Blue / Green / Pink의 컬러명에 muted 신호 단어가 있으면 → muted

**예외**
- Gold → 금속 장식 색이므로 Color/Tone 판정에서 제외하고 제품 몸체 색을 기준으로 판정
- Multi → 제품에서 면적이 가장 넓은 색을 기준으로 판정. 가장 넓은 색을 판단하기 어려우면 → saturated

**테스트**
- 실제 제품으로 2차 테스트 진행 → 미스 0건
- 🔒 최종 확정

---

## 2. Silhouette 🔒

**무엇을 보는 축인가?**
제품의 크기가 아니라 가방의 외형과 형태가 어떤 방식으로 만들어졌는지 분류한다.

| 값 | 쉽게 말하면 | 판정 기준 |
|---|---|---|
| structured | 각이 잡혀 있고 단단한 형태 | structured 등 형태를 직접 설명하는 표현 |
| soft | 부드럽고 자연스럽게 늘어지는 형태 | slouched / soft 등 |
| compact | 작고 단정한 형태 | compact 등 |

**판정 Rule**
1. 공식 제품 설명에 형태 표현이 있으면 → 그 표현을 우선. 예: `slouched silhouette` → soft
2. 형태 표현이 없으면 → 명확한 Category 매핑 사용. 현재 검증된 Category 매핑: Boston / Hobo / Belt Bag
Crossbody는 일괄 매핑하지 않고, 개별 제품에 명시적 형태 근거가 있을 때만 판정
Tote / Backpack / Weekender는 공식 근거 부족으로 보류

즉 기존 Rule 자체를 새로 만드는 게 아니라 Category 매핑 목록만 업데이트.

3. Category도 애매하고 형태 표현도 없으면 → 보류

**충돌 처리**
한 문장 안에 서로 반대되는 표현이 동시에 있어도, silhouette을 직접 수식하는 표현을 우선한다.
예: `slouched silhouette + balance of softness and structure` → slouched silhouette이 실루엣을 직접 설명하므로 soft

**oversized를 제외한 이유**
oversized는 형태가 아니라 크기(Size)를 의미하기 때문. 또한 실제 MCM 가방 공식 설명에서도 안정적인 oversized 근거를 확인하지 못해서 최종적으로 폐기.

**테스트**
- structured / soft / compact 실제 제품 테스트
- Category가 애매한 제품도 테스트
- 충돌 사례도 테스트, 애매하면 보류하도록 정상 작동
- 🔒 3값으로 최종 확정

---

## 3. Monogram Density 🔒

**무엇을 보는 축인가?**
제품에서 모노그램이 얼마나 강하게 또는 많이 드러나는지를 분류한다.

| 값 | 쉽게 말하면 | 판정 기준 |
|---|---|---|
| none | 모노그램이 없음 | 모노그램 언급 자체가 없고 부분 사용도 없음 |
| low | 모노그램이 일부에만 들어감 | 다른 소재와 Monogram이 혼합·부분 사용 |
| medium | 일반적인 정도의 모노그램 | 일반 Visetos / Embossed Monogram |
| high | 모노그램이 크거나 강하게 강조됨 | Maxi / Mega 등 확대된 패턴 |

**판정 Rule**
- 소재명에 모노그램 언급 없음 + 부분 사용 없음 → none
- `[소재] and Monogram [X]`처럼 혼합 사용 → low
- 일반 Visetos / Embossed Monogram → medium
- Maxi / Mega처럼 패턴이 확대되었다고 명시 → high

**주의**
Embossed Monogram은 처음에는 low로 예상했지만, 실제 공식 설명에서 대비되는 패턴임을 확인하여 medium으로 수정.

**테스트**
- none / low / medium / high 모두 실제 제품으로 테스트
- 경계 사례까지 확인, 미스 없이 작동
- 🔒 최종 확정

---

## 4. Material 🔒

**무엇을 보는 축인가?**
제품의 겉감(Body)이 어떤 소재인지 분류한다.

처음에는 가죽의 결/마감만 보려고 했지만, 실제 제품을 조사한 결과 Visetos canvas와 Nylon 등도 반복적으로 나타나 Body 소재 전체를 보는 방식으로 범위를 확장했다.

| 값 | 쉽게 말하면 | 판정 기준 |
|---|---|---|
| visetos_canvas | Visetos 패턴이 들어간 캔버스 소재 | Body에 Visetos monogram canvas |
| leather | 가죽 소재 | Body에 Calfskin / Grained leather / Nappa leather 등 |
| nylon | 나일론 소재 | Body에 Nylon / ECONYL® 등 |
| 보류 | 현재 3가지로 확실히 분류하기 어려운 소재 | 예: Diamond Jacquard |

**가장 중요한 Rule**

개별 제품 페이지의 `Body` 필드만 사용한다.

- Body → ⭕ 사용
- Trim → ❌ 사용하지 않음
- Lining → ❌ 사용하지 않음
- 페이지 전체에서 suede, leather 등의 단어 검색 → ❌ 사용하지 않음

예를 들어 `Microfiber lining with suede finish`가 있어도 이것은 안감에 대한 설명이므로 suede로 판정하지 않는다.

**Leather 처리**
현재는 Calfskin / Grained leather / Nappa leather → leather로 묶는다. Grained leather를 별도의 `grained_leather`로 나누기에는 현재 반복 근거가 부족하기 때문.

**보류 처리**
Diamond Jacquard는 실제 제품에서 확인됐지만 현재 반복 사례가 충분하지 않으므로 새 enum으로 추가하지 않고 보류한다.

**테스트**
- 실제 제품 18개 테스트
- 17개 → 정상 분류
- 1개 → Diamond Jacquard → 보류 (모르는 소재를 억지로 분류하지 않고 보류시키는 것까지 정상 작동한 것으로 봄)
- 🔒 `visetos_canvas` / `leather` / `nylon` 최종 확정

---

## 5. 보조 태그 — studded_or_collab

이건 Core 축이 아니다.

**무엇을 보는가?**
제품에 스터드 장식이나 공식 외부 협업이라는 강한 디자인 신호가 있는지만 기록한다.

| 값 | 쉽게 말하면 | 판정 기준 |
|---|---|---|
| true | 스터드가 있거나 공식 콜라보 제품 | 아래 조건 중 하나 충족 |
| false | 해당 신호 없음 | 조건에 해당하지 않음 |

**① 스터드**
제품명 또는 개별 제품 설명에 stud / studs / studded 어근이 등장하면 true. 현재는 rivet 등 다른 하드웨어 표현은 포함하지 않는다.

**② 콜라보**
공식 외부 브랜드/인물과의 콜라보만 인정한다. 현재 확인된 협업: MCM x DJ Khaled x We The Best. 협업은 이름에 x가 들어간다고 자동 판정하지 않고, 공식 협업 페이지에서 확인된 경우에만 수동으로 추가한다.

**용도**
- Core 취향 유사도 계산 → ❌
- 검색 → ⭕
- 필터 → ⭕
- 제품 설명 → ⭕

즉 Core 축은 아니지만 버리기 아까운 디자인 신호를 보조 데이터로 보존하는 것이다.

---

## 6. 제외된 후보

| 후보 | 제외 이유 |
|---|---|
| Size | Silhouette과 크기 개념이 겹침 |
| Hardware | 안정적으로 사용할 공식 데이터 근거 부족 |
| Category | 취향보다는 제품의 용도/종류에 가까움 |
| Design Language | 개별 제품에서 안정적인 Rule을 만들기 어려움 |

---

## 7. 최종 구조

```
🔒 Core4
├── Color/Tone
├── Silhouette
├── Monogram Density
└── Material

🏷️ 보조 정보
└── studded_or_collab
```

**가장 중요한 원칙**
- Core = 모든 제품에 안정적으로 적용할 수 있는 Rule 기반 속성
- 보조 태그 = 일부 제품에서만 의미가 있는 추가 정보

### 현재 상태

| 항목 | 상태 |
|---|---|
| Color/Tone | 🔒 확정 |
| Silhouette | 🔒 확정 |
| Monogram Density | 🔒 확정 |
| Material | 🔒 확정 |
| Design Language | ❌ Core에서 제외 |
| studded_or_collab | 🏷️ 보조 태그 |