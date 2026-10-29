import { LeadStatus } from '../types';

export function formatPhoneNumber(input: string): string {
  const cleaned = input.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return input;
}

export function formatTimeAgo(isoDate: string): string {
  const now = Date.now();
  const past = new Date(isoDate).getTime();
  const diffMinutes = Math.floor((now - past) / (1000 * 60));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
}

export function formatDateTime(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export interface StatusConfig {
  label: string;
  badgeBg: string;
  badgeText: string;
  border: string;
  description: string;
}

export const STATUS_CONFIG: Record<LeadStatus, StatusConfig> = {
  new: {
    label: 'New Call',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    border: 'border-rose-200',
    description: 'Requires follow-up SMS',
  },
  contacted: {
    label: 'Contacted',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    border: 'border-blue-200',
    description: 'Follow-up SMS sent',
  },
  responded: {
    label: 'Responded',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    border: 'border-amber-200',
    description: 'Customer replied to text',
  },
  booked: {
    label: 'Booked',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    border: 'border-emerald-200',
    description: 'Service appointment set',
  },
  closed: {
    label: 'Closed',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-600',
    border: 'border-slate-200',
    description: 'Completed or inactive',
  },
};

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}
