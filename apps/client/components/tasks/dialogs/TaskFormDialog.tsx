"use client";

import React, { useState } from "react";
import { TaskDifficulty, TaskCreatePayload, TaskType, Task } from "@/types";
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
import { Loader2, PlusCircle, AlertCircle, Repeat } from "lucide-react";
import { createTask, updateTask } from "@/lib/api";
import { FormField } from "@/components/ui/form-field";


interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: Task;
}

const DIFFICULTY_RANGES: Record<Exclude<TaskDifficulty, TaskDifficulty.ALL>, { min: number; max: number }> = {
  [TaskDifficulty.TINY]: { min: 5, max: 10 },
  [TaskDifficulty.SMALL]: { min: 15, max: 25 },
  [TaskDifficulty.MEDIUM]: { min: 40, max: 75 },
  [TaskDifficulty.HARD]: { min: 100, max: 200 },
  [TaskDifficulty.EXTREME]: { min: 300, max: 500 },
};

export default function TaskFormDialog({ open, onOpenChange, onSuccess, initialData }: TaskFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TaskCreatePayload>({
    title: "",
    description: "",
    task_type: TaskType.BOUNTY,
    difficulty: TaskDifficulty.MEDIUM,
    points: DIFFICULTY_RANGES[TaskDifficulty.MEDIUM].min,
    is_recurring: false,
    recurrence_days: "0,1,2,3,4,5,6", // default to everyday if toggled
  });

  const [selectedDays, setSelectedDays] = useState<number[]>([0,1,2,3,4,5,6]);

  React.useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active && open) {
        if (initialData) {
          setFormData({
            title: initialData.title,
            description: initialData.description || "",
            task_type: initialData.task_type || TaskType.BOUNTY,
            difficulty: initialData.difficulty || TaskDifficulty.MEDIUM,
            points: initialData.points || DIFFICULTY_RANGES[TaskDifficulty.MEDIUM].min,
            is_recurring: initialData.is_recurring,
            recurrence_days: initialData.recurrence_days || "0,1,2,3,4,5,6",
          });
          if (initialData.recurrence_days) {
            setSelectedDays(initialData.recurrence_days.split(",").map(Number));
          } else {
            setSelectedDays([0,1,2,3,4,5,6]);
          }
        } else {
          setFormData({
            title: "",
            description: "",
            task_type: TaskType.BOUNTY,
            difficulty: TaskDifficulty.MEDIUM,
            points: DIFFICULTY_RANGES[TaskDifficulty.MEDIUM].min,
            is_recurring: false,
            recurrence_days: "0,1,2,3,4,5,6",
          });
          setSelectedDays([0,1,2,3,4,5,6]);
        }
        setValidationError(null);
      }
    });
    return () => { active = false; };
  }, [open, initialData]);

  const toggleDay = (dayIndex: number) => {
    let newDays = [...selectedDays];
    if (newDays.includes(dayIndex)) {
      if (newDays.length > 1) { // ensure at least one day
        newDays = newDays.filter(d => d !== dayIndex);
      }
    } else {
      newDays.push(dayIndex);
    }
    newDays.sort((a,b) => a - b);
    setSelectedDays(newDays);
    setFormData(prev => ({ ...prev, recurrence_days: newDays.join(",") }));
  };

  const DAYS = [
    { label: "M", value: 0 },
    { label: "T", value: 1 },
    { label: "W", value: 2 },
    { label: "T", value: 3 },
    { label: "F", value: 4 },
    { label: "S", value: 5 },
    { label: "S", value: 6 },
  ];

  const handleDifficultyChange = (value: TaskDifficulty | null) => {
    if (!value) return;
    const diff = value;
    const range = DIFFICULTY_RANGES[diff as Exclude<TaskDifficulty, TaskDifficulty.ALL>];
    
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

    const range = DIFFICULTY_RANGES[formData.difficulty as Exclude<TaskDifficulty, TaskDifficulty.ALL>];
    const points = formData.points || 0;

    if (points < range.min || points > range.max) {
      setValidationError(`For ${formData.difficulty} difficulty, points must be between ${range.min} and ${range.max}.`);
      return;
    }

    try {
      setLoading(true);
      if (initialData) {
        await updateTask(initialData.id, {
          title: formData.title,
          description: formData.description,
          is_recurring: formData.is_recurring,
          recurrence_days: formData.is_recurring ? formData.recurrence_days : null,
        });
      } else {
        await createTask({
          ...formData,
          task_type: TaskType.BOUNTY
        });
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error("Task save error:", err);
      setValidationError(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  const currentRange = DIFFICULTY_RANGES[formData.difficulty as Exclude<TaskDifficulty, TaskDifficulty.ALL>];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{initialData ? "Edit Bounty" : "New Bounty"}</DialogTitle>
            <DialogDescription>
              {initialData ? "Update the details of this bounty." : "Post a new independent bounty for anyone to claim."}
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

            {/* Recurrence Section */}
            <div className="space-y-3 p-4 rounded-2xl border border-border/60 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${formData.is_recurring ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <Repeat className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold tracking-tight block">Repeat Weekly</span>
                    <span className="text-xs text-muted-foreground">Automatically reset this bounty on selected days.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, is_recurring: !prev.is_recurring }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.is_recurring ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.is_recurring ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {formData.is_recurring && (
                <div className="flex items-center justify-between gap-1 md:gap-2 pt-2 animate-in slide-in-from-top-2 fade-in duration-200">
                  {DAYS.map((day) => {
                    const isSelected = selectedDays.includes(day.value);
                    return (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        className={`w-7 h-7 text-[10px] md:w-9 md:h-9 md:text-xs rounded-full flex items-center justify-center font-bold transition-all ${
                          isSelected 
                            ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25 scale-105' 
                            : 'bg-background border border-border text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {!initialData && (
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
                      {Object.values(TaskDifficulty).filter(d => d !== TaskDifficulty.ALL).map((diff) => (
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
            )}

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
                  {initialData ? "Save Changes" : "Post Bounty"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
