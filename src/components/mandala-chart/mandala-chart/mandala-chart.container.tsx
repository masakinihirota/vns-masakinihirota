"use client";

import { Grid, Trash2, Layout } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MandalaChart } from "./mandala-chart";

export function MandalaChartContainer() {
  const [chartData, setChartData] = useState<string[][]>(() =>
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(""))
  );

  const loadExampleData = () => {
    const exampleData = Array(9)
      .fill(null)
      .map(() => Array(9).fill(""));

    // Block 4: Center theme
    exampleData[4][4] = "人生の目的：豊かな人生を送る";
    exampleData[4][0] = "健康";
    exampleData[4][1] = "仕事";
    exampleData[4][2] = "趣味";
    exampleData[4][3] = "家族";
    exampleData[4][5] = "学び";
    exampleData[4][6] = "貢献";
    exampleData[4][7] = "お金";
    exampleData[4][8] = "遊び";

    // Block 0: 健康
    exampleData[0][4] = "健康";
    exampleData[0][0] = "早寝早起き";
    exampleData[0][1] = "週3回のランニング";
    exampleData[0][2] = "自炊を増やす";

    setChartData(exampleData);
  };

  const clearData = () => {
    setChartData(
      Array(9)
        .fill(null)
        .map(() => Array(9).fill(""))
    );
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
            <Layout className="text-indigo-600" size={28} />
            Mandala Goal Chart (Split Mode)
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Markdownで思考し、マンダラ図で俯瞰する
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadExampleData} variant="outline" className="gap-2">
            <Grid size={16} /> 構成案を読み込む
          </Button>
          <Button
            onClick={clearData}
            variant="ghost"
            className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2"
          >
            <Trash2 size={16} /> 初期化
          </Button>
        </div>
      </div>

      <MandalaChart initialData={chartData} onChange={setChartData} />
    </div>
  );
}
