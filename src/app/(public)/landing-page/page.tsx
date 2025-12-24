"use client";

import {
  Menu,
  X,
  Shield,
  Handshake,
  Sparkles,
  ArrowRight,
  Twitter,
  ChevronRight,
  User,
  Users,
  PartyPopper,
  LogIn,
  UserPlus,
  MessageSquare,
  Heart,
  Search,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

// 共通ボタンスタイル
type ButtonVariant = "primary" | "secondary" | "outline" | "text" | "white";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyle =
    "px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2";
  const variants: Record<ButtonVariant, string> = {
    // Primary: オアシスの青
    primary:
      "bg-[#007EFE] text-white hover:bg-[#0062c4] shadow-lg hover:shadow-[#007EFE]/30",
    // Secondary: 白枠線
    secondary:
      "bg-transparent border-2 border-white text-white hover:bg-white/10",
    // Outline: 青枠線
    outline:
      "bg-transparent border-2 border-[#007EFE] text-[#007EFE] hover:bg-[#007EFE] hover:text-white",
    // Text: テキストリンク
    text: "bg-transparent text-slate-600 hover:text-[#007EFE] px-4 py-2 hover:bg-[#E6F4FB] rounded-lg font-medium hover:scale-100",
    // White: 白背景（青文字）
    white: "bg-white text-[#007EFE] hover:bg-[#E6F4FB] shadow-md",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // スクロール検知によるヘッダーのスタイル変更
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    // 全体背景: 青みがかった白 (#F5FAFD)
    <div className="min-h-screen bg-[#F5FAFD] font-sans text-slate-800">
      {/* 1. 最上位: HOMEへのリンク（ヘッダー） */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          {/* ロゴ (HOMEリンク) */}
          <div
            className="flex items-center gap-2 cursor-pointer z-50"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg transition-colors ${scrolled ? "bg-[#007EFE] text-white" : "bg-white text-[#007EFE]"}`}
            >
              V
            </div>
            <span
              className={`text-xl font-bold tracking-tight ${scrolled ? "text-slate-800" : "text-white"}`}
            >
              masakinihirota
            </span>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="text"
                className={
                  !scrolled
                    ? "text-white hover:text-[#E6F4FB] hover:bg-white/10"
                    : ""
                }
              >
                <LogIn size={18} />
                ログイン
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="primary"
                className={`px-6 py-2 text-sm ${!scrolled ? "bg-white text-[#007EFE] hover:bg-[#E6F4FB] shadow-none" : ""}`}
              >
                <UserPlus size={18} />
                会員登録
              </Button>
            </Link>
          </nav>

          {/* ハンバーガーメニュー (スマホ) */}
          <button
            className={`md:hidden p-2 z-50 ${scrolled ? "text-slate-800" : "text-white"}`}
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* モバイルメニューオーバーレイ */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-[#007EFE]/95 backdrop-blur-lg z-40 flex flex-col items-center justify-center gap-8 md:hidden">
            <Link href="/login" onClick={toggleMenu}>
              <Button variant="secondary" className="w-64">
                ログイン
              </Button>
            </Link>
            <Link href="/signup" onClick={toggleMenu}>
              <Button variant="white" className="w-64">
                会員登録
              </Button>
            </Link>
            <button className="text-white/80 mt-8" onClick={toggleMenu}>
              閉じる
            </button>
          </div>
        )}
      </header>

      {/* 2. キャッチフレーズ & すでに知っている人向けCTA */}
      {/* 背景: オアシスブルー(#007EFE)の単色塗り */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#007EFE]">
        {/* 背景装飾 */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
        {/* アクセントカラーのブラー装飾（光の表現として配置） */}
        {/* サブカラーの緑を光の装飾にも使用 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00C48C] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#FFD600] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center flex flex-col items-center gap-8 pt-20">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-wide animate-fade-in-up">
            昨日僕が感動した作品を、
            <br className="md:hidden" />
            <span className="text-[#FFD600]">今日の君はまだ知らない。</span>
          </h1>

          <div className="flex flex-col items-center gap-2 mt-4 text-[#E6F4FB] animate-fade-in-up delay-100">
            <span className="text-xl font-medium tracking-widest">
              masakinihirota
            </span>
            <span className="text-sm bg-white/10 px-3 py-1 rounded-full border border-white/20">
              VNS Concept
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-8 w-full md:w-auto animate-fade-in-up delay-200">
            {/* 匿名認証リンク */}
            <Button
              variant="white"
              className="w-full md:w-auto text-lg px-8 py-4 text-[#007EFE]"
            >
              🎯 匿名で今すぐ体験する
            </Button>
            {/* ユーザー登録 */}
            <Link href="/signup">
              <Button
                variant="secondary"
                className="w-full md:w-auto text-lg px-8 py-4"
              >
                ✈ 会員登録
              </Button>
            </Link>
          </div>
        </div>

        {/* 下部へのスクロール誘導 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50">
          <ChevronRight className="rotate-90 w-8 h-8" />
        </div>
      </section>

      {/* 3. 価値観サイトの説明（3つの特徴） */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#007EFE] font-bold tracking-wider uppercase text-sm">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">
              VNSの<span className="text-[#007EFE]">3つの特徴</span>
            </h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
              もう少し詳しく知りたいあなたへ。
              <br />
              ここは単なるSNSではありません。あなたの「感性」を大切にする場所です。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* 特徴1 (青：安心・信頼) */}
            <div className="bg-[#F5FAFD] p-8 rounded-2xl border border-[#E6F4FB] shadow-sm hover:shadow-xl hover:shadow-[#007EFE]/10 transition-all duration-300 text-center group">
              <div className="w-16 h-16 bg-[#E6F4FB] text-[#007EFE] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">
                安心・安全な
                <br />
                オアシス空間
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                ネガティブな発言を制限し、幸福追求権を優先します。
                <br />
                誰もが安心して過ごせる場所を提供します。
              </p>
            </div>

            {/* 特徴2 (緑：繋がり・活力 - サブカラーとして強化) */}
            <div className="bg-[#F5FAFD] p-8 rounded-2xl border border-[#E6F4FB] shadow-sm hover:shadow-xl hover:shadow-[#00C48C]/10 transition-all duration-300 text-center group">
              <div className="w-16 h-16 bg-[#E6F4FB] text-[#00C48C] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Handshake size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">
                価値観で
                <br />
                つながる
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                好きな作品や似た価値観でマッチング。
                <br />
                「千の仮面」で新しい自分を見つけましょう。
              </p>
            </div>

            {/* 特徴3 (黄：発見・注目 - アクセントカラーとして維持) */}
            <div className="bg-[#F5FAFD] p-8 rounded-2xl border border-[#E6F4FB] shadow-sm hover:shadow-xl hover:shadow-[#FFD600]/10 transition-all duration-300 text-center group">
              <div className="w-16 h-16 bg-[#E6F4FB] text-[#FFD600] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">
                自分の価値観にあった
                <br />
                情報を発見
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                選んだ人が推薦する素晴らしい作品に出会う。
                <br />
                情報の洪水から、真の価値を選び取ります。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 何が起こるのか？（ユーザー登録後の流れ） */}
      <section className="py-20 px-4 bg-[#F5FAFD] border-y border-[#E6F4FB]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800">
            登録したら何ができるの？
          </h2>
          <p className="text-slate-500 mb-12">
            3つのステップで、あなたの世界が広がります。
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
            {/* Step 1 (青) */}
            <div className="flex flex-col items-center max-w-xs relative">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-slate-600 border-2 border-[#E6F4FB]">
                <User size={32} className="text-[#007EFE]" />
              </div>
              <div className="absolute top-0 left-0 bg-[#007EFE] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h4 className="font-bold text-lg mb-2">プロフィール作成</h4>
              <p className="text-sm text-slate-500">
                あなたの「好き」や「価値観」を登録します。
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:block text-[#007EFE]/30">
              <ArrowRight size={32} />
            </div>
            <div className="md:hidden text-[#007EFE]/30 rotate-90 my-2">
              <ArrowRight size={24} />
            </div>

            {/* Step 2 (緑 - サブカラーとして昇格) */}
            <div className="flex flex-col items-center max-w-xs relative">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-slate-600 border-2 border-[#E6F4FB]">
                <Users size={32} className="text-[#00C48C]" />
              </div>
              <div className="absolute top-0 left-0 bg-[#00C48C] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h4 className="font-bold text-lg mb-2">AIマッチング</h4>
              <p className="text-sm text-slate-500">
                価値観の合う仲間や、運命の作品が推薦されます。
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:block text-[#007EFE]/30">
              <ArrowRight size={32} />
            </div>
            <div className="md:hidden text-[#007EFE]/30 rotate-90 my-2">
              <ArrowRight size={24} />
            </div>

            {/* Step 3 (黄 - アクセントカラー) */}
            <div className="flex flex-col items-center max-w-xs relative">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-slate-600 border-2 border-[#E6F4FB]">
                <PartyPopper size={32} className="text-[#FFD600]" />
              </div>
              <div className="absolute top-0 left-0 bg-[#FFD600] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <h4 className="font-bold text-lg mb-2">パーティ結成</h4>
              <p className="text-sm text-slate-500">
                共感できる仲間と深いつながりを作れます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 匿名体験の登録ボタン（Middle CTA） */}
      <section className="py-16 px-4 bg-[#007EFE] text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            まずは匿名で、この世界を覗いてみませんか？
          </h2>
          <p className="text-[#E6F4FB] mb-8">
            メールアドレス不要。ワンクリックで体験ツアーに参加できます。
            <br />
            気に入ったら、後から本登録も可能です。
          </p>
          <Button
            variant="white"
            className="mx-auto text-lg px-8 py-4 text-[#007EFE]"
          >
            🎯 匿名で今すぐ体験する
          </Button>
        </div>
      </section>

      {/* 6. 基本的な出来ること一覧 (青と緑をバランス良く配置) */}
      <section className="py-20 px-4 bg-[#F5FAFD]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-slate-800">
            VNSでできること
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              // 1. 青
              {
                icon: User,
                title: "詳細プロフィール",
                desc: "100以上の質問で、あなたの価値観をAIが分析・言語化します。",
                color: "text-[#007EFE]",
              },
              // 2. 緑（サブカラー）
              {
                icon: Search,
                title: "作品検索・推薦",
                desc: "Amazon等のデータベースから、あなたに響く作品を探せます。",
                color: "text-[#00C48C]",
              },
              // 3. 黄色（アクセント）
              {
                icon: Users,
                title: "相性マッチング",
                desc: "表面的な趣味だけでなく、深層心理での相性を可視化します。",
                color: "text-[#FFD600]",
              },
              // 4. 青
              {
                icon: MessageSquare,
                title: "1on1チャット",
                desc: "安心して話せる相手と、深い対話を楽しむことができます。",
                color: "text-[#007EFE]",
              },
              // 5. 緑（サブカラー）
              {
                icon: PartyPopper,
                title: "コミュニティ",
                desc: "共通のテーマで集まり、イベントや議論を開催できます。",
                color: "text-[#00C48C]",
              },
              // 6. 黄色（アクセント）
              {
                icon: Shield,
                title: "匿名性の保護",
                desc: "複数の「仮面（ペルソナ）」を使い分け、TPOに合わせた自分で参加。",
                color: "text-[#FFD600]",
              },
              // 7. 青
              {
                icon: Heart,
                title: "感謝を送る",
                desc: "いいねの代わりに「感謝」や「共感」を送る温かいシステム。",
                color: "text-[#007EFE]",
              },
              // 8. 緑（サブカラー）
              {
                icon: CheckCircle,
                title: "オアシス宣言",
                desc: "攻撃的な言動から守られた、心理的安全性の高い空間。",
                color: "text-[#00C48C]",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="flex flex-col items-start p-6 rounded-xl bg-white hover:bg-white hover:shadow-lg transition-all duration-300 border border-[#E6F4FB]"
              >
                <feature.icon className={`w-8 h-8 mb-4 ${feature.color}`} />
                <h3 className="font-bold text-slate-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. 最新情報・SNS */}
      <section className="py-20 px-4 bg-white border-t border-[#E6F4FB] text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 flex items-center justify-center gap-2 text-slate-800">
            <Twitter className="text-[#007EFE]" /> 最新情報
          </h2>
          <p className="text-slate-600 mb-8">
            X.com（Twitter）にて開発状況やイベント情報を発信しています。
            <br />
            ぜひフォローして最新情報をチェックしてください。
          </p>
          <a
            href="https://twitter.com/masakinihirota"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-slate-800 transition-colors font-bold"
          >
            <Twitter size={20} />
            @masakinihirota をフォロー
          </a>
        </div>
      </section>

      {/* 8. フッター（最下部のナビゲーション） */}
      <footer className="bg-[#F5FAFD] text-slate-600 py-12 px-4 border-t border-[#E6F4FB]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-lg">
              <div className="w-6 h-6 bg-[#007EFE] text-white rounded flex items-center justify-center text-xs">
                V
              </div>
              masakinihirota
            </div>
            <p className="text-sm text-slate-500">
              価値観でつながる、安心・安全なオアシス。
            </p>
          </div>

          <div className="col-span-1">
            <h4 className="font-bold text-slate-800 mb-4">理念</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/oasis"
                  className="hover:text-[#007EFE] transition-colors"
                >
                  オアシス宣言
                </Link>
              </li>
              <li>
                <Link
                  href="/human"
                  className="hover:text-[#007EFE] transition-colors"
                >
                  人間宣言
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-bold text-slate-800 mb-4">サポート</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/report"
                  className="hover:text-[#007EFE] transition-colors"
                >
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="hover:text-[#007EFE] transition-colors"
                >
                  ヘルプセンター
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-bold text-slate-800 mb-4">法務</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[#007EFE] transition-colors"
                >
                  利用規約
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#007EFE] transition-colors"
                >
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-[#E6F4FB] text-center text-sm text-slate-400">
          © 2025 VNS masakinihirota. All rights reserved.
        </div>
      </footer>

      {/* 簡易的なCSSアニメーションの追加定義 */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
};

export default LandingPage;
