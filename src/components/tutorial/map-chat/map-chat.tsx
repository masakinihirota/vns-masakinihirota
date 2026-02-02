"use client";

/**
 * MapChat プレゼンテーションコンポーネント
 * ユーザー入力可能なインタラクティブチャット
 */
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  highlightKeywords,
  type ChatMessage,
  type HighlightRule,
  type HighlightSegment,
} from "./map-chat.logic";

export interface MapChatProps {
  messages: ChatMessage[];
  highlightRules: HighlightRule[];
  onSendMessage?: (text: string) => void;
}

/**
 * 発言者名を日本語に変換
 */
function getSpeakerLabel(speaker: ChatMessage["speaker"]): string {
  switch (speaker) {
    case "The Queen":
      return "真咲女王";
    case "Guide":
      return "導き手";
    case "System":
      return "システム";
    case "You":
      return "あなた";
    default:
      return speaker;
  }
}

/**
 * 発言者に応じたカラークラスを取得
 */
function getSpeakerColorClass(speaker: ChatMessage["speaker"]): string {
  switch (speaker) {
    case "The Queen":
      return "text-indigo-400";
    case "Guide":
      return "text-amber-400";
    case "System":
      return "text-neutral-500";
    case "You":
      return "text-emerald-400";
    default:
      return "text-neutral-300";
  }
}

/**
 * ハイライトセグメントをReact要素に変換
 */
function renderSegments(segments: HighlightSegment[]): React.ReactNode {
  return segments.map((segment, index) => {
    if (segment.type === "keyword") {
      return (
        <span
          key={index}
          className={`${segment.color} font-bold bg-indigo-500/20 px-1 rounded`}
        >
          {segment.content}
        </span>
      );
    }
    return <span key={index}>{segment.content}</span>;
  });
}

export const MapChat: React.FC<MapChatProps> = ({
  messages,
  highlightRules,
  onSendMessage,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  // 新しいメッセージが追加されたらスクロール
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && onSendMessage) {
      onSendMessage(trimmedValue);
      setInputValue("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="
        fixed left-4 top-24 bottom-8
        md:left-[calc(var(--sidebar-width)+1rem)]
        md:peer-data-[collapsible=icon]:left-[calc(var(--sidebar-width-icon)+1rem)]
        w-96
        bg-black/60 backdrop-blur-xl
        border border-white/10 rounded-2xl
        shadow-[0_8px_30px_rgba(0,0,0,0.4)]
        flex flex-col
        z-[40]
        pointer-events-auto
      "
      role="log"
      aria-label="チャット"
      aria-live="polite"
    >
      {/* ヘッダー */}
      <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
        <h2 className="text-lg font-bold text-neutral-200 tracking-wide">
          💬 チャット
        </h2>
      </div>

      {/* メッセージリスト */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
      >
        {messages.length === 0 ? (
          <p className="text-neutral-500 text-lg italic">
            メッセージを入力してください...
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl p-3 border ${
                msg.speaker === "You"
                  ? "bg-emerald-500/10 border-emerald-500/20 ml-4"
                  : "bg-white/5 border-white/5"
              }`}
            >
              <div
                className={`text-sm font-bold mb-1 ${getSpeakerColorClass(msg.speaker)}`}
              >
                {getSpeakerLabel(msg.speaker)}
              </div>
              <p className="text-lg text-neutral-200 leading-relaxed">
                {renderSegments(highlightKeywords(msg.text, highlightRules))}
              </p>
            </div>
          ))
        )}
      </div>

      {/* 入力エリア */}
      <div className="px-4 py-3 border-t border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ここにメッセージを入力..."
            className="
                            flex-1
                            bg-white/10 backdrop-blur-md
                            border border-white/20
                            rounded-xl
                            px-4 py-3
                            text-lg text-neutral-200
                            placeholder:text-neutral-500
                            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
                            transition-all
                        "
            aria-label="メッセージ入力"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="
                            bg-indigo-600 hover:bg-indigo-500
                            disabled:bg-neutral-700 disabled:cursor-not-allowed
                            text-white
                            p-3
                            rounded-xl
                            transition-all transform hover:scale-105 active:scale-95
                            disabled:hover:scale-100
                            shadow-lg shadow-indigo-500/20
                        "
            aria-label="送信"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
