/**
 * チュートリアルエラーバウンダリ
 */

import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class TutorialErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Tutorial Error Boundary caught:", error, errorInfo);

    // エラーログに記録
    this.setState({
      errorInfo,
    });

    // 外部サービスにレポート可能
    if (typeof window !== "undefined") {
      try {
        // Analytics に送信
        // analytics.logError("tutorial-error", {
        //   message: error.message,
        //   stack: error.stack,
        //   componentStack: errorInfo.componentStack,
        // });
      } catch (e) {
        console.error("Failed to log error:", e);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      const isPhaserError = this.state.error?.message.includes("Phaser");

      return (
        <div className="w-full h-screen flex items-center justify-center bg-neutral-900 p-4">
          <div className="max-w-md w-full">
            <div className="bg-red-950/50 border border-red-700/50 rounded-lg p-6 space-y-4">
              {/* エラーアイコン */}
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
              </div>

              {/* エラータイトル */}
              <h1 className="text-center text-xl font-bold text-red-200">
                {isPhaserError ? "ゲーム初期化エラー" : "チュートリアルエラー"}
              </h1>

              {/* エラーメッセージ */}
              <div className="bg-black/30 rounded p-3 text-sm text-neutral-300 font-mono overflow-auto max-h-32">
                {this.state.error?.message || "不明なエラーが発生しました"}
              </div>

              {/* 開発時のみ詳細表示 */}
              {process.env.NODE_ENV === "development" &&
                this.state.errorInfo && (
                  <details className="text-xs text-neutral-400 max-h-40 overflow-auto">
                    <summary className="cursor-pointer hover:text-neutral-200">
                      詳細情報
                    </summary>
                    <pre className="mt-2 bg-black/30 p-2 rounded text-neutral-500">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}

              {/* 推奨アクション */}
              <div className="space-y-2 pt-4">
                {isPhaserError ? (
                  <p className="text-sm text-amber-300 bg-amber-900/20 rounded p-2">
                    💡 ブラウザを再読み込みしてからもう一度お試しください。
                  </p>
                ) : (
                  <p className="text-sm text-blue-300 bg-blue-900/20 rounded p-2">
                    💡 インターネット接続を確認してからもう一度お試しください。
                  </p>
                )}
              </div>

              {/* アクションボタン */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                >
                  <RefreshCw size={16} />
                  再読み込み
                </button>
                <Link
                  href="/home"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white font-medium transition-colors"
                >
                  <Home size={16} />
                  ホーム
                </Link>
              </div>
            </div>

            {/* サポート情報 */}
            <div className="mt-6 text-center text-xs text-neutral-500">
              <p>問題が解決しない場合は、</p>
              <Link
                href="/help"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                ヘルプセンター
              </Link>
              <p>にてサポートを受けてください。</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
