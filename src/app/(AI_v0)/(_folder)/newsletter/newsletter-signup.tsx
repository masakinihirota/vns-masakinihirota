import { Github, Mail, Twitter } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function NewsletterSignup() {
	return (
		<div className='min-h-screen w-full bg-gradient-to-br from-purple-50 via-white to-purple-50 p-4 flex items-center justify-center'>
			<Card className='w-full max-w-md mx-auto shadow-lg'>
				<CardHeader className='space-y-6 text-center'>
					<div className='mx-auto w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center'>
						<Mail className='h-6 w-6 text-white' />
					</div>
					<div className='space-y-2'>
						<h1 className='text-2xl font-bold tracking-tight'>
							Stay in the loop
						</h1>
						<p className='text-muted-foreground'>
							Subscribe to our newsletter for weekly updates, tips, and
							exclusive content.
						</p>
					</div>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='grid grid-cols-2 gap-4'>
						<Button variant='outline' className='w-full'>
							<Github className='mr-2 h-4 w-4' />
							Github
						</Button>
						<Button variant='outline' className='w-full'>
							<Twitter className='mr-2 h-4 w-4' />
							Twitter
						</Button>
					</div>
					<div className='relative'>
						<div className='absolute inset-0 flex items-center'>
							<span className='w-full border-t' />
						</div>
						<div className='relative flex justify-center text-xs uppercase'>
							<span className='bg-background px-2 text-muted-foreground'>
								Or continue with
							</span>
						</div>
					</div>
					<div className='space-y-4'>
						<Input type='email' placeholder='Enter your email' />
						<Button className='w-full bg-purple-600 hover:bg-purple-700'>
							Subscribe Now
						</Button>
					</div>
				</CardContent>
				<CardFooter className='flex flex-col space-y-4 text-center text-sm text-muted-foreground'>
					<div className='flex justify-center space-x-4'>
						<Link href='/terms' className='hover:underline'>
							Terms
						</Link>
						<Link href='/privacy' className='hover:underline'>
							Privacy
						</Link>
						<Link href='/help' className='hover:underline'>
							Help
						</Link>
					</div>
					<p>We respect your privacy. Unsubscribe at any time.</p>
				</CardFooter>
			</Card>
		</div>
	)
}
