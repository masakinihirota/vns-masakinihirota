import { useState } from "react"
import { ChevronDown, ChevronUp, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"

type Alliance = {
	id: string
	name: string
	memberCount: number
	description: string
}

type AllianceDisplayProps = {
	alliances: Alliance[]
}

export default function Component({ alliances = [] }: AllianceDisplayProps) {
	const [expandedAlliance, setExpandedAlliance] = useState<string | null>(null)

	const toggleExpand = (id: string) => {
		setExpandedAlliance(expandedAlliance === id ? null : id)
	}

	return (
		<Card className='w-full max-w-2xl'>
			<CardHeader>
				<CardTitle>所属アライアンス</CardTitle>
				<CardDescription>
					あなたが参加しているアライアンスの一覧です
				</CardDescription>
			</CardHeader>
			<CardContent>
				{alliances.length === 0 ? (
					<p className='text-center text-muted-foreground'>
						現在所属しているアライアンスはありません
					</p>
				) : (
					<ul className='space-y-4'>
						{alliances.map((alliance) => (
							<li key={alliance.id}>
								<Card>
									<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
										<CardTitle className='text-sm font-medium'>
											{alliance.name}
										</CardTitle>
										<Badge variant='secondary'>
											<Users className='mr-1 h-3 w-3' />
											{alliance.memberCount}
										</Badge>
									</CardHeader>
									<CardContent>
										<Button
											variant='ghost'
											className='w-full justify-between'
											onClick={() => toggleExpand(alliance.id)}
										>
											詳細を{expandedAlliance === alliance.id ? "隠す" : "表示"}
											{expandedAlliance === alliance.id ? (
												<ChevronUp className='h-4 w-4' />
											) : (
												<ChevronDown className='h-4 w-4' />
											)}
										</Button>
										{expandedAlliance === alliance.id && (
											<p className='mt-2 text-sm text-muted-foreground'>
												{alliance.description}
											</p>
										)}
									</CardContent>
								</Card>
							</li>
						))}
					</ul>
				)}
			</CardContent>
		</Card>
	)
}
