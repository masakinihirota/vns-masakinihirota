---
name: design-system
description: VNS Design System (Glassmorphism/Elegant), UI constraints, and implementation guidelines.
---

# Design System Skill (UI & UX)

このスキルは、プロジェクトのデザインシステム、UI実装ルール、および制約事項を定義します。UIを実装・修正する際は必ず参照してください。

## 1. Design Principles (デザイン原則)

### Visual Style
- **Light Mode**: Glassmorphism (グラスモーフィズム)
    - 明るいグラデーション背景 + 半透明のカード (`bg-white/10 backdrop-blur-md`)
    - 青/紫系のアクセントカラー
- **Dark Mode**: Elegant (エレガント)
    - 深いニュートラル背景 (`#0B0F1A`) + 控えめな暗色ガラス
    - 高いコントラスト比を維持したテキスト (`text-neutral-200`)

### Accessibility (a11y)
- **コントラスト**: 常に 4.5:1 (WCAG AA) 以上を確保する。
- **文字サイズ**: 基本 `16px` 以上、高齢者配慮で `18px` 推奨。
- **色**: 色だけで情報を伝えない（アイコンやテキストを併用）。

## 2. Implementation Rules (実装ルール)

### CSS & Tailwind
- **Tailwind使用**: スタイリングは全て Tailwind CSS のユーティリティクラスで行う。
- **CSS変数**: 色や値はハードコードせず、`globals.css` で定義された CSS変数（`--bg`, `--foreground` 等）を使用する。
    - 例: `bg-[var(--bg)]` ではなく `bg-background` (Tailwind config経由) を推奨。
- **Ad-hoc禁止**: 頻出するスタイルはコンポーネント化するか、共通クラス（`@layer components`）に定義する。

### Component Architecture
- **Shadcn UI**: 基本的なUIパーツ（Button, Input, Card等）は `src/components/ui` にある Shadcn UI コンポーネントを使用する。
- **Lucide React**: アイコンは `lucide-react` を使用する。

## 3. Constraints & Anti-Patterns (制約事項)

### ❌ ユーザーを混乱させるデザイン
- **不明瞭なフィードバック**: アクションに対し、「成功」「失敗」「処理中」のフィードバックがない。
- **専門用語のエラー**: "500 Internal Server Error" など、技術的なエラーをそのまま表示する。
    - ✅ 「サーバーで問題が発生しました。しばらく待ってから再試行してください」と表示する。

### ❌ If aesthetic is bad... (ダサいデザイン禁止)
- **原色使用**: `red`, `blue`, `green` などの原色をそのまま使わない。必ず調整されたパレット（Tailwindの `red-600` や `emerald-500`）を使う。
- **余白不足**: 要素間が詰まりすぎている。`gap-4` や `p-6` など、十分な余白を取る。
- **プレースホルダー不足**: 画像読み込み中やデータ取得中に何も表示しない（スケルトンスクリーンを使うこと）。

## 4. Reference (参考)

- **Web Design Guidelines**: 外部ガイドラインやトレンドを参照する場合は、一般的な「モダンWebデザイン」のベストプラクティス（Apple Human Interface Guidelines, Material Design 3）の概念を取り入れる。
