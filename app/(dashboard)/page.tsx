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
			フッター
		</main>
	);
}

