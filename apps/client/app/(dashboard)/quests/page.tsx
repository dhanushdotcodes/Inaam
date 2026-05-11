import { Compass, ShieldCheck } from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';

export default function QuestsPage() {
  return (
    <div className="pb-8">
      <DashboardHeader 
        title="Quests"
        description="Embark on adventures to earn rare achievements and rewards."
      />

      <div className="px-8 flex flex-col items-center justify-center py-20 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm mx-8">
        <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <Compass className="h-8 w-8 text-zinc-400" />
        </div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Coming Soon
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 text-center max-w-xs">
          The quest system is currently under development. Stay tuned for epic challenges!
        </p>
        
        <div className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
          <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
            Quest Pass Required
          </span>
        </div>
      </div>
    </div>
  );
}
