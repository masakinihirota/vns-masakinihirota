import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <main className="">
      </main>
      {/* 認証ページへ */}
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <h1>TOPページ</h1>
          <p>認証ページへ</p>
          <Link href="/auth/login">ログイン</Link>
        </div>
      </div>

      <footer className="">
      </footer>
    </div>
  );
}
