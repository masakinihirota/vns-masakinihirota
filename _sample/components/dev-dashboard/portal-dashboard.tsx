"use client";

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Circle,
  RotateCcw,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import { usePortalDashboard } from "./portal-dashboard.logic";

/**
 * 開発者向けポータルダッシュボード。
 * システム内の各ルートへのリンクと、その開発ステータスを管理します。
 */
export function PortalDashboard() {
  const {
    isLoaded,
    setStatus,
    moveRoute,
    resetAll,
    resetOrder,
    displayRoutes,
    completedCount,
    focusCount,
    progress,
    totalCount,
    routeStatuses,
  } = usePortalDashboard();

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0B0F1A] p-4 md:p-6 font-sans transition-colors duration-500">
      <main className="w-full space-y-6">
        {/* Header Section */}
        <section className="bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-white/20 dark:border-white/5 p-6 rounded-[2rem] shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral-900 dark:text-neutral-100 uppercase italic">
                VNS{" "}
                <span className="text-neutral-900 dark:text-neutral-100">
                  Roadmap
                </span>
              </h1>
              <p className="text-lg text-neutral-800 dark:text-neutral-200 font-medium">
                開発進捗管理（チェックシート形式）
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 min-w-[320px]">
              <div className="flex justify-between w-full text-lg font-bold uppercase tracking-widest px-1">
                <span className="text-neutral-900 dark:text-neutral-100">
                  Done: {completedCount}
                </span>
                <span className="text-neutral-900 dark:text-neutral-100">
                  Focus: {focusCount}
                </span>
                <span className="text-neutral-900 dark:text-neutral-100">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress
                value={progress}
                className="h-3 w-full bg-neutral-200 dark:bg-white/20"
              />
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetAll}
                  className="h-10 text-lg uppercase font-black tracking-tighter hover:bg-neutral-200 dark:hover:bg-white/10"
                >
                  <RotateCcw size={16} className="mr-2" /> Clear All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetOrder}
                  className="h-10 text-lg uppercase font-black tracking-tighter hover:bg-neutral-200 dark:hover:bg-white/10"
                >
                  <RotateCcw size={16} className="mr-2" /> Default Order
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Links List */}
        <div className="space-y-1 bg-white/40 dark:bg-white/[0.02] backdrop-blur-md rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-[180px_1.5fr_1.5fr_auto] gap-6 px-6 py-4 bg-neutral-200/50 dark:bg-black/40 border-b border-white/10 text-lg font-black uppercase tracking-widest text-neutral-800 dark:text-neutral-100">
            <div className="text-center">Status</div>
            <div>Page Name / Description</div>
            <div className="hidden sm:block">Endpoint / URL</div>
            <div className="w-32 text-center">Order Control</div>
          </div>

          <div className="divide-y divide-neutral-200/50 dark:divide-white/5">
            {displayRoutes.map((route, index) => {
              const status = routeStatuses[route.path] || "todo";
              const isDone = status === "done";
              const isFocus = status === "focus";

              return (
                <div
                  key={route.path}
                  className={cn(
                    "grid grid-cols-[180px_1.5fr_1.5fr_auto] gap-6 px-6 py-4 items-center transition-all group relative hover:bg-neutral-100 dark:hover:bg-white/10",
                    isDone && "bg-emerald-500/[0.08] dark:bg-emerald-500/[0.05]",
                    isFocus && "bg-amber-500/[0.1] dark:bg-amber-500/[0.08]"
                  )}
                >
                  {/* Absolute Clickable Overlay */}
                  <Link
                    href={route.path}
                    className="absolute inset-0 z-0"
                    aria-label={`${route.title} へ移動`}
                  />

                  <div className="flex items-center gap-2 w-[180px] justify-center relative z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setStatus(route.path, "todo")}
                      className={cn(
                        "h-8 w-8 rounded-lg border transition-all",
                        status === "todo"
                          ? "bg-neutral-200 border-neutral-300 dark:bg-white/20 dark:border-white/30 text-neutral-600 dark:text-neutral-300"
                          : "border-transparent opacity-20 hover:opacity-100"
                      )}
                      title="未着手"
                      aria-label={`${route.title} を未着手に設定`}
                    >
                      <Circle size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setStatus(route.path, "done")}
                      className={cn(
                        "h-8 w-8 rounded-lg border transition-all",
                        isDone
                          ? "bg-emerald-500 border-emerald-600 text-white"
                          : "border-transparent opacity-20 hover:opacity-100 text-emerald-600"
                      )}
                      title="完成"
                      aria-label={`${route.title} を完了に設定`}
                    >
                      <CheckCircle2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setStatus(route.path, "focus")}
                      className={cn(
                        "h-8 w-8 rounded-lg border transition-all",
                        isFocus
                          ? "bg-amber-500 border-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse"
                          : "border-transparent opacity-20 hover:opacity-100 text-amber-500"
                      )}
                      title="注目"
                      aria-label={`${route.title} を注視に設定`}
                    >
                      <Zap size={16} fill={isFocus ? "white" : "none"} />
                    </Button>
                  </div>

                  <div className="space-y-0.5 relative z-10 pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 transition-colors">
                        {route.title}
                      </span>
                      {route.isRetired && (
                        <Badge
                          variant="destructive"
                          className="px-3 py-1 text-lg font-black uppercase"
                        >
                          RETIRED
                        </Badge>
                      )}
                      {route.badge && (
                        <Badge
                          variant="secondary"
                          className="px-2 py-0.5 text-xs font-bold uppercase bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        >
                          {route.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg text-neutral-800 dark:text-neutral-200 leading-tight">
                      {route.sectionTitle} • {route.desc}
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-lg font-medium text-neutral-900 dark:text-neutral-100 overflow-hidden relative z-10 pointer-events-none">
                    <code className="bg-neutral-200 dark:bg-neutral-800 px-3 py-1 rounded-md truncate border border-neutral-300 dark:border-neutral-600 font-bold">
                      {route.path}
                    </code>
                    <ArrowRight
                      size={20}
                      className="text-neutral-900 dark:text-neutral-100 ml-2"
                    />
                  </div>

                  <div className="flex gap-0.5 justify-center transition-opacity relative z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-md hover:bg-neutral-200 dark:hover:bg-white/10"
                      disabled={index === 0}
                      onClick={() => moveRoute(index, "up")}
                      aria-label={`${route.title} の順序を上げる`}
                    >
                      <ArrowUp size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-md hover:bg-neutral-200 dark:hover:bg-white/10"
                      disabled={index === totalCount - 1}
                      onClick={() => moveRoute(index, "down")}
                      aria-label={`${route.title} の順序を下げる`}
                    >
                      <ArrowDown size={18} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="w-full pt-10 pb-12 px-6 flex flex-col md:flex-row justify-between items-center gap-6 mt-10 border-t-2 border-neutral-300 dark:border-neutral-700">
        <p className="text-lg font-bold tracking-widest text-neutral-900 dark:text-neutral-100 uppercase">
          &copy; 2026 VNS DevTools • List-Based Roadmap v1.1
        </p>
        <div className="flex gap-12 text-lg font-black tracking-tighter uppercase font-sans">
          <Link
            href="https://github.com/masakinihirota/vns-masakinihirota"
            target="_blank"
            className="text-neutral-900 dark:text-neutral-100 hover:scale-105 transition-transform"
          >
            Repository
          </Link>
          <span className="text-neutral-900 dark:text-neutral-100 border-b-2 border-indigo-500">
            Browser Storage Mode
          </span>
        </div>
      </footer>
    </div>
  );
}
