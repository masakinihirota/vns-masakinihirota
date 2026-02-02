/**
 * MapChat ロジック層のテスト
 * キーワードハイライト機能のテスト
 */
import { describe, expect, it } from "vitest";
import {
    highlightKeywords,
    type ChatMessage,
    type HighlightRule,
} from "./map-chat.logic";

describe("MapChat Logic", () => {
    describe("highlightKeywords", () => {
        const RULES: HighlightRule[] = [
            { label: "オアシス宣言", color: "text-indigo-400" },
            { label: "千の仮面", color: "text-cyan-400" },
            { label: "プロフィール", color: "text-amber-400" },
        ];

        it("キーワードがない場合はそのまま返す", () => {
            const result = highlightKeywords("こんにちは、世界", RULES);
            expect(result).toEqual([{ type: "text", content: "こんにちは、世界" }]);
        });

        it("単一のキーワードをハイライトする", () => {
            const result = highlightKeywords(
                "まずはオアシス宣言を読んでください。",
                RULES
            );
            expect(result).toEqual([
                { type: "text", content: "まずは" },
                { type: "keyword", content: "オアシス宣言", color: "text-indigo-400" },
                { type: "text", content: "を読んでください。" },
            ]);
        });

        it("複数のキーワードをハイライトする", () => {
            const result = highlightKeywords(
                "千の仮面を持つ者のオアシス宣言",
                RULES
            );
            expect(result.length).toBe(3);
            expect(result[0]).toEqual({
                type: "keyword",
                content: "千の仮面",
                color: "text-cyan-400",
            });
            expect(result[2]).toEqual({
                type: "keyword",
                content: "オアシス宣言",
                color: "text-indigo-400",
            });
        });

        it("同じキーワードが複数回出現する場合すべてハイライトする", () => {
            const result = highlightKeywords(
                "プロフィールを作成してプロフィールを確認",
                RULES
            );
            const keywordCount = result.filter((r) => r.type === "keyword").length;
            expect(keywordCount).toBe(2);
        });
    });

    describe("ChatMessage type", () => {
        it("メッセージオブジェクトを正しく構成できる", () => {
            const message: ChatMessage = {
                id: "msg-1",
                speaker: "The Queen",
                text: "ようこそ。",
                timestamp: Date.now(),
            };
            expect(message.speaker).toBe("The Queen");
        });
    });
});
