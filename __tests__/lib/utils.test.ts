import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("ユーティリティ関数", () => {
  describe("cn関数", () => {
    it("単一のクラス名を正しく処理する", () => {
      expect(cn("test-class")).toBe("test-class");
    });

    it("複数のクラス名を正しく結合する", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
    });

    it("条件付きクラス名を正しく処理する", () => {
      expect(cn("base", true && "included", false && "excluded")).toBe(
        "base included",
      );
    });

    it("undefined や null を無視する", () => {
      expect(cn("base", undefined, null, "valid")).toBe("base valid");
    });

    it("オブジェクト形式のクラス名を正しく処理する", () => {
      expect(cn("base", { active: true, disabled: false })).toBe("base active");
    });

    it("配列形式のクラス名を正しく処理する", () => {
      expect(cn("base", ["class1", "class2"])).toBe("base class1 class2");
    });

    it("Tailwindのクラス名の衝突を解決する", () => {
      // 同じプロパティに対する複数のクラスがある場合、後のものが優先される
      expect(cn("p-2", "p-4")).toBe("p-4");
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    it("複雑なクラス名の組み合わせを正しく処理する", () => {
      const isActive = true;
      const isDisabled = false;
      const size = "large";

      const result = cn(
        "base-class",
        isActive && "active",
        isDisabled && "disabled",
        {
          "size-sm": size === "small",
          "size-md": size === "medium",
          "size-lg": size === "large",
        },
        ["additional", "classes"],
      );

      expect(result).toBe("base-class active size-lg additional classes");
    });

    it("空の入力に対して空文字列を返す", () => {
      expect(cn()).toBe("");
    });
  });
});
