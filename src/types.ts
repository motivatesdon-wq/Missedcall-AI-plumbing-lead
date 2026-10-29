export type LeadStatus = 'new' | 'contacted' | 'responded' | 'booked' | 'closed';

export interface LeadNote {
  id: string;
  text: string;
  createdAt: string;
  author: string;
}

export interface LeadActivity {
  id: string;
  type: 'created' | 'status_change' | 'sms_drafted' | 'sms_approved' | 'note_added';
  text: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  customerName: string;
  phone: string;
  problemDescription: string;
  status: LeadStatus;
  isEmergency: boolean;
  isSample: boolean;
  createdAt: string;
  lastContactAt?: string;
  approvedSmsDraft?: string;
  notes: LeadNote[];
  activities: LeadActivity[];
}

export type SmsTone = 'friendly' | 'urgent' | 'direct' | 'nudge';
