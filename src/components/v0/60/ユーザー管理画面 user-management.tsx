"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"

type User = {
	id: string
	name: string
	email: string
	role: string
}

export default function UserManagement() {
	const [users, setUsers] = useState<User[]>([
		{
			id: "1",
			name: "山田太郎",
			email: "taro@example.com",
			role: "一般ユーザー"
		},
		{ id: "2", name: "佐藤花子", email: "hanako@example.com", role: "管理者" },
		{
			id: "3",
			name: "鈴木一郎",
			email: "ichiro@example.com",
			role: "一般ユーザー"
		}
	])

	const [editingUser, setEditingUser] = useState<User | null>(null)

	const handleEdit = (user: User) => {
		setEditingUser(user)
	}

	const handleSave = () => {
		if (editingUser) {
			setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)))
			setEditingUser(null)
		}
	}

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>ユーザー管理</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>名前</TableHead>
						<TableHead>メールアドレス</TableHead>
						<TableHead>役割</TableHead>
						<TableHead>操作</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user) => (
						<TableRow key={user.id}>
							<TableCell>{user.name}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>{user.role}</TableCell>
							<TableCell>
								<Dialog>
									<DialogTrigger asChild>
										<Button variant='outline' onClick={() => handleEdit(user)}>
											編集
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>ユーザー編集</DialogTitle>
										</DialogHeader>
										{editingUser && (
											<div className='grid gap-4 py-4'>
												<div className='grid grid-cols-4 items-center gap-4'>
													<label htmlFor='name' className='text-right'>
														名前
													</label>
													<Input
														id='name'
														value={editingUser.name}
														onChange={(e) =>
															setEditingUser({
																...editingUser,
																name: e.target.value
															})
														}
														className='col-span-3'
													/>
												</div>
												<div className='grid grid-cols-4 items-center gap-4'>
													<label htmlFor='email' className='text-right'>
														メールアドレス
													</label>
													<Input
														id='email'
														value={editingUser.email}
														onChange={(e) =>
															setEditingUser({
																...editingUser,
																email: e.target.value
															})
														}
														className='col-span-3'
													/>
												</div>
												<div className='grid grid-cols-4 items-center gap-4'>
													<label htmlFor='role' className='text-right'>
														役割
													</label>
													<Input
														id='role'
														value={editingUser.role}
														onChange={(e) =>
															setEditingUser({
																...editingUser,
																role: e.target.value
															})
														}
														className='col-span-3'
													/>
												</div>
											</div>
										)}
										<Button onClick={handleSave}>保存</Button>
									</DialogContent>
								</Dialog>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
