import { dummyWorks } from "../dummy_db"

import Component from "@/components/v0/v0_60/01_now-favorites"

export default function NowFavoritesPage() {
	return (
		<div className='p-4'>
			<Component works={dummyWorks} />
		</div>
	)
}
