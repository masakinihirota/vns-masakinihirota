/**
 * 管理画面: グループ管理パネル
 *
 * @description
 * 管理者がすべてのグループを管理するための画面
 * - グループ一覧表示
 * - 検索・フィルタリング
 * - グループ削除
 * - メンバー管理
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trash2, ChevronRight, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Group {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    createdAt: string;
    createdBy: string;
}

interface AdminGroupPanelProps {
    initialGroups: Group[];
}

export function AdminGroupPanel({ initialGroups }: AdminGroupPanelProps) {
    const [groups, setGroups] = useState<Group[]>(initialGroups);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    // フィルタリング
    const filteredGroups = groups.filter(
        (group) =>
            group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // グループ削除
    const handleDeleteGroup = async (groupId: string) => {
        if (!window.confirm("このグループを削除しますか？この操作は取り消せません。")) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/groups/${groupId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setGroups((prev) => prev.filter((g) => g.id !== groupId));
                showToast.success("グループを削除しました");
            } else {
                showToast.error("グループの削除に失敗しました");
            }
        } catch (error) {
            showToast.error("エラーが発生しました");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        グループ管理
                    </CardTitle>
                    <span className="text-sm text-slate-500">{filteredGroups.length} グループ</span>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 p-6">
                {/* 検索バー */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="グループ名で検索..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
                    />
                </div>

                {/* グループリスト */}
                {filteredGroups.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                        <p className="text-sm text-slate-500">グループが見つかりません</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredGroups.map((group) => (
                            <div
                                key={group.id}
                                className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 transition-colors hover:bg-slate-50"
                            >
                                <div className="flex-1 space-y-1">
                                    <h4 className="font-medium text-slate-900">{group.name}</h4>
                                    <p className="text-sm text-slate-600">{group.description}</p>
                                    <div className="flex gap-4 text-xs text-slate-500">
                                        <span>メンバー: {group.memberCount}人</span>
                                        <span>作成者: {group.createdBy}</span>
                                        <span>作成日: {new Date(group.createdAt).toLocaleDateString("ja-JP")}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-blue-600 hover:bg-blue-50"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteGroup(group.id)}
                                        disabled={isLoading}
                                        className="text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
