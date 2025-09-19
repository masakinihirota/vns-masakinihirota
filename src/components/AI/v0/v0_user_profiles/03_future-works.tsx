// 「未来」コンポーネント
import { CalendarIcon, StarIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Work = {
	id: string
	title: string
	tier: number
	type: string
	releaseDate?: string
}

type FutureWorksProps = {
	works: Work[]
}

export default function Component({ works = [] }: FutureWorksProps) {
	const sortedWorks = [...works].sort((a, b) => a.tier - b.tier)

	return (
		<Card className='w-full max-w-3xl'>
			<CardHeader>
				<CardTitle className='text-2xl font-bold'>未来の期待作品</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className='space-y-4'>
					{sortedWorks.map((work) => (
						<li key={work.id} className='flex items-start space-x-4'>
							<div className='flex-shrink-0'>
								<Badge variant='secondary' className='text-xs'>
									{work.type === "anime" ? "アニメ" : "漫画"}
								</Badge>
							</div>
							<div className='flex-grow'>
								<h3 className='text-lg font-semibold'>{work.title}</h3>
								<div className='flex items-center space-x-2 text-sm text-muted-foreground'>
									<StarIcon className='h-4 w-4' />
									<span>期待度: {6 - work.tier}</span>
									{work.releaseDate && (
										<>
											<CalendarIcon className='h-4 w-4 ml-2' />
											<span>予定日: {work.releaseDate}</span>
										</>
									)}
								</div>
							</div>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	)
}
