import { Profile } from './profile-creation-1000masks.logic';

/**
 * プロフィール作成画面で、プロフィールの永続化を担当するアダプターのインタフェース
 */
export interface ProfileStorageAdapter {
  /**
   * 保存されているプロフィール一覧を読み込む
   */
  loadProfiles(): Promise<Profile[]>;

  /**
   * プロフィール一覧を保存する
   * @param profiles 保存するプロフィール配列
   */
  saveProfiles(profiles: Profile[]): Promise<void>;
}
