import LocaleSwitcher from "@/components/i18n/LocaleSwitcher";
// import { useLocale, useTranslations } from "next-intl";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("HomePage");
  // const locale = useLocale();

  return (
    <>
      <div className="absolute right-8 top-8">
        <LocaleSwitcher />
      </div>

      <h2>{t("title")}</h2>
    </>
  );
}
