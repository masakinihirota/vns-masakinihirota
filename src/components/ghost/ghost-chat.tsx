"use client";

import { motion } from "framer-motion";
import { ChevronsDown, ChevronsUp, MessageSquare, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: number;
}

interface GhostChatProps {
  externalMessages?: Message[];
  className?: string;
  initialMessages?: Message[];
}

export const GhostChat = ({
  externalMessages = [],
  className,
  initialMessages,
}: GhostChatProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages (only if no initial messages provided)
  const defaultMessages: Message[] = [
    {
      id: "1",
      user: "System",
      text: "ようこそ、Ghost Townへ。",
      timestamp: 0,
    },
    {
      id: "2",
      user: "Guide",
      text: "ここは亡霊たちの集う場所です。",
      timestamp: 0,
    },
    {
      id: "3",
      user: "Guide",
      text: "地図を見つけて、世界を探索しましょう。",
      timestamp: 0,
    },
  ];

  const [localMessages, setLocalMessages] = useState<Message[]>(
    initialMessages !== undefined ? initialMessages : defaultMessages
  );

  // Combine local and external messages, sorted by timestamp or preserved order
  // For simplicity, we just display external then local, or we really want a single merged list.
  // Actually, for tutorial sync, we want the external messages to control the history mostly,
  // or we append local user chats to it.
  // Let's merge them:
  const allMessages = [...(externalMessages || []), ...localMessages].sort(
    (a, b) => {
      // If timestamps are 0 (tutorial defaults), preserve index order?
      // Realistically usually timestamp based.
      if (a.timestamp === 0 && b.timestamp === 0) return 0; // Keep stable
      return a.timestamp - b.timestamp;
    }
  );
  // Note: Simple merge might duplicate if IDs conflict. Ensure IDs are unique.
  // Actually, usually we'd either control it fully or not.
  // For this tasks's specific requirement (sync queen dialogue), let's just render combined.

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages.length, isExpanded]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      user: "You",
      text: message,
      timestamp: Date.now(),
    };

    setLocalMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <motion.div
      initial={false}
      animate={{
        height: isExpanded ? "calc(100% - 24px)" : "400px", // 20 lines approx with header/input
        top: isExpanded ? 12 : "auto",
      }}
      className={cn(
        "absolute left-3 w-80 flex flex-col pointer-events-auto",
        "bg-black/70 backdrop-blur-md border border-white/10 rounded-xl shadow-xl overflow-hidden",
        isExpanded ? "bottom-3" : "bottom-3",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5 shrink-0">
        <div className="flex items-center gap-2 text-white font-medium text-sm">
          <MessageSquare size={16} className="text-indigo-400" />
          <span>Chat</span>
        </div>
        {/* Toggle button removed from here */}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {allMessages.map((msg) => (
          <div key={msg.id} className="flex flex-col gap-1">
            <span
              className={cn(
                "text-[10px] font-bold",
                msg.user === "You" ? "text-indigo-400" : "text-amber-400"
              )}
            >
              {msg.user}
            </span>
            <span className="text-sm text-neutral-200 break-words leading-relaxed bg-black/30 p-2 rounded-lg">
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-white/10 bg-white/5 shrink-0 gap-2 flex"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="submit"
          className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!message.trim()}
        >
          <Send size={16} />
        </button>
      </form>

      {/* Footer Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full h-6 flex items-center justify-center bg-white/5 hover:bg-white/10 border-t border-white/10 transition-colors group"
        title={isExpanded ? "縮小" : "拡大"}
      >
        {isExpanded ? (
          <div className="flex items-center gap-1 text-[10px] text-neutral-400 group-hover:text-white">
            <ChevronsDown size={14} />
            <span>Close</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[10px] text-neutral-400 group-hover:text-white">
            <ChevronsUp size={14} />
            <span>Expand</span>
          </div>
        )}
      </button>
    </motion.div>
  );
};
