"use client";

import { GhostChat, Message } from "@/components/ghost/ghost-chat";
import {
  GhostOverlay,
  GhostOverlayProps,
} from "@/components/ghost/ghost-overlay";
import { TrialStorage } from "@/lib/trial-storage";
import { BookOpen, FastForward, Pause, Play, Timer, Zap } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { TrialBackButtonContent } from "../layout/trial-onboarding-back-button/TrialOnboardingBackButton";
import { KeywordModal } from "./keyword-modal";
import { QueenDialogue } from "./queen-dialogue";
import { TUTORIAL_KEYWORDS } from "./tutorial-keywords.data";
import { TutorialErrorBoundary } from "./error-boundary";
import {
  getGameStateManager,
  useTutorialState,
  useTutorialPhase,
  useGameControl,
  useDialogControl,
  useKeywordManagement,
} from "./state";
import { EventSystem } from "./events/event-system";
import { LEVEL01_EVENTS } from "./events/level01-events";
import { KeywordSystem } from "./keywords/keyword-system";

const GameCanvas = dynamic(
  () => import("@/components/ghost/game-canvas").then((mod) => mod.GameCanvas),
  { ssr: false }
);

// シナリオデータは scenarios/ から読み込み
import {
  SCENE_1_LINES,
  SCENE_2_LINES,
  SCENE_GUIDE_INTRO_LINES,
  SCENE_MAP_FOUND_LINES,
  SCENE_RETURN_TO_QUEEN_LINES,
} from "./scenarios/level01";
import { SCENE_MASK_INTRO_LINES } from "./scenarios/level02";

export const TutorialStory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<
    | "scene1"
    | "scene2"
    | "quest"
    | "map_found"
    | "explore"
    | "return_to_queen"
    | "guide_intro"
    | "account_creation"
    | "mask_intro"
    | "end"
  >("scene1");
  const [lineIndex, setLineIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<"instant" | "fast" | "normal">("normal");
  const [isTrial, setIsTrial] = useState(false);
  const hasWarpedRef = useRef(false);

  // Keyword State
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);
  const [unlockedKeywordIds, setUnlockedKeywordIds] = useState<string[]>([]);
  const [learnedKeywordIds, setLearnedKeywordIds] = useState<string[]>([]);

  // GameStateManager への参照を取得
  const gameStateManager = useMemo(() => getGameStateManager(), []);

  // Unlock Check Effect
  useEffect(() => {
    TUTORIAL_KEYWORDS.forEach((keyword) => {
      // Check if current phase/line matches trigger
      if (
        phase === keyword.trigger.phase &&
        lineIndex >= keyword.trigger.lineIndex &&
        !unlockedKeywordIds.includes(keyword.id)
      ) {
        setUnlockedKeywordIds((prev) => [...prev, keyword.id]);
        // GameStateManager にも登録
        gameStateManager.unlockKeyword(keyword.id);
        // Optional: Toast notification that new keyword unlocked?
      }
    });
  }, [phase, lineIndex, unlockedKeywordIds, gameStateManager]);

  // Handle Learn
  const handleLearnKeyword = (id: string) => {
    if (!learnedKeywordIds.includes(id)) {
      setLearnedKeywordIds((prev) => [...prev, id]);
      // GameStateManager にも登録
      gameStateManager.learnKeyword(id);
    }
  };

  // Persistence Effect
  useEffect(() => {
    // Check Trial status
    const checkTrial = () => {
      const data = TrialStorage.load();
      setIsTrial(!!data?.rootAccount);
      return !!data?.rootAccount;
    };
    const hasAccount = checkTrial();

    const savedProgress = localStorage.getItem("vns_tutorial_progress");
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        // If saved phase is valid, use it. If it was "intro", keep it.
        // Also check if we should be in mask_intro if returning from account creation
        if (parsed.phase && parsed.phase !== "intro") {
          // Special handling for return from account creation
          if (parsed.phase === "account_creation" && hasAccount) {
            setPhase("mask_intro");
            setLineIndex(0);
          } else {
            setPhase(parsed.phase);
            setLineIndex(parsed.lineIndex);
          }
        }
        // Load Keywords
        if (parsed.unlockedByIds) setUnlockedKeywordIds(parsed.unlockedByIds);
        if (parsed.learnedByIds) setLearnedKeywordIds(parsed.learnedByIds);
      } catch (e) {
        console.error("Failed to parse tutorial progress", e);
      }
    } else {
      // No saved progress, but double check if we just came back from account creation manually
      if (hasAccount) {
        // If we have an account but no progress, maybe start from mask intro?
        // Or better, strict flow: scene1.
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
      JSON.stringify({
        phase,
        lineIndex,
        unlockedByIds: unlockedKeywordIds,
        learnedByIds: learnedKeywordIds,
      })
    );
  }, [phase, lineIndex, unlockedKeywordIds, learnedKeywordIds]);

  // Manage dialogue progression
  const currentLines = useMemo(() => {
    switch (phase) {
      case "scene1":
        return SCENE_1_LINES;
      case "scene2":
        return SCENE_2_LINES;
      case "map_found":
        return SCENE_MAP_FOUND_LINES;
      case "return_to_queen":
        return SCENE_RETURN_TO_QUEEN_LINES;
      case "guide_intro":
        return SCENE_GUIDE_INTRO_LINES;
      case "mask_intro":
        return SCENE_MASK_INTRO_LINES;
      default:
        return [];
    }
  }, [phase]);

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
      } else if (phase === "map_found") {
        setPhase("explore"); // 自由探索へ
        setLineIndex(0);
      } else if (phase === "return_to_queen") {
        setPhase("guide_intro");
        setLineIndex(0);
      } else if (phase === "guide_intro") {
        // Wait for user choice (Done in renderOverlay)
        // Do nothing here if it's the last line, or just advance if not.
        // But renderOverlay handles the choice which triggers transition.
        // So we just need to ensure we don't auto-advance or push router here if it's the last line?
        // Actually, handleNext won't be called if choice is displayed because we block it in QueenDialogue.
        // But if we are NOT at the last line, we still want to advance index.
        setPhase("account_creation");
        // Note: router.push is now in the Choice callback
      } else if (phase === "mask_intro") {
        setPhase("end");
        // End of current tutorial flow
        router.push("/onboarding-trial"); // or wherever next
      }
    }
  };

  // Calculate Chat History
  const chatHistory = useMemo(() => {
    const history: Message[] = [];
    let idCounter = 1;

    const addLines = (lines: readonly string[], untilIndex: number, speaker: string = "Queen") => {
      lines.slice(0, untilIndex + 1).forEach((text, i) => {
        history.push({
          id: `story-${idCounter++}`,
          user: speaker,
          text: text,
          timestamp: idCounter, // consistent ordering
        });
      });
    };

    if (phase === "scene1") {
      addLines(SCENE_1_LINES, lineIndex);
    } else if (phase === "scene2") {
      addLines(SCENE_1_LINES, SCENE_1_LINES.length - 1);
      addLines(SCENE_2_LINES, lineIndex);
    } else if (phase === "quest") {
      addLines(SCENE_1_LINES, SCENE_1_LINES.length - 1);
      addLines(SCENE_2_LINES, SCENE_2_LINES.length - 1);
      history.push({
        id: `quest-start`,
        user: "System",
        text: "クエスト開始: 地図を探してください",
        timestamp: idCounter++,
      });
    } else if (phase === "explore") {
      addLines(SCENE_1_LINES, SCENE_1_LINES.length - 1);
      addLines(SCENE_2_LINES, SCENE_2_LINES.length - 1);
      history.push({
        id: `quest-complete`,
        user: "System",
        text: "クエスト完了: 地図を獲得しました",
        timestamp: idCounter++,
      });
      addLines(SCENE_MAP_FOUND_LINES, SCENE_MAP_FOUND_LINES.length - 1, "Queen");
      history.push({
        id: `explore-start`,
        user: "System",
        text: "自由探索: 世界を見て回り、女王に報告しよう",
        timestamp: idCounter++,
      });
    } else if (
      phase === "map_found" ||
      phase === "return_to_queen" ||
      phase === "guide_intro" ||
      phase === "account_creation" ||
      phase === "mask_intro" ||
      phase === "end"
    ) {
      addLines(SCENE_1_LINES, SCENE_1_LINES.length - 1);
      addLines(SCENE_2_LINES, SCENE_2_LINES.length - 1);
      history.push({
        id: `quest-complete`,
        user: "System",
        text: "クエスト完了: 地図を獲得しました",
        timestamp: idCounter++,
      });

      // Map Found (Queen)
      const mapFoundIndex = phase === "map_found" ? lineIndex : SCENE_MAP_FOUND_LINES.length - 1;
      addLines(SCENE_MAP_FOUND_LINES, mapFoundIndex, "Queen");

      // Return to Queen (after explore)
      if (phase === "return_to_queen" || phase === "guide_intro" || phase === "account_creation" || phase === "mask_intro" || phase === "end") {
        history.push({
          id: `explore-complete`,
          user: "System",
          text: "探索完了: 女王に報告",
          timestamp: idCounter++,
        });
        const returnToQueenIndex = phase === "return_to_queen" ? lineIndex : SCENE_RETURN_TO_QUEEN_LINES.length - 1;
        addLines(SCENE_RETURN_TO_QUEEN_LINES, returnToQueenIndex, "Queen");
      }

      if (phase === "guide_intro" || phase === "account_creation" || phase === "mask_intro" || phase === "end") {
        const guideIntroIndex = phase === "guide_intro" ? lineIndex : SCENE_GUIDE_INTRO_LINES.length - 1;
        addLines(SCENE_GUIDE_INTRO_LINES, guideIntroIndex, "Guide");
      }

      if (phase === "mask_intro" || phase === "end") {
        // System message for account creation done?
        history.push({
          id: `account-created`,
          user: "System",
          text: "ルートアカウント作成完了",
          timestamp: idCounter++,
        });
        const maskIntroIndex = phase === "mask_intro" ? lineIndex : SCENE_MASK_INTRO_LINES.length - 1;
        addLines(SCENE_MASK_INTRO_LINES, maskIntroIndex, "Guide");
      }
    }

    return history;
  }, [phase, lineIndex]);

  // Input Locking: Only enabled if NOT paused AND in QUEST/EXPLORE phase
  // "Talking phases" = scene1, scene2, map_found, return_to_queen, guide_intro, mask_intro
  const isInputEnabled = isPaused || phase === "quest" || phase === "explore";

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
    if (!hasWarpedRef.current && props.onWarp && props.playerPosition) {
      // Queen is at { x: 7, y: 3.5 } (Tiles)
      // Let's put player at 7, 5 (1.5 tiles below) facing her.
      const TARGET_X = 7 * 32;
      const TARGET_Y = 5 * 32;
      props.onWarp(TARGET_X, TARGET_Y);
      hasWarpedRef.current = true;
    }

    // Map found trigger
    if (phase === "quest" && props.hasMap) {
      // Use setTimeout to avoid render loop warning
      setTimeout(() => {
        setPhase("map_found");
        setLineIndex(0);
      }, 0);
      return null;
    }

    // Explore -> Return to Queen trigger
    // 女王の位置 { x: 7, y: 3.5 } (Tiles)
    // タイルサイズ = 32px
    if (phase === "explore" && props.playerPosition) {
      const QUEEN_X = 7 * 32;  // 224
      const QUEEN_Y = 3.5 * 32; // 112
      const TRIGGER_DISTANCE = 64; // 2タイル分の距離
      const dx = props.playerPosition.x - QUEEN_X;
      const dy = props.playerPosition.y - QUEEN_Y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < TRIGGER_DISTANCE) {
        setTimeout(() => {
          setPhase("return_to_queen");
          setLineIndex(0);
        }, 0);
        return null;
      }
    }

    // map_found 以降のフェーズではコンパスUIを確実に表示するため hasMap=true を強制
    // quest フェーズでは props.hasMap をそのまま使用（変化検知でモーダル表示を確保）
    const isMapAcquiredPhase = phase === "map_found" || phase === "explore" ||
      phase === "return_to_queen" || phase === "guide_intro" || phase === "mask_intro" || phase === "end";

    const effectiveProps: GhostOverlayProps = {
      ...props,
      hasMap: isMapAcquiredPhase ? true : (props.hasMap ?? false),
      topRightOffsetClassName: "top-48",
    };

    // If paused, just show GhostOverlay (free roam)
    if (isPaused) {
      return (
        <>
          <GhostOverlay {...effectiveProps} />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-yellow-500/20 text-yellow-200 px-4 py-2 rounded-full backdrop-blur-md border border-yellow-500/30 font-medium">
            一時停止中 (自由行動モード)
          </div>
        </>
      );
    }

    // Determine dialogue props based on phase
    let dialogueProps: {
      speaker: "The Queen" | "Guide";
      text: string;
      choices?: { label: string; onClick: () => void }[];
    } | null = null;

    if (phase === "scene1" || phase === "scene2" || phase === "map_found" || phase === "return_to_queen") {
      dialogueProps = {
        speaker: "The Queen" as const,
        text: currentLines[lineIndex] || "",
      };
    } else if (phase === "guide_intro" || phase === "mask_intro") {
      const isGuideIntroEnd = phase === "guide_intro" && lineIndex === currentLines.length - 1;

      dialogueProps = {
        speaker: "Guide" as const,
        text: currentLines[lineIndex] || "",
        choices: isGuideIntroEnd ? [
          {
            label: "はい",
            onClick: () => {
              setPhase("account_creation");
              router.push("/onboarding-trial");
            }
          }
        ] : undefined
      };
    }

    if (dialogueProps) {
      return (
        <>
          {/* GhostOverlay を表示（コンパス等） */}
          <GhostOverlay {...effectiveProps} />
          <QueenDialogue
            {...effectiveProps}
            onNext={handleNext}
            speed={speed}
            speaker={dialogueProps.speaker}
            dialogue={{
              text: dialogueProps.text,
              emotion: "neutral",
            }}
            choices={dialogueProps.choices}
            highlightKeywords={TUTORIAL_KEYWORDS.map(k => ({
              label: k.label,
              color: "text-indigo-400"
            }))}
          />
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
        <GhostOverlay {...effectiveProps} />
        {/* Chat visible during quest too? Yes user asked for it */}
        {/* Pass initialMessages={[]} to suppress default system messages */}
        <GhostChat externalMessages={chatHistory} initialMessages={[]} />

        {/* Quest Indicator */}
        {phase === "quest" && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-md border border-white/20 animate-pulse pointer-events-none">
            Mission: 地図を探せ
          </div>
        )}
        {/* Explore Indicator */}
        {phase === "explore" && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-emerald-500/20 text-emerald-200 px-4 py-2 rounded-full backdrop-blur-md border border-emerald-500/30 font-medium pointer-events-none">
            🌍 自由探索中 — 女王に戻って報告しよう
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
      <div className="fixed top-20 right-8 z-100 flex flex-row items-center gap-4">
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

      <KeywordModal
        isOpen={isKeywordModalOpen}
        onClose={() => setIsKeywordModalOpen(false)}
        unlockedIds={unlockedKeywordIds}
        learnedIds={learnedKeywordIds}
        onLearn={handleLearnKeyword}
      />

      {/* Pause Instruction Toast */}
      {isPaused && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 mt-16 max-w-xs bg-black/60 text-white/80 p-3 rounded-lg text-xs backdrop-blur-md border border-white/10 text-center">
          いつでも左サイドメニューの「チュートリアル」から再開できます。
        </div>
      )}
    </>
  );
};
