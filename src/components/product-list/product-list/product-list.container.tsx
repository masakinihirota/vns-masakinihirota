"use client";

import React, { useId, useState, useEffect } from "react";
import { ProductList } from "./product-list";
import {
  Artwork,
  ArtworkKey,
  DisplayMode,
  FilterOption,
  SortOption,
  MOCK_ARTWORKS,
  filterArtworks,
  sortArtworks,
} from "./product-list.logic";

export const ProductListContainer: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("one-line");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterOption>({ rating: "すべて" });
  const [sort, setSort] = useState<SortOption>({
    key: "rating",
    order: "asc",
  });

  const filterRatingId = useId();
  const sortById = useId();

  // Data Fetching (Mock)
  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      setError(null);
      new Promise((resolve) => setTimeout(resolve, 500))
        .then(() => setArtworks(MOCK_ARTWORKS))
        .catch((err) => {
          setError("データ取得中にエラーが発生しました。");
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchArtworks();
  }, []);

  // Handlers
  const handleSortChange = (key: ArtworkKey) => {
    if (sort.key === key) {
      setSort({ ...sort, order: sort.order === "asc" ? "desc" : "asc" });
    } else {
      setSort({ key, order: "asc" }); // Default to asc when changing key
    }
  };

  // Logic Application
  const filteredArtworks = filterArtworks(artworks, filter);
  const processedArtworks = sortArtworks(filteredArtworks, sort);

  return (
    <ProductList
      artworks={processedArtworks}
      displayMode={displayMode}
      onDisplayModeChange={setDisplayMode}
      filter={filter}
      onFilterChange={setFilter}
      sort={sort}
      onSortChange={handleSortChange}
      isLoading={loading}
      error={error}
      filterRatingId={filterRatingId}
      sortById={sortById}
    />
  );
};
