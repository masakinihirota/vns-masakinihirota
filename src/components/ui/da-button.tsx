import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// デジタル庁デザインシステム準拠のボタンバリアント
const daButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // プライマリ - デジタル庁ブルー
        primary: "bg-[var(--da-color-primary-600)] text-white hover:bg-[var(--da-color-primary-700)] shadow-[var(--da-shadow-sm)]",
        // セカンダリ - グレー系
        secondary: "bg-[var(--da-color-gray-100)] text-[var(--da-color-gray-900)] hover:bg-[var(--da-color-gray-200)] border border-[var(--da-color-gray-300)]",
        // アウトライン
        outline: "border border-[var(--da-color-primary-600)] text-[var(--da-color-primary-600)] hover:bg-[var(--da-color-primary-50)] hover:text-[var(--da-color-primary-700)]",
        // ゴースト
        ghost: "text-[var(--da-color-gray-700)] hover:bg-[var(--da-color-gray-100)] hover:text-[var(--da-color-gray-900)]",
        // 危険操作
        destructive: "bg-[var(--da-color-error)] text-white hover:bg-red-600 shadow-[var(--da-shadow-sm)]",
        // リンク
        link: "text-[var(--da-color-primary-600)] underline-offset-4 hover:underline hover:text-[var(--da-color-primary-700)]",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-[var(--da-radius-sm)]",
        md: "h-9 px-4 py-2 rounded-[var(--da-radius-md)]",
        lg: "h-10 px-6 rounded-[var(--da-radius-lg)]",
        xl: "h-12 px-8 text-base rounded-[var(--da-radius-lg)]",
        icon: "h-9 w-9 rounded-[var(--da-radius-md)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface DAButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof daButtonVariants> {
  asChild?: boolean;
}

const DAButton = React.forwardRef<HTMLButtonElement, DAButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(daButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
DAButton.displayName = "DAButton";

export { DAButton, daButtonVariants };
