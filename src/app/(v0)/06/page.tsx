import { dummyWorks } from "../dummy_db"

import Component02 from "@/components/v0/v0_60/06_life-component"

const LifeComponentPage = () => {
	return (
		<div>
			<Component02 works={dummyWorks} />
		</div>
	)
}

export default LifeComponentPage
