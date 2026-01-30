"use client";

import React, { useState, useEffect, useCallback } from "react";
import { WorkContinuousRating } from "./work-continuous-rating";
import {
  Rating,
  RatingStatus,
  RatingValue,
  loadAnimeData,
  loadMangaData,
  getRatingsFromStorage,
  saveRatingsToStorage,
  exportRatings,
  normalizeRating,
} from "./work-continuous-rating.logic";

export const WorkContinuousRatingContainer: React.FC = () => {
  const patternId = "continuous_rating";
  const [category, setCategory] = useState<"anime" | "manga" | null>(null);
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState<Record<string, Rating>>({});

  // Session State

  const [sessionList, setSessionList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionSize, setSessionSize] = useState<number | "all" | null>(null);
  const [currentStatus, setCurrentStatus] = useState<RatingStatus>("Now");

  // UI State
  const [announcement, setAnnouncement] = useState("");
  const [showRatedItems, setShowRatedItems] = useState(false);

  // カテゴリ変更時のデータ読み込み
  useEffect(() => {
    if (!category) return;
    const saved = getRatingsFromStorage(category, patternId);
    setRatings(saved);
  }, [category]);

  // データロードとセッション開始
  const handleSessionStart = useCallback(
    async (size: number | "all") => {
      if (!category) return;

      setLoading(true);
      setAnnouncement("データを読み込んでいます");
      try {
        const data =
          category === "anime" ? await loadAnimeData() : await loadMangaData();
        // setFullList(data); // Removed unused state setter

        const saved = getRatingsFromStorage(category, patternId);
        setRatings(saved);

        // 未評価の作品を抽出
        const remaining = data.filter((t) => !saved[t]);

        // セッションサイズ制限
        const take =
          size === "all" ? remaining.length : Math.min(size, remaining.length);

        setSessionList(remaining.slice(0, take));
        setSessionSize(size);
        setCurrentIndex(0);
        setCurrentStatus("Now"); // 初期値
        setAnnouncement(`${take}作品のセッションを開始しました`);
      } catch (e) {
        console.error("Failed to load data:", e);
        setAnnouncement("データの読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    },
    [category]
  );

  // 評価アクション
  const handleRate = useCallback(
    (value: RatingValue) => {
      if (sessionList.length === 0) return;

      const currentTitle = sessionList[currentIndex];
      const prevRating = normalizeRating(ratings[currentTitle]); // Get current state for memory

      // 評価オブジェクトを作成
      let statusToSave = currentStatus;

      if (value === "後で見る") {
        statusToSave = "Future";
      }

      let newRating: Rating;

      // Tier Selection Logic
      if (["Tier1", "Tier2", "Tier3"].includes(value)) {
        newRating = {
          status: statusToSave,
          isLiked: true,
          tier: value as "Tier1" | "Tier2" | "Tier3",
          otherValue: null,
        };
      } else {
        // Other Selection Logic (Unlikes, but keeps Tier memory from prevRating)
        newRating = {
          status: statusToSave,
          isLiked: false,
          tier: prevRating.tier, // Keep memory
          otherValue: value,
        };
      }

      const newRatings = { ...ratings, [currentTitle]: newRating };
      setRatings(newRatings);
      if (category) {
        saveRatingsToStorage(category, newRatings, patternId);
      }
      setAnnouncement(
        `${currentTitle}を${statusToSave} - ${value}と評価しました`
      );

      // 次へ進む（最後でなければ）
      if (currentIndex < sessionList.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        // ステータスは維持する
      } else {
        // 完了扱いにするためにインデックスを進める
        setCurrentIndex((prev) => prev + 1);
        setAnnouncement("すべての評価が完了しました");
      }
    },
    [category, currentIndex, ratings, sessionList, currentStatus]
  );

  // LIKE Toggle Action
  const handleToggleLike = useCallback(() => {
    if (sessionList.length === 0) return;

    const currentTitle = sessionList[currentIndex];
    const currentRating = normalizeRating(ratings[currentTitle]);
    const newIsLiked = !currentRating.isLiked;

    const newRating: Rating = {
      status: currentRating.status,
      isLiked: newIsLiked,
      tier: currentRating.tier, // Keep/Restore Tier memory
      otherValue: newIsLiked ? null : currentRating.otherValue, // Clear otherValue if Liked
    };

    const newRatings = { ...ratings, [currentTitle]: newRating };
    setRatings(newRatings);
    if (category) {
      saveRatingsToStorage(category, newRatings, patternId);
    }
  }, [category, currentIndex, ratings, sessionList]);

  // ナビゲーション
  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setAnnouncement(`前の作品に戻りました: ${sessionList[currentIndex - 1]}`);

      // 戻った時のステータス復元
      const prevTitle = sessionList[currentIndex - 1];
      const prevRating = ratings[prevTitle];
      if (prevRating) {
        const norm = normalizeRating(prevRating);
        setCurrentStatus(norm.status);
      }
    }
  }, [currentIndex, sessionList, ratings]);

  const handleNext = useCallback(() => {
    if (currentIndex < sessionList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setAnnouncement(`次の作品: ${sessionList[currentIndex + 1]}`);

      // 次の作品が既に評価済みならそのステータスを復元
      const nextTitle = sessionList[currentIndex + 1];
      const nextRating = ratings[nextTitle];
      if (nextRating) {
        const norm = normalizeRating(nextRating);
        setCurrentStatus(norm.status);
      }
    }
  }, [currentIndex, sessionList, ratings]);

  // リセット
  const handleReset = useCallback(() => {
    setCategory(null);
    setSessionSize(null);
    setSessionList([]);
    setCurrentIndex(0);
    setCurrentStatus("Now");
    setAnnouncement("トップ画面に戻りました");
  }, []);

  // エクスポート
  const handleExport = useCallback(() => {
    if (!category) return;
    exportRatings(category, ratings);
    setAnnouncement("評価データをエクスポートしました");
  }, [category, ratings]);

  // キーボードショートカット
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // セッション中でなければ無効
      if (
        !category ||
        sessionSize === null ||
        sessionList.length === 0 ||
        currentIndex >= sessionList.length
      )
        return;

      // テキスト入力中などは無効化してもいいが、この画面に入力欄はない

      switch (e.key) {
        // Status Selection
        case "1":
          setCurrentStatus("Now");
          break;
        case "2":
          setCurrentStatus("Future");
          break;
        case "3":
          setCurrentStatus("Life");
          break;

        // Ratings
        case "4":
          handleRate("Tier1");
          break;
        case "5":
          handleRate("Tier2");
          break;
        case "6":
          handleRate("Tier3");
          break;
        case "l":
        case "L":
          handleToggleLike();
          break;
        case "7":
        case "q":
        case "Q":
          handleRate("普通 or 自分に合わない");
          break;
        case "8":
        case "w":
        case "W":
          handleRate("興味無し");
          break;
        case "9": // Added shortcut for 後で見る
          handleRate("後で見る");
          break;

        // Navigation
        case "ArrowLeft":
          handlePrevious();
          break;
        case "ArrowRight":
          handleNext();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    category,
    sessionSize,
    sessionList,
    currentIndex,
    handleRate,
    handleToggleLike,
    handlePrevious,
    handleNext,
  ]);

  const isComplete =
    sessionList.length > 0 && currentIndex >= sessionList.length;
  const currentTitle = sessionList[currentIndex] || "";

  return (
    <WorkContinuousRating
      category={category}
      sessionSize={sessionSize}
      isLoading={loading}
      isComplete={isComplete}
      currentIndex={currentIndex}
      sessionTotal={sessionList.length}
      currentTitle={currentTitle}
      announcement={announcement}
      ratings={ratings}
      showRatedItems={showRatedItems}
      currentStatus={currentStatus}
      onCategorySelect={setCategory}
      onSessionStart={handleSessionStart}
      onRate={handleRate}
      onToggleLike={handleToggleLike}
      onStatusChange={setCurrentStatus}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onReset={handleReset}
      onExport={handleExport}
      onToggleRatedItems={() => setShowRatedItems((prev) => !prev)}
    />
  );
};
