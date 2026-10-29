import React from 'react';
import {
  PhoneCall,
  Clock,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

export const PlumberGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
          <TrendingUp className="w-4 h-4" />
          <span>Independent Contractor Playbook</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          How to Recover 70%+ of Missed Plumbing Calls
        </h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          When a homeowner has a leaking pipe or clogged drain, they don't wait for voicemail.
          They hang up and immediately dial the next plumber on Google. MissedCall AI bridges that
          critical 5-minute gap with instant, personalized SMS recovery.
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">1. The 5-Minute Window</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Homeowners who receive an SMS follow-up within 5 minutes of a missed call are
            <strong className="text-slate-900"> 4.2x more likely</strong> to book than those contacted after 30 minutes.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">2. No Invented Commitments</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The AI never fabricates prices, diagnostic fees, or schedules appointments without your explicit confirmation. You remain 100% in control.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">3. Emergency Damage Control</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            For burst pipes, water heater leaks, and active floods, the AI advises customers to locate and turn off their main water valve immediately.
          </p>
        </div>
      </div>

      {/* Step-by-step Workflow */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          The Daily Plumber Workflow
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900">Missed Call Occurs</p>
              <p className="text-xs text-slate-600 mt-0.5">
                You're in a crawlspace or under a sink and can't answer. You tap <strong>"Log Missed Call"</strong> or review your list.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900">Tap "Draft AI SMS"</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Gemini AI creates a warm, personalized text addressing the customer's exact issue and safety precautions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900">Approve & Copy / Open in SMS</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Review in the phone preview, tap <strong>"Approve & Copy"</strong> or <strong>"Open in SMS App"</strong> to dispatch via your phone's native messenger.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              4
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900">Track to Booked Job</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Customer replies with their availability. Move lead status from <em>Contacted</em> → <em>Responded</em> → <em>Booked</em> and add job notes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Android Mobile Tips */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
          <Smartphone className="w-4 h-4" />
          <span>Android Phone Tip</span>
        </div>
        <h3 className="text-base font-bold text-slate-100">
          Use MissedCall AI on your Android Phone
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Open this web application in Google Chrome on your Android device, tap the Chrome menu (three dots in top right), and select <strong className="text-white">"Add to Home screen"</strong>. MissedCall AI will launch full-screen like a native Android app with zero setup!
        </p>
      </div>
    </div>
  );
};
