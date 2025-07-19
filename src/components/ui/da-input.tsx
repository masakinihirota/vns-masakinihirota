import * as React from "react";
import { cn } from "@/lib/utils";

// デジタル庁デザインシステム準拠のインプットコンポーネント
export interface DAInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

const DAInput = React.forwardRef<HTMLInputElement, DAInputProps>(
  ({ className, type, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            // ベーススタイル
            "flex h-9 w-full rounded-[var(--da-radius-md)] border px-3 py-1 text-[var(--da-font-size-sm)] transition-colors",
            "file:border-0 file:bg-transparent file:text-[var(--da-font-size-sm)] file:font-medium",
            "placeholder:text-[var(--da-color-gray-500)]",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--da-color-primary-600)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            // 通常状態
            !error && [
              "border-[var(--da-color-gray-300)] bg-white text-[var(--da-color-gray-900)]",
              "dark:border-[var(--da-color-gray-600)] dark:bg-[var(--da-color-gray-800)] dark:text-white",
            ],
            // エラー状態
            error && [
              "border-[var(--da-color-error)] bg-red-50 text-[var(--da-color-gray-900)]",
              "focus-visible:ring-[var(--da-color-error)]",
              "dark:bg-red-950/20 dark:text-white",
            ],
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p
            className={cn(
              "mt-1 text-[var(--da-font-size-xs)]",
              error
                ? "text-[var(--da-color-error)]"
                : "text-[var(--da-color-gray-600)] dark:text-[var(--da-color-gray-400)]"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
DAInput.displayName = "DAInput";

// ラベルコンポーネント
const DALabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & {
    required?: boolean;
  }
>(({ className, required, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-[var(--da-font-size-sm)] font-medium leading-none text-[var(--da-color-gray-900)]",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      "dark:text-white",
      className
    )}
    {...props}
  >
    {children}
    {required && (
      <span className="ml-1 text-[var(--da-color-error)]" aria-label="必須">
        *
      </span>
    )}
  </label>
));
DALabel.displayName = "DALabel";

// テキストエリアコンポーネント
const DATextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    error?: boolean;
    helperText?: string;
  }
>(({ className, error, helperText, ...props }, ref) => {
  return (
    <div className="w-full">
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-[var(--da-radius-md)] border px-3 py-2 text-[var(--da-font-size-sm)]",
          "placeholder:text-[var(--da-color-gray-500)]",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--da-color-primary-600)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // 通常状態
          !error && [
            "border-[var(--da-color-gray-300)] bg-white text-[var(--da-color-gray-900)]",
            "dark:border-[var(--da-color-gray-600)] dark:bg-[var(--da-color-gray-800)] dark:text-white",
          ],
          // エラー状態
          error && [
            "border-[var(--da-color-error)] bg-red-50 text-[var(--da-color-gray-900)]",
            "focus-visible:ring-[var(--da-color-error)]",
            "dark:bg-red-950/20 dark:text-white",
          ],
          className
        )}
        ref={ref}
        {...props}
      />
      {helperText && (
        <p
          className={cn(
            "mt-1 text-[var(--da-font-size-xs)]",
            error
              ? "text-[var(--da-color-error)]"
              : "text-[var(--da-color-gray-600)] dark:text-[var(--da-color-gray-400)]"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});
DATextarea.displayName = "DATextarea";

export { DAInput, DALabel, DATextarea };
