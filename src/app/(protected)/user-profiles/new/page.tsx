"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserProfileCreationContainer } from "@/components/user-profiles/create";
import {
  createLocalUserProfile,
  getDeviceId,
} from "@/lib/db/local-storage-adapter";
import { CreateProfileData } from "@/lib/types/user-profile";

export default function CreateProfilePage() {
  const router = useRouter();
  const [isTrial, setIsTrial] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 簡易的な体験版判定: URLやローカルストレージの設定を見る
    // ここでは homeTrialConfig があれば体験版とみなす、またはパスで判断
    if (typeof window !== "undefined") {
      const isTrialConfig = window.localStorage.getItem("homeTrialConfig");
      // もしくは、リファラーや特定のクエリパラメータで判断も可
      // 現状はシンプルに "認証情報が取れない" かつ "作成しようとしている" 場合のフォールバックとして機能させる
      // ただし、明示的に体験モードであることを知る術が必要
      if (isTrialConfig) {
        setIsTrial(true);
      }
    }
  }, []);

  const handleComplete = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // データ変換
      const createData: CreateProfileData = {
        display_name: formData.displayName,
        role_type: formData.role.toLowerCase(), // Leader/Member -> leader/member
        role: formData.role.toLowerCase() as "leader" | "member",
        profile_format: "profile", // Default
        purposes: formData.purposes,
        profile_type: "self",
        // 他のフィールドも必要に応じてマッピング
        // works, values などは現状の UserProfile 型にはないので、jsonb (external_links) に逃がすか、正規化が必要
        // ここではデモ用として最低限のカラムを保存
      };

      if (isTrial || true) {
        // TODO: 本番実装時に正しい分岐条件にする(今は強制的にTrialロジックも動くようにしておく for Demo)
        // ローカル保存
        const deviceId = getDeviceId();
        await createLocalUserProfile(deviceId, createData);

        // 完了後、体験版ホームへ
        // 少し待ってから遷移（UX）
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/home-trial");
      } else {
        // Server Action 呼び出し (未実装)
        alert("本番保存機能は現在開発中です。");
      }
    } catch (error) {
      console.error("Profile creation failed", error);
      alert("プロフィールの作成に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-7xl mx-auto">
        <UserProfileCreationContainer
          onComplete={handleComplete}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
