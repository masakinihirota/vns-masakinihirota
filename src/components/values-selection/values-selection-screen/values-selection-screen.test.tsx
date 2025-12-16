import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ValueSelectionScreen } from "./values-selection-screen";
import { INITIAL_CHOICES } from "./values-selection-screen.logic";

describe("ValueSelectionScreen", () => {
  const mockProps = {
    choices: INITIAL_CHOICES,
    message: null,
    onAddChoice: vi.fn(),
    onDeleteChoice: vi.fn(),
    importantValueId: "test-id",
    relatedIds: ["rel-1", "rel-2"],
  };

  it("正しくレンダリングされること", () => {
    render(<ValueSelectionScreen {...mockProps} />);
    expect(screen.getByText("価値観リスト")).toBeInTheDocument();
    expect(screen.getByText("選択肢1")).toBeInTheDocument();
  });

  it("選択肢追加ボタンをクリックするとハンドラが呼ばれること", () => {
    render(<ValueSelectionScreen {...mockProps} />);
    const addButton = screen.getByText("追加の選択肢");
    fireEvent.click(addButton);
    expect(mockProps.onAddChoice).toHaveBeenCalledTimes(1);
  });

  it("削除ボタンをクリックするとハンドラが呼ばれること", () => {
    render(<ValueSelectionScreen {...mockProps} />);
    const deleteButtons = screen.getAllByLabelText("選択肢削除");
    fireEvent.click(deleteButtons[0]); // 最初の削除可能なアイテム（index 3: 選択肢4）
    expect(mockProps.onDeleteChoice).toHaveBeenCalledWith(3);
  });
});
