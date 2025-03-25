import './globals.css';
import { UserProvider } from '@/lib/auth';
import { getUser } from '@/lib/db/queries';
import type { Metadata, Viewport } from "next";

import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
	title: "masakinihirota",
	description: "真っ先に拾った",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userPromise = getUser();

  return (
			<html lang="ja" suppressHydrationWarning>
				<body className="">
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<UserProvider userPromise={userPromise}>{children}</UserProvider>
					</ThemeProvider>
				</body>
			</html>
		);
}
