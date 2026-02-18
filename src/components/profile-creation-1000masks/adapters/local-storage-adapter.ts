import { Profile } from '../profile-creation-1000masks.logic';
import { ProfileStorageAdapter } from '../profile-storage-adapter';

const STORAGE_KEY = 'vns-trial-profiles';

/**
 * 体験版用の LocalStorage アダプター
 */
export class LocalStorageAdapter implements ProfileStorageAdapter {
  /**
   * LocalStorage からプロフィールを読み込む
   */
  async loadProfiles(): Promise<Profile[]> {
    if (typeof window === 'undefined') return [];

    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    try {
      return JSON.parse(data) as Profile[];
    } catch (e) {
      console.error('Failed to parse profiles from LocalStorage', e);
      return [];
    }
  }

  /**
   * LocalStorage にプロフィールを保存する
   * @param profiles 保存するプロフィール配列
   */
  async saveProfiles(profiles: Profile[]): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    } catch (e) {
      console.error('Failed to save profiles to LocalStorage', e);
    }
  }
}
