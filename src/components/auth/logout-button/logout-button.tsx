"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { logger } from "@/lib/logger";
import { TrialStorage } from "@/lib/trial-storage";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      // stop any trial recording so logout acts as stop-trial
      TrialStorage.clear();
      await signOut();
      // ログアウト成功後、ランディングページにリダイレクト
      router.push("/");
    } catch (error) {
      logger.error("ログアウトエラー:", error instanceof Error ? error : new Error(String(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <>
          ログアウト
          <LogOut className="ml-2 size-4" />
        </>
      )}
    </Button>
  );
}
