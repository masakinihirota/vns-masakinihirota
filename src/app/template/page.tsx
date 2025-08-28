import * as Route1Components from "../../../../ /components/[Feature1]"

/**
 * Route1Pageコンポーネント
 * /route1 のページを表示します。
 */
const Route1Page = () => {
	return (
		<div>
			<h1>Route 1 Page</h1>
			<Route1Components.ComponentA />
			<Route1Components.ComponentB />
		</div>
	)
}

export default Route1Page
