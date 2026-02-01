/**
 * チュートリアルイベントシステムの型定義
 */

export type EventTriggerType = "proximity" | "click" | "tile-enter" | "automatic";
export type ActionType =
  | "give-item"
  | "show-dialogue"
  | "trigger-phase"
  | "teleport"
  | "update-map"
  | "custom";

export interface GameContext {
  playerPosition: { x: number; y: number };
  hasMap: boolean;
  currentPhase: string;
  discoveredEntities: Set<string>;
}

export interface EventAction {
  type: ActionType;
  // give-item
  itemId?: string;
  // show-dialogue
  dialogue?: string;
  speaker?: "Queen" | "Guide" | "System";
  // trigger-phase
  phase?: string;
  // teleport
  position?: { x: number; y: number };
  // custom
  handler?: (context: GameContext) => Promise<void>;
}

export interface TutorialEvent {
  id: string;
  position: { x: number; y: number };
  type: "item" | "npc" | "landmark" | "trigger-zone";
  trigger: EventTriggerType;
  triggerDistance?: number; // for proximity trigger
  actions: EventAction[];
  oneTime?: boolean;
  enabled?: boolean;
  metadata?: Record<string, any>;
}

export interface EventResult {
  eventId: string;
  executed: boolean;
  error?: Error;
  results?: any[];
}
