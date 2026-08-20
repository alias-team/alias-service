import { ProcessChapter } from "./process-chapter";

export function CreateSection() {
  return (
    <ProcessChapter
      id="create"
      component="create"
      number="03"
      title="CREATE"
      subtitle="Personal Editorial"
      image="/images/landing/intelligence-create.png"
      alt="목욕 가운을 입고 패션 매거진을 읽는 두 사람"
      caption="PERSONAL EDITORIAL · GENERATED ISSUE"
      lead="A one-of-one MCM issue, generated from your taste."
      body="After your preferences meet the MCM universe, AI composes a private magazine chapter — heritage codes, rewritten as a story that exists only once."
    />
  );
}
