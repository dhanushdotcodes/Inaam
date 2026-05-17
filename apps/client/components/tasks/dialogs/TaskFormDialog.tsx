"use client";

import React, { useState } from "react";
import { TaskDifficulty, TaskCreatePayload, TaskType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, PlusCircle, AlertCircle } from "lucide-react";
import { createTask } from "@/lib/api";
import { FormField } from "@/components/ui/form-field";


interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DIFFICULTY_RANGES: Record<TaskDifficulty, { min: number; max: number }> = {
  [TaskDifficulty.TINY]: { min: 5, max: 10 },
  [TaskDifficulty.SMALL]: { min: 15, max: 25 },
  [TaskDifficulty.MEDIUM]: { min: 40, max: 75 },
  [TaskDifficulty.HARD]: { min: 100, max: 200 },
  [TaskDifficulty.EXTREME]: { min: 300, max: 500 },
};

export default function TaskFormDialog({ open, onOpenChange, onSuccess }: TaskFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TaskCreatePayload>({
    title: "",
    description: "",
    task_type: TaskType.BOUNTY,
    difficulty: TaskDifficulty.MEDIUM,
    points: DIFFICULTY_RANGES[TaskDifficulty.MEDIUM].min,
  });

  const handleDifficultyChange = (value: TaskDifficulty | null) => {
    if (!value) return;
    const diff = value;
    const range = DIFFICULTY_RANGES[diff];
    
    setFormData(prev => ({
      ...prev,
      difficulty: diff,
      points: (prev.points || 0) < range.min || (prev.points || 0) > range.max 
        ? range.min 
        : prev.points
    }));
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.title.trim()) return;

    const range = DIFFICULTY_RANGES[formData.difficulty as TaskDifficulty];
    const points = formData.points || 0;

    if (points < range.min || points > range.max) {
      setValidationError(`For ${formData.difficulty} difficulty, points must be between ${range.min} and ${range.max}.`);
      return;
    }

    try {
      setLoading(true);
      await createTask({
        ...formData,
        task_type: TaskType.BOUNTY
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        task_type: TaskType.BOUNTY,
        difficulty: TaskDifficulty.MEDIUM,
        points: DIFFICULTY_RANGES[TaskDifficulty.MEDIUM].min,
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error("Create bounty error:", err);
      setValidationError(err instanceof Error ? err.message : "Failed to create bounty");
    } finally {
      setLoading(false);
    }
  };

  const currentRange = DIFFICULTY_RANGES[formData.difficulty as TaskDifficulty];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Bounty</DialogTitle>
            <DialogDescription>
              Post a new independent bounty for anyone to claim.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            <FormField label="Title" required>
              <Input
                placeholder="e.g., Wash the Dragon (Dishes)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={loading}
              />
            </FormField>

            <FormField label="Description">
              <Textarea
                placeholder="What needs to be done?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Difficulty">
                <Select
                  value={formData.difficulty}
                  onValueChange={handleDifficultyChange}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full relative">
                    <SelectValue placeholder="Select difficulty">
                      {formData.difficulty ? (formData.difficulty.charAt(0) + formData.difficulty.slice(1).toLowerCase()) : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TaskDifficulty).map((diff) => (
                      <SelectItem key={diff} value={diff}>
                        {diff.charAt(0) + diff.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField 
                label="Reward Points"
                required
                rightElement={
                  <span className="text-[10px] font-bold text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full">
                    {currentRange.min} - {currentRange.max}
                  </span>
                }
                error={validationError && (validationError.includes("Points") || validationError.includes("between")) && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-[10px] font-medium w-fit mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}
              >
                <Input
                  type="number"
                  min={currentRange.min}
                  max={currentRange.max}
                  value={formData.points}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setFormData({ ...formData, points: val });
                    
                    if (val < currentRange.min || val > currentRange.max) {
                      setValidationError(`Points must be between ${currentRange.min} and ${currentRange.max}`);
                    } else {
                      setValidationError(null);
                    }
                  }}
                  required
                  disabled={loading}
                />
              </FormField>
            </div>

          </div>

          <DialogFooter className="mt-8 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              className="min-w-30"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Post Bounty
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
