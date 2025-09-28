import { dummyWorks } from "../../../dummy_db"

import Component from "@/components_sample/AI/v0/v0/v0_user_profiles/01_now-favorites"

export default function NowFavoritesPage() {
	return (
		<div className='p-4'>
			<Component works={dummyWorks} />
		</div>
	)
}
