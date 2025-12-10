type Profile = {
  name: string;
  role: string;
  bio: string;
  avatarUrl?: string;
};

type SortOrder = "asc" | "desc";

/**
 * 役割でプロフィールをフィルタリングする
 * @param profiles - プロフィールの配列
 * @param role - フィルタリングする役割（空文字列の場合は全て返す）
 * @returns フィルタリングされたプロフィールの配列
 */
export const filterProfilesByRole = (profiles: Profile[], role: string): Profile[] => {
  if (role === "") {
    return profiles;
  }
  return profiles.filter((profile) => profile.role === role);
};

/**
 * 名前でプロフィールをフィルタリングする
 * @param profiles - プロフィールの配列
 * @param searchText - 検索文字列（空文字列の場合は全て返す）
 * @returns フィルタリングされたプロフィールの配列
 */
export const filterProfilesByName = (profiles: Profile[], searchText: string): Profile[] => {
  if (searchText === "") {
    return profiles;
  }
  return profiles.filter((profile) => profile.name.includes(searchText));
};

/**
 * 名前でプロフィールをソートする
 * @param profiles - プロフィールの配列
 * @param order - ソート順序（"asc"または"desc"）
 * @returns ソートされたプロフィールの配列（元の配列は変更しない）
 */
export const sortProfilesByName = (profiles: Profile[], order: SortOrder): Profile[] => {
  const sorted = [...profiles].sort((a, b) => {
    return a.name.localeCompare(b.name, "ja");
  });

  return order === "desc" ? sorted.reverse() : sorted;
};

/**
 * プロフィールの配列から重複を除去する
 * @param profiles - プロフィールの配列
 * @returns 重複を除去したプロフィールの配列
 */
export const getUniqueRoles = (profiles: Profile[]): string[] => {
  const roles = profiles.map((profile) => profile.role);
  return Array.from(new Set(roles)).sort((a, b) => a.localeCompare(b, "ja"));
};
