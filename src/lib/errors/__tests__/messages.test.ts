/**
 * Error Messages Completeness Tests
 *
 * @description
 * すべてのエラーコードに対応するユーザーフレンドリーなメッセージが定義されて
 * いることを確認する基本的なテスト
 */

import { describe, it, expect } from "vitest";
import { ErrorCodes } from "@/lib/errors/app-error";
import { ERROR_MESSAGES, getUserMessage, getSuggestion } from "@/lib/errors/messages";

describe("Error Messages Completeness", () => {
  describe("All error codes have messages defined", () => {
    const errorCodeValues = Object.values(ErrorCodes);

    it(`should have ${errorCodeValues.length} error codes covered`, () => {
      expect(Object.keys(ERROR_MESSAGES).length).toBe(errorCodeValues.length);
    });

    errorCodeValues.forEach((code) => {
      it(`should have message for error code: ${code}`, () => {
        expect(ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES]).toBeDefined();
        const msg = ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES];
        expect(msg.userMessage).toBeTruthy();
        expect(msg.technicalMessage).toBeTruthy();
      });
    });
  });

  describe("Message format validation", () => {
    const messages = Object.values(ERROR_MESSAGES);

    it("should not have empty user messages", () => {
      const emptyMessages = messages.filter((msg) => !msg.userMessage || msg.userMessage.length === 0);
      expect(emptyMessages).toHaveLength(0);
    });

    it("should have reasonable message length", () => {
      const tooLongMessages = messages.filter((msg) => msg.userMessage.length > 300);
      expect(tooLongMessages).toHaveLength(0);
    });

    it("should avoid IT jargon in user messages", () => {
      const problematicMessages = messages.filter((msg) => {
        const text = msg.userMessage.toLowerCase();
        return text.includes("api") || text.includes("null pointer") || text.includes("stack trace");
      });
      expect(problematicMessages).toHaveLength(0);
    });
  });

  describe("getUserMessage function", () => {
    it("should return user message for valid error code", () => {
      const msg = getUserMessage(ErrorCodes.AUTH_INVALID_CREDENTIALS);
      expect(msg).toBe("メールアドレスまたはパスワードが正しくありません");
    });

    it("should return fallback message for unknown code", () => {
      const msg = getUserMessage("UNKNOWN_CODE" as any);
      expect(msg).toBe("予期しないエラーが発生しました");
    });
  });

  describe("getSuggestion function", () => {
    it("should return suggestion for codes that have one", () => {
      const codeWithSuggestion = ErrorCodes.AUTH_INVALID_CREDENTIALS;
      const suggestion = getSuggestion(codeWithSuggestion);
      expect(suggestion).toBeTruthy();
    });

    it("should return undefined for unknown code", () => {
      const suggestion = getSuggestion("UNKNOWN_CODE" as any);
      expect(suggestion).toBeUndefined();
    });
  });

  describe("Message category consistency", () => {
    it("should have messages grouped by error type", () => {
      const categories = {
        AUTH: 0,
        AUTHZ: 0,
        VAL: 0,
        RES: 0,
        DB: 0,
        EXT: 0,
        SYS: 0,
      };

      Object.keys(ERROR_MESSAGES).forEach((code) => {
        if (code.startsWith("AUTH_")) categories.AUTH++;
        else if (code.startsWith("AUTHZ_")) categories.AUTHZ++;
        else if (code.startsWith("VAL_")) categories.VAL++;
        else if (code.startsWith("RES_")) categories.RES++;
        else if (code.startsWith("DB_")) categories.DB++;
        else if (code.startsWith("EXT_")) categories.EXT++;
        else if (code.startsWith("SYS_")) categories.SYS++;
      });

      // カテゴリごとに最低1つはメッセージが必要
      expect(categories.AUTH).toBeGreaterThan(0);
      expect(categories.AUTHZ).toBeGreaterThan(0);
      expect(categories.VAL).toBeGreaterThan(0);
      expect(categories.RES).toBeGreaterThan(0);
    });
  });

  describe("No empty suggestions", () => {
    it("should not have empty-string suggestions", () => {
      const messages = Object.values(ERROR_MESSAGES);
      const emptyExplanations = messages.filter((msg) => msg.suggestion === "");
      expect(emptyExplanations).toHaveLength(0);
    });
  });
});
