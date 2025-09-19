"use client"

import MangaRatingList from "@/components/(__etc)/AI/v0/v0_etc/32_manga-rating-list"

const Page32 = () => {
	return (
		<div>
			<h1>32 Component</h1>
			{/* MangaRatingList */}
			<MangaRatingList
				userPoints={0}
				onLike={() => console.log("Liked")}
				onUnlike={() => console.log("Unliked")}
			/>
		</div>
	)
}

export default Page32
