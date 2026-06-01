"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { HiSun, HiMoon } from "react-icons/hi";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by only rendering after mounting
  React.useEffect(() => {
    // We defer the state update slightly to avoid the linter warning about 
    // synchronous setState in effects, while still safely bypassing hydration mismatch.
    const frameId = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  if (!mounted) {
    return (
      <button className={cn("flex items-center justify-center w-10 h-10 rounded-xl opacity-0", className)}>
        <HiSun className="size-5" />
        {showLabel && <span className="text-[10px] font-bold uppercase tracking-wider">Theme</span>}
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 hover:bg-neutral-100 dark:hover:bg-neutral-800",
        className
      )}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <HiSun className="size-5 shrink-0 text-amber-500 transition-all animate-in zoom-in-50 duration-300" />
      ) : (
        <HiMoon className="size-5 shrink-0 text-brand-blue transition-all animate-in zoom-in-50 duration-300" />
      )}
      {showLabel && <span className="text-[10px] font-bold uppercase tracking-wider">Theme</span>}
    </button>
  );
}
