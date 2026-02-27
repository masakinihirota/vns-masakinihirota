/**
 * ユーザー検索・フィルターコンポーネント
 * クライアント側のフォーム
 */

'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { searchUsersAction } from '@/app/(protected)/admin/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


import type { SearchResult } from './accounts-content';

/**
 * ユーザー検索フィルタのプロパティ
 */
export interface UserSearchFilterProperties {
  /** 検索実行時に検索結果を返すコールバック */
  onSearch: (result: SearchResult) => void;
  /** ローディング状態かどうか */
  loading?: boolean;
}

/**
 * ユーザー名やID、属性による検索機能を提供するフィルタコンポーネント
 * @param {UserSearchFilterProperties} props - コンポーネントのプロパティ
 * @param {(result: SearchResult) => void} props.onSearch - 検索結果を親へ通知するコールバック
 * @param {boolean | undefined} [props.loading] - ローディング状態
 * @returns {JSX.Element} 検索フィルタのレンダリング結果
 */
export function UserSearchFilter({ onSearch, loading }: UserSearchFilterProperties) {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [role, setRole] = useState<'all' | 'member' | 'admin' | 'leader' | 'mediator'>('all');
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    setSearching(true);
    try {
      const result = await searchUsersAction({
        searchTerm,
        status,
        role,
        page: 1,
      });

      if (result.success && result.data) {
        onSearch(result.data);
      } else {
        toast.error(result.error || 'Search failed');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setSearching(false);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setStatus('all');
    setRole('all');
  };

  return (
    <div className="bg-card p-4 rounded-lg border shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 検索入力 */}
        <div>
          <label className="text-sm font-medium mb-1 block">名前 / ID</label>
          <Input
            placeholder="alice / usr009"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={searching || loading}
          />
        </div>

        {/* ステータスフィルタ */}
        <div>
          <label className="text-sm font-medium mb-1 block">ステータス</label>
          <Select value={status} onValueChange={(v) => setStatus(v as any)} disabled={searching || loading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全て</SelectItem>
              <SelectItem value="active">🟢 Active</SelectItem>
              <SelectItem value="inactive">🔴 Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ロールフィルタ */}
        <div>
          <label className="text-sm font-medium mb-1 block">ロール</label>
          <Select value={role} onValueChange={(v) => setRole(v as any)} disabled={searching || loading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全て</SelectItem>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="leader">Leader</SelectItem>
              <SelectItem value="mediator">Mediator</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ボタン */}
        <div className="flex items-end gap-2">
          <Button
            onClick={handleSearch}
            disabled={searching || loading}
            className="flex-1"
          >
            🔍 検索
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            disabled={searching || loading}
            className="flex-1"
          >
            リセット
          </Button>
        </div>
      </div>
    </div>
  );
}
