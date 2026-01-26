"use client";

import Link from "next/link";
import React from "react";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/5">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter text-white"
        >
          VNS
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href="/help"
            className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            ドキュメント
          </Link>
          <Link
            href="/help/faq"
            className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="/login"
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-bold border border-white/10 transition-all"
          >
            ログイン
          </Link>
        </div>
      </div>
    </nav>
  );
};
