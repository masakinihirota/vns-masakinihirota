import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { LegendarySpeech } from "./legendary-speech";

describe("LegendarySpeech", () => {
  it("出典のYouTubeリンクが正しく設定されている", () => {
    render(<LegendarySpeech />);
    const link = screen.getByRole("link", { name: /YouTube/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      "https://www.youtube.com/watch?v=q8_9ckoVV5M"
    );
  });

  it("アクセシビリティの違反がない", async () => {
    const { container } = render(<LegendarySpeech />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
