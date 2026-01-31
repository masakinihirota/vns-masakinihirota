"use client";

import dynamic from "next/dynamic";

const GameCanvas = dynamic(
  () => import("@/components/ghost/game-canvas").then((mod) => mod.GameCanvas),
  { ssr: false }
);

export default function GhostPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full overflow-hidden bg-neutral-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent flex-none">
        Ghost Town (Multiplayer Demo)
      </h1>
      <p className="mb-6 text-neutral-400 flex-none">
        Arrow keys to move. Open in multiple windows to see sync.
      </p>
      <div className="flex-1 w-full min-h-0">
        <GameCanvas />
      </div>
    </div>
  );
}
