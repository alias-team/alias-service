import { InboxUI } from "@/components/inbox/inbox-ui";
import mockEmails from "@/data/email/mock-emails.json";
import { loadDemoPersonalEditorial } from "@/features/editorial/demo-editorial";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const { email } = await loadDemoPersonalEditorial();

  return <InboxUI emails={[email, ...mockEmails]} />;
}
