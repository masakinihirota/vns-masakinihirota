import { ButtonProperties, InputProperties } from "../user-profile-app.types";

/**
 * 汎用ボタンコンポーネント
 * @param root0
 * @param root0.children
 * @param root0.variant
 * @param root0.size
 * @param root0.className
 */
export const Button = ({
  children,
  variant = "primary",
  size = "default",
  className = "",
  ...properties
}: ButtonProperties) => {
  const baseStyle =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";

  const sizes = {
    default: "h-8 px-3 py-1",
    sm: "h-6 px-2 text-xs",
    icon: "h-6 w-6",
  } as const;

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-sm",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
    ghost:
      "hover:bg-slate-100 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
    outline:
      "border border-slate-200 bg-white hover:bg-slate-100 text-slate-900 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
    destructive:
      "bg-white text-red-500 border border-slate-200 hover:bg-red-50 hover:border-red-200 dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-red-900/20",
  } as const;

  return (
    <button
      className={`${baseStyle} ${sizes[size] || sizes.default} ${variants[variant] || variants.primary} ${className}`}
      {...properties}
    >
      {children}
    </button>
  );
};

/**
 * 汎用インプットコンポーネント
 * @param root0
 * @param root0.className
 */
export const Input = ({ className = "", ...properties }: InputProperties) => (
  <input
    className={`flex h-8 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:border-slate-700 dark:text-slate-200 dark:focus-visible:ring-blue-400 ${className}`}
    {...properties}
  />
);
