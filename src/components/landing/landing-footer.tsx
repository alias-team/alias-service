import Image from "next/image";

export function LandingFooter() {
  return (
    <footer
      className="border-t border-[#D7C6A5] bg-[#F6F3EE] [font-family:var(--font-landing-sans)]"
      data-landing-component="footer"
    >
      <div className="mx-auto flex min-h-[80px] max-w-[1440px] items-center justify-center px-6 py-5 sm:px-10 lg:px-16">
        <Image
          alt="MCM"
          src="/images/mcm-logo.png"
          width={36}
          height={37}
          className="h-[37px] w-[36px] object-contain opacity-70"
        />
      </div>
    </footer>
  );
}
