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

      // 評価オブジェクトを作成
      // 後で見るは Legacy support としてもあるが、新規は Future ステータスを使うべき
      // 今回はシンプルに currentStatus + value で保存
      // ただし value が '後で見る' の場合は Status=Future に強制するなど整合性を取る

      let statusToSave = currentStatus;
      const valueToSave = value;

      if (value === "後で見る") {
        statusToSave = "Future";
      }

      const newRating: Rating = {
        status: statusToSave,
        value: valueToSave,
      };

      const newRatings = { ...ratings, [currentTitle]: newRating };
      setRatings(newRatings);
      if (category) {
        saveRatingsToStorage(category, newRatings, patternId);
      }
      setAnnouncement(
        `${currentTitle}を${statusToSave} - ${valueToSave}と評価しました`
      );

      // 次へ進む（最後でなければ）
      if (currentIndex < sessionList.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        // ステータスは維持する (以前は 'Now' にリセットしていた)
      } else {
        // 完了扱いにするためにインデックスを進める
        setCurrentIndex((prev) => prev + 1);
        setAnnouncement("すべての評価が完了しました");
      }
    },
    [category, currentIndex, ratings, sessionList, currentStatus]
  );

  // ナビゲーション
  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setAnnouncement(`前の作品に戻りました: ${sessionList[currentIndex - 1]}`);

      // 戻った時のステータス復元
      const prevTitle = sessionList[currentIndex - 1];
      const prevRating = ratings[prevTitle];
      if (prevRating && typeof prevRating !== "string") {
        setCurrentStatus(prevRating.status);
      }
      // 以前の評価がない場合は、現在のステータスを維持する
    }
  }, [currentIndex, sessionList, ratings]);

  const handleNext = useCallback(() => {
    if (currentIndex < sessionList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setAnnouncement(`次の作品: ${sessionList[currentIndex + 1]}`);

      // 次の作品が既に評価済みならそのステータスを復元
      // 未評価なら現在のステータスを維持
      const nextTitle = sessionList[currentIndex + 1];
      const nextRating = ratings[nextTitle];
      if (nextRating && typeof nextRating !== "string") {
        setCurrentStatus(nextRating.status);
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

        // Legacy / Extras
        // case 'e': case 'E': handleRate('後で見る'); break; // 2 (Future) should be used instead

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
      onStatusChange={setCurrentStatus}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onReset={handleReset}
      onExport={handleExport}
      onToggleRatedItems={() => setShowRatedItems((prev) => !prev)}
    />
  );
};
