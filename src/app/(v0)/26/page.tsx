import dummyWorks from "@/components/v0/v0_60/26_dummyData.json"
import FavoriteWorks, {
	type Work
} from "@/components/v0/v0_60/26_favorite-works"

const Page26 = () => {
	return (
		<div>
			<h1>26 Favorite Work Components</h1>
			<FavoriteWorks name='マイリスト' works={dummyWorks as Work[]} />
		</div>
	)
}

export default Page26
