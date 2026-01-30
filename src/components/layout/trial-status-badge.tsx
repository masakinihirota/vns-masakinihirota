import React from "react";
import { Badge } from "@/components/ui/badge";

export function TrialStatusBadge() {
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-full">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
      </span>
      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300">
        お試し体験中
      </span>
    </div>
  );
}
