"use client";

/**
 * MapChat コンテナコンポーネント
 * ユーザー入力可能なインタラクティブチャットの状態管理
 */
import { useCallback, useState } from "react";
import { TUTORIAL_KEYWORDS } from "../tutorial-keywords.data";
import { MapChat } from "./map-chat";
import type { ChatMessage, HighlightRule } from "./map-chat.logic";

/**
 * チュートリアルキーワードからハイライトルールを生成
 */
const DEFAULT_HIGHLIGHT_RULES: HighlightRule[] = TUTORIAL_KEYWORDS.map((k) => ({
  label: k.label,
  color: "text-indigo-400",
}));

export interface MapChatContainerProps {
  /** 初期メッセージ（オプション） */
  initialMessages?: ChatMessage[];
}

export const MapChatContainer: React.FC<MapChatContainerProps> = ({
  initialMessages = [],
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const handleSendMessage = useCallback((text: string) => {
    const newMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      speaker: "You",
      text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  return (
    <MapChat
      messages={messages}
      highlightRules={DEFAULT_HIGHLIGHT_RULES}
      onSendMessage={handleSendMessage}
    />
  );
};

/**
 * チャットメッセージを管理するためのフック
 */
export function useMapChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = useCallback(
    (speaker: ChatMessage["speaker"], text: string) => {
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        speaker,
        text,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, newMessage]);
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, addMessage, clearMessages };
}
