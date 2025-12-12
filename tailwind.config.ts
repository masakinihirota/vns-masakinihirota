import type { Config } from "tailwindcss";
// @ts-expect-error Type declaration file resolution failure for this package
import tailwindThemePlugin from "@digital-go-jp/tailwind-theme-plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [tailwindThemePlugin],
};
export default config;
