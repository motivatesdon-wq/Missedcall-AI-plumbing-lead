import React, { useState, useEffect } from 'react';
import { Lead, SmsTone } from '../types';
import { copyToClipboard } from '../utils/formatters';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Send,
  AlertTriangle,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

interface AiMessageDraftModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onApproveSms: (leadId: string, approvedText: string, markContacted: boolean) => void;
  companyName: string;
}

export const AiMessageDraftModal: React.FC<AiMessageDraftModalProps> = ({
  lead,
  isOpen,
  onClose,
  onApproveSms,
  companyName,
}) => {
  const [tone, setTone] = useState<SmsTone>('friendly');
  const [customInstruction, setCustomInstruction] = useState('');
  const [draft, setDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoMarkContacted, setAutoMarkContacted] = useState(true);
  const [modelSource, setModelSource] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');

  // When modal opens or lead changes, set initial tone and generate draft
  useEffect(() => {
    if (isOpen && lead) {
      setCopied(false);
      setErrorMsg('');
      const initialTone: SmsTone = lead.isEmergency ? 'urgent' : 'friendly';
      setTone(initialTone);
      generateDraft(lead, initialTone, '');
    }
  }, [isOpen, lead?.id]);

  if (!isOpen || !lead) return null;

  async function generateDraft(
    targetLead: Lead,
    selectedTone: SmsTone,
    extraNotes: string
  ) {
    setIsGenerating(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/ai/draft-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: targetLead.customerName,
          problemDescription: targetLead.problemDescription,
          tone: selectedTone,
          companyName: companyName || 'Rapid Flow Plumbing',
          isEmergency: targetLead.isEmergency,
          additionalNotes: extraNotes,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (data.message) {
        setDraft(data.message);
        setModelSource(data.source || 'gemini-3.8-flash');
      } else {
        throw new Error('No message returned from AI service');
      }
    } catch (err: any) {
      console.warn('AI generation error, using smart fallback', err);
      // Client-side emergency fallback
      const firstName = targetLead.customerName.split(' ')[0] || 'there';
      let fallback = `Hi ${firstName}, this is ${companyName}. Sorry we missed your call regarding ${targetLead.problemDescription}! We'd love to help get this taken care of. Would you like a call back shortly, or to reply here?`;
      if (targetLead.isEmergency) {
        fallback = `Hi ${firstName}, this is ${companyName}. We just missed your call about ${targetLead.problemDescription}. If water is actively leaking, please turn off your main shut-off valve to prevent damage. Reply here or call us back immediately so we can prioritize dispatch!`;
      }
      setDraft(fallback);
      setModelSource('smart-safety-fallback');
    } finally {
      setIsGenerating(false);
    }
  }

  const handleApproveAndCopy = async () => {
    if (!draft.trim()) return;

    const success = await copyToClipboard(draft);
    if (success) {
      setCopied(true);
      onApproveSms(lead.id, draft.trim(), autoMarkContacted);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const smsCharCount = draft.length;
  const smsSegments = Math.ceil(smsCharCount / 160) || 1;

  // Native SMS link for mobile devices
  const encodedBody = encodeURIComponent(draft);
  const cleanPhone = lead.phone.replace(/\D/g, '');
  const smsUri = `sms:${cleanPhone}?body=${encodedBody}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity">
      <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  AI Follow-Up Assistant
                </h2>
                {lead.isSample && (
                  <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                    Demo Lead
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Drafting personalized SMS for {lead.customerName} ({lead.phone})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close drafter"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Customer Problem Summary Banner */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-start justify-between gap-2">
              <div className="text-xs">
                <span className="font-semibold text-slate-700">Reported Problem: </span>
                <span className="text-slate-900">{lead.problemDescription}</span>
              </div>
              {lead.isEmergency && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-md whitespace-nowrap shrink-0">
                  <AlertTriangle className="w-3 h-3" />
                  Emergency Leak
                </span>
              )}
            </div>
          </div>

          {/* AI Tone Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Follow-Up Tone:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTone('friendly');
                  generateDraft(lead, 'friendly', customInstruction);
                }}
                className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors min-h-[40px] ${
                  tone === 'friendly'
                    ? 'bg-blue-50 text-blue-800 border-blue-300 font-semibold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Friendly Check-in
              </button>
              <button
                type="button"
                onClick={() => {
                  setTone('urgent');
                  generateDraft(lead, 'urgent', customInstruction);
                }}
                className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors min-h-[40px] ${
                  tone === 'urgent'
                    ? 'bg-rose-50 text-rose-800 border-rose-300 font-semibold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Urgent / Shut-Off
              </button>
              <button
                type="button"
                onClick={() => {
                  setTone('direct');
                  generateDraft(lead, 'direct', customInstruction);
                }}
                className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors min-h-[40px] ${
                  tone === 'direct'
                    ? 'bg-slate-100 text-slate-900 border-slate-400 font-semibold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Direct & Concise
              </button>
              <button
                type="button"
                onClick={() => {
                  setTone('nudge');
                  generateDraft(lead, 'nudge', customInstruction);
                }}
                className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors min-h-[40px] ${
                  tone === 'nudge'
                    ? 'bg-amber-50 text-amber-800 border-amber-300 font-semibold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                2nd Follow-Up Nudge
              </button>
            </div>
          </div>

          {/* AI Drafting Area & Phone Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Editable Textarea */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span>Draft Message (Editable)</span>
                </label>
                <button
                  type="button"
                  onClick={() => generateDraft(lead, tone, customInstruction)}
                  disabled={isGenerating}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:opacity-50 min-h-[36px]"
                >
                  <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Regenerate</span>
                </button>
              </div>

              <div className="relative flex-1">
                <textarea
                  rows={6}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  disabled={isGenerating}
                  placeholder={isGenerating ? 'AI is generating personalized SMS...' : 'Type message here...'}
                  className="w-full h-full p-3 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed font-sans"
                />
                {isGenerating && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs flex flex-col items-center justify-center rounded-xl text-blue-600 text-xs font-medium gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Gemini AI is crafting tailored follow-up...</span>
                  </div>
                )}
              </div>

              {/* Character and SMS segment counter */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 px-1">
                <span>
                  {smsCharCount} characters · {smsSegments} {smsSegments === 1 ? 'SMS segment' : 'SMS segments'}
                </span>
                {modelSource && (
                  <span className="text-slate-400">
                    Engine: {modelSource.includes('gemini') ? 'Gemini 3.8 Flash' : 'Smart Rule-Safety Engine'}
                  </span>
                )}
              </div>

              {/* Extra instructions / notes for regeneration */}
              <div className="mt-2.5">
                <input
                  type="text"
                  placeholder="Optional note to AI (e.g., mention morning slot or $89 dispatch)"
                  value={customInstruction}
                  onChange={(e) => setCustomInstruction(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Right: Realistic Smartphone Mockup Preview */}
            <div className="bg-slate-900 rounded-2xl p-3 text-white flex flex-col justify-between shadow-inner border border-slate-800">
              {/* Phone Top Bar */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-semibold text-slate-200">Customer Mobile Preview</span>
                  </div>
                  <span>Android Messages</span>
                </div>

                <div className="pt-2 pb-1 text-center">
                  <div className="w-7 h-7 mx-auto rounded-full bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center mb-1">
                    {companyName.slice(0, 1)}
                  </div>
                  <p className="text-xs font-semibold text-slate-200 truncate">{companyName}</p>
                  <p className="text-[10px] text-slate-400 font-mono">To: {lead.phone}</p>
                </div>

                {/* SMS Chat Bubble */}
                <div className="mt-3 space-y-2">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                      Today · Just now
                    </span>
                  </div>
                  <div className="bg-blue-600 text-white text-xs sm:text-sm p-3 rounded-2xl rounded-tr-xs shadow-md max-w-[90%] ml-auto leading-relaxed">
                    {draft || <span className="opacity-50 italic">Generating SMS message...</span>}
                  </div>
                </div>
              </div>

              {/* Compliance & Safety Guarantee Note */}
              <div className="mt-4 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.2" />
                <span>
                  Safety compliance: Never invents prices or unconfirmed appointments. Advises shutoff for active floods.
                </span>
              </div>
            </div>
          </div>

          {/* Auto-update status checkbox */}
          <div className="pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={autoMarkContacted}
                onChange={(e) => setAutoMarkContacted(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Automatically update lead status to <strong>"Contacted"</strong> upon approval</span>
            </label>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-2">
          {/* Native Phone SMS link for Android */}
          <a
            href={smsUri}
            onClick={() => {
              if (autoMarkContacted) {
                onApproveSms(lead.id, draft.trim(), true);
              }
            }}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
            title="Open in your Android SMS messenger"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Open in SMS App</span>
          </a>

          {/* Primary Action: Approve and Copy */}
          <button
            type="button"
            onClick={handleApproveAndCopy}
            disabled={!draft.trim() || isGenerating}
            className={`w-full sm:flex-1 py-2.5 px-5 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 min-h-[44px] ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Approved & Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-blue-200" />
                <span>Approve & Copy Message</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
