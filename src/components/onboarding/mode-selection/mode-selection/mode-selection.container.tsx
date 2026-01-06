"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { ModeSelection } from "./mode-selection";
import { determineRedirectPath } from "./mode-selection.logic";

export const ModeSelectionContainer: React.FC = () => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  const handleSelect = async (isGamification: boolean) => {
    setIsSaving(true);
    try {
      // ユーザーのルートアカウント属性を更新する (仮定的な実装)
      // 実際にはAPIルートまたはServer Actions経由が推奨されるが、ここでは直接RPC的な更新を試みる
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("ユーザーが認証されていません。");
      }

      // onboarding_metadata などのカラムに保存すると仮定
      const { error } = await supabase
        .from("root_accounts")
        .update({
          is_gamification: isGamification,
          onboarding_step: "completed",
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("モードを設定しました。");

      // リダイレクト先の決定
      const redirectPath = determineRedirectPath(isGamification);
      router.push(redirectPath);
    } catch (error) {
      console.error("Mode selection error:", error);
      toast.error("設定の保存に失敗しました。もう一度お試しください。");
    } finally {
      setIsSaving(false);
    }
  };

  return <ModeSelection onSelect={handleSelect} isSaving={isSaving} />;
};
