"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Gift, 
  Compass, 
  Wallet, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

import { useSidebar } from "@/context/SidebarContext";
import { motion, AnimatePresence } from "motion/react";

const NAV_ITEMS = [
  {
    label: "Rewards",
    href: "/rewards",
    icon: Gift,
  },
  {
    label: "Quests",
    href: "/quests",
    icon: Compass,
  },
  {
    label: "Treasury",
    href: "/treasury",
    icon: Wallet,
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
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">
          Inaam
        </h1>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200 dark:bg-zinc-100 dark:text-zinc-900 dark:shadow-none"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-inherit" : "text-zinc-400 group-hover:text-zinc-900 dark:text-zinc-500 dark:group-hover:text-zinc-50"
              )} />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-zinc-100 dark:border-zinc-800">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 rounded-xl px-3 py-6 text-zinc-500 hover:text-destructive hover:bg-destructive/5 transition-colors",
            !isOpen && "justify-center"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {isOpen && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Navigation (Bottom Bar) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-around px-4 z-50">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
                isActive ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-400"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 h-1 w-8 bg-zinc-900 dark:bg-zinc-50 rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Desktop Sidebar (Animated) */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isOpen ? 288 : 88,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex flex-col h-screen sticky top-0 bg-white dark:bg-zinc-950 border-r border-zinc-100 dark:border-zinc-800 shrink-0 shadow-sm overflow-hidden"
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
