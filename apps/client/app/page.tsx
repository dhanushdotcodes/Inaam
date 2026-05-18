"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/button";

/**
 * Home page — Landing portal with Sign In and Create Account triggers.
 * Automatically routes authenticated users straight to the dashboard.
 */
export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/tasks");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans p-8 dark:bg-black transition-all">
      <main className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 transition-all text-center flex flex-col items-center">
        {/* Brand Logo */}
        <div className="mb-6 p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-inner">
          <Image 
            src="/logo.png" 
            alt="Inaam Logo" 
            width={64} 
            height={64} 
            className="size-16 object-contain"
            priority
          />
        </div>

        {/* Brand Name & Tagline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
          Inaam
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-10 leading-relaxed">
          The premium gamified dashboard to track tasks, complete epic quests, and claim exclusive prizes.
        </p>

        {/* Access CTA Buttons */}
        <div className="w-full space-y-4">
          <Link href="/login" className="block w-full">
            <Button
              className="w-full h-12 rounded-2xl font-bold flex items-center justify-center gap-2 group hover:opacity-95 cursor-pointer"
            >
              Sign In
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          
          <Link href="/signup" className="block w-full">
            <Button
              variant="outlined"
              className="w-full h-12 rounded-2xl font-bold border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 cursor-pointer"
            >
              Create Account
            </Button>
          </Link>
        </div>
      </main>

      <p className="mt-8 text-zinc-400 text-xs dark:text-zinc-600 select-none">
        Inaam Dashboard • Premium Portal
      </p>
    </div>
  );
}


