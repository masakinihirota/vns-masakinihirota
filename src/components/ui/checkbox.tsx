"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer size-6 shrink-0 rounded-[calc(1/8*100%)] border-2 border-solid-gray-600 bg-white appearance-none cursor-pointer",
      "data-[state=checked]:border-blue-900 data-[state=checked]:bg-blue-900",
      "focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[calc(2/16*1rem)] focus-visible:ring-[calc(2/16*1rem)] focus-visible:ring-accent-yellow",
      "aria-disabled:!border-solid-gray-300 aria-disabled:!bg-solid-gray-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed data-[state=checked]:aria-disabled:!bg-solid-gray-300",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-white")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
