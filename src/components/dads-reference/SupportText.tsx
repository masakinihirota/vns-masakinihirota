/**
 * デジタル庁デザインシステム - SupportText コンポーネント
 * @see https://design.digital.go.jp/
 * @license MIT - Copyright (c) 2025 デジタル庁
 *
 * このファイルはAI参照用のサンプルです。
 */

import type { ComponentProps } from 'react';

export type SupportTextProps = ComponentProps<'p'>;

/**
 * DADSサポートテキストコンポーネント
 *
 * 特徴:
 * - 補助説明用のグレーテキスト（text-solid-gray-600）
 * - text-std-16N-170 タイポグラフィ
 * - 必ず id を指定し、関連するフォーム要素の aria-describedby と紐付ける
 *
 * 使用例:
 * ```tsx
 * <Label htmlFor="password">パスワード</Label>
 * <SupportText id="password-hint">8文字以上で、英数字を含めてください</SupportText>
 * <Input
 *   id="password"
 *   name="password"
 *   type="password"
 *   aria-describedby="password-hint"
 * />
 * ```
 */
export const SupportText = (props: SupportTextProps) => {
  const { children, className, ...rest } = props;

  return (
    <p className={`text-std-16N-170 text-solid-gray-600 ${className ?? ''}`} {...rest}>
      {children}
    </p>
  );
};
