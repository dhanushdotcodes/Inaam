"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { HiSun, HiMoon } from "react-icons/hi";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by only rendering after mounting
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl opacity-0">
        <HiSun className="size-5" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 rounded-xl transition-all duration-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <HiSun className="size-5 text-amber-500 transition-all animate-in zoom-in-50 duration-300" />
      ) : (
        <HiMoon className="size-5 text-brand-blue transition-all animate-in zoom-in-50 duration-300" />
      )}
    </Button>
  );
}
