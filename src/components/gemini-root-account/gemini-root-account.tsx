import {
  LucideBadgeCheck,
  LucideCircleUser,
  LucideCopy,
  LucideExternalLink,
  LucideEyeOff,
  LucideFingerprint,
  LucideGlobe,
  LucideHeartHandshake,
  LucideHourglass,
  LucideShieldAlert,
  LucideShieldCheck,
  LucideShieldX,
  LucideSpeech,
  LucideUser,
  LucideUsers,
  LucideWallet,
} from "lucide-react";
import { IRootAccountData } from "./gemini-root-account.logic";

interface GeminiRootAccountViewProps {
  accountData: IRootAccountData | null;
  isDummy: boolean;
  loading: boolean;
  onCopyId: () => void;
}

export const GeminiRootAccountView = ({
  accountData,
  isDummy,
  loading,
  onCopyId,
}: GeminiRootAccountViewProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-200 bg-gray-900">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (!accountData) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-200 bg-gray-900">
        <p>データが見つかりませんでした。</p>
      </div>
    );
  }

  // ポイントゲージのパーセンテージを計算
  const pointPercentage: number =
    accountData.maxPoints > 0
      ? (accountData.currentPoints / accountData.maxPoints) * 100
      : 0;
  // 信頼度スコアの色を決定
  const trustColor: string =
    accountData.trustScore >= 90
      ? "text-green-400"
      : accountData.trustScore >= 70
        ? "text-yellow-400"
        : "text-red-400";
  const trustIcon =
    accountData.trustScore >= 70 ? (
      <LucideShieldCheck className="w-4 h-4" />
    ) : (
      <LucideShieldX className="w-4 h-4" />
    );
  const warningStatusColor: string =
    accountData.warningCount > 0 ? "text-red-400" : "text-green-400";
  const warningIcon =
    accountData.warningCount > 0 ? (
      <LucideShieldAlert className="w-4 h-4" />
    ) : (
      <LucideBadgeCheck className="w-4 h-4" />
    );

  return (
    <div className="min-h-screen p-8 font-sans text-gray-200 bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            ルートアカウント
          </h1>
          {isDummy && (
            <span className="px-3 py-1 text-sm text-yellow-300 border border-yellow-500 rounded-full bg-yellow-500/20">
              ダミーデータ表示中
            </span>
          )}
        </header>

        {/* Section A: アカウントの称号/ID */}
        <section className="p-6 bg-gray-800 shadow-lg rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-100">IDと名前</h2>
            <a
              href="/user-profile/manage"
              className="text-blue-400 transition-colors duration-200 hover:text-blue-300"
            >
              名前の管理{" "}
              <LucideExternalLink className="inline-block w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <LucideFingerprint className="w-6 h-6 mr-3 text-teal-400" />
              <div>
                <p className="text-sm text-gray-400">システムID (UUID v4)</p>
                <p className="font-mono text-lg break-all">{accountData.id}</p>
              </div>
              <button
                onClick={onCopyId}
                className="p-2 ml-auto text-gray-400 transition-colors duration-200 rounded-lg hover:bg-gray-700"
              >
                <LucideCopy className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center">
              <LucideUser className="w-6 h-6 mr-3 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">現在の名前/ニックネーム</p>
                <p className="text-lg">{accountData.nickname}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section B: ステータス（活動制御） */}
        <section className="p-6 bg-gray-800 shadow-lg rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-100">ステータス</h2>
            <a
              href="/points/history"
              className="text-blue-400 transition-colors duration-200 hover:text-blue-300"
            >
              ポイント履歴{" "}
              <LucideExternalLink className="inline-block w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <LucideWallet className="w-5 h-5 mr-2 text-green-400" />
                  <p className="text-sm text-gray-400">所持ポイント</p>
                </div>
                <p className="text-lg font-bold">
                  ${accountData.currentPoints}{" "}
                  <span className="text-sm text-gray-400">
                    / ${accountData.maxPoints}
                  </span>
                </p>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${pointPercentage}%` }}
                ></div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                24時間ごとにMAXの50%が補充されます。
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`${trustColor} flex items-center`}>
                  {trustIcon}
                  <p className="ml-2 text-sm text-gray-400">信頼度</p>
                </div>
              </div>
              <p className={`text-lg font-bold ${trustColor}`}>
                {accountData.trustScore}%
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`${warningStatusColor} flex items-center`}>
                  {warningIcon}
                  <p className="ml-2 text-sm text-gray-400">警告状態</p>
                </div>
              </div>
              <p className={`text-lg font-bold ${warningStatusColor}`}>
                {accountData.warningCount > 0
                  ? `${accountData.warningCount} 回`
                  : "クリア"}
              </p>
            </div>
          </div>
        </section>

        {/* Section C: 不変の基本情報 */}
        <section className="p-6 bg-gray-800 shadow-lg rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-100">
              不変の基本情報
            </h2>
            <button className="text-red-400 transition-colors duration-200 hover:text-red-300">
              リセット機能 (強力な警告あり)
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex items-center">
              <LucideGlobe className="w-5 h-5 mr-3 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">住んでいる場所</p>
                <p className="text-lg">{accountData.residence}</p>
              </div>
            </div>
            <div className="flex items-center">
              <LucideHourglass className="w-5 h-5 mr-3 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">生誕年代</p>
                <p className="text-lg">{accountData.birthEra}</p>
              </div>
            </div>
            <div className="flex items-center">
              <LucideSpeech className="w-5 h-5 mr-3 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">母語</p>
                <p className="text-lg">{accountData.motherTongue.join(", ")}</p>
              </div>
            </div>
            <div className="flex items-center">
              <LucideHeartHandshake className="w-5 h-5 mr-3 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">オアシス宣言</p>
                <p className="text-lg">
                  <span className="text-green-400">宣誓済み</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section D: アカウント認証状況 */}
        <section className="p-6 bg-gray-800 shadow-lg rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-100">認証状況</h2>
            <a
              href="/oauth/add"
              className="text-blue-400 transition-colors duration-200 hover:text-blue-300"
            >
              OAuth追加{" "}
              <LucideExternalLink className="inline-block w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {accountData.oauthProviders.map((provider, index) => (
              <div
                key={provider}
                className="flex items-center space-x-2 text-gray-400"
              >
                <LucideBadgeCheck className="w-5 h-5 text-blue-400" />
                <p>{provider}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section E: ユーザープロフィール管理 */}
        <section className="p-6 bg-gray-800 shadow-lg rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-100">
              ユーザープロフィール管理（千の仮面）
            </h2>
            <a
              href="/user-profiles/manage"
              className="text-blue-400 transition-colors duration-200 hover:text-blue-300"
            >
              管理画面へ{" "}
              <LucideExternalLink className="inline-block w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="flex items-center space-x-4 text-gray-400">
            <LucideCircleUser className="w-6 h-6" />
            <p className="text-sm">
              あなたは現在、
              <span className="text-lg font-bold text-gray-100">
                {accountData.profilesCount}
              </span>{" "}
              個のプロフィールを所持しています。 （匿名2つまで、無料3つまで）
            </p>
          </div>
        </section>

        { }
        <section className="p-6 bg-gray-800 shadow-lg rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-100">
              グループ/それ以上のまとまり管理
            </h2>
            <a
              href="/groups/manage"
              className="text-blue-400 transition-colors duration-200 hover:text-blue-300"
            >
              管理画面へ{" "}
              <LucideExternalLink className="inline-block w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="flex items-center space-x-4 text-gray-400">
            <LucideUsers className="w-6 h-6" />
            <p className="text-sm">
              あなたは{" "}
              <span className="text-lg font-bold text-gray-100">
                {accountData.groupsCount}
              </span>{" "}
              個のグループ、
              <span className="text-lg font-bold text-gray-100">
                {accountData.alliancesCount}
              </span>{" "}
              それ以上のまとまりのリーダーです。
            </p>
          </div>
        </section>

        {/* Note on data privacy */}
        <div className="flex items-center justify-center mt-8 text-sm text-center text-gray-500">
          <LucideEyeOff className="w-4 h-4 mr-2" />
          <p>この画面に表示される個人情報属性は、最小限に抑えられています。</p>
        </div>
      </div>
    </div>
  );
};
