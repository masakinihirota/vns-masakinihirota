import type React from "react";
import { Artwork, ArtworkKey, DisplayMode, FilterOption, SortOption } from "./product-list.logic";

interface ProductListProps {
  artworks: Artwork[];
  displayMode: DisplayMode;
  onDisplayModeChange: (mode: DisplayMode) => void;
  filter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  sort: SortOption;
  onSortChange: (key: ArtworkKey) => void;
  isLoading: boolean;
  error: string | null;
  filterRatingId: string;
  sortById: string;
}

export const ProductList: React.FC<ProductListProps> = ({
  artworks,
  displayMode,
  onDisplayModeChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  isLoading,
  error,
  filterRatingId,
  sortById,
}) => {
  const renderSortArrow = (key: ArtworkKey) => {
    if (sort.key === key) {
      return sort.order === "asc" ? "▲" : "▼";
    }
    return "";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="text-xl text-gray-700 dark:text-gray-300">データを読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const renderArtworkList = () => {
    switch (displayMode) {
      case "one-line":
        return (
          <div className="overflow-x-auto">
            <div className="min-w-[800px] bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold p-2 rounded-t-lg flex">
              <button
                className="text-left w-12 cursor-pointer flex-shrink-0"
                onClick={() => onSortChange("is_important")}
              >
                重要 {renderSortArrow("is_important")}
              </button>
              <button
                className="text-left w-20 cursor-pointer flex-shrink-0"
                onClick={() => onSortChange("rating")}
              >
                評価 {renderSortArrow("rating")}
              </button>
              <button
                className="text-left flex-1 min-w-0 cursor-pointer"
                onClick={() => onSortChange("title")}
              >
                作品名 {renderSortArrow("title")}
              </button>
              <button
                className="text-left flex-1 min-w-0 cursor-pointer"
                onClick={() => onSortChange("artist")}
              >
                作者名 {renderSortArrow("artist")}
              </button>
              <button
                className="text-left w-24 cursor-pointer flex-shrink-0"
                onClick={() => onSortChange("status")}
              >
                状態 {renderSortArrow("status")}
              </button>
              <button
                className="text-left w-24 cursor-pointer flex-shrink-0"
                onClick={() => onSortChange("genre")}
              >
                ジャンル {renderSortArrow("genre")}
              </button>
              <button
                className="text-left w-36 cursor-pointer flex-shrink-0"
                onClick={() => onSortChange("length")}
              >
                長さ {renderSortArrow("length")}
              </button>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {artworks.map((artwork) => (
                <li
                  key={artwork.id}
                  className="py-4 px-2 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-w-[800px]"
                >
                  <div className="flex items-center flex-1 space-x-4">
                    <div className="text-sm w-12 flex-shrink-0">
                      <span className="text-gray-500 dark:text-gray-400">
                        {artwork.is_important ? "✔" : " "}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 w-20 flex-shrink-0">
                      {artwork.rating}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                        {artwork.title}
                      </h2>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {artwork.artist}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 w-24 flex-shrink-0">
                      {artwork.status}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 w-24 flex-shrink-0">
                      {artwork.genre}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 w-36 flex-shrink-0">
                      {artwork.length}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      case "two-line":
        return (
          <div className="overflow-x-auto">
            <div className="min-w-[800px] bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold p-2 rounded-t-lg flex">
              <button
                className="text-left w-12 cursor-pointer flex-shrink-0"
                onClick={() => onSortChange("is_important")}
              >
                重要 {renderSortArrow("is_important")}
              </button>
              <button
                className="text-left w-20 cursor-pointer flex-shrink-0"
                onClick={() => onSortChange("rating")}
              >
                評価 {renderSortArrow("rating")}
              </button>
              <button
                className="text-left flex-1 min-w-0 cursor-pointer"
                onClick={() => onSortChange("title")}
              >
                作品名 {renderSortArrow("title")}
              </button>
              <button
                className="text-left flex-1 min-w-0 cursor-pointer"
                onClick={() => onSortChange("artist")}
              >
                作者名 {renderSortArrow("artist")}
              </button>
              <button
                className="text-left w-24 cursor-pointer flex-shrink-0"
                onClick={() => onSortChange("status")}
              >
                状態 {renderSortArrow("status")}
              </button>
              <button
                className="text-left w-24 cursor-pointer flex-shrink-0"
                onClick={() => onSortChange("genre")}
              >
                ジャンル {renderSortArrow("genre")}
              </button>
              <button
                className="text-left w-36 cursor-pointer flex-shrink-0"
                onClick={() => onSortChange("length")}
              >
                長さ {renderSortArrow("length")}
              </button>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {artworks.map((artwork) => (
                <li
                  key={artwork.id}
                  className="py-4 px-2 flex flex-col hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-w-[800px]"
                >
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="text-sm w-12 flex-shrink-0">
                      <span className="text-gray-500 dark:text-gray-400">
                        {artwork.is_important ? "✔" : " "}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 w-20 flex-shrink-0">
                      {artwork.rating}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                        {artwork.title}
                      </h2>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {artwork.artist}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 w-24 flex-shrink-0">
                      {artwork.status}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 w-24 flex-shrink-0">
                      {artwork.genre}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 w-36 flex-shrink-0">
                      {artwork.length}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 pl-12 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex-1 min-w-0">
                      <p>カテゴリ: {artwork.category}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p>タグ: {artwork.tags.join(", ")}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p>年代: {artwork.era}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p>対象年齢: {artwork.target_age}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <a
                        href={artwork.impressions_url}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        感想
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      case "thumbnail":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
              <div
                key={artwork.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out border border-gray-200 dark:border-gray-700"
              >
                <img
                  src={artwork.thumbnail_url}
                  alt={artwork.title}
                  className="w-full h-48 object-cover object-center"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = "https://placehold.co/400x300?text=画像なし";
                  }}
                />
                <div className="p-4">
                  <h3 className="text-md font-bold text-gray-900 dark:text-white truncate">
                    {artwork.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{artwork.artist}</p>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8 font-sans antialiased transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              作品リスト
            </h1>
            <div className="flex space-x-2 rounded-full bg-gray-200 dark:bg-gray-700 p-1 flex-wrap">
              {(["one-line", "two-line", "thumbnail"] as DisplayMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onDisplayModeChange(mode)}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                    displayMode === mode
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {mode === "one-line" ? "1行" : mode === "two-line" ? "2行" : "サムネイル"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <label
                htmlFor={filterRatingId}
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                評価で絞り込み:
              </label>
              <select
                id={filterRatingId}
                className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={filter.rating}
                onChange={(e) => onFilterChange({ ...filter, rating: e.target.value })}
              >
                <option value="すべて">すべて</option>
                <option value="Tier1">Tier1</option>
                <option value="Tier2">Tier2</option>
                <option value="Tier3">Tier3</option>
                <option value="普通or自分に合わない">普通or自分に合わない</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label
                htmlFor={sortById}
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                並び替え:
              </label>
              <select
                id={sortById}
                className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={sort.key}
                onChange={(e) => onSortChange(e.target.value as ArtworkKey)}
              >
                <option value="rating">評価</option>
                <option value="title">作品名</option>
                <option value="artist">作者名</option>
                <option value="year">年代</option>
                <option value="target_age">対象年齢</option>
              </select>
              <button
                type="button"
                onClick={() => onSortChange(sort.key)} // Trigger toggle order logic in container
                className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {sort.order === "asc" ? "▲" : "▼"}
              </button>
            </div>
          </div>
          {renderArtworkList()}
        </div>
      </div>
    </div>
  );
};
