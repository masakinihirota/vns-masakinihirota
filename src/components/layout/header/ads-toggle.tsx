"use client";

import { updateUserPreferences } from "@/app/actions/update-user-preferences";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppAuth } from "@/hooks/use-app-auth";
import { ShieldAlert } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export function AdsToggle() {
  const { isAuthenticated } = useAppAuth();
  const [enabled, setEnabled] = useState(true);
  const [isPending, startTransition] = useTransition();

  // 初期値のロード
  useEffect(() => {
    // 常にlocalStorageから初期値を読み、認証済みならDBから同期するためのトリガーにする
    const saved = localStorage.getItem("vns_ads_enabled");
    if (saved !== null) {
      setEnabled(saved === "true");
    }
  }, []);

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    localStorage.setItem("vns_ads_enabled", String(checked));

    if (isAuthenticated) {
      startTransition(async () => {
        const result = await updateUserPreferences({ adsEnabled: checked });
        if (result.success) {
          toast.success(checked ? "広告を有効化しました" : "広告を無効化しました", {
            description: "設定を同期しました",
          });
        } else {
          toast.error("設定の同期に失敗しました");
        }
      });
    } else {
      toast.success(checked ? "広告を有効化しました" : "広告を無効化しました", {
        description: "設定をローカルに保存しました",
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={enabled}
        onCheckedChange={handleToggle}
        disabled={isPending}
        aria-label="広告表示"
        aria-pressed={enabled}
        className="shrink-0"
      />
      <Label
        htmlFor="ads-mode-toggle"
        className="text-sm font-medium cursor-pointer select-none hidden sm:inline-block"
      >
        広告
      </Label>
      {!enabled && (
        <ShieldAlert
          className="w-4 h-4 text-green-500 hidden sm:inline-block animate-in fade-in zoom-in"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
