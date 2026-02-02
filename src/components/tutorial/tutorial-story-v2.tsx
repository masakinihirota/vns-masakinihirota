"use client";

import { FastForward, Pause, Play, Timer, Zap } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
// GhostChat removed
import {
  GhostOverlay,
  GhostOverlayProps,
} from "@/components/ghost/ghost-overlay";
import { TrialStorage } from "@/lib/trial-storage";
import { TrialBackButtonContent } from "../layout/trial-onboarding-back-button/TrialOnboardingBackButton";
import { TutorialErrorBoundary } from "./error-boundary";
import { EventSystem } from "./events/event-system";
import { KeywordModal } from "./keyword-modal";
import { KeywordSystem } from "./keywords/keyword-system";
import { MapChatContainer } from "./map-chat/map-chat.container";
import { QueenDialogue } from "./queen-dialogue";
import {
  useDialogControl,
  useKeywordManagement,
  usePhaseTransition,
  useTutorialPhase,
  useTutorialState,
} from "./state";
import { TUTORIAL_KEYWORDS } from "./tutorial-keywords.data";

const GameCanvas = dynamic(
  () => import("@/components/ghost/game-canvas").then((mod) => mod.GameCanvas),
  { ssr: false }
);

import {
  SCENE_1_LINES,
  SCENE_2_LINES,
  SCENE_GUIDE_INTRO_LINES,
  SCENE_MAP_FOUND_LINES,
  SCENE_RETURN_TO_QUEEN_LINES,
} from "./scenarios/level01";
import { SCENE_MASK_INTRO_LINES } from "./scenarios/level02";

type Phase =
  | "scene1"
  | "scene2"
  | "quest"
  | "map_found"
  | "explore"
  | "return_to_queen"
  | "guide_intro"
  | "account_creation"
  | "mask_intro"
  | "end";

/**
 * メインのチュートリアルストーリーコンポーネント
 * 新しい統合状態管理とイベントシステムを使用
 */
const TutorialStoryInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 新しいシステムから状態を取得
  const _gameState = useTutorialState();
  const { phase, lineIndex } = useTutorialPhase();
  const {
    goToPhase: stateGoToPhase,
    advanceLine: stateAdvanceLine,
    regressLine: _regressLine,
  } = usePhaseTransition();
  const { showDialog: _showDialog, closeDialog: _closeDialog } =
    useDialogControl();
  const {
    unlockedKeywordIds: unlockedFromState,
    learnedKeywordIds: learnedFromState,
    unlockKeyword,
    learnKeyword,
  } = useKeywordManagement();

  // ローカル状態（一部の互換性のため）
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setLocalSpeed] = useState<"instant" | "fast" | "normal">(
    "normal"
  );
  const [isTrial, setIsTrial] = useState(false);
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);
  const hasWarpedRef = useRef(false);
  const eventSystemRef = useRef<EventSystem | null>(null);
  const keywordSystemRef = useRef<KeywordSystem | null>(null);

  // イベントシステムを初期化
  useEffect(() => {
    if (!eventSystemRef.current) {
      eventSystemRef.current = new EventSystem();
      eventSystemRef.current.onAction("give-item", (_action) => {
        // アイテム取得処理（現在は未使用）
      });
    }

    if (!keywordSystemRef.current) {
      keywordSystemRef.current = new KeywordSystem();
    }
  }, []);

  // キーワード自動アンロック: フェーズ変更時に確認
  useEffect(() => {
    if (!keywordSystemRef.current) return;

    keywordSystemRef.current.checkAndUnlock(phase, lineIndex);

    const newUnlockedIds = keywordSystemRef.current.getNewUnlockedKeywords();
    newUnlockedIds.forEach((id) => {
      unlockKeyword(id);
    });
  }, [phase, lineIndex, unlockKeyword]);

  // Trial status チェック
  useEffect(() => {
    const data = TrialStorage.load();
    setIsTrial(!!data?.rootAccount);
  }, []);

  // 一時停止状態を同期
  useEffect(() => {
    const pausedParam = searchParams.get("paused");
    const isPausedFromUrl = pausedParam === "true";
    setIsPaused(isPausedFromUrl);
  }, [searchParams]);

  // Handle phase progression
  const handleNext = () => {
    if (lineIndex < getPhaseLines(phase as Phase).length - 1) {
      stateAdvanceLine();
    } else {
      // フェーズ遷移
      const nextPhase = getNextPhase(phase as Phase);
      if (nextPhase) {
        stateGoToPhase(nextPhase, 0);
      } else if (phase === "mask_intro") {
        stateGoToPhase("end", 0);
        router.push("/onboarding-trial");
      }
    }
  };

  // Input Locking
  const isInputEnabled = isPaused || phase === "quest" || phase === "explore";

  const togglePause = () => {
    const nextState = !isPaused;
    const params = new URLSearchParams(searchParams.toString());
    if (nextState) {
      params.set("paused", "true");
    } else {
      params.delete("paused");
    }
    router.push(`/tutorial/story?${params.toString()}`);
  };

  const toggleSpeed = () => {
    setLocalSpeed((prev) =>
      prev === "normal" ? "fast" : prev === "fast" ? "instant" : "normal"
    );
  };

  const renderOverlay = (props: GhostOverlayProps) => {
    // 初期ワープ
    if (!hasWarpedRef.current && props.onWarp && props.playerPosition) {
      const TARGET_X = 7 * 32;
      const TARGET_Y = 5 * 32;
      props.onWarp(TARGET_X, TARGET_Y);
      hasWarpedRef.current = true;
    }

    // マップ獲得トリガー
    if (phase === "quest" && props.hasMap) {
      setTimeout(() => {
        stateGoToPhase("map_found", 0);
      }, 0);
      return null;
    }

    // 探索 → 女王に戻る トリガー
    if (phase === "explore" && props.playerPosition) {
      const QUEEN_X = 7 * 32;
      const QUEEN_Y = 3.5 * 32;
      const TRIGGER_DISTANCE = 64;
      const dx = props.playerPosition.x - QUEEN_X;
      const dy = props.playerPosition.y - QUEEN_Y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < TRIGGER_DISTANCE) {
        setTimeout(() => {
          stateGoToPhase("return_to_queen", 0);
        }, 0);
        return null;
      }
    }

    // マップ表示の強制
    const isMapAcquiredPhase =
      phase === "map_found" ||
      phase === "explore" ||
      phase === "return_to_queen" ||
      phase === "guide_intro" ||
      phase === "mask_intro" ||
      phase === "end";

    const effectiveProps: GhostOverlayProps = {
      ...props,
      hasMap: isMapAcquiredPhase ? true : (props.hasMap ?? false),
      topRightOffsetClassName: "top-48",
    };

    // 一時停止中
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

    // ダイアログを確認
    let dialogueProps: {
      speaker: "The Queen" | "Guide";
      text: string;
      choices?: { label: string; onClick: () => void }[];
    } | null = null;

    const currentPhase = phase as Phase;
    const phaseLines = getPhaseLines(currentPhase);

    if (
      currentPhase === "scene1" ||
      currentPhase === "scene2" ||
      currentPhase === "map_found" ||
      currentPhase === "return_to_queen"
    ) {
      dialogueProps = {
        speaker: "The Queen" as const,
        text: phaseLines[lineIndex] || "",
      };
    } else if (
      currentPhase === "guide_intro" ||
      currentPhase === "mask_intro"
    ) {
      const isGuideIntroEnd =
        currentPhase === "guide_intro" && lineIndex === phaseLines.length - 1;

      dialogueProps = {
        speaker: "Guide" as const,
        text: phaseLines[lineIndex] || "",
        choices: isGuideIntroEnd
          ? [
              {
                label: "はい",
                onClick: () => {
                  stateGoToPhase("account_creation", 0);
                  router.push("/onboarding-trial");
                },
              },
            ]
          : undefined,
      };
    }

    if (dialogueProps) {
      return (
        <>
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
            highlightKeywords={TUTORIAL_KEYWORDS.map((k) => ({
              label: k.label,
              color: "text-indigo-400",
            }))}
          />
          <MapChatContainer />
        </>
      );
    }

    // 探索フェーズ
    return (
      <>
        <GhostOverlay {...effectiveProps} />
        <MapChatContainer />

        {currentPhase === "quest" && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-md border border-white/20 animate-pulse pointer-events-none">
            Mission: 地図を探せ
          </div>
        )}
        {currentPhase === "explore" && (
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

      {/* 操作ボタン */}
      <div className="fixed top-20 right-8 z-[100] flex flex-row items-center gap-4">
        {/* 一時停止ボタン */}
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
            ${
              isPaused
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

        {/* 速度トグル */}
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

        {/* トライアル返却ボタン */}
        {isTrial && <TrialBackButtonContent />}
      </div>

      {/* キーワードモーダル */}
      <KeywordModal
        isOpen={isKeywordModalOpen}
        onClose={() => setIsKeywordModalOpen(false)}
        unlockedIds={unlockedFromState}
        learnedIds={learnedFromState}
        onLearn={learnKeyword}
      />

      {/* 一時停止トースト */}
      {isPaused && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 mt-16 max-w-xs bg-black/60 text-white/80 p-3 rounded-lg text-xs backdrop-blur-md border border-white/10 text-center">
          いつでも左サイドメニューの「チュートリアル」から再開できます。
        </div>
      )}
    </>
  );
};

/**
 * ヘルパー関数: フェーズに対応する台詞を取得
 */
function getPhaseLines(phase: Phase): readonly string[] {
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
}

/**
 * ヘルパー関数: 次のフェーズを取得
 */
function getNextPhase(phase: Phase): Phase | null {
  switch (phase) {
    case "scene1":
      return "scene2";
    case "scene2":
      return "quest";
    case "map_found":
      return "explore";
    case "return_to_queen":
      return "guide_intro";
    case "guide_intro":
      return "account_creation";
    default:
      return null;
  }
}

/**
 * エラーバウンダリーでラップされたコンポーネント
 */
export const TutorialStory = () => {
  return (
    <TutorialErrorBoundary>
      <TutorialStoryInner />
    </TutorialErrorBoundary>
  );
};
