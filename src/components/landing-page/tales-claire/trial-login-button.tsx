"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

export const TrialLoginButton = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleTrialStart = async () => {
    const supabase = createClient();

    startTransition(async () => {
      const { error } = await supabase.auth.signInAnonymously();

      if (error) {
        console.error("Anonymous login error:", error);
        router.push("/login?type=trial&error=anonymous_sign_in_failed");
        return;
      }

      // 成功時はプロフィール作成（受肉）ページへ
      router.push("/user-profiles/new");
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleTrialStart}
        disabled={isPending}
        className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 px-8 py-5 text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg backdrop-blur-md"
      >
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>お試しログイン</span>
          </div>
          <span className="text-xs text-neutral-400 font-medium tracking-wider">
            {isPending ? "開始中..." : "匿名で今すぐ始める"}
          </span>
        </div>
      </button>
      <p className="text-[10px] text-neutral-500 text-center px-4">
        ※データが保存されず、消える可能性があります。
      </p>
    </div>
  );
};
