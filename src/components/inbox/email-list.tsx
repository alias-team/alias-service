import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Inbox,
  MoreVertical,
  RefreshCw,
  Star,
  Tag,
} from "lucide-react";

import type { InboxEmail } from "@/types/inbox";

type EmailListProps = {
  emails: InboxEmail[];
};

function EmailRow({ email }: { email: InboxEmail }) {
  const state = email.is_read ? "read" : "unread";

  return (
    <div
      data-inbox-component="EmailRow"
      data-email-id={email.id}
      data-read-state={state}
      className={`group grid min-h-10 grid-cols-[28px_28px_200px_minmax(0,1fr)_72px] items-center border-b border-[#e1e4e8] px-3 text-sm shadow-[inset_0_-1px_0_rgba(100,121,143,0.12)] transition-shadow hover:z-10 hover:shadow-md ${
        email.is_read ? "bg-[#f2f6fc] text-[#5f6368]" : "bg-white text-[#202124]"
      }`}
    >
      <button type="button" aria-label={`Select email from ${email.sender}`} className="grid size-7 place-items-center text-[#5f6368]">
        <span className="size-4 rounded-sm border-2 border-[#5f6368]/70" aria-hidden="true" />
      </button>
      <button type="button" aria-label={`Star email from ${email.sender}`} className="grid size-7 place-items-center text-[#5f6368]">
        <Star className="size-4" aria-hidden="true" />
      </button>
      <Link href={`/inbox/${email.id}`} className={`truncate pr-5 ${email.is_read ? "font-normal" : "font-bold"}`}>
        {email.sender}
      </Link>
      <Link href={`/inbox/${email.id}`} className="flex min-w-0 items-center gap-1.5">
        {email.is_editorial && (
          <span className="shrink-0 rounded bg-[#fce8e6] px-1.5 py-0.5 text-[10px] font-bold text-[#b3261e]">MCM</span>
        )}
        <span className={`shrink-0 ${email.is_read ? "font-normal" : "font-bold"}`}>{email.subject}</span>
        <span className="truncate text-[#5f6368]">&nbsp;-&nbsp; {email.preview}</span>
      </Link>
      <Link href={`/inbox/${email.id}`} className={`text-right text-xs ${email.is_read ? "font-normal" : "font-bold text-[#202124]"}`}>
        <time>{email.received_at}</time>
      </Link>
    </div>
  );
}

export function EmailList({ emails }: EmailListProps) {
  return (
    <section data-inbox-component="EmailList" aria-label="Email list" className="min-h-full overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="flex h-12 items-center justify-between px-4 text-[#5f6368]">
        <div className="flex items-center gap-5">
          <span className="size-4 rounded-sm border-2 border-[#5f6368]/70" aria-hidden="true" />
          <RefreshCw className="size-4" aria-hidden="true" />
          <MoreVertical className="size-4" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-5 text-xs">
          <span>1–{emails.length} of {emails.length}</span>
          <ChevronLeft className="size-4 text-[#bdc1c6]" aria-hidden="true" />
          <ChevronRight className="size-4" aria-hidden="true" />
        </div>
      </div>
      <nav aria-label="Mail categories" className="grid h-14 max-w-[760px] grid-cols-3 border-b border-[#e1e4e8]">
        <a href="#primary" aria-current="page" className="relative flex items-center gap-4 px-5 font-medium text-[#0b57d0] after:absolute after:inset-x-2 after:bottom-0 after:h-[3px] after:rounded-t-full after:bg-[#0b57d0]">
          <Inbox className="size-5" aria-hidden="true" /><span>Primary</span>
        </a>
        <a href="#promotions" className="flex items-center gap-4 px-5 font-medium text-[#5f6368] hover:bg-[#f8fafd]">
          <Tag className="size-5" aria-hidden="true" /><span>Promotions</span>
        </a>
        <a href="#updates" className="flex items-center gap-4 px-5 font-medium text-[#5f6368] hover:bg-[#f8fafd]">
          <Clock3 className="size-5" aria-hidden="true" /><span>Updates</span>
        </a>
      </nav>
      {emails.map((email) => <EmailRow key={email.id} email={email} />)}
    </section>
  );
}
