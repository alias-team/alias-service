import { CircleHelp, Grid3X3, Search, Settings, SlidersHorizontal } from "lucide-react";

export function InboxHeader() {
  return (
    <header
      data-inbox-component="Header"
      className="flex h-16 items-center gap-5 bg-[#f6f8fc] px-4"
    >
      <label className="relative flex max-w-[720px] flex-1 items-center">
        <Search className="absolute left-5 size-5 text-[#5f6368]" aria-hidden="true" />
        <input
          aria-label="Search mail"
          type="search"
          placeholder="Search mail"
          className="h-12 w-full rounded-3xl border border-transparent bg-[#eaf1fb] pl-14 pr-14 text-base text-[#202124] outline-none placeholder:text-[#5f6368] focus:bg-white focus:shadow-md"
        />
        <SlidersHorizontal className="absolute right-5 size-5 text-[#5f6368]" aria-hidden="true" />
      </label>

      <div className="ml-auto flex items-center gap-5 text-[#5f6368]">
        <CircleHelp className="size-5" aria-hidden="true" />
        <Settings className="size-5" aria-hidden="true" />
        <Grid3X3 className="size-5" aria-hidden="true" />
        <span className="grid size-8 place-items-center rounded-full bg-[#5f6368] text-xs font-medium text-white">MK</span>
      </div>
    </header>
  );
}
