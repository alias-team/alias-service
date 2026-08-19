import type { InboxEmail } from "@/types/inbox";
import { EmailList } from "./email-list";
import { InboxHeader } from "./inbox-header";
import { InboxSidebar } from "./inbox-sidebar";

type InboxUIProps = {
  emails: InboxEmail[];
};

export function InboxUI({ emails }: InboxUIProps) {
  return (
    <div className="flex min-h-screen min-w-[1024px] bg-[#f6f8fc] font-sans text-[#202124]">
      <InboxSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <InboxHeader />
        <main className="min-h-0 flex-1 px-4 pb-4">
          <EmailList emails={emails} />
        </main>
      </div>
    </div>
  );
}
