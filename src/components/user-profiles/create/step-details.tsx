"use client";

import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface StepDetailsProps {
  data: any;
  updateData: (key: string, value: any) => void;
}

export const StepDetails = ({ data, updateData }: StepDetailsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">
          Details
        </h2>
        <p className="text-muted-foreground">
          あなたらしさを表現するメッセージを添えてください。
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bio">自己紹介 (Bio)</Label>
          <Textarea
            id="bio"
            placeholder="自由に記述してください..."
            value={data.bio}
            onChange={(e) => updateData("bio", e.target.value)}
            className="min-h-[120px] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 focus:ring-indigo-500 resize-none"
          />
        </div>
      </div>
    </motion.div>
  );
};
