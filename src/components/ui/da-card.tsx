import * as React from "react";
import { cn } from "@/lib/utils";

// デジタル庁デザインシステム準拠のカードコンポーネント
const DACard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[var(--da-radius-lg)] border border-[var(--da-color-gray-200)] bg-white shadow-[var(--da-shadow-sm)] text-[var(--da-color-gray-900)]",
      "dark:border-[var(--da-color-gray-700)] dark:bg-[var(--da-color-gray-800)] dark:text-white",
      className
    )}
    {...props}
  />
));
DACard.displayName = "DACard";

const DACardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-[var(--da-spacing-lg)] pb-[var(--da-spacing-md)]",
      className
    )}
    {...props}
  />
));
DACardHeader.displayName = "DACardHeader";

const DACardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-semibold leading-none tracking-tight text-[var(--da-font-size-lg)] text-[var(--da-color-gray-900)]",
      "dark:text-white",
      className
    )}
    {...props}
  />
));
DACardTitle.displayName = "DACardTitle";

const DACardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-[var(--da-font-size-sm)] text-[var(--da-color-gray-600)]",
      "dark:text-[var(--da-color-gray-300)]",
      className
    )}
    {...props}
  />
));
DACardDescription.displayName = "DACardDescription";

const DACardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-[var(--da-spacing-lg)] pt-0", className)}
    {...props}
  />
));
DACardContent.displayName = "DACardContent";

const DACardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-[var(--da-spacing-lg)] pt-0",
      className
    )}
    {...props}
  />
));
DACardFooter.displayName = "DACardFooter";

export {
  DACard,
  DACardHeader,
  DACardFooter,
  DACardTitle,
  DACardDescription,
  DACardContent,
};
