import { describe, it, expect } from "vitest";
import {
  parseMarkdownToMandala,
  generateMarkdownFromMandala,
  SKELETON_MARKDOWN,
} from "./mandala-editor.logic";
import { SKELETON_DATA } from "./mandala-editor.types";

describe("MandalaEditor Logic (Professional Refactor)", () => {
  describe("parseMarkdownToMandala", () => {
    it("標準的なMarkdownを正しくパースできる", () => {
      const md = `# [C] 中心目標
- [1] アイテム1
- [2] アイテム2

## [A] サブ目標A
- [1] A1
`;
      const result = parseMarkdownToMandala(md);
      expect(result.center.title).toBe("中心目標");
      expect(result.center.items[0]).toBe("アイテム1");
      expect(result.blocks[0].label).toBe("A");
      expect(result.blocks[0].title).toBe("サブ目標A");
      expect(result.blocks[0].items[0]).toBe("A1");
    });

    it("空のMarkdownやスケルトンを正しく処理できる", () => {
      const result = parseMarkdownToMandala(SKELETON_MARKDOWN);
      expect(result).toEqual(SKELETON_DATA);
    });

    it("不正な形式の行を無視し、壊れずにパースを継続できる", () => {
      const md = `# [C] 有効なタイトル
- [1] アイテム1
不正な行
## [Z] 存在しないラベル
## [B] 有効なラベル
- [2] アイテム2 (1を飛ばす)
`;
      const result = parseMarkdownToMandala(md);
      expect(result.center.title).toBe("有効なタイトル");
      expect(result.center.items[0]).toBe("アイテム1");
      expect(result.blocks[1].label).toBe("B");
      // アイテムインデックスは単調増加として扱う（1個目に入る）
      expect(result.blocks[1].items[0]).toBe("アイテム2 (1を飛ばす)");
    });

    it("ヘッダーと同じ行にタイトルがない場合も動作する", () => {
      const md = `# [C]
- [1] アイテム1
`;
      const result = parseMarkdownToMandala(md);
      expect(result.center.title).toBe("");
      expect(result.center.items[0]).toBe("アイテム1");
    });
  });

  describe("generateMarkdownFromMandala", () => {
    it("オブジェクトからMarkdownを正確に生成できる", () => {
      const data = {
        ...SKELETON_DATA,
        center: { ...SKELETON_DATA.center, title: "中心" },
      };
      const md = generateMarkdownFromMandala(data);
      expect(md).toContain("# [C] 中心");
      expect(md).toContain("## [A]");
      expect(md).toContain("- [1]");
    });

    it("パースして生成したものが、等価な構造を保つ（冪等性）", () => {
      const md = generateMarkdownFromMandala(SKELETON_DATA);
      const parsed = parseMarkdownToMandala(md);
      const regenerated = generateMarkdownFromMandala(parsed);
      expect(regenerated).toBe(md);
    });
  });
});
