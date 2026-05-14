"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Trophy,
  ShoppingBag,
  Compass, 
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

import { useSidebar } from "@/context/SidebarContext";
import { motion, AnimatePresence } from "motion/react";

const NAV_ITEMS = [
  {
    label: "Tasks",
    href: "/tasks",
    icon: Compass,
  },
  {
    label: "Quests",
    href: "/quests",
    icon: Trophy,
  },
  {
    label: "Prizes",
    href: "/prizes",
    icon: ShoppingBag,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, setIsOpen, isDesktop } = useSidebar();

  const handleLogout = () => {
    removeToken();
    router.push("/");
  };

  const NavContent = () => (
    <div className="flex flex-col h-full px-6 py-9">
      <div className="mb-10 h-8 flex items-center">
        {isOpen && (
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold tracking-tighter text-foreground"
          >
            Inaam
          </motion.h1>
        )}
      </div>

      <nav className="flex-1 space-y-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center transition-all duration-300 h-12 select-none outline-none rounded-xl",
                isOpen ? "px-3 gap-3" : "justify-center"
              )}
            >
              {/* Background Pill for both Open and Closed states */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveIndicator"
                  className={cn(
                    "absolute bg-primary -z-10",
                    isOpen ? "inset-0 rounded-xl" : "size-6 rounded-md"
                  )}
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}

              <div className={cn(
                "flex items-center justify-center transition-colors duration-300",
                !isOpen && "size-6"
              )}>
                <item.icon className={cn(
                  "size-5 shrink-0 transition-all duration-300",
                  isActive 
                    ? "text-primary-foreground" 
                    : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
                )} />
              </div>

              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className={cn(
                    "truncate text-sm font-bold tracking-tight transition-colors duration-300",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-border">
        <button
          onClick={handleLogout}
          className={cn(
            "group relative flex items-center transition-all duration-300 h-12 select-none outline-none rounded-xl w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
            isOpen ? "px-3 gap-3" : "justify-center"
          )}
        >
          <div className={cn(
            "flex items-center justify-center transition-colors duration-300",
            !isOpen && "size-6"
          )}>
            <LogOut className="size-5 shrink-0" />
          </div>
          {isOpen && (
            <span className="text-sm font-bold tracking-tight">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Navigation (Bottom Bar) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border flex items-center justify-around px-4 z-50">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors relative",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("size-5", isActive && "scale-110")} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute -bottom-1 h-1 w-8 bg-primary rounded-full"
                />
              )}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="size-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Logout</span>
        </button>
      </nav>

      {/* Desktop Sidebar (Animated) */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isOpen ? 264 : 88,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex flex-col h-screen sticky top-0 bg-background border-r border-border shrink-0 shadow-sm overflow-hidden"
      >
        <NavContent />
      </motion.aside>

      {/* Mobile Drawer (Optional - Toggleable via Header) */}
      <AnimatePresence>
        {!isDesktop && isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-zinc-950 z-50 border-r border-zinc-100 dark:border-zinc-800 shadow-xl"
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
