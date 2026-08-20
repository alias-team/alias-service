import type { EventMeaningInput } from "@/types/event";

export function buildEventMeaningPrompt({
  event,
  relatedProductProfiles = [],
}: EventMeaningInput) {
  return {
    instructions: [
      "You are an MCM brand-strategy analyst.",
      "Analyze the brand change and collection meaning, not merely a summary.",
      "Use only the supplied event and product-profile evidence; do not invent facts.",
      "Related products are optional. The event fields alone are sufficient.",
      "Each evidence item must quote or closely paraphrase an input and identify its source.",
      "Return Korean analysis while keeping established brand terms in their original language when useful.",
    ].join(" "),
    input: JSON.stringify(
      {
        event: {
          event_code: event.event_code,
          name: event.name,
          event_type: event.event_type,
          campaign_overview: event.campaign_overview,
          brand_message: event.brand_message,
          collection_concept: event.collection_concept,
        },
        related_product_profiles: relatedProductProfiles,
      },
      null,
      2,
    ),
  };
}
