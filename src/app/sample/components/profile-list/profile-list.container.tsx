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
 * プロフィールリストのコンテナコンポーネント
 * フィルタリングとソート機能を提供
 * @param profiles - 表示するプロフィールの配列
 */
export const ProfileListContainer = ({ profiles }: ProfileListContainerProps) => {
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
            <div className="flex flex-col sm:flex-row gap-3 p-4 bg-muted/50 rounded-lg">
                <input
                    type="text"
                    placeholder="名前で検索..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background"
                />

                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-3 py-2 text-sm rounded-md border border-input bg-background"
                >
                    <option value="">全ての役割</option>
                    {uniqueRoles.map((role) => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="px-4 py-2 text-sm rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                    {sortOrder === "asc" ? "↑ 昇順" : "↓ 降順"}
                </button>
            </div>

            {/* 結果表示 */}
            <div className="text-sm text-muted-foreground px-4">
                {filteredAndSortedProfiles.length}件 / {profiles.length}件
            </div>

            {/* プロフィールリスト */}
            <div className="border rounded-lg overflow-hidden">
                {filteredAndSortedProfiles.length > 0 ? (
                    filteredAndSortedProfiles.map((profile, index) => (
                        <ProfileList key={`${profile.name}-${index}`} {...profile} />
                    ))
                ) : (
                    <div className="p-8 text-center text-muted-foreground">
                        該当するプロフィールが見つかりません
                    </div>
                )}
            </div>
        </div>
    );
};
