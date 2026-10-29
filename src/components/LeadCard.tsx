import React from 'react';
import { Lead, LeadStatus } from '../types';
import { formatTimeAgo, STATUS_CONFIG } from '../utils/formatters';
import { Phone, MessageSquare, AlertCircle, FileText, Sparkles, ChevronDown } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onOpenDraftModal: (lead: Lead) => void;
  onOpenDetailModal: (lead: Lead) => void;
  onUpdateStatus: (leadId: string, newStatus: LeadStatus) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onOpenDraftModal,
  onOpenDetailModal,
  onUpdateStatus,
}) => {
  const statusCfg = STATUS_CONFIG[lead.status];

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs p-4 sm:p-5 flex flex-col justify-between gap-3">
      {/* Top Row: Customer Info, Sample Label, Emergency Badge & Time */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 truncate">
                {lead.customerName}
              </h3>
              {lead.isSample && (
                <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md whitespace-nowrap">
                  Sample Demonstration
                </span>
              )}
              {lead.isEmergency && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md whitespace-nowrap">
                  <AlertCircle className="w-3 h-3 text-rose-600" />
                  Urgent / Leak
                </span>
              )}
            </div>

            {/* Clean unboxed metadata */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
              <a
                href={`tel:${lead.phone.replace(/\D/g, '')}`}
                className="font-mono text-blue-600 hover:underline flex items-center gap-1 min-h-[32px]"
                title="Call Customer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{lead.phone}</span>
              </a>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Missed {formatTimeAgo(lead.createdAt)}</span>
              {lead.notes.length > 0 && (
                <>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-600">{lead.notes.length} {lead.notes.length === 1 ? 'note' : 'notes'}</span>
                </>
              )}
            </div>
          </div>

          {/* Quick Status Selector */}
          <div className="relative shrink-0">
            <select
              value={lead.status}
              aria-label="Lead status"
              onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
              className={`text-xs font-semibold px-2.5 py-1.5 pr-7 rounded-lg border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[38px] ${statusCfg.badgeBg} ${statusCfg.badgeText} ${statusCfg.border}`}
            >
              <option value="new">● New Call</option>
              <option value="contacted">● Contacted</option>
              <option value="responded">● Responded</option>
              <option value="booked">● Booked</option>
              <option value="closed">● Closed</option>
            </select>
            <ChevronDown className={`w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${statusCfg.badgeText}`} />
          </div>
        </div>

        {/* Problem Description Box */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed my-2">
          <p className="font-normal">{lead.problemDescription}</p>
        </div>

        {/* If SMS draft approved already, show snippet */}
        {lead.approvedSmsDraft && (
          <div className="text-xs text-slate-600 bg-blue-50/50 rounded-md p-2 border border-blue-100 mt-2 flex items-start gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <p className="line-clamp-2 italic text-slate-700">
              "{lead.approvedSmsDraft}"
            </p>
          </div>
        )}
      </div>

      {/* Card Actions Bottom Strip: Ergonomic for Android thumb reach */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onOpenDetailModal(lead)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors min-h-[44px]"
        >
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span>Notes & Activity</span>
        </button>

        <button
          onClick={() => onOpenDraftModal(lead)}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg shadow-xs transition-colors min-h-[44px] ${
            lead.status === 'new'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-200" />
          <span>{lead.approvedSmsDraft ? 'Re-draft SMS' : 'Draft AI SMS'}</span>
        </button>
      </div>
    </div>
  );
};
