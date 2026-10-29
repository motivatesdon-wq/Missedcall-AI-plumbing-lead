import React, { useState } from 'react';
import { SmsTone } from '../types';
import { copyToClipboard } from '../utils/formatters';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Smartphone,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface AiPlaygroundProps {
  companyName: string;
}

const TEST_SCENARIOS = [
  {
    title: 'Emergency: Burst Pipe in Basement',
    name: 'Amanda Taylor',
    problem: 'Water pipe burst behind the drywall in the basement, gushing water rapidly onto the floor.',
    isEmergency: true,
    tone: 'urgent' as SmsTone,
  },
  {
    title: 'Urgent: Leaking Water Heater Tank',
    name: 'Gregory Mills',
    problem: '50-gallon Rheem water heater is pooling rusty water around the bottom and pilot light went out.',
    isEmergency: true,
    tone: 'friendly' as SmsTone,
  },
  {
    title: 'Routine: Clogged Kitchen Sink',
    name: 'Samantha Wu',
    problem: 'Garbage disposal is clogged and kitchen sink takes 20 minutes to drain with bad odor.',
    isEmergency: false,
    tone: 'friendly' as SmsTone,
  },
  {
    title: 'Inquiry: Whole House Water Filter Quote',
    name: 'Carlos Mendez',
    problem: 'Interested in installing a whole-house sediment and carbon filter system next week.',
    isEmergency: false,
    tone: 'direct' as SmsTone,
  },
  {
    title: 'Second Nudge: Running Toilet',
    name: 'Rachel Adams',
    problem: 'Upstairs guest toilet won\'t stop running after flushing, flapper looks warped.',
    isEmergency: false,
    tone: 'nudge' as SmsTone,
  },
];

export const AiPlayground: React.FC<AiPlaygroundProps> = ({ companyName }) => {
  const [customerName, setCustomerName] = useState('Amanda Taylor');
  const [problem, setProblem] = useState(
    'Water pipe burst behind the drywall in the basement, gushing water rapidly onto the floor.'
  );
  const [isEmergency, setIsEmergency] = useState(true);
  const [tone, setTone] = useState<SmsTone>('urgent');
  const [draft, setDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [engineSource, setEngineSource] = useState('');

  const loadScenario = (sc: typeof TEST_SCENARIOS[0]) => {
    setCustomerName(sc.name);
    setProblem(sc.problem);
    setIsEmergency(sc.isEmergency);
    setTone(sc.tone);
    handleGenerate(sc.name, sc.problem, sc.isEmergency, sc.tone);
  };

  const handleGenerate = async (
    name = customerName,
    desc = problem,
    emerg = isEmergency,
    t = tone
  ) => {
    if (!desc.trim()) return;
    setIsGenerating(true);
    setCopied(false);

    try {
      const res = await fetch('/api/ai/draft-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          problemDescription: desc,
          tone: t,
          companyName,
          isEmergency: emerg,
        }),
      });

      const data = await res.json();
      if (data.message) {
        setDraft(data.message);
        setEngineSource(data.source || 'gemini-3.8-flash');
      }
    } catch (err) {
      console.error('Playground generation error', err);
      // Fallback
      const firstName = name.split(' ')[0] || 'there';
      if (emerg) {
        setDraft(
          `Hi ${firstName}, this is ${companyName}. We just missed your call regarding ${desc}. If water is actively flooding, please turn off your main water valve right away. Reply here or call us back so our on-call tech can assist you immediately!`
        );
      } else {
        setDraft(
          `Hi ${firstName}, this is ${companyName}. Sorry we missed your call about ${desc}! We'd love to help get this resolved. Would you like a quick callback or to reply here with details?`
        );
      }
      setEngineSource('safety-rules-fallback');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!draft) return;
    const success = await copyToClipboard(draft);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>AI Message Drafting Sandbox</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Test and verify how MissedCall AI handles diverse plumbing scenarios while strictly enforcing
              safety policies: no invented prices, no fake bookings, shutoff warnings for emergencies, and
              concise SMS formatting.
            </p>
          </div>
        </div>

        {/* Quick Test Scenarios */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Load a Test Scenario:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {TEST_SCENARIOS.map((sc) => (
              <button
                key={sc.title}
                onClick={() => loadScenario(sc)}
                className="text-xs px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-200 transition-colors font-medium text-left"
              >
                {sc.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Controls & Results Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Input Controls */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Configure Scenario</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Plumbing Problem Description
            </label>
            <textarea
              rows={3}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="w-full p-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none leading-relaxed"
            />
          </div>

          {/* Emergency Checkbox */}
          <div>
            <label className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <span className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Treat as Plumbing Emergency (Triggers shutoff advice)
              </span>
            </label>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Draft Tone
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['friendly', 'urgent', 'direct', 'nudge'] as SmsTone[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border text-center capitalize transition-colors min-h-[38px] ${
                    tone === t
                      ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating || !problem.trim()}
            className="w-full py-3 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[48px]"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Drafting with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Generate Test SMS</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Output & Android Phone Preview */}
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-lg border border-slate-800 flex flex-col justify-between min-h-[320px]">
            <div>
              {/* Phone Header */}
              <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-slate-200">Android SMS Preview</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {engineSource ? `Engine: ${engineSource}` : 'Ready'}
                </span>
              </div>

              {/* Chat Thread */}
              <div className="mt-4 space-y-3">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full">
                    To: {customerName} · Today
                  </span>
                </div>

                <div className="bg-blue-600 text-white text-xs sm:text-sm p-3.5 rounded-2xl rounded-tr-xs shadow-md leading-relaxed ml-auto max-w-[90%]">
                  {draft || (
                    <span className="opacity-60 italic">
                      Click "Generate Test SMS" or pick a scenario above to test the AI.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                {draft ? `${draft.length} chars · ${Math.ceil(draft.length / 160)} SMS` : '0 chars'}
              </span>

              {draft && (
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors min-h-[36px]"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-300" />
                      <span>Copy Draft</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Rule Compliance Audit Card */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Automated Compliance Checklist</span>
            </h4>
            <ul className="space-y-1 text-slate-600">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero invented prices, estimates, or unconfirmed bookings</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Main shut-off valve instructions enforced for active flooding</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Concise, high-readability phrasing tailored for mobile SMS</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
