"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

/**
 *
 * @param root0
 * @param root0.children
 */
export function ThemeProvider({
  children,
  ...properties
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...properties}>{children}</NextThemesProvider>;
}
