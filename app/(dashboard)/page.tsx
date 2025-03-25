import Link from "next/link";

export default function Home() {
	return (
		<main>
			メインページ
			<br />
			<Link href="./ModeTogglePage">ModeTogglePage</Link>
			<br />
			フッター
		</main>
	);
}

