/**
 * ヘルプページ（静的コンテンツ）
 * 認証不要でアクセス可能
 */
export default function HelpPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">ヘルプ</h1>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                    <p className="text-gray-600 dark:text-gray-400">準備中です</p>
                </div>
            </div>
        </div>
    );
}
