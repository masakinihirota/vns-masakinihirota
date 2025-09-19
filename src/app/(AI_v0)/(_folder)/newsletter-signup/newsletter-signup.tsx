import { Facebook, Github, Mail, Shield, Twitter } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function NewsletterSignup() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-4'>
			<div className='w-full max-w-md'>
				<Card className='shadow-xl border-0 bg-white/95 backdrop-blur-sm'>
					<CardContent className='p-8'>
						{/* Logo/Brand Mark */}
						<div className='flex justify-center mb-6'>
							<div className='w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center'>
								<Mail className='w-6 h-6 text-white' />
							</div>
						</div>

						{/* Headline and Subheading */}
						<div className='text-center mb-8'>
							<h1 className='text-2xl font-bold text-gray-900 mb-2'>
								Subscribe to My Newsletter
							</h1>
							<p className='text-gray-600 text-sm leading-relaxed'>
								Get the latest insights, tips, and exclusive content delivered
								straight to your inbox. Join thousands of subscribers.
							</p>
						</div>

						{/* Social Sign-up Options */}
						<div className='mb-6'>
							<p className='text-xs text-gray-500 text-center mb-4'>
								Sign up with
							</p>
							<div className='flex justify-center space-x-3'>
								<Button
									variant='outline'
									size='sm'
									className='flex-1 h-10 border-gray-200 hover:bg-gray-50 bg-transparent'
								>
									<Twitter className='w-4 h-4 mr-2 text-blue-500' />
									Twitter
								</Button>
								<Button
									variant='outline'
									size='sm'
									className='flex-1 h-10 border-gray-200 hover:bg-gray-50 bg-transparent'
								>
									<Facebook className='w-4 h-4 mr-2 text-blue-600' />
									Facebook
								</Button>
								<Button
									variant='outline'
									size='sm'
									className='flex-1 h-10 border-gray-200 hover:bg-gray-50 bg-transparent'
								>
									<Github className='w-4 h-4 mr-2 text-gray-800' />
									GitHub
								</Button>
							</div>
						</div>

						{/* Divider */}
						<div className='relative mb-6'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-200'></div>
							</div>
							<div className='relative flex justify-center text-xs'>
								<span className='bg-white px-3 text-gray-500'>
									or continue with email
								</span>
							</div>
						</div>

						{/* Email Form */}
						<form className='space-y-4 mb-6'>
							<div>
								<Input
									type='email'
									placeholder='Enter your email address'
									className='h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500'
									required
								/>
							</div>
							<Button
								type='submit'
								className='w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium'
							>
								Subscribe Now
							</Button>
						</form>

						{/* Additional Links */}
						<div className='flex justify-center space-x-4 text-xs text-gray-500 mb-6'>
							<Link
								href='/terms'
								className='hover:text-purple-600 transition-colors'
							>
								Terms
							</Link>
							<span>•</span>
							<Link
								href='/privacy'
								className='hover:text-purple-600 transition-colors'
							>
								Privacy
							</Link>
							<span>•</span>
							<Link
								href='/help'
								className='hover:text-purple-600 transition-colors'
							>
								Help
							</Link>
						</div>

						{/* Trust Indicator */}
						<div className='flex items-center justify-center text-xs text-gray-500'>
							<Shield className='w-3 h-3 mr-1' />
							We respect your privacy
						</div>
					</CardContent>
				</Card>

				{/* Footer Trust Indicators */}
				<div className='text-center mt-6 text-xs text-gray-500'>
					<p>No spam, unsubscribe at any time</p>
					<p className='mt-1'>Trusted by 10,000+ subscribers</p>
				</div>
			</div>
		</div>
	)
}
