import * as Mandala from "@/components/mandala-chart";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "マンダラチャート | 目標達成シート",
  description: "大目標を中目標、小目標へと分解し、体系的に整理するためのマンダラチャート（マンダラート）作成ツールです。",
};

/**
 * マンダラチャートページ
 * (public) グループ内に配置され、誰でもアクセス可能
 */
export default function MandalaPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50 via-white to-purple-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-12">
      <div className="container px-4">
        <header className="mb-12 text-center space-y-4 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral-900 dark:text-neutral-100">
            Mandala Chart <span className="text-blue-600">Simple</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-neutral-600 dark:text-neutral-400">
            思考を整理し、目標を具現化する。
            9x9のグリッドで、あなたのビジョンを体系的に分解しましょう。
          </p>
        </header>

        <section className="animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
          <Mandala.MandalaChart />
        </section>

        <footer className="mt-20 text-center text-sm text-neutral-500 dark:text-neutral-500 border-t border-neutral-100 dark:border-neutral-800 pt-8">
          <p>© 2026 Mandala Chart Simple. すべてのデータはブラウザに自動保存されます。</p>
        </footer>
      </div>
    </main>
  );
}
