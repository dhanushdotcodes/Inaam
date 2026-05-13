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
import { Loader2, PlusCircle, X } from "lucide-react";

interface TaskCreateFormProps {
  onSubmit: (payload: TaskCreatePayload) => Promise<void>;
  onCancel: () => void;
}

export default function TaskCreateForm({ onSubmit, onCancel }: TaskCreateFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TaskCreatePayload>({
    title: "",
    description: "",
    task_type: TaskType.BOUNTY,
    difficulty: TaskDifficulty.MEDIUM,
    points: 10,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (err) {
      console.error("Submit task error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-background border border-border shadow-xl animate-in fade-in zoom-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">New Bounty</h3>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Title</label>
          <Input
            placeholder="e.g., Wash the Dragon (Dishes)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Description</label>
          <Textarea
            placeholder="What needs to be done?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Difficulty</label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => value && setFormData({ ...formData, difficulty: value as TaskDifficulty })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border">
                {Object.values(TaskDifficulty).map((diff) => (
                  <SelectItem key={diff} value={diff} className="rounded-xl">
                    {diff.charAt(0) + diff.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Reward Points</label>
            <Input
              type="number"
              min="0"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <Button
            type="submit"
            variant="contained"
            isLoading={loading}
            startIcon={<PlusCircle />}
            className="flex-1"
          >
            Post Bounty
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
