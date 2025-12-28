/**
 * デジタル庁デザインシステム（DADS）参照用コンポーネント
 *
 * これらのコンポーネントはAIがUI実装時に参照するためのサンプルです。
 * 実際のプロジェクトでは、Shadcn/UI のコンポーネントに
 * DADSのスタイルトークンを適用して使用してください。
 *
 * @see https://design.digital.go.jp/
 * @license MIT - Copyright (c) 2025 デジタル庁
 */

export { Button, buttonBaseStyle, buttonSizeStyle, buttonVariantStyle } from './Button';
export type { ButtonProps, ButtonSize, ButtonVariant } from './Button';

export { Input } from './Input';
export type { InputProps, InputBlockSize } from './Input';

export { Label } from './Label';
export type { LabelProps, LabelSize } from './Label';

export { Select } from './Select';
export type { SelectProps, SelectBlockSize } from './Select';

export { Checkbox } from './Checkbox';
export type { CheckboxProps, CheckboxSize } from './Checkbox';

export { Radio } from './Radio';
export type { RadioProps, RadioSize } from './Radio';

export { ErrorText } from './ErrorText';
export type { ErrorTextProps } from './ErrorText';

export { SupportText } from './SupportText';
export type { SupportTextProps } from './SupportText';

export { Textarea } from './Textarea';
export type { TextareaProps } from './Textarea';
