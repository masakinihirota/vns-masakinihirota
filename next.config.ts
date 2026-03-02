import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

const configWithIntl = withNextIntl(nextConfig);

// Remove the experimental turbo alias injected by next-intl plugin
// since Next.js 16 throws errors on it. Our tsconfig.json handles the alias.
if (configWithIntl.experimental && 'turbo' in configWithIntl.experimental) {
  delete (configWithIntl.experimental as any).turbo;
}

export default configWithIntl;
