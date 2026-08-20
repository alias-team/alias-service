"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const generationSteps = [
  {
    number: "01",
    title: "UNDERSTANDING",
    detail: "Your Taste",
  },
  {
    number: "02",
    title: "CONNECTING",
    detail: "MCM World",
  },
  {
    number: "03",
    title: "CREATING",
    detail: "Editorial",
  },
];

type GenerationLoadingUIProps = {
  runId: string;
  completionPath?: string;
};

export function GenerationLoadingUI({
  runId,
  completionPath,
}: GenerationLoadingUIProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setActiveStep(1), 2000),
      window.setTimeout(() => setActiveStep(2), 6000),
      window.setTimeout(() => setActiveStep(3), 9000),
      window.setTimeout(() => {
        setIsComplete(true);
        setIsExiting(true);
      }, 12000),
      window.setTimeout(() => {
        if (completionPath) router.replace(completionPath);
      }, 13000),
    ];

    return () => timers.forEach(window.clearTimeout);
  }, [completionPath, router]);

  return (
    <section
      aria-labelledby="generation-title"
      aria-busy={!isComplete}
      data-reasoning-component="generation-loading"
      data-run-id={runId}
      data-generation-complete={isComplete}
      className={[
        "relative flex min-h-svh items-center justify-center overflow-hidden bg-[#1A1410] px-6 transition-opacity duration-1000 ease-in-out [font-family:var(--font-landing-sans)] lg:h-[900px]",
        isExiting ? "opacity-0" : "opacity-100",
      ].join(" ")}
    >
      <div aria-hidden="true" className="absolute inset-0 scale-110">
        <Image
          fill
          alt=""
          src="/images/reasoning/mcm-wallpaper.png"
          sizes="100vw"
          className="object-cover object-center blur-[7px]"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_72%_68%_at_50%_42%,rgba(18,12,8,0.52)_0%,rgba(12,8,6,0.78)_58%,rgba(8,5,3,0.9)_100%)]"
      />

      <div className="relative z-10 flex w-full flex-col items-center justify-center gap-14 px-0 text-center sm:px-10">
        <header className="flex flex-col items-center gap-[30px]">
          <h1
            id="generation-title"
            className="max-w-[950px] [font-family:var(--font-landing-serif)] text-[60px] font-semibold leading-[1.2] text-[#F6F3EE] [text-shadow:0_3px_22px_rgba(0,0,0,0.7)]"
          >
            Crafting Your Personal MCM Story
          </h1>
          <p className="max-w-[840px] text-2xl leading-[1.6] text-[#F0E6D8] [text-shadow:0_2px_14px_rgba(0,0,0,0.7)]">
            A personal magazine crafted from your choices and MCM&apos;s world
          </p>
        </header>

        <div className="flex w-full max-w-[960px] flex-col items-center sm:flex-row sm:items-start">
          {generationSteps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = activeStep === stepNumber;
            const hasStarted = activeStep >= stepNumber;

            return (
              <div key={step.number} className="contents">
                {index > 0 ? (
                  <div
                    aria-hidden="true"
                    className="my-5 h-px w-[70px] bg-[#C8A66B]/40 sm:my-2 sm:h-[70px] sm:w-px"
                  />
                ) : null}

                <div
                  aria-current={isActive ? "step" : undefined}
                  className={[
                    "flex flex-1 flex-col items-center gap-3 transition-all duration-1000 ease-out",
                    isActive
                      ? "opacity-100 [filter:drop-shadow(0_0_12px_rgba(200,166,107,0.28))]"
                      : hasStarted
                        ? "opacity-65"
                        : "opacity-40",
                  ].join(" ")}
                >
                  <p
                    className={[
                      "[font-family:var(--font-landing-serif)] font-semibold text-[#C8A66B] transition-all duration-1000 ease-out",
                      isActive ? "text-[30px]" : "text-[22px]",
                    ].join(" ")}
                  >
                    {step.number}
                  </p>
                  <h2
                    className={[
                      "font-semibold tracking-[0.16em] text-[#F6F3EE] transition-all duration-1000 ease-out",
                      isActive ? "text-[21px]" : "text-[13px]",
                    ].join(" ")}
                  >
                    {step.title}
                  </h2>
                  <p
                    className={[
                      "leading-[1.5] transition-all duration-1000 ease-out",
                      isActive ? "text-[21px]" : "text-[13px]",
                      isActive ? "text-[#F0E6D8]" : "text-[#E8DCC8]",
                    ].join(" ")}
                  >
                    {step.detail}
                  </p>
                  <div
                    aria-hidden="true"
                    className={[
                      "mx-auto bg-[#C8A66B] transition-all duration-1000 ease-out",
                      isActive
                        ? "h-0.5 w-7 shadow-[0_0_12px_rgba(200,166,107,0.55)]"
                        : "h-px w-5",
                    ].join(" ")}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {isComplete
          ? "Your personal editorial is ready."
          : activeStep === 0
            ? "Preparing your personal editorial."
            : `${generationSteps[activeStep - 1].title} ${generationSteps[activeStep - 1].detail}`}
      </p>
    </section>
  );
}
