"use client";

import { GhostOverlayProps } from "@/components/ghost/ghost-overlay";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

// キーワードハイライト用の型
export interface HighlightKeyword {
  label: string;
  color?: string; // デフォルトは indigo
}

export interface QueenDialogueProps extends GhostOverlayProps {
  onNext: () => void;
  dialogue: {
    text: string;
    emotion?: "neutral" | "smile" | "serious";
  };
  speed?: "instant" | "fast" | "normal";
  speaker?: "The Queen" | "Guide";
  choices?: { label: string; onClick: () => void }[];
  /** ハイライトするキーワードリスト */
  highlightKeywords?: HighlightKeyword[];
}

export const QueenDialogue = ({
  onNext,
  dialogue,
  speed = "normal",
  speaker = "The Queen",
  choices,
  highlightKeywords = [],
}: QueenDialogueProps) => {
  // Typewriter effect logic
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);

    if (speed === "instant") {
      setDisplayedText(dialogue.text);
      setIsTyping(false);
      return;
    }

    const delay = speed === "fast" ? 10 : 30;
    let i = 0;
    const interval = setInterval(() => {
      // Simple typewriter
      setDisplayedText((prev) => {
        const nextChar = dialogue.text.charAt(prev.length);
        if (!nextChar) return prev;
        return prev + nextChar;
      });
    }, delay); // Speed

    // Stop condition
    const timeout = setTimeout(
      () => {
        clearInterval(interval);
        setDisplayedText(dialogue.text);
        setIsTyping(false);
      },
      30 * dialogue.text.length + 100
    );

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [dialogue.text, speed]); // Added speed dependency

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click from propagating to Phaser game canvas
    e.stopPropagation();
    e.preventDefault();

    // Prevent click action if choices are displayed (user must select a choice)
    if (!isTyping && choices && choices.length > 0) {
      return;
    }

    if (isTyping) {
      setDisplayedText(dialogue.text);
      setIsTyping(false);
    } else {
      onNext();
    }
  };

  const isQueen = speaker === "The Queen";

  // キーワードをハイライトする関数
  const renderHighlightedText = useMemo(() => {
    if (!highlightKeywords || highlightKeywords.length === 0) {
      return displayedText;
    }

    // キーワードでテキストを分割してハイライト
    const parts: (string | React.ReactElement)[] = [];
    let remainingText = displayedText;
    let keyIndex = 0;

    while (remainingText.length > 0) {
      let earliestMatch: { index: number; keyword: HighlightKeyword; match: string } | null = null;

      // 最も早く出現するキーワードを探す
      for (const keyword of highlightKeywords) {
        const index = remainingText.indexOf(keyword.label);
        if (index !== -1 && (earliestMatch === null || index < earliestMatch.index)) {
          earliestMatch = { index, keyword, match: keyword.label };
        }
      }

      if (earliestMatch) {
        // キーワード前のテキスト
        if (earliestMatch.index > 0) {
          parts.push(remainingText.slice(0, earliestMatch.index));
        }
        // ハイライトされたキーワード
        const colorClass = earliestMatch.keyword.color || "text-indigo-400";
        parts.push(
          <span
            key={`keyword-${keyIndex++}`}
            className={`${colorClass} font-bold bg-indigo-500/20 px-1 rounded`}
          >
            {earliestMatch.match}
          </span>
        );
        remainingText = remainingText.slice(earliestMatch.index + earliestMatch.match.length);
      } else {
        parts.push(remainingText);
        break;
      }
    }

    return parts;
  }, [displayedText, highlightKeywords]);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-end pb-32 px-4 z-50">
      {/* Avatar Display - Only for Queen for now */}
      <AnimatePresence>
        {isQueen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-0 right-0 md:right-20 w-80 h-[500px] pointer-events-none z-0"
          >
            {/* Abstract Representation of the Queen */}
            <div className="w-full h-full relative flex items-end justify-center">
              {/* Aura */}
              <div className="absolute inset-0 bg-blue-600/20 blur-[60px] rounded-full animate-pulse-slow"></div>

              {/* Silhouette/Dress */}
              <div className="relative w-48 h-[400px] bg-gradient-to-t from-[#0B0F30] via-[#1e3a8a] to-transparent opacity-90 rounded-t-full shadow-2xl backdrop-blur-sm overflow-hidden border-x border-t border-white/10">
                {/* Water ripple effect (CSS simulation) */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-black to-transparent"></div>
              </div>

              {/* Veil/Face Area */}
              <div className="absolute top-20 w-32 h-40 bg-white/5 backdrop-blur-md rounded-full border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-300/20 to-purple-300/10 rounded-full blur-md"></div>
              </div>

              {/* Floating Particles */}
              <div className="absolute top-0 w-full h-full">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute bg-blue-400/50 rounded-full blur-sm animate-float"
                    style={{
                      width: Math.random() * 10 + 5 + "px",
                      height: Math.random() * 10 + 5 + "px",
                      left: Math.random() * 100 + "%",
                      top: Math.random() * 80 + "%",
                      animationDuration: Math.random() * 3 + 2 + "s",
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Window */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`pointer-events-auto backdrop-blur-xl border w-full max-w-4xl mx-auto rounded-xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative cursor-pointer transition-colors z-10
          ${isQueen
            ? "bg-[#050814]/90 border-indigo-500/30" // Removed hover effect
            : "bg-neutral-900/90 border-amber-500/30"
          }
        `}
        onClick={handleClick}
      >
        <div className="flex items-center gap-3 mb-3 border-b border-white/10 pb-2">
          <span
            className={`font-bold tracking-widest text-sm uppercase ${isQueen ? "text-indigo-400" : "text-amber-400"
              }`}
          >
            {speaker === "The Queen" ? "The Queen" : "The Guide"}
          </span>
          <span className="text-white font-serif text-lg">
            {speaker === "The Queen" ? "真咲女王" : "導き手"}
          </span>
        </div>

        <p className="text-neutral-200 text-lg md:text-xl leading-relaxed font-medium min-h-[4em] whitespace-pre-wrap">
          {renderHighlightedText}
          {isTyping && (
            <span
              className={`inline-block w-2 h-5 ml-1 animate-pulse align-middle ${isQueen ? "bg-indigo-500" : "bg-amber-500"
                }`}
            ></span>
          )}
        </p>

        {/* Choices or Click Indicator */}
        {!isTyping && choices && choices.length > 0 ? (
          <div className="w-full flex justify-end gap-3 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {choices.map((choice, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  choice.onClick();
                }}
                className={`
                  px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95
                  ${i === 0
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-600"
                  }
                `}
              >
                {choice.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="absolute bottom-4 right-6 flex items-center gap-2 text-xs text-neutral-500 animate-pulse">
            <span>Click to continue</span>
            <span className="w-4 h-4 border-r-2 border-b-2 border-neutral-500 rotate-45 mb-1"></span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

