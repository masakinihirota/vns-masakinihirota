import { Metadata } from "next";
import React from "react";
import { PopularWorksView } from "@/components/works/popular-works-view";

export const metadata: Metadata = {
  title: "今人気の作品 - VNS masakinihirota",
  description: "VNS全体で今評価されているTier1, 2, 3の作品リストを表示します。",
};

export default function PopularWorksPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <PopularWorksView />
    </div>
  );
}
