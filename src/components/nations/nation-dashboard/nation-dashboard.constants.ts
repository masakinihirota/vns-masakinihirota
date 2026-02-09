import { Crown, DoorOpen, Landmark, ShoppingBag, Users } from "lucide-react";
import {
  BoardPost,
  MarketItem,
  NationData,
  TabConfig,
} from "./nation-dashboard.types";

export const NATION_DATA: NationData = {
  id: "origin_001",
  name: "はじまりの国",
  level: "Capital", // 規模レベル
  population: 12450,
  activePopulation: 342, // アクティブ人口
  taxRate: 5, // 消費税率(%)
  treasury: 5400000, // 国庫ポイント
  maintenanceCost: 150000, // 月間維持費
  description:
    "全てが始まる場所。王様が統治し、迷える幽霊たちを導く安息の地。基本機能のすべてがここにあります。",
  leader: "The King (AI)",
  climate: "Always Sunny",
  nextDeduction: "3日後",
} as const;

export const MARKET_ITEMS: MarketItem[] = [
  {
    id: 1,
    name: "冒険の地図",
    price: 0,
    seller: "王様",
    category: "必需品",
    desc: "世界を歩くための地図。まずはこれを手に入れよう。",
  },
  {
    id: 2,
    name: "銅のつるはし",
    price: 500,
    seller: "鍛冶屋ギルド",
    category: "ツール",
    desc: "鉱山で素材を掘るための道具。",
  },
  {
    id: 3,
    name: "React入門書",
    price: 1200,
    seller: "技術書典",
    category: "知識",
    desc: "Webアプリを作るための魔導書。",
  },
  {
    id: 4,
    name: "癒やしの水",
    price: 100,
    seller: "雑貨屋",
    category: "消耗品",
    desc: "疲れた心を癒やす水。",
  },
];

export const BOARD_POSTS: BoardPost[] = [
  {
    id: 1,
    user: "見習い騎士",
    role: "Citizen",
    content: "剣の振り方を教えてくれる師匠を募集しています！",
    time: "10分前",
    likes: 5,
  },
  {
    id: 2,
    user: "迷子の幽霊",
    role: "Ghost",
    content: "ここに来れば肉体（プロフィール）が手に入ると聞いて...",
    time: "30分前",
    likes: 12,
  },
  {
    id: 3,
    user: "王様AI",
    role: "King",
    content: "【布告】来週の日曜日は「建国記念祭」を行う。広場に集まるように。",
    time: "2時間前",
    likes: 890,
  },
];

export const TABS: TabConfig[] = [
  { id: "gate", label: "城門", icon: DoorOpen, desc: "入国・出国・世界地図" },
  {
    id: "plaza",
    label: "中央広場",
    icon: Users,
    desc: "掲示板・交流・活動ログ",
  },
  {
    id: "market",
    label: "市場",
    icon: ShoppingBag,
    desc: "売買・依頼・オークション",
  },
  { id: "bank", label: "国立銀行", icon: Landmark, desc: "貯蓄・ローン・税金" },
  { id: "castle", label: "王城", icon: Crown, desc: "政治・法律・謁見の間" },
];
