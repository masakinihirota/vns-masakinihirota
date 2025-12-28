---
applyTo: "src/components/**,src/app/**"
---

# デジタル庁デザインシステム（DADS）UI実装指示書

このプロジェクトでは、**Shadcn/UI（コンポーネント構造）** + **デジタル庁デザインシステム（デザイントークン）** の組み合わせでUIを構築します。

## 適用優先順位（UI指示書の併用ルール）

- 最優先: 本書（DADS実装指示）で定義するデザイントークン・アクセシビリティ要件（`aria-disabled`/フォーカスリング/コントラスト/タイポグラフィ）。
- 次点: `ui-principles-instruction.md`（HID 24指針）で定義する行動原則・UXルール。DADSのスタイルと両立する形で適用してください。
- 参考: `ui-shadcn-instruction.md` はプロンプト補助であり実装規約ではありません。DADS/HIDに反する場合は必ず本書を優先します。

DADSの要件とHID/ Shadcn指示が衝突した場合、DADSで定義したトークン・アクセシビリティ実装を優先し、必要に応じてHID側の表現を調整してください。

## 概要

- **デザインシステム**: デジタル庁デザインシステム（DADS）v2.9.0
- **公式サイト**: https://design.digital.go.jp/
- **ライセンス**: MIT License - Copyright (c) 2025 デジタル庁
- **Storybook**: https://design.digital.go.jp/dads/react/

## 参照リソース

| リソース | パス / URL |
|---------|-----------|
| **コンポーネント実装例** | `src/components/dads-reference/` |
| **Tailwindプラグイン** | `@digital-go-jp/tailwind-theme-plugin` |
| **公式ドキュメント** | https://design.digital.go.jp/ |

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

### 2. タイポグラフィトークン

DADSのタイポグラフィトークンを使用する。形式: `text-{種類}-{サイズ}{ウェイト}-{行間}`

| 用途 | トークン | 説明 |
|------|---------|------|
| 標準テキスト | `text-std-16N-170` | 16px, normal, 行間170% |
| 標準テキスト（太字） | `text-std-16B-170` | 16px, bold, 行間170% |
| 見出し | `text-std-24B-150` | 24px, bold, 行間150% |
| 大見出し | `text-std-32B-150` | 32px, bold, 行間150% |
| 密なテキスト | `text-dns-16N-130` | 16px, normal, 行間130% |
| アウトラインテキスト | `text-oln-16N-100` | 16px, normal, 行間100% |
| アウトラインテキスト（太字） | `text-oln-16B-100` | 16px, bold, 行間100% |

**フォントファミリー**: `font-sans`（Noto Sans JP）

### 3. カラーパレット

#### プロジェクト固有カラー（VNS masakinihirota）

| 用途 | カラーコード | Tailwindトークン | 説明 |
|------|-------------|-----------------|------|
| **メインカラー** | `#007EFE` | `bg-brand-primary`, `text-brand-primary` | オアシスの青（主要アクション、ヘッダー） |
| **メインカラー（ホバー）** | `#0066CC` | `bg-brand-primary-hover` | ホバー状態 |
| **メインカラー（アクティブ）** | `#004C99` | `bg-brand-primary-active` | アクティブ状態 |
| **サブカラー1** | `#E6F4FB` | `bg-brand-light` | 淡い水色（セクション背景） |
| **サブカラー2** | `#FFFFFF` | `bg-white` | 白（カード背景、メイン背景） |
| **サブカラー3** | `#F5FAFD` | `bg-brand-subtle` | 青みがかった白（交互の背景） |
| **アクセント（黄）** | `#FFD600` | `bg-accent-yellow`, `ring-accent-yellow` | 黄色（フォーカスリング、注目ポイント） |
| **アクセント（緑）** | `#00C48C` | `bg-accent-green`, `text-accent-green` | グリーン（成功状態、ポジティブ） |

#### プロジェクトカラー使用ガイドライン

| シーン | 推奨クラス |
|--------|----------|
| **プライマリボタン** | `bg-brand-primary text-white hover:bg-brand-primary-hover active:bg-brand-primary-active` |
| **フォーカスリング** | `ring-accent-yellow`（プロジェクト統一） |
| **ページ背景** | `bg-white` または `bg-brand-subtle` |
| **カード背景** | `bg-white` |
| **セクション区切り** | `bg-brand-light` |
| **成功メッセージ** | `bg-accent-green text-white` |
| **リンク** | `text-brand-primary hover:underline` |

#### DADSカラートークン（システム共通）

| 用途 | トークン | 説明 |
|------|---------|------|
| **プライマリ** | `bg-blue-900`, `text-blue-900` | メインアクション、リンク |
| **プライマリホバー** | `bg-blue-1000`, `text-blue-1000` | ホバー状態 |
| **プライマリアクティブ** | `bg-blue-1200`, `text-blue-1200` | アクティブ状態 |
| **エラー** | `bg-error-1`, `text-error-1` | エラー状態 |
| **エラーホバー** | `bg-red-1000`, `text-red-1000` | エラーホバー |
| **成功** | `bg-success-1`, `text-success-1` | 成功状態 |
| **成功ホバー** | `bg-green-1000`, `text-green-1000` | 成功ホバー |
| **グレー（テキスト）** | `text-solid-gray-800` | 本文テキスト |
| **グレー（補助）** | `text-solid-gray-600` | サポートテキスト |
| **グレー（無効）** | `text-solid-gray-420` | 無効状態テキスト |
| **グレー（背景）** | `bg-solid-gray-50` | 無効状態背景 |
| **ボーダー** | `border-solid-gray-600` | 標準ボーダー |
| **フォーカス** | `ring-accent-yellow`, `outline-black` | フォーカスリング（プロジェクト統一） |

### 4. フォーカススタイル

すべてのインタラクティブ要素に以下のフォーカススタイルを適用:

```css
focus-visible:outline focus-visible:outline-4 focus-visible:outline-black
focus-visible:outline-offset-[calc(2/16*1rem)]
focus-visible:ring-[calc(2/16*1rem)] focus-visible:ring-accent-yellow
```

> **統一ルール**: DADSの `ring-yellow-300` の代わりに、プロジェクト統一カラー `ring-accent-yellow` (#FFD600) を使用します。

### 5. 角丸（Border Radius）

| サイズ | トークン | 用途 |
|--------|---------|------|
| 4px | `rounded-4` | 極小要素 |
| 6px | `rounded-6` | 小さいボタン |
| 8px | `rounded-8` | 標準的なボタン、入力フィールド |
| 12px | `rounded-12` | 大きな要素 |
| 16px | `rounded-16` | カード、バナー |

## 実装ルール

### Shadcn/UIコンポーネントのスタイル上書き

既存のShadcn/UIコンポーネントを使用する際、クラス名をDADSトークンで上書きする:

```tsx
// 例: Shadcn/UIのButtonをプロジェクトスタイルで上書き
import { Button } from '@/components/ui/button';

<Button
  className="bg-brand-primary text-white text-oln-16B-100 rounded-8 min-h-14 px-4 py-3
             hover:bg-brand-primary-hover hover:underline
             active:bg-brand-primary-active
             focus-visible:outline focus-visible:outline-4 focus-visible:outline-black
             focus-visible:outline-offset-[calc(2/16*1rem)]
             focus-visible:ring-[calc(2/16*1rem)] focus-visible:ring-accent-yellow"
>
  送信する
</Button>
```

### 新規コンポーネント作成時

1. まず `src/components/dads-reference/` の実装例を確認
2. アクセシビリティ属性（aria-*）を必ず含める
3. DADSのデザイントークンを使用
4. フォーカススタイルを必ず実装

### フォーム要素の実装パターン

```tsx
import { Label, SupportText, ErrorText, Input } from '@/components/dads-reference';

// フォームフィールドの基本構成
const FormField = () => {
  const formId = React.useId();
  const supportTextId = React.useId();
  const errorTextId = React.useId();
  const hasError = true; // バリデーション状態

  // エラー時は errorTextId を先に、supportTextId を後に
  const describedBy = hasError
    ? `${errorTextId} ${supportTextId}`
    : supportTextId;

  return (
    <div className="flex flex-col items-start gap-2">
      <Label htmlFor={formId}>
        メールアドレス
        <RequirementBadge>※必須</RequirementBadge>
      </Label>
      <SupportText id={supportTextId}>
        確認メールを送信します
      </SupportText>
      <Input
        id={formId}
        name="email"
        type="email"
        aria-describedby={describedBy}
        isError={hasError}
      />
      {hasError && (
        <ErrorText id={errorTextId}>
          ＊正しいメールアドレスを入力してください
        </ErrorText>
      )}
    </div>
  );
};
```

### ボタンのバリエーション

```tsx
// 塗りボタン（プライマリアクション）
<Button variant="solid-fill" size="lg">送信する</Button>

// アウトラインボタン（セカンダリアクション）
<Button variant="outline" size="md">キャンセル</Button>

// テキストボタン（補助的なアクション）
<Button variant="text" size="sm">詳細を見る</Button>

// 無効化されたボタン
<Button variant="solid-fill" size="lg" aria-disabled={true}>
  送信できません
</Button>
```

## 参照ファイル一覧

| コンポーネント | 参照パス | 用途 |
|---------------|---------|------|
| Button | `src/components/dads-reference/Button.tsx` | ボタン（3種類のバリアント） |
| Input | `src/components/dads-reference/Input.tsx` | テキスト入力 |
| Label | `src/components/dads-reference/Label.tsx` | フォームラベル |
| Select | `src/components/dads-reference/Select.tsx` | セレクトボックス |
| Checkbox | `src/components/dads-reference/Checkbox.tsx` | チェックボックス |
| Radio | `src/components/dads-reference/Radio.tsx` | ラジオボタン |
| ErrorText | `src/components/dads-reference/ErrorText.tsx` | エラーメッセージ |
| SupportText | `src/components/dads-reference/SupportText.tsx` | サポートテキスト |
| Textarea | `src/components/dads-reference/Textarea.tsx` | テキストエリア |

## 重要な注意事項

1. **`disabled` は使わない**: すべてのフォーム要素で `aria-disabled` を使用する
2. **id と aria-describedby の紐付け**: エラーメッセージ、サポートテキストは必ず id を持ち、入力要素と紐付ける
3. **フォーカス表示**: キーボード操作時のフォーカス表示を必ず実装する
4. **コントラスト**: テキストと背景のコントラスト比 4.5:1 以上を確保する
5. **日本語フォント**: Noto Sans JP を使用する（`font-sans`）

## ブレークポイント

| 名前 | サイズ | 用途 |
|------|--------|------|
| default | - | モバイル |
| `desktop:` | 48em (768px) | デスクトップ |
| `desktop-admin:` | 62em (992px) | 管理画面 |

```tsx
// レスポンシブの例
<div className="px-4 desktop:px-8">
  <Button size="md" className="desktop:size-lg">
    送信
  </Button>
</div>
```
