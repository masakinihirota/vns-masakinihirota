import { dummyWorks } from "../dummy_db"

import Component from "@/components/v0/v0_60/02_life-component"

export default function LifeComponentPage() {
	return (
		<section className='mb-8'>
			<h2 className='text-xl font-semibold mb-2'>02_life-component</h2>
			<Component works={dummyWorks} />
		</section>
	)
}
