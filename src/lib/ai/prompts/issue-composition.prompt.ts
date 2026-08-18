import type { IssueCompositionInput } from "@/types/issue-composition";

export function buildIssueCompositionPrompt(input: IssueCompositionInput) {
  return {
    instructions: [
      "You are an MCM editorial composition strategist.",
      "Compose one Event-centered Issue structure for the next Editorial Generator; do not write the Editorial body.",
      "Use every supplied PASS Product exactly once and preserve the supplied Product order.",
      "Never select, rank, truncate, add, merge, or omit Products.",
      "Treat the Event as the Issue theme and each Product as a distinct discovery within that one Issue.",
      "Define an issue theme, editorial angle, a concise role and discovery direction for each Product, and the brand connection.",
      "Copy event_id, event_theme, brand_direction, and product_id values exactly from the input.",
      "Use only supplied evidence and do not invent Product, Event, customer, or brand facts.",
      "Return Korean analysis while keeping established brand terms in their original language when useful.",
    ].join(" "),
    input: JSON.stringify(
      {
        event_id: input.event_id,
        event_meaning_profile: input.eventMeaningProfile,
        pass_product_pool: input.passProductPool,
      },
      null,
      2,
    ),
  };
}
