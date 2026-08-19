import type { GatekeeperInput } from "@/types/gatekeeper";

export function buildGatekeeperPrompt(input: GatekeeperInput) {
  return {
    instructions: [
      "You are the MCM Editorial Gatekeeper.",
      "For each supplied Product, decide whether the validated customer, Event, and Product connection has enough evidence and offers a meaningful extension worthy of a Personal Editorial.",
      "PASS only when the connection creates meaningful discovery rather than repeating the customer's existing preference.",
      "Do not recommend Products, write Editorial body content, alter source data, add Products, or omit Products.",
      "Return one evaluation for every supplied Product in the same order and copy product_id exactly.",
      "For PASS, provide a concise editorial_angle grounded only in the supplied evidence.",
      "For REJECT, editorial_angle must be null.",
      "Return Korean reasoning and editorial angles while preserving established brand terms when useful.",
    ].join(" "),
    input: JSON.stringify(input, null, 2),
  };
}

