/**
 * @file Sampleページのテストファイル
 * @description Sampleページのコンポーネントと機能をテストします
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Sample Page", () => {
  it("sampleへのLinkテキストが表示されること", () => {
    render(<Home />);
    const linkText = screen.getByText("sampleへのLink");
    expect(linkText).toBeDefined();
  });

  it("sampleリンクが正しいhref属性を持つこと", () => {
    render(<Home />);
    const link = screen.getByRole("link", { name: "sample" });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("sample");
  });

  it("メイン要素が存在すること", () => {
    const { container } = render(<Home />);
    const main = container.querySelector("main");
    expect(main).toBeDefined();
  });
});
