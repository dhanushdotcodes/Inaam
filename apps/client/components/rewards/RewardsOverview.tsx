"use client";

import React from "react";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import DashboardHeader from "@/components/layout/DashboardHeader";

/**
 * RewardsOverview component — Displays the financial stats and transaction history.
 */
export default function RewardsOverview() {
  return (
    <>
      <DashboardHeader 
        title="Rewards"
        description="Monitor your reward earnings and manage your financial assets."
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-bold">+12.5%</span>
        </div>
      </DashboardHeader>

      <main className="flex-1 px-8 lg:px-12 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Total Balance", value: "$1,280.50", sub: "Available now", icon: Wallet },
            { label: "Pending", value: "$420.00", sub: "Next 7 days", icon: ArrowUpRight },
            { label: "Withdrawals", value: "$2,840.00", sub: "Lifetime total", icon: ArrowDownLeft },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
              <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-4">
                <stat.icon className="h-5 w-5 text-zinc-400" />
              </div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{stat.value}</h3>
              <p className="text-xs text-zinc-400 mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">Recent Transactions</h3>
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">No recent transactions found.</p>
          </div>
        </div>
      </main>
    </>
  );
}
