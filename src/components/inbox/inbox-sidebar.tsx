import {
  ChevronDown,
  Clock3,
  File,
  Inbox,
  Pencil,
  Plus,
  Send,
  ShoppingBag,
  Star,
} from "lucide-react";

const folders = [
  { korean: "받은편지함", english: "Inbox", count: "671", icon: Inbox },
  { korean: "별표편지함", english: "Starred", count: "", icon: Star },
  { korean: "다시 알림 항목", english: "Snoozed", count: "", icon: Clock3 },
  { korean: "보낸편지함", english: "Sent", count: "", icon: Send },
  { korean: "임시보관함", english: "Drafts", count: "10", icon: File },
  { korean: "구매", english: "Purchases", count: "13", icon: ShoppingBag },
  { korean: "더보기", english: "More", count: "", icon: ChevronDown },
] as const;

export function InboxSidebar() {
  return (
    <aside
      data-inbox-component="Sidebar"
      className="w-64 shrink-0 overflow-y-auto bg-[#F8FAFC] px-2 pb-5 pt-2"
    >
      <button
        type="button"
        className="mx-3 mb-5 mt-4 flex h-14 items-center gap-3.5 rounded-3xl bg-[#c2e7ff] px-[22px] text-[15px] font-medium text-[#001d35] shadow-[0_1px_3px_1px_rgba(60,64,67,0.2)] transition hover:bg-[#a8dcfd] hover:shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)]"
      >
        <Pencil className="size-5" aria-hidden="true" />
        <span>편지쓰기</span>
      </button>

      <nav aria-label="Mailbox folders">
        {folders.map((folder, index) => {
          const Icon = folder.icon;

          return (
            <a
              key={folder.english}
              href={`#${folder.english.toLowerCase()}`}
              aria-label={folder.english}
              aria-current={index === 0 ? "page" : undefined}
              className={`mr-3 flex h-8 items-center gap-[18px] rounded-r-2xl px-5 text-sm ${
                index === 0
                  ? "bg-[#e8f0fe] font-bold text-[#1a73e8]"
                  : "font-normal text-[#202124] hover:bg-[#f1f3f4]"
              }`}
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <span className="flex-1">{folder.korean}</span>
              {folder.count && (
                <span className="text-xs font-semibold">{folder.count}</span>
              )}
            </a>
          );
        })}
      </nav>

      <div className="flex items-center justify-between px-5 pb-2 pt-5">
        <span className="text-[13px] font-medium text-[#3c3c3c]">라벨</span>
        <Plus className="size-4 text-[#5f6368]" aria-hidden="true" />
      </div>
      <a
        href="#notes"
        className="mr-3 flex h-8 items-center gap-[18px] rounded-r-2xl px-5 text-sm text-[#202124] hover:bg-[#f1f3f4]"
      >
        <span className="grid size-5 place-items-center" aria-hidden="true">
          <span className="size-2 rounded-full bg-[#5f6368]" />
        </span>
        Notes
      </a>
    </aside>
  );
}
