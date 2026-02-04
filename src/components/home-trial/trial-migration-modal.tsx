"use client";

import { Loader2, Sparkles, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrialStorage, VNSTrialData } from "@/lib/trial-storage";

export function TrialMigrationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<VNSTrialData | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for trial data on mount
    const trialData = TrialStorage.load();
    if (
      trialData &&
      (trialData.points?.current > 2000 ||
        trialData.profiles.length > 0 ||
        trialData.groups.length > 0)
    ) {
      // Only show if there is "meaningful" data (e.g. points change or content created)
      // Default points is 2000. If unmodified and no content, maybe don't bother?
      // Actually, user might have just refreshed.
      // Let's check if points != INITIAL (2000) or profiles exists.
      // Initial state has 0 profiles.
      setData(trialData);
      setIsOpen(true);
    }
  }, []);

  const handleImport = async () => {
    if (!data) return;

    setIsImporting(true);
    try {
      const response = await fetch("/api/user/import-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Import failed");
      }

      const result = await response.json();
      if (result.success) {
        toast.success("データの引き継ぎが完了しました！", {
          description:
            "獲得したポイントとプロフィールがアカウントに追加されました。",
        });
        // Clear trial data
        TrialStorage.clear();
        setIsOpen(false);
        router.refresh();
      } else {
        throw new Error(result.message || "Import failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("データの引き継ぎに失敗しました。", {
        description: "もう一度お試しください。",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleDiscard = () => {
    if (
      confirm(
        "体験版のデータを削除してよろしいですか？この操作は取り消せません。"
      )
    ) {
      TrialStorage.clear();
      setIsOpen(false);
      toast.info("体験版データを削除しました。");
    }
  };

  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-black text-indigo-700 dark:text-indigo-400">
            <Sparkles className="fill-indigo-500 text-indigo-500" />
            体験版データの引き継ぎ
          </DialogTitle>
          <DialogDescription className="pt-2 text-[16px] leading-relaxed">
            お使いのブラウザに体験版のプレイデータが見つかりました。
            現在のアカウントにデータを引き継ぎますか？
          </DialogDescription>
        </DialogHeader>

        <div className="bg-slate-50 dark:bg-neutral-800 p-4 rounded-xl border border-slate-100 dark:border-neutral-700 space-y-2">
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-slate-500 dark:text-neutral-400">
              獲得ポイント:
            </span>
            <span className="text-amber-600 dark:text-amber-400 text-lg">
              {data.points?.current.toLocaleString() ?? 0} pt
            </span>
          </div>
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-slate-500 dark:text-neutral-400">
              作成プロフィール:
            </span>
            <span className="text-slate-700 dark:text-neutral-200">
              {data.profiles.length} 件
            </span>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
          <Button
            variant="ghost"
            onClick={handleDiscard}
            className="text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full sm:w-auto text-xs"
            disabled={isImporting}
          >
            <Trash2 size={14} className="mr-1" /> 破棄する
          </Button>
          <Button
            onClick={handleImport}
            disabled={isImporting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-full sm:w-auto"
          >
            {isImporting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                引き継ぎ中...
              </>
            ) : (
              "データを引き継ぐ"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
