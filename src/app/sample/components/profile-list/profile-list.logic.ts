export type Profile = {
  readonly name: string;
  readonly role: string;
  readonly bio: string;
  readonly avatarUrl?: string;
};

export type SortOrder = "asc" | "desc";

const EMPTY_STRING = "" as const;

/**
 * 役割でプロフィールをフィルタリングする
 *
 * @param params - パラメータオブジェクト
 * @param params.profiles - プロフィールの配列
 * @param params.role - フィルタリングする役割（空文字列の場合は全て返す）
 * @returns フィルタリングされたプロフィールの配列
 *
 * @example
 * ```typescript
 * const profiles: readonly Profile[] = [
 *   { name: "山田太郎", role: "エンジニア", bio: "開発者" },
 *   { name: "佐藤花子", role: "デザイナー", bio: "デザイナー" },
 * ];
 * const result = filterProfilesByRole({ profiles, role: "エンジニア" });
 * // result: [{ name: "山田太郎", role: "エンジニア", bio: "開発者" }]
 * ```
 *
 * @remarks
 * - 空文字列を渡すと元の配列をそのまま返します
 * - 一致する役割がない場合は空配列を返します
 * - 元の配列は変更されません（immutable）
 */
export const filterProfilesByRole = ({
  profiles,
  role,
}: {
  readonly profiles: readonly Profile[];
  readonly role: string;
}): readonly Profile[] => {
  if (role === EMPTY_STRING) {
    return profiles;
  }
  return profiles.filter((profile) => profile.role === role);
};

/**
 * 名前でプロフィールをフィルタリングする
 *
 * @param params - パラメータオブジェクト
 * @param params.profiles - プロフィールの配列
 * @param params.searchText - 検索文字列（空文字列の場合は全て返す）
 * @returns フィルタリングされたプロフィールの配列
 *
 * @example
 * ```typescript
 * const profiles: readonly Profile[] = [
 *   { name: "山田太郎", role: "エンジニア", bio: "開発者" },
 *   { name: "田中美咲", role: "デザイナー", bio: "デザイナー" },
 * ];
 * const result = filterProfilesByName({ profiles, searchText: "田" });
 * // result: [{ name: "山田太郎", ... }, { name: "田中美咲", ... }]
 * ```
 *
 * @remarks
 * - 部分一致で検索します
 * - 空文字列を渡すと元の配列をそのまま返します
 * - 一致する名前がない場合は空配列を返します
 * - 元の配列は変更されません（immutable）
 */
export const filterProfilesByName = ({
  profiles,
  searchText,
}: {
  readonly profiles: readonly Profile[];
  readonly searchText: string;
}): readonly Profile[] => {
  if (searchText === EMPTY_STRING) {
    return profiles;
  }
  return profiles.filter((profile) => profile.name.includes(searchText));
};

/**
 * 名前でプロフィールをソートする
 *
 * @param params - パラメータオブジェクト
 * @param params.profiles - プロフィールの配列
 * @param params.order - ソート順序（"asc"または"desc"）
 * @returns ソートされたプロフィールの配列（元の配列は変更しない）
 *
 * @example
 * ```typescript
 * const profiles: readonly Profile[] = [
 *   { name: "山田太郎", role: "エンジニア", bio: "開発者" },
 *   { name: "佐藤花子", role: "デザイナー", bio: "デザイナー" },
 * ];
 * const result = sortProfilesByName({ profiles, order: "asc" });
 * // result: [{ name: "佐藤花子", ... }, { name: "山田太郎", ... }]
 * ```
 *
 * @remarks
 * - 日本語のロケールでソートします
 * - 元の配列は変更されません（immutable）
 * - 新しい配列を返します
 */
export const sortProfilesByName = ({
  profiles,
  order,
}: {
  readonly profiles: readonly Profile[];
  readonly order: SortOrder;
}): readonly Profile[] => {
  const sorted = [...profiles].sort((a, b) => {
    return a.name.localeCompare(b.name, "ja");
  });

  return order === "desc" ? sorted.reverse() : sorted;
};

/**
 * プロフィールの配列からユニークな役割のリストを取得する
 *
 * @param params - パラメータオブジェクト
 * @param params.profiles - プロフィールの配列
 * @returns 重複を除去してソートされた役割の配列
 *
 * @example
 * ```typescript
 * const profiles: readonly Profile[] = [
 *   { name: "山田太郎", role: "エンジニア", bio: "開発者" },
 *   { name: "佐藤花子", role: "デザイナー", bio: "デザイナー" },
 *   { name: "鈴木次郎", role: "エンジニア", bio: "開発者" },
 * ];
 * const result = getUniqueRoles({ profiles });
 * // result: ["エンジニア", "デザイナー"]
 * ```
 *
 * @remarks
 * - 重複する役割は1つにまとめられます
 * - 日本語のロケールでソートされます
 * - 元の配列は変更されません（immutable）
 */
export const getUniqueRoles = ({
  profiles,
}: {
  readonly profiles: readonly Profile[];
}): readonly string[] => {
  const roles = profiles.map((profile) => profile.role);
  return Array.from(new Set(roles)).sort((a, b) => a.localeCompare(b, "ja"));
};
