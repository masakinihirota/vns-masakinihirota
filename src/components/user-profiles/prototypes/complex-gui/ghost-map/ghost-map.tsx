"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Ghost,
  Crown,
  Map as MapIcon,
  ArrowRight,
  X,
  Store,
  FileText,
  Beer,
  User,
  DoorOpen,
  Info,
  Locate,
  Sparkles,
  Undo2,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  TILE_SIZE,
  MAP_WIDTH,
  MAP_HEIGHT,
  WALK_DELAY,
  RUN_DELAY,
  MAX_VISIBLE_ENTITIES,
  CHAT_RADIUS,
  INITIAL_MAP_LAYOUT,
} from "./map-constants";
import { MapTiles } from "./map-tiles";

// --- Types ---
type Position = { x: number; y: number };
type EntityType =
  | "king"
  | "item"
  | "player"
  | "market"
  | "bbs"
  | "tavern"
  | "npc"
  | "door";

interface Entity {
  id: string;
  type: EntityType;
  position: Position;
  name: string;
  interacted?: boolean;
  zoneId: string;
  avatar?: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  position: Position;
  zoneId: string;
  timestamp: number;
}

interface DialogState {
  show: boolean;
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

// Extracted Dialog Component
const DialogOverlay = ({
  dialog,
  setDialog,
}: {
  dialog: DialogState;
  setDialog: (val: DialogState | null) => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (dialog.action) dialog.action.onClick();
        else setDialog(null);
      } else if (e.key === "Escape") {
        e.preventDefault();
        if (dialog.secondaryAction) dialog.secondaryAction.onClick();
        else setDialog(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dialog, setDialog]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-8"
      onClick={() => {
        if (dialog.secondaryAction) dialog.secondaryAction.onClick();
        else setDialog(null);
      }}
    >
      <div
        className="bg-white/95 dark:bg-zinc-900/95 border-2 border-indigo-200 dark:border-indigo-500/30 p-8 rounded-[2rem] max-w-lg w-full shadow-2xl relative backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setDialog(null)}
          className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 p-4 rounded-2xl border border-yellow-200 dark:border-yellow-500/20 shadow-inner">
            <Crown size={32} className="text-yellow-600 dark:text-yellow-500" />
          </div>
          <h3 className="text-2xl font-black text-zinc-800 dark:text-white">
            {dialog.title}
          </h3>
        </div>

        <p className="text-zinc-600 dark:text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap mb-8">
          {dialog.message}
        </p>

        <div className="flex gap-4 w-full">
          {dialog.secondaryAction && (
            <button
              onClick={dialog.secondaryAction.onClick}
              className="flex-1 py-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-xl font-bold text-lg transition-transform hover:scale-[1.02]"
            >
              {dialog.secondaryAction.label}
            </button>
          )}
          {dialog.action && (
            <button
              onClick={dialog.action.onClick}
              className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] shadow-lg shadow-indigo-500/20"
            >
              <span>{dialog.action.label}</span>
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- Props ---
export interface GhostProfile {
  id: string;
  name: string;
  type: "ghost" | "avatar";
  avatarStr: string; // Emoji or specific string identifier
  position: Position;
  zoneId: string;
  color: string;
}

interface GhostMapProps {
  onBack: () => void;
  activeProfile: GhostProfile;
  onUpdateProfile: (updates: Partial<GhostProfile>) => void;
}

export const GhostMap = ({
  onBack,
  activeProfile,
  onUpdateProfile,
}: GhostMapProps) => {
  const router = useRouter();

  // Use props for player state
  const playerPosition = activeProfile.position;
  const playerZone = activeProfile.zoneId;

  const [speedMode, setSpeedMode] = useState<"walk" | "run" | "turbo">("walk");
  const [facing, setFacing] = useState<"left" | "right">("right");
  const [showLegend, setShowLegend] = useState(false);

  // Jump / Debug UI State
  const [showJumpUI, setShowJumpUI] = useState(false);
  const [jumpCoords, setJumpCoords] = useState({ x: "10", y: "10" });

  // Entities
  const [entities, setEntities] = useState<Entity[]>([
    {
      id: "king",
      type: "king",
      position: { x: 4, y: 4 },
      name: "女王",
      zoneId: "world",
    },
    {
      id: "market_npc",
      type: "market",
      position: { x: 23, y: 5 },
      name: "商人",
      zoneId: "world",
    },
    {
      id: "bbs_board",
      type: "bbs",
      position: { x: 5, y: 14 },
      name: "掲示板",
      zoneId: "world",
    },
    {
      id: "tavern_master",
      type: "tavern",
      position: { x: 23, y: 14 },
      name: "酒場のマスター",
      zoneId: "world",
    },
    {
      id: "tavern_inner_master",
      type: "npc",
      position: { x: 5, y: 5 },
      name: "バーテンダー",
      zoneId: "tavern",
    },
    {
      id: "tavern_guest_1",
      type: "npc",
      position: { x: 6, y: 6 },
      name: "酔っ払いA",
      zoneId: "tavern",
    },
    {
      id: "tavern_door",
      type: "door",
      position: { x: 5, y: 8 },
      name: "出口",
      zoneId: "tavern",
    },
    {
      id: "map_item",
      type: "item",
      position: { x: 14, y: 9 },
      name: "古びた地図",
      zoneId: "world",
    },
  ]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [targetEntityId, setTargetEntityId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [log, setLog] = useState<string>("幽霊として漂流しました。");
  const lastMoveTime = useRef<number>(0);
  const [hasMap, setHasMap] = useState<boolean>(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [camera, setCamera] = useState<Position>({ x: 0, y: 0 });

  // Swipe State
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // --- Computed: Visible Entities ---
  const visibleEntities = useMemo(() => {
    const inZone = entities.filter((e) => e.zoneId === playerZone);
    const sorted = inZone.sort((a, b) => {
      const distA =
        Math.abs(a.position.x - playerPosition.x) +
        Math.abs(a.position.y - playerPosition.y);
      const distB =
        Math.abs(b.position.x - playerPosition.x) +
        Math.abs(b.position.y - playerPosition.y);
      return distA - distB;
    });
    return sorted.slice(0, MAX_VISIBLE_ENTITIES);
  }, [entities, playerPosition, playerZone]);

  // --- Camera Logic ---
  useEffect(() => {
    if (!viewportRef.current) return;
    const viewportWidth = viewportRef.current.clientWidth;
    const viewportHeight = viewportRef.current.clientHeight;

    let targetX =
      playerPosition.x * TILE_SIZE - viewportWidth / 2 + TILE_SIZE / 2;
    let targetY =
      playerPosition.y * TILE_SIZE - viewportHeight / 2 + TILE_SIZE / 2;

    const maxScrollX = MAP_WIDTH * TILE_SIZE - viewportWidth;
    const maxScrollY = MAP_HEIGHT * TILE_SIZE - viewportHeight;

    targetX = Math.max(0, Math.min(targetX, maxScrollX));
    targetY = Math.max(0, Math.min(targetY, maxScrollY));

    setCamera({ x: targetX, y: targetY });
  }, [playerPosition, viewportRef]);

  // --- Interaction Logic (Simplified for brevity) ---
  const checkInteraction = (pos: Position, zone: string = playerZone) => {
    const entity = entities.find(
      (e) =>
        e.position.x === pos.x && e.position.y === pos.y && e.zoneId === zone
    );
    if (!entity) return;

    if (entity.type === "king") {
      setDialog({
        show: true,
        title: "始まりの国の女王",
        message:
          "おお、迷える幽霊よ。そなたはまだ「顔（プロフィール）」を持たぬようだな。\n受肉せねば、この世界で誰かと関わることはできぬぞ。",
        action: {
          label: "受肉する（プロフィール作成）",
          onClick: () => router.push("/user-profiles/new"),
        },
      });
    } else if (entity.type === "item" && !entity.interacted) {
      setLog(
        `「${entity.name}」を入手しました！\nコンパスナビゲーション機能が解放されました。`
      );
      setHasMap(true);
      setEntities((prev) =>
        prev.map((e) => (e.id === entity.id ? { ...e, interacted: true } : e))
      );
    } else if (entity.type === "tavern") {
      setDialog({
        show: true,
        title: "酒場「ルイーダ」",
        message: "中に入りますか？",
        action: {
          label: "入店する",
          onClick: () => {
            onUpdateProfile({
              zoneId: "tavern",
              position: { x: 5, y: 5 },
            });
            setDialog(null);
          },
        },
        secondaryAction: { label: "やめる", onClick: () => setDialog(null) },
      });
    } else if (entity.type === "door") {
      setDialog({
        show: true,
        title: "出口",
        message: "外に出ますか？",
        action: {
          label: "出る",
          onClick: () => {
            onUpdateProfile({
              zoneId: "world",
              position: { x: 23, y: 15 },
            });
            setDialog(null);
          },
        },
        secondaryAction: { label: "やめる", onClick: () => setDialog(null) },
      });
    } else if (entity.type === "market") {
      setDialog({
        show: true,
        title: "マーケット (閲覧モード)",
        message:
          "色とりどりのアイテムが並んでいます。\nしかし、幽霊のあなたには見ることしか出来ません、触れることも買うことも不可能です。",
        action: { label: "閉じる", onClick: () => setDialog(null) },
      });
    } else if (entity.type === "bbs") {
      setDialog({
        show: true,
        title: "冒険者ギルドの掲示板",
        message:
          "『求む、ドラゴン討伐隊！』『迷子の猫を探しています』\n幽霊のあなたには見ることしか出来ません、書き込むこと不可能です。",
        action: { label: "閉じる", onClick: () => setDialog(null) },
      });
    } else if (entity.id === "tavern_inner_master") {
      setDialog({
        show: true,
        title: "バーテンダー",
        message: "いらっしゃい。ゆっくりしていってくれ。",
        action: { label: "閉じる", onClick: () => setDialog(null) },
      });
    } else if (entity.type === "npc") {
      setDialog({
        show: true,
        title: entity.name,
        message: "（楽しそうに話している...）",
        action: { label: "閉じる", onClick: () => setDialog(null) },
      });
    }
  };

  // --- Move Helper ---
  const move = (dx: number, dy: number) => {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (newX > 0 && newX < MAP_WIDTH - 1 && newY > 0 && newY < MAP_HEIGHT - 1) {
      onUpdateProfile({ position: { x: newX, y: newY } });
      if (dx !== 0) setFacing(dx > 0 ? "right" : "left"); // Update facing
      checkInteraction({ x: newX, y: newY });
    }
  };

  // --- Swipe Handling ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const dx = touchEnd.x - touchStart.current.x;
    const dy = touchEnd.y - touchStart.current.y;

    // Threshold for swipe
    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
      if (Math.abs(dx) > Math.abs(dy)) {
        move(dx > 0 ? 1 : -1, 0);
      } else {
        move(0, dy > 0 ? 1 : -1);
      }
    }
    touchStart.current = null;
  };

  // --- Input Handling (Keyboard) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (dialog?.show) return;
      // Ignore if typing in inputs
      if (document.activeElement?.tagName === "INPUT") return;

      const now = Date.now();

      if (e.key === "1") {
        setSpeedMode("walk");
        return;
      }
      if (e.key === "2") {
        setSpeedMode("run");
        return;
      }
      if (e.key === "3") {
        setSpeedMode("turbo");
        return;
      }

      let delay = WALK_DELAY;
      if (speedMode === "run") delay = RUN_DELAY;
      if (speedMode === "turbo") delay = 50;
      if (e.shiftKey && speedMode === "walk") delay = RUN_DELAY;

      if (now - lastMoveTime.current < delay) return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
          move(0, -1);
          e.preventDefault();
          lastMoveTime.current = now;
          break;
        case "ArrowDown":
        case "s":
          move(0, 1);
          e.preventDefault();
          lastMoveTime.current = now;
          break;
        case "ArrowLeft":
        case "a":
          move(-1, 0);
          e.preventDefault();
          lastMoveTime.current = now;
          break;
        case "ArrowRight":
        case "d":
          move(1, 0);
          e.preventDefault();
          lastMoveTime.current = now;
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPosition, dialog, speedMode]);

  // --- Chat Simulation ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.1) return;
      const potentialSpeakers = visibleEntities.filter(
        (e) => e.type === "npc" || e.type === "king"
      );
      if (potentialSpeakers.length === 0) return;

      const speaker =
        potentialSpeakers[Math.floor(Math.random() * potentialSpeakers.length)];
      const phrases = [
        "今日はいい天気だ",
        "お腹すいたな...",
        "あの噂聞いた？",
        "冒険に出たい！",
        "ビールもう一杯！",
        "最近モンスター多いよね",
        "王様元気かな",
        "Zzz...",
        "やあ、調子はどう？",
      ];
      const text = phrases[Math.floor(Math.random() * phrases.length)];

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: speaker.id,
        text,
        position: speaker.position,
        zoneId: speaker.zoneId,
        timestamp: Date.now(),
      };

      setChatMessages((prev) => [...prev.slice(-4), newMessage]);
      setTimeout(() => {
        setChatMessages((prev) => prev.filter((m) => m.id !== newMessage.id));
      }, 5000);
    }, 1000);
    return () => clearInterval(interval);
  }, [visibleEntities]);

  // --- Jump Feature ---
  const handleJump = () => {
    const x = parseInt(jumpCoords.x);
    const y = parseInt(jumpCoords.y);
    if (
      !isNaN(x) &&
      !isNaN(y) &&
      x >= 0 &&
      x < MAP_WIDTH &&
      y >= 0 &&
      y < MAP_HEIGHT
    ) {
      onUpdateProfile({ position: { x, y } });
      setLog(`ワープしました: (${x}, ${y})`);
      setShowJumpUI(false);
    }
  };

  // --- Warp Feature State ---
  const [jumpSource, setJumpSource] = useState<{
    position: Position;
    zoneId: string;
  } | null>(null);

  // --- Global Warp State ---
  const [showGlobalWarp, setShowGlobalWarp] = useState(false);
  const [globalWarpStep, setGlobalWarpStep] = useState<1 | 2 | 3>(1);
  const [selectedGlobalZone, setSelectedGlobalZone] = useState<string | null>(
    null
  );
  // Custom Warp State
  const [customWarpInput, setCustomWarpInput] = useState<{
    zoneId: string;
    x: string;
    y: string;
  }>({ zoneId: "world", x: "10", y: "10" });

  // Mock Home Data (In a real app, this would come from user profile)
  const hasHome = true;
  const homeLocation = {
    id: "my_home",
    name: "マイホーム",
    zoneId: "world",
    position: { x: 20, y: 20 },
  };

  // --- Warp Logic ---
  const execWarp = (target: {
    position: Position;
    zoneId: string;
    name: string;
    id?: string;
  }) => {
    // Save current position for return
    setJumpSource({
      position: playerPosition,
      zoneId: playerZone,
    });

    // Warp
    // Warp
    onUpdateProfile({
      position: target.position,
      zoneId: target.zoneId,
    });
    setLog(`「${target.name}」へ瞬時移動しました！`);

    // Set as current target for compass only if it has an ID
    if (target.id) {
      setTargetEntityId(target.id);
    } else {
      setTargetEntityId(null);
    }

    // Force interaction check
    checkInteraction(target.position, target.zoneId);

    // Close UIs
    setShowGlobalWarp(false);
    setGlobalWarpStep(1);
    setSelectedGlobalZone(null);
  };

  const handleWarpToTarget = () => {
    if (!targetEntityId) return;
    const target = entities.find((e) => e.id === targetEntityId);
    if (!target) return;
    execWarp(target);
  };

  const handleReturnJump = () => {
    if (!jumpSource) return;

    onUpdateProfile({
      position: jumpSource.position,
      zoneId: jumpSource.zoneId,
    });
    setLog("元の場所へ戻りました。");
    setJumpSource(null);
  };

  // Zones for Global Warp
  const availableZones = Array.from(new Set(entities.map((e) => e.zoneId))).map(
    (id) => {
      // Simple name mapping
      const names: Record<string, string> = {
        world: "始まりの国 (World)",
        tavern: "酒場「ルイーダ」 (Indoor)",
      };
      return { id, name: names[id] || id };
    }
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full bg-stone-50/95 dark:bg-black/90 rounded-[3rem] border border-stone-200 dark:border-zinc-800 relative overflow-hidden p-8 font-sans transition-colors duration-300">
      {/* HUD */}
      <div className="absolute top-6 left-8 z-10 flex space-x-4">
        <button
          onClick={onBack}
          className="bg-white/80 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 px-6 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-sm backdrop-blur-md"
        >
          ← 戻る
        </button>
        <div className="bg-white/80 dark:bg-zinc-900/80 px-6 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 text-indigo-600 dark:text-indigo-400 flex items-center gap-2 shadow-sm backdrop-blur-md">
          <Ghost size={16} />
          <span className="font-bold">Ghost Mode</span>
        </div>
        {/* Global Warp Toggle */}
        <button
          onClick={() => {
            setShowGlobalWarp(true);
            setGlobalWarpStep(1);
          }}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-transform active:scale-95"
          title="Global Warp"
        >
          <Globe size={18} />
          <span className="text-sm font-bold">WARP</span>
        </button>
        {/* Legend Toggle */}
        <button
          onClick={() => setShowLegend(!showLegend)}
          className={`
                        w-10 h-10 rounded-full flex items-center justify-center border transition-all shadow-sm backdrop-blur-md
                        ${showLegend ? "bg-indigo-600 text-white border-indigo-500" : "bg-white/80 dark:bg-zinc-900/80 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"}
                    `}
        >
          <Info size={20} />
        </button>
      </div>

      {/* Global Warp Dialog */}
      <AnimatePresence>
        {showGlobalWarp && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border-2 border-indigo-100 dark:border-zinc-700 overflow-hidden flex flex-col max-h-[90%]"
            >
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="text-2xl font-black text-zinc-800 dark:text-white flex items-center gap-3">
                  <Globe className="text-indigo-500" />
                  <span>Global Warp System</span>
                </h3>
                <button
                  onClick={() => setShowGlobalWarp(false)}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X size={24} className="text-zinc-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0">
                {globalWarpStep === 1 ? (
                  /* Step 1: Select Map (Zone) */
                  <div className="space-y-6">
                    {/* Bookmarks Section */}
                    {hasHome && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                          <span className="w-full h-px bg-zinc-100 dark:bg-zinc-800" />
                          BOOKMARKS
                          <span className="w-full h-px bg-zinc-100 dark:bg-zinc-800" />
                        </h4>
                        <button
                          onClick={() => execWarp(homeLocation)}
                          className="w-full p-4 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 border-2 border-orange-200 dark:border-orange-800 hover:border-orange-400 rounded-2xl flex items-center gap-4 transition-all group"
                        >
                          <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center border-2 border-orange-100 dark:border-orange-800 text-2xl shadow-sm">
                            🏠
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-zinc-800 dark:text-orange-100 group-hover:text-orange-600 dark:group-hover:text-orange-300">
                              {homeLocation.name}
                            </div>
                            <div className="text-xs text-zinc-500">
                              Zone: {homeLocation.zoneId} (
                              {homeLocation.position.x},{" "}
                              {homeLocation.position.y})
                            </div>
                          </div>
                        </button>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-full h-px bg-zinc-100 dark:bg-zinc-800" />
                        SELECT AREA
                        <span className="w-full h-px bg-zinc-100 dark:bg-zinc-800" />
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableZones.map((zone) => (
                          <button
                            key={zone.id}
                            onClick={() => {
                              setSelectedGlobalZone(zone.id);
                              setGlobalWarpStep(2);
                            }}
                            className="p-6 bg-zinc-50 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border-2 border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl text-left transition-all group"
                          >
                            <span className="text-xl font-bold text-zinc-700 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                              {zone.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Warp Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => setGlobalWarpStep(3)}
                        className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-indigo-500 hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-center gap-2 text-sm font-bold"
                      >
                        <Locate size={16} />
                        指定座標へワープ (DEBUG/CUSTOM)
                      </button>
                    </div>
                  </div>
                ) : globalWarpStep === 2 ? (
                  /* Step 2: Select Location */
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-2">
                      <button
                        onClick={() => setGlobalWarpStep(1)}
                        className="text-sm font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors"
                      >
                        <Undo2 size={16} />
                        BACK TO MAPS
                      </button>
                      <h4 className="text-lg font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Select Destination
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {entities
                        .filter((e) => e.zoneId === selectedGlobalZone)
                        .map((entity) => (
                          <button
                            key={entity.id}
                            onClick={() => execWarp(entity)}
                            className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 border border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 rounded-xl text-left transition-all group"
                          >
                            <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-700 text-lg shadow-sm group-hover:scale-110 transition-transform">
                              {/* Simple icon mapping based on type not ideal but using emoji/name for now */}
                              {entity.type === "king" && "👑"}
                              {entity.type === "tavern" && "🍺"}
                              {entity.type === "door" && "🚪"}
                              {entity.type === "item" && "💎"}
                              {entity.type === "npc" && "👤"}
                              {entity.type === "market" && "🏪"}
                              {entity.type === "bbs" && "📋"}
                            </div>
                            <div>
                              <div className="font-bold text-zinc-800 dark:text-zinc-100">
                                {entity.name}
                              </div>
                              <div className="text-xs text-zinc-500">
                                ({entity.position.x}, {entity.position.y})
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                ) : (
                  /* Step 3: Custom Coordinates */
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                      <button
                        onClick={() => setGlobalWarpStep(1)}
                        className="text-sm font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors"
                      >
                        <Undo2 size={16} />
                        BACK TO MENU
                      </button>
                      <h4 className="text-lg font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Custom Coordinates
                      </h4>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase">
                          Zone
                        </label>
                        <select
                          value={customWarpInput.zoneId}
                          onChange={(e) =>
                            setCustomWarpInput({
                              ...customWarpInput,
                              zoneId: e.target.value,
                            })
                          }
                          className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {availableZones.map((z) => (
                            <option key={z.id} value={z.id}>
                              {z.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase">
                            X Coordinate
                          </label>
                          <input
                            type="number"
                            value={customWarpInput.x}
                            onChange={(e) =>
                              setCustomWarpInput({
                                ...customWarpInput,
                                x: e.target.value,
                              })
                            }
                            className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase">
                            Y Coordinate
                          </label>
                          <input
                            type="number"
                            value={customWarpInput.y}
                            onChange={(e) =>
                              setCustomWarpInput({
                                ...customWarpInput,
                                y: e.target.value,
                              })
                            }
                            className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          execWarp({
                            position: {
                              x: parseInt(customWarpInput.x) || 0,
                              y: parseInt(customWarpInput.y) || 0,
                            },
                            zoneId: customWarpInput.zoneId,
                            name: `Custom Point (${customWarpInput.x}, ${customWarpInput.y})`,
                          })
                        }
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      >
                        <Sparkles size={20} />
                        WARP NOW
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="absolute top-6 right-8 z-10 flex flex-col items-end gap-4 pointer-events-none">
        <div className="pointer-events-auto bg-white/90 dark:bg-zinc-950/80 text-zinc-600 dark:text-zinc-300 px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-mono shadow-lg whitespace-pre-wrap text-right backdrop-blur-md">
          {log}
        </div>

        {/* Coordinate / Jump Toggle */}
        <div className="pointer-events-auto flex items-center gap-2 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full px-3 py-1 border border-black/5 dark:border-white/10">
          <span className="text-xs font-mono text-zinc-500">
            X:{playerPosition.x}, Y:{playerPosition.y}
          </span>
          <button
            onClick={() => setShowJumpUI(!showJumpUI)}
            className="p-1 hover:bg-black/5 rounded-full"
          >
            <Locate size={14} className="text-indigo-500" />
          </button>
        </div>

        {/* Jump UI */}
        <AnimatePresence>
          {showJumpUI && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="pointer-events-auto bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 flex flex-col gap-2 w-48"
            >
              <span className="text-xs font-bold text-zinc-500">
                Coordinate Jump
              </span>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={jumpCoords.x}
                  onChange={(e) =>
                    setJumpCoords({ ...jumpCoords, x: e.target.value })
                  }
                  className="w-14 px-2 py-1 text-xs border rounded dark:bg-zinc-800 dark:border-zinc-700"
                  placeholder="X"
                />
                <input
                  type="number"
                  value={jumpCoords.y}
                  onChange={(e) =>
                    setJumpCoords({ ...jumpCoords, y: e.target.value })
                  }
                  className="w-14 px-2 py-1 text-xs border rounded dark:bg-zinc-800 dark:border-zinc-700"
                  placeholder="Y"
                />
              </div>
              <button
                onClick={handleJump}
                className="w-full bg-indigo-500 text-white text-xs py-1 rounded hover:bg-indigo-600"
              >
                JUMP
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compass */}
        {hasMap && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-auto bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-xl flex flex-col gap-3 w-64"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
                Navigation
              </span>
              {targetEntityId && (
                <button
                  onClick={() => setTargetEntityId(null)}
                  className="text-[10px] text-red-400"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex gap-3 items-center">
              <div className="relative w-16 h-16 bg-zinc-50 dark:bg-zinc-950 rounded-full border-2 border-zinc-200 dark:border-zinc-700 shadow-inner flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full border border-black/5 dark:border-white/5" />
                <div className="absolute top-1 text-[8px] text-zinc-400 dark:text-zinc-600 font-bold">
                  N
                </div>
                {targetEntityId ? (
                  <motion.div
                    className="w-full h-full flex items-center justify-center"
                    animate={{
                      rotate: (() => {
                        const target = entities.find(
                          (e) => e.id === targetEntityId
                        );
                        if (!target) return 0;
                        const dx = target.position.x - playerPosition.x;
                        const dy = target.position.y - playerPosition.y;
                        return Math.atan2(dy, dx) * (180 / Math.PI);
                      })(),
                    }}
                  >
                    <ArrowRight
                      size={24}
                      className="text-indigo-500 dark:text-indigo-400 filter drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]"
                    />
                  </motion.div>
                ) : (
                  <div className="w-2 h-2 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                )}
              </div>
              <div className="flex flex-col gap-2 w-full">
                <select
                  className="w-full bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs rounded-lg px-2 py-2 border border-zinc-200 dark:border-zinc-600"
                  value={targetEntityId || ""}
                  onChange={(e) => setTargetEntityId(e.target.value || null)}
                >
                  <option value="">目的地を選択...</option>
                  {entities
                    .filter(
                      (e) => e.type !== "player" && e.zoneId === playerZone
                    )
                    .map((entity) => (
                      <option key={entity.id} value={entity.id}>
                        {entity.name}
                      </option>
                    ))}
                </select>

                <div className="flex gap-2">
                  {/* Warp Button */}
                  {targetEntityId && (
                    <button
                      onClick={handleWarpToTarget}
                      className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-bold py-1.5 rounded-lg shadow-md flex items-center justify-center gap-1 transition-transform active:scale-95"
                    >
                      <Sparkles size={12} />
                      WARP
                    </button>
                  )}
                  {/* Return Button */}
                  {jumpSource && (
                    <button
                      onClick={handleReturnJump}
                      className="flex-1 bg-zinc-600 hover:bg-zinc-700 text-white text-[10px] font-bold py-1.5 rounded-lg shadow-md flex items-center justify-center gap-1 transition-transform active:scale-95"
                    >
                      <Undo2 size={12} />
                      RETURN
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Map Area (Viewport) */}
      <div
        ref={viewportRef}
        className="relative shadow-2xl rounded-xl border-4 border-white/50 dark:border-zinc-900 bg-[#5c8a45] dark:bg-[#0f2815] overflow-hidden w-full max-w-4xl h-[600px] flex-shrink-0 transition-colors duration-300 touch-none select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          className="absolute top-0 left-0"
          animate={{ x: -camera.x, y: -camera.y }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 25,
            mass: 0.5,
          }}
          style={{
            width: MAP_WIDTH * TILE_SIZE,
            height: MAP_HEIGHT * TILE_SIZE,
          }}
        >
          {/* Memoized Tiles */}
          <MapTiles layout={INITIAL_MAP_LAYOUT} />

          {/* Entities */}
          {visibleEntities.map(
            (entity) =>
              (!entity.interacted || entity.type !== "item") && (
                <div
                  key={entity.id}
                  className="absolute flex items-center justify-center p-1"
                  style={{
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                    left: entity.position.x * TILE_SIZE,
                    top: entity.position.y * TILE_SIZE,
                  }}
                >
                  {entity.type === "king" && (
                    <Crown
                      size={32}
                      className="text-yellow-600 dark:text-yellow-500 drop-shadow-md"
                    />
                  )}
                  {entity.type === "item" && (
                    <MapIcon
                      size={24}
                      className="text-emerald-600 dark:text-emerald-400 drop-shadow-md animate-bounce"
                    />
                  )}
                  {entity.type === "market" && (
                    <Store
                      size={28}
                      className="text-amber-100 dark:text-amber-200 drop-shadow-lg"
                    />
                  )}
                  {entity.type === "bbs" && (
                    <FileText
                      size={28}
                      className="text-slate-200 dark:text-slate-300 drop-shadow-lg"
                    />
                  )}
                  {entity.type === "tavern" && (
                    <Beer
                      size={28}
                      className="text-rose-200 dark:text-rose-300 drop-shadow-lg"
                    />
                  )}
                  {entity.type === "npc" && (
                    <User
                      size={24}
                      className="text-zinc-600 dark:text-zinc-300 drop-shadow-md"
                    />
                  )}
                  {entity.type === "door" && (
                    <DoorOpen
                      size={28}
                      className="text-zinc-600 dark:text-zinc-300"
                    />
                  )}
                </div>
              )
          )}

          {/* Chat Bubbles */}
          {chatMessages.map(
            (msg) =>
              msg.zoneId === playerZone && (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bg-white/95 text-zinc-900 text-[10px] font-bold px-3 py-2 rounded-xl border border-zinc-200 shadow-xl z-[60] whitespace-nowrap"
                  style={{
                    left: msg.position.x * TILE_SIZE + TILE_SIZE / 2,
                    top: msg.position.y * TILE_SIZE - 40,
                    transform: "translateX(-50%)",
                  }}
                >
                  {msg.text}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white/95" />
                </motion.div>
              )
          )}

          {/* Player (Ghost) */}
          <motion.div
            className="absolute flex items-center justify-center pointer-events-none z-50 text-"
            initial={false}
            animate={{
              x: playerPosition.x * TILE_SIZE,
              y: playerPosition.y * TILE_SIZE,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width: TILE_SIZE, height: TILE_SIZE }}
          >
            <div
              className={`relative flex flex-col items-center transition-transform duration-300 ${facing === "left" ? "-scale-x-100" : ""}`}
            >
              <div
                className={`absolute -top-12 px-3 py-1 bg-indigo-600/90 text-white text-[10px] font-bold rounded-full mb-1 border border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)] whitespace-nowrap z-50 ${facing === "left" ? "-scale-x-100" : ""}`}
              >
                {activeProfile.name}
              </div>
              <div className="absolute inset-0 bg-indigo-400/40 dark:bg-indigo-400/60 blur-[12px] rounded-full scale-150 animate-pulse" />

              {activeProfile.type === "ghost" ? (
                <Ghost
                  size={38}
                  className="text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] relative z-10"
                />
              ) : (
                <div
                  className="text-4xl drop-shadow-lg relative z-10"
                  style={{
                    filter: `drop-shadow(0 0 10px ${activeProfile.color})`,
                  }}
                >
                  {activeProfile.avatarStr}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_0_120px_rgba(0,0,0,0.8)] z-40 rounded-lg" />
      </div>

      {/* Controller UI */}
      <div className="mt-8 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16 w-full max-w-4xl justify-between px-4">
        {/* Legend */}
        <AnimatePresence>
          {showLegend && (
            <motion.div
              initial={{ opacity: 0, width: 0, x: -20 }}
              animate={{ opacity: 1, width: "auto", x: 0 }}
              exit={{ opacity: 0, width: 0, x: -20 }}
              className="overflow-hidden"
            >
              <div className="text-zinc-500 dark:text-zinc-500 text-sm font-medium flex flex-col gap-2 bg-stone-100/90 dark:bg-zinc-950/80 p-6 rounded-2xl border border-stone-200 dark:border-zinc-700 backdrop-blur-md w-64 whitespace-nowrap shadow-lg">
                <span className="font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-700 pb-2 mb-2">
                  施設案内
                </span>
                <span className="flex items-center gap-3">
                  <Store size={16} className="text-amber-500" />{" "}
                  <span className="text-zinc-600 dark:text-zinc-300">
                    Market
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <Beer size={16} className="text-rose-500" />{" "}
                  <span className="text-zinc-600 dark:text-zinc-300">
                    Tavern
                  </span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* D-Pad */}
        <div className="grid grid-cols-3 gap-3 p-6 bg-white/80 dark:bg-white/5 rounded-[2.5rem] border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl relative">
          <div />
          <button
            onClick={() => move(0, -1)}
            className="w-16 h-16 flex items-center justify-center bg-white dark:bg-black rounded-2xl border border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 hover:text-indigo-500 dark:hover:text-indigo-400 shadow-md active:scale-95 transition-all"
          >
            <span className="text-2xl font-black">↑</span>
          </button>
          <div />
          <button
            onClick={() => move(-1, 0)}
            className="w-16 h-16 flex items-center justify-center bg-white dark:bg-black rounded-2xl border border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 hover:text-indigo-500 dark:hover:text-indigo-400 shadow-md active:scale-95 transition-all"
          >
            <span className="text-2xl font-black">←</span>
          </button>
          <button
            onClick={() => move(0, 1)}
            className="w-16 h-16 flex items-center justify-center bg-white dark:bg-black rounded-2xl border border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 hover:text-indigo-500 dark:hover:text-indigo-400 shadow-md active:scale-95 transition-all"
          >
            <span className="text-2xl font-black">↓</span>
          </button>
          <button
            onClick={() => move(1, 0)}
            className="w-16 h-16 flex items-center justify-center bg-white dark:bg-black rounded-2xl border border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 hover:text-indigo-500 dark:hover:text-indigo-400 shadow-md active:scale-95 transition-all"
          >
            <span className="text-2xl font-black">→</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {dialog && <DialogOverlay dialog={dialog} setDialog={setDialog} />}
      </AnimatePresence>
    </div>
  );
};
