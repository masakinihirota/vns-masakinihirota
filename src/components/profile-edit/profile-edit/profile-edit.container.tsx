"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ProfileEdit } from "./profile-edit";
import {
  MOCK_EVALUATIONS,
  MOCK_VALUES,
  MOCK_WORKS,
  createInitialProfile,
  type UserProfile,
} from "./profile-edit.logic";

export const ProfileEditContainer = ({
  profileId,
  initialData,
}: {
  profileId: string;
  initialData?: { [key: string]: string | string[] | undefined };
}) => {
  const router = useRouter();
  const isNew = profileId === "new";

  const [currentPage, setCurrentPage] = useState<"profile" | "portfolio">(
    "profile"
  );
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [viewMode, setViewMode] = useState<"simple" | "tiered">("simple");

  // State initialization
  const [profile, _setProfile] = useState<UserProfile>(
    isNew
      ? {
          ...createInitialProfile(),
          name: (initialData?.display_name as string) || "New User",
          format: (initialData?.profile_format as string) || "profile",
          role: (initialData?.role as string) || "member",
          purposes: Array.isArray(initialData?.purposes)
            ? initialData.purposes
            : typeof initialData?.purposes === "string"
              ? [initialData.purposes]
              : ["work"],
          type: (initialData?.profile_type as string) || "self",
        }
      : {
          name: "マサキ・ニヒロタ", // Mock data for existing profile
          stats: { works: 12, evals: 145, trustDays: 420, points: 12500 },
        }
  );

  const [myWorks, _setMyWorks] = useState(isNew ? [] : MOCK_WORKS);
  const [evaluations, setEvaluations] = useState(isNew ? [] : MOCK_EVALUATIONS);
  const [values, _setValues] = useState(isNew ? [] : MOCK_VALUES);

  // Handlers
  const handleAddWork = () => {
    toast.info("作品追加機能は未実装です（モック）");
  };
  const handleAddEvaluation = () => {
    toast.info("評価追加機能は未実装です（モック）");
  };
  const handleAddValue = () => {
    toast.info("価値観追加機能は未実装です（モック）");
  };
  const handleDeleteEvaluation = (id: number) => {
    if (confirm("削除しますか？")) {
      setEvaluations((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    // 開発モードまたはデモ用のモック保存処理
    if (process.env.NODE_ENV === "development" || isNew) {
      toast.success("【開発モード】プロフィールを保存しました（モック）");
      router.push("/user-profiles");
    } else {
      toast.error("保存機能は未実装です");
    }
  };

  return (
    <ProfileEdit
      mode={isNew ? "create" : "edit"}
      page={currentPage}
      profile={profile}
      myWorks={myWorks}
      evaluations={evaluations}
      values={values}
      selectedCategory={selectedCategory}
      viewMode={viewMode}
      onSetPage={setCurrentPage}
      onSetSelectedCategory={setSelectedCategory}
      onSetViewMode={setViewMode}
      onAddWork={handleAddWork}
      onAddEvaluation={handleAddEvaluation}
      onAddValue={handleAddValue}
      onDeleteEvaluation={handleDeleteEvaluation}
      onBack={handleBack}
      onSave={handleSave}
    />
  );
};
