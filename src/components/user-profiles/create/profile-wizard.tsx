"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LiveCardPreview } from "./live-card-preview";
import { StepDetails } from "./step-details";
import { StepIdentity } from "./step-identity";

export const ProfileWizard = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    displayName: "",
    role: "",
    bio: "",
  });

  const updateData = (key: string, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center min-h-[600px]">
      {/* Left: Wizard Form */}
      <div className="order-2 md:order-1">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          <div className="mb-8 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span
              className={
                step >= 1 ? "text-indigo-600 dark:text-indigo-400" : ""
              }
            >
              01 Identity
            </span>
            <div className="w-8 h-px bg-slate-200 dark:bg-slate-700" />
            <span
              className={
                step >= 2 ? "text-indigo-600 dark:text-indigo-400" : ""
              }
            >
              02 Details
            </span>
            <div className="w-8 h-px bg-slate-200 dark:bg-slate-700" />
            <span
              className={
                step >= 3 ? "text-indigo-600 dark:text-indigo-400" : ""
              }
            >
              03 Confirm
            </span>
          </div>

          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <StepIdentity key="step1" data={data} updateData={updateData} />
              )}
              {step === 2 && (
                <StepDetails key="step2" data={data} updateData={updateData} />
              )}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-4"
                >
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold">Ready to Launch?</h3>
                  <p className="text-muted-foreground">
                    素敵なプロフィールができましたね！
                    <br />
                    これでVNSの世界に参加する準備が整いました。
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-between mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={step === 1}
              className="hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              戻る
            </Button>

            {step < 3 ? (
              <Button
                onClick={nextStep}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 w-32"
              >
                次へ <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => alert("プロフィール作成完了！")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 w-40"
              >
                作成する
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Right: Live Preview */}
      <div className="order-1 md:order-2 sticky top-24">
        <div className="text-center mb-8 md:hidden">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">
            Identity Forge
          </h1>
        </div>
        <LiveCardPreview data={data} />
        <div className="text-center mt-8 hidden md:block">
          <p className="text-sm text-muted-foreground">
            Live Preview - Changes apply in real-time
          </p>
        </div>
      </div>
    </div>
  );
};
