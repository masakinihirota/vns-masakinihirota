"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import ModeToggle from "@/components/ModeToggle/mode-toggle";
// import { handleRequest } from "@/utils/auth-helpers/client";
// import { SignOut } from "@/utils/auth-helpers/server";
// import { getRedirectMethod } from "@/utils/auth-helpers/settings";

import s from "./Navbar.module.css";

interface NavlinksProps {
	user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
	const router = getRedirectMethod() === "client" ? useRouter() : null;

	return (
		<div className="relative flex flex-row justify-between py-4 align-center md:py-6">
			<div className="flex items-center flex-1">
				<Link href="/" className={s.logo} aria-label="Logo">
					VNS.BLUE
				</Link>
				<nav className="ml-6 space-x-2 lg:block">
					<ModeToggle />
					<Link className={s.link} href="/">
						言語
					</Link>
					<Link className={s.link} href="/">
						広告
					</Link>
				</nav>
				<nav className="ml-6 space-x-2 lg:block">
					<Link href="/" className={s.link}>
						Pricing
					</Link>
					{user && (
						<Link href="/account" className={s.link}>
							Account
						</Link>
					)}
				</nav>
			</div>
			<div className="flex justify-end space-x-8">
				{user ? (
					<form onSubmit={(e) => handleRequest(e, SignOut, router)}>
						{/* eslint-disable-next-line react-hooks/rules-of-hooks */}
						<input type="hidden" name="pathName" value={usePathname()} />
						<button type="submit" className={s.link}>
							Sign out
						</button>
					</form>
				) : (
					<Link href="/signin" className={s.link}>
						Sign In
					</Link>
				)}
			</div>
		</div>
	);
}
