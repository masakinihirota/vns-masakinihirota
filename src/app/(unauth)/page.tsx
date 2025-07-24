import LocaleSwitcher from "@/components/i18n/LocaleSwitcher";
import { ModeToggle } from "@/app/ModeTogglePage/mode-toggle";

import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Home() {
  // 翻訳
  const t = useTranslations("HomePage");
  const t2 = useTranslations("AppLayout");

  return (
    <>
      {/* ランディングページへのリンク */}
      <Link href="/landing">ランディングページ</Link>
      <br />
      {/* メインページへのリンク */}
      <Link href="/main-pages">メインページへのリンク</Link>
      <br />
      {/* 価格のページ */}
      <Link href="/pricing">価格のページ</Link>
      {/* 認証のページ */}
      <main className="">
        {/* 認証ページへ */}
        <div className="w-full max-w-sm">
          <h1>TOPページ</h1>
          {/* 言語スイッチ */}
          <div className="mb-4">
            <LocaleSwitcher />
          </div>
          {/* 挨拶文(言語変更の確認) */}
          <h2>{t("title")}</h2>
          <h2>{t2("home")}</h2>
          {/* ダークモードボタン */}
          <Link href="./ModeTogglePage">ModeTogglePage</Link>
          <div />
          {/* ToggleButton */}
          <ModeToggle />
          <p>認証 ログインページへ</p>
          <Link href="/login">ログインページへ</Link>
          <div />
          {/* ログアウト */}
          <Link href="/logout">ログアウトページへ</Link>
          <div />
          {/* 言語ページ */}
          <Link href="/lang">言語ページ</Link>
          <div />
          {/* プロテクトページへ */}
          <Link href="/protected">プロテクトページへ</Link>
        </div>
        {/* Hono */}
        <Link href="/hono">Honoページへ </Link>
        <br />
        {/* Team */}
        <Link href="/team-03">Teamページへ</Link>
      </main>
      <footer className="">footer</footer>
    </>
  );
}
