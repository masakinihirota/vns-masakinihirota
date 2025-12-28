/**
 * デジタル庁デザインシステム - Input コンポーネント
 * @see https://design.digital.go.jp/
 * @license MIT - Copyright (c) 2025 デジタル庁
 *
 * このファイルはAI参照用のサンプルです。
 * 実際の使用時は Shadcn/UI の Input コンポーネントに
 * DADSのスタイルトークンを適用してください。
 */

import { type ComponentProps, forwardRef } from 'react';

export type InputBlockSize = 'lg' | 'md' | 'sm';

export type InputProps = ComponentProps<'input'> & {
  /** エラー状態かどうか */
  isError?: boolean;
  /** 入力フィールドの高さ */
  blockSize?: InputBlockSize;
};

/**
 * DADSインプットテキストコンポーネント
 *
 * 特徴:
 * - aria-invalid でエラー状態を表現（赤いボーダー）
 * - aria-disabled で無効状態を表現（グレーアウト、pointer-events-none）
 * - readOnly 時は破線ボーダー
 * - フォーカス時は黄色リング + 黒アウトライン
 *
 * 使用例:
 * ```tsx
 * <Label htmlFor="email">メールアドレス</Label>
 * <Input
 *   id="email"
 *   name="email"
 *   type="email"
 *   aria-describedby="email-error"
 *   isError={hasError}
 * />
 * {hasError && <ErrorText id="email-error">正しいメールアドレスを入力してください</ErrorText>}
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, readOnly, isError, blockSize = 'lg', ...rest } = props;

  return (
    <input
      className={`
        max-w-full rounded-8 border bg-white px-4 py-3 border-solid-gray-600 text-oln-16N-100 text-solid-gray-800
        hover:[&:read-write]:border-black
        data-[size=sm]:h-10 data-[size=md]:h-12 data-[size=lg]:h-14
        aria-[invalid=true]:border-error-1 aria-[invalid=true]:[&:read-write]:hover:border-red-1000
        focus:outline focus:outline-4 focus:outline-black focus:outline-offset-[calc(2/16*1rem)] focus:ring-[calc(2/16*1rem)] focus:ring-accent-yellow
        read-only:border-dashed
        aria-disabled:border-solid-gray-300 aria-disabled:!border-solid aria-disabled:bg-solid-gray-50 aria-disabled:text-solid-gray-420 aria-disabled:pointer-events-none aria-disabled:forced-colors:text-[GrayText] aria-disabled:forced-colors:border-[GrayText]
        ${className ?? ''}
      `}
      aria-invalid={isError || undefined}
      data-size={blockSize}
      readOnly={props['aria-disabled'] ? true : readOnly}
      ref={ref}
      {...rest}
    />
  );
});

Input.displayName = 'Input';
