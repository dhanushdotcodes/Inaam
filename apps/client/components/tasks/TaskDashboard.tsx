"use client";

import React, { useState } from "react";
import TaskHeader from "./components/TaskHeader";
import TaskFilters from "./components/TaskFilters";
import TaskList from "./components/TaskList";
import TaskFormDialog from "./dialogs/TaskFormDialog";
import UnclaimedPoints from "@/components/tasks/components/UnclaimedPoints";
import DailyBonusProgress from "@/components/tasks/components/DailyBonusProgress";

import { useTasks } from "@/hooks/useTasks";
import PageShell, { PageContent } from "@/components/layout/PageShell";
import DashboardLoader from "@/components/shared/DashboardLoader";
import StatusError from "@/components/shared/StatusError";

/**
 * TaskDashboard component — Orchestrates the display and completion of all tasks (Bounties & Objectives).
 */
export default function TaskDashboard() {
  const {
    tasks,
    rewards,
    filteredTasks,
    loading,
    error,
    searchQuery,
    filter,
    difficultyFilter,
    setSearchQuery,
    setFilter,
    setDifficultyFilter,
    toggleComplete,
    deleteTask,
    refresh,
    stats
  } = useTasks();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <PageShell>
      <TaskHeader 
        completedCount={stats.completed} 
        totalCount={stats.total} 
        onNewTask={() => setIsCreateDialogOpen(true)}
      />

      <PageContent className="space-y-6">
        <TaskFilters 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          filter={filter} 
          onFilterChange={setFilter} 
          difficultyFilter={difficultyFilter}
          onDifficultyChange={setDifficultyFilter}
        />

        {loading && tasks.length === 0 && (
          <DashboardLoader message="Loading your tasks..." />
        )}

        {!loading && error && (
          <StatusError error={error} onRetry={refresh} />
        )}

        {!loading && !error && (
          <>
            <DailyBonusProgress />
            <UnclaimedPoints tasks={tasks} />

            <TaskList 
              tasks={filteredTasks} 
              rewards={rewards} 
              onToggle={toggleComplete} 
              onDelete={(task) => deleteTask(task.id, task.reward_id)}
              filter={`${filter}-${difficultyFilter}`}
            />
          </>
        )}
      </PageContent>

      <TaskFormDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
        onSuccess={refresh}
      />
    </PageShell>
  );
}
