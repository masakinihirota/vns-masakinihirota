import Link from "next/link";

/**
 * ランディングページ
 * 認証状態に関わらずアクセス可能
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-600">
            VNS masakinihirota
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            価値観を共有し、グループを作り、一緒に何かをする
          </p>
          <p className="text-sm text-gray-400 italic mb-12">
            昨日僕が感動したことを、今日の君はまだ知らない。
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              新規登録
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-6xl">
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-3">価値観の共有</h3>
            <p className="text-gray-400">あなたの価値観を発信し、共感する人と繋がる</p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-3">グループ形成</h3>
            <p className="text-gray-400">同じ価値観を持つ人々とコミュニティを形成</p>
          </div>
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-3">共同創造</h3>
            <p className="text-gray-400">一緒に新しい何かを創り上げる</p>
          </div>
        </div>
      </div>
    </div>
  );
}
