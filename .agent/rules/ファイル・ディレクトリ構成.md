---
trigger: always_on
---

## ファイル・ディレクトリ構成

重要: このプロジェクトでは「ルーティング（ページ）」と「コンポーネント（UI/ビジネスロジック）」を明確に分離し、さらにコンポーネントごとに責務を分けることで可読性とテスト容易性を高めます。(バレルファイル)

### 1. ルーティングとコンポーネントの分離

| レイヤー           | 配置場所                                 | 責務                                                                 |
| ------------------ | ---------------------------------------- | -------------------------------------------------------------------- |
| **ページ**         | `src/app/<route>/page.tsx`, `layout.tsx` | 「どのコンポーネントを並べるか」のみ。副作用（データ取得）は持たない |
| **コンポーネント** | `src/components/<page-name>/`            | UI、ロジック、データ取得を含む機能実装                               |

- ページは表示とコンポーネントの組み立てに専念
- データの取得（フェッチ）は各機能・コンポーネント配下の `*.logic.ts` や `*.fetch.ts` に配置

### 2. コンポーネントのコロケーション（責務別ファイル配置）

各コンポーネントは独立したフォルダにし、UI・ロジック・fetch・テストを分割します。

**例:**

```
src/components/profile-list/profile-list/
├─ profile-list.tsx                    # プレゼンテーション（UI）
├─ profile-list.container.tsx          # コンテナコンポーネント（状態管理）
├─ profile-list.logic.ts               # ビジネスロジック／ユーティリティ
├─ profile-list.logic.test.ts          # ロジックのユニットテスト
├─ profile-list.logic.integration.test.ts  # ロジックの結合テスト
└─ profile-list.test.tsx               # UIコンポーネントのテスト
```

**コロケーションの利点:**

- 関連ファイルがまとまっているため、変更範囲が分かりやすい
- Agent による自動生成やテスト作成が容易

### 3. Barrel Export と ネームスペースインポート

ページ単位で使うコンポーネント群は `src/components/<page-name>/index.ts` で名前付きエクスポートし、ページ側でネームスペースインポートします。

**Barrel Export（`src/components/profile-list/index.ts`）:**

```typescript
// 📌 Barrel Export: 再エクスポート専用、ロジック記述禁止
export { ProfileList } from "./profile-list/profile-list";
export { ProfileListContainer } from "./profile-list/profile-list.container";
export type { Profile, SortOrder } from "./profile-list/profile-list.logic";
```

**ページ側のインポート（`src/app/sample/page.tsx`）:**

```typescript
// ネームスペースインポートで可読性を確保
import * as Sample from "../../components/profile-list";

export default function SamplePage() {
  return (
    <>
      <Sample.ProfileListContainer />
    </>
  );
}
```

### 4. データフェッチの配置原則

| 項目               | ルール                                                             | 理由                                                        |
| ------------------ | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| **配置場所**       | `src/components/**/*.logic.ts` または `*.fetch.ts`                 | 機能単位で副作用を完結させる                                |
| **ページ側**       | 原則フェッチ禁止（表示・組み立て専念）                             | テストとモックが容易                                        |
| **例外**           | ページレベル集約が必要な場合のみ `page.tsx` に配置可（推奨しない） | 現実的制約への対応                                          |
| **データ受け渡し** | props 経由を優先                                                   | 依存関係の明示化                                            |
| **Server Actions** | **原則禁止** (REST API推奨)                                        | [セキュリティ基準](./ai_instruction_react_security.md) 準拠 |

### 5. 命名とエクスポート方針

| 項目                   | ルール                                                 |
| ---------------------- | ------------------------------------------------------ |
| **エクスポート**       | デフォルトエクスポート禁止、名前付きエクスポートを使用 |
| **フォルダとファイル** | フォルダ名とファイル名は一致させ、パス解決を簡潔に     |
| **ディレクトリ名**     | ケバブケース (例: `components/profile-list`)           |

### 6. テストの分離

| テスト種別         | ファイル名                    | 対象                                   |
| ------------------ | ----------------------------- | -------------------------------------- |
| **UIテスト**       | `*.test.tsx`                  | コンポーネントの表示・インタラクション |
| **ロジックテスト** | `*.logic.test.ts`             | ビジネスロジックのユニットテスト       |
| **結合テスト**     | `*.logic.integration.test.ts` | データ取得を含む結合テスト             |

### 7. 完全な構成例

**ディレクトリ構造:**

```
src/
├── app/
│   └── sample/                    # サンプルページ
│       ├── page.tsx               # ページコンポーネント（副作用は持たず表示に専念）
│       └── page.test.tsx          # ページコンポーネントのテスト
└── components/
    ├── profile-list/              # ページ単位コンポーネント群
    │   ├── index.ts               # Barrel Export（再エクスポート専用）
    │   └── profile-list/          # ProfileList機能単位コンポーネント群
    │       ├── profile-list.tsx                    # プレゼンテーション（UI）
    │       ├── profile-list.container.tsx          # コンテナ（状態管理）
    │       ├── profile-list.logic.ts               # ビジネスロジック
    │       ├── profile-list.logic.test.ts          # ロジックのユニットテスト
    │       ├── profile-list.logic.integration.test.ts  # ロジックの結合テスト
    │       └── profile-list.test.tsx               # UIコンポーネントのテスト
    └── ui/                        # 共通UIコンポーネント（Shadcn/UI）
        ├── avatar.tsx
        └── card.tsx
```

**Barrel Export 厳守** | 各ディレクトリには必ず **`index.ts`** ファイルを設置し、そのレイヤーで公開してよいものだけを export する

### 8. 例外ルール（トライアル版について）

以下のトライアル版機能（お試し用ページ）に関しては、開発効率と既存資産の活用の観点から、オリジナルコンポーネント（正規版の機能）への依存を許可します。

- **対象**: `onboarding-trial`, `home-trial` などのトライアル関連コンポーネント
- **許可事項**: トライアル版コンポーネントから、対応する正規版（オリジナル）のコンポーネントやロジックをインポートして利用すること。
- **理由**: トライアル版は正規版の機能の一部を利用する形態であり、開発効率向上とコード重複排除のため、厳密な疎結合ルールの例外とする。
