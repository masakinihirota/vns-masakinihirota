import { dummyFutureWorks } from "../dummy_db"

import Component from "@/components/AI/v0/v0_user_profiles/03_future-works"

export default function FutureWorksPage() {
	return (
		<section className='mb-8'>
			<h2 className='text-xl font-semibold mb-2'>03_future-works</h2>
			<Component works={dummyFutureWorks} />
		</section>
	)
}
