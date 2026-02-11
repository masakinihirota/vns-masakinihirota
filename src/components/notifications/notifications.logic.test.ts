import { describe, expect, it } from "vitest";
import { useMarkAsRead, useNotifications } from "./notifications.logic";

describe("notifications.logic", () => {
  describe("useNotifications", () => {
    it("関数が定義されている", () => {
      // Assert
      expect(useNotifications).toBeDefined();
    });
  });

  describe("useMarkAsRead", () => {
    it("関数が定義されている", () => {
      // Assert
      expect(useMarkAsRead).toBeDefined();
    });
  });

  // TODO: useNotifications のデータ取得テスト
  // TODO: useMarkAsRead の既読処理テスト
});
