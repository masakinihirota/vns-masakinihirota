import Image from "next/image";
import {
  RootAccountData,
  UserProfile,
  ProfileManagementData,
} from "./root-accounts-controle.logic";

// DataItem コンポーネント
const DataItem: React.FC<{
  label: string;
  value: React.ReactNode;
  valueClass?: string;
  tooltip?: string;
}> = ({ label, value, valueClass = "", tooltip = "" }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
    <div className="flex items-center space-x-2">
      <span className="text-gray-600 font-semibold">{label}</span>
      {tooltip && (
        <div className="relative group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 text-gray-400 cursor-pointer"
            role="img"
            aria-label="ツールチップアイコン"
          >
            <title>ツールチップの説明</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.444-1.294.646-2.26 1.83-2.26 3.197V15.75m3.602-1.39a.75.75 0 01-.725.725h-.11v-.139c0-.496.34-1.025.984-1.205 1.488-.475 2.585-1.92 2.585-3.564 0-1.643-1.097-3.089-2.585-3.564a1.5 1.5 0 01-1.302-.139c-.83-.49-1.603-1.02-2.316-1.554a.75.75 0 01-.295-.369l-.02-.07a1.5 1.5 0 01-.005-.333v-.025c0-.987.801-1.788 1.788-1.788.887 0 1.62.663 1.766 1.503.11.663.454 1.228.984 1.706.772.69 1.884 1.03 3.136 1.03h.11v-.139c0-.496.34-1.025.984-1.205 1.488-.475 2.585-1.92 2.585-3.564 0-1.643-1.097-3.089-2.585-3.564a1.5 1.5 0 01-1.302-.139c-.83-.49-1.603-1.02-2.316-1.554a.75.75 0 01-.295-.369l-.02-.07a1.5 1.5 0 01-.005-.333v-.025c0-.987.801-1.788 1.788-1.788.887 0 1.62.663 1.766 1.503.11.663.454 1.228.984 1.706.772.69 1.884 1.03 3.136 1.03"
            />
          </svg>
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 text-xs text-white bg-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-t-gray-700">
            {tooltip}
          </span>
        </div>
      )}
    </div>
    <span className={`text-gray-800 text-right ${valueClass}`}>{value}</span>
  </div>
);

interface RootAccountsControlViewProps {
  rootAccount: RootAccountData;
  profiles: UserProfile[];
  profileManagement: ProfileManagementData;
  editingProfileId: string | null;
  newProfileName: string;
  hasMatrimonyProfile: boolean;
  onEditClick: (profileId: string, currentName: string) => void;
  onSaveClick: (profileId: string) => void;
  onCancelClick: () => void;
  onNewProfileNameChange: (name: string) => void;
}

export const RootAccountsControlView = ({
  rootAccount,
  profiles,
  profileManagement,
  editingProfileId,
  newProfileName,
  hasMatrimonyProfile,
  onEditClick,
  onSaveClick,
  onCancelClick,
  onNewProfileNameChange,
}: RootAccountsControlViewProps) => {
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="container mx-auto max-w-4xl">
        {/* ヘッダーセクション */}
        <header className="text-center my-8">
          <h1 className="text-3xl font-bold text-gray-800">ルートアカウント</h1>
          <p className="text-gray-500 mt-2">
            ルートアカウントの基本情報とユーザープロフィールの情報を管理します。
          </p>
        </header>

        {/* ユーザープロフィール管理カード */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
            ユーザープロフィール管理
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-gray-600">作成済みユーザープロフィール数</span>
              <span className="text-gray-800">
                {profileManagement.createdProfiles} / {profileManagement.maxProfiles}
              </span>
            </div>

            {/* プロフィールリスト */}
            <div className="space-y-4">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <Image
                    src={profile.imageUrl}
                    alt={`${profile.name} Profile`}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full border-2 border-indigo-400 object-cover"
                  />
                  <div className="ml-4 flex-grow">
                    {editingProfileId === profile.id && profile.type === "multiple" ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={newProfileName}
                          onChange={(e) => onNewProfileNameChange(e.target.value)}
                          className="flex-grow p-1 border rounded-md text-sm text-gray-800"
                        />
                        <button
                          type="button"
                          onClick={() => onSaveClick(profile.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                            role="img"
                            aria-label="保存アイコン"
                          >
                            <title>保存</title>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={onCancelClick}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                            role="img"
                            aria-label="キャンセルアイコン"
                          >
                            <title>キャンセル</title>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="font-bold text-lg text-gray-800">{profile.name}</div>
                        {profile.type === "multiple" && (
                          <button
                            type="button"
                            onClick={() => onEditClick(profile.id, profile.name)}
                            className="text-gray-500 hover:text-indigo-500"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                              role="img"
                              aria-label="編集アイコン"
                            >
                              <title>編集</title>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14.25v2.25a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 16.5v-1.5a2.25 2.25 0 012.25-2.25h1.5"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    )}
                    <div className="text-sm text-gray-500">目的: {profile.purpose}</div>
                    {profile.type === "single" && (
                      <div className="text-xs text-red-500 font-bold mt-1">
                        ※1ルートアカウントにつき1つのみ
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors"
                  >
                    管理
                  </button>
                </div>
              ))}
            </div>
            {/* 新しいプロフィールを作成ボタン */}
            <button
              type="button"
              className={`w-full font-bold py-3 px-4 rounded-lg shadow transition-colors mt-4 ${
                profileManagement.createdProfiles >= profileManagement.maxProfiles ||
                hasMatrimonyProfile
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
              disabled={
                profileManagement.createdProfiles >= profileManagement.maxProfiles ||
                hasMatrimonyProfile
              }
            >
              新しいプロフィールを作成 ({profileManagement.creationCost} pt 消費)
            </button>
            {hasMatrimonyProfile && (
              <div className="text-center text-red-500 mt-2 text-sm font-bold">
                ※婚活用プロフィールは作成済みのため、これ以上作成できません。
              </div>
            )}
          </div>
        </div>

        {/* ポイント管理カード */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
            ポイント管理
          </h2>
          <div className="space-y-2">
            <DataItem label="総ポイント" value={`${rootAccount.totalPoints} pt`} />
            <DataItem label="最大ポイント" value={`${rootAccount.maxPoints} pt`} />
            <DataItem
              label="消費済みポイント合計"
              value={`${rootAccount.totalConsumedPoints} pt`}
            />
            <DataItem label="活動ポイント" value={`${rootAccount.activityPoints} pt`} />
            <DataItem label="クリックポイント" value={`${rootAccount.clickPoints} pt`} />
            <DataItem
              label="最終ポイント回復日時"
              value={
                rootAccount.lastPointRecoveryAt
                  ? new Date(rootAccount.lastPointRecoveryAt).toLocaleString()
                  : "N/A"
              }
            />
          </div>
        </div>

        {/* 技術情報と管理項目カード */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
            技術情報と管理項目
          </h2>
          <div className="space-y-4">
            <DataItem
              label="信頼度スコア"
              value={rootAccount.trustScore}
              tooltip="ユーザーの活動や行動履歴に基づいて算出される、アカウントの信頼性を示す指標です。"
            />
            <DataItem label="OAuthプロバイダー" value={rootAccount.oauthProviders.join(", ")} />
            <DataItem label="OAuth認証数" value={rootAccount.oauthCount} />
            <DataItem label="警告回数" value={rootAccount.warningCount} />
            <DataItem
              label="最終警告日時"
              value={
                rootAccount.lastWarningAt
                  ? new Date(rootAccount.lastWarningAt).toLocaleString()
                  : "N/A"
              }
            />
            <DataItem
              label="招待日時"
              value={
                rootAccount.invitedAt ? new Date(rootAccount.invitedAt).toLocaleString() : "N/A"
              }
            />
            <DataItem
              label="確認日時"
              value={
                rootAccount.confirmedAt ? new Date(rootAccount.confirmedAt).toLocaleString() : "N/A"
              }
            />
            <DataItem label="リセット回数" value={profileManagement.resetCount} />
          </div>
        </div>

        {/* ルートアカウント情報カード */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
            ルートアカウント情報
          </h2>
          <div className="space-y-4">
            <DataItem label="ID" value={rootAccount.id} />
            <DataItem label="Auth User ID" value={rootAccount.authUserId} />
            <DataItem label="作成日時" value={new Date(rootAccount.createdAt).toLocaleString()} />
            <DataItem
              label="最終更新日時"
              value={new Date(rootAccount.updatedAt).toLocaleString()}
            />
            <DataItem
              label="アカウント状態"
              value={
                <span
                  className={`font-semibold ${rootAccount.accountStatus === "active" ? "text-green-600" : "text-red-600"}`}
                >
                  {rootAccount.accountStatus}
                </span>
              }
            />
            <DataItem label="認証済み" value={rootAccount.isVerified ? "はい" : "いいえ"} />
            <DataItem
              label="匿名初期認証"
              value={rootAccount.isAnonymousInitialAuth ? "はい" : "いいえ"}
            />
            <DataItem
              label="最終ログイン"
              value={new Date(rootAccount.lastLogin).toLocaleString()}
            />
            <DataItem
              label="連続ログイン日数"
              value={`${rootAccount.consecutiveDays} 日`}
              tooltip="サービスへの連続的なアクセス状況を示す指標です。アクティブなユーザーであることを示します。"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
