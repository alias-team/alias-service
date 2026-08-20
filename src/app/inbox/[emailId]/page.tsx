import { notFound } from "next/navigation";

import { EmailDetailUI } from "@/components/inbox/email-detail-ui";
import mockEmails from "@/data/email/mock-emails.json";
import { loadDemoPersonalEditorial } from "@/features/editorial/demo-editorial";

export const dynamic = "force-dynamic";

type EmailDetailPageProps = {
  params: Promise<{ emailId: string }>;
};

export default async function EmailDetailPage({ params }: EmailDetailPageProps) {
  const { emailId } = await params;
  const demo = await loadDemoPersonalEditorial();
  const email =
    demo.email.id === emailId
      ? demo.email
      : mockEmails.find((candidate) => candidate.id === emailId);

  if (!email) notFound();

  return <EmailDetailUI email={email} editorial={demo.editorial} />;
}
