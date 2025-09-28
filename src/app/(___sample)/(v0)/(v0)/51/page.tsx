import Component from "@/components_sample/AI/v0/v0/v0_user_profiles/51_user-profile-details"

const Page51 = () => {
	const userProfile = {
		name: "山田 太郎",
		username: "yamada_taro",
		email: "taro@example.com",
		avatar: "/placeholder.svg?height=100&width=100",
		occupation: "ソフトウェアエンジニア",
		location: "東京都",
		joinDate: "2023年4月1日",
		favoriteWorks: [
			{ id: "1", title: "進撃の巨人", type: "anime", tier: 1 },
			{ id: "2", title: "ワンピース", type: "manga", tier: 2 },
			{ id: "3", title: "新世紀エヴァンゲリオン", type: "anime", tier: 1 }
		]
	}

	return (
		<div>
			<h1>51 Component</h1>
			<Component {...userProfile} />
		</div>
	)
}

export default Page51
