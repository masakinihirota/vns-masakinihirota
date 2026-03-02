import type { Metadata } from "next";
import "./globals.css";

import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "VNS masakinihirota",
  description: "VNS masakinihirotaは、価値観サイトです。価値観を共有し、グループを作り、一緒に何かをします。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </ThemeProvider>
        {/* Webアプリのどこからでも通知が可能 */}
        <Toaster />
      </body>
    </html>
  );
}
