"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import React from "react";
import { TrialLoginButton } from "./trial-login-button";

export const StartLinksSection = () => {
  return (
    <section id="start" className="py-12 animate-fade-in-up delay-400">
      <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* お試しログイン (Client Component) */}
          <TrialLoginButton />

          {/* 本格ログイン */}
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 px-8 py-5 text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-500/20 ring-1 ring-white/20"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 font-bold text-lg">
                  <ShieldCheck className="w-5 h-5" />
                  <span>本格ログイン</span>
                </div>
                <span className="text-xs text-indigo-100 font-medium tracking-wider">
                  データを永続化して楽しむ
                </span>
              </div>
            </Link>
            <p className="text-[10px] text-indigo-400/80 text-center px-4 font-bold">
              GitHub・Google認証対応。データを保存します。
            </p>
          </div>
        </div>

        <p className="text-sm text-neutral-500 font-serif italic mt-4">
          あなたの「感動」を、一生ものにするために。
        </p>
      </div>
    </section>
  );
};
