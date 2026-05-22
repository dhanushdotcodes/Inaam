"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Trophy,
  ShoppingBag,
  Compass, 
  LogOut,
  ChevronLeft,
  BarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

import { useAppStore } from "@/hooks/store";
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
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart2,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, setIsOpen, isDesktop, toggle } = useAppStore((state) => state.sidebar);

  const handleLogout = () => {
    removeToken();
    router.push("/");
  };

  const NavContent = () => (
    <div className="flex flex-col h-full px-6 py-9">
      {/* Brand Header: Uses logo.png and font-brand (Boldonse) */}
      {/* Transition padding-left and gap smoothly over 400ms to avoid justify jumps */}
      <div className={cn(
        "mb-10 h-10 flex items-center select-none transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)]",
        isOpen ? "pl-0 gap-2" : "pl-1 gap-0"
      )}>
        <Image 
          src="/logo.png" 
          alt="Inaam Logo" 
          width={32} 
          height={32} 
          className="size-8 object-contain shrink-0"
          priority
        />
        <span
          className={cn(
            "text-3xl font-brand tracking-tight text-foreground transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] whitespace-nowrap overflow-hidden",
            isOpen ? "opacity-100 max-w-45 translate-x-0" : "opacity-0 max-w-0 -translate-x-4 pointer-events-none"
          )}
        >
          Inaam
        </span>
      </div>

      <nav className="flex-1 space-y-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] h-12 select-none outline-none rounded-xl w-full",
                isOpen ? "px-3 gap-3" : "px-0 gap-0"
              )}
            >
              {/* Background active indicator morph animation */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveIndicator"
                  className={cn(
                    "absolute bg-primary -z-10",
                    isOpen ? "inset-0 rounded-xl" : "size-10 rounded-xl"
                  )}
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}

              {/* Icon Container: Sized to size-10 (40px) when closed for standard visual breathing room */}
              <div className={cn(
                "flex items-center justify-center transition-colors duration-400 ease-[cubic-bezier(0.25,1,0.5,1)]",
                !isOpen && "size-10 shrink-0"
              )}>
                <item.icon className={cn(
                  "size-5 shrink-0 transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)]",
                  isActive 
                    ? "text-primary-foreground" 
                    : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
                )} />
              </div>

              {/* Text Label: Fades, slides and shrinks in perfect sync with the sidebar width transition */}
              <span
                className={cn(
                  "truncate text-sm font-bold tracking-tight transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] whitespace-nowrap overflow-hidden",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground",
                  isOpen ? "opacity-100 max-w-45 translate-x-0" : "opacity-0 max-w-0 -translate-x-4 pointer-events-none"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Action Area */}
      <div className="mt-auto pt-6 border-t border-border">
        <button
          onClick={handleLogout}
          className={cn(
            "group relative flex items-center transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] h-12 select-none outline-none rounded-xl w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer",
            isOpen ? "px-3 gap-3" : "px-0 gap-0"
          )}
        >
          <div className={cn(
            "flex items-center justify-center transition-colors duration-400 ease-[cubic-bezier(0.25,1,0.5,1)]",
            !isOpen && "size-10 shrink-0"
          )}>
            <LogOut className="size-5 shrink-0" />
          </div>
          
          {/* Logout Text: Collapses and slides left smoothly on closed state */}
          <span
            className={cn(
              "text-sm font-bold tracking-tight transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] whitespace-nowrap overflow-hidden",
              isOpen ? "opacity-100 max-w-30 translate-x-0" : "opacity-0 max-w-0 -translate-x-4 pointer-events-none"
            )}
          >
            Logout
          </span>
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
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
        >
          <LogOut className="size-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Logout</span>
        </button>
      </nav>

      {/* Desktop Sidebar (Animated Width slowed to 400ms for premium ease) */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isOpen ? 264 : 88,
        }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        className="hidden lg:flex flex-col h-screen sticky top-0 bg-background border-r border-border shrink-0 shadow-sm z-40"
      >
        {/* NavContent wrapper with overflow-hidden to clip contents cleanly during width morph animation */}
        <div className="w-full h-full flex flex-col overflow-hidden">
          <NavContent />
        </div>

        {/* Beautiful border bulge toggle button */}
        <button
          onClick={toggle}
          className="absolute -right-3.5 top-14 -translate-y-1/2 z-50 flex items-center justify-center w-7 h-7 rounded-full bg-background border border-border shadow-md hover:shadow-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer group select-none"
          title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <motion.div
            animate={{ rotate: isOpen ? 0 : 180 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="flex items-center justify-center"
          >
            <ChevronLeft className="size-4 stroke-[2.5px] transition-transform group-hover:scale-110" />
          </motion.div>
        </button>
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {!isDesktop && isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand-dark/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-card z-50 border-r border-border shadow-xl"
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
