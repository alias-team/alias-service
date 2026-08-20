import Image from "next/image";

const intelligencePanels = [
  {
    number: "01",
    title: "UNDERSTAND",
    subtitle: "Customer Taste",
    image: "/images/landing/intelligence-understand.webp",
    alt: "MCM 비세토스 트렁크 위에서 포즈를 취한 모델",
  },
  {
    number: "02",
    title: "CONNECT",
    subtitle: "Customer Taste × MCM Universe",
    image: "/images/landing/intelligence-connect.webp",
    alt: "MCM 로고와 다이아몬드 모티프 패턴",
  },
  {
    number: "03",
    title: "CREATE",
    subtitle: "Personal Editorial",
    image: "/images/landing/intelligence-create.webp",
    alt: "MCM 비세토스 러기지가 놓인 클래식 호텔 로비",
  },
];

export function IntelligenceSection() {
  return (
    <section
      id="intelligence"
      className="flex flex-col bg-[#2A2A2A] [font-family:var(--font-landing-sans)] lg:h-[920px]"
      data-landing-component="intelligence"
    >
      <header className="flex flex-col items-center gap-4 px-6 pb-[54px] pt-[72px] text-center sm:px-10 lg:px-[60px]">
        <p className="text-[15px] font-semibold tracking-[0.24em] text-[#C8A66B]">
          THE INTELLIGENCE ENGINE
        </p>
        <h2 className="[font-family:var(--font-landing-serif)] text-[40px] font-semibold leading-[1.08] text-[#F6F3EE] sm:text-[48px] lg:whitespace-nowrap lg:text-[58px]">
          The Intelligence Behind Every Personal Story
        </h2>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {intelligencePanels.map((panel, index) => (
          <article
            key={panel.number}
            className={[
              "relative h-[600px] min-w-0 flex-none overflow-hidden lg:h-auto lg:flex-1",
              index < intelligencePanels.length - 1
                ? "border-b border-[#C8A66B]/25 lg:border-b-0 lg:border-r"
                : "",
            ].join(" ")}
          >
            <Image
              fill
              sizes="(min-width: 1024px) 33.33vw, 100vw"
              src={panel.image}
              alt={panel.alt}
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,12,8,0)_48%,rgba(17,12,8,0.92)_100%)]"
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[10px] px-[34px] py-8">
              <p className="[font-family:var(--font-landing-serif)] text-[75px] font-semibold leading-none text-[#C8A66B]">
                {panel.number}
              </p>
              <h3 className="text-xl font-semibold tracking-[0.2em] text-[#F6F3EE]">
                {panel.title}
              </h3>
              <p className="[font-family:var(--font-landing-serif)] text-[30px] italic leading-tight text-[#D7C6A5]">
                {panel.subtitle}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
