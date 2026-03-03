"use client";

import {
  ChevronRight,
  Ghost,
  Link as LinkIcon,
  PlayCircle,
  UserCircle,
  UserPlus,
  Users
} from "lucide-react";
import { CONCEPT_PHASES, LINKAGE_CONCEPT, type ConceptPhase } from "./concept-explanation.logic";

/**
 * アイコンマッピング
 */
const IconMap = {
  Ghost,
  UserCircle,
  Users,
  UserPlus,
  PlayCircle,
} as const;

/**
 * プレゼンテーションコンポーネント
 */
export function ConceptExplanation() {
  return (
    <div className="space-y-16 py-12 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Identity & Connection
        </h1>
        <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
          「幽霊」から始まる、あなたの価値観と作品の物語。
        </p>
      </header>

      {/* Lifecycle Sections */}
      <section className="space-y-12">
        <h2 className="text-2xl font-semibold flex items-center gap-3 border-b border-white/10 pb-4">
          <span className="bg-indigo-500/20 p-2 rounded-lg">
            <UserCircle className="w-6 h-6 text-indigo-400" />
          </span>
          ユーザーライフサイクル
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CONCEPT_PHASES.map((phase) => (
            <PhaseCard key={phase.id} phase={phase} />
          ))}
        </div>
      </section>

      {/* Linkage Section */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -m-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -m-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-4">
              <span className="bg-purple-500/20 p-3 rounded-2xl">
                <LinkIcon className="w-8 h-8 text-purple-400" />
              </span>
              {LINKAGE_CONCEPT.title}
            </h2>
            <div className="inline-block px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium">
              メタファー: {LINKAGE_CONCEPT.metaphor}
            </div>
            <p className="text-lg text-neutral-300 leading-relaxed">
              {LINKAGE_CONCEPT.description}
            </p>
          </div>

          <div className="flex-1 w-full max-w-sm">
            <div className="aspect-square rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex items-center justify-center relative shadow-inner">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-4 border-dashed border-purple-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
              </div>
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-indigo-500/30 flex items-center justify-center">
                    <PlayCircle className="w-6 h-6 text-indigo-300" />
                  </div>
                  <div className="w-8 h-0.5 bg-neutral-600" />
                  <div className="w-12 h-12 rounded-lg bg-purple-500/30 flex items-center justify-center">
                    <LinkIcon className="w-6 h-6 text-purple-300" />
                  </div>
                </div>
                <span className="text-sm font-medium text-neutral-400">作品と作品の繋がり</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Meta */}
      <footer className="pt-12 text-center text-sm text-neutral-500 border-t border-white/5">
        <p>千の仮面（Persona Strategy）/ 布教の文化（Propagation Culture）</p>
      </footer>
    </div>
  );
}

/**
 * フェーズカード
 */
function PhaseCard({ phase }: { phase: ConceptPhase }) {
  const Icon = IconMap[phase.icon as keyof typeof IconMap];

  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:bg-white/10 transition-all duration-300 shadow-sm hover:shadow-xl">
      <div className="absolute top-4 right-4 text-4xl font-black text-white/5 group-hover:text-white/10 transition-colors">
        {phase.number}
      </div>

      <div className="space-y-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-indigo-400" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-neutral-100 mb-1">{phase.title}</h3>
          <p className="text-xs font-medium text-indigo-400/80 uppercase tracking-wider">
            メタファー: {phase.metaphor}
          </p>
        </div>

        <p className="text-sm text-neutral-400 leading-relaxed">
          {phase.description}
        </p>

        <div className="pt-2 flex items-center text-xs font-semibold text-neutral-500 group-hover:text-indigo-400 transition-colors">
          詳細はこちら <ChevronRight className="w-3 h-3 ml-1" />
        </div>
      </div>
    </div>
  );
}
