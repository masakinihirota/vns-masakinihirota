import Component from "@/components/v0/v0_60/01_now-favorites"

export default function NowFavoritesPage() {
	const works = [
		{ id: "1", title: "作品A", tier: 1, type: "anime" },
		{ id: "2", title: "作品B", tier: 2, type: "manga" },
		{ id: "3", title: "作品C", tier: 3, type: "anime" }
	]

	return (
		<div className='p-4'>
			<Component works={works} />
		</div>
	)
}
