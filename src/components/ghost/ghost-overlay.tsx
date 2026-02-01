"use client";

import { motion } from "framer-motion";
import { ArrowRight, Compass, Map as MapIcon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MAP_ENTITIES, TILE_SIZE } from "./constants";
import { GhostChat } from "./ghost-chat";

interface DialogState {
  show: boolean;
  title: string;
  message: string;
}

export interface GhostOverlayProps {
  playerPosition: { x: number; y: number } | null;
  hasMap: boolean;
  dialog: DialogState | null;
  onCloseDialog: () => void;
  onWarp?: (x: number, y: number) => void;
  topRightOffsetClassName?: string;
}

export const GhostOverlay: React.FC<GhostOverlayProps> = ({
  playerPosition,
  hasMap,
  dialog,
  onCloseDialog,
  onWarp,
  topRightOffsetClassName,
}) => {
  const [targetEntityId, setTargetEntityId] = useState<string | null>(null);

  // Warp State
  const [warpX, setWarpX] = useState<string>("");
  const [warpY, setWarpY] = useState<string>("");
  const [countries, setCountries] = useState<string[]>(["始まりの国"]);
  const [selectedCountry, setSelectedCountry] = useState<string>("始まりの国");
  const [newCountryName, setNewCountryName] = useState("");
  const [showWarpMenu, setShowWarpMenu] = useState(false);
  const [showItemSplash, setShowItemSplash] = useState(false);
  const [isCompassHighlighted, setIsCompassHighlighted] = useState(false);
  const [showWarpConfirm, setShowWarpConfirm] = useState(false);
  const prevHasMapRef = useRef(hasMap);

  // 地図取得時のエフェクトトリガー
  useEffect(() => {
    if (hasMap && !prevHasMapRef.current) {
      setShowItemSplash(true);
      setIsCompassHighlighted(true);
      prevHasMapRef.current = true;

      // Auto-close removed as per user request
      // const splashTimer = setTimeout(() => setShowItemSplash(false), 4000);
      const highlightTimer = setTimeout(
        () => setIsCompassHighlighted(false),
        8000
      );

      return () => {
        // clearTimeout(splashTimer);
        clearTimeout(highlightTimer);
      };
    } else if (!hasMap) {
      prevHasMapRef.current = false;
    }
  }, [hasMap]);

  // ターゲット可能なエンティティのフィルタリング（地図取得済みなら全て、未取得なら非表示）
  const targetableEntities = MAP_ENTITIES.filter(
    (e) => e.type !== "item" || e.id !== "map_item"
  );

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

  // 描画用の座標を取得（目標設定時は相対座標、未設定時は絶対座標）
  const getDisplayCoordinates = () => {
    if (!playerPosition) return { x: 0, y: 0, isRelative: false };

    const playerTileX = Math.floor(playerPosition.x / TILE_SIZE);
    const playerTileY = Math.floor(playerPosition.y / TILE_SIZE);

    if (!targetEntityId) {
      return { x: playerTileX, y: playerTileY, isRelative: false };
    }

    const target = MAP_ENTITIES.find((e) => e.id === targetEntityId);
    if (!target) return { x: playerTileX, y: playerTileY, isRelative: false };

    // 目標を(0,0)とした相対座標
    // 自分 - 目標
    return {
      x: Math.floor(playerTileX - target.position.x),
      y: Math.floor(playerTileY - target.position.y),
      isRelative: true,
      targetName: target.name,
    };
  };

  const displayCoords = getDisplayCoordinates();

  const handleWarpToTarget = () => {
    if (!onWarp || !targetEntityId) return;
    const target = MAP_ENTITIES.find((e) => e.id === targetEntityId);
    if (target) {
      // ターゲットのすぐ近く（足元側）にワープするようにオフセットを追加
      // 接触判定半径（0.75）より少し離れた位置（1.2）に設定
      // タイル座標をピクセル座標に変換
      const pixelX = target.position.x * TILE_SIZE;
      const pixelY = (target.position.y + 1.2) * TILE_SIZE;
      onWarp(pixelX, pixelY);
      setShowWarpConfirm(false);
    }
  };

  const handleCoordinateWarp = () => {
    if (!onWarp) return;
    const tileX = parseInt(warpX);
    const tileY = parseInt(warpY);
    if (!isNaN(tileX) && !isNaN(tileY)) {
      // タイル座標をピクセル座標に変換
      const pixelX = tileX * TILE_SIZE;
      const pixelY = tileY * TILE_SIZE;
      onWarp(pixelX, pixelY);
    }
  };

  const handleAddCountry = () => {
    if (newCountryName && !countries.includes(newCountryName)) {
      setCountries([...countries, newCountryName]);
      setNewCountryName("");
    }
  };

  const handleDeleteCountry = (country: string) => {
    if (country === "始まりの国") return; // Initial country cannot be deleted
    setCountries(countries.filter((c) => c !== country));
    if (selectedCountry === country) {
      setSelectedCountry(countries[0]);
    }
  };

  const topRightPositionClassName = topRightOffsetClassName ?? "top-3";

  return (
    <div className="absolute inset-0 pointer-events-none p-3">
      {/* Item Pickup Splash */}
      {showItemSplash && (
        <div
          className="absolute inset-0 z-[60] flex items-start justify-center pt-[20vh] bg-black/40 backdrop-blur-sm pointer-events-auto cursor-pointer"
          onClick={() => setShowItemSplash(false)}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="bg-indigo-600/90 backdrop-blur-xl border-2 border-indigo-400 rounded-3xl p-10 flex flex-col items-center shadow-[0_0_50px_rgba(99,102,241,0.5)] cursor-default max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-white/20 p-6 rounded-full mb-6"
            >
              <MapIcon size={80} className="text-white" />
            </motion.div>
            <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">
              NEW ITEM GET!
            </h2>
            <p className="text-2xl text-indigo-100 font-bold mb-4">
              「古びた地図（コンパス）」を手に入れた
            </p>
            <div className="mt-2 flex items-center gap-3 text-indigo-200 bg-black/30 px-6 py-3 rounded-full text-lg">
              <Compass size={24} />
              右上のコンパスで行き先を探せるようになった！
            </div>
            <p className="text-lg text-indigo-300 mt-4 opacity-70">
              (Click outside to dismiss)
            </p>
          </motion.div>
        </div>
      )}

      {/* Dialog Modal */}
      {dialog?.show && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-auto z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-neutral-900 border border-white/20 rounded-2xl p-8 max-w-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">{dialog.title}</h3>
              <button
                onClick={onCloseDialog}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close dialog"
              >
                <X size={28} className="text-neutral-400" />
              </button>
            </div>
            <p className="text-lg text-neutral-300 whitespace-pre-wrap mb-6 leading-relaxed">
              {dialog.message}
            </p>
            <button
              onClick={onCloseDialog}
              className="w-full py-4 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
            >
              閉じる
            </button>
          </motion.div>
        </div>
      )}

      {/* Top Right Container: Coordinates & Compass */}
      <div
        className={`absolute ${topRightPositionClassName} right-3 flex flex-col gap-4 items-end pointer-events-auto`}
      >
        {/* Position Info (Only show if NO MAP) */}
        {!hasMap && (
          <div className="bg-black/70 backdrop-blur-md rounded-2xl p-4 text-white border border-white/10 shadow-lg w-fit">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-2 justify-end">
              <Compass className="text-indigo-400" size={24} />
              Ghost Map
            </h2>
            <div className="text-lg text-neutral-400 font-mono flex flex-col gap-1 items-end">
              <div className="flex items-center gap-3">
                <span className="opacity-50">X:</span> {displayCoords.x}
                <span className="opacity-50 ml-1">Y:</span> {displayCoords.y}
              </div>
              {displayCoords.isRelative && (
                <div className="text-lg text-indigo-400/80 font-sans italic">
                  (Relative to {displayCoords.targetName})
                </div>
              )}
            </div>
            {!hasMap && (
              <div className="text-lg text-amber-400 mt-2 animate-pulse text-right font-medium">
                💡 地図（コンパス）を探して拾おう
              </div>
            )}
          </div>
        )}

        {/* Compass (Always visible) */}
        <motion.div
          initial={{ scale: 0, opacity: 0, x: 50, y: -50 }}
          animate={{
            scale: 1,
            opacity: 1,
            x: 0,
            y: 0,
            boxShadow: isCompassHighlighted
              ? "0 0 30px rgba(99, 102, 241, 0.6)"
              : "0 10px 30px rgba(0,0,0,0.4)",
            borderColor: isCompassHighlighted
              ? "rgba(129, 140, 248, 0.8)"
              : "rgba(255, 255, 255, 0.1)",
          }}
          className={`pointer-events-auto bg-black/70 backdrop-blur-md rounded-2xl p-4 border shadow-lg w-[26rem] flex flex-col gap-4 transition-all duration-700`}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-lg text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-2">
              <MapIcon size={18} /> Compass
            </span>

            {/* Merged Coordinates Display */}
            <div className="text-lg text-neutral-300 font-mono flex items-center gap-3 bg-black/40 px-3 py-1 rounded-lg border border-white/5 mx-2 flex-shrink min-w-0">
              <span className="opacity-50">X:</span> {displayCoords.x}
              <span className="opacity-50">Y:</span> {displayCoords.y}
              {displayCoords.isRelative && (
                <span className="text-sm text-indigo-400 ml-1 italic truncate max-w-[100px]">
                  (to {displayCoords.targetName})
                </span>
              )}
            </div>

            {/* Toggle Warp Menu */}
            <button
              onClick={() => setShowWarpMenu(!showWarpMenu)}
              className="text-lg px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-indigo-400 rounded-lg border border-neutral-700 transition-colors whitespace-nowrap"
            >
              {showWarpMenu ? "Hide" : "Menu"}
            </button>
          </div>

          <div className="flex gap-4 items-center">
            {/* Compass Graphic */}
            <div className="relative w-20 h-20 bg-neutral-900 rounded-full border border-white/10 shadow-inner flex items-center justify-center shrink-0">
              <div className="absolute top-1 text-xs text-neutral-500 font-bold">
                N
              </div>
              {targetEntityId ? (
                <motion.div
                  className="w-full h-full flex items-center justify-center"
                  animate={{ rotate: getAngleToTarget() }}
                >
                  <ArrowRight
                    size={32}
                    className="text-indigo-500 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]"
                  />
                </motion.div>
              ) : (
                <div className="w-3 h-3 bg-neutral-700 rounded-full" />
              )}
            </div>

            {/* Target Select */}
            <div className="flex-1 flex flex-col gap-3">
              <select
                className={`w-full bg-neutral-800 text-neutral-200 text-lg rounded-xl px-3 py-2 border outline-none transition-colors ${
                  isCompassHighlighted
                    ? "border-indigo-500 animate-pulse ring-2 ring-indigo-500/20"
                    : "border-neutral-700 focus:border-indigo-500"
                }`}
                value={targetEntityId || ""}
                onChange={(e) => {
                  setTargetEntityId(e.target.value || null);
                  setShowWarpConfirm(false);
                }}
              >
                <option value="">行き先を選択...</option>
                {targetableEntities.map((entity) => (
                  <option key={entity.id} value={entity.id}>
                    {entity.name}
                  </option>
                ))}
              </select>

              {/* Warp to Target Button */}
              {targetEntityId && (
                <div className="flex flex-col gap-2">
                  {showWarpConfirm ? (
                    <div className="flex flex-col gap-2 bg-neutral-900/80 p-3 rounded-xl border border-indigo-500/50">
                      <div className="text-lg text-center text-indigo-200 mb-1 font-bold">
                        本当にワープしますか？
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowWarpConfirm(false)}
                          className="flex-1 py-2 text-lg bg-neutral-700 hover:bg-neutral-600 text-neutral-300 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleWarpToTarget}
                          className="flex-1 py-2 text-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/50 transition-all animate-pulse"
                        >
                          GO!
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowWarpConfirm(true)}
                      className="w-full py-2 text-lg bg-indigo-900/50 hover:bg-indigo-900 text-indigo-200 border border-indigo-500/30 rounded-xl transition-colors"
                    >
                      Warp to Target ({getDistanceToTarget()})
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Warp Menu Section */}
          {showWarpMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="pt-3 border-t border-white/10 flex flex-col gap-3 overflow-hidden"
            >
              <div className="text-lg text-neutral-400 font-bold">
                Coordinate Warp
              </div>

              {/* Country Select */}
              <div className="flex gap-2">
                <select
                  className="flex-1 bg-neutral-800 text-lg text-neutral-300 rounded-lg px-3 py-2 border border-neutral-700 outline-none"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {selectedCountry !== "始まりの国" && (
                  <button
                    onClick={() => handleDeleteCountry(selectedCountry)}
                    className="px-3 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-lg border border-red-900/50 text-lg"
                  >
                    Del
                  </button>
                )}
              </div>

              {/* Add Country (Mock) */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New Country Name"
                  className="flex-1 bg-neutral-800 text-lg text-neutral-300 rounded-lg px-3 py-2 border border-neutral-700 outline-none"
                  value={newCountryName}
                  onChange={(e) => setNewCountryName(e.target.value)}
                />
                <button
                  onClick={handleAddCountry}
                  className="px-3 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 rounded-lg text-lg"
                >
                  Add
                </button>
              </div>

              {/* Coordinates Input */}
              <div className="flex gap-3 items-center">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-lg text-neutral-500">X</span>
                  <input
                    type="number"
                    className="w-full bg-neutral-800 text-lg text-neutral-300 rounded-lg px-3 py-2 border border-neutral-700 outline-none"
                    placeholder="0"
                    value={warpX}
                    onChange={(e) => setWarpX(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-lg text-neutral-500">Y</span>
                  <input
                    type="number"
                    className="w-full bg-neutral-800 text-lg text-neutral-300 rounded-lg px-3 py-2 border border-neutral-700 outline-none"
                    placeholder="0"
                    value={warpY}
                    onChange={(e) => setWarpY(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleCoordinateWarp}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-lg font-bold shadow-lg shadow-indigo-500/20"
                >
                  GO
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Chat Overlay */}
      <GhostChat />
    </div>
  );
};
