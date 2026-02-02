/**
 * MapChat ロジック層
 * キーワードハイライト機能とチャットメッセージ型定義
 */

/**
 * チャットメッセージの型定義
 */
export interface ChatMessage {
  id: string;
  speaker: "The Queen" | "Guide" | "System" | "You";
  text: string;
  timestamp: number;
}

/**
 * キーワードハイライトルールの型定義
 */
export interface HighlightRule {
  label: string;
  color?: string;
}

/**
 * ハイライト結果の型定義
 */
export type HighlightSegment =
  | { type: "text"; content: string }
  | { type: "keyword"; content: string; color: string };

/**
 * テキスト内のキーワードをハイライト用セグメントに分割する
 * @param text - 対象テキスト
 * @param rules - ハイライトルールの配列
 * @returns セグメント配列
 */
export function highlightKeywords(
  text: string,
  rules: HighlightRule[]
): HighlightSegment[] {
  if (!rules || rules.length === 0) {
    return [{ type: "text", content: text }];
  }

  const segments: HighlightSegment[] = [];
  let remainingText = text;

  while (remainingText.length > 0) {
    let earliestMatch: {
      index: number;
      rule: HighlightRule;
    } | null = null;

    // 最も早く出現するキーワードを探す
    for (const rule of rules) {
      const index = remainingText.indexOf(rule.label);
      if (
        index !== -1 &&
        (earliestMatch === null || index < earliestMatch.index)
      ) {
        earliestMatch = { index, rule };
      }
    }

    if (earliestMatch) {
      // キーワード前のテキスト
      if (earliestMatch.index > 0) {
        segments.push({
          type: "text",
          content: remainingText.slice(0, earliestMatch.index),
        });
      }
      // ハイライトされたキーワード
      segments.push({
        type: "keyword",
        content: earliestMatch.rule.label,
        color: earliestMatch.rule.color || "text-indigo-400",
      });
      remainingText = remainingText.slice(
        earliestMatch.index + earliestMatch.rule.label.length
      );
    } else {
      segments.push({ type: "text", content: remainingText });
      break;
    }
  }

  return segments;
}
