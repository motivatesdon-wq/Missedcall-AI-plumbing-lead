import React from 'react';
import { Lead } from '../types';
import { PhoneCall, AlertTriangle, MessageSquare, CalendarCheck } from 'lucide-react';

interface StatsOverviewProps {
  leads: Lead[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ leads }) => {
  const total = leads.length;
  const newLeads = leads.filter((l) => l.status === 'new').length;
  const contacted = leads.filter((l) => l.status === 'contacted').length;
  const responded = leads.filter((l) => l.status === 'responded').length;
  const booked = leads.filter((l) => l.status === 'booked').length;
  const emergencies = leads.filter((l) => l.isEmergency && l.status !== 'closed').length;

  const recoveredCount = contacted + responded + booked;
  const recoveryRate = total > 0 ? Math.round((recoveredCount / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Stat 1: Total Missed */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Missed Calls</span>
          <PhoneCall className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {total}
          </span>
          <span className="text-xs text-slate-500">logged</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          {emergencies > 0 ? `${emergencies} urgent leak / emergency` : 'All inquiries logged'}
        </p>
      </div>

      {/* Stat 2: Action Needed (New) */}
      <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20">
        <div className="flex items-center justify-between text-rose-700 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">Action Needed</span>
          <AlertTriangle className="w-4 h-4 text-rose-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-rose-700 tabular-nums">
            {newLeads}
          </span>
          <span className="text-xs text-rose-600 font-medium">Awaiting SMS</span>
        </div>
        <p className="text-[11px] text-slate-600 mt-1">
          Draft & send follow-up text
        </p>
      </div>

      {/* Stat 3: Recovery Rate */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Follow-Up Rate</span>
          <MessageSquare className="w-4 h-4 text-blue-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {recoveryRate}%
          </span>
          <span className="text-xs text-emerald-600 font-medium">Contacted</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          {recoveredCount} of {total} leads followed up
        </p>
      </div>

      {/* Stat 4: Booked Jobs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Booked Jobs</span>
          <CalendarCheck className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {booked}
          </span>
          <span className="text-xs text-emerald-700 font-medium">Confirmed</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          Revenue secured from missed calls
        </p>
      </div>
    </div>
  );
};
