import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChoiceId } from "./choice.data";

export const useOnboardingChoice = () => {
  const [selectedPath, setSelectedPath] = useState<ChoiceId | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const router = useRouter();

  const handleSelect = (id: ChoiceId) => {
    if (isConfirming) return;
    setSelectedPath(id);
  };

  const handleConfirm = async () => {
    if (!selectedPath) return;
    setIsConfirming(true);

    try {
      // 実際の遷移処理
      switch (selectedPath) {
        case "tutorial":
          // TODO: チュートリアルページへのパスを確認して修正
          router.push("/tutorial");
          break;
        case "ghost":
          router.push("/ghost");
          break;
        case "profile":
          // TODO: プロフィール作成へのパスを確認して修正
          router.push("/profile/create");
          break;
      }
    } catch (error) {
      console.error("Navigation error:", error);
      setIsConfirming(false);
    }
  };

  return {
    selectedPath,
    isConfirming,
    handleSelect,
    handleConfirm,
  };
};
