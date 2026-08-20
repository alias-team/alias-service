import type { InboxEmail } from "@/types/inbox";
import { EmailList } from "./email-list";
import { InboxHeader } from "./inbox-header";
import { InboxSidebar } from "./inbox-sidebar";

type InboxUIProps = {
  emails: InboxEmail[];
};

export function InboxUI({ emails }: InboxUIProps) {
  return (
    <div className="flex h-screen min-w-[1024px] flex-col overflow-hidden bg-white text-[#1f1f1f] [font-family:Arial,Helvetica,sans-serif]">
      <InboxHeader />
      <div className="flex min-h-0 flex-1">
        <InboxSidebar />
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
          <EmailList emails={emails} />
        </main>
      </div>
    </div>
  );
}
