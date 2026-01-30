"use client";

import dynamic from "next/dynamic";

const GameCanvas = dynamic(
  () => import("@/components/ghost/game-canvas").then((mod) => mod.GameCanvas),
  { ssr: false }
);

export default function GhostPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
        Ghost Town (Multiplayer Demo)
      </h1>
      <p className="mb-6 text-neutral-400">
        Arrow keys to move. Open in multiple windows to see sync.
      </p>
      <GameCanvas />
    </div>
  );
}
