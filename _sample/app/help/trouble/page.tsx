import type { Metadata } from "next";

import { TroubleShooting } from "@/components/help";


export const metadata: Metadata = {
  title: "ネット問題 トラブル対応集 | VNS Help",
  description: "ネットトラブルの重大度レベル別対応ガイド",
};

/**
 *
 */
export default function TroublePage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <TroubleShooting />
    </div>
  );
}
