"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GhostOverlay, type GhostOverlayProps } from "./ghost-overlay";
import type { GhostMainScene } from "./scenes/MainScene";

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

interface GameCanvasProps {
  renderOverlay?: (props: GhostOverlayProps) => React.ReactNode;
  isInputEnabled?: boolean;
}

export const GameCanvas = ({
  renderOverlay,
  isInputEnabled = true,
}: GameCanvasProps = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gameRef = useRef<any>(null);
  const initializingRef = useRef(false);

  const [playerPosition, setPlayerPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [hasMap, setHasMap] = useState(false);
  const [dialog, setDialog] = useState<DialogState | null>(null);

  // Ref to track latest input state for async init
  const isInputEnabledRef = useRef(isInputEnabled);
  useEffect(() => {
    isInputEnabledRef.current = isInputEnabled;
    // Also update immediately if game is ready (handled by separate effect below, but keeping sync)
  }, [isInputEnabled]);

  const dialogShownRef = useRef<string | null>(null);

  const handleCloseDialog = useCallback(() => {
    setDialog(null);
    dialogShownRef.current = null;
  }, []);

  // キーボードイベント（Enter/Spaceでダイアログを閉じる、矢印キーのスクロール防止）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ダイアログ表示中のEnter/Space
      if (dialog?.show) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCloseDialog();
          return;
        }
      }

      // 矢印キーでのデフォルトスクロール防止
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
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

      // eslint-disable-next-line no-restricted-syntax
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
          const scene = game.scene.getScene(
            "MainScene"
          ) as unknown as GhostMainScene;

          // Initialize Input State immediately
          if (scene && scene.setInputEnabled) {
            scene.setInputEnabled(isInputEnabledRef.current);
          }

          if (scene && scene.setUpdateCallback) {
            // スロットリング用の変数
            let lastUpdateTime = 0;
            let lastX = -999;
            let lastY = -999;

            scene.setUpdateCallback((state: GameState) => {
              const now = Date.now();
              // 50ms未満の更新はスキップ (最大20fps)、ただし距離が大きく動いた場合は即反映しても良いが、これでも十分
              // 座標の変化が小さい場合もスキップ (0.1未満)
              if (
                now - lastUpdateTime > 50 &&
                (Math.abs(state.x - lastX) > 0.1 ||
                  Math.abs(state.y - lastY) > 0.1)
              ) {
                setPlayerPosition({ x: state.x, y: state.y });
                lastUpdateTime = now;
                lastX = state.x;
                lastY = state.y;
              }

              if (state.hasMap) {
                setHasMap((prev) => (prev ? prev : true));
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
        const scene = gameRef.current.scene.getScene(
          "MainScene"
        ) as unknown as GhostMainScene;
        if (scene && scene.myPlayer) {
          // eslint-disable-next-line no-restricted-syntax
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

  // Update input enabled state
  useEffect(() => {
    if (gameRef.current) {
      const scene = gameRef.current.scene.getScene(
        "MainScene"
      ) as unknown as GhostMainScene;
      if (scene && scene.setInputEnabled) {
        scene.setInputEnabled(isInputEnabled);
      }
    }
  }, [isInputEnabled]);

  // Warp Handler - ピクセル座標を受け取る
  const handleWarp = useCallback((pixelX: number, pixelY: number) => {
    if (gameRef.current) {
      const scene = gameRef.current.scene.getScene(
        "MainScene"
      ) as unknown as GhostMainScene;
      if (scene && scene.teleportToPixel) {
        // 入力を無効化してからテレポート（移動コマンドのキューイングを防ぐ）
        if (scene.setInputEnabled) {
          scene.setInputEnabled(false);
        }
        scene.teleportToPixel(pixelX, pixelY);
        // テレポート後に入力状態を復元（React側のisInputEnabledに従う）
        if (scene.setInputEnabled) {
          scene.setInputEnabled(isInputEnabledRef.current);
        }
      }
    }
  }, []);

  return (
    <div className="relative rounded-lg overflow-hidden shadow-2xl border border-white/10 group w-full h-full">
      <div ref={containerRef} className="h-full w-full" />
      {renderOverlay ? (
        renderOverlay({
          playerPosition,
          hasMap,
          dialog,
          onCloseDialog: handleCloseDialog,
          onWarp: handleWarp,
        })
      ) : (
        <GhostOverlay
          playerPosition={playerPosition}
          hasMap={hasMap}
          dialog={dialog}
          onCloseDialog={handleCloseDialog}
          onWarp={handleWarp}
        />
      )}
    </div>
  );
};
