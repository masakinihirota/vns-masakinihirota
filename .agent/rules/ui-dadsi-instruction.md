---
trigger: always_on
---

# デジタル庁デザインシステム（DADS）UI実装指示書

このプロジェクトでは、**Tailwind CSS標準クラス** + **デジタル庁デザインシステム（デザイン原則）** の組み合わせでUIを構築します。

## 適用優先順位（UI指示書の併用ルール）

- 最優先: 本書（DADS実装指示）で定義するアクセシビリティ要件（`aria-disabled`/フォーカスリング/コントラスト/タイポグラフィ）。
- 次点: `ui-principles-instruction.md`（HID 24指針）で定義する行動原則・UXルール。
- 参考: `ui-shadcn-instruction.md` はプロンプト補助であり実装規約ではありません。DADS/HIDに反する場合は必ず本書を優先します。

## 概要

- **デザインシステム**: デジタル庁デザインシステム（DADS）v2.9.0準拠
- **スタイリング**: Tailwind CSS v4（標準クラスのみ使用）
- **デバイス**: デスクトップPC優先（レスポンシブ対応）
- **公式サイト**: https://design.digital.go.jp/
- **ライセンス**: MIT License - Copyright (c) 2025 デジタル庁

## デザイン原則

### 1. アクセシビリティファースト

- **WCAG 2.1 AA準拠**を必須とする
- **`disabled` 属性は使用しない** → 代わりに `aria-disabled="true"` を使用
  - 理由: スクリーンリーダーでも要素にフォーカスでき、なぜ無効なのかを伝えられる
- コントラスト比 **4.5:1 以上**を厳守
- フォーム要素には必ず **`aria-describedby`** でエラーメッセージやサポートテキストを関連付ける

```tsx
// ❌ Bad: disabled 属性を使用
<button disabled>送信できません</button>

// ✅ Good: aria-disabled を使用
<button aria-disabled="true">送信できません</button>
```

### 2. タイポグラフィ（Tailwind標準クラス）

デスクトップPC向けの標準的なタイポグラフィ設定:

| 用途               | Tailwindクラス                           | 説明                       |
| ------------------ | ---------------------------------------- | -------------------------- |
| **大見出し**       | `text-4xl font-bold leading-tight`       | 36px, bold, 行間tight      |
| **中見出し**       | `text-3xl font-bold leading-tight`       | 30px, bold, 行間tight      |
| **小見出し**       | `text-2xl font-bold leading-snug`        | 24px, bold, 行間snug       |
| **セクション見出** | `text-xl font-bold leading-snug`         | 20px, bold, 行間snug       |
| **標準テキスト**   | `text-base leading-relaxed`              | 16px, normal, 行間relaxed  |
| **太字テキスト**   | `text-base font-semibold leading-normal` | 16px, semibold, 行間normal |
| **小テキスト**     | `text-sm leading-normal`                 | 14px, normal, 行間normal   |
| **極小テキスト**   | `text-xs leading-normal`                 | 12px, normal, 行間normal   |

**フォントファミリー**: デフォルトで `font-sans`（Noto Sans JP）

### 3. カラーパレット（Tailwind標準クラス）

#### VNS masakinihirota プロジェクトカラーマッピング

| 用途                 | 元の色コード | Tailwind標準クラス                             | 説明                           |
| -------------------- | ------------ | ---------------------------------------------- | ------------------------------ |
| **メインカラー**     | `#007EFE`    | `bg-blue-600`, `text-blue-600`                 | 主要アクション、ヘッダー       |
| **メインホバー**     | `#0066CC`    | `hover:bg-blue-700`                            | ホバー状態                     |
| **メインアクティブ** | `#004C99`    | `active:bg-blue-800`                           | アクティブ状態                 |
| **サブカラー（淡）** | `#E6F4FB`    | `bg-blue-50`                                   | セクション背景                 |
| **サブカラー（白）** | `#FFFFFF`    | `bg-white`                                     | カード背景、メイン背景         |
| **アクセント（黄）** | `#FFD600`    | `ring-yellow-400`, `bg-yellow-400`             | フォーカスリング、注目ポイント |
| **アクセント（緑）** | `#00C48C`    | `bg-green-500`, `text-green-600`               | 成功状態、ポジティブ           |
| **テキスト（標準）** | `#171717`    | `text-gray-900`                                | 本文テキスト                   |
| **テキスト（補助）** | —            | `text-gray-600`                                | サポートテキスト               |
| **ボーダー**         | —            | `border-gray-200`, `border-gray-300`           | カード、入力フィールド         |
| **エラー**           | `#C9252D`    | `bg-red-600`, `text-red-600`, `border-red-600` | エラー状態                     |

#### 使用ガイドライン

| シーン               | 推奨Tailwindクラス                                                        |
| -------------------- | ------------------------------------------------------------------------- |
| **プライマリボタン** | `bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800`             |
| **セカンダリボタン** | `bg-white text-blue-600 border border-blue-600 hover:bg-blue-50`          |
| **フォーカスリング** | `focus:outline-none focus:ring-4 focus:ring-yellow-400`                   |
| **ページ背景**       | `bg-white` または `bg-gray-50`                                            |
| **カード背景**       | `bg-white border border-gray-200`                                         |
| **セクション背景**   | `bg-blue-50`                                                              |
| **成功メッセージ**   | `bg-green-50 text-green-700 border border-green-200`                      |
| **エラーメッセージ** | `bg-red-50 text-red-700 border border-red-200`                            |
| **リンク**           | `text-blue-600 hover:underline`                                           |
| **無効状態**         | `bg-gray-100 text-gray-400 cursor-not-allowed` (+ `aria-disabled="true"`) |

### 4. フォーカススタイル（統一ルール）

すべてのインタラクティブ要素に以下のフォーカススタイルを適用:

```tsx
className = "focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-2";
```

**統一ルール**: プロジェクト全体で `ring-yellow-400` をフォーカスリングに使用します。

### 5. 角丸（Border Radius）

| サイズ     | Tailwindクラス | 用途                           |
| ---------- | -------------- | ------------------------------ |
| 4px (sm)   | `rounded-sm`   | 極小要素                       |
| 8px (md)   | `rounded-md`   | 標準的なボタン、入力フィールド |
| 12px (lg)  | `rounded-lg`   | 大きな要素                     |
| 16px (xl)  | `rounded-xl`   | カード、バナー                 |
| 24px (2xl) | `rounded-2xl`  | モーダル、大きなカード         |

### 6. スペーシング（余白）

デスクトップPC向けの標準スペーシング:

| 用途                 | Tailwindクラス                 | 説明              |
| -------------------- | ------------------------------ | ----------------- |
| **セクション間隔**   | `py-16` または `py-20`         | 64px または 80px  |
| **コンテナ左右余白** | `px-6` または `px-8`           | 24px または 32px  |
| **カード内余白**     | `p-6` または `p-8`             | 24px または 32px  |
| **要素間のギャップ** | `gap-4` または `gap-6`         | 16px または 24px  |
| **ボタン内余白**     | `px-6 py-3` または `px-8 py-4` | 横24px縦12px など |

## 実装ルール

### 1. ボタンのバリエーション

```tsx
// プライマリボタン（主要アクション）
<button
  type="button"
  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-yellow-400 active:bg-blue-800"
  aria-label="送信"
>
  送信する
</button>

// セカンダリボタン（補助アクション）
<button
  type="button"
  className="inline-flex items-center justify-center rounded-md border-2 border-blue-600 bg-white px-8 py-3 text-base font-semibold text-blue-600 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-yellow-400"
  aria-label="キャンセル"
>
  キャンセル
</button>

// テキストボタン（補助的なアクション）
<button
  type="button"
  className="inline-flex items-center text-base font-semibold text-blue-600 underline-offset-2 transition-colors hover:underline focus:outline-none focus:ring-4 focus:ring-yellow-400"
  aria-label="詳細を見る"
>
  詳細を見る
</button>

// 無効化されたボタン（aria-disabled使用）
<button
  type="button"
  aria-disabled="true"
  className="inline-flex items-center justify-center rounded-md bg-gray-100 px-8 py-3 text-base font-semibold text-gray-400 cursor-not-allowed"
>
  送信できません
</button>
```

### 2. フォーム要素の実装パターン

```tsx
// テキスト入力
<div className="flex flex-col gap-2">
  <label htmlFor="email" className="text-sm font-semibold text-gray-900">
    メールアドレス
    <span className="ml-1 text-red-600">※必須</span>
  </label>
  <p id="email-support" className="text-sm text-gray-600">
    確認メールを送信します
  </p>
  <input
    id="email"
    name="email"
    type="email"
    aria-describedby="email-support email-error"
    className="rounded-md border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-blue-600"
  />
  <p id="email-error" className="text-sm text-red-600">
    ＊正しいメールアドレスを入力してください
  </p>
</div>

// チェックボックス
<div className="flex items-center gap-3">
  <input
    id="agree"
    type="checkbox"
    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:outline-none focus:ring-4 focus:ring-yellow-400"
  />
  <label htmlFor="agree" className="text-base text-gray-900">
    利用規約に同意する
  </label>
</div>
```

### 3. カードコンポーネント

```tsx
<article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
  <h3 className="text-xl font-bold text-gray-900">カードタイトル</h3>
  <p className="mt-3 text-base leading-relaxed text-gray-600">カードの説明文がここに入ります。</p>
</article>
```

### 4. レスポンシブデザイン（デスクトップ優先）

```tsx
// デスクトップを基準に、必要に応じてモバイル対応
<div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
  <h1 className="text-3xl font-bold leading-tight lg:text-4xl xl:text-5xl">見出し</h1>
  <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{/* カードコンポーネント */}</div>
</div>
```

## 重要な注意事項

1. **カスタムCSS変数は使用しない**: すべてTailwind標準クラスで実装する
2. **`disabled` は使わない**: すべてのフォーム要素で `aria-disabled` を使用する
3. **id と aria-describedby の紐付け**: エラーメッセージ、サポートテキストは必ず id を持ち、入力要素と紐付ける
4. **フォーカス表示**: キーボード操作時のフォーカス表示（`ring-yellow-400`）を必ず実装する
5. **コントラスト**: テキストと背景のコントラスト比 4.5:1 以上を確保する（`text-gray-900` on `bg-white` など）
6. **日本語フォント**: Noto Sans JP を使用する（`font-sans` がデフォルト適用）
7. **デスクトップ優先**: PC向けのUIを基準とし、必要に応じてモバイル対応を追加

## ブレークポイント

| 名前 | サイズ | Tailwindプレフィックス | 用途               |
| ---- | ------ | ---------------------- | ------------------ |
| sm   | 640px  | `sm:`                  | スマートフォン     |
| md   | 768px  | `md:`                  | タブレット         |
| lg   | 1024px | `lg:`                  | デスクトップ       |
| xl   | 1280px | `xl:`                  | 大型デスクトップ   |
| 2xl  | 1536px | `2xl:`                 | 超大型デスクトップ |

```tsx
// レスポンシブの例（デスクトップ優先）
<div className="px-6 lg:px-8">
  <button className="px-6 py-3 text-base lg:px-8 lg:py-4 lg:text-lg">送信</button>
</div>
```

## カラー置き換えリファレンス

以下のカスタム変数をTailwind標準クラスに置き換える際の対応表:

| カスタム変数                              | Tailwind標準クラス      |
| ----------------------------------------- | ----------------------- |
| `bg-[var(--brand-primary)]`               | `bg-blue-600`           |
| `text-[var(--brand-primary)]`             | `text-blue-600`         |
| `hover:bg-[var(--brand-primary-hover)]`   | `hover:bg-blue-700`     |
| `active:bg-[var(--brand-primary-active)]` | `active:bg-blue-800`    |
| `bg-[var(--brand-light)]`                 | `bg-blue-50`            |
| `bg-[var(--brand-subtle)]`                | `bg-blue-50`            |
| `text-[var(--foreground)]`                | `text-gray-900`         |
| `focus:ring-[var(--accent-yellow)]`       | `focus:ring-yellow-400` |
| `hover:bg-[var(--brand-light)]`           | `hover:bg-blue-50`      |
| `bg-[var(--accent-green)]`                | `bg-green-500`          |
| `text-[var(--accent-green)]`              | `text-green-600`        |
| `border-[var(--brand-primary)]`           | `border-blue-600`       |
