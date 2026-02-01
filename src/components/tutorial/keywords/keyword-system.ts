/**
 * キーワードシステム
 * チュートリアルで学べる重要な用語管理
 */

import type { TutorialPhase } from "../state";

export interface Keyword {
  id: string;
  label: string;
  description: string;
  relatedPhase: TutorialPhase;
  trigger: {
    type: "auto-unlock" | "manual-unlock";
    phase: TutorialPhase;
    lineIndex: number;
  };
  category:
    | "game-mechanics"
    | "world-lore"
    | "system-concept"
    | "navigation"
    | "other";
  icon?: string;
  examples?: string[];
  relatedKeywords?: string[];
}

export const TUTORIAL_KEYWORDS_EXTENDED: Record<string, Keyword> = {
  ghost: {
    id: "ghost",
    label: "ゴースト（幽霊状態）",
    description: "実体を持たない幽霊の姿で、誰の目にも映らず傷つけられない状態。",
    relatedPhase: "scene1",
    trigger: {
      type: "auto-unlock",
      phase: "scene1",
      lineIndex: 3,
    },
    category: "game-mechanics",
    examples: [
      "あなたは今、幽霊状態です",
      "ゴースト状態では他者と相互作用できません",
    ],
    relatedKeywords: ["incarnation", "mask"],
  },

  incarnation: {
    id: "incarnation",
    label: "受肉（じゅにく）",
    description: "ゴースト状態から実体を得た状態。他者と相互作用できるようになる。",
    relatedPhase: "mask_intro",
    trigger: {
      type: "auto-unlock",
      phase: "mask_intro",
      lineIndex: 0,
    },
    category: "game-mechanics",
    examples: ["ルートアカウント作成で受肉できます"],
    relatedKeywords: ["ghost", "root-account"],
  },

  compass: {
    id: "compass",
    label: "コンパス（地図）",
    description: "方角と現在地を知ることができるアイテム。世界探索に必須。",
    relatedPhase: "map_found",
    trigger: {
      type: "auto-unlock",
      phase: "map_found",
      lineIndex: 0,
    },
    category: "navigation",
    examples: [
      "コンパスで現在地と方角が分かります",
      "右上のコンパス表示を確認しましょう",
    ],
    relatedKeywords: ["warp", "exploration"],
  },

  warp: {
    id: "warp",
    label: "ワープ",
    description: "コンパスボタンで地図上の別の場所へ瞬時に移動できる機能。",
    relatedPhase: "explore",
    trigger: {
      type: "auto-unlock",
      phase: "explore",
      lineIndex: 1,
    },
    category: "navigation",
    examples: [
      "コンパスボタンからワープ先を選択できます",
      "制限なく何度でもワープできます",
    ],
    relatedKeywords: ["compass", "exploration"],
  },

  watch: {
    id: "watch",
    label: "ウォッチ（観察）",
    description: "他者の価値観や人生を観察する行為。VNS の基本的な活動。",
    relatedPhase: "scene2",
    trigger: {
      type: "auto-unlock",
      phase: "scene2",
      lineIndex: 0,
    },
    category: "world-lore",
    examples: ["あなたは今、人々をウォッチしています"],
    relatedKeywords: ["drift", "observation"],
  },

  drift: {
    id: "drift",
    label: "ドリフト（離脱）",
    description: "合わない人間関係から静かに身を引く行為。争わずに生きるための知恵。",
    relatedPhase: "scene2",
    trigger: {
      type: "auto-unlock",
      phase: "scene2",
      lineIndex: 2,
    },
    category: "world-lore",
    examples: [
      "合わないと思えば、ただ静かに離れればよい",
      "ドリフトは戦わないための知恵です",
    ],
    relatedKeywords: ["watch", "harmony"],
  },

  harmony: {
    id: "harmony",
    label: "調和（和）",
    description:
      "VNSの基本理念。異なる価値観が共存する世界で、争わずに生きる方法。",
    relatedPhase: "return_to_queen",
    trigger: {
      type: "auto-unlock",
      phase: "return_to_queen",
      lineIndex: 0,
    },
    category: "system-concept",
    examples: [
      "異なる価値観を尊重する世界",
      "争わずに共存する知恵",
    ],
    relatedKeywords: ["watch", "drift", "profile"],
  },

  mask: {
    id: "mask",
    label: "仮面（プロフィール）",
    description:
      "この世界での自分の顔。プロフィール情報で他者にあなたを示す。",
    relatedPhase: "mask_intro",
    trigger: {
      type: "auto-unlock",
      phase: "mask_intro",
      lineIndex: 1,
    },
    category: "system-concept",
    examples: [
      "プロフィールはあなたの仮面です",
      "仮面を通じて他者と関わります",
    ],
    relatedKeywords: ["root-account", "profile"],
  },

  "root-account": {
    id: "root-account",
    label: "ルートアカウント",
    description:
      "あなた自身を示す根元のアカウント。ここから複数のプロフィール（仮面）を作成できる。",
    relatedPhase: "guide_intro",
    trigger: {
      type: "auto-unlock",
      phase: "guide_intro",
      lineIndex: 3,
    },
    category: "system-concept",
    examples: [
      "ルートアカウントが作成されました",
      "このアカウントからプロフィールを作成します",
    ],
    relatedKeywords: ["mask", "profile", "incarnation"],
  },

  profile: {
    id: "profile",
    label: "プロフィール",
    description: "あなたの価値観やスキルを表現した情報。複数作成して使い分けられる。",
    relatedPhase: "guide_intro",
    trigger: {
      type: "auto-unlock",
      phase: "guide_intro",
      lineIndex: 4,
    },
    category: "system-concept",
    examples: [
      "プロフィールで自分を表現します",
      "複数のプロフィールを切り替え可能",
    ],
    relatedKeywords: ["root-account", "mask"],
  },

  observation: {
    id: "observation",
    label: "観察行動",
    description: "他者を観察し学ぶ VNS の基本活動。マッチング機能で実現される。",
    relatedPhase: "explore",
    trigger: {
      type: "manual-unlock",
      phase: "explore",
      lineIndex: 0,
    },
    category: "game-mechanics",
    examples: ["マッチング機能で観察を始めます"],
    relatedKeywords: ["watch", "matching"],
  },

  matching: {
    id: "matching",
    label: "マッチング",
    description: "自分と相性が良い人物を見つけ、相互に観察する機能。",
    relatedPhase: "explore",
    trigger: {
      type: "manual-unlock",
      phase: "explore",
      lineIndex: 0,
    },
    category: "game-mechanics",
    examples: ["マッチング機能で相手を探します"],
    relatedKeywords: ["observation", "profile"],
  },

  quest: {
    id: "quest",
    label: "クエスト",
    description: "チュートリアルの目標となるミッション。完了することでストーリーが進む。",
    relatedPhase: "quest",
    trigger: {
      type: "auto-unlock",
      phase: "quest",
      lineIndex: 0,
    },
    category: "game-mechanics",
    examples: ["クエスト: 地図を探してください"],
    relatedKeywords: [],
  },
};

/**
 * キーワードシステム
 */
export class KeywordSystem {
  private unlockedKeywords: Set<string> = new Set();
  private learnedKeywords: Set<string> = new Set();

  /**
   * キーワードをアンロック
   */
  unlock(keywordId: string): boolean {
    if (TUTORIAL_KEYWORDS_EXTENDED[keywordId]) {
      this.unlockedKeywords.add(keywordId);
      return true;
    }
    return false;
  }

  /**
   * キーワードを習得
   */
  learn(keywordId: string): boolean {
    if (this.unlockedKeywords.has(keywordId)) {
      this.learnedKeywords.add(keywordId);
      return true;
    }
    return false;
  }

  /**
   * 新しくアンロックされたキーワードを取得
   */
  getNewUnlockedKeywords(): string[] {
    const newKeywords: string[] = [];
    this.unlockedKeywords.forEach((keywordId) => {
      if (!this.learnedKeywords.has(keywordId)) {
        newKeywords.push(keywordId);
      }
    });
    return newKeywords;
  }

  /**
   * フェーズに応じてキーワードをチェック
   */
  checkAndUnlock(
    phase: TutorialPhase,
    lineIndex: number
  ): string[] {
    const newUnlocks: string[] = [];

    Object.values(TUTORIAL_KEYWORDS_EXTENDED).forEach((keyword) => {
      if (
        !this.unlockedKeywords.has(keyword.id) &&
        keyword.trigger.phase === phase &&
        keyword.trigger.lineIndex <= lineIndex
      ) {
        this.unlock(keyword.id);
        newUnlocks.push(keyword.id);
      }
    });

    return newUnlocks;
  }

  /**
   * キーワード情報を取得
   */
  getKeyword(keywordId: string): Keyword | null {
    return TUTORIAL_KEYWORDS_EXTENDED[keywordId] || null;
  }

  /**
   * 関連キーワードを取得
   */
  getRelatedKeywords(keywordId: string): Keyword[] {
    const keyword = this.getKeyword(keywordId);
    if (!keyword || !keyword.relatedKeywords) return [];

    return keyword.relatedKeywords
      .map((id) => this.getKeyword(id))
      .filter((k) => k !== null) as Keyword[];
  }

  /**
   * 状態をシリアライズ
   */
  serialize() {
    return {
      unlockedKeywords: Array.from(this.unlockedKeywords),
      learnedKeywords: Array.from(this.learnedKeywords),
    };
  }

  /**
   * 状態をデシリアライズ
   */
  deserialize(data: any): void {
    this.unlockedKeywords = new Set(data.unlockedKeywords || []);
    this.learnedKeywords = new Set(data.learnedKeywords || []);
  }
}
