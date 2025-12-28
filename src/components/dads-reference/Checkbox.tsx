/**
 * デジタル庁デザインシステム - Checkbox コンポーネント
 * @see https://design.digital.go.jp/
 * @license MIT - Copyright (c) 2025 デジタル庁
 *
 * このファイルはAI参照用のサンプルです。
 * 実際の使用時は Shadcn/UI の Checkbox コンポーネントに
 * DADSのスタイルトークンを適用してください。
 */

import { type ComponentProps, forwardRef } from 'react';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export type CheckboxProps = Omit<ComponentProps<'input'>, 'size'> & {
  /** チェックボックスのサイズ */
  size?: CheckboxSize;
  /** エラー状態かどうか */
  isError?: boolean;
};

/**
 * DADSチェックボックスコンポーネント
 *
 * 特徴:
 * - ネイティブの input[type="checkbox"] を使用
 * - aria-disabled で無効状態を表現（disabled 属性は使用しない）
 * - チェック時は青背景 + 白チェックマーク
 * - indeterminate 状態もサポート
 *
 * 使用例:
 * ```tsx
 * <fieldset>
 *   <Legend>興味のある分野<RequirementBadge>※必須</RequirementBadge></Legend>
 *   <SupportText id="interest-support">複数選択可能です</SupportText>
 *   <div className="mt-2 flex flex-col gap-2">
 *     <Checkbox aria-describedby="interest-support" name="interest" value="design">
 *       デザイン
 *     </Checkbox>
 *     <Checkbox aria-describedby="interest-support" name="interest" value="development">
 *       開発
 *     </Checkbox>
 *   </div>
 * </fieldset>
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  const { children, isError, onClick, size = 'sm', ...rest } = props;

  const handleDisabled = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    e.preventDefault();
  };

  const checkbox = (
    <span
      className={`
        flex items-center justify-center shrink-0 rounded-[calc(1/8*100%)]
        data-[size=sm]:size-6 data-[size=md]:size-8 data-[size=lg]:size-11
        has-[input:hover:not(:focus):not([aria-disabled="true"])]:bg-solid-gray-420
      `}
      data-size={size}
    >
      <input
        className={`
          peer appearance-none cursor-pointer rounded-[calc(1/8*100%)] border-2 border-solid-gray-600 bg-white
          before:hidden before:h-[calc(12/16*1rem)] before:w-[calc(6/16*1rem)] before:-translate-y-[calc(2/16*1rem)] before:rotate-45 before:border-b-[calc(3/16*1rem)] before:border-r-[calc(3/16*1rem)] before:border-white
          checked:border-blue-900 checked:bg-blue-900 checked:before:block
          indeterminate:border-blue-900 indeterminate:bg-blue-900 indeterminate:before:block indeterminate:before:h-0 indeterminate:before:w-3 indeterminate:before:translate-y-0 indeterminate:before:rotate-0 indeterminate:before:border-b-[calc(3/16*1rem)] indeterminate:before:border-r-0
          data-[size=sm]:size-6 data-[size=md]:size-8 data-[size=lg]:size-11
          data-[error]:border-error-1 data-[error]:checked:border-error-1 data-[error]:checked:bg-error-1
          focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[calc(2/16*1rem)] focus-visible:ring-[calc(2/16*1rem)] focus-visible:ring-accent-yellow
          aria-disabled:!border-solid-gray-300 aria-disabled:!bg-solid-gray-50 aria-disabled:checked:!bg-solid-gray-300 aria-disabled:indeterminate:!bg-solid-gray-300 aria-disabled:before:border-solid-gray-50
          forced-colors:!border-[ButtonText] forced-colors:checked:!bg-[Highlight] forced-colors:checked:!border-[Highlight] forced-colors:indeterminate:!bg-[Highlight] forced-colors:indeterminate:!border-[Highlight] forced-colors:before:!bg-[HighlightText] forced-colors:aria-disabled:!border-[GrayText] forced-colors:aria-disabled:checked:!bg-[GrayText]
        `}
        onClick={props['aria-disabled'] ? handleDisabled : onClick}
        ref={ref}
        type="checkbox"
        data-size={size}
        data-error={isError || null}
        {...rest}
      />
    </span>
  );

  return children ? (
    <label
      className="flex w-fit items-start py-2 data-[size=sm]:gap-1 data-[size=md]:gap-2 data-[size=lg]:gap-2"
      data-size={size}
    >
      {checkbox}
      <span
        className="text-solid-gray-800 data-[size=sm]:pt-px data-[size=sm]:text-dns-16N-130 data-[size=md]:pt-1 data-[size=md]:text-dns-16N-130 data-[size=lg]:pt-2.5 data-[size=lg]:text-dns-17N-130"
        data-size={size}
      >
        {children}
      </span>
    </label>
  ) : (
    checkbox
  );
});

Checkbox.displayName = 'Checkbox';
