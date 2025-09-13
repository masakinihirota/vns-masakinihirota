"use client"

import { useState } from "react"
import {
	FileText,
	Group,
	Home,
	List,
	LogIn,
	Moon,
	Settings,
	Sun,
	Tag,
	User,
	Users
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	const [darkMode, setDarkMode] = useState(false)
	const [adEnabled, setAdEnabled] = useState(true)

	return (
		<div className={`min-h-screen flex flex-col ${darkMode ? "dark" : ""}`}>
			<header className='bg-sky-100 dark:bg-sky-900 text-sky-900 dark:text-sky-100 p-4 flex justify-between items-center shadow-md'>
				<div className='flex items-center space-x-4'>
					<Home className='h-6 w-6' />
					<h1 className='text-xl font-bold'>Desert Oasis</h1>
				</div>
				<div className='flex items-center space-x-4'>
					<Button
						variant='ghost'
						size='sm'
						onClick={() => setAdEnabled(!adEnabled)}
					>
						{adEnabled ? "Disable Ads" : "Enable Ads"}
					</Button>
					<div className='flex items-center space-x-2'>
						<Sun className='h-4 w-4' />
						<Switch checked={darkMode} onCheckedChange={setDarkMode} />
						<Moon className='h-4 w-4' />
					</div>
					<Button variant='outline' size='sm'>
						<LogIn className='h-4 w-4 mr-2' />
						Sign Up
					</Button>
				</div>
			</header>

			<div className='flex flex-1'>
				<aside className='w-64 bg-cyan-50 dark:bg-cyan-900 p-4 space-y-4'>
					<Link href='/root-account'>
						<Button
							variant='ghost'
							className='w-full justify-start text-cyan-700 dark:text-cyan-100'
						>
							<Settings className='h-4 w-4 mr-2' />
							Root Account
						</Button>
					</Link>
					<Link href='/user-profile'>
						<Button
							variant='ghost'
							className='w-full justify-start text-cyan-700 dark:text-cyan-100'
						>
							<User className='h-4 w-4 mr-2' />
							User Profile
						</Button>
					</Link>
					<Link href='/register-work'>
						<Button
							variant='ghost'
							className='w-full justify-start text-cyan-700 dark:text-cyan-100'
						>
							<FileText className='h-4 w-4 mr-2' />
							Register Work
						</Button>
					</Link>
					<Link href='/lists'>
						<Button
							variant='ghost'
							className='w-full justify-start text-cyan-700 dark:text-cyan-100'
						>
							<List className='h-4 w-4 mr-2' />
							Lists
						</Button>
					</Link>
					<Link href='/create-tags'>
						<Button
							variant='ghost'
							className='w-full justify-start text-cyan-700 dark:text-cyan-100'
						>
							<Tag className='h-4 w-4 mr-2' />
							Create Tags
						</Button>
					</Link>
					<Link href='/matching'>
						<Button
							variant='ghost'
							className='w-full justify-start text-cyan-700 dark:text-cyan-100'
						>
							<Users className='h-4 w-4 mr-2' />
							Matching
						</Button>
					</Link>
					<Link href='/groups'>
						<Button
							variant='ghost'
							className='w-full justify-start text-cyan-700 dark:text-cyan-100'
						>
							<Group className='h-4 w-4 mr-2' />
							Groups
						</Button>
					</Link>
				</aside>

				<main className='flex-1 p-8 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900 dark:to-cyan-900'>
					{children}
				</main>
			</div>

			<footer className='bg-blue-200 dark:bg-blue-950 text-blue-900 dark:text-blue-100 p-4 text-center'>
				<div className='flex justify-center space-x-4'>
					<a href='#' className='hover:underline'>
						About Us
					</a>
					<a href='#' className='hover:underline'>
						Terms of Service
					</a>
					<a href='#' className='hover:underline'>
						Privacy Policy
					</a>
					<a href='#' className='hover:underline'>
						Contact
					</a>
				</div>
				<p className='mt-2'>&copy; 2023 Desert Oasis. All rights reserved.</p>
			</footer>
		</div>
	)
}
