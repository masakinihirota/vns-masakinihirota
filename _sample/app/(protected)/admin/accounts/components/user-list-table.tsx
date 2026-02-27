/**
 * ユーザー一覧テーブルコンポーネント
 */

'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import {
  issuePenaltyAction,
  updateUserRoleAction,
  updateUserStatusAction,
} from '@/app/(protected)/admin/actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';


import type { User } from './accounts-content';

/**
 * ユーザー一覧テーブルのプロパティ
 */
export interface UserListTableProperties {
  /** ユーザーデータの配列 */
  users: User[];
  /** 総ユーザー件数 */
  total: number;
  /** 現在のページ番号 */
  page: number;
  /** ページ変更時のコールバック */
  onPageChange: (page: number) => void;
  /** データを再取得するためのコールバック */
  onRefresh?: () => void;
}

/**
 * ユーザー一覧を表示し、ロール変更やペナルティ発行などの操作を提供するテーブルコンポーネント
 * @param props - コンポーネントのプロパティ
 * @param props.users
 * @param props.total
 * @param props.page
 * @param props.onPageChange
 * @param props.onRefresh
 * @returns ユーザー一覧テーブルのレンダリング結果
 */
export function UserListTable({
  users,
  total,
  page,
  onPageChange,
  onRefresh,
}: UserListTableProperties) {
  const [updating, setUpdating] = useState<string | undefined>();
  const limit = 20;
  const totalPages = Math.ceil(total / limit);

  const statusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
        🟢 Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
        🔴 Inactive
      </span>
    );
  };

  const handleRoleChange = async (
    userId: string,
    newRole: 'member' | 'admin' | 'leader' | 'mediator'
  ) => {
    setUpdating(userId);
    try {
      const result = await updateUserRoleAction({
        userId,
        newRole,
      });

      if (result.success) {
        toast.success(`Role updated to ${newRole}`);
        onRefresh?.();
      } else {
        toast.error(result.error || 'Failed to update role');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setUpdating(undefined);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    setUpdating(userId);
    try {
      const result = await updateUserStatusAction({
        userId,
        isActive: !currentStatus,
      });

      if (result.success) {
        toast.success(`User ${currentStatus ? 'deactivated' : 'activated'}`);
        onRefresh?.();
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setUpdating(undefined);
    }
  };

  const handleIssuePenalty = async (
    userId: string,
    type: 'notice' | 'warning' | 'card' | 'leave' | 'another_dimension',
    reason: string
  ) => {
    setUpdating(userId);
    try {
      const result = await issuePenaltyAction({
        targetUserId: userId,
        type,
        reason,
      });

      if (result.success) {
        toast.success(`Penalty issued: ${type}`);
        onRefresh?.();
      } else {
        toast.error(result.error || 'Failed to issue penalty');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setUpdating(undefined);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-20">ID</TableHead>
              <TableHead>名前</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>ロール</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  ユーザーが見つかりません
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-xs truncate max-w-32" title={user.id}>
                    {user.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="font-medium">{user.displayName}</TableCell>
                  <TableCell>{statusBadge(user.isActive)}</TableCell>
                  <TableCell>
                    <span className="inline-flex px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-semibold">
                      {user.roleType}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={updating === user.id}
                        >
                          ︙ 操作
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          ロール変更
                        </div>
                        {['member', 'admin', 'leader', 'mediator'].map((role) => (
                          <DropdownMenuItem
                            key={role}
                            onClick={() => handleRoleChange(user.id, role as any)}
                            disabled={user.roleType === role}
                          >
                            {role}
                          </DropdownMenuItem>
                        ))}
                        <div className="my-1 border-t" />
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          ステータス
                        </div>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(user.id, user.isActive)}
                        >
                          {user.isActive ? '🔴 停止' : '🟢 復旧'}
                        </DropdownMenuItem>
                        <div className="my-1 border-t" />
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          ペナルティ
                        </div>
                        {['notice', 'warning', 'card', 'leave'].map((penaltyType) => (
                          <DropdownMenuItem
                            key={penaltyType}
                            onClick={() =>
                              handleIssuePenalty(
                                user.id,
                                penaltyType as any,
                                `Issued by admin: ${penaltyType}`
                              )
                            }
                          >
                            ⚠️ {penaltyType}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ページネーション */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          全 {total} 件中 {(page - 1) * limit + 1} - {Math.min(page * limit, total)} 件
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            ← 前へ
          </Button>
          <div className="flex items-center gap-1 px-3 py-1 font-medium">
            {page} / {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            次へ →
          </Button>
        </div>
      </div>
    </div>
  );
}
