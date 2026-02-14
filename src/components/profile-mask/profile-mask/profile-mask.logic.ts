import { COLORS, MATERIALS, OBJECTIVE_PRESETS } from "./profile-mask.constants";
import { ProfileMask } from "./profile-mask.types";

/**
 * 星座匿名（識別ID）の候補セットを生成する
 */
export const generateCandidateSet = (
  constellation: string,
  previousSet: readonly string[] = []
): string[] => {
  const newSet: string[] = [];
  while (newSet.length < 3) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const material = MATERIALS[Math.floor(Math.random() * MATERIALS.length)];
    const name = `${color}${material}の${constellation}`;
    if (!newSet.includes(name) && !previousSet.includes(name)) {
      newSet.push(name);
    }
  }
  return newSet;
};

/**
 * 履歴ポインタを進め、必要に応じて新しい候補を生成する
 */
export const getNextAnonymsHistory = (
  constellationHistory: readonly (readonly string[])[],
  historyPointer: number,
  constellation: string
): {
  constellationHistory: readonly (readonly string[])[];
  historyPointer: number;
} => {
  if (historyPointer < constellationHistory.length - 1) {
    return {
      constellationHistory,
      historyPointer: historyPointer + 1,
    };
  }

  const newSet = generateCandidateSet(
    constellation,
    constellationHistory[historyPointer]
  );
  const newHistory = [...constellationHistory, newSet];
  let newPointer = newHistory.length - 1;

  if (newHistory.length > 10) {
    return {
      constellationHistory: newHistory.slice(1),
      historyPointer: 9,
    };
  }

  return {
    constellationHistory: newHistory,
    historyPointer: newPointer,
  };
};

/**
 * 目的の切り替えに伴うスロットと目的リストの更新
 */
export const toggleObjectiveSlots = (
  objectiveId: string,
  currentObjectiveIds: readonly string[],
  currentSlots: readonly string[]
): {
  selectedObjectiveIds: readonly string[];
  selectedSlots: readonly string[];
} => {
  const isAdding = !currentObjectiveIds.includes(objectiveId);

  if (isAdding) {
    const preset = OBJECTIVE_PRESETS.find((p) => p.id === objectiveId);
    const newObjectiveIds = [...currentObjectiveIds, objectiveId];
    const newSlotsSet = new Set([...currentSlots, ...(preset?.slots ?? [])]);

    return {
      selectedObjectiveIds: newObjectiveIds,
      selectedSlots: Array.from(newSlotsSet),
    };
  } else {
    return {
      selectedObjectiveIds: currentObjectiveIds.filter(
        (id) => id !== objectiveId
      ),
      selectedSlots: currentSlots,
    };
  }
};

/**
 * スロットの切り替えに伴うスロットと目的リストの更新
 */
export const toggleSlotAndObjectives = (
  slotId: string,
  currentSlots: readonly string[],
  currentObjectiveIds: readonly string[]
): {
  selectedSlots: readonly string[];
  selectedObjectiveIds: readonly string[];
} => {
  const isCurrentlySelected = currentSlots.includes(slotId);

  if (isCurrentlySelected) {
    const newSlots = currentSlots.filter((id) => id !== slotId);
    // スロットを削除した場合、そのスロットに依存している目的も削除する
    const newObjectiveIds = currentObjectiveIds.filter((objId) => {
      const preset = OBJECTIVE_PRESETS.find((p) => p.id === objId);
      return !preset?.slots.includes(slotId);
    });
    return {
      selectedSlots: newSlots,
      selectedObjectiveIds: newObjectiveIds,
    };
  } else {
    return {
      selectedSlots: [...currentSlots, slotId],
      selectedObjectiveIds: currentObjectiveIds,
    };
  }
};

/**
 * パートナー活目的の重複チェック
 */
export const validatePartnerObjective = (
  objectiveId: string,
  activeProfileId: string,
  allProfiles: readonly ProfileMask[]
): { isValid: boolean; message: string } => {
  if (objectiveId !== "partner") return { isValid: true, message: "" };

  const otherProfileWithPartner = allProfiles.find(
    (p) =>
      p.id !== activeProfileId && p.selectedObjectiveIds.includes("partner")
  );

  if (otherProfileWithPartner) {
    return {
      isValid: false,
      message: `「パートナー活」は全プロフィールの中で1つだけ登録可能です。現在「${otherProfileWithPartner.name}」で使用されています。`,
    };
  }

  return { isValid: true, message: "" };
};
