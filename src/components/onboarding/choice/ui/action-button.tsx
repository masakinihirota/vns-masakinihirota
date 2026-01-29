import React from "react";

type ActionButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
  disabled?: boolean;
};

export const ActionButton = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  disabled = false,
}: ActionButtonProps) => {
  const baseStyle =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
    outline:
      "border border-neutral-300 dark:border-slate-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-slate-800 text-neutral-700 dark:text-slate-100",
    ghost:
      "hover:bg-neutral-100 dark:hover:bg-slate-800 text-neutral-600 dark:text-slate-300 hover:text-neutral-900 dark:hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
