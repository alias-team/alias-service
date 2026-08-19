import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { PersonalEditorial } from "@/types/editorial";
import { EditorialEmail } from "./editorial-email";

const editorial: PersonalEditorial = {
  email_header: {
    sender: "MCM Editorial Team",
    subject: "Heritage, Set in Motion",
    preview: "A new expression of familiar MCM codes.",
  },
  editorial: {
    cover: {
      title: "Heritage in Motion",
      subtitle: "A contemporary MCM chapter",
      hero_message: "Familiar codes find a new rhythm.",
    },
    opening_message: {
      title: "A Familiar Point of Departure",
      content: "Previous choices meet a fluid expression of heritage.",
    },
    brand_story: {
      story_type: "collection",
      image_url: "https://example.com/brand-story.jpg",
      title: "A New Movement",
      content: "MCM heritage moves into a contemporary urban context.",
    },
    discovery_chapters: [
      {
        chapter_title: "First Chapter",
        chapter_intro: "The first chapter introduction.",
        products: [
          {
            product_id: "PRODUCT_001",
            product_name: "Product One",
            image_url: "https://example.com/product-one.jpg",
            discovery_story: "The first discovery story.",
            connection_reason: "The first connection reason.",
          },
          {
            product_id: "PRODUCT_002",
            product_name: "Product Two",
            image_url: "https://example.com/product-two.jpg",
            discovery_story: "The second discovery story.",
            connection_reason: "The second connection reason.",
          },
        ],
      },
      {
        chapter_title: "Second Chapter",
        chapter_intro: "The second chapter introduction.",
        products: [
          {
            product_id: "PRODUCT_003",
            product_name: "Product Three",
            image_url: "https://example.com/product-three.jpg",
            discovery_story: "The third discovery story.",
            connection_reason: "The third connection reason.",
          },
        ],
      },
    ],
    closing_message: {
      content: "A familiar sensibility in a new expression.",
      cta_label: "Discover the Collection",
    },
  },
};

describe("EditorialEmail", () => {
  it("renders the complete editorial skeleton in reading order", () => {
    const markup = renderToStaticMarkup(<EditorialEmail data={editorial} />);
    const components = [
      "EditorialHeader",
      "SectionDivider",
      "HeroSection",
      "BrandStorySection",
      "DiscoveryChapter",
      "EditorialFooter",
    ];

    expect(markup).toContain('data-editorial-container="true"');
    expect(markup).toContain('width="640"');
    expect(markup).toContain('data-editorial-element="BrandLogo"');
    expect(markup.match(/data-editorial-component="SectionDivider"/g)).toHaveLength(
      3,
    );
    expect(markup).toContain('data-section="Hero"');
    expect(markup).toContain('data-section="Brand Story"');
    expect(markup).toContain('data-section="Discovery"');
    expect(markup).toMatch(/data-section="Hero"(?:(?!data-editorial-component)[\s\S])*data-editorial-component="HeroSection"/);
    expect(markup).toMatch(/data-section="Brand Story"(?:(?!data-editorial-component)[\s\S])*data-editorial-component="BrandStorySection"/);
    expect(markup).toMatch(/data-section="Discovery"(?:(?!data-editorial-component)[\s\S])*data-editorial-component="DiscoveryChapter"/);

    let previousIndex = -1;
    for (const component of components) {
      const currentIndex = markup.indexOf(
        `data-editorial-component="${component}"`,
      );

      expect(currentIndex).toBeGreaterThan(previousIndex);
      previousIndex = currentIndex;
    }
  });

  it("renders alternating product story blocks without bound product data", () => {
    const markup = renderToStaticMarkup(<EditorialEmail data={editorial} />);

    expect(markup.match(/data-editorial-component="ProductStoryBlock"/g)).toHaveLength(
      3,
    );
    expect(markup).toContain('data-layout="image-first"');
    expect(markup).toContain('data-layout="text-first"');
    expect(markup.match(/data-image-column="58%"/g)).toHaveLength(3);
    expect(markup.match(/data-story-column="42%"/g)).toHaveLength(3);
    expect(markup).toContain('src="https://example.com/brand-story.jpg"');
    expect(markup).toContain('src="https://example.com/product-one.jpg"');
    expect(markup).toContain('src="https://example.com/product-two.jpg"');
    expect(markup).toContain('src="https://example.com/product-three.jpg"');
    expect(markup).not.toContain("placeholder");
    expect(markup).not.toContain("display:flex");
  });

  it("renders editorial content and preserves chapter and product order", () => {
    const markup = renderToStaticMarkup(<EditorialEmail data={editorial} />);

    for (const content of [
      "Heritage in Motion",
      "Heritage, Set in Motion",
      "A new expression of familiar MCM codes.",
      "A contemporary MCM chapter",
      "Familiar codes find a new rhythm.",
      "A Familiar Point of Departure",
      "Previous choices meet a fluid expression of heritage.",
      "A New Movement",
      "MCM heritage moves into a contemporary urban context.",
      "Product One",
      "The first discovery story.",
      "The first connection reason.",
      "A familiar sensibility in a new expression.",
      "Discover the Collection",
    ]) {
      expect(markup).toContain(content);
    }

    expect(markup.indexOf("First Chapter")).toBeLessThan(
      markup.indexOf("Second Chapter"),
    );
    expect(markup.indexOf("Product One")).toBeLessThan(
      markup.indexOf("Product Two"),
    );
    expect(markup.indexOf("Product Two")).toBeLessThan(
      markup.indexOf("Product Three"),
    );
  });

  it("keeps long editorial copy intact without clipping styles", () => {
    const longTitle = "A Deliberately Long Editorial Title That Must Wrap Across Multiple Lines Without Breaking the Email Container";
    const longContent = "This deliberately extended editorial paragraph verifies that the renderer preserves complete source copy while allowing the email client to determine natural line wrapping and vertical expansion without truncation.";
    const longEditorial: PersonalEditorial = {
      ...editorial,
      editorial: {
        ...editorial.editorial,
        cover: { ...editorial.editorial.cover, title: longTitle },
        brand_story: {
          ...editorial.editorial.brand_story,
          content: longContent,
        },
      },
    };

    const markup = renderToStaticMarkup(<EditorialEmail data={longEditorial} />);

    expect(markup).toContain(longTitle);
    expect(markup).toContain(longContent);
    expect(markup).not.toContain("overflow:hidden");
    expect(markup).not.toContain("white-space:nowrap");
  });
});
