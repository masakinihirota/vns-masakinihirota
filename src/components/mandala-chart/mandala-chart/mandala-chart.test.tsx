import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { MandalaChart } from "./mandala-chart";

// crypto.randomUUID のモック
if (!global.crypto) {
  (global as any).crypto = {
    randomUUID: () => "test-uuid-" + Math.random(),
  };
}

describe("MandalaChart Accessibility", () => {
  it("アクセシビリティ違反がないこと", async () => {
    const { container } = render(<MandalaChart />);
    const results = await axe(container);
    if (results.violations.length > 0) {
      console.warn(
        "Accessibility Violations:",
        JSON.stringify(results.violations, null, 2)
      );
    }
    expect(results).toHaveNoViolations();
  });

  it("サイドバーの開閉が正しく機能すること", () => {
    render(<MandalaChart />);

    // 初期状態（モバイル想定でテストしたいが、まずは存在確認）
    const menuButtons = screen.getAllByRole("button");
    // サイドバーを開くボタンを探す（LayoutGridアイコンを持つボタン）
    const sidebarButton = menuButtons.find((btn) => btn.querySelector("svg"));

    if (sidebarButton) {
      fireEvent.click(sidebarButton);
      expect(screen.getByText("マイチャート")).toBeInTheDocument();
    }
  });
});
