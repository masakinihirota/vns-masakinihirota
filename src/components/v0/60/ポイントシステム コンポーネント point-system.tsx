"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Coins } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type PointAction = {
	name: string
	cost: number
}

const pointActions: PointAction[] = [
	{ name: "プロフィール更新", cost: 10 },
	{ name: "作品登録", cost: 5 },
	{ name: "マッチング実行", cost: 20 },
	{ name: "グループ作成", cost: 50 }
]

export default function PointSystem() {
	const [points, setPoints] = useState(1000)
	const [showWarning, setShowWarning] = useState(false)

	useEffect(() => {
		if (points < 100) {
			setShowWarning(true)
		} else {
			setShowWarning(false)
		}
	}, [points])

	const handleAction = (cost: number) => {
		if (points >= cost) {
			setPoints(points - cost)
		}
	}

	return (
		<Card className='w-full max-w-md'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<Coins className='h-6 w-6' />
					ポイントシステム
				</CardTitle>
				<CardDescription>アクションごとにポイントを消費します</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='mb-4'>
					<div className='flex justify-between items-center mb-2'>
						<span className='text-lg font-semibold'>
							残りポイント: {points}
						</span>
						{showWarning && (
							<div className='flex items-center text-yellow-500'>
								<AlertCircle className='h-5 w-5 mr-1' />
								<span className='text-sm'>ポイントが少なくなっています</span>
							</div>
						)}
					</div>
					<Progress value={(points / 1000) * 100} className='w-full' />
				</div>
				<div className='space-y-2'>
					{pointActions.map((action) => (
						<Button
							key={action.name}
							onClick={() => handleAction(action.cost)}
							disabled={points < action.cost}
							className='w-full justify-between'
						>
							<span>{action.name}</span>
							<span>{action.cost} ポイント</span>
						</Button>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
