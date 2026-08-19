import {
  Clock3,
  File,
  Inbox,
  Menu,
  Pencil,
  Send,
  Star,
} from "lucide-react";

const folders = [
  ["Inbox", "3", Inbox],
  ["Starred", "", Star],
  ["Snoozed", "", Clock3],
  ["Sent", "", Send],
  ["Drafts", "1", File],
] as const;

export function InboxSidebar() {
  return (
    <aside
      data-inbox-component="Sidebar"
      className="flex w-64 shrink-0 flex-col bg-[#f6f8fc] pb-5"
    >
      <div className="flex h-16 items-center gap-4 px-6">
        <Menu className="size-5 text-[#5f6368]" aria-hidden="true" />
        <div className="flex items-center gap-2" aria-label="Gmail">
          <span className="grid size-8 place-items-center rounded-md bg-white text-xl shadow-sm" aria-hidden="true">✉</span>
          <span className="text-[22px] font-medium tracking-tight text-[#5f6368]">Gmail</span>
        </div>
      </div>

      <button
        type="button"
        className="mx-2 mb-4 flex h-14 w-36 items-center gap-3 rounded-2xl bg-[#c2e7ff] px-5 text-sm font-medium text-[#001d35] shadow-sm transition-shadow hover:shadow-md"
      >
        <Pencil className="size-5" aria-hidden="true" />
        <span>Compose</span>
      </button>

      <nav aria-label="Mailbox folders" className="space-y-1">
        {folders.map(([label, count, Icon], index) => (
          <a
            key={label}
            href={`#${label.toLowerCase()}`}
            aria-current={index === 0 ? "page" : undefined}
            className={`mr-3 flex h-8 items-center rounded-r-full pl-7 pr-4 text-sm ${
              index === 0
                ? "bg-[#d3e3fd] font-semibold text-[#001d35]"
                : "font-medium text-[#3c4043] hover:bg-[#e9eef6]"
            }`}
          >
            <Icon className="mr-5 size-4" aria-hidden="true" />
            <span className="flex-1">{label}</span>
            {count && <span className="text-xs font-semibold">{count}</span>}
          </a>
        ))}
      </nav>
    </aside>
  );
}
