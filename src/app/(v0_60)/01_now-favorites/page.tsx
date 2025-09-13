import Component from "@/components/v0/v0_60/01_now-favorites"

export default function NowFavoritesPage() {
	// ダミーデータをインポート
	// src\app\(v0_60)\dummy_db.tsx

	return (
		<div className='p-4'>
			<Component works={works} />
		</div>
	)
}
