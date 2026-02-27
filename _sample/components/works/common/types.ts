export interface Work {
  id: string;
  title: string;
  category: "anime" | "comic" | "novel" | "movie" | "game" | "other";
  period: string;
  tags: string[];
  urls: { type: string; value: string }[];
  creatorName?: string; // Optional for now
  imageUrl?: string; // Optional placeholder
}
