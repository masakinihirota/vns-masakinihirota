import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // hydration error prevention
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled aria-label="テーマの読み込み中">
        <Sun className="h-[1.2rem] w-[1.2rem] shrink-0" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="テーマを切り替える"
      aria-pressed={isDark}
      className="rounded-full w-11 h-11 shrink-0"
    >
      {isDark ? (
        <Moon className="h-[1.2rem] w-[1.2rem] shrink-0" aria-hidden="true" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] shrink-0" aria-hidden="true" />
      )}
    </Button>
  );
}
