import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-solid-gray-600 placeholder:text-muted-foreground aria-invalid:border-error-1 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-8 border bg-white px-4 py-3 text-oln-16N-100 text-solid-gray-800 shadow-xs transition-[color,box-shadow] outline-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[calc(2/16*1rem)] focus-visible:ring-[calc(2/16*1rem)] focus-visible:ring-accent-yellow aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none aria-disabled:border-solid-gray-300 aria-disabled:bg-solid-gray-50 aria-disabled:text-solid-gray-420 md:text-sm hover:[&:read-write:not([aria-disabled=true])]:border-black read-only:border-dashed",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
