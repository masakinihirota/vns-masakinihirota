---
trigger: always_on
---

# Accessibility Guidelines

すべてのユーザー（高齢者、色覚多様性を含む）に配慮したアクセシビリティ標準です。

## 1. Automated Testing (自動テスト)

UIコンポーネントのテストには、必ず `vitest-axe` を導入してください。

- **原則**: 全てのUIコンポーネント（Button, Modal, Page等）に対し、`toHaveNoViolations` のチェックを行う。
- **実装例**:

  ```typescript
  import { render } from '@testing-library/react';
  import { axe } from 'vitest-axe';
  import { ComponentName } from './component-name';

  describe('ComponentName Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<ComponentName />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
  ```

- **注意**: ラベル不足などのエラーは、`aria-hidden` で逃げず、適切なマークアップやProps修正で解決すること。

## 2. Color Universal Design (CUD・配色)

- **情報の二重化**: 色だけで情報を伝えない。色＋形（アイコン）・テキストを併用する（例: エラーは赤枠＋⚠️アイコン）。
- **高齢者配慮 (黄変)**: 青は明るめ（SkyBlue）、黄色はオレンジ寄りに調整し、黒背景の青文字などは避ける。
- **禁止組み合わせ**: 識別しにくい色の隣接を避ける（赤と緑、緑と茶色、青と紫）。
- **コントラスト**: 文字と背景のコントラスト比は **4.5:1 以上 (WCAG AA)** を確保する。

### 推奨パレット (Tailwind)

- **Error**: `red-600` or `orange-700` (朱色寄り)
- **Success**: `teal-600` or `emerald-600` (青み寄り)
- **Text**: `neutral-800` (完全な黒より目に優しい)

## 3. Typography (文字サイズ・可読性)

高齢者を含む幅広いユーザーの「読みやすさ」を優先します。

- **基本サイズ**: **18px (1.125rem)** を基準とする（従来の16pxより大きめ）。
  - 注釈でも14px以上を確保。
- **単位**: 必ず `rem` を使用する（ブラウザ設定の尊重）。
- **行間 (Line Height)**: `1.5` 〜 `1.8` (`leading-relaxed`) を確保し、詰まりすぎを防ぐ。
- **ボタンサイズ**: クリックエリアは最低 **44x44px** 以上を確保する。
- **フォント**: 極端に細いフォントは避け、`font-normal` (400) または `font-medium` (500) を使用する。
