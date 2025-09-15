// 認可管理画面
"use client"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"

type Permission = {
	id: string
	name: string
	description: string
}

type Role = {
	id: string
	name: string
}

const permissions: Permission[] = [
	{ id: "1", name: "ユーザー閲覧", description: "ユーザー情報の閲覧権限" },
	{ id: "2", name: "ユーザー編集", description: "ユーザー情報の編集権限" },
	{ id: "3", name: "グループ作成", description: "新規グループの作成権限" },
	{ id: "4", name: "アライアンス管理", description: "アライアンスの管理権限" },
	{ id: "5", name: "作品登録", description: "新規作品の登録権限" }
]

const roles: Role[] = [
	{ id: "1", name: "一般ユーザー" },
	{ id: "2", name: "モデレーター" },
	{ id: "3", name: "管理者" }
]

export default function PermissionManagement() {
	const [rolePermissions, setRolePermissions] = useState<
		Record<string, string[]>
	>({
		"1": ["1"],
		"2": ["1", "2", "3"],
		"3": ["1", "2", "3", "4", "5"]
	})

	const handlePermissionChange = (roleId: string, permissionId: string) => {
		setRolePermissions((prev) => {
			const updatedPermissions = prev[roleId].includes(permissionId)
				? prev[roleId].filter((id) => id !== permissionId)
				: [...prev[roleId], permissionId]
			return { ...prev, [roleId]: updatedPermissions }
		})
	}

	const handleSave = () => {
		console.log("保存された権限設定:", rolePermissions)
		// ここで保存処理を実装します
	}

	return (
		<Card className='w-full max-w-4xl mx-auto'>
			<CardHeader>
				<CardTitle>認可管理</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>権限 \ ロール</TableHead>
							{roles.map((role) => (
								<TableHead key={role.id}>{role.name}</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{permissions.map((permission) => (
							<TableRow key={permission.id}>
								<TableCell className='font-medium'>
									{permission.name}
									<p className='text-sm text-muted-foreground'>
										{permission.description}
									</p>
								</TableCell>
								{roles.map((role) => (
									<TableCell key={role.id}>
										<Checkbox
											checked={rolePermissions[role.id].includes(permission.id)}
											onCheckedChange={() =>
												handlePermissionChange(role.id, permission.id)
											}
										/>
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
				<div className='mt-4 flex justify-end'>
					<Button onClick={handleSave}>保存</Button>
				</div>
			</CardContent>
		</Card>
	)
}
