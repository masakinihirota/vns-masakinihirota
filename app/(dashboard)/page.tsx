import Link from "next/link";
import { Button } from "../button/Button";

export default function Home() {
	return (
		<main>
			メインページ
			<br />
			<Link href="./ModeTogglePage">ModeTogglePage</Link>
			<br />
			<Button label="Storybook Test Button" />
			<br />
			{/* 見本: Honoページへのリンク */}
			<Link href="./hono">hono</Link>
			<br />
			フッター
		</main>
	);
}

