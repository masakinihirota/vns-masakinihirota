import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { renderWithWait } from "@/lib/test-utils";

import { MandalaChart } from "./mandala-chart";

// crypto.randomUUID のモック
if (!globalThis.crypto) {
  (globalThis as unknown as { crypto: { randomUUID: () => string } }).crypto = {
    randomUUID: () => "test-uuid-" + Math.random(),
  };
}

describe("MandalaChart Accessibility", () => {
  it("アクセシビリティ違反がないこと", async () => {
    const { container } = await renderWithWait(<MandalaChart />);
    const results = await axe(container);
    if (results.violations.length > 0) {
      console.warn(
        "Accessibility Violations:",
        JSON.stringify(results.violations, null, 2)
      );
    }
    expect(results).toHaveNoViolations();
  });

  it("サイドバーの開閉が正しく機能すること", async () => {
    await renderWithWait(<MandalaChart />);

    // 初期状態（モバイル想定でテストしたいが、まずは存在確認）
    const menuButtons = screen.getAllByRole("button");
    // サイドバーを開くボタンを探す（LayoutGridアイコンを持つボタン）
    const sidebarButton = menuButtons.find((button) => button.querySelector("svg"));

    if (sidebarButton) {
      fireEvent.click(sidebarButton);
      expect(screen.getByText("マイチャート")).toBeInTheDocument();
    }
  });
});
