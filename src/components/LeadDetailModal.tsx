import React, { useState } from 'react';
import { Lead, LeadStatus, LeadNote } from '../types';
import { STATUS_CONFIG, formatDateTime, formatTimeAgo } from '../utils/formatters';
import {
  X,
  Phone,
  MessageSquare,
  Sparkles,
  AlertCircle,
  Clock,
  Plus,
  Send,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  onAddNote: (leadId: string, text: string) => void;
  onOpenDraftModal: (lead: Lead) => void;
}

const QUICK_NOTES = [
  'Left voicemail asking for callback',
  'Customer sent photo of the leak',
  'Quoted standard $89 diagnostic fee',
  'Customer said they turned off main shut-off',
  'Followed up via text message',
  'Customer scheduled for tomorrow morning',
];

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdateStatus,
  onAddNote,
  onOpenDraftModal,
}) => {
  const [newNoteText, setNewNoteText] = useState('');

  if (!isOpen || !lead) return null;

  const statusCfg = STATUS_CONFIG[lead.status];

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(lead.id, newNoteText.trim());
    setNewNoteText('');
  };

  const handleQuickNote = (note: string) => {
    onAddNote(lead.id, note);
  };

  const cleanPhone = lead.phone.replace(/\D/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity">
      <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {lead.customerName}
                </h2>
                {lead.isSample && (
                  <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    Sample Demonstration
                  </span>
                )}
                {lead.isEmergency && (
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-rose-600" />
                    Urgent
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Logged {formatDateTime(lead.createdAt)} ({formatTimeAgo(lead.createdAt)})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close details"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5">
          {/* Quick Action Ribbon: Call, SMS, and Status Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            {/* Phone & Direct Contact */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs min-h-[40px]"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {lead.phone}</span>
              </a>
              <button
                onClick={() => {
                  onClose();
                  onOpenDraftModal(lead);
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs min-h-[40px]"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>Draft SMS</span>
              </button>
            </div>

            {/* Status Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Status:</span>
              <select
                value={lead.status}
                aria-label="Lead Status"
                onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                className={`text-xs font-bold px-3 py-2 rounded-lg border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[40px] ${statusCfg.badgeBg} ${statusCfg.badgeText} ${statusCfg.border}`}
              >
                <option value="new">● New (Action Needed)</option>
                <option value="contacted">● Contacted (SMS Sent)</option>
                <option value="responded">● Responded (In Dialogue)</option>
                <option value="booked">● Booked (Appointment Set)</option>
                <option value="closed">● Closed (Completed/Lost)</option>
              </select>
            </div>
          </div>

          {/* Plumbing Problem Overview */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Plumbing Problem Description
            </h3>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-900 leading-relaxed">
              {lead.problemDescription}
            </div>
          </div>

          {/* Approved SMS Draft if present */}
          {lead.approvedSmsDraft && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Approved Follow-Up SMS</span>
                </h3>
                <button
                  onClick={() => {
                    onClose();
                    onOpenDraftModal(lead);
                  }}
                  className="text-xs font-semibold text-blue-600 hover:underline min-h-[32px] flex items-center"
                >
                  Edit / Re-draft
                </button>
              </div>
              <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 text-xs sm:text-sm text-blue-950 italic leading-relaxed">
                "{lead.approvedSmsDraft}"
              </div>
            </div>
          )}

          {/* Lead Notes Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Lead Notes ({lead.notes.length})
              </h3>
              <span className="text-[11px] text-slate-400">Timestamped history</span>
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNoteSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Add a new note (e.g. Quoted $120, customer will call back at 4pm)..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="flex-1 px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[44px]"
              />
              <button
                type="submit"
                disabled={!newNoteText.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-lg transition-colors flex items-center gap-1 min-h-[44px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Note</span>
              </button>
            </form>

            {/* Quick Note Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {QUICK_NOTES.map((qn) => (
                <button
                  key={qn}
                  type="button"
                  onClick={() => handleQuickNote(qn)}
                  className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors"
                >
                  + {qn}
                </button>
              ))}
            </div>

            {/* Notes List */}
            <div className="space-y-2 mt-3">
              {lead.notes.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  No notes recorded yet. Add one above to keep track of this lead.
                </p>
              ) : (
                lead.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-800 space-y-1"
                  >
                    <p className="leading-relaxed">{note.text}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="font-medium text-slate-600">{note.author}</span>
                      <span>·</span>
                      <span>{formatDateTime(note.createdAt)}</span>
                      <span>({formatTimeAgo(note.createdAt)})</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Activity History</span>
            </h3>
            <div className="space-y-2 pl-2 border-l-2 border-slate-200 ml-1">
              {lead.activities.map((act) => (
                <div key={act.id} className="relative pl-3 text-xs text-slate-600">
                  <div className="w-2 h-2 bg-slate-400 rounded-full absolute -left-[17px] top-1.5" />
                  <p className="font-medium text-slate-800">{act.text}</p>
                  <p className="text-[10px] text-slate-400">{formatDateTime(act.timestamp)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg min-h-[44px]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
