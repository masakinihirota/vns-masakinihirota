"use client";

import { GhostChat, Message } from "@/components/ghost/ghost-chat"; // Import GhostChat and Message type
import {
  GhostOverlay,
  GhostOverlayProps,
} from "@/components/ghost/ghost-overlay";
import { TrialStorage } from "@/lib/trial-storage";
import { FastForward, Pause, Play, Timer, Zap } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react"; // Added useMemo, useRef
import { TrialBackButtonContent } from "../layout/trial-onboarding-back-button/TrialOnboardingBackButton";
import { QueenDialogue } from "./queen-dialogue";

const GameCanvas = dynamic(
  () => import("@/components/ghost/game-canvas").then((mod) => mod.GameCanvas),
  { ssr: false }
);

const SCENE_1_LINES = [
  "……お目覚めですか、名もなき魂よ。",
  "ここは『はじまりの国』。情報の洪水から逃れ、翼を休めるためのオアシスです。",
  "私はこの世界の理（ことわり）を見守る者。あなたがそう呼びたいのであれば、『真咲女王』でも構いません",
  "安心なさい。今のそなたは『幽霊（ゴースト）』。誰の目にも映らず、誰からも傷つけられることはありません。",
  "さあ、少し歩いてみましょう。この世界はあなたの心のように広大です。",
];

const SCENE_2_LINES = [
  "見えますか？ 人々がそれぞれの価値観で輝いているのが。",
  "そなたは今、彼らを見て(ウォッチ)しています。彼らはそなたに気づきません。",
  "近づきすぎる必要はありません。合わないと思えば、ただ静かに離れればよいのです（Drift）。",
  "それが、この世界で争わずに生きるための知恵なのですから。",
  "さて、迷わないように『地図』を探してきなさい。この近くに落ちているはずです。",
];

const SCENE_3_LINES = [
  // After finding map
  "……ふふ、どうやら観測だけでは退屈になってきたようですね。",
  "地図（コンパス）を手に入れましたね。これで行き先を知ることができます。",
  "そなたも『仮面』を被り、この舞踏会に参加しますか？",
  "恐れることはありません。仮面は一つではありません。仕事の顔、遊びの顔……そなたの望む数だけ用意しましょう。",
  "さあ、契約（ルートアカウント）は済んでいますね。",
  "『人を傷つけるような場所を作らない』。",
  "この誓いを胸に、そなたの最初を刻みなさい。",
];

export const TutorialStory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<
    "scene1" | "scene2" | "quest" | "scene3" | "end"
  >("scene1");
  const [lineIndex, setLineIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<"instant" | "fast" | "normal">("normal");
  const [isTrial, setIsTrial] = useState(false);
  const hasWarpedRef = useRef(false);

  // Persistence Effect
  useEffect(() => {
    // Check Trial status
    const checkTrial = () => {
      const data = TrialStorage.load();
      setIsTrial(!!data?.rootAccount);
    };
    checkTrial();

    const savedProgress = localStorage.getItem("vns_tutorial_progress");
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        // If saved phase is valid, use it. If it was "intro", keep it.
        if (parsed.phase && parsed.phase !== "intro") {
          setPhase(parsed.phase);
          setLineIndex(parsed.lineIndex);
        }
      } catch (e) {
        console.error("Failed to parse tutorial progress", e);
      }
    }
  }, []);

  // Sync with URL
  useEffect(() => {
    const pausedParam = searchParams.get("paused");
    setIsPaused(pausedParam === "true");
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem(
      "vns_tutorial_progress",
      JSON.stringify({ phase, lineIndex })
    );
  }, [phase, lineIndex]);

  // Manage dialogue progression
  const currentLines =
    phase === "scene1"
      ? SCENE_1_LINES
      : phase === "scene2"
        ? SCENE_2_LINES
        : phase === "scene3"
          ? SCENE_3_LINES
          : [];

  // Add logic to log dialogue to chat (if we had access to chat state).
  // Currently GhostChat has internal state. We will solve this by letting
  // the user know we moved the UI up as requested first.
  // Ideally we would lift state, but for now we focus on the positioning and link fix.

  const handleNext = () => {
    if (lineIndex < currentLines.length - 1) {
      setLineIndex(lineIndex + 1);
    } else {
      // Phase Transition
      if (phase === "scene1") {
        setPhase("scene2");
        setLineIndex(0);
      } else if (phase === "scene2") {
        setPhase("quest"); // Let user explore
        setLineIndex(0);
      } else if (phase === "scene3") {
        setPhase("end");
        // Navigate to profile creation or next step
        router.push("/onboarding-trial");
      }
    }
  };

  // Calculate Chat History
  const chatHistory = useMemo(() => {
    const history: Message[] = [];
    let idCounter = 1;

    const addLines = (lines: string[], untilIndex: number) => {
      lines.slice(0, untilIndex + 1).forEach((text, i) => {
        history.push({
          id: `story-${idCounter++}`,
          user: "Queen",
          text: text,
          timestamp: i, // Using index as mock timestamp for order
        });
      });
    };

    if (phase === "scene1") {
      addLines(SCENE_1_LINES, lineIndex);
    } else if (phase === "scene2") {
      addLines(SCENE_1_LINES, SCENE_1_LINES.length - 1); // All scene 1
      addLines(SCENE_2_LINES, lineIndex);
    } else if (phase === "quest") {
      addLines(SCENE_1_LINES, SCENE_1_LINES.length - 1);
      addLines(SCENE_2_LINES, SCENE_2_LINES.length - 1);
      history.push({
        id: `quest-start`,
        user: "System",
        text: "クエスト開始: 地図を探してください",
        timestamp: 999,
      });
    } else if (phase === "scene3") {
      addLines(SCENE_1_LINES, SCENE_1_LINES.length - 1);
      addLines(SCENE_2_LINES, SCENE_2_LINES.length - 1);
      // Quest log
      history.push({
        id: `quest-complete`,
        user: "System",
        text: "クエスト完了: 地図を獲得しました",
        timestamp: 1000,
      });
      addLines(SCENE_3_LINES, lineIndex);
    }

    return history;
  }, [phase, lineIndex]);

  // Input Locking: Only enabled if NOT paused AND in QUEST phase
  // "Talking phases" = scene1, scene2, scene3.
  const isInputEnabled = isPaused || phase === "quest";

  // const handleQuit = () => {
  //     router.push("/onboarding/choice");
  // };

  const togglePause = () => {
    const nextState = !isPaused;
    // Update URL to reflect state (and Sidebar will pick it up)
    const params = new URLSearchParams(searchParams.toString());
    if (nextState) {
      params.set("paused", "true");
    } else {
      params.delete("paused");
    }
    router.push(`/tutorial/story?${params.toString()}`);
  };

  const toggleSpeed = () => {
    setSpeed((prev) =>
      prev === "normal" ? "fast" : prev === "fast" ? "instant" : "normal"
    );
  };

  const renderOverlay = (props: GhostOverlayProps) => {
    // Initial Warp to Queen logic
    if (!hasWarpedRef.current && props.onWarp) {
      // Queen is at { x: 7, y: 3.5 } (Tiles)
      // Let's put player at 7, 5 (1.5 tiles below) facing her.
      const TARGET_X = 7 * 32;
      const TARGET_Y = 5 * 32;
      props.onWarp(TARGET_X, TARGET_Y);
      hasWarpedRef.current = true;
    }

    if (phase === "quest" && props.hasMap) {
      setTimeout(() => {
        setPhase("scene3");
        setLineIndex(0);
      }, 0);
      return null; // Will re-render
    }

    // If paused, just show GhostOverlay (free roam)
    if (isPaused) {
      return (
        <>
          <GhostOverlay {...props} />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-yellow-500/20 text-yellow-200 px-4 py-2 rounded-full backdrop-blur-md border border-yellow-500/30 font-medium">
            一時停止中 (自由行動モード)
          </div>
        </>
      );
    }

    if (phase === "scene1" || phase === "scene2" || phase === "scene3") {
      return (
        <>
          <QueenDialogue
            {...props}
            onNext={handleNext}
            speed={speed} // Pass speed prop
            dialogue={{
              text: currentLines[lineIndex] || "",
              emotion: "neutral", // Can map emotions to specific lines if needed
            }}
          />
          {/* Chat always visible during dialogue */}
          {/* Pass initialMessages={[]} to suppress default system messages */}
          <GhostChat
            externalMessages={chatHistory}
            initialMessages={[]}
            className="z-50"
          />
        </>
      );
    }

    // During Quest / Exploration
    return (
      <>
        <GhostOverlay {...props} />
        {/* Chat visible during quest too? Yes user asked for it */}
        {/* Pass initialMessages={[]} to suppress default system messages */}
        <GhostChat externalMessages={chatHistory} initialMessages={[]} />

        {/* Quest Indicator */}
        {phase === "quest" && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-md border border-white/20 animate-pulse pointer-events-none">
            Mission: 地図を探せ
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <GameCanvas
        renderOverlay={renderOverlay}
        isInputEnabled={isInputEnabled}
      />

      {/* Top Right Controls */}
      {/* Horizontal Layout: [Pause] [Speed] [Return] */}
      {/* Adjusted position to start further left to accommodate 3 buttons */}
      <div className="fixed top-20 right-8 z-[100] flex flex-row items-center gap-4">
        {/* Pause Button */}
        <button
          onClick={togglePause}
          className={`
                        px-5 py-4
                        rounded-full
                        shadow-lg shadow-black/50
                        border
                        flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95
                        min-w-[180px] justify-center
                        font-bold text-sm
                        ${isPaused
              ? "bg-yellow-900/90 hover:bg-yellow-800 text-yellow-100 border-yellow-600/50"
              : "bg-indigo-900/90 hover:bg-indigo-800 text-indigo-100 border-indigo-500/50"
            }
                    `}
          title="いつでも左サイドメニューから再開できます"
        >
          {isPaused ? (
            <Play size={18} className="fill-current" />
          ) : (
            <Pause size={18} className="fill-current" />
          )}
          {isPaused ? "チュートリアルを再開" : "チュートリアルを一時停止"}
        </button>

        {/* Speed Toggle */}
        <button
          onClick={toggleSpeed}
          className="
                        bg-slate-800 hover:bg-slate-700
                        text-slate-200 hover:text-white
                        px-5 py-4
                        rounded-full
                        shadow-lg shadow-black/50
                        border border-slate-600 hover:border-slate-500
                        flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95
                        min-w-[180px] justify-center
                        group
                    "
          title="テキストの表示速度を変更します"
        >
          {speed === "instant" ? (
            <Zap size={18} className="text-yellow-400" />
          ) : speed === "fast" ? (
            <FastForward size={18} className="text-blue-400" />
          ) : (
            <Timer size={18} />
          )}
          <span className="font-bold text-sm">
            文字表示速度:{" "}
            {speed === "instant"
              ? "瞬時"
              : speed === "fast"
                ? "はやい"
                : "普通"}
          </span>
        </button>

        {/* Return Button (Trial Only) */}
        {isTrial && <TrialBackButtonContent />}
      </div>

      {/* Pause Instruction Toast (Visible briefly or when hovered? For now static helper if needed) */}
      {isPaused && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 mt-16 max-w-xs bg-black/60 text-white/80 p-3 rounded-lg text-xs backdrop-blur-md border border-white/10 text-center">
          いつでも左サイドメニューの「チュートリアル」から再開できます。
        </div>
      )}
    </>
  );
};
