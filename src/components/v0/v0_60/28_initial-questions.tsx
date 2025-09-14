// User's Language Selection
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function Component() {
	const [language, setLanguage] = useState("")
	const [culture, setCulture] = useState("")

	return (
		<div className='min-h-screen bg-background flex items-center justify-center'>
			<Card className='w-[350px]'>
				<CardHeader>
					<CardTitle>初期設定</CardTitle>
					<CardDescription>使用言語と文化圏を選択してください</CardDescription>
				</CardHeader>
				<CardContent>
					<form className='space-y-6'>
						<div className='space-y-4'>
							<Label>使用言語</Label>
							<RadioGroup value={language} onValueChange={setLanguage}>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem value='japanese' id='japanese' />
									<Label htmlFor='japanese'>日本語</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem value='english-us' id='english-us' />
									<Label htmlFor='english-us'>英語（アメリカ）</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem value='english-uk' id='english-uk' />
									<Label htmlFor='english-uk'>英語（イギリス）</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem value='french' id='french' />
									<Label htmlFor='french'>フランス語</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem value='german' id='german' />
									<Label htmlFor='german'>ドイツ語</Label>
								</div>
							</RadioGroup>
						</div>
						<div className='space-y-4'>
							<Label>文化圏</Label>
							<RadioGroup value={culture} onValueChange={setCulture}>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem value='japanese' id='culture-japanese' />
									<Label htmlFor='culture-japanese'>日本文化圏</Label>
								</div>
								<div className='flex items-center space-x-2'>
									<RadioGroupItem value='american' id='culture-american' />
									<Label htmlFor='culture-american'>アメリカ文化圏</Label>
								</div>
							</RadioGroup>
						</div>
						<Button className='w-full'>次へ</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
