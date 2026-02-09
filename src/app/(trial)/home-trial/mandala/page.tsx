import { Metadata } from "next";
import * as Mandala from "@/components/mandala-chart";

export const metadata: Metadata = {
  title: "マンダラチャート (体験版) | 目標達成支援ツール",
  description:
    "登録不要で試せるマンダラチャート。大目標を8つの要素に分解し、具体的な行動計画を作成できます。",
};

/**
 * マンダラチャートページ (体験版)
 */
export default function MandalaChartTrialPage() {
  return <Mandala.MandalaChart />;
}
