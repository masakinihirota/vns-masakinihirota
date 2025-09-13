import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"

export default function Component() {
	const animeRatings = [
		{
			tier: 1,
			category: "アニメ",
			title: "進撃の巨人 1期",
			comment:
				"巨人の脅威に立ち向かうエレンたちの姿は、見る者の心を掴み、続きが気になる展開の連続です。"
		},
		{
			tier: 1,
			category: "アニメ",
			title: "進撃の巨人 2期",
			comment:
				"1期で明かされた謎が少しずつ解き明かされ、物語はますます深みを増していきます。"
		},
		{
			tier: 2,
			category: "アニメ",
			title: "進撃の巨人 3期",
			comment: "物語は大きく動き出し、衝撃的な展開の連続に目が離せません。"
		},
		{
			tier: 2,
			category: "アニメ",
			title: "進撃の巨人 4期",
			comment:
				"シリーズの最終章。これまでの謎が明かされ、壮大なスケールで物語が完結します。"
		},
		{
			tier: 1,
			category: "アニメ",
			title: "新世紀エヴァンゲリオン",
			comment:
				"人類の存亡をかけた壮絶な戦いを、心理描写と哲学的なテーマを交えながら描く傑作。メカと人間の関係性を深く掘り下げています。"
		},
		{
			tier: 3,
			category: "アニメ",
			title: "ジョジョの奇妙な冒険 2期",
			comment:
				"個性あふれるキャラクターたちが繰り広げる、独特な能力バトル漫画。スタイリッシュな演出と熱い展開が魅力です。"
		},
		{
			tier: 3,
			category: "アニメ",
			title: "ミスター味っ子",
			comment:
				"料理を通じて成長していく少年の物語。味覚描写がとにかくリアルで、見ていると食べたくなるような作品です。"
		},
		{
			tier: 2,
			category: "アニメ",
			title: "サイコパス 1期",
			comment:
				"近未来社会を舞台に、犯罪者を事前に予測し、その芽を摘み取るシステム「シビュラシステム」を描いた作品。"
		},
		{
			tier: 1,
			category: "アニメ",
			title: "ハンターハンター 2011年版",
			comment:
				"広大な世界を舞台に、ハンターと呼ばれる職業を目指す少年の冒険を描いた作品。個性豊かなキャラクターと緻密な世界観が魅力です。"
		},
		{
			tier: 3,
			category: "アニメ",
			title: "ハンターハンター 1999年版",
			comment:
				"2011年版とは異なる魅力を持つ、ハンターハンターのアニメ版。よりコミカルな演出やキャラクターデザインが特徴です。"
		}
	]

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className='w-[100px]'>評価</TableHead>
					<TableHead>カテゴリ</TableHead>
					<TableHead>作品名</TableHead>
					<TableHead className='w-[500px]'>コメント</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{animeRatings.map((anime, index) => (
					<TableRow key={index}>
						<TableCell>tier: {anime.tier}</TableCell>
						<TableCell>{anime.category}</TableCell>
						<TableCell>{anime.title}</TableCell>
						<TableCell>{anime.comment}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
