"use client";

import { motion } from "framer-motion";
import { ArrowRight, Map as MapIcon, Compass, X } from "lucide-react";
import { useState, useEffect } from "react";
import { MAP_ENTITIES, TILE_SIZE } from "./constants";

interface DialogState {
  show: boolean;
  title: string;
  message: string;
}

interface GhostOverlayProps {
  playerPosition: { x: number; y: number } | null;
  hasMap: boolean;
  dialog: DialogState | null;
  onCloseDialog: () => void;
}

export const GhostOverlay: React.FC<GhostOverlayProps> = ({
  playerPosition,
  hasMap,
  dialog,
  onCloseDialog,
}) => {
  const [targetEntityId, setTargetEntityId] = useState<string | null>(null);

  // ターゲット可能なエンティティのフィルタリング（地図取得済みなら全て、未取得なら非表示）
  const targetableEntities = hasMap
    ? MAP_ENTITIES.filter((e) => e.type !== "item" || e.id !== "map_item")
    : [];

  // Calculate Angle
  const getAngleToTarget = () => {
    if (!targetEntityId || !playerPosition) return 0;
    const target = MAP_ENTITIES.find((e) => e.id === targetEntityId);
    if (!target) return 0;

    const playerTileX = playerPosition.x / TILE_SIZE;
    const playerTileY = playerPosition.y / TILE_SIZE;
    const dx = target.position.x - playerTileX;
    const dy = target.position.y - playerTileY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  // ターゲットまでの距離を計算
  const getDistanceToTarget = () => {
    if (!targetEntityId || !playerPosition) return null;
    const target = MAP_ENTITIES.find((e) => e.id === targetEntityId);
    if (!target) return null;

    const playerTileX = playerPosition.x / TILE_SIZE;
    const playerTileY = playerPosition.y / TILE_SIZE;
    const dx = target.position.x - playerTileX;
    const dy = target.position.y - playerTileY;
    return Math.sqrt(dx * dx + dy * dy).toFixed(1);
  };

  if (!playerPosition) return null;

  return (
    <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
      {/* Dialog Modal */}
      {dialog?.show && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-auto z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-neutral-900 border border-white/20 rounded-2xl p-6 max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{dialog.title}</h3>
              <button
                onClick={onCloseDialog}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-neutral-400" />
              </button>
            </div>
            <p className="text-neutral-300 whitespace-pre-wrap mb-4">
              {dialog.message}
            </p>
            <button
              onClick={onCloseDialog}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              閉じる
            </button>
          </motion.div>
        </div>
      )}

      {/* Top Left: Position Info */}
      <div className="flex gap-3 pointer-events-auto items-start">
        <div className="bg-black/70 backdrop-blur-md rounded-xl p-3 text-white border border-white/10 shadow-lg">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-1">
            <Compass className="text-indigo-400" size={18} />
            Ghost Map
          </h2>
          <div className="text-[11px] text-neutral-400 font-mono">
            X: {Math.floor(playerPosition.x / TILE_SIZE)}, Y:{" "}
            {Math.floor(playerPosition.y / TILE_SIZE)}
          </div>
          {!hasMap && (
            <div className="text-[10px] text-amber-400 mt-1">
              💡 地図を探して拾おう
            </div>
          )}
        </div>
      </div>

      {/* Bottom Right: Compass (Only if hasMap) */}
      {hasMap && (
        <div className="pointer-events-auto bg-black/70 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-lg w-64 self-end">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <MapIcon size={12} /> Compass
            </span>
            {targetEntityId && (
              <button
                onClick={() => setTargetEntityId(null)}
                className="text-[9px] text-red-400 hover:text-red-300"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex gap-3 items-center">
            {/* Compass Graphic */}
            <div className="relative w-14 h-14 bg-neutral-900 rounded-full border border-white/10 shadow-inner flex items-center justify-center shrink-0">
              <div className="absolute top-0.5 text-[7px] text-neutral-500 font-bold">
                N
              </div>
              {targetEntityId ? (
                <motion.div
                  className="w-full h-full flex items-center justify-center"
                  animate={{ rotate: getAngleToTarget() }}
                >
                  <ArrowRight
                    size={20}
                    className="text-indigo-500 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]"
                  />
                </motion.div>
              ) : (
                <div className="w-2 h-2 bg-neutral-700 rounded-full" />
              )}
            </div>

            {/* Target Select */}
            <div className="flex-1">
              <select
                className="w-full bg-neutral-800 text-neutral-200 text-[11px] rounded-lg px-2 py-1.5 border border-neutral-700 outline-none focus:border-indigo-500"
                value={targetEntityId || ""}
                onChange={(e) => setTargetEntityId(e.target.value || null)}
              >
                <option value="">行き先を選択...</option>
                {targetableEntities.map((entity) => (
                  <option key={entity.id} value={entity.id}>
                    {entity.name}
                  </option>
                ))}
              </select>
              {targetEntityId && (
                <div className="text-[10px] text-neutral-400 mt-1">
                  距離: {getDistanceToTarget()} tiles
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
