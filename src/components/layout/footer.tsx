import Link from "next/link";
import { footerNav } from "@/config/nav";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-32 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <p className="text-sm leading-loose text-muted-foreground">
              Built by{" "}
              <a
                href="https://x.com/masakinihirota"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                masakinihirota
              </a>
              .
            </p>
            <p className="text-[10px] text-muted-foreground opacity-70">
              Amazon アソシエイトとして、VNS は適格販売により収入を得ています。
            </p>
          </div>
        </div>
        <nav className="flex gap-4 sm:gap-6">
          {footerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium hover:underline underline-offset-4 text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
