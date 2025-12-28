/**
 * デジタル庁デザインシステム - Textarea コンポーネント
 * @see https://design.digital.go.jp/
 * @license MIT - Copyright (c) 2025 デジタル庁
 *
 * このファイルはAI参照用のサンプルです。
 * 実際の使用時は Shadcn/UI の Textarea コンポーネントに
 * DADSのスタイルトークンを適用してください。
 */

import { type ComponentProps, forwardRef } from 'react';

export type TextareaProps = ComponentProps<'textarea'> & {
  /** エラー状態かどうか */
  isError?: boolean;
};

/**
 * DADSテキストエリアコンポーネント
 *
 * 特徴:
 * - aria-invalid でエラー状態を表現
 * - aria-disabled で無効状態を表現
 * - readOnly 時は破線ボーダー
 * - field-sizing: content で内容に応じた高さ調整が可能
 *
 * 使用例:
 * ```tsx
 * <Label htmlFor="comment">コメント</Label>
 * <SupportText id="comment-hint">500文字以内で入力してください</SupportText>
 * <Textarea
 *   id="comment"
 *   name="comment"
 *   aria-describedby="comment-hint"
 *   rows={4}
 * />
 * ```
 *
 * field-sizing を使用した例:
 * ```tsx
 * <Textarea
 *   className="[field-sizing:content] min-h-[calc(3lh+2rem+2px)] max-h-[calc(10lh+2rem+2px)]"
 *   name="auto-resize"
 * />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  const { className, isError, readOnly, ...rest } = props;

  return (
    <textarea
      className={`
        max-w-full rounded-8 border bg-white p-4 border-solid-gray-600 text-std-16N-170 text-solid-gray-800
        hover:[&:read-write]:border-black
        aria-[invalid=true]:border-error-1 aria-[invalid=true]:[&:read-write]:hover:border-red-1000
        focus:outline focus:outline-4 focus:outline-black focus:outline-offset-[calc(2/16*1rem)] focus:ring-[calc(2/16*1rem)] focus:ring-accent-yellow
        read-only:border-dashed
        aria-disabled:border-solid-gray-300 read-only:aria-disabled:border-solid aria-disabled:bg-solid-gray-50 aria-disabled:text-solid-gray-420 aria-disabled:pointer-events-none aria-disabled:forced-colors:text-[GrayText] aria-disabled:forced-colors:border-[GrayText]
        ${className ?? ''}
      `}
      aria-invalid={isError || undefined}
      readOnly={props['aria-disabled'] ? true : readOnly}
      ref={ref}
      {...rest}
    />
  );
});

Textarea.displayName = 'Textarea';
