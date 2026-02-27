import { Profile } from "../profile-creation-1000masks.logic";
import { ProfileStorageAdapter } from "../profile-storage-adapter";

/**
 * 本番用の Postgres アダプター (API経由)
 */
export class PostgresAdapter implements ProfileStorageAdapter {
  /**
   * API からプロフィールを読み込む
   */
  async loadProfiles(): Promise<Profile[]> {
    // eslint-disable-next-line no-restricted-syntax
    try {
      const response = await fetch("/api/profiles");
      if (!response.ok) {
        throw new Error("Failed to load profiles");
      }
      return await response.json();
    } catch (error) {
      console.error("PostgresAdapter.loadProfiles failed", error);
      return [];
    }
  }

  /**
   * API にプロフィールを保存する
   * @param profiles 保存するプロフィール配列
   */
  async saveProfiles(profiles: Profile[]): Promise<void> {
    // eslint-disable-next-line no-restricted-syntax
    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profiles),
      });

      if (!response.ok) {
        let errorMessage = "Failed to save profiles";
        // eslint-disable-next-line no-restricted-syntax
        try {
          const errorData = await response.json();
          if (errorData?.errors) {
            const messages = Object.entries(errorData.errors)
              .map(
                ([field, msgs]) =>
                  `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`
              )
              .join("\n");
            errorMessage = `入力内容にエラーがあります:\n${messages}`;
          } else if (errorData?.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // JSONパースに失敗した場合はデフォルトメッセージを使用
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("PostgresAdapter.saveProfiles failed", error);
      throw error; // 上位層でエラー表示するためスローする
    }
  }
}
