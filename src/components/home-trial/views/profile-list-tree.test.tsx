import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProfileListTree } from "./profile-list-tree";

// local-storage-adapter のモック
vi.mock("@/lib/db/local-storage-adapter", () => ({
  getDeviceId: vi.fn(() => "test-device-id"),
  getLocalUserProfiles: vi.fn(() => Promise.resolve([])),
}));

// AccountCard のモック（依存関係を単純化するため）
vi.mock("../../home/start-page/root-account-card", () => ({
  AccountCard: () => <div data-testid="account-card">Account Card</div>,
}));

describe("ProfileListTree", () => {
  it("「仕事が目的のプロフィール(未作成)」というラベルが表示されていること", () => {
    render(<ProfileListTree />);
    expect(
      screen.getByText("仕事が目的のプロフィール(未作成)")
    ).toBeInTheDocument();
  });

  it("「遊びが目的のプロフィール(未作成)」というラベルが表示されていること", () => {
    render(<ProfileListTree />);
    expect(
      screen.getByText("遊びが目的のプロフィール(未作成)")
    ).toBeInTheDocument();
  });

  it("「パートナー探しが目的のプロフィール(未作成)」というラベルが表示されていること", () => {
    render(<ProfileListTree />);
    expect(
      screen.getByText("パートナー探しが目的のプロフィール(未作成)")
    ).toBeInTheDocument();
  });
});
