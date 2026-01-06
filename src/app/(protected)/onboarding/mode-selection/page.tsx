import React from "react";
import * as Onboarding from "@/components/onboarding/mode-selection";

/**
 * 経験モード選択ページ
 * ルートアカウント作成直後に、ゲーミフィケーション・モードかスタンダード・モードかを選択する。
 */
export default function ModeSelectionPage() {
  return (
    <div className="container mx-auto py-10">
      <Onboarding.ModeSelectionContainer />
    </div>
  );
}
