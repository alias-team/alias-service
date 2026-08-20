import Link from "next/link";

export function CTASection() {
  return (
    <section
      id="closing-invitation"
      className="relative flex h-[760px] flex-col items-center justify-center gap-[34px] overflow-hidden bg-[#111111] px-6 text-center [font-family:var(--font-landing-sans)]"
      data-landing-component="cta"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-[13px] -translate-y-[23px] bg-[radial-gradient(ellipse_55%_55%_at_50%_50%,rgba(200,166,107,0.14)_0%,rgba(17,17,17,0)_68%)]"
      >
        <div className="absolute inset-0 -translate-x-[238px] translate-y-[3px] bg-[radial-gradient(ellipse_55%_55%_at_50%_50%,rgba(200,166,107,0.14)_0%,rgba(17,17,17,0)_68%)]" />
      </div>

      <div aria-hidden="true" className="relative h-px w-9 bg-[#C8A66B]" />

      <h2 className="relative max-w-[760px] [font-family:var(--font-landing-serif)] text-[46px] font-semibold leading-[1.15] text-[#F6F3EE] sm:text-[58px]">
        Experience Your Personal
        <br />
        <span className="italic text-[#C8A66B]">MCM Story</span>
      </h2>

      <p className="relative h-[50px] w-full max-w-[500px] text-[17px] leading-[1.6] text-[#B9AC96]">
        See how AI transforms your choices into a unique personal editorial
        experience.
      </p>

      <Link
        href="/reasoning/demo"
        prefetch={false}
        className="relative mt-[14px] inline-flex items-center gap-[14px] bg-[#C8A66B] px-[46px] py-[22px] text-[13px] font-semibold tracking-[0.2em] text-[#111111] transition-colors hover:bg-[#F6F3EE] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8A66B]"
      >
        GENERATE MY EDITORIAL
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
