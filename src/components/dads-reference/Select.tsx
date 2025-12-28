/**
 * デジタル庁デザインシステム - Select コンポーネント
 * @see https://design.digital.go.jp/
 * @license MIT - Copyright (c) 2025 デジタル庁
 *
 * このファイルはAI参照用のサンプルです。
 * 実際の使用時は Shadcn/UI の Select コンポーネントに
 * DADSのスタイルトークンを適用してください。
 */

import { type ComponentProps, forwardRef } from 'react';

export type SelectBlockSize = 'lg' | 'md' | 'sm';

export type SelectProps = ComponentProps<'select'> & {
  /** エラー状態かどうか */
  isError?: boolean;
  /** セレクトボックスの高さ */
  blockSize?: SelectBlockSize;
};

/**
 * DADSセレクトボックスコンポーネント
 *
 * 特徴:
 * - ネイティブの select 要素を使用（アクセシビリティ確保）
 * - aria-invalid でエラー状態を表現
 * - aria-disabled で無効状態を表現
 * - カスタムの矢印アイコン（SVG背景画像）
 *
 * 使用例:
 * ```tsx
 * <Label htmlFor="prefecture">都道府県</Label>
 * <SupportText id="prefecture-support">お住まいの都道府県を選択してください</SupportText>
 * <Select
 *   id="prefecture"
 *   name="prefecture"
 *   aria-describedby="prefecture-support"
 * >
 *   <option value="">選択してください</option>
 *   <option value="tokyo">東京都</option>
 *   <option value="osaka">大阪府</option>
 * </Select>
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const { className, isError, blockSize = 'lg', children, ...rest } = props;

  return (
    <select
      className={`
        w-full appearance-none rounded-8 border bg-white px-4 py-3 pr-10 border-solid-gray-600 text-oln-16N-100 text-solid-gray-800
        bg-no-repeat bg-[right_1rem_center]
        bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M12 15.375L6 9.375L7.4 7.975L12 12.575L16.6 7.975L18 9.375L12 15.375Z' fill='%231A1A1C'/%3E%3C/svg%3E")]
        hover:border-black
        data-[size=sm]:h-10 data-[size=md]:h-12 data-[size=lg]:h-14
        aria-[invalid=true]:border-error-1 aria-[invalid=true]:hover:border-red-1000
        focus:outline focus:outline-4 focus:outline-black focus:outline-offset-[calc(2/16*1rem)] focus:ring-[calc(2/16*1rem)] focus:ring-accent-yellow
        aria-disabled:border-solid-gray-300 aria-disabled:bg-solid-gray-50 aria-disabled:text-solid-gray-420 aria-disabled:pointer-events-none aria-disabled:forced-colors:text-[GrayText] aria-disabled:forced-colors:border-[GrayText]
        ${className ?? ''}
      `}
      aria-invalid={isError || undefined}
      data-size={blockSize}
      ref={ref}
      {...rest}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';
