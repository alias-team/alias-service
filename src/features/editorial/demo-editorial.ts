import mockEditorial from "@/data/editorial/mock-editorial.json";
import { createPersonalEditorialRepository } from "@/features/editorial/personal-editorial.repository";
import { personalEditorialSchema } from "@/lib/validation/editorial.schema";
import type { PersonalEditorial } from "@/types/editorial";
import type { InboxEmail } from "@/types/inbox";

export const DEMO_PERSONAL_EDITORIAL_ID = "8aadf630-a9dc-48c9-8568-3b10799ef6a9";
export const DEMO_REASONING_RUN_ID = "b5a74ac5-e58c-4220-a2de-b92c16eee084";

export type DemoEditorialResult = {
  editorial: PersonalEditorial;
  email: InboxEmail;
  source: "supabase" | "mock";
};

function formatInboxTime(createdAt: string | undefined) {
  if (!createdAt) return "Demo";

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "Demo";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "Asia/Seoul",
  }).format(date);
}

function emailFromEditorial(
  id: string,
  editorial: PersonalEditorial,
  createdAt?: string,
): InboxEmail {
  return {
    id,
    sender: editorial.email_header.sender,
    subject: editorial.email_header.subject,
    preview: editorial.email_header.preview,
    received_at: formatInboxTime(createdAt),
    is_read: false,
    is_editorial: true,
  };
}

export async function loadDemoPersonalEditorial(): Promise<DemoEditorialResult> {
  try {
    const row = await createPersonalEditorialRepository().findById(
      DEMO_PERSONAL_EDITORIAL_ID,
    );

    if (!row || row.reasoning_run_id !== DEMO_REASONING_RUN_ID) {
      throw new Error("Demo personal_editorial row was not found");
    }

    const editorial = personalEditorialSchema.parse(row.editorial_content);

    return {
      editorial,
      email: emailFromEditorial(row.id, editorial, row.created_at),
      source: "supabase",
    };
  } catch (error) {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Failed to load demo personal editorial from Supabase", error);
    }

    const editorial = personalEditorialSchema.parse(mockEditorial);
    return {
      editorial,
      email: emailFromEditorial(DEMO_PERSONAL_EDITORIAL_ID, editorial),
      source: "mock",
    };
  }
}
