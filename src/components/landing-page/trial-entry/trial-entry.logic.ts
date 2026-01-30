import { useRouter } from "next/navigation";
import { useTransition } from "react";

export const useTrialEntry = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLocalModeStart = () => {
    startTransition(() => {
      // ローカルモード用クッキーを設定 (有効期限: 1年)
      document.cookie =
        "local_mode=true; path=/; max-age=31536000; SameSite=Lax";

      // オンボーディングの起点へ遷移
      router.push("/onboarding-trial");
      router.refresh();
    });
  };

  return {
    isPending,
    handleLocalModeStart,
  };
};
