import { Work } from "../common/types";

export const MOCK_WORKS: Work[] = [
  {
    id: "w1",
    title: "STEINS;GATE",
    category: "game",
    period: "2000s",
    tags: ["ゲーム化", "アニメ化", "神作", "伏線回収"],
    urls: [{ type: "official", value: "http://steinsgate.jp/" }],
  },
  {
    id: "w2",
    title: "葬送のフリーレン",
    category: "anime",
    period: "2020s",
    tags: ["アニメ化", "泣ける", "ファンタジー"],
    urls: [],
  },
  {
    id: "w3",
    title: "SHIROBAKO",
    category: "anime",
    period: "2010s",
    tags: ["アニメ化", "お仕事", "群像劇"],
    urls: [],
  },
];

export const fetchWorks = async (): Promise<Work[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_WORKS), 600));
};
