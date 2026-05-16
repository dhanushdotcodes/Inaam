"use client";

import { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { getTransactions } from "@/lib/api";
import type { PointTransaction } from "@/types";
import { TransactionType } from "@/types";
import { 
  TrendingUp, 
  TrendingDown, 
  Gift, 
  AlertTriangle, 
  Clock, 
  Loader2, 
  Coins
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * TransactionHistoryDialog component — Displays a detailed list of point transactions.
 */
export default function TransactionHistoryDialog({
  open,
  onOpenChange,
}: TransactionHistoryDialogProps) {
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "earned" | "spent">("all");

  useEffect(() => {
    if (open) {
      const fetchTransactions = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await getTransactions();
          // Sort by date descending
          setTransactions(data.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ));
        } catch (err) {
          console.error("Failed to fetch transactions:", err);
          setError("Failed to load history.");
        } finally {
          setLoading(false);
        }
      };
      fetchTransactions();
    }
  }, [open]);

  const getIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.EARNED:
        return <TrendingUp className="size-4 text-emerald-500" />;
      case TransactionType.SPENT:
        return <TrendingDown className="size-4 text-rose-500" />;
      case TransactionType.BONUS:
        return <Gift className="size-4 text-brand-blue" />;
      case TransactionType.PENALTY:
        return <AlertTriangle className="size-4 text-amber-500" />;
      default:
        return <Coins className="size-4 text-muted-foreground" />;
    }
  };

  const getPointsColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.EARNED:
      case TransactionType.BONUS:
        return "text-emerald-600 dark:text-emerald-400";
      case TransactionType.SPENT:
      case TransactionType.PENALTY:
        return "text-rose-600 dark:text-rose-400";
      default:
        return "text-foreground";
    }
  };

  const getPointsPrefix = (type: TransactionType) => {
    switch (type) {
      case TransactionType.EARNED:
      case TransactionType.BONUS:
        return "+";
      case TransactionType.SPENT:
      case TransactionType.PENALTY:
        return "-";
      default:
        return "";
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "all") return true;
    if (filter === "earned") return tx.type === TransactionType.EARNED || tx.type === TransactionType.BONUS;
    if (filter === "spent") return tx.type === TransactionType.SPENT || tx.type === TransactionType.PENALTY;
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md h-150 flex flex-col p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex w-full justify-between flex-col sm:flex-row gap-3 sm:gap-0 items-start sm:items-center">
            <DialogTitle className="text-xl font-bold tracking-tight">Points History</DialogTitle>
            <div className="flex items-center gap-2 pr-8">
              <button 
                onClick={() => setFilter("all")}
                className={cn(
                  "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                All
              </button>
              <button 
                onClick={() => setFilter("earned")}
                className={cn(
                  "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  filter === "earned" ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                Earned
              </button>
              <button 
                onClick={() => setFilter("spent")}
                className={cn(
                  "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  filter === "spent" ? "bg-rose-500 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                Spent
              </button>
            </div>
          </div>
          <DialogDescription className="mt-1">
            Detailed log of all your earned and spent points.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="size-8 animate-spin mb-4" />
              <p className="text-sm font-medium">Loading history...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertTriangle className="size-8 text-destructive mb-4" />
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
              <Clock className="size-12 mb-4" />
              <p className="text-sm font-medium">
                {filter === "all" ? "No transactions found." : `No ${filter} transactions yet.`}
              </p>
            </div>
          ) : (
            <div className="space-y-3 mt-4">
              {filteredTransactions.map((tx) => (
                <div 
                  key={tx.id}
                  className="group flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-border transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-background border border-border shadow-sm">
                      {getIcon(tx.type)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold max-w-40 md:max-w-66 break-all leading-3.7">
                        {tx.description}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1 font-medium uppercase tracking-wider">
                        <Clock className="size-3" />
                        {new Intl.DateTimeFormat('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true 
                        }).format(new Date(tx.created_at)).replace(',', ' •')}
                      </span>
                    </div>
                  </div>
                  <div className={cn(
                    "text-sm font-black tabular-nums",
                    getPointsColor(tx.type)
                  )}>
                    {getPointsPrefix(tx.type)}{tx.points.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
