import { ProcessChapter } from "./process-chapter";

export function ConnectSection() {
  return (
    <ProcessChapter
      id="connect"
      component="connect"
      number="02"
      title="CONNECT"
      subtitle="Customer Taste × MCM Universe"
      image="/images/landing/intelligence-connect.png"
      alt="호텔 러기지 카트에 진열된 MCM 비세토스 백과 러기지"
      caption="MCM UNIVERSE · HERITAGE CODES"
      lead="Taste finds its counterpart in MCM heritage."
      body="The profile is mapped against decades of Munich craft and contemporary form — connecting what you love with the world that can hold it."
      imageFirst={false}
    />
  );
}
