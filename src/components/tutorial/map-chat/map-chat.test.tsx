/**
 * MapChat UIテスト + アクセシビリティテスト
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { MapChat, type MapChatProps } from "./map-chat";
import type { ChatMessage } from "./map-chat.logic";

const mockMessages: ChatMessage[] = [
  {
    id: "msg-1",
    speaker: "The Queen",
    text: "ようこそ、幽霊よ。",
    timestamp: Date.now(),
  },
  {
    id: "msg-2",
    speaker: "Guide",
    text: "私が導きます。",
    timestamp: Date.now() + 1000,
  },
];

const defaultProps: MapChatProps = {
  messages: mockMessages,
  highlightRules: [{ label: "幽霊", color: "text-cyan-400" }],
};

describe("MapChat", () => {
  it("メッセージ一覧を表示する", () => {
    // Arrange & Act
    render(<MapChat {...defaultProps} />);

    // Assert
    expect(screen.getByText(/ようこそ/)).toBeInTheDocument();
    expect(screen.getByText(/導きます/)).toBeInTheDocument();
  });

  it("発言者名を表示する", () => {
    // Arrange & Act
    render(<MapChat {...defaultProps} />);

    // Assert
    expect(screen.getByText("真咲女王")).toBeInTheDocument();
    expect(screen.getByText("導き手")).toBeInTheDocument();
  });

  it("キーワードがハイライトされる", () => {
    // Arrange & Act
    render(<MapChat {...defaultProps} />);

    // Assert
    const highlightedSpan = screen.getByText("幽霊");
    expect(highlightedSpan).toHaveClass("text-cyan-400");
  });

  it("メッセージがない場合は空状態を表示する", () => {
    // Arrange & Act
    render(<MapChat messages={[]} highlightRules={[]} />);

    // Assert
    expect(screen.getByText(/会話ログ/)).toBeInTheDocument();
  });

  describe("Accessibility", () => {
    it("アクセシビリティ違反がないこと", async () => {
      // Arrange
      const { container } = render(<MapChat {...defaultProps} />);

      // Act
      const results = await axe(container);

      // Assert
      expect(results).toHaveNoViolations();
    });
  });
});
