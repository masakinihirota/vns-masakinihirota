import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { ValueSelectionScreen } from "./values-selection-screen";
import { INITIAL_CHOICES } from "./values-selection-screen.logic";

describe("ValueSelectionScreen", () => {
  const mockProperties = {
    choices: INITIAL_CHOICES,
    message: null,
    onAddChoice: vi.fn(),
    onDeleteChoice: vi.fn(),
    importantValueId: "test-id",
    relatedIds: ["rel-1", "rel-2"],
  };

  it("アクセシビリティ違反がないこと", async () => {
    const { container } = render(<ValueSelectionScreen {...mockProperties} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("正しくレンダリングされること", () => {
    render(<ValueSelectionScreen {...mockProperties} />);
    expect(screen.getByText("価値観リスト")).toBeInTheDocument();
    expect(screen.getByText("選択肢1")).toBeInTheDocument();
  });

  it("選択肢追加ボタンをクリックするとハンドラが呼ばれること", () => {
    render(<ValueSelectionScreen {...mockProperties} />);
    const addButton = screen.getByText("追加の選択肢");
    fireEvent.click(addButton);
    expect(mockProperties.onAddChoice).toHaveBeenCalledTimes(1);
  });

  it("削除ボタンをクリックするとハンドラが呼ばれること", () => {
    render(<ValueSelectionScreen {...mockProperties} />);
    const deleteButtons = screen.getAllByLabelText("選択肢削除");
    fireEvent.click(deleteButtons[0]); // 最初の削除可能なアイテム（index 3: 選択肢4）
    expect(mockProperties.onDeleteChoice).toHaveBeenCalledWith(3);
  });
});
