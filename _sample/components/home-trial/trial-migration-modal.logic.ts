import { VNSTrialData } from "@/lib/trial-storage";

export const importTrialData = async (data: VNSTrialData) => {
  const response = await fetch("/api/user/import-trial", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "同期に失敗しました。");
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || "同期に失敗しました。");
  }

  return result;
};
