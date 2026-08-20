import Link from "next/link";
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Inbox,
  Keyboard,
  MoreVertical,
  Paperclip,
  RefreshCw,
  Star,
  Tag,
  Trash2,
  Users,
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
      className={`group relative z-0 grid h-[42px] grid-cols-[16px_18px_160px_minmax(0,1fr)_64px] items-center gap-4 border-b border-[#ececec] px-5 text-sm transition-shadow hover:z-10 hover:bg-white hover:shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] ${
        email.is_editorial ? "bg-[#fdf6f2]" : "bg-white"
      }`}
    >
      <button
        type="button"
        aria-label={`Select email from ${email.sender}`}
        className="size-4 rounded-[3px] border-[1.6px] border-[#80868b]"
      >
        <span className="sr-only">Select</span>
      </button>
      <button
        type="button"
        aria-label={`Star email from ${email.sender}`}
        className="grid size-[18px] place-items-center text-[#80868b]"
      >
        <Star className="size-[18px]" aria-hidden="true" />
      </button>
      <Link
        href={`/inbox/${email.id}`}
        className={`truncate ${
          email.is_editorial
            ? "font-bold text-[#7a1229]"
            : email.is_read
              ? "font-normal text-[#5f6368]"
              : "font-bold text-[#1f1f1f]"
        }`}
      >
        {email.sender}
      </Link>
      <Link
        href={`/inbox/${email.id}`}
        className="flex min-w-0 items-center gap-1.5 whitespace-nowrap"
      >
        {email.is_editorial && (
          <span className="shrink-0 rounded-[10px] bg-[#7a1229] px-[9px] py-[3px] text-[11px] font-bold text-white">
            중요
          </span>
        )}
        <span
          className={`shrink-0 ${
            email.is_read ? "font-normal text-[#3c4043]" : "font-bold text-[#1f1f1f]"
          }`}
        >
          {email.subject}
        </span>
        <span className="truncate font-normal text-[#5f6368]">
          {" "}
          - {email.preview}
        </span>
      </Link>
      {email.id === "email-013" && (
        <Paperclip
          className="absolute right-[92px] size-[15px] text-[#5f6368]"
          aria-label="Attachment"
        />
      )}
      <Link
        href={`/inbox/${email.id}`}
        className={`text-right text-[12.5px] group-hover:hidden ${
          email.is_read ? "font-normal text-[#5f6368]" : "font-bold text-[#1f1f1f]"
        }`}
      >
        <time>{email.received_at}</time>
      </Link>
      <div className="absolute right-4 hidden items-center gap-0.5 bg-white group-hover:flex">
        <button type="button" aria-label="Archive email" className="grid size-8 place-items-center rounded-full hover:bg-[#e2e5ea]">
          <Archive className="size-4 text-[#5f6368]" aria-hidden="true" />
        </button>
        <button type="button" aria-label="Delete email" className="grid size-8 place-items-center rounded-full hover:bg-[#e2e5ea]">
          <Trash2 className="size-4 text-[#5f6368]" aria-hidden="true" />
        </button>
        <button type="button" aria-label="Snooze email" className="grid size-8 place-items-center rounded-full hover:bg-[#e2e5ea]">
          <Clock3 className="size-4 text-[#5f6368]" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function EmailList({ emails }: EmailListProps) {
  return (
    <section
      data-inbox-component="EmailList"
      aria-label="Email list"
      className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f6f8fc] px-4 pb-4"
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex h-[52px] shrink-0 items-center gap-1.5 rounded-2xl px-3 text-[#5f6368]">
        <button type="button" aria-label="Select all emails" className="grid size-[38px] place-items-center rounded-full hover:bg-[#f1f3f4]">
          <span className="size-[18px] rounded-[3px] border-[1.6px] border-[#5f6368]" aria-hidden="true" />
        </button>
        <span aria-hidden="true" className="mr-1.5 text-[10px]">⌄</span>
        <button type="button" aria-label="Refresh inbox" className="grid size-[38px] place-items-center rounded-full hover:bg-[#f1f3f4]">
          <RefreshCw className="size-[17px]" aria-hidden="true" />
        </button>
        <button type="button" aria-label="More inbox actions" className="grid size-[38px] place-items-center rounded-full hover:bg-[#f1f3f4]">
          <MoreVertical className="size-[17px]" aria-hidden="true" />
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-1 text-[13px]">
          <span className="mr-1.5">1,039개 중 1–50</span>
          <button type="button" aria-label="Previous page" className="grid size-[34px] place-items-center rounded-full hover:bg-[#f1f3f4]">
            <ChevronLeft className="size-4 text-[#bdc1c6]" aria-hidden="true" />
          </button>
          <button type="button" aria-label="Next page" className="grid size-[34px] place-items-center rounded-full hover:bg-[#f1f3f4]">
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
          <button type="button" aria-label="Input tools" className="ml-1 flex items-center gap-0.5 rounded-2xl px-2 py-1 hover:bg-[#f1f3f4]">
            <Keyboard className="size-[17px]" aria-hidden="true" />
            <span aria-hidden="true" className="text-[10px]">⌄</span>
          </button>
        </div>
        </div>

        <nav aria-label="Mail categories" className="flex h-12 shrink-0 border-b border-[#e8eaed]">
        <a href="#primary" aria-label="Primary" aria-current="page" className="relative flex shrink-0 items-center gap-2.5 bg-[#e8f0fe] px-5 text-sm font-semibold text-[#1a73e8] after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-[#1a73e8]">
          <Inbox className="size-[18px]" aria-hidden="true" />
          <span>기본</span>
        </a>
        <a href="#promotions" aria-label="Promotions" className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden px-5 text-sm font-medium text-[#5f6368] hover:bg-[#f8fafd]">
          <Tag className="size-[18px] shrink-0" aria-hidden="true" />
          <span>프로모션</span>
          <span className="shrink-0 rounded-[10px] bg-[#1e8e3e] px-2 py-0.5 text-[11px] font-bold text-white">새 메일 49개</span>
          <span className="truncate text-xs font-normal">Acne Studios — (광고)프린지 데님</span>
        </a>
        <a href="#social" aria-label="Social" className="flex shrink-0 items-center gap-2.5 px-5 text-sm font-medium text-[#5f6368] hover:bg-[#f8fafd]">
          <Users className="size-[18px]" aria-hidden="true" />
          <span>소셜</span>
        </a>
        <a href="#updates" aria-label="Updates" className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden px-5 text-sm font-medium text-[#5f6368] hover:bg-[#f8fafd]">
          <Clock3 className="size-[18px] shrink-0" aria-hidden="true" />
          <span>업데이트</span>
          <span className="shrink-0 rounded-[10px] bg-[#e8710a] px-2 py-0.5 text-[11px] font-bold text-white">새 메일 4개</span>
          <span className="truncate text-xs font-normal">팀 매니패스트 — 매니패스트 2.0</span>
        </a>
        </nav>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {emails.map((email) => (
            <EmailRow key={email.id} email={email} />
          ))}
        </div>
      </div>
    </section>
  );
}
