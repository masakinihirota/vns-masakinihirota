import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "masakinihirota",
  description: "VNS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="">{children}</body>
    </html>
  );
}
