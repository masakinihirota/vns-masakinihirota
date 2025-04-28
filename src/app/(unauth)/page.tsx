import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Home() {
  // 翻訳
  const t = useTranslations("HomePage");
  return (
    <div className="">
      <main className=""></main>
      {/* 認証ページへ */}
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <h1>TOPページ</h1>
          {/* 言語スイッチ */}
          {/* 挨拶文(言語変更の確認) */}
          <h2>{t("title")}</h2>

          <p>認証ページへ</p>
          <Link href="/login">ログイン</Link>
          <div />
          {/* ログアウト */}
          <Link href="/logout">ログアウト</Link>
        </div>
        {/* Hono */}
        <Link href="/hono">Hono</Link>
      </div>

      <footer className=""></footer>
    </div>
  );
}
