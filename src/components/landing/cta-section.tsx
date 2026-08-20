"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function revealClass(visible: boolean, delay: string) {
  return [
    "relative transform-gpu will-change-[opacity,transform] transition-[opacity,transform,background-color] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
    visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
    delay,
  ].join(" ");
}

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.32 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="closing-invitation"
      className="relative flex h-[760px] flex-col items-center justify-center gap-[34px] overflow-hidden bg-[#F6F3EE] px-6 text-center [font-family:var(--font-landing-sans)]"
      data-landing-component="cta"
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 transition-opacity duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:opacity-100 motion-reduce:transition-none",
          visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{
          backgroundImage:
            "radial-gradient(ellipse 48% 62% at 44% 50%, rgba(108, 58, 34, 0.2) 0%, rgba(108, 58, 34, 0) 72%), radial-gradient(ellipse 34% 48% at 66% 48%, rgba(122, 70, 42, 0.12) 0%, rgba(122, 70, 42, 0) 74%)",
        }}
      />

      <h2 className={`${revealClass(visible, "delay-100")} max-w-[760px] [font-family:var(--font-landing-serif)] text-[46px] font-semibold leading-[1.15] text-[#111111] sm:text-[58px]`}>
        Experience Your Personal
        <br />
        <span className="italic text-[#C8A66B]">MCM Story</span>
      </h2>

      <p className={`${revealClass(visible, "delay-300")} w-full max-w-[720px] text-[17px] leading-[1.6] text-[#746D63] md:whitespace-nowrap`}>
        See how AI transforms your choices into a unique personal editorial experience.
      </p>

      <Link
        href="/reasoning/demo"
        prefetch={false}
        className={`${revealClass(visible, "delay-500")} mt-[14px] inline-flex items-center gap-[14px] bg-[#C8A66B] px-[46px] py-[22px] text-[13px] font-semibold tracking-[0.2em] text-[#111111] hover:bg-[#F6F3EE] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8A66B]`}
      >
        GENERATE MY EDITORIAL
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
