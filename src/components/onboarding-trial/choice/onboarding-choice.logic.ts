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
          router.push("/tutorial/story");
          break;
        case "ghost":
          router.push("/ghost");
          break;
        case "profile":
          router.push("/user-profiles/new");
          break;
        case "home":
          router.push("/home");
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
