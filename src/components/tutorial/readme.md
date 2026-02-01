# チュートリアルシステム 操作マニュアル

> **対象読者**: 開発者、AI エージェント
> **最終更新**: 2026年2月2日
> **目的**: チュートリアルコンポーネントの構造、操作方法、拡張手順を理解する

---

## 📋 目次

1. [プロジェクト概要](#プロジェクト概要)
2. [アーキテクチャ](#アーキテクチャ)
3. [ディレクトリ構成](#ディレクトリ構成)
4. [状態管理システム](#状態管理システム)
5. [イベントシステム](#イベントシステム)
6. [シナリオシステム](#シナリオシステム)
7. [データフロー](#データフロー)
8. [操作手順](#操作手順)
9. [トラブルシューティング](#トラブルシューティング)
10. [テスト](#テスト)

---

## プロジェクト概要

このチュートリアルシステムは、**Phaser 3 ゲームエンジン** と **React** を統合したストーリー駆動型チュートリアルを提供します。

### 主要機能
- ✅ フェーズベースのストーリー進行（10フェーズ）
- ✅ イベント駆動型アーキテクチャ
- ✅ 状態管理の一元化（React + Phaser）
- ✅ キーワードシステム（アンロック・学習）
- ✅ マップレンダリング（2D タイルマップ）
- ✅ 永続化（LocalStorage）
- ✅ エラーハンドリング

### 技術スタック
- **React 18+**: UI コンポーネント
- **Phaser 3**: ゲームエンジン
- **TypeScript**: 型安全性
- **Vitest**: ユニットテスト
- **LocalStorage**: データ永続化

---

## アーキテクチャ

```
┌─────────────────────────────────────────────────────┐
│                 React UI Layer                       │
│  (tutorial-story.tsx, queen-dialogue.tsx)           │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │  GameStateManager   │ ← 状態管理の中枢
        │  (state/)           │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │   EventSystem       │ ← イベント実行エンジン
        │   (events/)         │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │  Phaser MainScene   │ ← ゲームロジック
        │  (Ghost Component)  │
        └─────────────────────┘
```

### レイヤー分離の原則
1. **UI Layer**: React コンポーネント（表示のみ）
2. **State Layer**: 状態管理（GameStateManager）
3. **Event Layer**: イベント駆動ロジック（EventSystem）
4. **Game Layer**: Phaser シーン（ゲームエンジン）

---

## ディレクトリ構成

```
tutorial/
├── state/                    # 状態管理
│   ├── game-state-manager.ts    # 状態マネージャー（中核）
│   ├── use-tutorial-state.ts    # React フック
│   └── index.ts
│
├── events/                   # イベントシステム
│   ├── event-system.ts           # イベント実行エンジン
│   ├── level01-events.ts         # レベル1イベント定義
│   ├── types.ts                  # イベント型定義
│   └── index.ts
│
├── scenarios/                # シナリオ定義
│   ├── level01/
│   │   ├── scenes.ts             # レベル1ストーリー台詞
│   │   └── index.ts
│   ├── level02/
│   │   ├── scenes.ts             # レベル2ストーリー台詞
│   │   └── index.ts
│   └── types.ts                  # シナリオ型定義
│
├── map/                      # マップレンダリング
│   ├── map-renderer.ts           # タイルマップ描画
│   ├── entity-renderer.ts        # エンティティ描画
│   ├── map-config.ts             # マップ定義
│   └── index.ts
│
├── keywords/                 # キーワードシステム
│   ├── keyword-system.ts         # キーワード管理
│   └── index.ts
│
├── persistence/              # データ永続化
│   ├── tutorial-persistence.ts   # 保存/読込ロジック
│   ├── local-storage-cache.ts    # キャッシュ管理
│   └── index.ts
│
├── __tests__/                # テスト
│   ├── tutorial-system.test.ts   # システムテスト
│   └── tutorial-integration.test.ts # 統合テスト
│
├── tutorial-story.tsx        # メインコンポーネント
├── tutorial-story-v2.tsx     # 新統合版（推奨）
├── queen-dialogue.tsx        # 女王ダイアログUI
├── keyword-modal.tsx         # キーワードモーダル
├── error-boundary.tsx        # エラーバウンダリ
├── tutorial-keywords.data.ts # キーワードマスタデータ
├── IMPLEMENTATION_GUIDE.md   # 実装ガイド（詳細版）
└── readme.md                 # このファイル
```

### 各ディレクトリの役割

#### `state/` - 状態管理
**責務**: チュートリアル全体の状態を一元管理
- `GameStateManager`: シングルトンクラス、全状態を保持
- `use-tutorial-state.ts`: React フック提供

#### `events/` - イベントシステム
**責務**: 条件ベースのイベント実行
- `EventSystem`: イベント実行エンジン
- `level01-events.ts`: イベント定義（位置トリガー、アイテム取得など）

#### `scenarios/` - シナリオ定義
**責務**: ストーリー台詞の管理
- `scenes.ts`: フェーズごとの台詞データ
- `types.ts`: シナリオ型定義（Speaker, DialogueLine など）

#### `map/` - マップレンダリング
**責務**: Phaser タイルマップの描画
- `map-renderer.ts`: タイルマップ描画
- `entity-renderer.ts`: アイテム・NPCの描画

#### `keywords/` - キーワードシステム
**責務**: キーワードのアンロック・学習管理
- `keyword-system.ts`: キーワードロジック

#### `persistence/` - 永続化
**責務**: LocalStorage への保存・読込
- `tutorial-persistence.ts`: 保存/復元API
- `local-storage-cache.ts`: キャッシュ層

---

## 状態管理システム

### GameStateManager の状態一覧

```typescript
interface TutorialGameState {
  // プレイヤー
  playerPosition: { x: number; y: number };  // プレイヤー座標
  hasMap: boolean;                           // マップ取得状態

  // ストーリー進行
  currentPhase: TutorialPhase;               // 現在のフェーズ
  lineIndex: number;                         // 台詞インデックス

  // エンティティ
  discoveredEntities: Set<string>;           // 発見済みエンティティID

  // UI制御
  isPaused: boolean;                         // 一時停止状態
  speed: "instant" | "fast" | "normal";      // テキスト速度

  // キーワード
  unlockedKeywordIds: string[];              // アンロック済み
  learnedKeywordIds: string[];               // 学習済み

  // ダイアログ
  dialog: DialogState | null;                // ダイアログ表示状態

  // エラー
  errors: TutorialError[];                   // エラーログ
}
```

### フェーズ一覧（TutorialPhase）

```typescript
type TutorialPhase =
  | "scene1"              // 1. オープニング
  | "scene2"              // 2. 世界観説明
  | "quest"               // 3. クエスト提示
  | "map_found"           // 4. マップ取得
  | "explore"             // 5. 探索指示
  | "return_to_queen"     // 6. 女王への報告
  | "guide_intro"         // 7. ガイド紹介
  | "account_creation"    // 8. アカウント作成
  | "mask_intro"          // 9. マスク説明
  | "end";                // 10. エンディング
```

### 状態操作API

```typescript
import { getGameStateManager } from "@/components/tutorial/state";

const manager = getGameStateManager();

// フェーズ変更
manager.goToPhase("map_found", 0);

// ライン進行
manager.advanceLine();

// プレイヤー位置更新
manager.updatePlayerPosition(10, 20);

// マップ取得
manager.setHasMap(true);

// キーワード操作
manager.unlockKeyword("compass");
manager.learnKeyword("compass");

// ダイアログ表示
manager.showDialog({
  title: "女王",
  message: "ようこそ！",
  speaker: "Queen"
});

// エラー追加
manager.addError({
  code: "MAP_LOAD_FAILED",
  message: "マップ読込エラー"
});
```

### React フック

```typescript
import {
  useTutorialState,
  useTutorialPhase,
  usePlayerPosition,
  useHasMap
} from "@/components/tutorial/state";

function MyComponent() {
  // 全状態をリッスン
  const state = useTutorialState();

  // フェーズのみ
  const { phase, lineIndex } = useTutorialPhase();

  // 位置のみ
  const position = usePlayerPosition();

  // マップ状態のみ
  const hasMap = useHasMap();

  return <div>フェーズ: {phase}</div>;
}
```

---

## イベントシステム

### イベント定義の構造

```typescript
interface TutorialEvent {
  id: string;                      // イベント識別子
  name: string;                    // イベント名
  description?: string;            // 説明
  trigger: TriggerCondition;       // 発火条件
  actions: EventAction[];          // 実行アクション
  oneTime?: boolean;               // 1回のみ実行
  enabled?: boolean;               // 有効/無効
}
```

### トリガー条件の種類

```typescript
type TriggerCondition =
  | { type: "position"; x: number; y: number; radius: number }
  | { type: "phase"; phase: TutorialPhase }
  | { type: "entity_discovered"; entityId: string }
  | { type: "keyword_unlocked"; keywordId: string }
  | { type: "always" };
```

### アクションの種類

```typescript
type EventAction =
  | { type: "goto_phase"; phase: TutorialPhase; lineIndex?: number }
  | { type: "unlock_keyword"; keywordId: string }
  | { type: "set_has_map"; value: boolean }
  | { type: "show_dialog"; title: string; message: string; speaker?: string }
  | { type: "add_entity"; entityId: string; x: number; y: number };
```

### イベント追加方法

**ファイル**: `events/level01-events.ts`

```typescript
export const LEVEL01_EVENTS: Record<string, TutorialEvent> = {
  // 既存のイベント...

  // 新しいイベントを追加
  NEW_EVENT: {
    id: "new_event",
    name: "新イベント",
    description: "特定位置で発火",
    trigger: {
      type: "position",
      x: 15,
      y: 20,
      radius: 2
    },
    actions: [
      {
        type: "show_dialog",
        title: "発見",
        message: "新しい場所を発見した！"
      },
      {
        type: "unlock_keyword",
        keywordId: "new_keyword"
      }
    ],
    oneTime: true,  // 1回のみ発火
    enabled: true
  }
};
```

---

## シナリオシステム

### シナリオ定義の構造

**ファイル**: `scenarios/level01/scenes.ts`

```typescript
export const LEVEL01_CONFIG: LevelConfig = {
  id: 1,
  name: "Tutorial Level 1",
  titleJa: "チュートリアル レベル1",
  phases: [
    "scene1", "scene2", "quest", "map_found",
    "explore", "return_to_queen", "guide_intro",
    "account_creation", "mask_intro", "end"
  ],
  scenes: {
    scene1: {
      id: "scene1",
      name: "Opening",
      speaker: "The Queen",
      lines: [
        "ようこそ、旅人よ。",
        "ここは価値観の世界。",
        "あなたの旅が始まる。"
      ]
    },
    // ... 他のシーン
  }
};
```

### 新しいシーン追加方法

1. **フェーズを定義** (`TutorialPhase` に追加)
2. **シーンデータを追加** (`scenes.ts`)
3. **イベントを追加** (`level01-events.ts`)

```typescript
// 1. state/game-state-manager.ts
type TutorialPhase =
  | "scene1"
  | "new_scene"  // ← 新フェーズ追加
  | ...;

// 2. scenarios/level01/scenes.ts
scenes: {
  new_scene: {
    id: "new_scene",
    name: "New Scene",
    speaker: "Guide",
    lines: [
      "新しいシーンの台詞1",
      "新しいシーンの台詞2"
    ]
  }
}

// 3. events/level01-events.ts
NEW_SCENE_EVENT: {
  id: "new_scene_trigger",
  trigger: { type: "phase", phase: "quest" },
  actions: [
    { type: "goto_phase", phase: "new_scene", lineIndex: 0 }
  ]
}
```

---

## データフロー

### コンパス表示の流れ（例）

```
1. MainScene.ts (Phaser)
   ↓ プレイヤーが map_item に接触
   ↓
2. EventSystem
   ↓ "map_acquired" イベント発火
   ↓ アクション: { type: "set_has_map", value: true }
   ↓
3. GameStateManager
   ↓ setHasMap(true) 実行
   ↓ state.hasMap = true
   ↓ notify() で全リスナーに通知
   ↓
4. React (useTutorialState)
   ↓ hasMap が true に更新
   ↓
5. ghost-overlay.tsx
   ↓ {hasMap && <Compass />} で条件分岐
   ↓ コンパスUIを表示
```

### 状態変更の伝播経路

```
GameStateManager.updateState()
  ↓
notify() 実行
  ↓
全 listeners に state を送信
  ↓
React フックが再レンダリング
  ↓
UI が更新される
```

---

## 操作手順

### 新しいストーリーを追加する

#### ステップ1: フェーズを定義
**ファイル**: `state/game-state-manager.ts`

```typescript
type TutorialPhase =
  | "scene1"
  | "my_new_phase"  // ← 追加
  | ...;
```

#### ステップ2: シナリオを追加
**ファイル**: `scenarios/level01/scenes.ts`

```typescript
scenes: {
  my_new_phase: {
    id: "my_new_phase",
    name: "My New Phase",
    speaker: "Guide",
    lines: [
      "これは新しいフェーズです。",
      "台詞を追加してください。"
    ]
  }
}
```

#### ステップ3: イベントを追加
**ファイル**: `events/level01-events.ts`

```typescript
MY_NEW_PHASE_TRIGGER: {
  id: "my_new_phase_trigger",
  trigger: { type: "phase", phase: "quest" },
  actions: [
    { type: "goto_phase", phase: "my_new_phase", lineIndex: 0 }
  ],
  oneTime: true
}
```

### マップにアイテムを追加する

**ファイル**: `map/map-config.ts`

```typescript
export const MAP_ENTITIES = [
  {
    id: "new_item",
    type: "item" as const,
    x: 15,
    y: 20,
    sprite: "star",  // スプライト名
    name: "新アイテム"
  }
];
```

### キーワードを追加する

**ファイル**: `tutorial-keywords.data.ts`

```typescript
export const TUTORIAL_KEYWORDS = [
  {
    id: "new_keyword",
    word: "新キーワード",
    shortDescription: "説明文（短）",
    longDescription: "説明文（長）",
    category: "system",
    relatedKeywords: []
  }
];
```

---

## トラブルシューティング

### コンパスが表示されない

**原因チェックリスト**:
1. ✅ `hasMap` が `true` になっているか？
   - `GameStateManager.getState().hasMap` を確認
2. ✅ `map_item` 接触イベントが発火しているか？
   - `MainScene.ts` の接触判定をログ出力
3. ✅ `EventSystem` が正しく実行されているか？
   - `event-system.ts` でログ確認
4. ✅ React 側に状態が伝播しているか？
   - `useTutorialState()` で `hasMap` の値を確認

**デバッグ方法**:
```typescript
// GameStateManager の状態を確認
const manager = getGameStateManager();
console.log("State:", manager.getState());

// イベント実行履歴を確認
console.log("Executed Events:", eventSystem.getExecutedEvents());
```

### ダイアログが表示されない

**チェック項目**:
1. `dialog` 状態が `null` でないか？
2. `queen-dialogue.tsx` が正しくレンダリングされているか？
3. `z-index` が他の要素に隠れていないか？

### フェーズが進まない

**チェック項目**:
1. イベントの `trigger` 条件が満たされているか？
2. イベントが `enabled: true` になっているか？
3. `oneTime: true` イベントが既に実行済みでないか？

### プレイヤーが動かない

**チェック項目**:
1. Phaser シーンが正しく初期化されているか？
2. `isPaused` が `true` になっていないか？
3. キーボード入力が有効か？

---

## テスト

### テストの実行

```bash
# 全テスト実行
npm run test

# チュートリアルテストのみ
npm run test -- src/components/tutorial/__tests__/

# 特定のテストファイル
npm run test -- tutorial-system.test.ts
```

### テストファイル

#### `tutorial-system.test.ts`
- GameStateManager のテスト
- EventSystem のテスト
- キーワードシステムのテスト

#### `tutorial-integration.test.ts`
- エンドツーエンドのテスト
- フェーズ遷移のテスト
- イベント連携のテスト

### テストの書き方

```typescript
import { describe, it, expect } from "vitest";
import { GameStateManager } from "../state/game-state-manager";

describe("GameStateManager", () => {
  it("should update player position", () => {
    const manager = new GameStateManager();
    manager.updatePlayerPosition(10, 20);

    const state = manager.getState();
    expect(state.playerPosition).toEqual({ x: 10, y: 20 });
  });
});
```

---

## AI エージェント向けガイドライン

### このドキュメントの読み方

1. **構造を理解する**: ディレクトリ構成から全体像を把握
2. **状態管理を把握**: `GameStateManager` の API を確認
3. **イベントシステムを理解**: トリガーとアクションの仕組みを学ぶ
4. **データフローを追う**: コンパス表示の例で処理の流れを理解
5. **操作手順を実行**: 新規追加の手順に従って実装

### 変更時の注意点

1. **型定義を確認**: TypeScript の型に従う
2. **既存パターンを踏襲**: 既存コードのスタイルを維持
3. **テストを実行**: 変更後は必ずテストを実行
4. **状態の一貫性**: GameStateManager 経由で状態を変更
5. **イベント駆動**: 直接状態を変更せず、イベント経由で変更

### よくある質問

**Q: tutorial-story.tsx と tutorial-story-v2.tsx の違いは？**
A: v2 は新しい統合版。今後は v2 を使用推奨。

**Q: Phaser と React の状態を同期する方法は？**
A: `GameStateManager` を中継点として使用。

**Q: 新しいレベルを追加するには？**
A: `scenarios/level02/` を参考に新ディレクトリを作成。

---

## 参考資料

- **詳細実装ガイド**: [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
- **Phaser 3 ドキュメント**: https://photonstorm.github.io/phaser3-docs/
- **React フック**: https://react.dev/reference/react

---

## 更新履歴

- **2026-02-02**: 包括的マニュアルに刷新（AI向け構造化）
- **2026-01-XX**: コンパス表示の説明追加
- **2026-01-XX**: 初版作成
