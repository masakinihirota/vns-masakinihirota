import { Profile } from '../profile-creation-1000masks.logic';
import { ProfileStorageAdapter } from '../profile-storage-adapter';

/**
 * 本番用の Postgres アダプター (API経由)
 */
export class PostgresAdapter implements ProfileStorageAdapter {
  /**
   * API からプロフィールを読み込む
   */
  async loadProfiles(): Promise<Profile[]> {
    try {
      const response = await fetch('/api/profiles');
      if (!response.ok) {
        throw new Error('Failed to load profiles');
      }
      return await response.json();
    } catch (e) {
      console.error('PostgresAdapter.loadProfiles failed', e);
      return [];
    }
  }

  /**
   * API にプロフィールを保存する
   * @param profiles 保存するプロフィール配列
   */
  async saveProfiles(profiles: Profile[]): Promise<void> {
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profiles),
      });

      if (!response.ok) {
        throw new Error('Failed to save profiles');
      }
    } catch (e) {
      console.error('PostgresAdapter.saveProfiles failed', e);
      throw e; // 上位層でエラー表示するためスローする
    }
  }
}
