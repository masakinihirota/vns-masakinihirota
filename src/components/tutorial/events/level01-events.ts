/**
 * レベル01 イベント定義
 * マップ上のエンティティとイベントのデータ
 */

import type { TutorialEvent } from "./types";

export const LEVEL01_EVENTS: Record<string, TutorialEvent> = {
  map_item: {
    id: "map_item",
    position: { x: 3, y: 5 },
    type: "item",
    trigger: "proximity",
    triggerDistance: 0.5,
    actions: [
      {
        type: "give-item",
        itemId: "compass",
      },
      {
        type: "show-dialogue",
        speaker: "System",
        dialogue: "地図（コンパス）を手に入れた！",
      },
      {
        type: "trigger-phase",
        phase: "map_found",
      },
    ],
    oneTime: true,
    metadata: {
      visual: "compass-icon",
      scale: 1.2,
      particle: "glow",
    },
  },

  queen_npc: {
    id: "queen_npc",
    position: { x: 0, y: 0 },
    type: "npc",
    trigger: "proximity",
    triggerDistance: 2,
    actions: [
      {
        type: "show-dialogue",
        speaker: "Queen",
        dialogue: "ようこそ。この世界へ。",
      },
    ],
    oneTime: false,
    metadata: {
      name: "真咲女王",
      visual: "queen-sprite",
      dialogueKey: "SCENE_1_LINES",
    },
  },

  guide_trigger: {
    id: "guide_trigger",
    position: { x: 5, y: 10 },
    type: "trigger-zone",
    trigger: "tile-enter",
    actions: [
      {
        type: "show-dialogue",
        speaker: "Guide",
        dialogue: "やあ、はじめまして。",
      },
    ],
    oneTime: true,
    metadata: {
      phase: "guide_intro",
    },
  },

  treasure_chest: {
    id: "treasure_chest",
    position: { x: 15, y: 8 },
    type: "item",
    trigger: "click",
    actions: [
      {
        type: "show-dialogue",
        speaker: "System",
        dialogue: "古いチェストを開けた。何も入っていない。",
      },
    ],
    oneTime: true,
    metadata: {
      visual: "treasure-chest",
    },
  },

  crystal_statue: {
    id: "crystal_statue",
    position: { x: 10, y: 10 },
    type: "landmark",
    trigger: "proximity",
    triggerDistance: 1.5,
    actions: [
      {
        type: "show-dialogue",
        speaker: "System",
        dialogue:
          "美しい水晶像が立っている。何かの力を感じるが、今はまだ触れることができないようだ。",
      },
    ],
    oneTime: false,
    metadata: {
      visual: "crystal-statue",
      scale: 1.5,
    },
  },

  ancient_tree: {
    id: "ancient_tree",
    position: { x: 2, y: 15 },
    type: "landmark",
    trigger: "proximity",
    triggerDistance: 1.5,
    actions: [
      {
        type: "show-dialogue",
        speaker: "System",
        dialogue: "千年以上前から立っているという樹齢の長い木だ。",
      },
    ],
    oneTime: false,
    metadata: {
      visual: "ancient-tree",
      scale: 2,
    },
  },

  mystery_door: {
    id: "mystery_door",
    position: { x: 18, y: 18 },
    type: "trigger-zone",
    trigger: "proximity",
    triggerDistance: 1,
    actions: [
      {
        type: "show-dialogue",
        speaker: "System",
        dialogue: "不思議な扉が見える。中に何が待っているのだろう...？",
      },
    ],
    oneTime: false,
    metadata: {
      phase: "explore",
    },
  },

  healing_spring: {
    id: "healing_spring",
    position: { x: 8, y: 3 },
    type: "landmark",
    trigger: "proximity",
    triggerDistance: 1,
    actions: [
      {
        type: "show-dialogue",
        speaker: "System",
        dialogue: "聖なる泉が流れている。心が洗われるようだ。",
      },
    ],
    oneTime: false,
    metadata: {
      visual: "healing-spring",
      particle: "water-glow",
    },
  },

  shadow_creature: {
    id: "shadow_creature",
    position: { x: 12, y: 2 },
    type: "npc",
    trigger: "proximity",
    triggerDistance: 2,
    actions: [
      {
        type: "show-dialogue",
        speaker: "System",
        dialogue: "暗い影が動く。正体は不明だ。",
      },
    ],
    oneTime: false,
    metadata: {
      name: "影の生き物",
      visual: "shadow-creature",
    },
  },
};
