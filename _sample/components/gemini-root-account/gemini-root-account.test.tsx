import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { GeminiRootAccountView } from "./gemini-root-account";
import { DUMMY_DATA } from "./gemini-root-account.logic";

describe("GeminiRootAccountView", () => {
  const defaultProps = {
    data: DUMMY_DATA,
    isLoading: false,
    isDummy: true,
    onCopyId: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("アクセシビリティ違反がないこと", async () => {
    const { container } = render(<GeminiRootAccountView {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("アカウント情報が正しく表示されること", () => {
    render(<GeminiRootAccountView {...defaultProps} />);

    expect(screen.getByTestId("account-title")).toBeInTheDocument();
    expect(screen.getByTestId("dummy-badge")).toBeInTheDocument();
    expect(screen.getByTestId("user-name")).toHaveTextContent(DUMMY_DATA.nickname);
    expect(screen.getByTestId("stats-points")).toHaveTextContent(new RegExp(DUMMY_DATA.currentPoints.toLocaleString()));
    expect(screen.getByTestId("stats-trust")).toHaveTextContent(new RegExp(`${DUMMY_DATA.trustScore}%`));
  });

  it("ローディング状態が表示されること", () => {
    render(<GeminiRootAccountView {...defaultProps} isLoading={true} />);
    expect(screen.getByText(/読み込み中/)).toBeInTheDocument();
  });

  it("データがない状態（フォールバック）が表示されること", () => {
    render(<GeminiRootAccountView {...defaultProps} data={null} />);
    expect(screen.getByText(/データが見つかりませんでした/)).toBeInTheDocument();
  });

  it("IDコピーボタンがクリックされたときに onCopyId が呼ばれること", () => {
    render(<GeminiRootAccountView {...defaultProps} />);

    const copyButton = screen.getByLabelText(/IDをコピー/);
    fireEvent.click(copyButton);

    expect(defaultProps.onCopyId).toHaveBeenCalledTimes(1);
  });

  it("名前の管理リンクが存在すること", () => {
    render(<GeminiRootAccountView {...defaultProps} />);
    const link = screen.getByText(/名前の管理/);
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/user-profile/manage");
  });

  it("統計情報（グループ数など）が表示されること", () => {
    render(<GeminiRootAccountView {...defaultProps} />);

    expect(screen.getByTestId("groups-count")).toHaveTextContent(DUMMY_DATA.groupsCount.toString());
    expect(screen.getByTestId("alliances-count")).toHaveTextContent(DUMMY_DATA.alliancesCount.toString());
  });
});
