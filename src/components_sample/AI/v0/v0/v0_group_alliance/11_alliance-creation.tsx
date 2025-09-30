"use client"

// 手動それ以上のまとまり作成画面
import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// ダミーデータ: 実際の実装では、APIやデータベースから取得します
const dummyGroups = [
	{ id: 1, name: "アニメ愛好会" },
	{ id: 2, name: "漫画研究会" },
	{ id: 3, name: "SF映画ファンクラブ" },
	{ id: 4, name: "ゲーマーズ" },
	{ id: 5, name: "音楽鑑賞部" }
]

export default function AllianceCreation() {
	const [allianceName, setAllianceName] = useState("")
	const [allianceDescription, setAllianceDescription] = useState("")
	const [selectedGroups, setSelectedGroups] = useState<number[]>([])

	// Generate unique IDs using useId
	const allianceNameId = useId()
	const allianceDescriptionId = useId()

	const handleGroupSelection = (groupId: number) => {
		setSelectedGroups((prev) =>
			prev.includes(groupId)
				? prev.filter((id) => id !== groupId)
				: [...prev, groupId]
		)
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		// ここでそれ以上のまとまり作成のロジックを実装します
		console.log("それ以上のまとまり作成:", {
			allianceName,
			allianceDescription,
			selectedGroups
		})
		// 作成後の処理（例：成功メッセージの表示、リダイレクトなど）
	}

	return (
		<Card className='w-full max-w-2xl mx-auto'>
			<CardHeader>
				<CardTitle>それ以上のまとまり作成</CardTitle>
				<CardDescription>
					新しいそれ以上のまとまりを作成し、グループをまとめましょう。
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor={allianceNameId}>それ以上のまとまり名</Label>
						<Input
							id={allianceNameId}
							value={allianceName}
							onChange={(e) => setAllianceName(e.target.value)}
							placeholder='それ以上のまとまり名を入力'
							required
						/>
					</div>
					<div className='space-y-2'>
						<Label htmlFor={allianceDescriptionId}>説明</Label>
						<Textarea
							id={allianceDescriptionId}
							value={allianceDescription}
							onChange={(e) => setAllianceDescription(e.target.value)}
							placeholder='それ以上のまとまりの説明を入力'
							rows={3}
						/>
					</div>
					<div className='space-y-2'>
						<Label>グループ選択</Label>
						<div className='grid grid-cols-2 gap-2'>
							{dummyGroups.map((group) => (
								<div key={group.id} className='flex items-center space-x-2'>
									<Checkbox
										id={`group-${group.id}`}
										checked={selectedGroups.includes(group.id)}
										onCheckedChange={() => handleGroupSelection(group.id)}
									/>
									<Label htmlFor={`group-${group.id}`}>{group.name}</Label>
								</div>
							))}
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Button type='submit' className='w-full'>
						それ以上のまとまりを作成
					</Button>
				</CardFooter>
			</form>
		</Card>
	)
}
