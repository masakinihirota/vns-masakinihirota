"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StepIdentityProps {
  data: any;
  updateData: (key: string, value: any) => void;
}

export const StepIdentity = ({ data, updateData }: StepIdentityProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">
          Identity
        </h2>
        <p className="text-muted-foreground">
          まずはあなたの「顏」となる基本情報を設定しましょう。
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">表示名</Label>
          <Input
            id="displayName"
            placeholder="例: シュレディンガーちゃん"
            value={data.displayName}
            onChange={(e) => updateData("displayName", e.target.value)}
            className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">肩書き / ロール</Label>
          <Input
            id="role"
            placeholder="例: QUANTUM CAT / 観測者"
            value={data.role}
            onChange={(e) => updateData("role", e.target.value)}
            className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 focus:ring-indigo-500"
          />
        </div>
      </div>
    </motion.div>
  );
};
