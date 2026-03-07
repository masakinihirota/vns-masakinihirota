import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { LocaleProvider } from "@/context/locale-context";
import { getDefaultLocale } from "@/i18n/get-messages";
import type { Locale } from "@/i18n/messages";

// Dynamic rendering: Avoid prerendering errors during build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "VNS masakinihirota",
  description: "VNS masakinihirotaは、価値観サイトです。価値観を共有し、グループを作り、一緒に何かをします。",
};

// Accessibility: Allow users to zoom up to 200% (WCAG 2.1 AA)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale: Locale = getDefaultLocale();
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* テーマのちらつきを防ぐスクリプト (FOUC防止) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <LocaleProvider initialLocale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </LocaleProvider>
        {/* Webアプリのどこからでも通知が可能 */}
        <Toaster />
      </body>
    </html>
  );
}
