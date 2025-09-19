"use client"

import { useEffect, useId, useState } from "react"
import { createClient } from "@supabase/supabase-js"

// Next.jsのApp Routerでは、外部のCSSファイルは通常importしますが、
// このデモではTailwind CSSのCDNを使用して、単一ファイルで完結させています。
// 実際のプロジェクトでは、npmでTailwindをインストールして設定してください。
// <script src="https://cdn.tailwindcss.com"></script> タグは自動的に挿入されます

// ご要望に応じて更新したモックデータ
const mockArtworks = [
	{
		id: 1,
		title: "星月夜",
		artist: "フィンセント・ファン・ゴッホ",
		year: 1889,
		description: "夜空に輝く星々と、渦巻く雲が印象的な傑作。",
		thumbnail_url:
			"https://upload.wikimedia.org/wikipedia/commons/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
		is_important: true,
		rating: "Tier1",
		status: "完結",
		genre: "絵画",
		length: "1時間以内",
		category: "油絵",
		tags: ["印象派", "夜景", "空"],
		era: "19世紀",
		target_age: "全年齢",
		impressions_url: "#"
	},
	{
		id: 2,
		title: "モナ・リザ",
		artist: "レオナルド・ダ・ヴィンチ",
		year: 1503,
		description: "謎めいた微笑みで知られる、世界で最も有名な肖像画。",
		thumbnail_url:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
		is_important: false,
		rating: "Tier2",
		status: "完結",
		genre: "絵画",
		length: "1日以内",
		category: "肖像画",
		tags: ["ルネサンス", "微笑み", "謎"],
		era: "16世紀",
		target_age: "全年齢",
		impressions_url: "#"
	},
	{
		id: 3,
		title: "最後の晩餐",
		artist: "レオナルド・ダ・ヴィンチ",
		year: 1498,
		description: "イエス・キリストと12使徒の最後の晩餐の場面を描いた壁画。",
		thumbnail_url:
			"https://upload.wikimedia.org/wikipedia/commons/4/4b/Leonardo_da_Vinci_-_The_Last_Supper_-_c._1495-1498.jpg",
		is_important: true,
		rating: "Tier1",
		status: "完結",
		genre: "絵画",
		length: "3日以内",
		category: "壁画",
		tags: ["キリスト教", "宗教画", "ルネサンス"],
		era: "15世紀",
		target_age: "全年齢",
		impressions_url: "#"
	},
	{
		id: 4,
		title: "睡蓮",
		artist: "クロード・モネ",
		year: 1916,
		description: "モネが晩年に描いた、美しいジヴェルニーの庭の池の風景。",
		thumbnail_url:
			"https://upload.wikimedia.org/wikipedia/commons/e/ec/Monet_Water_Lilies_1916.jpg",
		is_important: false,
		rating: "普通or自分に合わない",
		status: "完結",
		genre: "絵画",
		length: "1週間以内",
		category: "油絵",
		tags: ["印象派", "自然", "池"],
		era: "20世紀",
		target_age: "全年齢",
		impressions_url: "#"
	},
	{
		id: 5,
		title: "ゲルニカ",
		artist: "パブロ・ピカソ",
		year: 1937,
		description:
			"スペイン内戦中のゲルニカ空爆をテーマにした反戦のメッセージが込められた作品。",
		thumbnail_url:
			"https://upload.wikimedia.org/wikipedia/commons/b/b8/Guernica_Picasso.jpg",
		is_important: true,
		rating: "Tier1",
		status: "完結",
		genre: "絵画",
		length: "それ以上",
		category: "キュビズム",
		tags: ["反戦", "社会派", "戦争"],
		era: "20世紀",
		target_age: "18+",
		impressions_url: "#"
	}
]

// Supabase接続設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase =
	supabaseUrl && supabaseAnonKey
		? createClient(supabaseUrl, supabaseAnonKey)
		: null

// ダミーデータ利用フラグ
const useMockArtworks = process.env.NEXT_PUBLIC_USE_MOCK_ARTWORKS === "true"

export default function App() {
	const [artworks, setArtworks] = useState<
		Array<{
			id: number
			title: string
			artist: string
			year: number
			description: string
			thumbnail_url: string
			is_important: boolean
			rating: string
			status: string
			genre: string
			length: string
			category: string
			tags: string[]
			era: string
			target_age: string
			impressions_url: string
		}>
	>([])
	const [displayMode, setDisplayMode] = useState("one-line")
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [filter, setFilter] = useState({ rating: "すべて" })
	type ArtworkKey =
		| "id"
		| "title"
		| "artist"
		| "year"
		| "description"
		| "thumbnail_url"
		| "is_important"
		| "rating"
		| "status"
		| "genre"
		| "length"
		| "category"
		| "tags"
		| "era"
		| "target_age"
		| "impressions_url"
	const [sort, setSort] = useState<{ key: ArtworkKey; order: "asc" | "desc" }>({
		key: "rating",
		order: "asc"
	})

	// Generate unique IDs using useId
	const filterRatingId = useId()
	const sortById = useId()

	useEffect(() => {
		const fetchArtworks = async () => {
			setLoading(true)
			setError(null)
			try {
				if (useMockArtworks) {
					// ダミーデータ
					await new Promise((resolve) => setTimeout(resolve, 500))
					setArtworks(mockArtworks)
				} else {
					if (!supabase)
						throw new Error("Supabaseクライアントが初期化されていません。")
					const { data, error } = await supabase.from("artworks").select("*")
					if (error) throw error
					setArtworks(data || [])
				}
			} catch (err) {
				setError("データ取得中にエラーが発生しました。")
				console.error(err)
			} finally {
				setLoading(false)
			}
		}
		fetchArtworks()
	}, [])

	// フィルタリングとソートを適用する
	const filteredAndSortedArtworks = artworks
		.filter((artwork) => {
			if (filter.rating === "すべて") return true
			return artwork.rating === filter.rating
		})
		.sort((a, b) => {
			// 評価のソート順を定義
			const ratingOrder = {
				Tier1: 1,
				Tier2: 2,
				Tier3: 3,
				普通or自分に合わない: 4
			}

			const targetAgeOrder = {
				全年齢: 1,
				"18+": 2
			}

			const sortA = a[sort.key]
			const sortB = b[sort.key]

			if (sort.key === "rating") {
				const aRating =
					ratingOrder[String(sortA) as keyof typeof ratingOrder] ?? 99
				const bRating =
					ratingOrder[String(sortB) as keyof typeof ratingOrder] ?? 99
				return sort.order === "asc" ? aRating - bRating : bRating - aRating
			}

			if (sort.key === "target_age") {
				const aAge =
					targetAgeOrder[String(sortA) as keyof typeof targetAgeOrder] ?? 99
				const bAge =
					targetAgeOrder[String(sortB) as keyof typeof targetAgeOrder] ?? 99
				return sort.order === "asc" ? aAge - bAge : bAge - aAge
			}

			if (typeof sortA === "string" && typeof sortB === "string") {
				return sort.order === "asc"
					? sortA.localeCompare(sortB, "ja")
					: sortB.localeCompare(sortA, "ja")
			}

			if (typeof sortA === "number" && typeof sortB === "number") {
				return sort.order === "asc" ? sortA - sortB : sortB - sortA
			}

			return 0
		})

	// ソートヘッダーのクリックハンドラー
	const handleSortClick = (key: ArtworkKey) => {
		if (sort.key === key) {
			setSort({ ...sort, order: sort.order === "asc" ? "desc" : "asc" })
		} else {
			setSort({ key, order: "asc" })
		}
	}

	const renderSortArrow = (key: ArtworkKey) => {
		if (sort.key === key) {
			return sort.order === "asc" ? "▲" : "▼"
		}
		return ""
	}

	if (loading) {
		return (
			<div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
				<div className='text-xl text-gray-700'>データを読み込み中...</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
				<div className='text-red-500'>{error}</div>
			</div>
		)
	}

	const renderArtworkList = () => {
		switch (displayMode) {
			case "one-line":
				return (
					<div>
						{/* 項目のタイトル (ソート可能) */}
						<div className='hidden md:flex bg-gray-200 text-gray-700 text-sm font-semibold p-2 rounded-t-lg'>
							<button
								className='text-left w-12 cursor-pointer flex-shrink-0'
								onClick={() => handleSortClick("is_important")}
							>
								重要 {renderSortArrow("is_important")}
							</button>
							<button
								type='button'
								className='text-left w-20 cursor-pointer flex-shrink-0'
								onClick={() => handleSortClick("rating")}
							>
								評価 {renderSortArrow("rating")}
							</button>
							<button
								type='button'
								className='text-left flex-1 min-w-0 cursor-pointer'
								onClick={() => handleSortClick("title")}
							>
								作品名 {renderSortArrow("title")}
							</button>
							<button
								type='button'
								className='text-left flex-1 min-w-0 cursor-pointer'
								onClick={() => handleSortClick("artist")}
							>
								作者名 {renderSortArrow("artist")}
							</button>
							<button
								type='button'
								className='text-left w-24 cursor-pointer flex-shrink-0'
								onClick={() => handleSortClick("status")}
							>
								状態 {renderSortArrow("status")}
							</button>
							<button
								type='button'
								className='text-left w-24 cursor-pointer flex-shrink-0'
								onClick={() => handleSortClick("genre")}
							>
								ジャンル {renderSortArrow("genre")}
							</button>
							<button
								type='button'
								className='text-left w-36 cursor-pointer flex-shrink-0'
								onClick={() => handleSortClick("length")}
							>
								長さ {renderSortArrow("length")}
							</button>
						</div>
						<ul className='divide-y divide-gray-200'>
							{filteredAndSortedArtworks.map((artwork) => (
								<li
									key={artwork.id}
									className='py-4 px-2 flex justify-between items-center hover:bg-gray-50 transition-colors'
								>
									<div className='flex items-center flex-1 space-x-4'>
										<div className='text-sm w-12 flex-shrink-0'>
											<span className='text-gray-500'>
												{artwork.is_important ? "✔" : " "}
											</span>
										</div>
										<div className='text-sm font-medium text-gray-700 w-20 flex-shrink-0'>
											{artwork.rating}
										</div>
										<div className='flex-1 min-w-0'>
											<h2 className='text-base font-semibold text-gray-900 truncate'>
												{artwork.title}
											</h2>
										</div>
										<div className='flex-1 min-w-0'>
											<p className='text-sm text-gray-500 truncate'>
												{artwork.artist}
											</p>
										</div>
										<div className='text-sm text-gray-500 w-24 flex-shrink-0'>
											{artwork.status}
										</div>
										<div className='text-sm text-gray-500 w-24 flex-shrink-0'>
											{artwork.genre}
										</div>
										<div className='text-sm text-gray-500 w-36 flex-shrink-0'>
											{artwork.length}
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				)
			case "two-line":
				return (
					<div>
						{/* 項目のタイトル (ソート可能) */}
						<div className='hidden md:flex bg-gray-200 text-gray-700 text-sm font-semibold p-2 rounded-t-lg'>
							<button
								className='text-left w-12 cursor-pointer flex-shrink-0'
								onClick={() => handleSortClick("is_important")}
							>
								重要 {renderSortArrow("is_important")}
							</button>
							<button
								className='text-left w-20 cursor-pointer flex-shrink-0'
								onClick={() => handleSortClick("rating")}
							>
								評価 {renderSortArrow("rating")}
							</button>
							<button
								className='text-left flex-1 min-w-0 cursor-pointer'
								onClick={() => handleSortClick("title")}
							>
								作品名 {renderSortArrow("title")}
							</button>
							<button
								className='text-left flex-1 min-w-0 cursor-pointer'
								onClick={() => handleSortClick("artist")}
							>
								作者名 {renderSortArrow("artist")}
							</button>
							<button
								className='text-left w-24 cursor-pointer flex-shrink-0'
								onClick={() => handleSortClick("status")}
							>
								状態 {renderSortArrow("status")}
							</button>
							<button
								className='text-left w-24 cursor-pointer flex-shrink-0'
								onClick={() => handleSortClick("genre")}
							>
								ジャンル {renderSortArrow("genre")}
							</button>
							<button
								className='text-left w-36 cursor-pointer flex-shrink-0'
								onClick={() => handleSortClick("length")}
							>
								長さ {renderSortArrow("length")}
							</button>
						</div>
						<ul className='divide-y divide-gray-200'>
							{filteredAndSortedArtworks.map((artwork) => (
								<li
									key={artwork.id}
									className='py-4 px-2 flex flex-col hover:bg-gray-50 transition-colors'
								>
									{/* 1行目 */}
									<div className='flex items-center space-x-4 mb-2'>
										<div className='text-sm w-12 flex-shrink-0'>
											<span className='text-gray-500'>
												{artwork.is_important ? "✔" : " "}
											</span>
										</div>
										<div className='text-sm font-medium text-gray-700 w-20 flex-shrink-0'>
											{artwork.rating}
										</div>
										<div className='flex-1 min-w-0'>
											<h2 className='text-xl font-bold text-gray-900 truncate'>
												{artwork.title}
											</h2>
										</div>
										<div className='flex-1 min-w-0'>
											<p className='text-sm text-gray-500 truncate'>
												{artwork.artist}
											</p>
										</div>
										<div className='text-sm text-gray-500 w-24 flex-shrink-0'>
											{artwork.status}
										</div>
										<div className='text-sm text-gray-500 w-24 flex-shrink-0'>
											{artwork.genre}
										</div>
										<div className='text-sm text-gray-500 w-36 flex-shrink-0'>
											{artwork.length}
										</div>
									</div>
									{/* 2行目 */}
									<div className='flex items-center space-x-4 pl-12 text-sm text-gray-600'>
										<div className='flex-1 min-w-0'>
											<p>カテゴリ: {artwork.category}</p>
										</div>
										<div className='flex-1 min-w-0'>
											<p>タグ: {artwork.tags.join(", ")}</p>
										</div>
										<div className='flex-1 min-w-0'>
											<p>年代: {artwork.era}</p>
										</div>
										<div className='flex-1 min-w-0'>
											<p>対象年齢: {artwork.target_age}</p>
										</div>
										<div className='flex-1 min-w-0'>
											<a
												href={artwork.impressions_url}
												className='text-indigo-600 hover:underline'
											>
												感想
											</a>
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				)
			case "thumbnail":
				return (
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
						{filteredAndSortedArtworks.map((artwork) => (
							<div
								key={artwork.id}
								className='bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out'
							>
								<img
									src={artwork.thumbnail_url}
									alt={artwork.title}
									className='w-full h-48 object-cover object-center'
									onError={(e) => {
										const target = e.currentTarget as HTMLImageElement
										target.onerror = null
										target.src = "https://placehold.co/400x300?text=画像なし"
									}}
								/>
								<div className='p-4'>
									<h3 className='text-md font-bold text-gray-900 truncate'>
										{artwork.title}
									</h3>
									<p className='text-sm text-gray-500'>{artwork.artist}</p>
								</div>
							</div>
						))}
					</div>
				)
			default:
				return null
		}
	}

	return (
		<div className='min-h-screen bg-gray-100 p-4 sm:p-8 font-sans antialiased'>
			<div className='max-w-4xl mx-auto'>
				<div className='bg-white rounded-2xl shadow-xl p-6 sm:p-8'>
					<div className='flex justify-between items-center mb-6 flex-wrap'>
						<h1 className='text-3xl font-extrabold text-gray-900 tracking-tight mb-4 sm:mb-0'>
							作品リスト
						</h1>
						<div className='flex space-x-2 rounded-full bg-gray-200 p-1 flex-wrap'>
							<button
								type='button'
								onClick={() => setDisplayMode("one-line")}
								className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
									displayMode === "one-line"
										? "bg-indigo-600 text-white shadow-md"
										: "text-gray-700 hover:bg-gray-300"
								}`}
							>
								1行
							</button>
							<button
								type='button'
								onClick={() => setDisplayMode("two-line")}
								className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
									displayMode === "two-line"
										? "bg-indigo-600 text-white shadow-md"
										: "text-gray-700 hover:bg-gray-300"
								}`}
							>
								2行
							</button>
							<button
								type='button'
								onClick={() => setDisplayMode("thumbnail")}
								className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
									displayMode === "thumbnail"
										? "bg-indigo-600 text-white shadow-md"
										: "text-gray-700 hover:bg-gray-300"
								}`}
							>
								サムネイル
							</button>
						</div>
					</div>
					{/* フィルタリングとソートのコントロール */}
					<div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6'>
						<div className='flex items-center space-x-2'>
							<label
								htmlFor={filterRatingId}
								className='text-sm font-medium text-gray-700'
							>
								評価で絞り込み:
							</label>
							<select
								id={filterRatingId}
								className='rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
								value={filter.rating}
								onChange={(e) =>
									setFilter({ ...filter, rating: e.target.value })
								}
							>
								<option value='すべて'>すべて</option>
								<option value='Tier1'>Tier1</option>
								<option value='Tier2'>Tier2</option>
								<option value='Tier3'>Tier3</option>
								<option value='普通or自分に合わない'>
									普通or自分に合わない
								</option>
							</select>
						</div>
						<div className='flex items-center space-x-2'>
							<label
								htmlFor={sortById}
								className='text-sm font-medium text-gray-700'
							>
								並び替え:
							</label>
							<select
								id={sortById}
								className='rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
								value={sort.key}
								onChange={(e) =>
									setSort({ ...sort, key: e.target.value as ArtworkKey })
								}
							>
								<option value='rating'>評価</option>
								<option value='title'>作品名</option>
								<option value='artist'>作者名</option>
								<option value='year'>年代</option>
								<option value='target_age'>対象年齢</option>
							</select>
							<button
								type='button'
								onClick={() =>
									setSort({
										...sort,
										order: sort.order === "asc" ? "desc" : "asc"
									})
								}
								className='p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors'
							>
								{sort.order === "asc" ? "▲" : "▼"}
							</button>
						</div>
					</div>
					{renderArtworkList()}
				</div>
			</div>
		</div>
	)
}
