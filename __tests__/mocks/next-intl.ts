import { vi } from "vitest";

// next-intl のモック
export const useTranslations = vi.fn(() => (key: string) => key);

export const useLocale = vi.fn(() => "ja");

export const NextIntlClientProvider = vi.fn(
  ({ children }: { children: React.ReactNode }) => children,
);

export const getTranslations = vi.fn(() => (key: string) => key);

export const getLocale = vi.fn(() => Promise.resolve("ja"));
