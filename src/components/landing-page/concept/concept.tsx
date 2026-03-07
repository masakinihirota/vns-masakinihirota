"use client";

import React from "react";
import type { ConceptPhase, WorkChain } from "./concept.logic";

/**
 * プレゼンテーション用Props
 */
type ConceptProps = {
  readonly phases: readonly ConceptPhase[];
  readonly workChains: readonly WorkChain[];
  readonly ghostText: string;
  readonly note: string;
};

/**
 * 価値観サイトコンセプトページ UIコンポーネント
 * デザインガイドラインに基づき、グラスモーフィズム(Light)とエレガント(Dark)を意識したスタイル
 */
export const Concept: React.FC<ConceptProps> = ({
  phases,
  workChains,
  ghostText,
  note,
}) => {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 max-w-4xl mx-auto text-left">
      <header className="mb-4">
        <h1 className="text-2xl font-bold mb-4">{ghostText}</h1>
      </header>

      <section>
        <ol className="flex flex-col gap-4 list-decimal list-inside">
          {phases.map((phase) => (
            <li key={phase.id} className="p-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md shadow-sm transition-all hover:shadow-md">
              <strong className="text-lg font-bold mr-2">{phase.title}：</strong>
              <span className="leading-relaxed">{phase.description}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8 border-t border-[var(--border-color)] pt-8">
        <h2 className="text-xl font-bold mb-6">作成例</h2>

        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/20 backdrop-blur-lg shadow-inner">
            <h3 className="text-lg font-medium mb-4 opacity-80">仮面(＝プロフィール)</h3>
            <h2 className="text-lg font-medium mb-4 opacity-80">
              好きな作品、自分の価値観、持っているスキルなどで作成します。
            </h2>

            <div className="p-6 rounded-xl bg-blue-500/5 border border-blue-500/10 backdrop-blur-sm space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
                  <span className="font-bold shrink-0">好きな作品</span>
                  {workChains.map((chain, index) => (
                    <div key={index} className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                      <span className="text-base">{chain.workTitle}</span>
                      {chain.tier === "T1" && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-white leading-none tracking-tight shadow-sm shrink-0">
                          Tier1
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-base opacity-70 leading-relaxed">
                  {note}
                </p>
              </div>

              <div className="pt-6 border-t border-blue-500/10 flex flex-col gap-8">
                {workChains.map((chain, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-bold">作品</span>
                      <span>{chain.workTitle}</span>
                      <a
                        href={chain.workUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline break-all text-base"
                      >
                        {chain.workUrl}
                      </a>
                    </p>
                    <p className="flex flex-col gap-1 ml-4 border-l-2 border-blue-500/30 pl-4">
                      <span className="text-base font-bold opacity-70">{chain.chainTitle}</span>
                      <a
                        href={chain.chainUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline break-all"
                      >
                        {chain.chainLabel}
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        div {
          color: #0b0f1a;
        }
        :global(.dark) div {
          color: #f1f1f1;
        }
      `}</style>
    </div>
  );
};
