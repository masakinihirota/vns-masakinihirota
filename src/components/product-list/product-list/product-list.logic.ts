export interface Artwork {
  id: number;
  title: string;
  artist: string;
  year: number;
  description: string;
  thumbnail_url: string;
  is_important: boolean;
  rating: string;
  status: string;
  genre: string;
  length: string;
  category: string;
  tags: string[];
  era: string;
  target_age: string;
  impressions_url: string;
}

export type ArtworkKey = keyof Artwork;
export type DisplayMode = "one-line" | "two-line" | "thumbnail";

export interface FilterOption {
  rating: string;
}

export interface SortOption {
  key: ArtworkKey;
  order: "asc" | "desc";
}

export const MOCK_ARTWORKS: Artwork[] = [
  {
    id: 1,
    title: "星月夜",
    artist: "フィンセント・ファン・ゴッホ",
    year: 1889,
    description: "夜空に輝く星々と、渦巻く雲が印象的な傑作。",
    thumbnail_url:
      "https://upload.wikimedia.org/wikipedia/commons/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    is_important: true,
    rating: "Tier1",
    status: "完結",
    genre: "絵画",
    length: "1時間以内",
    category: "油絵",
    tags: ["印象派", "夜景", "空"],
    era: "19世紀",
    target_age: "全年齢",
    impressions_url: "#",
  },
  {
    id: 2,
    title: "モナ・リザ",
    artist: "レオナルド・ダ・ヴィンチ",
    year: 1503,
    description: "謎めいた微笑みで知られる、世界で最も有名な肖像画。",
    thumbnail_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
    is_important: false,
    rating: "Tier2",
    status: "完結",
    genre: "絵画",
    length: "1日以内",
    category: "肖像画",
    tags: ["ルネサンス", "微笑み", "謎"],
    era: "16世紀",
    target_age: "全年齢",
    impressions_url: "#",
  },
  {
    id: 3,
    title: "最後の晩餐",
    artist: "レオナルド・ダ・ヴィンチ",
    year: 1498,
    description: "イエス・キリストと12使徒の最後の晩餐の場面を描いた壁画。",
    thumbnail_url:
      "https://upload.wikimedia.org/wikipedia/commons/4/4b/Leonardo_da_Vinci_-_The_Last_Supper_-_c._1495-1498.jpg",
    is_important: true,
    rating: "Tier1",
    status: "完結",
    genre: "絵画",
    length: "3日以内",
    category: "壁画",
    tags: ["キリスト教", "宗教画", "ルネサンス"],
    era: "15世紀",
    target_age: "全年齢",
    impressions_url: "#",
  },
  {
    id: 4,
    title: "睡蓮",
    artist: "クロード・モネ",
    year: 1916,
    description: "モネが晩年に描いた、美しいジヴェルニーの庭の池の風景。",
    thumbnail_url:
      "https://upload.wikimedia.org/wikipedia/commons/e/ec/Monet_Water_Lilies_1916.jpg",
    is_important: false,
    rating: "普通or自分に合わない",
    status: "完結",
    genre: "絵画",
    length: "1週間以内",
    category: "油絵",
    tags: ["印象派", "自然", "池"],
    era: "20世紀",
    target_age: "全年齢",
    impressions_url: "#",
  },
  {
    id: 5,
    title: "ゲルニカ",
    artist: "パブロ・ピカソ",
    year: 1937,
    description: "スペイン内戦中のゲルニカ空爆をテーマにした反戦のメッセージが込められた作品。",
    thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Guernica_Picasso.jpg",
    is_important: true,
    rating: "Tier1",
    status: "完結",
    genre: "絵画",
    length: "それ以上",
    category: "キュビズム",
    tags: ["反戦", "社会派", "戦争"],
    era: "20世紀",
    target_age: "18+",
    impressions_url: "#",
  },
];

export const filterArtworks = (artworks: Artwork[], filter: FilterOption): Artwork[] => {
  return artworks.filter((artwork) => {
    if (filter.rating === "すべて") return true;
    return artwork.rating === filter.rating;
  });
};

export const sortArtworks = (artworks: Artwork[], sort: SortOption): Artwork[] => {
  const ratingOrder: Record<string, number> = {
    Tier1: 1,
    Tier2: 2,
    Tier3: 3,
    普通or自分に合わない: 4,
  };

  const targetAgeOrder: Record<string, number> = {
    全年齢: 1,
    "18+": 2,
  };

  return [...artworks].sort((a, b) => {
    // Shallow copy to avoid mutating original array
    const sortA = a[sort.key];
    const sortB = b[sort.key];

    if (sort.key === "rating") {
      const aRating = ratingOrder[String(sortA)] ?? 99;
      const bRating = ratingOrder[String(sortB)] ?? 99;
      return sort.order === "asc" ? aRating - bRating : bRating - aRating;
    }

    if (sort.key === "target_age") {
      const aAge = targetAgeOrder[String(sortA)] ?? 99;
      const bAge = targetAgeOrder[String(sortB)] ?? 99;
      return sort.order === "asc" ? aAge - bAge : bAge - aAge;
    }

    if (typeof sortA === "string" && typeof sortB === "string") {
      return sort.order === "asc"
        ? sortA.localeCompare(sortB, "ja")
        : sortB.localeCompare(sortA, "ja");
    }

    if (typeof sortA === "number" && typeof sortB === "number") {
      return sort.order === "asc" ? sortA - sortB : sortB - sortA;
    }

    return 0;
  });
};
