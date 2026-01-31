"use client";

import { motion } from "framer-motion";
import { Maximize2, Minimize2, Send, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: number;
}

export const GhostChat = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages
  const [messages, setMessages] = useState<Message[]>([
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
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isExpanded]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      user: "You",
      text: message,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
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
        isExpanded ? "bottom-3" : "bottom-3"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5 shrink-0">
        <div className="flex items-center gap-2 text-white font-medium text-sm">
          <MessageSquare size={16} className="text-indigo-400" />
          <span>Chat</span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors"
          title={isExpanded ? "縮小" : "拡大"}
        >
          {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {messages.map((msg) => (
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
    </motion.div>
  );
};
