import type { Config } from "tailwindcss";

// Safely load the tailwind theme plugin if available
let plugins: any[] = [];
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const tailwindThemePlugin = require("@digital-go-jp/tailwind-theme-plugin");
  if (tailwindThemePlugin) {
    plugins = [tailwindThemePlugin.default || tailwindThemePlugin];
  }
} catch (_e) {
  // Plugin not available, continuing without it
  console.warn("@digital-go-jp/tailwind-theme-plugin not found");
}

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
  plugins,
};
export default config;
