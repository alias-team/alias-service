import {
  CircleHelp,
  Grid3X3,
  Menu,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

export function InboxHeader() {
  return (
    <header
      data-inbox-component="Header"
      className="flex h-16 shrink-0 items-center gap-5 bg-white px-4"
    >
      <div className="flex w-[200px] shrink-0 items-center gap-5">
        <button
          type="button"
          aria-label="Open navigation"
          className="grid size-10 place-items-center rounded-full text-[#5f6368] hover:bg-[#f1f3f4]"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2.5" aria-label="Gmail-style MCM Mail">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#1a73e8] text-[15px] font-bold tracking-[0.5px] text-white">
            M
          </span>
          <span className="whitespace-nowrap text-[21px] font-medium tracking-[-0.2px] text-[#3c3c3c]">
            MCM Mail
          </span>
        </div>
      </div>

      <label className="relative mx-auto flex h-[46px] max-w-[720px] flex-1 items-center rounded-lg bg-[#eef1f6] transition-shadow focus-within:bg-white focus-within:shadow-[0_1px_3px_1px_rgba(60,64,67,0.15)]">
        <Search className="absolute left-4 size-[18px] text-[#5f6368]" aria-hidden="true" />
        <input
          aria-label="Search mail"
          type="search"
          placeholder="메일 검색"
          className="h-full w-full rounded-lg border-0 bg-transparent pl-12 pr-12 text-[15px] text-[#1f1f1f] outline-none placeholder:text-[#5f6368]"
        />
        <button
          type="button"
          aria-label="Search options"
          className="absolute right-1 grid size-9 place-items-center rounded-full text-[#5f6368] hover:bg-[#e2e5ea]"
        >
          <SlidersHorizontal className="size-[18px]" aria-hidden="true" />
        </button>
      </label>

      <div className="ml-auto flex shrink-0 items-center gap-1.5 text-[#5f6368]">
        <button type="button" aria-label="Help" className="grid size-10 place-items-center rounded-full hover:bg-[#f1f3f4]">
          <CircleHelp className="size-[19px]" aria-hidden="true" />
        </button>
        <button type="button" aria-label="Settings" className="grid size-10 place-items-center rounded-full hover:bg-[#f1f3f4]">
          <Settings className="size-[19px]" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="h-9 max-w-24 truncate rounded-full border border-[#dadce0] bg-white px-4 text-[13px] font-medium text-[#1a73e8] hover:bg-[#f4f8fe]"
        >
          업그레이드...
        </button>
        <button type="button" aria-label="Gemini" className="grid size-9 place-items-center rounded-full hover:bg-[#f1f3f4]">
          <Sparkles className="size-5 fill-[#8ab4f8] text-[#8ab4f8]" aria-hidden="true" />
        </button>
        <button type="button" aria-label="Google apps" className="grid size-10 place-items-center rounded-full hover:bg-[#f1f3f4]">
          <Grid3X3 className="size-[19px]" aria-hidden="true" />
        </button>
        <span className="ml-1.5 grid size-[34px] place-items-center rounded-full bg-[#e8710a] text-[13px] font-semibold text-white">
          성
        </span>
      </div>
    </header>
  );
}
