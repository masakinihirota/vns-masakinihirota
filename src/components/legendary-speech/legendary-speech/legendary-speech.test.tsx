import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { LegendarySpeech } from "./legendary-speech";

describe("LegendarySpeech", () => {
  it("指定されたYouTube動画が埋め込まれている", () => {
    render(<LegendarySpeech />);
    const iframe = screen.getByTitle(/伝説のスピーチ/i);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/AZmYx5QBUNU"
    );
  });

  it("アクセシビリティの違反がない", async () => {
    const { container } = render(<LegendarySpeech />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
