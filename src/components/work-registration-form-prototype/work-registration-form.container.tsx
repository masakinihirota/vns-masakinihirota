"use client";

import React, { useState } from "react";
import { WorkRegistrationForm } from "./work-registration-form";
import { MOCK_DB_WORKS, Work, UserEntry } from "./work-registration-form.logic";

export function WorkRegistrationFormContainer() {
  const [view, setView] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("manga"); // 'manga' | 'anime'
  const [isSearching, setIsSearching] = useState(false);

  // 検索結果
  const [dbResults, setDbResults] = useState<Work[]>([]);
  const [aiResults, setAiResults] = useState<Work[]>([]);

  // 選択/編集中のデータ
  const [targetWork, setTargetWork] = useState<Work | null>(null);
  const [entryData, setEntryData] = useState<UserEntry | null>(null);

  // ユーザーのマイリスト（保存済みデータ）
  const [myList, setMyList] = useState<any[]>([]);

  // 検索ハンドラー
  const handleSearch = () => {
    if (!searchQuery) return;
    setIsSearching(true);
    setDbResults([]);
    setAiResults([]);

    // AI検索とDB検索の遅延をシミュレーション
    setTimeout(() => {
      // 1. DB内検索（部分一致）
      const foundInDb = MOCK_DB_WORKS.filter(
        (w) => w.title.includes(searchQuery) || w.author.includes(searchQuery)
      );
      setDbResults(foundInDb);

      // 2. AI検索結果（DBになかった場合などを想定してモック生成）
      const foundByAi: Work[] = [
        {
          id: `ai-${Date.now()}`, // 一時ID
          title: `${searchQuery}`,
          author: "AI推定作者",
          publisher: "AI推定出版社", // 出版社
          summary: `AIがWebから検索して生成した「${searchQuery}」の作品データです。このデータはAIによって取得された公式情報として扱われます。`,
          coverImageUrl: null,
          officialUrl: "https://official-site.com/example", // 公式サイト
          category: category as "manga" | "anime",
          isNew: true, // 新規登録フラグ
          isAiGenerated: true, // AI生成データフラグ（編集不可にするため）
        },
      ];
      setAiResults(foundByAi);
      setIsSearching(false);
    }, 1500);
  };

  // 作品選択ハンドラー
  const handleSelectWork = (work: Work) => {
    setTargetWork(work);
    // UserEntryの初期値
    setEntryData({
      tier: "Tier 1", // デフォルトはTier 1
      ratingType: "simple", // 'simple'(2択) | 'tier'(絶対相対評価)
      rating: 5,
      memo: "",
      status: "want_to_read",
    });
    setView("entry");
  };

  // 保存ハンドラー
  const handleSave = () => {
    if (!entryData || !targetWork) return;
    // ここでSupabaseへの保存処理が入る
    const newEntry = {
      ...entryData,
      workTitle: targetWork.title,
      id: Date.now(),
    };
    setMyList([...myList, newEntry]);
    alert("保存しました！ユーザープロフィールに反映されます。");
    setView("search");
    setSearchQuery("");
    setDbResults([]);
    setAiResults([]);
  };

  const handleManualCreate = () => {
    handleSelectWork({
      id: "new",
      title: "",
      author: "",
      publisher: "",
      officialUrl: "",
      summary: "",
      coverImageUrl: null,
      isNew: true,
      isAiGenerated: false,
      category: category as "manga" | "anime",
    });
  };

  return (
    <WorkRegistrationForm
      view={view}
      setView={setView}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      category={category}
      setCategory={setCategory}
      isSearching={isSearching}
      dbResults={dbResults}
      aiResults={aiResults}
      handleSearch={handleSearch}
      handleSelectWork={handleSelectWork}
      handleManualCreate={handleManualCreate}
      targetWork={targetWork}
      setTargetWork={setTargetWork}
      entryData={entryData}
      setEntryData={setEntryData}
      handleSave={handleSave}
    />
  );
}
