import { InboxUI } from "@/components/inbox/inbox-ui";
import mockEmails from "@/data/email/mock-emails.json";

export default function InboxPage() {
  return <InboxUI emails={mockEmails} />;
}
