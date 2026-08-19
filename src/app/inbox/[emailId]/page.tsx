import { notFound } from "next/navigation";

import { EmailDetailUI } from "@/components/inbox/email-detail-ui";
import mockEditorial from "@/data/editorial/mock-editorial.json";
import mockEmails from "@/data/email/mock-emails.json";
import { personalEditorialSchema } from "@/lib/validation/editorial.schema";

const editorial = personalEditorialSchema.parse(mockEditorial);

type EmailDetailPageProps = {
  params: Promise<{ emailId: string }>;
};

export function generateStaticParams() {
  return mockEmails.map((email) => ({ emailId: email.id }));
}

export default async function EmailDetailPage({ params }: EmailDetailPageProps) {
  const { emailId } = await params;
  const email = mockEmails.find((candidate) => candidate.id === emailId);

  if (!email) notFound();

  return <EmailDetailUI email={email} editorial={editorial} />;
}
