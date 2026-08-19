import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import mockEditorial from "@/data/editorial/mock-editorial.json";
import mockEmails from "@/data/email/mock-emails.json";
import { personalEditorialSchema } from "@/lib/validation/editorial.schema";
import EmailDetailPage from "@/app/inbox/[emailId]/page";
import { EmailDetailUI } from "./email-detail-ui";

const editorial = personalEditorialSchema.parse(mockEditorial);

describe("EmailDetailUI", () => {
  it("renders email-001 through the dynamic detail route", async () => {
    const page = await EmailDetailPage({
      params: Promise.resolve({ emailId: "email-001" }),
    });
    const markup = renderToStaticMarkup(page);

    expect(markup).toContain('data-inbox-component="EmailDetail"');
    expect(markup).toContain("Your Personal MCM Issue 01 has arrived");
    expect(markup).toContain('data-editorial-container="true"');
  });

  it("renders Gmail detail actions and message metadata", () => {
    const markup = renderToStaticMarkup(
      <EmailDetailUI email={mockEmails[0]} editorial={editorial} />,
    );

    expect(markup).toContain('data-inbox-component="EmailDetail"');
    expect(markup).toContain('aria-label="Back to inbox"');
    expect(markup).toContain('href="/inbox"');
    expect(markup).toContain('aria-label="Archive"');
    expect(markup).toContain('aria-label="Delete"');
    expect(markup).toContain('aria-label="Mark as unread"');
    expect(markup).toContain('aria-label="More actions"');
    expect(markup).toContain("MCM Editorial Team");
    expect(markup).toContain("editorial@mcmworldwide.com");
    expect(markup).toContain("to me");
    expect(markup).toContain("Your Personal MCM Issue 01 has arrived");
    expect(markup).toContain("Aug 19");
  });

  it("renders the existing TASK-403 editorial renderer for email-001", () => {
    const markup = renderToStaticMarkup(
      <EmailDetailUI email={mockEmails[0]} editorial={editorial} />,
    );

    expect(markup).toContain('data-editorial-container="true"');
  });

  it("renders a simple message body for a non-editorial email", () => {
    const markup = renderToStaticMarkup(
      <EmailDetailUI email={mockEmails[1]} editorial={editorial} />,
    );

    expect(markup).toContain("MCM Client Services");
    expect(markup).toContain("Your MCM account update");
    expect(markup).toContain(
      "Your customer profile preferences were updated successfully.",
    );
    expect(markup).not.toContain('data-editorial-container="true"');
  });
});
