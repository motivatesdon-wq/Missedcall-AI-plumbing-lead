import React from 'react';
import { PhoneMissed, PlusCircle, Sparkles, BookOpen } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewLead: () => void;
  newLeadsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewLead,
  newLeadsCount,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200">
      <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto px-2">
        {/* Tab 1: Leads */}
        <button
          onClick={() => setActiveTab('leads')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] relative transition-colors ${
            activeTab === 'leads' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <PhoneMissed className="w-5 h-5" />
            {newLeadsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {newLeadsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-1">Leads</span>
        </button>

        {/* Tab 2: Log Missed Call */}
        <button
          onClick={onOpenNewLead}
          className="flex flex-col items-center justify-center h-full min-h-[48px] text-blue-600 active:scale-95 transition-transform"
        >
          <PlusCircle className="w-6 h-6 text-blue-600" />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Log Call</span>
        </button>

        {/* Tab 3: AI Tester */}
        <button
          onClick={() => setActiveTab('playground')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] transition-colors ${
            activeTab === 'playground' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">AI Tester</span>
        </button>

        {/* Tab 4: Guide */}
        <button
          onClick={() => setActiveTab('guide')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] transition-colors ${
            activeTab === 'guide' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Playbook</span>
        </button>
      </div>
    </div>
  );
};
