import './globals.css';
import { UserProvider } from '@/lib/auth';
import { getUser } from '@/lib/db/queries';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';

import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: 'Next.js SaaS Starter',
  description: 'Get started quickly with Next.js, Postgres, and Stripe.',
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userPromise = getUser();

  return (
			<html
				lang="ja"
				className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
				suppressHydrationWarning
			>
				<body className="min-h-[100dvh] bg-gray-50">
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
