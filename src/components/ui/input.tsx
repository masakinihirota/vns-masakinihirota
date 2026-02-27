import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-solid-gray-600 h-14 w-full min-w-0 rounded-8 border bg-white px-4 py-3 text-oln-16N-100 text-solid-gray-800 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:border-solid-gray-300 aria-disabled:bg-solid-gray-50 aria-disabled:text-solid-gray-420 md:text-sm",
        "focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[calc(2/16*1rem)] focus-visible:ring-[calc(2/16*1rem)] focus-visible:ring-accent-yellow",
        "aria-invalid:border-error-1 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        "hover:[&:read-write:not([aria-disabled=true])]:border-black",
        "read-only:border-dashed",
        className
      )}
      {...props}
    />
  );
}

export { Input };
