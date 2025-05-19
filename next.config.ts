import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["images.pexels.com", "placehold.co"], // ここにホスト名を追加
  },
};

const withNextIntl = createNextIntlPlugin("./src/components/i18n/request.ts");
export default withNextIntl(nextConfig);
