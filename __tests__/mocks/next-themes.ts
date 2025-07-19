import { vi } from "vitest";

// next-themes のモック
export const useTheme = vi.fn(() => ({
  theme: "light",
  setTheme: vi.fn(),
  resolvedTheme: "light",
  themes: ["light", "dark", "system"],
  systemTheme: "light",
}));

export const ThemeProvider = vi.fn(
  ({ children }: { children: React.ReactNode }) => children,
);
