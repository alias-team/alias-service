import { ProcessChapter } from "./process-chapter";

export function UnderstandSection() {
  return (
    <ProcessChapter
      id="understand"
      component="understand"
      number="01"
      title="UNDERSTAND"
      subtitle="Customer Taste"
      image="/images/landing/intelligence-understand-leather.png"
      alt="검은 가죽 재킷을 입고 MCM 비세토스 백을 든 모델"
      caption="CUSTOMER TASTE · STYLE PROFILE"
      lead="Your preferences, read as a private style profile."
      body={
        <>
          AI studies the codes in your choices — silhouette, material, attitude
          <br />—{" "}
          <span className="whitespace-nowrap">
            and translates them into a taste signature that belongs only to you.
          </span>
        </>
      }
    />
  );
}
