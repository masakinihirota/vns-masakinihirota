import { Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

export const Footer = () => {
  const footerSections = [
    {
      title: "Resource",
      links: [
        { label: "ヘルプセンター", href: "/help" },
        { label: "よくある質問 (FAQ)", href: "/help/faq" },
        { label: "用語集", href: "/help/glossary" },
      ],
    },
    {
      title: "Philosophy",
      links: [
        { label: "オアシス宣言", href: "/help/oasis-declaration" },
        { label: "人間宣言", href: "/human" },
        { label: "孤独感尺度", href: "/global-loneliness-measures" },
      ],
    },
    {
      title: "Legal & Support",
      links: [
        { label: "利用規約", href: "/terms-service" },
        { label: "プライバシーポリシー", href: "/terms-service" }, // 仮設
        { label: "お問い合わせ", href: "/help" }, // 暫定
      ],
    },
  ];

  return (
    <footer className="pt-24 pb-12 border-t border-white/5 mt-24 animate-fade-in-up delay-600">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-2 md:col-span-1 space-y-6">
          <Link
            href="/"
            className="text-2xl font-black italic tracking-tighter text-white"
          >
            VNS <span className="text-blue-500">PROJECT</span>
          </Link>
          <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
            価値観でつながるネットワークサービス。
            「昨日僕が感動した作品を、今日の君はまだ知らない。」
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/masakinihirota/vns-masakinihirota"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all"
              title="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        {footerSections.map((section) => (
          <div key={section.title} className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
              {section.title}
            </h4>
            <ul className="space-y-4">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-blue-400 transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    {link.href.startsWith("http") && (
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5 text-[10px] text-neutral-600 uppercase tracking-widest font-bold">
        <p>© 2026 VNS masakinihirota Project. All rights reserved.</p>
        <p>No BAN, Just Drift. Welcome to the Oasis.</p>
      </div>
    </footer>
  );
};
