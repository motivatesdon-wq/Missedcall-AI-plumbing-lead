import React from 'react';
import { LeadStatus } from '../types';
import { Search, Flame, X } from 'lucide-react';

interface LeadTrackerFilterProps {
  currentStatus: LeadStatus | 'all';
  onSelectStatus: (status: LeadStatus | 'all') => void;
  counts: Record<LeadStatus | 'all', number>;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  showEmergencyOnly: boolean;
  onToggleEmergency: () => void;
  emergencyCount: number;
}

export const LeadTrackerFilter: React.FC<LeadTrackerFilterProps> = ({
  currentStatus,
  onSelectStatus,
  counts,
  searchQuery,
  onSearchChange,
  showEmergencyOnly,
  onToggleEmergency,
  emergencyCount,
}) => {
  const statusTabs: { id: LeadStatus | 'all'; label: string }[] = [
    { id: 'all', label: 'All Calls' },
    { id: 'new', label: 'New' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'responded', label: 'Responded' },
    { id: 'booked', label: 'Booked' },
    { id: 'closed', label: 'Closed' },
  ];

  return (
    <div className="space-y-3 mb-5">
      {/* Search and Emergency Row */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, phone, or problem..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400 min-h-[44px]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 min-w-[32px] min-h-[32px] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={onToggleEmergency}
          className={`flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap min-h-[44px] ${
            showEmergencyOnly
              ? 'bg-rose-600 text-white border-rose-600'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Flame className={`w-3.5 h-3.5 ${showEmergencyOnly ? 'text-white' : 'text-rose-500'}`} />
          <span>Active Emergencies ({emergencyCount})</span>
        </button>
      </div>

      {/* Segmented Filter Bar with horizontal scroll on small devices */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar p-1 bg-slate-100 rounded-xl">
        {statusTabs.map((tab) => {
          const isActive = currentStatus === tab.id;
          const count = counts[tab.id] || 0;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectStatus(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 min-h-[38px] ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-md tabular-nums ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 font-bold'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
