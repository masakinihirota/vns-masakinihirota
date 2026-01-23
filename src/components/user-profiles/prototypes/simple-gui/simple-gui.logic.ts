import { useState, useEffect, useMemo } from "react";
import { generateUniqueCandidates } from "@/lib/anonymous-name-generator";
import { generateDummyWorks } from "./simple-gui.constants";
import { MasterWork, Period, FavWork } from "./simple-gui.types";

export const useSimpleGui = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [masterWorks, setMasterWorks] = useState<MasterWork[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [ratingType, setRatingType] = useState<"LIKE" | "TIER">("LIKE");
  const [activePeriod, setActivePeriod] = useState<Period>("NOW");
  const [showRatingHelp, setShowRatingHelp] = useState(false);
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [valueSelections, setValueSelections] = useState<
    Record<string, string[]>
  >({}); // questionId -> choiceIds
  const [valueTiers, setValueTiers] = useState<Record<string, number>>({}); // questionId -> tier (1,2,3)

  // Step 5: Manual Add/Remove State
  const [addedQuestionIds, setAddedQuestionIds] = useState<string[]>([]);
  const [removedQuestionIds, setRemovedQuestionIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    role: "Leader",
    type: "SELF",
    purposes: ["create_work"] as string[],
    zodiac: "獅子座",
    displayName: "",
    nameCandidates: [] as string[],
    ownWorks: [] as { id: number; title: string; url: string }[],
    favWorks: [] as FavWork[],
    valuesAnswer: "",
  });

  // Initialize Master DB
  useEffect(() => {
    setMasterWorks(generateDummyWorks());
  }, []);

  // History Management for Candidates
  const [candidateHistory, setCandidateHistory] = useState<string[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Helper for form updates
  const handleValueSelection = (questionId: string, choiceId: string) => {
    setValueSelections((prev) => {
      const current = prev[questionId] || [];
      if (current.includes(choiceId)) {
        return {
          ...prev,
          [questionId]: current.filter((id) => id !== choiceId),
        };
      } else {
        return { ...prev, [questionId]: [...current, choiceId] };
      }
    });
  };

  const toggleValueTier = (questionId: string, tier?: number) => {
    setValueTiers((prev) => {
      const currentTier = prev[questionId];
      // If specific tier request
      if (tier !== undefined) {
        if (currentTier === tier) {
          const { [questionId]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [questionId]: tier };
      }
      // Toggle Heart (Tier 1) logic
      if (currentTier) {
        const { [questionId]: _, ...rest } = prev;
        return rest;
      } else {
        return { ...prev, [questionId]: 1 };
      }
    });
  };

  const updateForm = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Effect to generate initial candidates when zodiac is selected
  useEffect(() => {
    if (formData.zodiac) {
      // Reset history when Zodiac changes
      const initialCandidates = generateUniqueCandidates(formData.zodiac, 3);
      updateForm("nameCandidates", initialCandidates);
      // Auto-select first
      if (initialCandidates.length > 0) {
        updateForm("displayName", initialCandidates[0]);
      }
      setCandidateHistory([initialCandidates]);
      setHistoryIndex(0);
    }
  }, [formData.zodiac]);

  const handleGenerateCandidates = (zodiac: string) => {
    // Collect all generated names in history to avoid immediate duplicates
    const recentNames = candidateHistory.flat();

    // Generate 3 new ones excluding recentNames
    const newCandidates = generateUniqueCandidates(zodiac, 3, recentNames);

    updateForm("nameCandidates", newCandidates);
    if (newCandidates.length > 0) updateForm("displayName", newCandidates[0]);

    // Update History:
    // If we are in the middle of history (due to Undo), we discard the "future"
    const newHistory = candidateHistory.slice(0, historyIndex + 1);

    setCandidateHistory([...newHistory, newCandidates]);
    setHistoryIndex(newHistory.length); // Index of the new item
  };

  const handleUndoCandidates = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevCandidates = candidateHistory[prevIndex];
      updateForm("nameCandidates", prevCandidates);

      if (prevCandidates.length > 0)
        updateForm("displayName", prevCandidates[0]);

      setHistoryIndex(prevIndex);
    }
  };

  const togglePurpose = (id: string) => {
    setFormData((prev) => {
      const exists = prev.purposes.includes(id);
      if (exists && prev.purposes.length <= 1) return prev; // Cannot deselect last one
      return {
        ...prev,
        purposes: exists
          ? prev.purposes.filter((p) => p !== id)
          : [...prev.purposes, id],
      };
    });
  };

  const addOwnWork = () => {
    setFormData((prev) => {
      // Prevent adding if there are empty titles
      if (prev.ownWorks.some((w) => !w.title.trim())) {
        return prev;
      }
      return {
        ...prev,
        ownWorks: [...prev.ownWorks, { id: Date.now(), title: "", url: "" }],
      };
    });
  };

  const updateOwnWork = (id: number, field: "title" | "url", value: string) => {
    setFormData((prev) => ({
      ...prev,
      ownWorks: prev.ownWorks.map((w) =>
        w.id === id ? { ...w, [field]: value } : w
      ),
    }));
  };

  const removeOwnWork = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      ownWorks: prev.ownWorks.filter((w) => w.id !== id),
    }));
  };

  const addFavWorkFromMaster = (work: MasterWork) => {
    const periods: Period[] = ["LIFE", "NOW", "FUTURE"];
    const newWorks: FavWork[] = [];

    periods.forEach((p) => {
      // Check duplication within THIS period
      if (formData.favWorks.some((w) => w.id === work.id && w.period === p))
        return;

      const isActive = p === activePeriod;

      newWorks.push({
        ...work,
        period: p,
        // Active Period: Like (isBest=true) AND Tier 1
        // Other Periods: Undefined (isBest=false, tier=null)
        isBest: isActive,
        tier: isActive ? 1 : null,
      });
    });

    if (newWorks.length > 0) {
      setFormData((prev) => ({
        ...prev,
        favWorks: [...prev.favWorks, ...newWorks],
      }));
    }
  };

  const removeFavWork = (id: number, period: Period) => {
    setFormData((prev) => ({
      ...prev,
      favWorks: prev.favWorks.filter(
        (w) => !(w.id === id && w.period === period)
      ),
    }));
  };

  const toggleBestWork = (id: number, period: Period) => {
    setFormData((prev) => ({
      ...prev,
      favWorks: prev.favWorks.map((w) => {
        if (w.id === id && w.period === period) {
          // Refined Logic:
          // If isBest (Tier 1/2/3) -> Switch to "normal" (isBest: false)
          // If NOT isBest (Normal or Null) -> Switch to Tier 1 (isBest: true)
          const isBest = w.isBest;
          return { ...w, tier: isBest ? "normal" : 1, isBest: !isBest };
        }
        return w;
      }),
    }));
  };

  const setWorkTier = (
    id: number,
    period: Period,
    tier: 1 | 2 | 3 | "normal" | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      favWorks: prev.favWorks.map((w) =>
        w.id === id && w.period === period
          ? { ...w, tier, isBest: tier !== null && tier !== "normal" }
          : w
      ),
    }));
  };

  // Registration Form State
  const [newWorkData, setNewWorkData] = useState<Omit<MasterWork, "id">>({
    title: "",
    category: "漫画",
    author: "",
    tags: [],
    era: "2000年代",
  });
  const [newWorkTagsInput, setNewWorkTagsInput] = useState("");

  const handleRegisterNewWork = () => {
    if (!newWorkData.title) return;
    const newId = Date.now();
    const newWork: MasterWork = {
      id: newId,
      ...newWorkData,
      tags: newWorkTagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
    };

    setMasterWorks((prev) => [newWork, ...prev]); // Add to Global DB
    addFavWorkFromMaster(newWork); // Add to User List

    // Reset
    setNewWorkData({
      title: "",
      category: "漫画",
      author: "",
      tags: [],
      era: "2000年代",
    });
    setNewWorkTagsInput("");
    setIsRegistering(false);
  };

  // Search & Filter State
  const [masterSearch, setMasterSearch] = useState("");
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterEras, setFilterEras] = useState<string[]>([]);

  const searchedMasterWorks = useMemo(() => {
    let result = masterWorks;

    // 1. Text Search
    if (masterSearch) {
      const searchLower = masterSearch.toLowerCase();
      result = result.filter(
        (w) =>
          w.title.toLowerCase().includes(searchLower) ||
          w.author.toLowerCase().includes(searchLower)
      );
    }

    // 2. Category Filter (formerly Tag Filter)
    if (filterCategories.length > 0) {
      result = result.filter((w) => filterCategories.includes(w.category));
    }

    // 3. Era Filter (Multi-select)
    if (filterEras.length > 0) {
      result = result.filter((w) => filterEras.includes(w.era));
    }

    return result.slice(0, 50);
  }, [masterWorks, masterSearch, filterCategories, filterEras]);

  return {
    // State
    currentStep,
    setCurrentStep,
    masterWorks,
    isRegistering,
    setIsRegistering,
    ratingType,
    setRatingType,
    activePeriod,
    setActivePeriod,
    showRatingHelp,
    setShowRatingHelp,
    openQuestionId,
    setOpenQuestionId,
    currentPage,
    setCurrentPage,
    valueSelections,
    valueTiers,
    addedQuestionIds,
    setAddedQuestionIds,
    removedQuestionIds,
    setRemovedQuestionIds,
    formData,
    candidateHistory,
    historyIndex,
    newWorkTagsInput,
    setNewWorkTagsInput,
    masterSearch,
    setMasterSearch,
    filterCategories,
    setFilterCategories,
    filterEras,
    setFilterEras,
    searchedMasterWorks,

    // Actions
    handleValueSelection,
    toggleValueTier,
    updateForm,
    handleGenerateCandidates,
    handleUndoCandidates,
    togglePurpose,
    addOwnWork,
    updateOwnWork,
    removeOwnWork,
    addFavWorkFromMaster,
    removeFavWork,
    toggleBestWork,
    setWorkTier,
    handleRegisterNewWork,
  };
};
