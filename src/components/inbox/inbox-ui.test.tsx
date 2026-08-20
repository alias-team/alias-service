import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import mockEmails from "@/data/email/mock-emails.json";
import { InboxUI } from "./inbox-ui";

function escapeMarkupText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

describe("InboxUI", () => {
  it("renders the Gmail-style inbox shell and category navigation", () => {
    const markup = renderToStaticMarkup(<InboxUI emails={mockEmails} />);

    expect(markup).toContain('data-inbox-component="Sidebar"');
    expect(markup).toContain('data-inbox-component="Header"');
    expect(markup).toContain('data-inbox-component="EmailList"');
    expect(markup).toContain('aria-label="Search mail"');
    expect(markup).toContain('aria-label="Mail categories"');
    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain("Primary");
    expect(markup).toContain("Promotions");
    expect(markup).toContain("Updates");
    expect(markup).toContain("Gmail");
    expect(markup).not.toContain("Private Inbox");
    expect(markup).toContain("Inbox");
    expect(markup).toContain("Starred");
    expect(markup).toContain("Sent");
  });

  it("renders every mock email in source order", () => {
    const markup = renderToStaticMarkup(<InboxUI emails={mockEmails} />);

    expect(markup.match(/data-inbox-component="EmailRow"/g)).toHaveLength(
      mockEmails.length,
    );

    let previousIndex = -1;
    for (const email of mockEmails) {
      const escapedSubject = escapeMarkupText(email.subject);
      const currentIndex = markup.indexOf(escapedSubject);

      expect(markup).toContain(email.sender);
      expect(markup).toContain(escapeMarkupText(email.preview));
      expect(currentIndex).toBeGreaterThan(previousIndex);
      previousIndex = currentIndex;
    }
  });

  it("uses Gmail-style row controls while preserving read state and detail routes", () => {
    const markup = renderToStaticMarkup(<InboxUI emails={mockEmails} />);

    expect(markup.match(/aria-label="Select email from/g)).toHaveLength(
      mockEmails.length,
    );
    expect(markup.match(/aria-label="Star email from/g)).toHaveLength(
      mockEmails.length,
    );
    expect(markup).toContain('data-read-state="unread"');
    expect(markup).toContain('data-read-state="read"');
    expect(markup).toContain("MCM Editorial Team");
    expect(markup).toContain("MCM");

    for (const email of mockEmails) {
      expect(markup).toContain(`data-email-id="${email.id}"`);
      expect(markup).toContain(`href="/inbox/${email.id}"`);
    }
  });
});
