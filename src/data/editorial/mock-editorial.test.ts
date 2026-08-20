import { describe, expect, it } from "vitest";

import { personalEditorialSchema } from "@/lib/validation/editorial.schema";
import mockEditorial from "./mock-editorial.json";

describe("mock editorial", () => {
  it("matches the TASK-207 Personal Editorial contract", () => {
    expect(() => personalEditorialSchema.parse(mockEditorial)).not.toThrow();
  });

  it("preserves source product metadata and order", () => {
    const editorial = personalEditorialSchema.parse(mockEditorial);
    const products = editorial.editorial.discovery_chapters.flatMap(
      (chapter) => chapter.products,
    );

    expect(products.map((product) => product.product_id)).toEqual([
      "MCM-BAG-001",
      "MCM-BAG-002",
      "MCM-ACC-003",
    ]);
    expect(products.map((product) => product.product_name)).toEqual([
      "Aren Shopper in Visetos",
      "Stark Backpack in Visetos",
      "Reversible Liz Shopper",
    ]);
  });
});
