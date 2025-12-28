/**
 * デジタル庁デザインシステム - Button コンポーネント
 * @see https://design.digital.go.jp/
 * @license MIT - Copyright (c) 2025 デジタル庁
 *
 * このファイルはAI参照用のサンプルです。
 * 実際の使用時は Shadcn/UI の Button コンポーネントに
 * DADSのスタイルトークンを適用してください。
 */

import { type ComponentProps, forwardRef } from 'react';

// Slot コンポーネントは @radix-ui/react-slot から import
// import { Slot } from '@radix-ui/react-slot';

export type ButtonVariant = 'solid-fill' | 'outline' | 'text';
export type ButtonSize = 'lg' | 'md' | 'sm' | 'xs';

/**
 * ボタンの基本スタイル
 * - フォーカス時のアウトライン（黄色リング + 黒アウトライン）
 * - aria-disabled 時のスタイル（グレーアウト、pointer-events-none）
 */
export const buttonBaseStyle = `
  underline-offset-[calc(3/16*1rem)]
  focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[calc(2/16*1rem)] focus-visible:ring-[calc(2/16*1rem)] focus-visible:ring-accent-yellow
  aria-disabled:pointer-events-none aria-disabled:forced-colors:border-[GrayText] aria-disabled:forced-colors:text-[GrayText]
`;

/**
 * ボタンのバリアントスタイル
 * - solid-fill: 塗りボタン（プライマリアクション向け）
 * - outline: アウトラインボタン（セカンダリアクション向け）
 * - text: テキストボタン（補助的なアクション向け）
 */
export const buttonVariantStyle: { [key in ButtonVariant]: string } = {
  'solid-fill': `
    border-4
    border-double
    border-transparent
    bg-blue-900
    text-white
    hover:bg-blue-1000
    hover:underline
    active:bg-blue-1200
    active:underline
    aria-disabled:bg-solid-gray-300
    aria-disabled:text-solid-gray-50
  `,
  outline: `
    border
    border-current
    bg-white
    text-blue-900
    hover:bg-blue-200
    hover:text-blue-1000
    hover:underline
    active:bg-blue-300
    active:text-blue-1200
    active:underline
    aria-disabled:bg-white
    aria-disabled:text-solid-gray-300
  `,
  text: `
    text-blue-900
    underline
    hover:bg-blue-50
    hover:text-blue-1000
    hover:decoration-[calc(3/16*1rem)]
    active:bg-blue-100
    active:text-blue-1200
    focus-visible:bg-yellow-300
    aria-disabled:bg-transparent
    aria-disabled:focus-visible:bg-yellow-300
    aria-disabled:text-solid-gray-300
  `,
};

/**
 * ボタンのサイズスタイル
 * - lg: 大サイズ（主要なアクション）
 * - md: 中サイズ（標準的なアクション）
 * - sm: 小サイズ（コンパクトなUI向け）
 * - xs: 極小サイズ（インラインアクション向け）
 */
export const buttonSizeStyle: { [key in ButtonSize]: string } = {
  lg: 'min-w-[calc(136/16*1rem)] min-h-14 rounded-8 px-4 py-3 text-oln-16B-100',
  md: 'min-w-24 min-h-12 rounded-8 px-4 py-2 text-oln-16B-100',
  sm: 'relative min-w-20 min-h-9 rounded-6 px-3 py-0.5 text-oln-16B-100 after:absolute after:inset-x-0 after:-inset-y-full after:m-auto after:h-[44px]',
  xs: 'relative min-w-18 min-h-7 rounded-4 px-2 py-0.5 text-oln-14B-100 after:absolute after:inset-x-0 after:-inset-y-full after:m-auto after:h-[44px]',
};

export type ButtonProps = {
  className?: string;
  variant?: ButtonVariant;
  size: ButtonSize;
  /**
   * 重要: ボタンの無効化には disabled 属性ではなく aria-disabled を使用する
   * これにより、スクリーンリーダーでも要素にフォーカスでき、
   * なぜ無効なのかを伝えられる
   */
  'aria-disabled'?: boolean;
} & ComponentProps<'button'>;

/**
 * DADSボタンコンポーネント
 *
 * 使用例:
 * ```tsx
 * <Button variant="solid-fill" size="lg">
 *   送信する
 * </Button>
 *
 * // 無効化する場合は aria-disabled を使用
 * <Button variant="outline" size="md" aria-disabled={true}>
 *   無効なボタン
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { children, className, variant = 'solid-fill', size, ...rest } = props;

  const classNames = `${buttonBaseStyle} ${buttonSizeStyle[size]} ${
    variant ? buttonVariantStyle[variant] : ''
  } ${className ?? ''}`;

  // aria-disabled 時はクリックイベントを無効化
  const handleDisabled = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  };

  return (
    <button
      className={classNames}
      onClick={props['aria-disabled'] ? handleDisabled : props.onClick}
      {...rest}
      ref={ref}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
