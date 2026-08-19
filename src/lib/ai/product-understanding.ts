// TASK-201: Product Understanding Engine
// Source:
//   documents/[개발 문서] AI_CORE4_SCHEMA.md   (Core4 판정 규칙, Status: LOCKED)
//   documents/[개발 문서] 07_DATABASE_SCHEMA.md (product_profiles 출력 구조)
//
// Input: Product Image + Product Description (+ 선택적 Metadata)
// Process: OpenAI Multimodal LLM -> Core4 Classification -> AI Product Trait Discovery -> Evidence Extraction
// Output: Product Profile { Core4, AI Product Traits, Evidence }

// @ts-expect-error TS5097: 플레인 node로 직접 실행하기 위해 명시적 .ts 확장자를 유지한다
// (moduleResolution: "bundler"에서는 allowImportingTsExtensions 없이 tsc가 이를 거부하지만,
// 런타임 동작에는 영향이 없다).
import { getOpenAIClient } from "./openai-client.ts";
import {
  ProductProfileAiOutputSchema,
  ProductProfileValidationError,
  productProfileAiJsonSchema,
  type ProductProfileAiOutput,
  // @ts-expect-error TS5097: 위와 동일한 이유로 명시적 .ts 확장자를 유지한다.
} from "./product-profile.schema.ts";

export interface ProductUnderstandingInput {
  /** products.image_url */
  imageUrl: string;
  /** products.official_description */
  officialDescription: string;
  /** products.metadata (category, officialColor) — 선택적 보조 정보 */
  metadata?: {
    category?: string | null;
    officialColor?: string | null;
  };
}

export interface ProductProfileResult extends ProductProfileAiOutput {
  analysis_model: string;
  source: "ai_generated";
  is_current: true;
}

// AI_CORE4_SCHEMA.md 2~4장 판정 규칙 요약 (LOCKED)
function buildSystemPrompt(): string {
  return `당신은 MCM Product Understanding AI다. 제품 이미지와 공식 설명을 분석해 Core4, AI Product Trait, Evidence를 JSON으로 생성한다.

# Core4 (4개 축, 값은 정해진 Enum 또는 null만 허용한다)

공통 원칙:
- 사람이 정의한 Value 중에서만 선택한다. 새로운 Value를 만들지 않는다.
- 기본은 단일 Value다. Material과 Monogram Density만, reversible/detachable처럼 서로 독립적이고 "대등한"(동등한 비중의) 두 개 이상의 Main/Body 구조가 실제로 존재하고 각 구조의 값이 실제로 다를 때에 한해 배열로 복수 값을 허용한다. 제품 설명에 "detachable"이라는 단어가 있다는 사실만으로는 복수 값의 근거가 되지 않는다 — 그 detachable한 대상이 charm, strap, pull tab, pouch처럼 본체보다 작은 부속품이면 여전히 단일 Value이고, 두 개의 대등한 몸체(예: 분리해서 각각 독립적으로 쓸 수 있는 두 개의 백)일 때만 배열을 쓴다. 단순히 애매하다는 이유로 복수 값을 넣지 않는다.
- 판정 근거가 부족하면 억지로 분류하지 말고 null로 반환한다. null은 "확인했지만 해당 없음"이 아니라 "판단할 근거가 부족함"을 의미한다.
- Product Name(제품명)은 절대 판정 근거로 사용하지 않는다. Product Image와 Description(그리고 제공된 metadata)만 근거로 사용한다.

## colorTone: warm_neutral | cool_neutral | muted | saturated | mono | null
- warm_neutral: cognac/brown/beige 계열
- cool_neutral: grey 계열
- mono: black/white
- saturated: orange/red/blue/green/pink 중 "하나의" 선명한 색이 제품 전체 면적을 지배하는 대표색으로 확인될 때. 여러 색이 함께 섞여 있는 경우가 아니라, 단일 색상이 우세할 때만 해당한다.
- muted: 설명에 pastel, sky, dusty, soft, sage, pale, powder, ash, ashy, faded, blush, khaki, moss, olive, taupe 같은 단어가 있으면 base color보다 우선해 muted로 판정
- Denim은 muted 신호단어가 아니다. 단순히 어두운 색이라는 이유만으로 muted로 판정하지 않는다.
- Hardware(금속 장식)만 metallic이면 Body Color 판정에 사용하지 않는다. Body 자체가 metallic이고 신뢰성 있게 분류할 수 없으면 null.
- **Multi 처리 (중요)**: colorTone의 모든 값은 "하나의" 대표색이 객관적으로 특정될 때만 사용한다. 패턴이나 모노그램에 여러 색이 함께 섞여 있고(예: multicolor jacquard, multicolor print, rainbow, 여러 색이 혼합된 diamond/geometric 패턴 등) 그중 압도적으로 넓은 면적을 차지하는 단일색이 없다면, 이는 saturated가 아니라 Multi 상태이며 반드시 null로 판정한다. "이미지가 화려하다/선명하다/생동감 있다(vivid)"는 인상만으로 saturated를 고르지 않는다 — 색이 다양하다는 인상 자체가 오히려 null의 근거다. color 관련 메타데이터가 없고 설명에 "multicolor" 계열 표현이 있으면 이는 강한 null 신호다.
- 대표색을 신뢰성 있게 결정할 수 없으면 null.

## silhouetteForm: structured | soft | compact | envelope | null
- 크기가 아니라 "형태를 유지하는 방식"을 의미한다.
- envelope: near-zero depth, flat form
- structured: flat panel, angular junction, 구조적 형태 유지
- compact: continuous curved volume, taut surface, 고정된 volume
- soft: sagging, wrinkle, gravity-driven deformation
- Product Name과 Product Description은 이 축의 Runtime 판정 Evidence로 사용하지 않는다. 오직 Product Image만 근거로 판단한다.
- 착용 이미지만 있으면 착용자에 의한 변형보다 제품 자체 panel/seam/구조를 우선한다.
- 판정 근거가 부족하면 null.

## material: signature_monogram | leather | nylon | textile | null (또는 위 Multi-value 조건 만족 시 배열)
- 판단 순서: (1) 먼저 이 제품의 "본체(body)" — 가방/제품의 주된 수납 공간이나 겉면 전체를 이루는 부분 — 가 무엇으로 이루어져 있는지 하나의 소재로 식별한다. (2) 설명에 다른 소재가 언급돼 있다면 "제거 테스트"를 적용한다: 그 부분을 제거해도 제품의 형태와 본래 기능(수납 등)이 그대로 유지되면 그것은 charm/strap/pull tab/handle/pouch/hardware 같은 부속이다. 반대로 그 부분이 없으면 애초에 "두 가지 방식으로 쓸 수 있다"는 제품의 핵심 디자인 컨셉 자체가 성립하지 않는 경우(예: 분리해서 각각 독립된 가방으로 쓸 수 있는 detachable duo/reversible 구조)에만 그것은 대등한 두 번째 몸체다. (3) 부속이면 완전히 무시하고 본체 소재 하나만 사용한다.
- strap(어깨끈/손잡이 스트랩), charm(장식 참), pull tab, handle, pouch, hardware 장식은 "hands-free 착용을 위해", "고정을 위해" 같은 기능적 설명이 붙어 있어도 본체가 아니라 부속이다. 본체 소재 판정과 Multi-value 판단 모두에서 완전히 무시한다.
- 예시(문서 기준): "본체는 monogram canvas이고, 탈부착 가능한 leather logo charm과 hands-free 착용을 위한 leather strap이 딸려 있다" → charm과 strap을 제거해도 가방 본연의 형태·수납 기능은 그대로이므로 둘 다 부속이다. material은 signature_monogram 단일 값이다. 반대로 "Maxi Visetos canvas 몸체와 calfskin 몸체, 두 개의 detachable한 가방을 붙이거나 따로 착용할 수 있다"는 한쪽을 제거하면 '두 개로 분리되는 디자인'이라는 컨셉 자체가 사라지므로 대등한 두 번째 몸체이고, 이때만 material은 ["signature_monogram", "leather"]처럼 배열이 된다.
- **배열의 기본값은 "아니오"다.** 배열을 쓰려면 reversible / detachable equal parts / respectively / two-in-one / paired together / worn separately 처럼, 두 소재가 서로 독립적이고 대등한 Main/Body 구조에 각각 대응한다는 것을 가리키는 명시적 표현이 description에 있어야 한다. 이런 표현이 없다면, 설명이 단순히 "A로 만들어졌다", "A와 B로 sculpted/crafted 되었다", "A and B" 처럼 두 소재를 나열만 하고 있어도 — 그 소재가 어느 부위(손잡이·바닥·트림 등)인지 명시되지 않았더라도 — 배열의 근거가 되지 않는다. 이 경우 두 소재 중 본체(body) 표면을 이루는 것으로 가장 직접적으로 확인되는 소재 하나만 단일 값으로 선택한다(우선순위 규칙 적용). "두 소재가 함께 언급됨" 자체는 부속 여부를 판단할 근거가 없다는 뜻이지, 대등한 두 번째 몸체라는 근거가 아니다.
- 우선순위: signature_monogram > nylon > leather > textile > null
- signature_monogram: "monogram + canvas", "monogram + jacquard", "monogram + print", "Visetos + canvas" 같은 조합
- nylon: nylon, ECONYL
- leather: leather, suede, calfskin, lambskin, goatskin (Vegan Leather는 자동으로 leather에 포함하지 않는다)
- textile: fabric, wool, cotton, silk, polyester, spandex
- Rubber, TPU, Aluminum, Vegan Leather는 현재 null로 처리한다.

## monogramDensity: none | low | medium | high | null (또는 위 Multi-value 조건 만족 시 배열)
- high: Material 또는 Product Details에 리터럴 "Maxi"가 있을 때만. Mega, maximalist, oversized, enlarged는 high 근거로 사용하지 않는다. Product Name의 Maxi도 근거로 사용하지 않는다.
- medium: 제품 전체 Body/Pattern에 Visetos, Lauretos, Embossed Monogram, Diamond monogram jacquard, Diamond monogram motif, monogram print가 사용되고 Maxi 근거가 없을 때.
- low: 모노그램이 trim, accent, handle, pocket, specific compartment 등 특정 부분에 제한될 때. 이는 하나의 몸체 안에서의 부분적 사용이므로 배열 대상이 아니라 low 값 하나로 판정한다.
- none: 제품 정보를 확인했고 모노그램 근거가 없을 때.
- null: 모노그램 존재 여부를 판단할 근거 자체가 부족할 때.
- Multi-value 처리: 이 제품이 분리해서 각각 독립적으로 쓸 수 있는 두 개의 대등한 파트/몸체로 이루어져 있는지 직접 확인한다 (material 판정과 동일한 기준 — 그 파트를 제거하면 "두 가지 방식으로 쓸 수 있다"는 제품의 핵심 디자인 컨셉 자체가 사라지는 경우만 해당하며, charm/strap/pull tab/handle처럼 본체보다 작은 부속은 여기 포함되지 않는다). 그런 대등한 두 파트가 실제로 존재하면, 각 파트의 모노그램 근거를 따로따로 확인해 위 high/medium/low/none/null 기준으로 각 파트마다 독립적으로 판정한다 — 두 파트의 근거가 다르면 서로 다른 값이 나올 수 있다. 두 파트의 값이 실제로 다르면 배열로, 같으면 단일 값으로 기록한다. (예: 한쪽 파트 설명에 리터럴 "Maxi"가 있으면 그 파트는 high, 다른 파트에는 모노그램 근거가 전혀 없으면 그 파트는 none → ["high", "none"])
- 대등한 두 번째 몸체가 없는 경우(즉 material이 단일 값인 경우), 하나의 몸체 안에서 trim/accent/handle/pocket처럼 모노그램이 부분적으로만 쓰인 것은 Multi-value 대상이 아니다. 이 경우는 배열이 아니라 위 low 규칙을 그대로 적용한다.

# AI Product Trait (2~3개)
- AI Product Trait은 Core4(Color/Tone, Silhouette/Form, Material, Monogram Density)만으로는 설명하기 어려운, **이 제품에만 해당하는** 추가적인 디자인 방향/구조적 특징/사용 방식/문화적·스타일적 의미를 표현한다.
- Modern Heritage, Urban Functionality는 Trait이 어떤 "성격"의 표현이어야 하는지 보여주는 역할 설명용 예시일 뿐, 실제 출력 후보가 아니다. 이 단어(또는 그와 동일한 조합)를 실제 name으로 그대로 출력하지 않는다. 매번 이 제품의 실제 Evidence에서 새로 도출한 이름을 만든다.
- 금지: Trait 이름/reason이 Core4 축이나 축 값을 다른 말로 바꿔 재표현하는 것. 예: mono/monochrome을 "Monochrome Minimalism"으로, high monogram density를 "Maximal Monogram"으로, leather를 "Leather Luxury"로, structured를 "Structured Elegance"로 부르는 것처럼, Core4 값이나 그 축의 판정 근거(색, 실루엣 형태, 소재, 모노그램 밀도)를 이름만 바꿔 다시 말하는 모든 방식을 금지한다. Trait은 그 Core4 값들이 "왜/어떻게 이 제품만의 의미를 만드는지"를 설명해야지, 축 값 자체를 재진술해서는 안 된다.
- **자체 검토 절차**: 각 Trait 후보를 만든 뒤, 최종 출력하기 전에 이 제품에서 방금 판정한 Core4 4개 값(colorTone, silhouetteForm, material, monogramDensity)과 그 후보를 하나씩 비교한다. 그 Trait의 name이 Core4 값 자체이거나, 그 값을 가리키는 직접적인 동의어/자연어 표현(예: high monogram density → "maxi"/"maximal", mono → "monochrome", structured → "structured", leather → "leather" 등 축 값을 다른 단어로만 바꾼 표현)이면, 그 Trait은 Core4와 구별되지 않으므로 그대로 출력하지 않는다. 이 경우 해당 Trait을 버리고, 같은 제품의 description/evidence에서 Core4 4개 축이 아직 설명하지 않는 다른 구체적 특징(구조, 사용 방식, 문화적 참조, 디자인 서사 등)을 다시 찾아 대체한다. 이 검토는 일반 원칙이며 특정 제품명이나 특정 문자열에만 적용되는 예외가 아니다.
- 금지: 부속품이나 디테일을 그대로 이름으로 나열하는 것 (예: "Detachable Charm", "Leather Strap" 같은 이름은 금지). 그런 디테일은 evidence의 text로만 인용하고, name/reason은 그 디테일이 만들어내는 디자인적·브랜드적 의미로 종합해서 표현한다. 단순 기능/부속 목록 나열은 Trait이 아니다.
- 금지: Elegance, Luxury, Sophistication, Craftsmanship, Minimalism처럼 거의 모든 럭셔리 제품에 똑같이 붙일 수 있는 일반적인 단어만으로 name을 구성하는 것. 이런 단어 자체가 금지는 아니지만, 이 제품만의 구체적인 특징(구조, 사용 방식, 문화적 모티프 등)과 결합되지 않은 채 형용사만 갖다 붙이는 방식은 금지한다. name과 reason은 다른 제품에는 붙일 수 없고 이 제품에만 붙일 수 있는 이유를 설명해야 한다.
- 특히 "Craftsmanship"은 name에 기본값처럼 쓰지 않는다. Description에 craftsmanship, artisanal, exquisite craftsmanship 같은 표현이 실제로 등장하더라도, 그 단어를 그대로 옮기거나 요약해 name으로 쓰지 않는다. 그 문장이 가리키는 더 구체적인 대상(예: 특정 디테일, 마감 방식, 소재 조합 자체)이 있다면 그 구체적 대상으로 표현하고, 그럴 만한 새로운 관찰이 없다면 이 문구는 Trait 근거로 사용하지 않는다.
- 금지: Product Description의 문장을 거의 그대로 옮겨 name이나 reason으로 쓰는 것. name/reason은 이미지와 Description을 종합해서 만든 해석이어야 하며, 원문 문장을 살짝 바꾸는 수준의 재구성이 아니어야 한다. 원문 표현은 evidence의 text에만 인용한다. 특히 craftsmanship/artisanal 계열의 일반적인 품질 자랑 문구는 요약하지 말고, Trait의 근거로 삼을 만한 다른 구체적 문장이 없는지 먼저 찾는다.
- 금지: Core4 판정에 사용한 것과 같은 Evidence를 문장만 바꿔 그대로 Trait의 근거로 재사용하는 것. 특히 monogram/density, material, color, silhouette 자체를 가리키는 문장(예: 모노그램이 어디에 어떻게 쓰였는지, 소재가 무엇인지)만으로 Trait을 만들지 않는다. Trait은 Core4 축 판정에 쓴 것과 별개로, Core4가 다루지 않는 새로운 관찰(구조, 사용 방식, 문화적 참조, 디자인 서사 등)에 근거해야 한다.
- 각 Trait은 "이 제품이 다른 제품과 무엇이 다른가"를 한 문장으로 답할 수 있어야 한다. ai_product_traits는 반드시 2~3개를 채워야 하며, 개수가 부족하다는 이유로 Trait 생성을 생략하지 않는다 — 아래 금지 규칙을 지키는 범위 안에서 이미지와 설명을 다시 살펴 서로 다른 근거(구조, 사용 방식, 문화적 참조, 디자인 서사 등)를 최소 2개 찾아낸다.
- **개수 우선순위**: 이미지와 설명에 서로 겹치지 않는 독립적인 근거(구조, 사용 방식, 문화적 참조, 디자인 서사 등)가 3개 이상 실제로 확인되면, 2개가 아니라 3개를 출력하는 것을 우선한다 — 2개는 근거가 부족할 때만 선택하는 최소값이지 기본값이 아니다. 단, 숫자를 채우기 위해 근거가 약하거나 다른 Trait과 사실상 같은 내용을 반복하는 세 번째 Trait을 억지로 만들지 않는다. 3개 각각은 서로 다른 구체적 근거에 기반해야 하고, 위의 모든 금지 규칙(Core4 재표현, 부속품 나열, 일반 단어만 사용, 원문 그대로 복사 등)을 동일하게 지켜야 한다. 독립적인 근거가 실제로 2개뿐이면 2개만 출력한다.
- 각 Trait은 name, reason, evidence(최소 1개, {source, text})로 구성한다.
- reason은 이미지/설명에서 실제로 확인되는 근거에 기반해야 하며, 근거 없는 브랜드 의미를 부여하지 않는다.
- evidence.source는 "product_image" 또는 "product_description" 중 하나만 사용한다.

# 최상위 evidence
- Core4 판정을 뒷받침하는 근거를 최소 1개 이상 {source, text} 형태로 포함한다.

# 출력 형식
다른 설명 없이 아래 JSON 형식만 정확히 반환한다. ai_product_traits 배열은 반드시 2개 이상 3개 이하여야 한다.

{
  "core4": {
    "colorTone": "warm_neutral" | ... | null,
    "silhouetteForm": "structured" | ... | null,
    "material": "leather" | ["leather", "signature_monogram"] | null,
    "monogramDensity": "medium" | ["high", "none"] | null
  },
  "ai_product_traits": [
    { "name": string, "reason": string, "evidence": [ { "source": "product_image" | "product_description", "text": string } ] }
  ],
  "evidence": [
    { "source": "product_image" | "product_description", "text": string }
  ]
}`;
}

// AI_CORE4_SCHEMA.md 4.3/4.4: Multi-value는 각 파트의 값이 실제로 다를 때만 배열로 기록한다.
// OpenAI가 동일한 값을 중복 배열로 반환하는 경우가 있어, Zod 검증 전에 material/monogramDensity만
// 중복 제거해 정규화한다 (다른 값이 2개 이상 남으면 배열을 그대로 유지한다).
function collapseDuplicateArray(value: unknown): unknown {
  if (!Array.isArray(value)) return value;
  const unique = Array.from(new Set(value));
  return unique.length === 1 ? unique[0] : unique;
}

function normalizeCore4MultiValue(raw: unknown): unknown {
  if (typeof raw !== "object" || raw === null) return raw;
  const obj = raw as Record<string, unknown>;
  const core4 = obj.core4;
  if (typeof core4 !== "object" || core4 === null) return raw;
  const core4Obj = core4 as Record<string, unknown>;

  return {
    ...obj,
    core4: {
      ...core4Obj,
      material: collapseDuplicateArray(core4Obj.material),
      monogramDensity: collapseDuplicateArray(core4Obj.monogramDensity),
    },
  };
}

// AI_CORE4_SCHEMA.md 4.3 Multi-value 예외: "reversible, detachable equal parts, respectively 등
// 서로 독립적이고 대등한 Main/Body 구조"가 명시적으로 확인될 때만 배열을 허용한다.
// LLM이 material을 배열로 반환해도, description에 이런 구조적 근거가 없으면 배열을 그대로
// 인정하지 않고 문서의 판정 우선순위(4.3 "우선순위": signature_monogram > nylon > leather > textile)로
// 단일 Main/Body 값을 다시 결정한다. 새 규칙이 아니라 기존 LOCK 우선순위를 검증 단계에도 적용하는 것이다.
const MATERIAL_MULTI_VALUE_EVIDENCE_PATTERN =
  /\breversible\b|detachable\s+equal\s+parts|\brespectively\b|two[\s-]?in[\s-]?one|paired\s+together|worn\s+separately/i;

const MATERIAL_PRIORITY_ORDER = ["signature_monogram", "nylon", "leather", "textile"] as const;

function hasMaterialMultiValueEvidence(officialDescription: string): boolean {
  return MATERIAL_MULTI_VALUE_EVIDENCE_PATTERN.test(officialDescription);
}

function pickHighestPriorityMaterial(values: unknown[]): unknown {
  for (const candidate of MATERIAL_PRIORITY_ORDER) {
    if (values.includes(candidate)) return candidate;
  }
  return values[0];
}

// material이 배열인데 description에 Multi-value 구조 근거가 없으면, 문서의 판정 우선순위로
// 단일 Main/Body 값으로 되돌린다. 근거가 있으면(reversible/respectively/paired together 등) 배열을 그대로 둔다.
function validateMaterialMultiValueEvidence(normalized: unknown, officialDescription: string): unknown {
  if (typeof normalized !== "object" || normalized === null) return normalized;
  const obj = normalized as Record<string, unknown>;
  const core4 = obj.core4;
  if (typeof core4 !== "object" || core4 === null) return normalized;
  const core4Obj = core4 as Record<string, unknown>;

  if (!Array.isArray(core4Obj.material)) return normalized;
  if (hasMaterialMultiValueEvidence(officialDescription)) return normalized;

  return {
    ...obj,
    core4: {
      ...core4Obj,
      material: pickHighestPriorityMaterial(core4Obj.material),
    },
  };
}

// AI Product Trait 의미 품질: 시스템 프롬프트가 이미 금지하고 있는 규칙들이 prompt-only라
// 반복적으로 뚫리는 사례(Elegance/Sophistication류 일반 단어, Craftsmanship 표현의 설명 원문
// 그대로 복사, Core4 값의 단순 이름 변경, officialDescription에 존재하지 않는 evidence 생성)만
// code-level로 다시 한번 기계적으로 확인한다. 새로운 의미 판단 규칙을 추가하지 않는다.
// 아래 두 규칙(금지 일반 단어 / Craftsmanship 원문 복사)은 문서상 필수 구조 요건이 아니라
// 품질 권고 수준이라 정상일 가능성이 있는 Product Profile까지 hard FAIL시키지 않는다.
// 대신 soft warning(Task201TraitWarning)만 로그로 남기고 결과는 그대로 반환한다.
export interface TraitQualityWarning {
  traitName: string;
  rule: "generic_wording" | "craftsmanship_copied";
  message: string;
}

const BANNED_GENERIC_TRAIT_WORDS = /\b(elegance|sophistication)\b/i;

function collectBannedGenericWordWarnings(
  traits: ProductProfileAiOutput["ai_product_traits"]
): TraitQualityWarning[] {
  const warnings: TraitQualityWarning[] = [];
  for (const trait of traits) {
    if (BANNED_GENERIC_TRAIT_WORDS.test(trait.name)) {
      warnings.push({
        traitName: trait.name,
        rule: "generic_wording",
        message: "generic wording detected",
      });
    }
  }
  return warnings;
}

function normalizeForSubstringMatch(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// "Craftsmanship"은 프롬프트가 이미 "설명 원문을 그대로/요약해 name으로 쓰지 않는다"고
// 금지하는 특별 규칙이 있다. name 전체가 officialDescription 안에 (구두점만 다르게) 그대로
// 들어있는 경우만 경고한다 — Craftsmanship이라는 단어 자체를 금지하지 않는다.
function collectCopiedCraftsmanshipWarnings(
  traits: ProductProfileAiOutput["ai_product_traits"],
  officialDescription: string
): TraitQualityWarning[] {
  const normalizedDescription = normalizeForSubstringMatch(officialDescription);
  const warnings: TraitQualityWarning[] = [];
  for (const trait of traits) {
    if (!/craftsmanship/i.test(trait.name)) continue;
    const normalizedName = normalizeForSubstringMatch(trait.name);
    if (normalizedName.length > 0 && normalizedDescription.includes(normalizedName)) {
      warnings.push({
        traitName: trait.name,
        rule: "craftsmanship_copied",
        message: "craftsmanship phrase copied from description",
      });
    }
  }
  return warnings;
}

// Core4 재포장 판정을, 관찰된 나쁜 출력 문자열을 하나씩 등록하는 방식이 아니라 "이 제품이 실제로
// 가진 Core4 값 자체"에서 매번 자동으로 도출한다. trait.name만 대상으로 한다(오탐 축소를 위해
// reason/evidence 문장까지는 비교하지 않는다). 두 개의 일반 규칙 + 두 개의 좁은 예외로 구성된다:
//
// A) 값-토큰 전체 일치(모든 축·모든 값에 동일 적용): 이 제품의 축 값(예: "signature_monogram")을
//    "_" 기준으로 쪼갠 뒤, 그 조각들이 전부 trait.name에 "단어"로(부분 문자열이 아니라) 나타나면
//    재포장으로 본다. 새 값이 추가돼도 이 값 자체에서 매번 다시 계산되므로 별도 등록이 필요 없다.
// B) monogramDensity 축의 고유 의미: 이 축은 "모노그램이 얼마나 쓰였는가"를 나타낸다
//    (AI_CORE4_SCHEMA.md). 값이 "none"이 아니면(모노그램 존재가 이미 판정됐으므로) trait.name에
//    "monogram"이라는 단어가 있는 것 자체가 이 축이 이미 말한 사실의 재포장이다 — 특정 density
//    값이나 특정 문자열을 나열하지 않고, 이 축의 의미 하나로 low/medium/high 전부에 동일 적용된다.
// C) colorTone="mono"의 자연어 표현(mono/monochrome)과 D) monogramDensity="high"의 문서상
//    리터럴 트리거(Maxi/Maximal, AI_CORE4_SCHEMA.md 정의)는 값 문자열을 단순히 이어붙인 것이
//    아니라 불규칙한 표현이라 A)로 일반화되지 않는다. 이 두 개만 예외로 남긴다.
function splitCore4ValueIntoWords(value: string): string[] {
  return value.split("_").filter((word) => word.length > 0);
}

function nameContainsWholeWord(name: string, word: string): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(name);
}

function isValueWordRestatement(traitName: string, axisValue: string): boolean {
  const words = splitCore4ValueIntoWords(axisValue);
  return words.length > 0 && words.every((word) => nameContainsWholeWord(traitName, word));
}

const MONO_COLOR_TONE_PATTERN = /\bmono(chrome)?\b/i;
const MONOGRAM_HIGH_TRIGGER_PATTERN = /\bmaxi(mal)?\b/i;

// 07_DATABASE_SCHEMA.md 4.2: AI Product Trait은 2~3개를 기준으로 저장한다. Core4 재포장
// Trait은 Product Profile 전체를 FAIL시키지 않고, 그 Trait만 제외한다 — 제외 후에도 유효한
// Trait이 2개 이상 남으면 그 나머지로 정상 진행한다.
function isCore4RestatementTrait(
  trait: ProductProfileAiOutput["ai_product_traits"][number],
  core4: ProductProfileAiOutput["core4"]
): boolean {
  const axes: ReadonlyArray<keyof ProductProfileAiOutput["core4"]> = [
    "colorTone",
    "silhouetteForm",
    "material",
    "monogramDensity",
  ];

  for (const axis of axes) {
    const rawValue = core4[axis];
    if (rawValue === null) continue;
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];

    // A) 값-토큰 전체 일치 — 모든 축에 동일하게 적용되는 일반 규칙
    if (values.some((value) => isValueWordRestatement(trait.name, value))) {
      return true;
    }

    if (axis === "colorTone" && values.includes("mono") && MONO_COLOR_TONE_PATTERN.test(trait.name)) {
      // C) mono의 자연어 표현(monochrome)
      return true;
    }

    if (axis === "monogramDensity") {
      // B) monogramDensity 축 고유 의미: none이 아니면 "monogram" 단어 자체가 재포장
      if (values.some((value) => value !== "none") && nameContainsWholeWord(trait.name, "monogram")) {
        return true;
      }
      // D) high의 문서상 리터럴 트리거(Maxi/Maximal)
      if (values.includes("high") && MONOGRAM_HIGH_TRIGGER_PATTERN.test(trait.name)) {
        return true;
      }
    }
  }

  return false;
}

// 07_DATABASE_SCHEMA.md/AI_CORE4_SCHEMA.md 어디에도 "Trait evidence가 top-level evidence와
// 겹치면 안 된다"는 규칙은 없다 — 같은 공식 문장이 제품 전체 근거이면서 동시에 특정 Trait의
// 근거가 되는 것은 구조적으로 가능하다. 실제로 지켜야 할 것은 "evidence가 실제 입력에 존재하는가"
// (근거 없는 evidence를 지어내지 않는가)이지, "다른 evidence와 겹치지 않는가"가 아니다.
// source="product_description"인 evidence만 officialDescription 원문에 실제로 존재하는지
// (부분 문자열로) 확인한다. source="product_image"는 이미지 자체를 재검증할 수단이 없어
// 여기서 판단하지 않는다(source 값 자체는 이미 Zod가 enum으로 강제한다).
function findUngroundedTrait(
  traits: ProductProfileAiOutput["ai_product_traits"],
  officialDescription: string
): string | null {
  const normalizedDescription = officialDescription.trim();
  for (const trait of traits) {
    for (const evidence of trait.evidence) {
      if (evidence.source !== "product_description") continue;
      if (!normalizedDescription.includes(evidence.text.trim())) {
        return trait.name;
      }
    }
  }
  return null;
}

export class TraitQualityValidationError extends Error {
  constructor(message: string) {
    super(`AI Product Trait 품질 검증 실패: ${message}`);
    this.name = "TraitQualityValidationError";
  }
}

// Hard validation(구조/Core4 재포장/evidence 완전 재사용)을 통과한 뒤에도 남을 수 있는
// 품질 권고 수준 이슈를 warning으로 로그한다. product_id가 없는 컨텍스트(단위 테스트 등)에서도
// 호출 가능하도록 별도 인자로 받지 않고 trait name 기준으로만 식별한다.
function logTraitQualityWarnings(warnings: TraitQualityWarning[]): void {
  for (const warning of warnings) {
    console.warn(`[Task201TraitWarning] product trait "${warning.traitName}": ${warning.message}`);
  }
}

export interface TraitQualityResult {
  /** Core4 재포장 Trait을 제외하고 남은, 최종적으로 사용할 ai_product_traits. */
  traits: ProductProfileAiOutput["ai_product_traits"];
  warnings: TraitQualityWarning[];
}

export function validateTraitQuality(
  output: ProductProfileAiOutput,
  officialDescription: string
): TraitQualityResult {
  // Trait evidence(product_description)가 실제 officialDescription 원문에 존재하는지 확인한다.
  // top-level evidence와 겹치는지는 더 이상 판단하지 않는다(문서상 근거 없는 과잉 방어였음).
  const ungroundedTrait = findUngroundedTrait(output.ai_product_traits, officialDescription);
  if (ungroundedTrait) {
    throw new TraitQualityValidationError(
      `Trait "${ungroundedTrait}"의 evidence가 officialDescription 원문에 존재하지 않습니다.`
    );
  }

  // Core4 재포장 Trait만 걸러낸다. Product Profile 전체를 FAIL시키지 않는다.
  const remainingTraits = output.ai_product_traits.filter(
    (trait) => !isCore4RestatementTrait(trait, output.core4)
  );
  const removedCount = output.ai_product_traits.length - remainingTraits.length;

  if (remainingTraits.length < 2) {
    const removedNames = output.ai_product_traits
      .filter((trait) => isCore4RestatementTrait(trait, output.core4))
      .map((trait) => trait.name)
      .join(", ");
    throw new TraitQualityValidationError(
      `Core4 재포장 Trait(${removedNames})을 제외하면 유효한 Trait이 ${remainingTraits.length}개뿐입니다(최소 2개 필요).`
    );
  }

  if (removedCount > 0) {
    console.warn(
      `[Task201TraitWarning] ${removedCount}개 Trait이 Core4 재포장으로 제외됨, 남은 Trait ${remainingTraits.length}개로 진행`
    );
  }

  const warnings = [
    ...collectBannedGenericWordWarnings(remainingTraits),
    ...collectCopiedCraftsmanshipWarnings(remainingTraits, officialDescription),
  ];
  logTraitQualityWarnings(warnings);
  return { traits: remainingTraits, warnings };
}

// 문서에 명시된 값이 아닌 기본 설정값. OPENAI_MODEL 환경변수로 오버라이드할 수 있다.
const DEFAULT_MODEL = "gpt-4o-mini";

interface VisionJsonRequest {
  systemPrompt: string;
  userText: string;
  imageUrl: string;
  temperature?: number;
}

// 공용 openai-client.ts(getOpenAIClient)의 SDK 인스턴스를 사용해 Vision + JSON 응답을 요청한다.
// 모델 선택, 요청 형태(vision/JSON mode)는 Product Understanding 고유 관심사라 공용 client
// 파일이 아니라 이 파일 안에서 다룬다 (event-meaning-analysis.ts와 동일한 패턴).
//
// response_format은 plain json_object가 아니라 OpenAI Structured Outputs(json_schema, strict)를
// 사용한다 — product-profile.schema.ts의 productProfileAiJsonSchema가 ai_product_traits
// 2~3개(그 외 core4/evidence 구조)를 API 출력 단계에서부터 강제하며, 이후 Zod 검증과
// 동일한 제약을 이중으로 적용한다.
async function callVisionJson(req: VisionJsonRequest): Promise<{ data: unknown; model: string }> {
  const model = process.env.OPENAI_MODEL ?? DEFAULT_MODEL;

  const response = await getOpenAIClient().chat.completions.create({
    model,
    temperature: req.temperature ?? 0,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "product_profile",
        strict: true,
        schema: productProfileAiJsonSchema,
      },
    },
    messages: [
      { role: "system", content: req.systemPrompt },
      {
        role: "user",
        content: [
          { type: "text", text: req.userText },
          { type: "image_url", image_url: { url: req.imageUrl } },
        ],
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI 응답에 content가 없습니다.");
  }

  try {
    return { data: JSON.parse(content), model };
  } catch {
    throw new Error(`OpenAI 응답을 JSON으로 파싱할 수 없습니다: ${content}`);
  }
}

function buildUserPrompt(input: ProductUnderstandingInput): string {
  const metadataLines: string[] = [];
  if (input.metadata?.category) metadataLines.push(`category: ${input.metadata.category}`);
  if (input.metadata?.officialColor)
    metadataLines.push(`officialColor: ${input.metadata.officialColor}`);

  return [
    "아래 제품을 분석해 Core4, AI Product Traits, Evidence를 생성하라.",
    "",
    `Product Description: ${input.officialDescription}`,
    ...(metadataLines.length > 0 ? ["", "Metadata:", ...metadataLines] : []),
    "",
    "첨부된 이미지가 이 제품의 대표 이미지다.",
  ].join("\n");
}

export async function analyzeProduct(
  input: ProductUnderstandingInput
): Promise<ProductProfileResult> {
  if (!input.imageUrl) throw new Error("imageUrl은 필수입니다.");
  if (!input.officialDescription) throw new Error("officialDescription은 필수입니다.");

  const { data: raw, model } = await callVisionJson({
    systemPrompt: buildSystemPrompt(),
    userText: buildUserPrompt(input),
    imageUrl: input.imageUrl,
  });

  const normalized = normalizeCore4MultiValue(raw);
  const materialValidated = validateMaterialMultiValueEvidence(normalized, input.officialDescription);
  const parsed = ProductProfileAiOutputSchema.safeParse(materialValidated);
  if (!parsed.success) {
    // 07_DATABASE_SCHEMA.md 4.2: 검증에 실패한 AI 결과는 저장하지 않는다 -> 결과를 반환하지 않고 오류를 던진다.
    throw new ProductProfileValidationError(parsed.error.issues);
  }

  // Zod는 구조만 검증한다. AI Product Trait의 의미 품질(금지 단어/설명 원문 복사/Core4 재포장/
  // evidence 중복)은 별도로 다시 확인한다. Core4 재포장 Trait은 제외 후 남은 것만 사용하고,
  // evidence 완전 재사용은 여전히 결과 전체를 반환하지 않고 오류를 던진다.
  const { traits: validatedTraits } = validateTraitQuality(parsed.data, input.officialDescription);

  return {
    ...parsed.data,
    ai_product_traits: validatedTraits,
    analysis_model: model,
    source: "ai_generated",
    is_current: true,
  };
}
