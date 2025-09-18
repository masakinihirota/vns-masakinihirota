// 自動マッチング画面
'use client'

import { useState } from "react"
import { UserCheck, UserPlus, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Component() {
	const [selectedUsers, setSelectedUsers] = useState<string[]>([])

	const matchedUsers = [
		{ id: "1", name: "ユーザー1", similarity: 85 },
		{ id: "2", name: "ユーザー2", similarity: 80 },
		{ id: "3", name: "ユーザー3", similarity: 75 },
		{ id: "4", name: "ユーザー4", similarity: 70 },
		{ id: "5", name: "ユーザー5", similarity: 65 }
	]

	const handleUserSelect = (userId: string) => {
		setSelectedUsers((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId]
		)
	}

	const handleCreateGroup = () => {
		console.log("グループを作成:", selectedUsers)
		// ここでグループ作成のロジックを実装
	}

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>自動マッチング結果</h1>
			<div className='grid gap-4 md:grid-cols-2'>
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center'>
							<Users className='mr-2' />
							マッチしたユーザー
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ScrollArea className='h-[300px]'>
							{matchedUsers.map((user) => (
								<div key={user.id} className='flex items-center space-x-2 mb-2'>
									<Checkbox
										id={`user-${user.id}`}
										checked={selectedUsers.includes(user.id)}
										onCheckedChange={() => handleUserSelect(user.id)}
									/>
									<label
										htmlFor={`user-${user.id}`}
										className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
									>
										{user.name} (類似度: {user.similarity}%)
									</label>
								</div>
							))}
						</ScrollArea>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center'>
							<UserPlus className='mr-2' />
							グループ作成
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='mb-4'>選択したユーザー: {selectedUsers.length}人</p>
						<Button
							onClick={handleCreateGroup}
							disabled={selectedUsers.length === 0}
							className='w-full'
						>
							<UserCheck className='mr-2' />
							グループを作成
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
