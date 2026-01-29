"use client";

import { useEffect, useRef } from "react";

export const GameCanvas = () => {
  const gameRef = useRef<any>(null);

  useEffect(() => {
    const initGame = async () => {
      if (typeof window !== "undefined" && !gameRef.current) {
        const Phaser = (await import("phaser")).default;
        const { createMainSceneClass } = await import("./scenes/MainScene");
        const MainScene = await createMainSceneClass();
        const config: any = {
          type: Phaser.AUTO,
          parent: "phaser-game",
          width: 800,
          height: 600,
          physics: {
            default: "arcade",
            arcade: {
              gravity: { y: 0, x: 0 }, // No gravity for top-down
              debug: false,
            },
          },
          scene: [MainScene],
          backgroundColor: "#1a1a1a",
        };

        gameRef.current = new Phaser.Game(config);
      }
    };

    void initGame();

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      id="phaser-game"
      className="rounded-lg overflow-hidden shadow-2xl border border-white/10"
    />
  );
};
