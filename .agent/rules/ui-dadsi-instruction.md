---
trigger: always_on
---

# デジタル庁デザインシステム（DADS）UI実装指示書

**要約**: Tailwind標準クラス+DADS原則でWCAG AA適合のアクセシブルUIを実装

## 実装フレームワーク（KERNEL準拠）

```
Input: Reactコンポーネント設計タスク
Task: DADS v2.9.0準拠のアクセシブルUI実装
Constraints:
  - Tailwind CSS v4標準クラスのみ（カスタムCSS変数禁止）
  - aria-disabled必須（disabled属性禁止）
  - WCAG 2.1 AAレベル準拠（コントラスト比4.5:1以上）
  - フォーカスリング統一（ring-yellow-400）
  - デスクトップ優先設計
Output: TSXコンポーネント（型安全、テスト可能）
```

## 適用優先順位（UI指示書の併用ルール）

- 最優先: 本書（DADS実装指示）で定義するアクセシビリティ要件（`aria-disabled`/フォーカスリング/コントラスト/タイポグラフィ）。
- 次点: `ui-principles-instruction.md`（HID 24指針）で定義する行動原則・UXルール。
- 参考: `ui-shadcn-instruction.md` はプロンプト補助であり実装規約ではありません。DADS/HIDに反する場合は必ず本書を優先します。

## 技術スタック

| 項目                 | 仕様                          | 検証方法                                  |
| -------------------- | ----------------------------- | ----------------------------------------- |
| **デザインシステム** | DADS v2.9.0                   | 公式サイト: https://design.digital.go.jp/ |
| **CSS**              | Tailwind CSS v4標準クラスのみ | `className`内にカスタム変数がないこと     |
| **アクセシビリティ** | WCAG 2.1 AAレベル             | axe DevToolsでエラー0件                   |
| **デバイス**         | デスクトップ優先              | lg:ブレイクポイント(1024px)基準           |
| **ライセンス**       | MIT License                   | © 2025 デジタル庁                         |

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

#### ARIA属性の必須化

- **label と id の紐付け**: 全てのフォーム要素は `<label htmlFor="id">` で紐付けること
- **aria-describedby**: エラーメッセージ、ヘルプテキストは `aria-describedby` で関連付けること
- **aria-label**: アイコンのみのボタンや、視覚的ラベルがない要素には `aria-label` を必須とする
- **role 属性**: セマンティックでない要素に意味を持たせる場合は `role` を使用すること（例: `role="article"`, `role="status"`）
- **aria-live**: 動的に変更されるコンテンツには `aria-live="polite"` または `"assertive"` を使用すること

#### スクリーンリーダー専用コンテンツ

- **sr-only の使用**: 視覚的に隠すが、スクリーンリーダーには読み上げる要素には `className="sr-only"` を使用すること
- **用途**: フォームラベル、補足説明、ナビゲーションのスキップリンクなど
- **例**:
  ```tsx
  <label htmlFor="search" className="sr-only">
    検索
  </label>
  <input id="search" type="text" placeholder="検索..." />
  ```

#### React Key Props の命名規則

- **一意で安定した識別子**: 配列のレンダリング時、`key` には一意で安定した識別子を使用すること
  - ✅ Good: ユニークID（`key={profile.id}`）
  - ⚠️ 注意: 複合キー（``key={`${profile.name}-${index}`}``）はユニークIDがない場合のみ
  - ❌ Bad: インデッデスクトップ基準）

| 用途     | Tailwindクラス                     | サイズ | 検証                 |
| -------- | ---------------------------------- | ------ | -------------------- |
| **H1**   | `text-4xl font-bold leading-tight` | 36px   | 見出し階層が正しいか |
| **H2**   | `text-3xl font-bold leading-tight` | 30px   | 〃                   |
| **H3**   | `text-2xl font-bold leading-snug`  | 24px   | 〃                   |
| **本文** | `text-base leading-relaxed`        | 16px   | 行間1.625 (relaxed)  |
| **強調** | `text-base font-semibold`          | 16px   | 太字で視認性確保     |
| **補助** | `text-sm leading-normal`           | 14px   | コントラスト比確認   |

**制約**: `font-sans`（Noto Sans JP）固定、カスタムフォント禁止 | 12px, normal, 行間normal |

**フォントファミリー**: デフォルトで `font-sans`（Noto Sans JP）

### 3. カラーパレット（Tailwind標準クラス）

#### VNS sトークン（検証必須）

| 用途          | クラス                                               | コントラスト比 | 検証ツール               |
| ------------- | ---------------------------------------------------- | -------------- | ------------------------ |
| **Primary**   | `bg-blue-600 text-white`                             | 4.5:1以上      | Chrome DevTools Contrast |
| **Secondary** | `bg-white text-blue-600 border-blue-600`             | 4.5:1以上      | 〃                       |
| **Focus**     | `ring-yellow-400` (統一)                             | —              | Tab操作で視認可能か      |
| **Success**   | `bg-green-50 text-green-700`                         | 4.5:1以上      | 〃                       |
| **Error**     | `bg-red-50 text-red-700 border-red-200`              | 4.5:1以上      | 〃                       |
| **Disabled**  | `bg-gray-100 text-gray-400` + `aria-disabled="true"` | —              | `disabled`属性が無いこと |

**禁止事項**:

- カスタムカラー変数（`var(--brand-primary)`等）の使用
- `text-gray-500 bg-white`のような低コントラスト組み合わせ

すべてのインタラクティブ要素に以下のフォーカススタイルを適用:

```tsx
// ✅ 統一フォーカススタイル
className = "focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-2";
```

**制約**: プロジェクト全体で`ring-yellow-400`固定（他の色禁止）
| **要素間のギャップ** | `gap-4` または `gap-6` | 16px または 24px |
| **ボタン内余白** | `px-6 py-3` または `px-8 py-4` | 横24px縦12px など |

## 実装ルースペーシング＆角丸（デスクトップ基準）

| 要素           | スペーシング | 角丸         | 理由                       |
| -------------- | ------------ | ------------ | -------------------------- |
| **ボタン**     | `px-8 py-3`  | `rounded-md` | タップ領域44px以上確保     |
| **カード**     | `p-6`        | `rounded-lg` | 視覚的グループ化           |
| **入力**       | `px-4 py-3`  | `rounded-md` | フォーカス時のring表示領域 |
| **セクション** | `py-16 px-6` | —            | 情報のヒエラルキー         |
| **要素間**     | `gap-6`      | —            | 8の倍数原則                |

</button>

// テキストボタン（補助的なアクション）
<button
type="button"
className="inline-flex items-center text-base font-semibold text-blue-600 underline-offset-2 transition-colors hover:underline focus:outline-none focus:ring-4 focus:ring-yellow-400"
aria-label="詳細を見る"

> 詳細を見る
> </butパターン（コピペ可能）

### 1. ボタン（検証済み）

```tsx
// ✅ Primary: 主要アクション（1画面1つ推奨）
<button
  type="button"
  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-yellow-400 active:bg-blue-800"
  aria-label="送信"
>
  送信する
</button>

// ✅ Secondary: 補助アクション
<button
  type="button"
  className="inline-flex items-center justify-center rounded-md border-2 border-blue-600 bg-white px-8 py-3 text-base font-semibold text-blue-600 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-yellow-400"
  aria-label="キャンセル"
>
  キャンセル
</button>

// ✅ Disabled: aria-disabled必須（disabled属性禁止）
<button
  type="button"
  aria-disabled="true"
  onClick={(e) => e.preventDefault()} // クリック無効化
  className="inline-flex items-center justify-center rounded-md bg-gray-100 px-8 py-3 text-base font-semibold text-gray-400 cursor-not-allowed"
  aria-describedby="button-disabled-reason"
>
  送信できません
</button>
<p id="button-disabled-reason" className="sr-only">
  必須項目が未入力です
</p>
```

**検証チェックリスト**:

- [ ] `disabled`属性が無いこと
- [ ] フォーカスリングが`ring-yellow-400`であること
- [ ] aria-labelまたは視覚的ラベルがあること type="checkbox"
      classNa（ARIA必須）

```tsx
// ✅ テキスト入力: label/aria-describedby/エラー表示
<div className="flex flex-col gap-2">
  <label htmlFor="email" className="text-sm font-semibold text-gray-900">
    メールアドレス<span className="ml-1 text-red-600" aria-label="必須">*</span>
  </label>
  <input
    id="email"
    name="email"
    type="email"
    required
    aria-required="true"
    aria-describedby="email-help email-error"
    aria-invalid={hasError}
    className="rounded-md border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-blue-600"
  />
  <p id="email-help" className="text-sm text-gray-600">
    確認メールを送信します
  </p>
  {hasError && (
    <p id="email-error" className="text-sm text-red-600" role="alert">
      正しいメールアドレスを入力してください
    </p>
  )}
</div>

// ✅ チェックボックス: クリック領域の最大化
<div className="flex items-start gap-3">
  <input
    id="agree"
    type="checkbox"
    className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:outline-none focus:ring-4 focus:ring-yellow-400"
  />
  <label htmlFor="agree" className="text-base text-gray-900 cursor-pointer">
    <a href="/terms" className="text-blue-600 underline">利用規約</a>に同意する
  </label>
</div>
```

**検証チェックリスト**:

- [ ] `<label htmlFor="id">`で紐付けがあること
- [ ] エラー時に`aria-invalid="true"`が設定されること
- [ ] エラーメッセージに`role="alert"`があること**デスクトップ優先**: PC向けのUIを基準とし、必要に応じてモバイル対応を追加

## クイックリファレンス

### レスポンシブ（デスクトップ→モバイル）

```tsx
// ✅ Good: lg基準、必要な箇所のみmd/sm追加
<div className="px-6 py-16 lg:px-8 lg:py-20">
  <button className="w-full px-8 py-3 md:w-auto">送信</button>
</div>
```

### カスタム変数→Tailwindクラス変換表

```tsx
// ❌ Before (禁止)
className = "bg-(--brand-primary) hover:bg-(--brand-primary-hover)";

// ✅ After (推奨)
className = "bg-blue-600 hover:bg-blue-700";
```

| 旧カスタム変数         | 新Tailwindクラス | 用途     |
| ---------------------- | ---------------- | -------- |
| `var(--brand-primary)` | `blue-600`       | Primary  |
| `var(--brand-light)`   | `blue-50`        | 背景     |
| `var(--accent-yellow)` | `yellow-400`     | Focus    |
| `var(--foreground)`    | `gray-900`       | テキスト |
