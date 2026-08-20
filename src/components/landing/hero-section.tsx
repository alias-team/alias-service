import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "UNDERSTOOD BY AI",
    description: "Your taste, translated into a style profile in seconds.",
  },
  {
    title: "INSPIRED BY MCM HERITAGE",
    description:
      "Drawn from decades of Munich craft and modern reinvention.",
  },
  {
    title: "YOUR PERSONAL ISSUE",
    description: "A one-of-one magazine, generated just for you.",
  },
];

export function HeroSection() {
  return (
    <section
      id="hero"
      className="bg-[#F6F3EE] [font-family:var(--font-landing-sans)]"
      data-landing-component="hero"
    >
      <div className="relative overflow-hidden bg-[#EFE5D9] lg:h-[682px]">
        <div className="pointer-events-none flex justify-end lg:absolute lg:inset-y-0 lg:right-0">
          <Image
            priority
            unoptimized
            width={1024}
            height={682}
            src="/images/landing/hero-group.png"
            alt="MCM 매거진을 들고 있는 캠페인 모델들"
            className="h-auto w-full max-w-[1024px] lg:h-[682px] lg:w-[1024px] lg:max-w-none"
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center gap-[22px] px-6 py-16 sm:px-10 lg:h-full lg:pl-32 lg:pr-16 xl:pl-44">
          <p className="text-xs font-medium tracking-[0.22em] text-[#A4612A]">
            PERSONAL EDITORIAL ENGINE
          </p>
          <h1 className="max-w-[480px] [font-family:var(--font-landing-serif)] text-[48px] font-medium leading-[1.04] text-[#111111] sm:text-[56px] lg:text-[64px]">
            MCM Personal
            <br />
            Editorial Engine
          </h1>
          <p className="max-w-[480px] text-[16px] leading-[1.6] text-[#4A463E] sm:text-[17px]">
            An AI-curated magazine issue, drawn from MCM&apos;s world of
            heritage craft and modern luxury — styled entirely around you.
          </p>
          <div className="mt-2">
            <Link
              href="/reasoning/demo-run"
              prefetch={false}
              className="inline-flex items-center gap-3 bg-[#C8A66B] px-[30px] py-[18px] text-[13px] font-semibold tracking-[0.1em] text-[#111111] transition-colors hover:bg-[#F6F3EE] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A4612A]"
            >
              GENERATE MY EDITORIAL
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid bg-[#F6F3EE] px-6 py-5 sm:px-10 lg:h-[220px] lg:grid-cols-3 lg:items-center lg:px-16 lg:py-0">
        {features.map((feature, index) => (
          <article
            key={feature.title}
            className={[
              "flex flex-col gap-2 py-7",
              index === 0 ? "lg:pr-10" : "",
              index === 1
                ? "border-y border-[#D7C6A5] lg:border-x lg:border-y-0 lg:px-10"
                : "",
              index === 2 ? "lg:pl-10" : "",
            ].join(" ")}
          >
            <div aria-hidden="true" className="h-px w-7 bg-[#A4612A]" />
            <h2 className="text-xs font-semibold tracking-[0.1em] text-[#111111]">
              {feature.title}
            </h2>
            <p className="text-[13px] leading-[1.5] text-[#2A2A2A]">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
