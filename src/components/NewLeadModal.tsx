import React, { useState } from 'react';
import { Lead } from '../types';
import { formatPhoneNumber } from '../utils/formatters';
import { X, Sparkles, AlertCircle, Phone, User, Wrench } from 'lucide-react';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'notes' | 'activities'>, draftImmediately: boolean) => void;
}

const COMMON_PLUMBING_PROBLEMS = [
  'Water heater leaking from bottom',
  'Kitchen sink clogged & backing up',
  'Burst pipe / active water flooding',
  'Toilet running & won\'t shut off',
  'Main sewer line gurgling',
  'No hot water / pilot light out',
  'Low water pressure whole house',
  'Garbage disposal jammed and humming',
];

export const NewLeadModal: React.FC<NewLeadModalProps> = ({
  isOpen,
  onClose,
  onAddLead,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handlePhoneChange = (val: string) => {
    setPhone(formatPhoneNumber(val));
  };

  const handleQuickProblem = (problem: string) => {
    if (!problemDescription) {
      setProblemDescription(problem);
    } else {
      setProblemDescription(`${problemDescription}. Also: ${problem}`);
    }

    if (/burst|flood|emergency|sewer|gas/i.test(problem)) {
      setIsEmergency(true);
    }
  };

  const handleSubmit = (draftImmediately: boolean) => {
    if (!customerName.trim()) {
      setFormError('Please enter the customer name');
      return;
    }
    if (!phone.trim()) {
      setFormError('Please enter a phone number');
      return;
    }
    if (!problemDescription.trim()) {
      setFormError('Please provide a short description of the plumbing problem');
      return;
    }

    setFormError('');
    onAddLead(
      {
        customerName: customerName.trim(),
        phone: phone.trim(),
        problemDescription: problemDescription.trim(),
        status: 'new',
        isEmergency,
        isSample: false, // New user-entered leads are real
      },
      draftImmediately
    );

    // Reset form
    setCustomerName('');
    setPhone('');
    setProblemDescription('');
    setIsEmergency(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Log Missed Call</h2>
              <p className="text-xs text-slate-500">Record caller details for AI follow-up</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {formError && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Robert Smith"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[44px]"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="(555) 000-0000"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[44px]"
              />
            </div>
          </div>

          {/* Plumbing Problem Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Plumbing Problem Description <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Short details for SMS AI</span>
            </div>
            <textarea
              rows={3}
              placeholder="e.g. Water heater leaking from base, water shut off valve won't budge..."
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              className="w-full p-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed resize-none"
            />

            {/* Quick-tap common plumbing presets */}
            <div className="mt-2">
              <p className="text-[11px] font-medium text-slate-500 mb-1.5 flex items-center gap-1">
                <Wrench className="w-3 h-3" /> Quick Presets (tap to add):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_PLUMBING_PROBLEMS.map((problem) => (
                  <button
                    key={problem}
                    type="button"
                    onClick={() => handleQuickProblem(problem)}
                    className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors text-left"
                  >
                    + {problem}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency / Urgent Toggle */}
          <div className="pt-2">
            <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <div className="text-xs">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  Plumbing Emergency (Active Leak / Flood / Hazard)
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  AI will prioritize water shut-off instructions and urgent dispatch advice.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-2">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="w-full sm:flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors min-h-[44px]"
          >
            Save Lead
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="w-full sm:flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>Save & Draft SMS Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
