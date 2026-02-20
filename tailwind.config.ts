// @ts-expect-error - No declaration file for this module
import tailwindThemePlugin from "@digital-go-jp/tailwind-theme-plugin";
import type { Config } from "tailwindcss";


const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [tailwindThemePlugin.default || tailwindThemePlugin],
};
export default config;
