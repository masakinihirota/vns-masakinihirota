import { describe, it, expect } from "vitest";
import {
  normalizeRootAccountData,
  timeToHours,
  hoursToTime,
  calculateTotalCoreHours,
} from "../root-account-utils";

describe("normalizeRootAccountData", () => {
  it("旧スキーマ（単一言語コード）から新スキーマ（配列）への変換", () => {
    const oldData = {
      id: "test-id",
      mother_tongue_code: "ja",
      site_language_code: "en",
    };

    const result = normalizeRootAccountData(oldData);

    expect(result.mother_tongue_codes).toEqual(["ja"]);
    expect(result.available_language_codes).toEqual(["en"]);
  });

  it("既に配列形式のデータはそのまま返す", () => {
    const newData = {
      id: "test-id",
      mother_tongue_codes: ["ja", "en"],
      available_language_codes: ["ja", "en", "es"],
    };

    const result = normalizeRootAccountData(newData);

    expect(result.mother_tongue_codes).toEqual(["ja", "en"]);
    expect(result.available_language_codes).toEqual(["ja", "en", "es"]);
  });

  it("言語コードが存在しない場合は空配列を返す", () => {
    const emptyData = {
      id: "test-id",
    };

    const result = normalizeRootAccountData(emptyData);

    expect(result.mother_tongue_codes).toEqual([]);
    expect(result.available_language_codes).toEqual([]);
  });
});

describe("timeToHours", () => {
  it("時間文字列をアワー値に正しく変換", () => {
    expect(timeToHours("09:00")).toBe(9);
    expect(timeToHours("09:30")).toBe(9.5);
    expect(timeToHours("12:45")).toBe(12.75);
    expect(timeToHours("00:00")).toBe(0);
    expect(timeToHours("23:59")).toBeCloseTo(23.983, 2);
  });

  it("空文字列は0を返す", () => {
    expect(timeToHours("")).toBe(0);
  });
});

describe("hoursToTime", () => {
  it("アワー値を時間文字列に正しく変換", () => {
    expect(hoursToTime(9)).toBe("09:00");
    expect(hoursToTime(9.5)).toBe("09:30");
    expect(hoursToTime(12.75)).toBe("12:45");
    expect(hoursToTime(0)).toBe("00:00");
    expect(hoursToTime(23.983)).toBe("23:59");
  });

  it("24時間を超える値も処理可能", () => {
    expect(hoursToTime(24)).toBe("24:00");
    expect(hoursToTime(25.5)).toBe("25:30");
  });
});

describe("calculateTotalCoreHours", () => {
  it("同日内で完結する場合の計算", () => {
    expect(calculateTotalCoreHours("09:00", "18:00")).toBe(9);
    expect(calculateTotalCoreHours("10:30", "15:45")).toBe(5.25);
  });

  it("日をまたぐ場合の計算", () => {
    expect(calculateTotalCoreHours("22:00", "06:00")).toBe(8);
    expect(calculateTotalCoreHours("23:30", "01:30")).toBe(2);
  });

  it("24時を超えて翌日まで続く場合", () => {
    expect(calculateTotalCoreHours("09:00", "24:00", 6)).toBe(21); // 9:00-24:00 + 0:00-6:00
    expect(calculateTotalCoreHours("20:00", "24:00", 4)).toBe(8); // 20:00-24:00 + 0:00-4:00
  });

  it("エッジケース: 0時開始", () => {
    expect(calculateTotalCoreHours("00:00", "08:00")).toBe(8);
    expect(calculateTotalCoreHours("00:00", "24:00")).toBe(24);
  });

  it("エッジケース: 開始と終了が同じ", () => {
    expect(calculateTotalCoreHours("12:00", "12:00")).toBe(0);
  });

  it("エッジケース: 30分単位の細かい時間", () => {
    expect(calculateTotalCoreHours("09:15", "17:45")).toBe(8.5);
  });
});
