import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { IdentityVisualization } from "./identity-visualization";
import { IDENTITY_CONFIG } from "./identity-visualization.logic";

// Refのモック
const mockAccountRef = { current: null };
const mockProfileRefs = { current: {} };

describe("IdentityVisualization", () => {
  const defaultProps = {
    activeProfile: "ghost",
    currentProfile: IDENTITY_CONFIG.ghost,
    account: IDENTITY_CONFIG.account,
    masks: IDENTITY_CONFIG.masks,
    linePath: "M 0 0 C 50 0 50 100 100 100",
    accountRef: mockAccountRef as unknown as React.RefObject<HTMLDivElement>,
    profileRefs: mockProfileRefs as unknown as React.MutableRefObject<
      Record<string, HTMLButtonElement | null>
    >,
    onProfileSelect: vi.fn(),
    onCreateMask: vi.fn(),
  };

  it("正しくレンダリングされる", () => {
    render(<IdentityVisualization {...defaultProps} />);
    expect(screen.getByText(/Identity Visualization/i)).toBeInTheDocument();
    // 複数箇所にある可能性があるため getAllByText を使用
    expect(
      screen.getAllByText(IDENTITY_CONFIG.account.name).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(IDENTITY_CONFIG.ghost.name).length
    ).toBeGreaterThan(0);
  });

  it("アクセシビリティ・ガイドラインに従っている", async () => {
    const { container } = render(<IdentityVisualization {...defaultProps} />);
    const results = await axe(container);
    // 完全にパスすることを確認
    expect(results).toHaveNoViolations();
  });

  it("プロフィールのクリックで onProfileSelect が呼ばれる", () => {
    render(<IdentityVisualization {...defaultProps} />);
    const maskButton = screen.getByText(IDENTITY_CONFIG.masks[0].name);
    maskButton.click();
    expect(defaultProps.onProfileSelect).toHaveBeenCalledWith(
      IDENTITY_CONFIG.masks[0].id
    );
  });
});
