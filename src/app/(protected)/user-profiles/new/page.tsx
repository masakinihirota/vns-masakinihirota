import { Metadata } from "next";
import { ProfileWizard } from "@/components/user-profiles/create/profile-wizard";

export const metadata: Metadata = {
  title: "名刺作成 | VNS",
  description: "新しいユーザープロフィール（名刺）を作成します。",
};

export default function CreateProfilePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-7xl mx-auto">
        <ProfileWizard />
      </div>
    </div>
  );
}
