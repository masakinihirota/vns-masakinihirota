---
name: vns-design-system
description: VNS masakinihirotaアプリケーションの公式デザインガイドライン。高コントラストと可読性の基準を備えたグラスモーフィズム（ライト）とエレガント（ダーク）のテーマを特徴としています。
---

# VNS Design System

このスキルは、VNS masakinihirotaアプリケーションのデザイン基準を概説します。すべてのUI実装は、これらのガイドラインに従わなければなりません。

## 1. 基本原則 (Core Principles)

- **テーマの二面性 (Theme Duality)**:
  - **ライトモード**: "Clean Glassmorphism"（クリーン・グラスモーフィズム） - 柔らかなグラデーション、高い可読性、空気感。
  - **ダークモード**: "Elegant Depth"（エレガント・デプス） - 深い背景、微かな発光、洗練された美学。
- **可読性第一 (Readability First)**:
  - **最小フォントサイズ**: 標準テキストで **18px (`text-lg`)**。
  - **高コントラスト**: テキストは背景に対して明確に際立っていなければなりません（WCAG AA準拠）。
- **セマンティックカラー**: ライトモードの主要テキストには `text-slate-900`/`800` を使用し、コントラストが確認されない限り、純粋な黒や一般的なグレーは使用しないでください。

## 2. タイポグラフィ・ルール (Typography Rules)

### フォントサイズ

- **Base/Body**: `text-lg` (18px) - _すべての段落、ラベル、ヘルパーテキストのデフォルト。_
  - _読みやすさのため、`text-xs`, `text-sm`, `text-base` は使用しないでください。_
- **Headings**:
  - H1: `text-5xl md:text-7xl` (Hero)
  - H2: `text-2xl md:text-3xl`
  - H3: `text-xl md:text-2xl`
  - H4: `text-xl`

### テキストカラー (Light Mode)

- **Primary Text**: `text-slate-900` または `text-foreground`（十分なコントラストがある場合）。
- **Secondary Text**: `text-slate-700` または `text-slate-600`。
- **Muted/Helper**: `text-slate-500` (コントラスト比 > 4.5:1 を確保)。
- **Links/Accents**: `text-indigo-600` または `text-blue-700`。

### テキストカラー (Dark Mode)

- **Primary Text**: `text-white` または `text-foreground`。
- **Secondary Text**: `text-neutral-300` または `text-gray-300`。
- **Muted/Helper**: `text-muted-foreground` または `text-neutral-400`。
- **Accents**: `text-blue-100`, `text-emerald-100`。

## 3. コンポーネントスタイル (Component Styles)

### 背景 (Backgrounds)

- **Light Mode Global**: `bg-gradient-to-br from-blue-50 via-white to-purple-50`
- **Dark Mode Global**: 深いニュートラルまたは黒 (`bg-[#0a0a0a]`) に微かな星雲効果。

### カード & コンテナ (Glassmorphism)

- **Light Mode**:

  ```tsx
  className="bg-white/80 backdrop-blur-lg border border-white/50 shadow-sm ring-1 ring-black/5"
  ```

  _主な特徴: 可読性のための高い不透明度 (80%)、明確な境界線。_

- **Dark Mode**:
  ```tsx
  className="bg-white/5 backdrop-blur-lg border border-white/5 dark:shadow-none dark:ring-white/5"
  ```

### ボタン (Buttons)

#### "Trial / Local Mode" Button (Emerald)

安全性、エントリー、ローカル実行を表します。

```tsx
className="bg-gradient-to-br from-emerald-100/50 to-teal-100/50 text-emerald-900 border border-emerald-500/30 hover:bg-emerald-100/80 hover:border-emerald-500/50 dark:from-emerald-600 dark:to-teal-500 dark:text-white dark:border-emerald-400/50 dark:shadow-[0_0_10px_rgba(16,185,129,0.3)]"
```

#### "Login / Registration" Button (Indigo/Blue)

永続的なデータ、クラウド機能、信頼を表します。

```tsx
className="bg-gradient-to-br from-indigo-600 to-blue-700 dark:from-indigo-500 dark:to-blue-600 text-white hover:opacity-90 hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/40"
```

## 4. 実装チェックリスト (Implementation Checklist)

1.  [ ] **フォントサイズ確認**: `text-xs`, `text-sm`, `text-base` クラスがありませんか？ -> **`text-lg` に昇格してください**。
2.  [ ] **コントラスト確認**: ライトモードのテキストは `slate-600` 以上に暗いですか？
3.  [ ] **グラス効果**: カードは `bg-white/80` (Light) と `backdrop-blur` を使用していますか？
4.  [ ] **スタイルの統合**: ボタンは標準のグラデーションを使用していますか？

## 5. 例 (Examples)

### ヒーローセクションテキスト

```tsx
<p className="text-lg md:text-xl text-slate-600 dark:text-muted-foreground">
  Description text goes here.
</p>
```

### 目的カード (Purpose Card)

```tsx
<div className="bg-white/80 dark:bg-white/5 backdrop-blur-lg border border-white/50 ...">
  <h3 className="text-xl font-bold text-slate-800 dark:text-blue-100">Title</h3>
  <p className="text-lg text-slate-600 dark:text-indigo-200/80">Content</p>
</div>
```
