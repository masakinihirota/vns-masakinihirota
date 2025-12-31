"use client";

import { useState, useMemo } from "react";
import { ProfileList } from "./profile-list";
import {
  filterProfilesByRole,
  filterProfilesByName,
  sortProfilesByName,
  getUniqueRoles,
  type Profile,
} from "./profile-list.logic";

interface ProfileListContainerProps {
  readonly profiles: readonly Profile[];
}

/**
 * プロフィールリストのコンテナコンポーネント（DADS準拠）
 * フィルタリングとソート機能を提供
 * @param profiles - 表示するプロフィールの配列
 *
 * @remarks
 * - Tailwind CSS標準クラスのみを使用（DADS準拠）
 * - フォーカスリングは ring-yellow-400 で統一
 * - aria-describedby でサポートテキストを紐付け
 * - コントラスト比 4.5:1 以上を確保
 */
export const ProfileListContainer = ({
  profiles,
}: ProfileListContainerProps) => {
  const [searchText, setSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // ユニークな役割を取得
  const uniqueRoles = useMemo(() => getUniqueRoles({ profiles }), [profiles]);

  // フィルタリングとソートを適用
  const filteredAndSortedProfiles = useMemo(() => {
    let result = profiles;

    // 名前でフィルタリング
    if (searchText) {
      result = filterProfilesByName({ profiles: result, searchText });
    }

    // 役割でフィルタリング
    if (selectedRole) {
      result = filterProfilesByRole({ profiles: result, role: selectedRole });
    }

    // ソート
    result = sortProfilesByName({ profiles: result, order: sortOrder });

    return result;
  }, [profiles, searchText, selectedRole, sortOrder]);

  return (
    <div className="space-y-4">
      {/* フィルター・ソートコントロール */}
      <div className="flex flex-col sm:flex-row gap-3 p-6 bg-blue-50 rounded-lg">
        <div className="flex-1">
          <label htmlFor="search-input" className="sr-only">
            名前で検索
          </label>
          <input
            id="search-input"
            type="text"
            placeholder="名前で検索..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            aria-describedby="search-support"
            className="w-full px-4 py-3 text-base text-gray-900 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-blue-600"
          />
          <p id="search-support" className="sr-only">
            プロフィールを名前で絞り込みます
          </p>
        </div>

        <div>
          <label htmlFor="role-select" className="sr-only">
            役割でフィルター
          </label>
          <select
            id="role-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            aria-describedby="role-support"
            className="w-full px-4 py-3 text-base text-gray-900 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-blue-600"
          >
            <option value="">全ての役割</option>
            {uniqueRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <p id="role-support" className="sr-only">
            役割でプロフィールを絞り込みます
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          aria-label={sortOrder === "asc" ? "降順に並び替え" : "昇順に並び替え"}
          className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-blue-600 rounded-md border-2 border-blue-600 bg-white transition-colors hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-yellow-400 active:bg-blue-100"
        >
          {sortOrder === "asc" ? "↑ 昇順" : "↓ 降順"}
        </button>
      </div>

      {/* 結果表示 */}
      <div
        className="text-sm text-gray-600 px-4"
        role="status"
        aria-live="polite"
      >
        {filteredAndSortedProfiles.length}件 / {profiles.length}件
      </div>

      {/* プロフィールリスト */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {filteredAndSortedProfiles.length > 0 ? (
          filteredAndSortedProfiles.map((profile, index) => (
            <ProfileList key={`${profile.name}-${index}`} {...profile} />
          ))
        ) : (
          <div className="p-8 text-center text-gray-600" role="status">
            該当するプロフィールが見つかりません
          </div>
        )}
      </div>
    </div>
  );
};
