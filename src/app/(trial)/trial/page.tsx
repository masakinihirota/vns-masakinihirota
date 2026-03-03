import * as Onboarding from "@/components/trial";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "お試し体験 - 匿名星座選択",
  description: "星座を選んで、あなただけの匿名名を作成しましょう。",
};

export default function OnboardingTrialPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-background via-background to-accent/20">
      <div className="container max-w-4xl mx-auto pt-20 pb-12">
        <div className="flex flex-col items-center gap-4 mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 animate-in fade-in zoom-in duration-1000">
            <Sparkles className="h-3 w-3" />
            <span>Trial Experience</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            星々の導きを受ける
          </h1>
        </div>

        <div className="relative">
          {/* 装飾用背景 */}
          <div className="absolute -top-24 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

          <Onboarding.OnboardingFlow />
        </div>
      </div>
    </main>
  );
}
