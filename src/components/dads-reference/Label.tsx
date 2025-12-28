/**
 * デジタル庁デザインシステム - Label コンポーネント
 * @see https://design.digital.go.jp/
 * @license MIT - Copyright (c) 2025 デジタル庁
 *
 * このファイルはAI参照用のサンプルです。
 * 実際の使用時は Shadcn/UI の Label コンポーネントに
 * DADSのスタイルトークンを適用してください。
 */

import type { ComponentProps } from 'react';

export type LabelSize = 'lg' | 'md' | 'sm';

export type LabelProps = ComponentProps<'label'> & {
  /** ラベルのフォントサイズ */
  size?: LabelSize;
};

/**
 * DADSラベルコンポーネント
 *
 * 特徴:
 * - サイズに応じたタイポグラフィトークンを使用
 * - sm: text-std-16B-170
 * - md: text-std-17B-170
 * - lg: text-std-18B-160
 *
 * 使用例:
 * ```tsx
 * <Label htmlFor="name" size="md">
 *   お名前<RequirementBadge>※必須</RequirementBadge>
 * </Label>
 * <Input id="name" name="name" />
 * ```
 */
export const Label = (props: LabelProps) => {
  const { children, className, size = 'md', ...rest } = props;

  return (
    <label
      className={`
        text-solid-gray-800
        data-[size=sm]:text-std-16B-170 data-[size=md]:text-std-17B-170 data-[size=lg]:text-std-18B-160
        ${className ?? ''}
      `}
      data-size={size}
      {...rest}
    >
      {children}
    </label>
  );
};
