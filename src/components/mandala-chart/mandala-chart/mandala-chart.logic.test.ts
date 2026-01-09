import { describe, it, expect } from "vitest";
import {
  generateMarkdownFromMandala,
  parseMarkdownToMandala,
} from "./mandala-chart.logic";

describe("MandalaChart Logic (9-block format)", () => {
  const createEmptyBlocks = () =>
    Array(9)
      .fill(0)
      .map(() => Array(9).fill(""));

  it("新フォーマットの Markdown からグリッドをパースできる", () => {
    const markdown = `
---
# ★(0)
人生の目標

## 0-1
仕事

## 0-2
健康

---
# 1
仕事

## 1-1
スキルアップ
    `;

    const blocks = parseMarkdownToMandala(markdown);

    // Block 4 (★)
    expect(blocks[4][4]).toBe("人生の目標");
    expect(blocks[4][0]).toBe("仕事");
    expect(blocks[4][1]).toBe("健康");

    // Block 0 (1)
    // 同期により blocks[0][4] は blocks[4][0] ("仕事") になっているはず
    // だが、Markdown で "# 1" の下に "仕事" と書いてあるのでそれが保持される
    expect(blocks[0][4]).toBe("仕事");
    expect(blocks[0][0]).toBe("スキルアップ");
  });

  it("グリッドから新フォーマットの Markdown を生成できる", () => {
    const blocks = createEmptyBlocks();
    blocks[4][4] = "人生の目標";
    blocks[4][0] = "仕事";
    blocks[0][4] = "仕事"; // 本来は同期される
    blocks[0][0] = "スキルアップ";

    const markdown = generateMarkdownFromMandala(blocks);

    expect(markdown).toContain("# ★(0)");
    expect(markdown).toContain("人生の目標");
    expect(markdown).toContain("## 0-1");
    expect(markdown).toContain("仕事");
    expect(markdown).toContain("# 1");
    expect(markdown).toContain("## 1-1");
    expect(markdown).toContain("スキルアップ");
  });

  it("相互変換でデータが保持される (Round trip)", () => {
    const originalMarkdown = "---\n# ★(0)\nテーマ\n\n## 0-1\nサブ1\n";
    const blocks = parseMarkdownToMandala(originalMarkdown);
    const generatedMarkdown = generateMarkdownFromMandala(blocks);

    expect(generatedMarkdown).toContain("# ★(0)");
    expect(generatedMarkdown).toContain("テーマ");
    expect(generatedMarkdown).toContain("## 0-1");
    expect(generatedMarkdown).toContain("サブ1");
  });
});
