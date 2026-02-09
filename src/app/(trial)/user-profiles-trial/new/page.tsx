"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserProfileCreationContainer } from "@/components/user-profiles/create";
import {
  createLocalUserProfile,
  getDeviceId,
} from "@/lib/db/local-storage-adapter";
import { CreateProfileData } from "@/lib/types/user-profile";

export default function CreateProfilePageTrial() {
  const router = useRouter();
  // 送信状態の管理
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      };

      // ローカル保存
      const deviceId = getDeviceId();
      await createLocalUserProfile(deviceId, createData);

      // 完了後、体験版ホームへ
      // 少し待ってから遷移（UX）
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/home-trial");
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
