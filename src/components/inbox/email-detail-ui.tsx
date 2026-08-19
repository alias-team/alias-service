import Link from "next/link";
import {
  Archive,
  ArrowLeft,
  Mail,
  MoreVertical,
  Reply,
  Star,
  Trash2,
} from "lucide-react";

import { EditorialEmail } from "@/components/editorial/editorial-email";
import type { PersonalEditorial } from "@/types/editorial";
import type { InboxEmail } from "@/types/inbox";
import { InboxHeader } from "./inbox-header";
import { InboxSidebar } from "./inbox-sidebar";

type EmailDetailUIProps = {
  email: InboxEmail;
  editorial: PersonalEditorial;
};

const actionClass =
  "grid size-10 place-items-center rounded-full text-[#5f6368] transition-colors hover:bg-[#e9eef6]";

function senderAddress(email: InboxEmail) {
  if (email.is_editorial) return "editorial@mcmworldwide.com";
  return `${email.sender.toLowerCase().replaceAll(" ", ".")}@mcmworldwide.com`;
}

export function EmailDetailUI({ email, editorial }: EmailDetailUIProps) {
  const showEditorial = email.id === "email-001" && email.is_editorial;

  return (
    <div className="flex min-h-screen min-w-[1024px] bg-[#f6f8fc] font-sans text-[#202124]">
      <InboxSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <InboxHeader />
        <main className="min-h-0 flex-1 px-4 pb-4">
          <article
            data-inbox-component="EmailDetail"
            className="min-h-full overflow-hidden rounded-2xl bg-white shadow-sm"
          >
            <div className="flex h-12 items-center border-b border-[#e1e4e8] px-3">
              <Link href="/inbox" aria-label="Back to inbox" className={actionClass}>
                <ArrowLeft className="size-5" aria-hidden="true" />
              </Link>
              <div className="mx-3 h-5 w-px bg-[#dadce0]" aria-hidden="true" />
              <button type="button" aria-label="Archive" className={actionClass}>
                <Archive className="size-5" aria-hidden="true" />
              </button>
              <button type="button" aria-label="Delete" className={actionClass}>
                <Trash2 className="size-5" aria-hidden="true" />
              </button>
              <button type="button" aria-label="Mark as unread" className={actionClass}>
                <Mail className="size-5" aria-hidden="true" />
              </button>
              <button type="button" aria-label="More actions" className={actionClass}>
                <MoreVertical className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="px-8 pb-14 pt-6">
              <div className="mb-7 flex items-start gap-4 pl-14">
                <h1 className="min-w-0 flex-1 text-[22px] leading-8 text-[#1f1f1f]">
                  {email.subject}
                </h1>
                {email.is_editorial && (
                  <span className="mt-1 rounded bg-[#fce8e6] px-2 py-1 text-[10px] font-bold text-[#b3261e]">
                    MCM
                  </span>
                )}
              </div>

              <div className="mb-6 flex items-start gap-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#5f6368] text-xs font-semibold text-white">
                  MCM
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-[#1f1f1f]">{email.sender}</span>
                    <span className="truncate text-xs text-[#5f6368]">
                      &lt;{senderAddress(email)}&gt;
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#5f6368]">to me</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#5f6368]">
                  <time>{email.received_at}</time>
                  <button type="button" aria-label="Star message" className="grid size-8 place-items-center rounded-full hover:bg-[#f1f3f4]">
                    <Star className="size-4" aria-hidden="true" />
                  </button>
                  <button type="button" aria-label="Reply" className="grid size-8 place-items-center rounded-full hover:bg-[#f1f3f4]">
                    <Reply className="size-4" aria-hidden="true" />
                  </button>
                  <button type="button" aria-label="Message actions" className="grid size-8 place-items-center rounded-full hover:bg-[#f1f3f4]">
                    <MoreVertical className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="ml-14">
                {showEditorial ? (
                  <div className="overflow-hidden rounded-lg border border-[#e1e4e8]">
                    <EditorialEmail data={editorial} />
                  </div>
                ) : (
                  <div className="max-w-3xl py-5 text-sm leading-7 text-[#3c4043]">
                    <p>Hello,</p>
                    <p className="mt-5">{email.preview}</p>
                    <p className="mt-7">MCM Client Services</p>
                  </div>
                )}
              </div>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
