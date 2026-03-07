import { Github } from "lucide-react";
import Link from "next/link";

const footerSections = [
    {
        title: "Resource",
        links: [
            { label: "ヘルプセンター", href: "/help" },
            { label: "よくある質問 (FAQ)", href: "/faq" },
        ],
    },
    {
        title: "Philosophy",
        links: [
            { label: "善き人生", href: "/good-life" },
            { label: "サニボナニ", href: "/sanibonani" },
            { label: "断頭台の演説", href: "/legendary-speech" },
        ],
    },
    {
        title: "Legal & Support",
        links: [
            { label: "利用規約", href: "/help" },
            { label: "お問い合わせ", href: "/help" },
        ],
    },
] as const;

export function Footer() {
    return (
        <footer className="mt-24 border-t border-slate-200 pb-12 pt-24 dark:border-white/5">
            <div className="mb-16 grid grid-cols-2 gap-12 md:grid-cols-4">
                <div className="col-span-2 space-y-6 md:col-span-1">
                    <Link
                        href="/"
                        className="text-2xl font-black tracking-tighter text-slate-900 dark:text-foreground"
                    >
                        VNS
                    </Link>
                    <p className="max-w-xs text-lg leading-relaxed text-slate-600 dark:text-muted-foreground">
                        価値観でつながるネットワークサービス。「昨日僕が感動した作品を、今日の君はまだ知らない。」
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/masakinihirota/vns-masakinihirota"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-slate-100 p-2 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-900 dark:bg-white/5 dark:text-muted-foreground dark:hover:bg-white/10 dark:hover:text-foreground"
                            title="GitHub Repository"
                        >
                            <Github className="h-5 w-5" />
                        </a>
                    </div>
                </div>

                {footerSections.map((section) => (
                    <div key={section.title} className="space-y-6">
                        <h4 className="text-lg font-black uppercase tracking-[0.2em] text-slate-500 dark:text-muted-foreground">
                            {section.title}
                        </h4>
                        <ul className="space-y-4">
                            {section.links.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="flex items-center gap-1 text-lg text-slate-600 transition-colors hover:text-blue-600 dark:text-muted-foreground dark:hover:text-blue-500"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="flex flex-col items-center justify-between gap-6 border-t border-slate-200 pt-12 text-lg font-bold uppercase tracking-widest text-slate-500 dark:border-white/5 dark:text-muted-foreground md:flex-row">
                <p>© 2026 VNS masakinihirota Project. All rights reserved.</p>
                <p>No BAN, Just Drift. Welcome to the Oasis.</p>
            </div>
        </footer>
    );
}
