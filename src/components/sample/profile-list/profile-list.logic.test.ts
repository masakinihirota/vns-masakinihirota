import { describe, it, expect } from "vitest";

import {
  filterProfilesByRole,
  filterProfilesByName,
  sortProfilesByName,
} from "./profile-list.logic";

type Profile = {
  name: string;
  role: string;
  bio: string;
};

const mockProfiles: Profile[] = [
  { name: "山田太郎", role: "エンジニア", bio: "フルスタック開発者" },
  { name: "佐藤花子", role: "デザイナー", bio: "UI/UXデザイナー" },
  { name: "鈴木次郎", role: "エンジニア", bio: "バックエンド開発者" },
  { name: "田中美咲", role: "マネージャー", bio: "プロダクトマネージャー" },
];

describe("profile-list.logic", () => {
  describe("filterProfilesByRole", () => {
    it("指定した役割のプロフィールのみを返す", () => {
      const result = filterProfilesByRole(mockProfiles, "エンジニア");
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("山田太郎");
      expect(result[1].name).toBe("鈴木次郎");
    });

    it("役割が空文字列の場合は全てのプロフィールを返す", () => {
      const result = filterProfilesByRole(mockProfiles, "");
      expect(result).toHaveLength(4);
    });

    it("一致する役割がない場合は空配列を返す", () => {
      const result = filterProfilesByRole(mockProfiles, "存在しない役割");
      expect(result).toHaveLength(0);
    });
  });

  describe("filterProfilesByName", () => {
    it("名前に検索文字列を含むプロフィールを返す", () => {
      const result = filterProfilesByName(mockProfiles, "田");
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("山田太郎");
      expect(result[1].name).toBe("田中美咲");
    });

    it("検索文字列が空の場合は全てのプロフィールを返す", () => {
      const result = filterProfilesByName(mockProfiles, "");
      expect(result).toHaveLength(4);
    });

    it("一致する名前がない場合は空配列を返す", () => {
      const result = filterProfilesByName(mockProfiles, "存在しない名前");
      expect(result).toHaveLength(0);
    });
  });

  describe("sortProfilesByName", () => {
    it("名前を昇順でソートする", () => {
      const result = sortProfilesByName(mockProfiles, "asc");
      expect(result[0].name).toBe("佐藤花子");
      expect(result[1].name).toBe("山田太郎");
      expect(result[2].name).toBe("田中美咲");
      expect(result[3].name).toBe("鈴木次郎");
    });

    it("名前を降順でソートする", () => {
      const result = sortProfilesByName(mockProfiles, "desc");
      expect(result[0].name).toBe("鈴木次郎");
      expect(result[1].name).toBe("田中美咲");
      expect(result[2].name).toBe("山田太郎");
      expect(result[3].name).toBe("佐藤花子");
    });

    it("元の配列を変更しない", () => {
      const original = [...mockProfiles];
      sortProfilesByName(mockProfiles, "asc");
      expect(mockProfiles).toEqual(original);
    });
  });
});
