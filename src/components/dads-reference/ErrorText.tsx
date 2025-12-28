/**
 * デジタル庁デザインシステム - ErrorText コンポーネント
 * @see https://design.digital.go.jp/
 * @license MIT - Copyright (c) 2025 デジタル庁
 *
 * このファイルはAI参照用のサンプルです。
 */

import type { ComponentProps } from 'react';

export type ErrorTextProps = ComponentProps<'p'>;

/**
 * DADSエラーテキストコンポーネント
 *
 * 特徴:
 * - エラー用の赤色テキスト（text-error-1）
 * - text-dns-16N-130 タイポグラフィ
 * - 必ず id を指定し、関連するフォーム要素の aria-describedby と紐付ける
 *
 * 使用例:
 * ```tsx
 * <Label htmlFor="email">メールアドレス</Label>
 * <Input
 *   id="email"
 *   name="email"
 *   aria-describedby="email-error"
 *   isError={true}
 * />
 * <ErrorText id="email-error">＊正しいメールアドレスを入力してください</ErrorText>
 * ```
 */
export const ErrorText = (props: ErrorTextProps) => {
  const { children, className, ...rest } = props;

  return (
    <p className={`text-dns-16N-130 text-error-1 ${className ?? ''}`} {...rest}>
      {children}
    </p>
  );
};
