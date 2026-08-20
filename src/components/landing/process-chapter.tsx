import Image from "next/image";
import type { ReactNode } from "react";

import { RevealOnScroll } from "./reveal-on-scroll";

type ProcessChapterProps = {
  id: string;
  component: string;
  number: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  caption: string;
  lead: string;
  body: ReactNode;
  imageFirst?: boolean;
};

export function ProcessChapter({
  id,
  component,
  number,
  title,
  subtitle,
  image,
  alt,
  caption,
  lead,
  body,
  imageFirst = true,
}: ProcessChapterProps) {
  return (
    <section
      id={id}
      className="bg-[#F6F3EE] [font-family:var(--font-landing-sans)]"
      data-landing-component={component}
    >
      <div className="mx-auto max-w-[1440px] px-6 py-[88px] sm:px-10 lg:px-16">
        <RevealOnScroll className="relative overflow-hidden px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 70% 80% at 18% 42%, rgba(200, 166, 107, 0.22) 0%, rgba(200, 166, 107, 0) 64%), radial-gradient(ellipse 55% 70% at 82% 58%, rgba(164, 97, 42, 0.12) 0%, rgba(164, 97, 42, 0) 70%), linear-gradient(180deg, rgba(247, 236, 214, 0.92) 0%, rgba(241, 226, 201, 0.78) 100%)",
            }}
          />
          <div
            className={[
              "relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20",
              imageFirst ? "" : "lg:[&>figure]:order-2",
            ].join(" ")}
          >
            <figure>
              <div className="relative aspect-[3/4] overflow-hidden bg-[#111111]">
                <Image
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  src={image}
                  alt={alt}
                  className="object-cover object-center"
                />
              </div>
              <figcaption className="mt-4 text-[10px] font-medium tracking-[0.22em] text-[#8A7A63]">
                {caption}
              </figcaption>
            </figure>

            <div className="flex min-w-0 max-w-[720px] flex-col">
              <p className="[font-family:var(--font-landing-serif)] text-[72px] font-semibold leading-none text-[#C8A66B]">
                {number}
              </p>
              <p className="mt-5 text-xl font-semibold tracking-[0.22em] text-[#111111]">
                {title}
              </p>
              <h2 className="mt-4 whitespace-nowrap [font-family:var(--font-landing-serif)] text-[34px] font-semibold leading-[1.08] text-[#111111] sm:text-[40px] lg:text-[44px]">
                {subtitle}
              </h2>
              <div
                aria-hidden="true"
                className="mt-6 h-px w-[160px] bg-[#C8A66B]"
              />
              <p className="mt-8 [font-family:var(--font-landing-serif)] text-[22px] leading-[1.7] italic text-[#A4612A]">
                {lead}
              </p>
              <p className="mt-6 max-w-[580px] text-[16px] leading-[1.8] text-[#4A463E]">
                {body}
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
