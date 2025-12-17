export type Question = {
  id: number;
  category: string;
  text: string;
  choices: string[];
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    category: "防衛力強化",
    text: "日本の防衛力はもっと強化すべきだ",
    choices: ["賛成", "どちらかと言えば賛成", "どちらとも言えない", "どちらかと言えば反対", "反対"],
  },
  {
    id: 2,
    category: "経済政策",
    text: "消費税を引き下げるべきだ",
    choices: ["賛成", "どちらかと言えば賛成", "どちらとも言えない", "どちらかと言えば反対", "反対"],
  },
  {
    id: 3,
    category: "環境政策",
    text: "再生可能エネルギーの導入をさらに推進すべきだ",
    choices: ["賛成", "どちらかと言えば賛成", "どちらとも言えない", "どちらかと言えば反対", "反対"],
  },
];
