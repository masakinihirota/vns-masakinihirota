/**
 * チュートリアルマップレイアウトコンフィグ
 * マップのサイズ、テーマ、レイアウト定義
 */

import { TILE_SIZE } from "@/components/ghost/constants";

export interface MapConfig {
  id: string;
  name: string;
  width: number;
  height: number;
  tileSize: number;
  biome: "forest" | "cave" | "desert" | "sky" | "water";
  backgroundColor: string;
  theme: {
    tileColor: Record<number, string>;
    gridColor: string;
  };
}

export const LEVEL01_MAP_CONFIG: MapConfig = {
  id: "level01",
  name: "はじまりの国",
  width: 20,
  height: 20,
  tileSize: TILE_SIZE,
  biome: "forest",
  backgroundColor: "#1a1a2e",
  theme: {
    tileColor: {
      0: "#2d5a3d", // grass
      1: "#1a3d1a", // dark grass
      2: "#4a7c59", // light grass
      3: "#8b7355", // dirt
      4: "#a0a0a0", // stone
      5: "#6b5b45", // sand
    },
    gridColor: "#ffffff10",
  },
};

export const LEVEL02_MAP_CONFIG: MapConfig = {
  id: "level02",
  name: "修行の洞窟",
  width: 30,
  height: 30,
  tileSize: TILE_SIZE,
  biome: "cave",
  backgroundColor: "#0a0a0a",
  theme: {
    tileColor: {
      0: "#3a3a3a", // cave wall
      1: "#2a2a2a", // dark wall
      2: "#5a5a5a", // light wall
      3: "#4a4a4a", // stone
      4: "#1a1a1a", // obsidian
    },
    gridColor: "#ffffff05",
  },
};

/**
 * レベルごとのマップコンフィグを取得
 */
export function getMapConfig(level: string): MapConfig {
  switch (level) {
    case "level01":
      return LEVEL01_MAP_CONFIG;
    case "level02":
      return LEVEL02_MAP_CONFIG;
    default:
      return LEVEL01_MAP_CONFIG;
  }
}
