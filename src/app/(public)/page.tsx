import React from "react";
import Link from "next/link";

export default function Page() {
	return (
		<main className=''>
			■HOMEのページ
			<br />
			{/* サンプルへのリンク */}
			<Link href='/sample'>Sampleページへ</Link>
		</main>
	)
}
