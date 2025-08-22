---
applyTo: "*.ts,.tsx"
---


# Next.js App Router：ルーティングとコンポーネントの分離戦略

これは、Next.jsのApp Routerプロジェクトにおいて、ルーティングとコンポーネントを明確に分離して管理するための指示書です。これにより、AIによるコード生成や機能開発をより効率的に行うことを目的とします。

## 目的

  - Next.js App Router環境下で、ページ（ルーティング）とコンポーネントの責任を分離する。
  - AIが特定の機能やコンポーネントに集中してコードを生成しやすくする。
  - コンポーネントの再利用性、保守性、テスト容易性を高める。

-----

## 基本原則

  - **ルーティングの管理**: `src/app/` ディレクトリ配下でページとルーティングを管理します。
  - **コンポーネントの管理**: `src/components/` ディレクトリ配下で全てのUIコンポーネントを管理します。
  - **コンポーネントの集約**: 関連するコンポーネントは `index.ts` ファイルを通じて一元的にエクスポートし、ページコンポーネントからのインポートを簡素化します。
  - **コロケーション**: コンポーネントに関連するロジック、データフェッチ、テストファイルは、そのコンポーネントと同じディレクトリに配置します。
  - **データフェッチの最適化**: データフェッチは原則としてサーバーコンポーネント（`page.tsx` や `layout.tsx`）で行い、結果をプロップスとして子コンポーネントに渡します。必要に応じてServer Actionsも活用します。

-----

## フォルダ構造

以下のフォルダ構造を基本とします。

```bash
src/
├── app/
│   ├── page.tsx          # ルートページ
│   ├── route1/
│   │   └── page.tsx      # ルート1のページ
│   └── route2/
│       └── page.tsx      # ルート2のページ
└── components/
    ├── common/           # 共通コンポーネント
    │   ├── Button/
    │   │   ├── Button.tsx
    │   │   └── Button.test.tsx
    │   └── Input/
    │       ├── Input.tsx
    │       └── Input.test.tsx
    └── route1/           # route1ページ用のコンポーネント群
        ├── ComponentA/       # コンポーネントA
        │   ├── ComponentA.tsx
        │   ├── ComponentA.logic.ts
        │   ├── ComponentA.fetch.ts
        │   ├── ComponentA.dummyData.json
        │   └── ComponentA.test.ts
        ├── ComponentB/       # コンポーネントB
        │   ├── ComponentB.tsx
        │   ├── ComponentB.logic.ts
        │   ├── ComponentB.fetch.ts
        │   ├── ComponentB.dummyData.json
        │   └── ComponentB.test.ts
        ├── ComponentC/       # コンポーネントC
        │   ├── ComponentC.tsx
        │   ├── ComponentC.logic.ts
        │   ├── ComponentC.fetch.ts
        │   ├── ComponentC.dummyData.json
        │   └── ComponentC.test.ts
        └── index.ts          # route1用コンポーネントの集約ファイル
```

-----

## コンポーネントの集約 (`index.ts`)

`src/components/route1/index.ts` のように、特定のページに属するコンポーネントをまとめてエクスポートします。名前付きエクスポートを使用します。

```typescript
// src/components/route1/index.ts
import ComponentA from "./ComponentA/ComponentA";
import ComponentB from "./ComponentB/ComponentB";
import ComponentC from "./ComponentC/ComponentC";

export { ComponentA, ComponentB, ComponentC };
```

-----

## ページコンポーネントでの使用

ページコンポーネント（例: `src/app/route1/page.tsx`）では、パスエイリアス（例: `@/components/route1`）を使用して、集約されたコンポーネントをまとめてインポートします。

```typescript
// src/app/route1/page.tsx
import * as route1 from '@/components/route1'; // パスエイリアスを使用

export default function Route1Page() {
  return (
    <div>
      <h1>Route 1 Page</h1>
      <route1.ComponentA />
      <route1.ComponentB />
      <route1.ComponentC />
    </div>
  );
}
```

-----

## コロケーション

各コンポーネントのディレクトリ内に、そのコンポーネントに関連するロジック、データフェッチ、テストファイルを配置します。

**例: `src/components/route1/ComponentA/`**

  - `ComponentA.tsx`: UIコンポーネント本体
  - `ComponentA.logic.ts`: コンポーネント固有のビジネスロジックや状態管理ロジック
  - `ComponentA.fetch.ts`: コンポーネントが必要とするデータフェッチロジック（ただし、呼び出しはサーバーコンポーネントから行うことを推奨）
  - `ComponentA.test.ts`: コンポーネント、ロジック、フェッチの単体テスト

`ComponentA.tsx` は `ComponentA.logic.ts` や `ComponentA.fetch.ts` をインポートして使用します。

-----

## データフェッチの場所

Next.jsのベストプラクティスに従い、データフェッチは基本的にサーバーコンポーネント（`page.tsx` や `layout.tsx`）で行います。これにより、以下の利点が得られます。

  - **パフォーマンス**: クライアントサイドでのデータフェッチによるウォーターフォールを回避し、ページのロード時間を短縮します。
  - **SEO**: サーバーサイドでデータが取得されるため、検索エンジンがコンテンツをクロールしやすくなります。
  - **シンプルさ**: コンポーネントはデータを受け取ることに専念し、データ取得ロジックから分離されます。

データフェッチの結果は、プロップスとして子コンポーネントに渡します。コンポーネント内でデータフェッチが必要な場合は、Server Actionsの使用を検討し、クライアントコンポーネントでの直接的なデータフェッチは最小限に抑えます。

-----

## AIへの指示の与え方

この構造により、AIに対して以下のような具体的な指示を与えることが可能になります。

  - 「`src/components/route1/ComponentA/` ディレクトリに、ユーザーリストを表示する `ComponentA.tsx` を作成してください。データフェッチは `ComponentA.fetch.ts` に記述し、`ComponentA.logic.ts` でフィルタリングロジックを実装してください。」
  - 「`src/app/route1/page.tsx` が `src/components/route1/index.ts` から `ComponentA`, `ComponentB`, `ComponentC` をインポートし、表示するように修正してください。」
  - 「`src/components/common/Button/Button.tsx` に、クリック時にアニメーションするボタンコンポーネントを実装してください。」
