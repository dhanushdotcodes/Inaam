"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";
import { useToast, type Toast as ToastType } from "@/hooks/useToast";

function ToastItem({ toast }: { toast: ToastType }) {
  const removeToast = useToast((s) => s.removeToast);
  const [progress, setProgress] = useState(100);
  const duration = toast.duration || 4500;

  useEffect(() => {
    // Schedule setting progress to 0 on the next tick/animation frame to trigger the CSS transition smoothly
    const frame = requestAnimationFrame(() => {
      setProgress(0);
    });

    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, duration);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [toast.id, duration, removeToast]);

  const icons = {
    success: <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />,
    error: <XCircle className="size-5 text-destructive shrink-0" />,
    warning: <AlertCircle className="size-5 text-amber-500 shrink-0" />,
    info: <Info className="size-5 text-primary shrink-0" />,
  };

  const borderColors = {
    success: "border-emerald-500/20 dark:border-emerald-500/10",
    error: "border-destructive/20 dark:border-destructive/10",
    warning: "border-amber-500/20 dark:border-amber-500/10",
    info: "border-primary/20 dark:border-primary/10",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 32, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 16, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className={`relative flex flex-col w-full max-w-sm overflow-hidden rounded-[20px] border bg-card/95 dark:bg-neutral-900/95 backdrop-blur-xl shadow-lg transition-all ${borderColors[toast.type]}`}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className="mt-0.5 shrink-0">{icons[toast.type]}</div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-foreground leading-snug tracking-tight">
              {toast.message}
            </p>
            {toast.points !== undefined && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10 shrink-0">
                +{toast.points} Pts
              </span>
            )}
          </div>
        </div>

        {/* Action Button (e.g. Undo) */}
        {toast.action && (
          <button
            type="button"
            onClick={async () => {
              if (toast.action) {
                await toast.action.onClick();
              }
              removeToast(toast.id);
            }}
            className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary hover:text-primary-active border border-primary/20 hover:border-primary/40 bg-primary/5 hover:bg-primary/10 rounded-xl transition-all mr-1 cursor-pointer shrink-0"
          >
            {toast.action.label}
          </button>
        )}

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => removeToast(toast.id)}
          className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Progress Bar indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted/30">
        <div
          className={`h-full ${
            toast.type === "success"
              ? "bg-emerald-500"
              : toast.type === "error"
                ? "bg-destructive"
                : toast.type === "warning"
                  ? "bg-amber-500"
                  : "bg-primary"
          }`}
          style={{ 
            width: `${progress}%`,
            transition: progress === 100 ? "none" : `width ${duration}ms linear`
          }}
        />
      </div>
    </motion.div>
  );
}

export default function ToastContainer() {
  const toasts = useToast((s) => s.toasts);

  return (
    <div className="fixed bottom-18 lg:bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-[calc(100vw-48px)] sm:max-w-sm max-h-[80vh] overflow-y-auto pointer-events-none select-none">
      <div className="flex flex-col gap-3 w-full pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
