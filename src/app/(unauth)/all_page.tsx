// import LocaleSwitcher from "@/components/i18n/LocaleSwitcher";
import LocaleSwitcher from "@/components/i18n/LocaleSwitcher";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ModeToggle } from "@/app/ModeTogglePage/mode-toggle";
import Navbar03Page from "@/components/shadcnui-blocks/navbar-03/navbar-03";
import Hero01 from "@/components/shadcnui-blocks/hero-01";
import Footer05Page from "@/components/shadcnui-blocks/footer-05";
import Features01Page from "@/components/shadcnui-blocks/features-01";
import Timeline from "@/components/shadcnui-blocks/timeline-03";
import Testimonial05 from "@/components/shadcnui-blocks/testimonial-05";
import FAQ03 from "@/components/shadcnui-blocks/faq-03";
import Logos02Page from "@/components/shadcnui-blocks/logos-02/logos-02";
import Contact01Page from "@/components/shadcnui-blocks/contact-01/contact-01";
import Stats01Page from "@/components/shadcnui-blocks/stats-01/stats-01";

export default function Home() {
  // 翻訳
  const t = useTranslations("HomePage");
  const t2 = useTranslations("AppLayout");

  return (
    <>
      <Navbar03Page />
      <Hero01 />
      <Features01Page />
      <Timeline />
      <Testimonial05 />
      <FAQ03 />
      {/* <Team03Page /> */}
      <Logos02Page />
      <Contact01Page />
      <Stats01Page />

      <Footer05Page />
      {/* 価格のページ */}
      <Link href="/pricing">価格のページへ</Link>
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
        </div>
        {/* Hono */}
        <Link href="/hono">Honoページへ </Link>
        <br />
        {/* Team */}
        <Link href="/team-03">Teamページへ</Link>
      </main>
      <footer className=""></footer>
    </>
  );
}
