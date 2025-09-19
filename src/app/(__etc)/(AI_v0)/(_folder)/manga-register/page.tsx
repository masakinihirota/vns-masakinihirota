"use client"

import { useId, useState } from "react"
import {
	AlertCircle,
	BookOpen,
	CheckCircle,
	FileText,
	User
} from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import type React from "react"

export default function MangaRegisterPage() {
	// generate unique ids for form fields
	const titleId = useId()
	const authorId = useId()
	const descriptionId = useId()

	const [title, setTitle] = useState("")
	const [author, setAuthor] = useState("")
	const [description, setDescription] = useState("")
	const [message, setMessage] = useState("")
	const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)
		setMessage("")
		setStatus("idle")

		try {
			const res = await fetch("/api/manga/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ title, author, description })
			})
			const data = await res.json()

			if (res.ok) {
				setMessage("Manga registered successfully!")
				setStatus("success")
				setTitle("")
				setAuthor("")
				setDescription("")
			} else {
				setMessage(data.error || "An error occurred.")
				setStatus("error")
			}
		} catch (_error) {
			setMessage("An error occurred.")
			setStatus("error")
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className='container mx-auto py-10 px-4 max-w-3xl'>
			<Card className='border-2 shadow-lg'>
				<CardHeader className='space-y-1 bg-muted/50'>
					<CardTitle className='text-2xl font-bold text-center'>
						Register a Manga Work
					</CardTitle>
					<CardDescription className='text-center'>
						Add a new manga to the collection
					</CardDescription>
				</CardHeader>

				<CardContent className='pt-6'>
					{message && (
						<Alert
							className={`mb-6 ${status === "success" ? "border-green-500 bg-green-50 text-green-700" : "border-destructive bg-destructive/10 text-destructive"}`}
						>
							<div className='flex items-center gap-2'>
								{status === "success" ? (
									<CheckCircle className='h-4 w-4' />
								) : (
									<AlertCircle className='h-4 w-4' />
								)}
								<AlertDescription>{message}</AlertDescription>
							</div>
						</Alert>
					)}

					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='space-y-4'>
							<div className='space-y-2'>
								<div className='flex items-center gap-2'>
									<BookOpen className='h-4 w-4 text-muted-foreground' />
									<Label htmlFor={titleId} className='font-medium'>
										Title
									</Label>
								</div>
								<Input
									id={titleId}
									placeholder='Enter manga title'
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									required
									className='transition-all focus-visible:ring-primary'
								/>
							</div>

							<div className='space-y-2'>
								<div className='flex items-center gap-2'>
									<User className='h-4 w-4 text-muted-foreground' />
									<Label htmlFor={authorId} className='font-medium'>
										Author
									</Label>
								</div>
								<Input
									id={authorId}
									placeholder='Enter author name'
									value={author}
									onChange={(e) => setAuthor(e.target.value)}
									required
									className='transition-all focus-visible:ring-primary'
								/>
							</div>

							<div className='space-y-2'>
								<div className='flex items-center gap-2'>
									<FileText className='h-4 w-4 text-muted-foreground' />
									<Label htmlFor={descriptionId} className='font-medium'>
										Description
									</Label>
								</div>
								<Textarea
									id={descriptionId}
									placeholder='Enter manga description'
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									className='min-h-[120px] resize-none transition-all focus-visible:ring-primary'
								/>
							</div>
						</div>

						<CardFooter className='flex justify-end px-0 pt-2'>
							<Button
								type='submit'
								className='w-full sm:w-auto'
								disabled={isSubmitting}
							>
								{isSubmitting ? "Registering..." : "Register Manga"}
							</Button>
						</CardFooter>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
