import { describe, it, expect } from "vitest";
import {
  calculateComparison,
  MOCK_SUBJECTS,
  MOCK_CANDIDATES,
} from "./manual-matching-console.logic";

describe("Manual Matching Console Logic", () => {
  it("共通の作品（commonWorks）を正しく抽出する", () => {
    // Arrange
    const subject = MOCK_SUBJECTS[0]; // Kenta (Has ONE PIECE, 宇宙兄弟)
    const candidate = MOCK_CANDIDATES[0]; // Mai (Has 宇宙兄弟)
    // Expected common: 宇宙兄弟

    // Act
    const result = calculateComparison(subject, candidate);

    // Assert
    expect(result.commonWorks).toHaveLength(1);
    expect(result.commonWorks[0].title).toBe("宇宙兄弟");
  });

  it("共通の価値観（commonValues）を正しく抽出する", () => {
    // Arrange
    const subject = MOCK_SUBJECTS[0]; // Kenta
    const candidate = MOCK_CANDIDATES[0]; // Mai
    // Kenta values: ['仕事より家庭優先', '隠し事はしない', '週末はアクティブに', '金銭感覚は堅実']
    // Mai values: ['仕事より家庭優先', '嘘をつかない', '週末はのんびり', '記念日を祝う']
    // Common: '仕事より家庭優先'

    // Act
    const result = calculateComparison(subject, candidate);

    // Assert
    expect(result.commonValues).toContain("仕事より家庭優先");
  });

  it("異なる作品がユニークリストに含まれること", () => {
    // Arrange
    const subject = MOCK_SUBJECTS[0];
    const candidate = MOCK_CANDIDATES[0];

    // Act
    const result = calculateComparison(subject, candidate);

    // Assert
    expect(result.subjectUniqueWorks.some((w) => w.title === "ONE PIECE")).toBe(
      true,
    );
    expect(
      result.candidateUniqueWorks.some(
        (w) => w.title === "グレイテスト・ショーマン",
      ),
    ).toBe(true);
  });
});
