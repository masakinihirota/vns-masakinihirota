// データ入力管理画面

'use client'

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Work = {
	id: string
	title: string
	tier: number
	type: string
}

type Value = {
	id: string
	category: string
	value: string
}

export default function Component() {
	const [works, setWorks] = useState<Work[]>([
		{ id: "1", title: "進撃の巨人", tier: 1, type: "anime" },
		{ id: "2", title: "鬼滅の刃", tier: 2, type: "manga" }
	])

	const [values, setValues] = useState<Value[]>([
		{
			id: "1",
			category: "食事",
			value: "バランスよく3食、決まった時間に食べる"
		},
		{ id: "2", category: "趣味", value: "アニメ鑑賞" }
	])

	const [newWork, setNewWork] = useState<Omit<Work, "id">>({
		title: "",
		tier: 1,
		type: "anime"
	})
	const [newValue, setNewValue] = useState<Omit<Value, "id">>({
		category: "",
		value: ""
	})

	const addWork = () => {
		setWorks([...works, { ...newWork, id: String(works.length + 1) }])
		setNewWork({ title: "", tier: 1, type: "anime" })
	}

	const addValue = () => {
		setValues([...values, { ...newValue, id: String(values.length + 1) }])
		setNewValue({ category: "", value: "" })
	}

	const deleteWork = (id: string) => {
		setWorks(works.filter((work) => work.id !== id))
	}

	const deleteValue = (id: string) => {
		setValues(values.filter((value) => value.id !== id))
	}

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>データ入力管理画面</h1>
			<Tabs defaultValue='works'>
				<TabsList>
					<TabsTrigger value='works'>作品</TabsTrigger>
					<TabsTrigger value='values'>価値観</TabsTrigger>
				</TabsList>
				<TabsContent value='works'>
					<div className='mb-4'>
						<h2 className='text-xl font-semibold mb-2'>作品登録</h2>
						<div className='flex gap-2 mb-2'>
							<Input
								placeholder='タイトル'
								value={newWork.title}
								onChange={(e) =>
									setNewWork({ ...newWork, title: e.target.value })
								}
							/>
							<Input
								type='number'
								placeholder='ティア'
								value={newWork.tier}
								onChange={(e) =>
									setNewWork({ ...newWork, tier: Number(e.target.value) })
								}
							/>
							<select
								className='border rounded px-2 py-1'
								value={newWork.type}
								onChange={(e) =>
									setNewWork({ ...newWork, type: e.target.value })
								}
							>
								<option value='anime'>アニメ</option>
								<option value='manga'>漫画</option>
							</select>
							<Button onClick={addWork}>追加</Button>
						</div>
					</div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>タイトル</TableHead>
								<TableHead>ティア</TableHead>
								<TableHead>タイプ</TableHead>
								<TableHead>操作</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{works.map((work) => (
								<TableRow key={work.id}>
									<TableCell>{work.title}</TableCell>
									<TableCell>{work.tier}</TableCell>
									<TableCell>{work.type}</TableCell>
									<TableCell>
										<Button
											variant='destructive'
											onClick={() => deleteWork(work.id)}
										>
											削除
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TabsContent>
				<TabsContent value='values'>
					<div className='mb-4'>
						<h2 className='text-xl font-semibold mb-2'>価値観登録</h2>
						<div className='flex gap-2 mb-2'>
							<Input
								placeholder='カテゴリ'
								value={newValue.category}
								onChange={(e) =>
									setNewValue({ ...newValue, category: e.target.value })
								}
							/>
							<Input
								placeholder='価値観'
								value={newValue.value}
								onChange={(e) =>
									setNewValue({ ...newValue, value: e.target.value })
								}
							/>
							<Button onClick={addValue}>追加</Button>
						</div>
					</div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>カテゴリ</TableHead>
								<TableHead>価値観</TableHead>
								<TableHead>操作</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{values.map((value) => (
								<TableRow key={value.id}>
									<TableCell>{value.category}</TableCell>
									<TableCell>{value.value}</TableCell>
									<TableCell>
										<Button
											variant='destructive'
											onClick={() => deleteValue(value.id)}
										>
											削除
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TabsContent>
			</Tabs>
		</div>
	)
}
