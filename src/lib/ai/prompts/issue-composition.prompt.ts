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
      "Each Product in pass_product_pool already carries existing_preference, new_expression, and extension, already decided by the customer analysis that produced it — use these, and only these, as the direct basis for personal_connection. Do not decide a new customer preference, a new customer-Product connection, or a broader reading of the Event Meaning; only edit and consolidate what these fields already say.",
      "personal_connection is one Issue-level object, not one per Product, even when multiple Products passed. Synthesize existing_preference, new_expression, and extension across every supplied Product into a single coherent statement for each of the three parts — do not pick one Product's values and use them alone, and do not simply concatenate the Products' text with separators.",
      "Write personal_connection as three parts: existing_preference (what the customer has already favored, synthesized only from the supplied existing_preference values), new_expression (what is new in this Event or these Products, synthesized only from the supplied new_expression values), and connection_reason (why this is a meaningful extension for this specific customer rather than a plain repeat or a generic recommendation, synthesized only from the supplied extension values).",
      "Copy event_id and product_id values exactly from the input. event_theme and brand_direction in brand_connection will be overwritten deterministically after generation, so any value you write for them is discarded — focus your effort on connection_narrative instead.",
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
