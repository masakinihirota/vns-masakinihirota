"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GhostOverlay } from "./ghost-overlay";

interface DialogState {
  show: boolean;
  title: string;
  message: string;
}

interface GameState {
  x: number;
  y: number;
  hasMap?: boolean;
  dialog?: DialogState;
}

export const GameCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);
  const initializingRef = useRef(false);

  const [playerPosition, setPlayerPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [hasMap, setHasMap] = useState(false);
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const dialogShownRef = useRef<string | null>(null);

  const handleCloseDialog = useCallback(() => {
    setDialog(null);
    dialogShownRef.current = null;
  }, []);

  // キーボードイベント（Enter/Spaceでダイアログを閉じる）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (dialog?.show) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCloseDialog();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dialog, handleCloseDialog]);

  useEffect(() => {
    const initGame = async () => {
      // 初期化中または初期化済みの場合はスキップ
      if (initializingRef.current || gameRef.current) {
        return;
      }

      if (typeof window === "undefined" || !containerRef.current) {
        return;
      }

      initializingRef.current = true;

      try {
        const Phaser = (await import("phaser")).default;
        const { createMainSceneClass } = await import("./scenes/MainScene");
        const MainScene = await createMainSceneClass();

        // 再度チェック（非同期処理中に状態が変わった場合）
        if (gameRef.current) {
          initializingRef.current = false;
          return;
        }

        const config: Phaser.Types.Core.GameConfig = {
          type: Phaser.AUTO,
          parent: containerRef.current,
          scale: {
            mode: Phaser.Scale.RESIZE,
            width: "100%",
            height: "100%",
          },
          physics: {
            default: "arcade",
            arcade: {
              gravity: { y: 0, x: 0 },
              debug: false,
            },
          },
          scene: [MainScene],
          backgroundColor: "#1a1a1a",
        };

        const game = new Phaser.Game(config);
        gameRef.current = game;

        game.events.once("ready", () => {
          const scene = game.scene.getScene("MainScene") as any;
          if (scene && scene.setUpdateCallback) {
            scene.setUpdateCallback((state: GameState) => {
              setPlayerPosition({ x: state.x, y: state.y });

              if (state.hasMap) {
                setHasMap(true);
              }

              if (state.dialog?.show) {
                const dialogKey = state.dialog.title + state.dialog.message;
                if (dialogShownRef.current !== dialogKey) {
                  dialogShownRef.current = dialogKey;
                  setDialog(state.dialog);
                }
              }
            });
          }
        });
      } catch (error) {
        console.error("Failed to initialize Phaser game:", error);
      } finally {
        initializingRef.current = false;
      }
    };

    void initGame();

    return () => {
      if (gameRef.current) {
        // Save Position on Unmount
        const scene = gameRef.current.scene.getScene("MainScene") as any;
        if (scene && scene.myPlayer) {
          try {
            localStorage.setItem(
              "ghost_map_position",
              JSON.stringify({
                x: scene.myPlayer.x,
                y: scene.myPlayer.y,
                hasMap: scene.hasMap,
              })
            );
          } catch (e) {
            console.error("Failed to save position", e);
          }
        }

        gameRef.current.destroy(true);
        gameRef.current = null;
      }
      initializingRef.current = false;
    };
  }, []);

  // Warp Handler
  const handleWarp = useCallback((x: number, y: number) => {
    if (gameRef.current) {
      const scene = gameRef.current.scene.getScene("MainScene") as any;
      if (scene && scene.teleport) {
        scene.teleport(x, y);
      }
    }
  }, []);

  return (
    <div className="relative rounded-lg overflow-hidden shadow-2xl border border-white/10 group w-full h-[calc(100vh-64px)]">
      <div ref={containerRef} className="h-full w-full" />
      <GhostOverlay
        playerPosition={playerPosition}
        hasMap={hasMap}
        dialog={dialog}
        onCloseDialog={handleCloseDialog}
        onWarp={handleWarp}
      />
    </div>
  );
};
