/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus } from './types';
import { INITIAL_SAMPLE_LEADS } from './data/sampleLeads';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { LeadTrackerFilter } from './components/LeadTrackerFilter';
import { LeadCard } from './components/LeadCard';
import { NewLeadModal } from './components/NewLeadModal';
import { AiMessageDraftModal } from './components/AiMessageDraftModal';
import { LeadDetailModal } from './components/LeadDetailModal';
import { AiPlayground } from './components/AiPlayground';
import { PlumberGuide } from './components/PlumberGuide';
import { BottomNav } from './components/BottomNav';
import {
  PhoneMissed,
  Info,
  Plus,
  RotateCcw,
  Sparkles,
  Check,
  AlertCircle,
} from 'lucide-react';

const STORAGE_KEY = 'missedcall_ai_leads_v1';
const COMPANY_STORAGE_KEY = 'missedcall_ai_company_name';

export default function App() {
  // Load initial leads from localStorage or default sample leads
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored leads', e);
    }
    return INITIAL_SAMPLE_LEADS;
  });

  const [companyName, setCompanyName] = useState<string>(() => {
    return localStorage.getItem(COMPANY_STORAGE_KEY) || 'Rapid Flow Plumbing & Drain';
  });

  // Navigation & View state
  const [activeTab, setActiveTab] = useState<'leads' | 'playground' | 'guide'>('leads');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);

  // Active Modals
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [selectedLeadForDraft, setSelectedLeadForDraft] = useState<Lead | null>(null);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  // Sync leads to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error('Failed to save leads to localStorage', e);
    }
  }, [leads]);

  // Sync company name
  useEffect(() => {
    try {
      localStorage.setItem(COMPANY_STORAGE_KEY, companyName);
    } catch (e) {
      console.error('Failed to save company name', e);
    }
  }, [companyName]);

  // Keep selected modals in sync with lead state updates
  useEffect(() => {
    if (selectedLeadForDraft) {
      const fresh = leads.find((l) => l.id === selectedLeadForDraft.id);
      if (fresh) setSelectedLeadForDraft(fresh);
    }
    if (selectedLeadForDetail) {
      const fresh = leads.find((l) => l.id === selectedLeadForDetail.id);
      if (fresh) setSelectedLeadForDetail(fresh);
    }
  }, [leads]);

  // Reset to initial sample leads
  const handleResetSampleData = () => {
    setLeads(INITIAL_SAMPLE_LEADS);
    showToast('Reset to 5 sample demonstration leads');
  };

  // Add new lead from intake form
  const handleAddLead = (
    leadData: Omit<Lead, 'id' | 'createdAt' | 'notes' | 'activities'>,
    draftImmediately: boolean
  ) => {
    const newId = `lead-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const createdLead: Lead = {
      ...leadData,
      id: newId,
      createdAt: timestamp,
      notes: [],
      activities: [
        {
          id: `act-${Date.now()}`,
          type: 'created',
          text: 'Missed call logged manually',
          timestamp,
        },
      ],
    };

    setLeads((prev) => [createdLead, ...prev]);
    showToast(`Logged missed call for ${createdLead.customerName}`);

    if (draftImmediately) {
      setSelectedLeadForDraft(createdLead);
    }
  };

  // Update lead status
  const handleUpdateStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== leadId) return l;
        const now = new Date().toISOString();
        const activityText = `Status updated to ${newStatus.toUpperCase()}`;
        return {
          ...l,
          status: newStatus,
          activities: [
            {
              id: `act-${Date.now()}`,
              type: 'status_change',
              text: activityText,
              timestamp: now,
            },
            ...l.activities,
          ],
        };
      })
    );
    showToast(`Lead status updated to ${newStatus}`);
  };

  // Approve SMS draft
  const handleApproveSms = (
    leadId: string,
    approvedText: string,
    markContacted: boolean
  ) => {
    const now = new Date().toISOString();
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== leadId) return l;

        const newStatus = markContacted && l.status === 'new' ? 'contacted' : l.status;
        const updatedActivities = [
          {
            id: `act-${Date.now()}`,
            type: 'sms_approved' as const,
            text: 'Approved follow-up SMS and copied to clipboard',
            timestamp: now,
          },
          ...l.activities,
        ];

        return {
          ...l,
          approvedSmsDraft: approvedText,
          status: newStatus,
          lastContactAt: now,
          activities: updatedActivities,
        };
      })
    );
    showToast('SMS copied! Marked lead as Contacted');
  };

  // Add note to lead
  const handleAddNote = (leadId: string, noteText: string) => {
    const now = new Date().toISOString();
    const noteId = `note-${Date.now()}`;

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== leadId) return l;
        return {
          ...l,
          notes: [
            {
              id: noteId,
              text: noteText,
              createdAt: now,
              author: 'Plumber / Dispatch',
            },
            ...l.notes,
          ],
          activities: [
            {
              id: `act-${Date.now()}`,
              type: 'note_added',
              text: `Added note: "${noteText.slice(0, 35)}${noteText.length > 35 ? '...' : ''}"`,
              timestamp: now,
            },
            ...l.activities,
          ],
        };
      })
    );
    showToast('Note added to lead');
  };

  // Counts for filters
  const counts: Record<LeadStatus | 'all', number> = {
    all: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    responded: leads.filter((l) => l.status === 'responded').length,
    booked: leads.filter((l) => l.status === 'booked').length,
    closed: leads.filter((l) => l.status === 'closed').length,
  };

  const emergencyCount = leads.filter((l) => l.isEmergency && l.status !== 'closed').length;

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    if (statusFilter !== 'all' && lead.status !== statusFilter) {
      return false;
    }
    if (showEmergencyOnly && !lead.isEmergency) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = lead.customerName.toLowerCase().includes(q);
      const matchPhone = lead.phone.toLowerCase().includes(q);
      const matchDesc = lead.problemDescription.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchDesc) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8">
      {/* Top Header */}
      <Header
        onNewLeadClick={() => setIsNewLeadOpen(true)}
        onResetSampleData={handleResetSampleData}
        activeTab={activeTab}
        setActiveTab={(t) => setActiveTab(t as any)}
        companyName={companyName}
        setCompanyName={setCompanyName}
      />

      {/* Demonstration Banner */}
      <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-amber-900 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded">
              Prototype Mode
            </span>
            <span>
              Preloaded with realistic <strong>Sample Demonstration Leads</strong>. Test the AI message-drafting feature without sending real SMS.
            </span>
          </div>
          <button
            onClick={() => setActiveTab('playground')}
            className="hidden sm:flex items-center gap-1 font-semibold text-amber-900 hover:text-amber-950 underline shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test AI Playground</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* VIEW 1: Leads Dashboard */}
        {activeTab === 'leads' && (
          <div>
            {/* KPI Overview */}
            <StatsOverview leads={leads} />

            {/* Filter controls & Search */}
            <LeadTrackerFilter
              currentStatus={statusFilter}
              onSelectStatus={setStatusFilter}
              counts={counts}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              showEmergencyOnly={showEmergencyOnly}
              onToggleEmergency={() => setShowEmergencyOnly((v) => !v)}
              emergencyCount={emergencyCount}
            />

            {/* Leads Card Grid */}
            {filteredLeads.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <PhoneMissed className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No Missed Calls Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery || showEmergencyOnly || statusFilter !== 'all'
                    ? 'No leads match the current filters. Try resetting search or status.'
                    : 'All missed calls have been resolved or no calls have been logged yet.'}
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setShowEmergencyOnly(false);
                      setSearchQuery('');
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg min-h-[40px]"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => setIsNewLeadOpen(true)}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg min-h-[40px] flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log New Call</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onOpenDraftModal={(l) => setSelectedLeadForDraft(l)}
                    onOpenDetailModal={(l) => setSelectedLeadForDetail(l)}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: AI Message Drafting Tester / Playground */}
        {activeTab === 'playground' && (
          <AiPlayground companyName={companyName} />
        )}

        {/* VIEW 3: Best Practices Guide */}
        {activeTab === 'guide' && <PlumberGuide />}
      </main>

      {/* Floating Bottom Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(t) => setActiveTab(t as any)}
        onOpenNewLead={() => setIsNewLeadOpen(true)}
        newLeadsCount={counts.new}
      />

      {/* Modals */}
      <NewLeadModal
        isOpen={isNewLeadOpen}
        onClose={() => setIsNewLeadOpen(false)}
        onAddLead={handleAddLead}
      />

      <AiMessageDraftModal
        lead={selectedLeadForDraft}
        isOpen={!!selectedLeadForDraft}
        onClose={() => setSelectedLeadForDraft(null)}
        onApproveSms={handleApproveSms}
        companyName={companyName}
      />

      <LeadDetailModal
        lead={selectedLeadForDetail}
        isOpen={!!selectedLeadForDetail}
        onClose={() => setSelectedLeadForDetail(null)}
        onUpdateStatus={handleUpdateStatus}
        onAddNote={handleAddNote}
        onOpenDraftModal={(l) => {
          setSelectedLeadForDetail(null);
          setSelectedLeadForDraft(l);
        }}
      />
    </div>
  );
}
