import Image from "next/image";

export function StorySection() {
  return (
    <section
      id="story"
      className="flex flex-col bg-[#F6F3EE] [font-family:var(--font-landing-sans)] lg:h-[900px] lg:flex-row"
      data-landing-component="story"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="relative h-[720px] min-h-0 flex-none overflow-hidden lg:h-auto lg:flex-1">
          <Image
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            src="/images/landing/story.webp"
            alt="MCM 비세토스 트렁크 위에서 포즈를 취한 모델"
            className="object-cover object-center"
          />
        </div>
        <div className="bg-[#111111] px-5 py-[14px] text-center">
          <p className="text-[10px] font-medium tracking-[0.2em] text-[#C8A66B]">
            MCM ARCHIVE · HERITAGE COLLECTION
          </p>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-[50px] px-6 py-20 sm:px-10 lg:px-[70px]">
        <header className="flex flex-col gap-[21px]">
          <p className="text-base font-semibold tracking-[0.2em] text-[#A4612A]">
            PERSONAL LUXURY EXPERIENCE
          </p>
          <h2 className="[font-family:var(--font-landing-serif)] text-[40px] font-semibold leading-[1.28] text-[#111111] sm:text-[44px]">
            Creating Personal
            <br />
            Connections Beyond Products
          </h2>
          <p className="[font-family:var(--font-landing-serif)] text-[26px] italic text-[#A4612A]">
            Every customer has a unique story with MCM.
          </p>
        </header>

        <div className="flex w-full max-w-[560px] flex-col items-start gap-9 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
            <p className="text-[10px] font-semibold tracking-[0.14em] text-[#8A7A63]">
              FROM PRODUCT EXPERIENCE
            </p>
            <p className="w-full max-w-[230px] [font-family:var(--font-landing-serif)] text-[19px] leading-[1.75] italic text-[#6B6660]">
              A purchase creates ownership. A product creates experience. But a
              lasting connection requires more.
            </p>
          </div>

          <span
            aria-hidden="true"
            className="self-center text-[40px] leading-none text-[#C8A66B] max-sm:rotate-90"
          >
            →
          </span>

          <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[#A4612A]">
              TO PERSONAL LUXURY EXPERIENCE
            </p>
            <p className="w-full max-w-[330px] [font-family:var(--font-landing-serif)] text-[26px] font-medium leading-[1.75] italic text-[#111111]">
              AI understands every choice, connecting personal taste with
              MCM&apos;s world to create{" "}
              <span className="font-semibold text-[#A4612A]">
                a unique story for every customer.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
