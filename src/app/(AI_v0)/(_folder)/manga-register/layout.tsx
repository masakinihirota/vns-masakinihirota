import type React from "react"
export default function MangaRegisterLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8'>
			{children}
		</div>
	)
}
