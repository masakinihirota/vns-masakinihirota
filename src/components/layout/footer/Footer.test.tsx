import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Footer } from "./Footer";

// next/linkをモック
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("Footer", () => {
  it("伝説のスピーチへのリンクが含まれている", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /伝説のスピーチ/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/legendary-speech");
  });
});
