import React from 'react';
import { PhoneMissed, Plus, RotateCcw, Wrench } from 'lucide-react';

interface HeaderProps {
  onNewLeadClick: () => void;
  onResetSampleData: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewLeadClick,
  onResetSampleData,
  activeTab,
  setActiveTab,
  companyName,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <PhoneMissed className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                MissedCall <span className="text-blue-600">AI</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block whitespace-nowrap">
              {companyName}
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Desktop/Tablet) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('leads')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'leads' ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Missed Leads
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'playground' ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            AI Message Tester
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'guide' ? 'text-blue-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Recovery Playbook
          </button>
        </nav>

        {/* Zone 3: Primary Action & Prototype Utilities */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onResetSampleData}
            title="Reset sample demonstration leads"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap min-h-[40px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={onNewLeadClick}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors whitespace-nowrap min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Log Missed Call</span>
          </button>
        </div>
      </div>
    </header>
  );
};
