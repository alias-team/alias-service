import Image from "next/image";
import Link from "next/link";

const navigationItems = ["EDITORIAL", "COLLECTIONS", "ARCHIVE", "ABOUT"];

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
      className="bg-[#F6F3EE] [font-family:var(--font-landing-sans)] lg:h-[980px]"
      data-landing-component="hero"
    >
      <div className="relative h-[760px] overflow-hidden">
        <Image
          fill
          preload
          sizes="100vw"
          src="/images/landing/hero.webp"
          alt="MCM 비세토스 러기지가 놓인 클래식 호텔 로비"
          className="object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.15)_0%,rgba(17,17,17,0.35)_55%,rgba(17,17,17,0.88)_100%)]"
        />

        <header className="absolute inset-x-0 top-0 z-10 flex h-[92px] items-center justify-between px-6 sm:px-10 lg:px-16">
          <a
            href="#hero"
            aria-label="MCM Personal Editorial Engine 홈"
            className="[font-family:var(--font-landing-serif)] text-[26px] font-semibold tracking-[0.08em] text-[#F6F3EE]"
          >
            MCM
          </a>

          <nav
            aria-label="Landing navigation"
            className="hidden items-center gap-8 md:flex lg:gap-12"
          >
            {navigationItems.map((item) => (
              <a
                key={item}
                href={item === "EDITORIAL" ? "#intelligence" : "#hero"}
                className="text-xs font-medium tracking-[0.12em] text-[#F6F3EE] transition-colors hover:text-[#C8A66B]"
              >
                {item}
              </a>
            ))}
          </nav>

          <a
            href="#hero"
            className="border-b border-[#F6F3EE]/50 pb-0.5 text-xs font-medium tracking-[0.1em] text-[#F6F3EE]"
          >
            SIGN IN
          </a>
        </header>

        <div className="pointer-events-none absolute inset-x-6 bottom-10 z-10 flex max-w-[760px] flex-col gap-[22px] sm:inset-x-10 sm:bottom-12 lg:inset-x-auto lg:left-16 lg:bottom-10 lg:w-[760px]">
          <p className="pointer-events-auto text-xs font-medium tracking-[0.22em] text-[#C8A66B]">
            PERSONAL EDITORIAL ENGINE
          </p>
          <h1 className="pointer-events-auto [font-family:var(--font-landing-serif)] text-[48px] font-medium leading-[1.04] text-[#F6F3EE] sm:text-[56px] lg:text-[64px]">
            MCM Personal
            <br />
            Editorial Engine
          </h1>
          <p className="pointer-events-auto max-w-[560px] text-[16px] leading-[1.6] text-[#D7C6A5] sm:text-[17px]">
            An AI-curated magazine issue, drawn from MCM&apos;s world of
            heritage craft and modern luxury — styled entirely around you.
          </p>
          <div className="pointer-events-auto mt-2">
            <Link
              href="/reasoning/demo-run"
              prefetch={false}
              className="inline-flex items-center gap-3 bg-[#C8A66B] px-[30px] py-[18px] text-[13px] font-semibold tracking-[0.1em] text-[#111111] transition-colors hover:bg-[#F6F3EE] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F6F3EE]"
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
