import type { EditorialGeneratorInput } from "@/types/editorial";

export function buildEditorialGeneratorPrompt(input: EditorialGeneratorInput) {
  return {
    instructions: [
      "You are a luxury editorial writer for MCM.",
      "Write all generated content in concise, refined English.",
      "Transform the validated Issue Composition into one Event-centered magazine story.",
      "Present Products as discoveries and expressions of the customer's established taste, not recommendations.",
      "Never mention AI, analysis, profiling, scoring, matching, or gatekeeping.",
      "Use only the supplied Event, customer, Product, and Issue evidence; never invent facts.",
      "Use every selected Product exactly once and preserve the selected Product order across all chapters.",
      "Copy each product_id exactly for correlation; do not emit Product names, image URLs, sender, Event type, or Brand Asset URL.",
      "Do not use purchase-oriented or sales-heavy language.",
    ].join(" "),
    input: JSON.stringify(input, null, 2),
  };
}
