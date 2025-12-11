import { describe, it, expect } from "vitest";
import {
  filterProfilesByRole,
  filterProfilesByName,
  sortProfilesByName,
  getUniqueRoles,
  type Profile,
} from "./profile-list.logic";

describe("profile-list.logic - 結合テスト", () => {
  const testProfiles: readonly Profile[] = [
    { name: "山田太郎", role: "エンジニア", bio: "フルスタック開発者" },
    { name: "佐藤花子", role: "デザイナー", bio: "UI/UXデザイナー" },
    { name: "鈴木次郎", role: "エンジニア", bio: "バックエンドエンジニア" },
    { name: "田中美咲", role: "プロダクトマネージャー", bio: "PM" },
    { name: "伊藤健一", role: "エンジニア", bio: "フロントエンドエンジニア" },
  ] as const;

  describe("複合フィルタリング", () => {
    it("役割と名前の両方でフィルタリングできる", () => {
      // 役割で絞り込み
      const engineersOnly = filterProfilesByRole({
        profiles: testProfiles,
        role: "エンジニア",
      });

      // さらに名前で絞り込み
      const result = filterProfilesByName({
        profiles: engineersOnly,
        searchText: "山田",
      });

      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe("山田太郎");
    });

    it("フィルタリング後にソートできる", () => {
      // エンジニアのみを抽出
      const filtered = filterProfilesByRole({
        profiles: testProfiles,
        role: "エンジニア",
      });

      // 昇順ソート
      const sorted = sortProfilesByName({
        profiles: filtered,
        order: "asc",
      });

      expect(sorted).toHaveLength(3);
      // 日本語のlocaleCompareの結果に合わせる
      expect(sorted[0]?.name).toBe("伊藤健一");
      expect(sorted[1]?.name).toBe("山田太郎");
      expect(sorted[2]?.name).toBe("鈴木次郎");
    });

    it("全ての操作を組み合わせることができる", () => {
      // 1. エンジニアのみ
      let result = filterProfilesByRole({
        profiles: testProfiles,
        role: "エンジニア",
      });

      // 2. 名前に「田」を含む
      result = filterProfilesByName({
        profiles: result,
        searchText: "田",
      });

      // 3. 降順ソート
      result = sortProfilesByName({
        profiles: result,
        order: "desc",
      });

      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe("山田太郎");
    });
  });

  describe("エッジケースと境界値", () => {
    it("空の配列を処理できる", () => {
      const emptyProfiles: readonly Profile[] = [];

      const filtered = filterProfilesByRole({
        profiles: emptyProfiles,
        role: "エンジニア",
      });
      expect(filtered).toHaveLength(0);

      const sorted = sortProfilesByName({
        profiles: emptyProfiles,
        order: "asc",
      });
      expect(sorted).toHaveLength(0);

      const roles = getUniqueRoles({ profiles: emptyProfiles });
      expect(roles).toHaveLength(0);
    });

    it("一致するものがない場合は空配列を返す", () => {
      const result = filterProfilesByRole({
        profiles: testProfiles,
        role: "存在しない役割",
      });
      expect(result).toHaveLength(0);

      const result2 = filterProfilesByName({
        profiles: testProfiles,
        searchText: "XXXXX",
      });
      expect(result2).toHaveLength(0);
    });

    it("全てが一致する場合は全件返す", () => {
      const result = filterProfilesByName({
        profiles: testProfiles,
        searchText: "",
      });
      expect(result).toHaveLength(testProfiles.length);

      const result2 = filterProfilesByRole({
        profiles: testProfiles,
        role: "",
      });
      expect(result2).toHaveLength(testProfiles.length);
    });
  });

  describe("不変性の検証", () => {
    it("元の配列を変更しない", () => {
      const original = [...testProfiles];

      // 各操作を実行
      filterProfilesByRole({ profiles: testProfiles, role: "エンジニア" });
      filterProfilesByName({ profiles: testProfiles, searchText: "田" });
      sortProfilesByName({ profiles: testProfiles, order: "desc" });
      getUniqueRoles({ profiles: testProfiles });

      // 元の配列が変更されていないことを確認
      expect(testProfiles).toEqual(original);
    });

    it("操作の結果が新しい配列である", () => {
      const result1 = filterProfilesByRole({
        profiles: testProfiles,
        role: "エンジニア",
      });
      expect(result1).not.toBe(testProfiles);

      const result2 = sortProfilesByName({
        profiles: testProfiles,
        order: "asc",
      });
      expect(result2).not.toBe(testProfiles);
    });
  });

  describe("実際のユースケース", () => {
    it("検索機能のシミュレーション", () => {
      // ユーザーが「エンジニア」を選択
      let displayProfiles = filterProfilesByRole({
        profiles: testProfiles,
        role: "エンジニア",
      });
      expect(displayProfiles).toHaveLength(3);

      // さらに「山」で検索
      displayProfiles = filterProfilesByName({
        profiles: displayProfiles,
        searchText: "山",
      });
      expect(displayProfiles).toHaveLength(1);
      expect(displayProfiles[0]?.name).toBe("山田太郎");
    });

    it("役割セレクトボックスのオプション生成", () => {
      const roles = getUniqueRoles({ profiles: testProfiles });

      expect(roles).toContain("エンジニア");
      expect(roles).toContain("デザイナー");
      expect(roles).toContain("プロダクトマネージャー");
      expect(roles).toHaveLength(3);

      // ソートされていることを確認
      expect(roles[0]).toBe("エンジニア");
      expect(roles[1]).toBe("デザイナー");
      expect(roles[2]).toBe("プロダクトマネージャー");
    });

    it("複数の条件でフィルタリングしてソート", () => {
      // 実際のコンテナコンポーネントのロジックをシミュレート
      const searchText = "田";
      const selectedRole = "エンジニア";
      const sortOrder = "desc";

      let result = testProfiles;

      if (searchText) {
        result = filterProfilesByName({ profiles: result, searchText });
      }

      if (selectedRole) {
        result = filterProfilesByRole({ profiles: result, role: selectedRole });
      }

      result = sortProfilesByName({ profiles: result, order: sortOrder });

      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe("山田太郎");
    });
  });
});
