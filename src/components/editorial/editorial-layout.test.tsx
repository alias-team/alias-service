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
      content: "Your familiar taste, redefined by a new MCM expression.",
      cta_label: "Discover the Collection",
    },
  },
};

describe("EditorialEmail", () => {
  it("renders the complete editorial skeleton in reading order", () => {
    const markup = renderToStaticMarkup(<EditorialEmail data={editorial} />);
    const components = [
      "EditorialHeader",
      "HeroSection",
      "BrandStorySection",
      "DiscoveryChapter",
      "EditorialFooter",
    ];

    expect(markup).toContain('data-editorial-container="true"');
    expect(markup).toContain('width="1440"');
    expect(markup).toContain('data-editorial-element="EditionLabel"');
    expect(markup).toContain("AUGUST 2026 EDITION");
    expect(markup).not.toContain("MCM Editorial Team");
    expect(markup).toContain('data-editorial-element="MCMLogo"');
    expect(markup).toContain('data-editorial-element="FooterMCMLogo"');
    expect(markup).toContain('data-editorial-element="BrandStoryDropCap"');
    expect(markup).toContain('src="/images/mcm-logo.png"');
    expect(markup).toContain('height="72"');
    expect(markup).toContain('width="72"');
    expect(markup).toContain("/images/mcm-editorial-pattern.png");
    expect(markup).not.toContain("border-bottom:1px solid #D7C6A5");
    expect(markup).not.toContain('data-editorial-component="SectionDivider"');
    expect(markup).not.toContain('data-section="Hero"');
    expect(markup).not.toContain('data-section="Brand Story"');
    expect(markup).not.toContain('data-section="Discovery"');

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
    const textContent = markup.replace(/<[^>]+>/g, "");

    for (const content of [
      "Heritage in Motion",
      "A contemporary MCM chapter",
      "Familiar codes find a new rhythm.",
      "A Familiar Point of Departure",
      "Previous choices meet a fluid expression of heritage.",
      "A New Movement",
      "MCM heritage moves into a contemporary urban context.",
      "Product One",
      "The first discovery story.",
      "The first connection reason.",
      "Your familiar taste, redefined by a new MCM expression.",
    ]) {
      expect(textContent).toContain(content);
    }
    expect(markup).not.toContain("Discover the Collection");
    expect(markup).not.toContain("Heritage, Set in Motion");
    expect(markup).not.toContain("A new expression of familiar MCM codes.");

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
    const textContent = markup.replace(/<[^>]+>/g, "");

    expect(markup).toContain(longTitle);
    expect(textContent).toContain(longContent);
    expect(markup).not.toContain("overflow:hidden");
    expect(markup).toContain("white-space:nowrap");
  });
});
