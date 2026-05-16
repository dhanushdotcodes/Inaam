"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatusErrorProps {
  error: string;
  onRetry: () => void;
}

/**
 * StatusError component — Standardized error view with retry logic.
 */
export default function StatusError({ 
  error, 
  onRetry 
}: StatusErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-3xl border border-destructive/20 bg-destructive/5 p-12 text-center my-12">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 text-destructive mb-2">
        <AlertCircle className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold tracking-tight text-destructive">
          Something went wrong
        </h3>
        <p className="text-sm font-medium text-destructive/70 max-w-[320px] mx-auto">
          {error}
        </p>
      </div>
      <Button 
        variant="outlined" 
        onClick={onRetry}
        startIcon={<RotateCcw />}
        className="mt-2 border-destructive/20 text-destructive hover:bg-destructive/10"
      >
        Try Again
      </Button>
    </div>
  );
}
