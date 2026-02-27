/**
 * ユーザー管理 - クライアント側コンテンツ
 */

'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { searchUsersAction } from '@/app/(protected)/admin/actions';

import { UserListTable } from './user-list-table';
import { UserSearchFilter } from './user-search-filter';


/**
 * ユーザー情報の定義
 */
export interface User {
  /** ユーザーID */
  id: string;
  /** ルートアカウントID */
  rootAccountId: string;
  /** 表示名 */
  displayName: string;
  /** 利用目的 */
  purpose: string | null;
  /** ロール種別 (admin, member, etc.) */
  roleType: string;
  /** アカウントが有効かどうか */
  isActive: boolean;
  /** 最終インタラクションレコードID */
  lastInteractedRecordId: string | null;
  /** プロフィール形式 */
  profileFormat: string | null;
  /** ロール名 */
  role: string | null;
  /** 利用目的リスト */
  purposes: string[] | null;
  /** プロフィール種別 */
  profileType: string | null;
  /** アバター画像URL */
  avatarUrl: string | null;
  /** 外部リンク情報 (SNSリンク等) */
  externalLinks: unknown;
  /** 作成日時 */
  createdAt: string;
  /** 更新日時 */
  updatedAt: string;
}

export interface SearchResult {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface AccountsContentProperties {
  initialData: SearchResult;
}

/**
 * ユーザー管理ページのメインコンテンツコンポーネント
 * @param {AccountsContentProperties} props - コンポーネントのプロパティ
 * @param {SearchResult} props.initialData - 初期表示用の検索結果データ
 * @returns {JSX.Element} ユーザー管理画面のレンダリング結果
 */
export function AccountsContent({ initialData }: AccountsContentProperties) {
  const [searchResult, setSearchResult] = useState<SearchResult>(initialData);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialData.page || 1);

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    setLoading(true);
    try {
      const result = await searchUsersAction({
        searchTerm: '',
        status: 'all',
        role: 'all',
        page: newPage,
      });

      if (result.success && result.data) {
        setSearchResult(result.data);
      } else {
        toast.error(result.error || 'Failed to load users');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (result: SearchResult) => {
    setSearchResult(result);
    setPage(result.page || 1);
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const result = await searchUsersAction({
        searchTerm: '',
        status: 'all',
        role: 'all',
        page: 1,
      });

      if (result.success && result.data) {
        setSearchResult(result.data);
        setPage(1);
      } else {
        toast.error(result.error || 'Failed to refresh');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">👥 ユーザー管理</h1>
        <p className="text-muted-foreground mt-1">ユーザー検索・ロール・ステータス管理</p>
      </div>

      {/* 検索フィルター */}
      <UserSearchFilter onSearch={handleSearch} loading={loading} />

      {/* ユーザーリスト */}
      <UserListTable
        users={searchResult.users}
        total={searchResult.total}
        page={page}
        onPageChange={handlePageChange}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
