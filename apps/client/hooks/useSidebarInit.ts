"use client";

import { useEffect } from "react";
import { useAppStore } from "./store";

/**
 * Hook to initialize and manage sidebar state based on window size.
 */
export function useSidebarInit() {
  const { setIsOpen, setIsDesktop } = useAppStore((state) => state.sidebar);

  useEffect(() => {
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 1024; // lg breakpoint
      setIsDesktop(desktop);
      // We only force open/close on initial load or cross-breakpoint resize
      // to avoid overriding user preference during minor resize
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, [setIsOpen, setIsDesktop]);
}
