/**
 * デジタル庁デザインシステム - Radio コンポーネント
 * @see https://design.digital.go.jp/
 * @license MIT - Copyright (c) 2025 デジタル庁
 *
 * このファイルはAI参照用のサンプルです。
 * 実際の使用時は Shadcn/UI の RadioGroup コンポーネントに
 * DADSのスタイルトークンを適用してください。
 */

import { type ComponentProps, forwardRef } from 'react';

export type RadioSize = 'sm' | 'md' | 'lg';

export type RadioProps = Omit<ComponentProps<'input'>, 'size'> & {
  /** ラジオボタンのサイズ */
  size?: RadioSize;
  /** エラー状態かどうか */
  isError?: boolean;
};

/**
 * DADSラジオボタンコンポーネント
 *
 * 特徴:
 * - ネイティブの input[type="radio"] を使用
 * - aria-disabled で無効状態を表現（disabled 属性は使用しない）
 * - 選択時は青いドット表示
 *
 * 使用例:
 * ```tsx
 * <fieldset>
 *   <Legend>性別<RequirementBadge>※必須</RequirementBadge></Legend>
 *   <SupportText id="gender-support">いずれかを選択してください</SupportText>
 *   <div className="mt-1 flex flex-col">
 *     <Radio aria-describedby="gender-support" name="gender" value="male">
 *       男性
 *     </Radio>
 *     <Radio aria-describedby="gender-support" name="gender" value="female">
 *       女性
 *     </Radio>
 *     <Radio aria-describedby="gender-support" name="gender" value="other">
 *       その他
 *     </Radio>
 *   </div>
 * </fieldset>
 * ```
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
  const { children, isError, onClick, size = 'sm', ...rest } = props;

  const handleDisabled = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    e.preventDefault();
  };

  const radio = (
    <span
      className={`
        flex items-center justify-center shrink-0 rounded-full
        data-[size=sm]:size-6 data-[size=md]:size-8 data-[size=lg]:size-11
        has-[input:hover:not(:focus):not([aria-disabled="true"])]:bg-solid-gray-420
      `}
      data-size={size}
    >
      <input
        className={`
          peer appearance-none cursor-pointer rounded-full border-2 border-solid-gray-600 bg-white
          before:hidden before:rounded-full before:bg-blue-900
          checked:border-blue-900 checked:before:block
          data-[size=sm]:size-6 data-[size=sm]:before:size-3
          data-[size=md]:size-8 data-[size=md]:before:size-4
          data-[size=lg]:size-11 data-[size=lg]:before:size-[calc(22/16*1rem)]
          data-[error]:border-error-1 data-[error]:checked:border-error-1 data-[error]:checked:before:bg-error-1
          focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[calc(2/16*1rem)] focus-visible:ring-[calc(2/16*1rem)] focus-visible:ring-accent-yellow
          aria-disabled:!border-solid-gray-300 aria-disabled:!bg-solid-gray-50 aria-disabled:checked:before:!bg-solid-gray-300
          forced-colors:!border-[ButtonText] forced-colors:checked:!border-[Highlight] forced-colors:checked:before:!bg-[Highlight] forced-colors:aria-disabled:!border-[GrayText] forced-colors:aria-disabled:checked:before:!bg-[GrayText]
        `}
        ref={ref}
        type="radio"
        onClick={props['aria-disabled'] ? handleDisabled : onClick}
        data-size={size}
        data-error={isError || null}
        {...rest}
      />
    </span>
  );

  return children ? (
    <label
      className="flex w-fit items-start py-2 data-[size=sm]:gap-1 data-[size=md]:gap-2 data-[size=lg]:gap-3"
      data-size={size}
    >
      {radio}
      <span
        className="text-solid-gray-800 data-[size=sm]:pt-px data-[size=sm]:text-dns-16N-130 data-[size=md]:pt-1 data-[size=md]:text-dns-16N-130 data-[size=lg]:pt-2.5 data-[size=lg]:text-dns-17N-130"
        data-size={size}
      >
        {children}
      </span>
    </label>
  ) : (
    radio
  );
});

Radio.displayName = 'Radio';
