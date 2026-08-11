# 사례 리서치 — "데이터 → 개인 브랜드 정체성" 엔진과 그 서비스화

> 조사일: 2026-08-10. 대상 가설: **"도시별 MCM 문화 + 개인의 구매·관심 데이터를 해석해 개인에게 맞는 MCM Identity를 생성한다."**
>
> **목적:** 이런 엔진을 실제로 만든 브랜드가 있는가, 그것을 어떻게 서비스로 만들었는가, 무엇이 실패했는가.
>
> **⚠️ 이 문서는 사례 조사다.** `43`을 수정하지 않고, Solution을 새로 만들지 않는다.
>
> **근거 수준:** `Fact` = 출처에서 직접 확인. `Inference` = 복수 사실 연결. `Hypothesis` = 미검증.

---

# Part 0. 가장 먼저 말해야 할 발견

> ## 🔴 조사한 "정체성 생성" 사례의 대부분은 **서비스가 아니라 캠페인**이다.

| 유형 | 사례 | 주기 | MCM 기준 판정 |
| --- | --- | --- | --- |
| **정체성 `생성`형** | Spotify Wrapped · adidas Ozworld · Nike A.I.R. · Coca-Cola Create Real Magic | **연 1회 또는 일회성** | 🔴 **`18` P-02가 경계한 One-off** |
| **정체성 `축적`형** | Stitch Fix Style Shuffle · L'Oréal Beauty Genius · Mytheresa VIP 예측 | **상시** | 🟢 LTV와 연결 |

**MCM은 명시적으로 전자를 경계했다** — **"AR/XR 혹은 다른 미디어 경험도 한 번 반짝 one-off 하고, 그 시효가 다하는 경우가 많이 있습니다"** [QA-1-3, **A급 공식**].

**→ "MCM Identity를 생성한다"는 아이디어는 그 자체로 Wrapped 계열, 즉 캠페인 문법에 속한다.** 서비스로 만들려면 **생성이 아니라 축적** 쪽으로 설계돼야 한다(Inference·높음). 이것이 이번 조사의 가장 중요한 결론이다.

---

# Part 1. 아키타입 5개 + 인프라 1개

---

## 🅰️ 아키타입 1 — 행동 데이터 → 이름 붙은 정체성 (Spotify Wrapped)

### 사례: Spotify Wrapped · Sound Town · Audio Aura

| 항목 | 내용 |
| --- | --- |
| **엔진 구조** | 1년치 스트리밍 이력 → 통계 추출 → **이름 붙은 정체성 라벨** + 공유 가능한 시각물 |
| **🟢 도시 축 — Sound Town (2023)** | **사용자의 최다 스트리밍 아티스트 × 그 아티스트가 다른 도시에서 스트리밍되는 방식**으로 매칭. **전 세계 1,300개 이상 도시**가 Sound Town이 됐다 [Fact] |
| **서비스화 방식** | 앱 내 연 1회 인앱 스토리 → **소셜 공유 자산으로 설계** |
| **결과** | **2023년 TikTok #SpotifyWrapped 해시태그 737억 뷰** [Fact] |
| **왜 작동했는가** | ① **정체성을 지위로 바꾼다** — 무명 인디 아티스트가 top 5에 있으면 나를 차별화한다 ② **브랜드가 자기 얘기를 하지 않고 사용자가 자기 얘기를 하게 한다** ③ **의례(ritual)가 됐다** |
| **카피캣** | Starbucks · Duolingo · Tinder · Apple Music · Reddit · Uber — **"어느 것도 같은 수준의 문화적 임팩트를 내지 못했다"** [Fact] |

### 🔴 Sound Town의 예상치 못한 결과 — 정체성 생성의 위험

**퀴어로 정체화하는 다수의 사용자가 세 개 대학 도시(Burlington·Cambridge·Berkeley)에 배정됐다.** Spotify는 Sound Town이 **"객관적이며 전적으로 사용자의 청취 이력에 의해 구동된다"**고 밝혔지만, **취향 매칭만으로 의도치 않은 정체성 지표가 만들어졌다** [Fact].

**→ MCM 시사점(Inference·높음): 개인 식별 데이터를 쓰지 않아도, 취향 기반 정체성 생성은 민감한 속성을 드러낼 수 있다.** `18` G-09(Privacy)와 GATE-1은 "식별자를 쓰지 않는다"만으로 충족되지 않는다.

---

## 🅱️ 아키타입 2 — 질문 → 생성된 아바타 (adidas Ozworld)

### 사례: adidas Originals × Ready Player Me (2022)

**이번 조사에서 사용자 가설과 구조적으로 가장 가까운 사례다.**

| 항목 | 내용 |
| --- | --- |
| **무엇을 했나** | **세계 최초 성격 기반 AI 생성 아바타 플랫폼**. Ozworld 슈즈 컬렉션과 연동 [Fact] |
| **엔진 구조** | 성격 질문 세트 → AI 알고리즘이 **Ozworld 3개 실루엣에서 영감받은 고유 아바타 생성** |
| **서비스화 방식** | ① 아바타 애니메이션 ② **디지털 착용 및 실제 구매** ③ **스티커·GIF로 다운로드해 SNS에 사용** ④ **Ready Player Me 아바타를 지원하는 1,500개 이상 메타버스 앱·게임과 상호운용** |
| **결과** | **1,000만 개 고유 조합**, **첫 10일간 428,000개 아바타 생성** [Fact] |
| **🔑 핵심 설계** | **산출물을 고객이 가져갈 수 있게 만들었다** — 다운로드 가능, 타 플랫폼에서 사용 가능 |

**→ MCM 시사점:** **"정체성을 생성한다"가 작동하려면 산출물이 브랜드 안에 갇히면 안 된다.** `43`의 Pass가 고객 기기에 남는 설계와 같은 원리다(Inference).

**⚠️ 그러나 이것은 컬렉션 출시에 맞춘 캠페인이었다.** 지속 사용 구조가 아니다.

---

## 🅲 아키타입 3 — 개인 데이터 → 생성된 제품 (Nike A.I.R.)

### 사례: Nike Athlete Imagined Revolution (2024)

| 항목 | 내용 |
| --- | --- |
| **무엇을 했나** | **13명 최정상 선수**(Sha'Carri Richardson · Kylian Mbappé 등)의 **요청과 성격**을 바탕으로 프로토타입 슈즈 제작 [Fact] |
| **엔진 구조** | 선수 심층 인터뷰 → **선호와 개인 서사를 AI 프롬프트로 변환** → 생성 모델이 **선수당 수백 개 시각물** → 디자이너가 단일 컨셉으로 압축 → 3D 스케치·프린팅 |
| **🔑 핵심 효과** | **"선수에게 보여 주기까지 보통 몇 주~몇 달 걸리던 것이 이제 몇 시간"** [Fact] |
| **서비스화 방식** | 🔴 **서비스가 아니다.** 2024 파리 올림픽 직전 공개된 **쇼케이스** |
| **MCM 시사점** | **개인의 서사를 프롬프트로 변환하는 구조**는 이식 가능하나, **13명을 위한 것이지 대량 고객을 위한 것이 아니다** |

---

## 🅳 아키타입 4 — 브랜드 자산 → 고객 창작 (Coca-Cola)

### 사례: Create Real Magic (2023, OpenAI + Bain)

| 항목 | 내용 |
| --- | --- |
| **엔진 구조** | GPT-4 + DALL·E. **Coca-Cola가 승인된 브랜드 자산을 제공**(컨투어 보틀·타이포그래피·폴라베어 등 아카이브 요소) → 사용자가 프롬프트로 창작 |
| **🔑 핵심 설계** | **브랜드가 자산을 열되 경계를 정했다** — 무제한 생성이 아니라 **승인된 자산 안에서의 생성** |
| **서비스화 방식** | ① 웹 플랫폼 ② **타임스퀘어·피카딜리서커스 디지털 빌보드에 선정작 게시** ③ **30명을 애틀랜타 본사 Real Magic Creative Academy에 초청해 공동 창작** |
| **결과** | 후속 산타 캠페인에서 **3주간 43개 시장 100만+ 사용자 상호작용** [Fact] |
| **MCM 시사점** | 🟢 **`18` G-03(Silhouette)·G-04(Craftsmanship) 방어에 직접 참고 가능** — MCM도 **로고·제품 이미지 사용이 허용**돼 있고 [QA-5-1], **과거 콜라보·연예인 에셋은 권리 확인 필요**하다 [QA-2-2]. "승인 자산 안에서만 생성"이 검증된 패턴이다 |

---

## 🅴 아키타입 5 — 행동 → 지속 프로필 (유일하게 `서비스`인 계열)

### 사례 ① Stitch Fix — Style Shuffle

| 항목 | 내용 |
| --- | --- |
| **엔진 구조** | 사용자가 아이템·룩 이미지에 **좋아요/싫어요** → **매일 새 데이터가 추천 모델에 투입**. 서면 피드백, Pinterest 등 외부 engagement도 입력 [Fact] |
| **🔑 핵심 철학** | **"AI·ML은 스타일리스트를 대체하는 것이 아니라 스타일리스트를 위해 복무한다"** [Fact] |
| **서비스화** | Style Shuffle · Style File · Stitch Fix Vision · Shop Your Looks의 **상시 기능군** |
| **MCM 시사점** | 🟢 **`18` 인간 어드바이저 대체 금지 원칙과 정합.** `28`의 럭셔리 근거(지연 구매 회복 메커니즘 = 어드바이저 관계)와도 일치 |

### 사례 ② L'Oréal Paris — Beauty Genius (2024)

| 항목 | 내용 |
| --- | --- |
| **엔진 구조** | 생성 AI + AR. **피부과 전문의 주석 15만 건**으로 학습, 50개국 1만+ 제품으로 메이크업 아티스트 테스트. **셀피로 10개 이상 피부 파라미터 분석 + 질문 응답 해석** [Fact] |
| **문제 정의** | **"소비자의 70%가 스킨케어·메이크업·헤어케어 선택지의 양에 압도된다고 느낀다"** [Fact] |
| **서비스화** | 상시 앱 → **2026년 Meta 제휴로 WhatsApp 배포 예정** — 고객이 이미 쓰는 채널로 이동 |
| **MCM 시사점** | 🟡 **진단형이다.** `18` P-04(오프라인=정서, 온라인=정확도)와 `20` X-11(매장 내 정밀 측정 금지)에 비춰 **오프라인 MCM에는 그대로 이식 불가** |

### 사례 ③ 럭셔리 이커머스 — LuxExperience (Mytheresa · Net-a-Porter · Mr Porter · Yoox)

| 항목 | 내용 |
| --- | --- |
| **엔진 구조** | AI로 **어떤 쇼퍼에게 더 많은 사람의 관심을 배분할지 식별** — **미래 VIP 예측** [Fact] |
| **🔑 성격** | 🔴 **고객 대면 정체성 생성이 아니라 백엔드 우선순위 판단** |
| **MCM 시사점** | `36`에서 S2-B(직원 증폭, 64점)가 낮은 평가를 받은 것과 같은 범주다 |

---

## 🏗️ 인프라 층 — Digital Product Passport (`43`의 Pass와 직결)

**이번 조사에서 가장 실무적으로 중요한 발견이다.**

### Aura Blockchain Consortium

| 항목 | 내용 |
| --- | --- |
| **설립** | 2021년 **LVMH · OTB Group · Prada Group · Cartier(Richemont) · Mercedes-Benz** [Fact] |
| **규모** | **등록 제품 5,000만 개 돌파**, **회원사 50곳** [Fact] |
| **🔑 구조** | 제품이 **NFC 칩으로 접근 가능한 불변 추적 토큰**에 연결되고, **고객은 두 번째 토큰 — 물리 제품의 디지털 트윈 — 을 청구해 소유 증명을 갖는다** [Fact] |
| **다루는 범위** | 업스트림(생산·소싱) + **다운스트림(로열티 프로그램 · 보험 · 수선 · 리세일)** [Fact] |

### EU Digital Product Passport (텍스타일)

| 항목 | 내용 |
| --- | --- |
| **시점** | **텍스타일 DPP 요건은 2027년 예상**, ESPR 하에 **EU에서 판매되는 모든 제품에 표준 식별자 부착 의무** [Fact] |
| **적용 범위** | **브랜드 본사 위치와 무관하게 EU 시장에 텍스타일·신발을 유통하는 모든 브랜드** [Fact] |
| **접근 방식** | **QR로 접근 가능한 데이터** |
| **업계 해석** | **"컴플라이언스에만 집중하면 더 큰 DPP 기회 — 고객 관계 개선 — 을 놓친다"** [Fact] |

### 🟢 MCM 시사점 — `43`의 Pass는 공상이 아니다

| # | 함의 |
| --- | --- |
| **1** | **"고객이 제품의 디지털 짝을 소유한다"는 개념이 이미 럭셔리 표준 인프라로 5,000만 제품 규모로 존재한다.** `43`의 Biggest Risk("고객이 Pass를 등록·보관할 것")가 **업계 관행 근거를 얻는다** |
| **2** | **규제 타임라인이 이 방향을 밀고 있다.** 2027년 텍스타일 DPP는 MCM에도 적용된다 |
| **3** | **Aura가 다운스트림에 `로열티·수선·리세일`을 명시**했다 — **소유 이후의 관계**가 DPP의 설계 의도 안에 있다 |
| **4** | 🔴 **그러나 DPP는 `제품의 정체성`이지 `고객의 정체성`이 아니다.** 사용자 가설("개인 MCM Identity 생성")과는 다른 축이다 |

---

# Part 2. 도시·지역 문화를 개인화 축으로 쓴 사례

| 사례 | 구조 | 등급 |
| --- | --- | --- |
| **🟢 Spotify Sound Town** | 개인 취향 × **도시별 소비 패턴** 매칭. 1,300+ 도시 | **직접 선례 — 유일** |
| **🟡 Popeyes "Wrap Battle"** | AI가 **미국 도시별 트렌딩 대화**에 맞춰 디스트랙 가사·비주얼 생성 | 도시 적응형이나 개인화 아님 |
| **🟡 하이퍼로컬 브랜딩 플랫폼** | 지역 트렌드·문화 가치·계절 리듬을 분석해 마케팅 커스터마이즈 | B2B 툴, 브랜드 사례 아님 |

### 🔴 공백

**럭셔리 브랜드가 `도시별 브랜드 문화`를 개인화 입력으로 쓴 사례를 이번 조사에서 확인하지 못했다.**

**두 가지로 해석할 수 있다(둘 다 미검증):**

| 해석 | 함의 |
| --- | --- |
| **기회다** | 아무도 안 했다 → 차별화 |
| **이유가 있다** | 럭셔리는 **글로벌 일관성**이 자산이므로 도시별 문화 분화가 브랜드에 역행할 수 있다 |

**⚠️ 후자를 경계해야 한다.** `18` G-02(UVP)와 MCM의 **"브랜드 평판, Unique Value Proposition"** [QA-4-2, A급 공식]을 고려하면, **"도쿄의 MCM"과 "베를린의 MCM"이 다르다고 말하는 것은 UVP를 희석할 수 있다**(Inference·중간). 검증 없이 전제하면 안 된다.

---

# Part 3. 서비스화 패턴 — 엔진을 어떻게 서비스로 만들었나

| # | 패턴 | 사례 | MCM 적용 가능성 |
| --- | --- | --- | --- |
| **P-1** | **산출물을 고객이 가져갈 수 있게 한다** | Ozworld(다운로드·1,500개 앱 상호운용) · Wrapped(공유 자산) | 🟢 **`43` Pass와 동일 원리** |
| **P-2** | **브랜드 자산을 열되 경계를 정한다** | Coca-Cola(승인 자산 안에서만 생성) | 🟢 G-03·G-04·G-11 방어에 직결 |
| **P-3** | **AI를 사람 뒤에 둔다** | Stitch Fix("스타일리스트를 위해 복무") | 🟢 `28` 어드바이저 근거와 정합 |
| **P-4** | **고객이 이미 쓰는 채널로 간다** | Beauty Genius → WhatsApp(2026) | 🟢 **공항 Wallet 은유와 같은 논리** |
| **P-5** | **매일 데이터를 갱신한다** | Style Shuffle | 🟡 MCM은 상시 접점이 없다 |
| **P-6** | **제품에 디지털 트윈을 붙인다** | Aura DPP(5,000만 개) | 🟢 **`43`의 인프라 근거** |
| **P-7** | **의례(ritual)로 만든다** | Wrapped(연 1회 고정) | 🔴 **연 1회 = MCM이 경계한 one-off** |

---

# Part 4. 실패와 리스크 — 반드시 봐야 할 두 가지

## 🔴 실패 사례 — Spotify Wrapped 2024

**10주년에 AI를 대폭 넣었고 역풍을 맞았다.**

| 무엇이 문제였나 | 내용 |
| --- | --- |
| **AI 팟캐스트** | Google NotebookLM 기반 음성 요약. **"공허한 관찰(empty observations)"**, 인사이트가 **일반적(generic)**, 인간 말투 모방이 **거슬린다**는 반응 [Fact] |
| **기존 요소 삭제** | **Sound Town과 Audio Aura가 빠졌고** 최다 장르·최다 앨범도 제공되지 않았다. 대신 창작된 마이크로 장르 목록 [Fact] |
| **반응** | TikTok·X·Reddit이 불만으로 가득 찼다 — 평소의 축하 게시물과 정반대 [Fact] |

### 🔑 이 실패에서 나오는 교훈 세 개 (Inference·높음)

| # | 교훈 |
| --- | --- |
| **1** | **정체성 생성은 정확도가 아니라 `맞다고 느끼는가`에 달려 있다.** AI 팟캐스트는 틀리지 않았지만 공허했다 |
| **2** | **AI를 더 넣는다고 좋아지지 않는다.** 2023(Sound Town, 사람이 설계한 매칭 로직)이 2024(생성 AI)보다 사랑받았다 |
| **3** | **🔴 없어진 것이 추가된 것보다 크게 느껴진다.** 삭제가 추가를 압도했다 |

**→ MCM 직결(Inference·높음): `21` E-11(Demo & Experience Design)과 `18` G-06(기분 좋은 경험)의 관점에서, "AI가 당신의 MCM Identity를 생성했습니다"가 공허하게 느껴지는 순간 역효과가 난다.** Wrapped 2024는 **바로 그 실패의 실측 사례**다.

## 🔴 커모디티화 리스크 — 목적지 기반 AI는 이미 앱스토어에 널려 있다

| 확인된 서비스 | 구조 |
| --- | --- |
| TripPack AI · Pack Papi · Packy · PackNinja · PackMate | **목적지 · 날씨 · 기간 · 활동 · 여행 스타일**을 분석해 개인화 목록 생성 [Fact] |

그리고 업계 문서는 **"여행용품 이커머스가 패킹 AI를 통합해 패킹 과정 안에서 자사 제품을 추천할 수 있다"**고 직접 서술한다 [Fact].

### 🔴 이것이 `43`에 주는 경고

> **MCM이 "무엇을 챙길지"로 한 발이라도 가면 즉시 무료 앱과 같은 범주가 된다.**

**`43`의 규칙 R-6(여정 자체에 대한 조언을 한 줄도 하지 않는다)이 취향이 아니라 생존 조건임이 확인됐다**(Inference·높음). 그리고 `42` Q7의 판별선 — **"여행 앱은 여정이 주인공이고, 이것은 물건이 주인공이다"** — 이 유일한 방어선이다.

---

# Part 5. 사용자 가설에 대한 판정

> **가설: "도시별 MCM 문화 + 개인의 구매·관심 데이터를 해석해 개인에게 맞는 MCM Identity를 생성한다."**

| 축 | 판정 | 근거 |
| --- | --- | --- |
| **선례가 있는가** | 🟡 **부분적.** 구조적으로 가장 가까운 것은 **adidas Ozworld**(성격 → AI 아바타)와 **Spotify Sound Town**(개인 취향 × 도시). **럭셔리에서 이 조합을 한 사례는 확인하지 못했다** | Part 1·2 |
| **서비스화 가능한가** | 🔴 **조사한 정체성 `생성` 사례는 전부 캠페인이다.** 서비스로 지속된 것은 정체성을 생성하지 않고 **축적**하는 계열(Stitch Fix·Beauty Genius)뿐 | Part 0 |
| **MCM 기준 통과하는가** | 🔴 **P-7(의례화 = 연 1회)이 `18` P-02·`20` X-03(One-off)과 정면 충돌한다** | [QA-1-3, A급 공식] |
| **"도시별 브랜드 문화" 축은 안전한가** | 🟡 **미검증.** 럭셔리는 글로벌 일관성이 자산이므로 도시별 분화가 **G-02 UVP를 희석할 수 있다** | Part 2 |
| **"개인 구매 데이터" 축은 통과하는가** | 🟡 **조건부.** Sound Town 사례가 보여주듯 **식별자를 안 써도 민감 속성이 드러날 수 있다.** GATE-1은 "식별자 미사용"만으로 충족되지 않는다 | Part 1 🅰️ |
| **가장 큰 실패 위험** | 🔴 **Wrapped 2024** — 생성된 정체성이 **공허하게 느껴지는 순간** 역효과 | Part 4 |

## 🟢 반대로, 이번 조사가 `43`을 지지한 것

| # | 내용 |
| --- | --- |
| **1** | **`43`의 Pass = DPP.** LVMH·Prada·Cartier가 5,000만 제품 규모로 이미 하고 있고, **고객이 디지털 트윈을 소유해 소유 증명을 갖는 구조**가 표준이다. **`43`의 최대 위험이 업계 관행 근거를 얻었다** |
| **2** | **2027년 EU 텍스타일 DPP 의무화**가 MCM에도 적용된다 — 규제가 이 방향을 밀고 있다 |
| **3** | **Aura가 다운스트림에 로열티·수선·리세일을 명시**했다 — **소유 이후의 관계**가 설계 의도에 포함돼 있다 |
| **4** | **P-1(산출물을 고객이 가져가게 한다)**이 Ozworld·Wrapped에서 공통으로 확인됐다 — `43`의 "고객 기기 저장" 설계와 같은 원리 |
| **5** | **P-4(고객이 이미 쓰는 채널로 간다)** — Beauty Genius의 WhatsApp 이동은 `39` §5.2의 Wallet 논리와 같다 |

## 🔑 종합

> **"MCM Identity를 생성한다"는 방향은 캠페인으로는 검증된 문법이지만, MCM이 요구한 `지속적 사용 이유`와는 구조적으로 충돌한다.**
>
> **반면 `43`이 이미 택한 방향 — 고객이 소유한 제품의 디지털 짝을 여정마다 재해석하는 것 — 은 럭셔리 업계가 5,000만 제품 규모로 인프라를 깔아 둔 곳이다.**

**→ Identity를 `생성`하지 말고, 소유물과 여정이 쌓이며 Identity가 `드러나게` 하는 편이 MCM 기준에 맞는다**(Inference·중간~높음). 이것은 `42` C-2(The Unrepeated Scene)·D-1(Traveler Signature)이 이미 제안한 방향이며, **이번 조사가 그 방향에 외부 근거를 준 것**이다.

---

## 조사의 한계

1. **MCM Worldwide 자체의 AI 사례를 확인하지 못했다.** 검색 결과가 동명 기관(MCMC·MCM/ICM 등)으로 오염됐다. **기존 코퍼스의 "MCM 공개 AI는 수요예측 계획뿐" 판정을 갱신할 근거를 얻지 못했다.**
2. **대부분 근거가 B급(업계 매체·벤더 자료)이다.** A급 1차 자료(브랜드 공식 발표·연차보고서)를 직접 열람한 것은 일부다.
3. **캠페인 성과 수치는 브랜드·벤더 발표치**이며 독립 검증이 아니다 (Ozworld 428k, Wrapped 737억 뷰, Coca-Cola 100만+).
4. **럭셔리에서 "도시 문화 × 개인 데이터" 사례를 못 찾은 것은 `부재 근거`다.** "존재하지 않는다"가 아니라 "이번 검색 범위에서 찾지 못했다"이다.
5. **Aura DPP의 실제 고객 사용률·재방문률을 확인하지 못했다.** 등록 제품 수(5,000만)는 **브랜드가 등록한 수**이지 **고객이 청구한 디지털 트윈 수가 아니다.** `43`의 위험 완화를 과대평가하지 않아야 한다.
6. **`43`을 수정하지 않았다.** 이 문서는 사례 조사이며 Solution 변경은 별도 판단이다.

---

## Sources

**아키타입 1 — Spotify Wrapped**
- [Spotify Wrapped Sound Town: All You Need To Know — Spotify Newsroom](https://newsroom.spotify.com/2023-12-01/wrapped-sound-town-berkeley-burlington-cambridge/)
- [A Breakdown of Spotify Wrapped's Suggested Sound Towns — TIME](https://time.com/6340986/spotify-wrapped-sound-towns-explained/)
- [Spotify Wrapped Sound Towns: Social Media Has Theories — Forbes](https://www.forbes.com/sites/conormurray/2023/11/29/spotify-wrapped-sound-towns-social-media-has-theories-about-why-you-got-assigned-berkeley-or-burlington/)
- [Why Spotify Wrapped-esque year-in-review posts took over Q4 brand marketing — Modern Retail](https://www.modernretail.co/marketing/why-spotify-wrapped-esque-year-in-review-posts-took-over-q4-brand-marketing/)
- [The marketing genius of Spotify Wrapped — The Conversation](https://theconversation.com/the-marketing-genius-of-spotify-wrapped-270135)
- [Spotify Wrapped Marketing Strategy: Viral Phenomenon — NoGood](https://nogood.io/blog/spotify-wrapped-marketing-strategy/)

**Wrapped 2024 실패**
- [The Backlash Against 'Spotify Wrapped 2024,' Explained — Forbes](https://www.forbes.com/sites/danidiplacido/2024/12/05/spotify-wrapped-2024-backlash-controversy-and-memes/)
- [Spotify Wrapped 2024 Faces Backlash for AI Integration — OpenTools](https://opentools.ai/news/spotify-wrapped-2024-faces-backlash-for-ai-integration)
- [Spotify Wrapped 2024 Disappoints Fans with AI-Generated Results — DesignRush](https://www.designrush.com/news/spotify-wrapped-2024-disappoints-fans-with-ai-generated-results)

**아키타입 2 — adidas Ozworld**
- [Adidas Originals Creates World's First, Personality-Based AI-Generated Avatars — Ready Player Me](https://landing.readyplayer.me/case-studies/adidas-originals-uses-ai-to-create-10-million-personal-avatars)
- [adidas Originals Introduces First-of-its-Kind Digital Ozworld Experience — adidas News](https://news.adidas.com/originals/adidas-originals-introduces-first-of-its-kind-digital-ozworld-experience/s/c29e6fdd-2c70-4362-b84a-c46c279d8faf)
- [Adidas goes sci-fi with personality-based metaverse avatars — Marketing Dive](https://www.marketingdive.com/news/adidas-personality-based-avatars-ozworld-metaverse/621521/)

**아키타입 3 — Nike A.I.R.**
- [Nike developing AI model as part of design "step change" — Dezeen](https://www.dezeen.com/2024/05/07/nike-ai-model-john-hoke/)
- [explore NIKE A.I.R and its 13 new 3D printed sneakers — designboom](https://www.designboom.com/design/nike-air-3d-printed-sneakers-ai-math-algorithms-interview-john-hoke-04-13-2024/)

**아키타입 4 — Coca-Cola**
- [Coke asks consumers to generate art with new AI platform — Marketing Dive](https://www.marketingdive.com/news/coca-cola-coke-generative-ai-marketing-art/645465/)
- [60 days to launch: Coca-Cola reaches millions with immersive campaign built on Azure — Microsoft](https://www.microsoft.com/en/customers/story/22668-coca-cola-company-azure-ai-and-machine-learning)

**아키타입 5 — 지속 프로필형**
- [How We're Revolutionizing Personal Styling with Generative AI — Stitch Fix Newsroom](https://newsroom.stitchfix.com/blog/how-were-revolutionizing-personal-styling-with-generative-ai/)
- [How Stitch Fix uses AI to take personalization to the next level — Retail Brew](https://www.retailbrew.com/stories/2023/04/03/how-stitch-fix-uses-ai-to-take-personalization-to-the-next-level)
- [Beauty Genius — L'Oréal](https://www.loreal.com/en/articles/science-and-technology/beauty-genius/)
- [AI at the service of beauty: L'Oréal Groupe deploys its AI agent with Azure OpenAI Service — Microsoft](https://www.microsoft.com/en/customers/story/25570-loreal-azure-openai)
- [Luxury Briefing: Mytheresa is using AI to find future VIPs — Glossy](https://www.glossy.co/fashion/luxury/luxury-briefing-mytheresa-is-using-ai-to-find-future-vips/)

**인프라 — Digital Product Passport**
- [EXCLUSIVE: LVMH, Prada and OTB-backed Aura Blockchain Crosses 50 Million Product Mark — WWD](https://wwd.com/business-news/technology/aura-blockchain-crosses-50-million-products-lvmh-prada-otb-1236606994/)
- [What is the Digital Product Passport? — Aura Blockchain Consortium](https://auraconsortium.com/insight/the-digital-product-passport-a-new-era-of-luxury-unveiled)
- [Prada Group, together with LVMH and Cartier, founds Aura Blockchain Consortium — Prada Group](https://www.pradagroup.com/en/news-media/news-section/aura-blockchain-consortium.html)
- [Digital Product Passport for Textiles: What Fashion Brands Need to Know — Carbonfact](https://www.carbonfact.com/blog/policy/digital-product-passport-fashion)
- [Explainer: How Fashion Brands Should Prepare for Mandatory Digital Product Passports — BoF](https://www.businessoffashion.com/articles/technology/how-fashion-brands-should-prepare-for-mandatory-digital-product-passports/)

**럭셔리 AI 일반**
- [Comprehensive Report on the Use of Artificial Intelligence in the Luxury Sector (2024-2025) — LUXONOMY](https://luxonomy.net/comprehensive-report-on-the-use-of-artificial-intelligence-in-the-luxury-sector-2024-2025/)
- [The Segment of One: Hyper-Personalisation in the Luxury Industry — Luxury Society](https://luxurysociety.com/en/the-segment-of-one-hyper-personalization-in-the-luxury-industry/)

**도시·지역 축**
- [Top 13 AI-powered marketing campaigns of 2025 — Zeely AI](https://zeely.ai/blog/ai-powered-marketing-campaigns/)

**커모디티화 리스크**
- [TripPack AI: Travel Planning — App Store](https://apps.apple.com/us/app/-/id6474236982)
- [Pack Papi: AI Packing List — App Store](https://apps.apple.com/us/app/-/id6759451431)
- [Bag Travel Organizer: Visualize Smart Packing Solutions with AI — ReelMind](https://reelmind.ai/blog/bag-travel-organizer-visualize-smart-packing-solutions-with-ai)

**여행 브랜드 디지털 서비스**
- [Moncler + RIMOWA Official App — App Store](https://apps.apple.com/us/app/-/id1498236806)
- [RIMOWA UNIQUE | Custom Luggage — RIMOWA](https://www.rimowa.com/us/en/unique)

**여행 리테일 시장**
- [Duty Free And Travel Retail Companies — Mordor Intelligence](https://www.mordorintelligence.com/industry-reports/duty-free-and-travel-retail-market/companies)
