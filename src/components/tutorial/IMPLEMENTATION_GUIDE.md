# チュートリアル Story ページ - 新しいアーキテクチャ実装ガイド

## 概要

このガイドは、新しく実装された統合イベントシステムと状態管理を使用して、チュートリアル Story ページの機能を開発・拡張する方法を説明します。

---

## クイックスタート

### 1. 既存の古いコンポーネントを置き換え

```bash
# 新しいバージョンをコピー
cp src/components/tutorial/tutorial-story-v2.tsx \
   src/components/tutorial/tutorial-story.tsx
```

### 2. ユニットテストを実行

```bash
npm run test -- src/components/tutorial/__tests__/
```

### 3. ページにアクセス

```bash
npm run dev
# ブラウザで http://localhost:3000/tutorial/story を開く
```

---

## コアシステムの使用方法

### A. 状態管理 (`GameStateManager`)

#### 単一の状態変更
```typescript
import { getGameStateManager } from "@/components/tutorial/state";

const manager = getGameStateManager();

// フェーズ変更
manager.goToPhase("map_found", 0);

// ライン進行
manager.advanceLine();

// プレイヤー位置更新
manager.updatePlayerPosition(10, 20);

// キーワード習得
manager.unlockKeyword("compass");
```

#### 状態変更をリッスン
```typescript
import { useTutorialState } from "@/components/tutorial/state";

export function MyComponent() {
  const state = useTutorialState();

  console.log("現在のフェーズ:", state.currentPhase);
  console.log("プレイヤー位置:", state.playerPosition);
}
```

#### 状態の特定部分のみをリッスン（最適化）
```typescript
import {
  useTutorialPhase,
  usePlayerPosition,
  useHasMap
} from "@/components/tutorial/state";

export function OptimizedComponent() {
  // フェーズのみをリッスン
  const { phase, lineIndex } = useTutorialPhase();

  // 位置のみをリッスン
  const position = usePlayerPosition();

  // マップ状態のみをリッスン
  const hasMap = useHasMap();
}
```

### B. イベントシステム

#### イベント定義の追加

新しいイベントを追加するには `level01-events.ts` を編集:

```typescript
import type { TutorialEvent } from "./types";

export const LEVEL01_EVENTS: Record<string, TutorialEvent> = {
  // ... 既存のイベント

  my_new_event: {
    id: "my_new_event",
    position: { x: 5, y: 8 },
    type: "item",
    trigger: "proximity",
    triggerDistance: 1.0,
    actions: [
      {
        type: "give-item",
        itemId: "special-item",
      },
      {
        type: "show-dialogue",
        speaker: "NPC",
        dialogue: "これは特別なアイテムです",
      },
      {
        type: "trigger-phase",
        phase: "explore",
      },
    ],
    oneTime: true,
    metadata: {
      visual: "special-icon",
      particle: "glow",
    },
  },
};
```

#### イベント実行

```typescript
import { EventSystem } from "@/components/tutorial/events/event-system";
import { LEVEL01_EVENTS } from "@/components/tutorial/events/level01-events";

const eventSystem = new EventSystem();

// アクション実行時のハンドラーを登録
eventSystem.onAction("give-item", (action) => {
  console.log("アイテムを取得:", action.itemId);
  // UI を更新
});

// イベント実行
const result = await eventSystem.execute(LEVEL01_EVENTS.map_item, {
  playerPosition: { x: 3.1, y: 5.0 },
  hasMap: false,
  currentPhase: "quest",
  lineIndex: 0,
});

if (result.executed) {
  console.log("イベント完了");
} else {
  console.log("イベント実行不可:", result.reason);
}
```

### C. キーワードシステム

#### キーワード情報の取得

```typescript
import { KeywordSystem } from "@/components/tutorial/keywords/keyword-system";

const keywordSystem = new KeywordSystem();

// キーワード情報を取得
const compassKeyword = keywordSystem.getKeyword("compass");
console.log(compassKeyword);
// {
//   id: "compass",
//   label: "コンパス",
//   description: "方角を知る道具",
//   ...
// }

// 関連キーワードを取得
const relatedIds = compassKeyword?.relatedKeywords || [];
const relatedKeywords = relatedIds
  .map(id => keywordSystem.getKeyword(id))
  .filter(Boolean);
```

#### 自動アンロック

```typescript
// フェーズ進行時に自動アンロックをチェック
keywordSystem.checkAndUnlock("scene1", 3); // 「ghost」がアンロック

// 新しくアンロックされたキーワードを取得
const newUnlockedIds = keywordSystem.getNewUnlockedKeywords();
console.log("新規:", newUnlockedIds); // ["ghost"]
```

#### キーワード習得

```typescript
// キーワードを習得
keywordSystem.learn("compass");

// 習得状態を確認
const serialized = keywordSystem.serialize();
console.log(serialized.learnedIds); // ["compass"]
```

### D. マップシステム

#### マップコンフィグの確認

```typescript
import { LEVEL01_MAP_CONFIG } from "@/components/tutorial/map/map-config";

console.log("レベル01の情報:");
console.log("幅:", LEVEL01_MAP_CONFIG.width); // 20
console.log("高さ:", LEVEL01_MAP_CONFIG.height); // 20
console.log("タイルサイズ:", LEVEL01_MAP_CONFIG.tileSize); // 32
console.log("バイオーム:", LEVEL01_MAP_CONFIG.biome); // "forest"
```

#### 新しいレベルマップの追加

```typescript
// src/components/tutorial/map/map-config.ts

export const LEVEL03_MAP_CONFIG: MapConfig = {
  id: "level03",
  name: "砂漠の遺跡",
  width: 25,
  height: 25,
  tileSize: 32,
  biome: "desert",
  backgroundColor: "#2a2515",
  theme: {
    tileColor: {
      0: "#d4a574", // sand light
      1: "#b8956a", // sand dark
      // ... 他の色
    },
    gridColor: "#ffffff10",
  },
};
```

### E. データ永続化

#### Supabase を使用した保存

```typescript
import { getTutorialPersistence } from "@/components/tutorial/persistence";

const persistence = getTutorialPersistence();

// プログレスを保存
const state = gameStateManager.serialize();
await persistence.save(userId, state);

// プログレスを読み込み
const savedState = await persistence.load(userId);
gameStateManager.deserialize(savedState);
```

#### ハイブリッド永続化（推奨）

```typescript
import { HybridPersistence } from "@/components/tutorial/persistence/local-storage-cache";

const hybrid = new HybridPersistence();

// ローカルに即座保存 + サーバーに非同期で同期
await hybrid.save(userId, state, async (uid, st) => {
  return await persistence.save(uid, st);
});

// ローカルキャッシュまたはサーバーから読み込み
const savedState = await hybrid.load(userId, async (uid) => {
  return await persistence.load(uid);
});
```

---

## ベストプラクティス

### 1. 常に GameStateManager を通して状態を更新

❌ **悪い例**:
```typescript
localStorage.setItem("phase", "map_found");
```

✅ **良い例**:
```typescript
const manager = getGameStateManager();
manager.goToPhase("map_found", 0);
```

### 2. イベントは LEVEL01_EVENTS オブジェクトで定義

❌ **悪い例**:
```typescript
if (isNear(player, npc)) {
  showDialogue("Hello");
  giveItem("compass");
}
```

✅ **良い例**:
```typescript
export const LEVEL01_EVENTS = {
  map_item: {
    // 定義
    actions: [
      { type: "give-item", itemId: "compass" },
      // ...
    ],
  },
};
```

### 3. React Hooks で状態をリッスン

❌ **悪い例**:
```typescript
const manager = getGameStateManager();
const state = manager.getState(); // 1 回の取得
console.log(state.phase);
```

✅ **良い例**:
```typescript
export function Component() {
  const { phase } = useTutorialPhase(); // リッスン開始
  // フェーズ変更時に自動再レンダー
}
```

### 4. 複雑なエラー処理は Manager のエラーハンドラーを使用

❌ **悪い例**:
```typescript
try {
  await eventSystem.execute(event, context);
} catch (e) {
  console.error(e);
}
```

✅ **良い例**:
```typescript
const manager = getGameStateManager();

manager.onError("event-failed", (error) => {
  // エラーハンドリング
  showNotification(error.message);
});

manager.logError("event-failed", "イベント実行失敗", {
  eventId: event.id,
  reason: error.message,
});
```

---

## 拡張ガイド

### 新しいレベルを追加

1. **イベント定義を作成**:
   ```typescript
   // src/components/tutorial/events/level03-events.ts
   export const LEVEL03_EVENTS: Record<string, TutorialEvent> = {
     // イベント定義
   };
   ```

2. **マップコンフィグを作成**:
   ```typescript
   // src/components/tutorial/map/map-config.ts
   export const LEVEL03_MAP_CONFIG: MapConfig = {
     // マップ定義
   };
   ```

3. **シナリオを作成**:
   ```typescript
   // src/components/tutorial/scenarios/level03/scenes.ts
   export const SCENE_1_LINES = [
     // 台詞
   ];
   ```

4. **メインコンポーネントで統合**:
   ```typescript
   // src/components/tutorial/tutorial-story.tsx
   function getPhaseLines(phase: Phase) {
     switch (phase) {
       case "level03_scene1":
         return SCENE_1_LINES; // level03 から
       // ...
     }
   }
   ```

### 新しいキーワードを追加

```typescript
// src/components/tutorial/keywords/keyword-system.ts

export const TUTORIAL_KEYWORDS_EXTENDED: Record<string, Keyword> = {
  // ... 既存

  new_keyword: {
    id: "new_keyword",
    label: "新しいキーワード",
    description: "これは新しいキーワードです",
    relatedPhase: "scene1",
    trigger: {
      type: "auto-unlock",
      phase: "scene1",
      lineIndex: 5
    },
    category: "system-concept",
    examples: ["例1", "例2"],
    relatedKeywords: ["existing_keyword"],
  },
};
```

### 新しいアクションハンドラーを登録

```typescript
import { EventSystem } from "@/components/tutorial/events/event-system";

const eventSystem = new EventSystem();

// カスタムアクションハンドラーを登録
eventSystem.onAction("my-custom-action", (action: any) => {
  console.log("カスタムアクション実行:", action);
  // カスタム処理
});

// または EventSystem に登録
eventSystem.registerHandler("my-custom-action", async (context) => {
  // 処理
});
```

---

## トラブルシューティング

### Q: イベントが発火しない

**確認項目**:
1. トリガー距離が正しいか？
   ```typescript
   triggerDistance: 1.0, // プレイヤーが 1.0 タイル内にいる必要がある
   ```

2. `canExecute()` が true か？
   ```typescript
   if (!eventSystem.canExecute(event, context)) {
     console.log("実行不可:", event.id);
   }
   ```

3. ワンタイムイベントがすでに実行されていないか？
   ```typescript
   const result = await eventSystem.execute(event, context);
   console.log("実行結果:", result);
   ```

### Q: 状態が同期されない

**確認項目**:
1. `GameStateManager` を通して更新しているか？
2. React Hooks で正しくリッスンしているか？
3. アンサブスクライブしていないか？

```typescript
// 購読開始
const unsubscribe = manager.subscribe(() => {
  // 監視
});

// 購読終了（必要な場合）
// unsubscribe();
```

### Q: Phaser が初期化失敗する

**確認項目**:
1. コンテナ要素が存在するか？
2. ブラウザが WebGL をサポートしているか？
3. エラーバウンダリがキャッチしているか？

```typescript
// エラーログを確認
manager.onError("phaser-init-error", (error) => {
  console.log("Phaser 初期化エラー:", error);
});
```

---

## テストの実行

### ユニットテスト

```bash
# すべてのテストを実行
npm run test

# 特定のテストファイルのみ
npm run test -- src/components/tutorial/__tests__/tutorial-system.test.ts

# ウォッチモード
npm run test -- --watch
```

### 統合テスト

```bash
npm run test -- src/components/tutorial/__tests__/tutorial-integration.test.ts
```

### カバレッジレポート

```bash
npm run test -- --coverage
```

---

## パフォーマンスのヒント

1. **位置更新のスロットリング**:
   ```typescript
   // GameStateManager が自動的にスロットリング (0.1px 閾値)
   manager.updatePlayerPosition(x, y);
   ```

2. **特定の状態のみをリッスン**:
   ```typescript
   // ❌ すべての状態をリッスン
   const state = useTutorialState();

   // ✅ 必要な状態のみ
   const { phase } = useTutorialPhase();
   ```

3. **不要なイベントハンドラーを削除**:
   ```typescript
   // ハンドラー登録時に返された関数で削除
   const unregister = eventSystem.registerHandler("action", () => {});
   // 不要になったら
   unregister();
   ```

---

## その他のリソース

- **アーキテクチャドキュメント**: `0050 詳細設計.../チュートリアルStory_アーキテクチャドキュメント.md`
- **完了報告書**: `0050 詳細設計.../チュートリアルStory_完了報告書.md`
- **ソースコード**: `src/components/tutorial/`
- **テストファイル**: `src/components/tutorial/__tests__/`

---

**更新日**: 2026-02-02
**バージョン**: 1.0
