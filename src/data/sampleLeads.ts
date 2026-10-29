import { Lead } from '../types';

export const INITIAL_SAMPLE_LEADS: Lead[] = [
  {
    id: 'sample-1',
    customerName: 'Sarah Jenkins',
    phone: '(555) 382-9104',
    problemDescription: 'Water heater tank leaking active stream from the base onto garage floor. Pilot light is clicking.',
    status: 'new',
    isEmergency: true,
    isSample: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 mins ago
    notes: [
      {
        id: 'n-1',
        text: 'Customer sounded anxious on voicemail. Stated water is beginning to pool near drywall.',
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        author: 'Dispatch',
      },
    ],
    activities: [
      {
        id: 'a-1',
        type: 'created',
        text: 'Missed call logged automatically via phone system',
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      },
    ],
  },
  {
    id: 'sample-2',
    customerName: 'Marcus Vance',
    phone: '(555) 741-2953',
    problemDescription: 'Main kitchen sink drain is completely clogged and bubbling dirty water back up into the dishwasher.',
    status: 'new',
    isEmergency: false,
    isSample: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    notes: [
      {
        id: 'n-2',
        text: 'Tried using liquid drain cleaner with no success. Needs an auger or snake.',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        author: 'Dispatch',
      },
    ],
    activities: [
      {
        id: 'a-2',
        type: 'created',
        text: 'Missed call logged from customer',
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      },
    ],
  },
  {
    id: 'sample-3',
    customerName: 'Elena Rodriguez',
    phone: '(555) 890-1422',
    problemDescription: 'Upstairs master bath toilet is running continuously, and the wall shut-off valve is calcified and stuck.',
    status: 'contacted',
    isEmergency: false,
    isSample: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(), // ~1.5 hours ago
    lastContactAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    approvedSmsDraft:
      "Hi Elena, this is Rapid Flow Plumbing. Sorry we missed your call about your running upstairs toilet and stuck shut-off valve! We'd be glad to send a licensed tech to inspect and replace the valve. Would you like a callback now or to reply here with your preferred time?",
    notes: [
      {
        id: 'n-3',
        text: 'Sent friendly follow-up SMS. Awaiting customer reply on preferred time window.',
        createdAt: new Date(Date.now() - 1000 * 60 * 78).toISOString(),
        author: 'Dispatch',
      },
    ],
    activities: [
      {
        id: 'a-3',
        type: 'created',
        text: 'Missed call logged',
        timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
      },
      {
        id: 'a-3b',
        type: 'sms_approved',
        text: 'AI follow-up SMS approved & copied to send',
        timestamp: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
      },
    ],
  },
  {
    id: 'sample-4',
    customerName: 'David Kim',
    phone: '(555) 612-4899',
    problemDescription: 'Very low water pressure across master shower and upstairs faucets following municipal main line maintenance.',
    status: 'responded',
    isEmergency: false,
    isSample: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    lastContactAt: new Date(Date.now() - 1000 * 60 * 160).toISOString(),
    approvedSmsDraft:
      'Hi David, this is Rapid Flow Plumbing. Sorry we missed your call regarding the low water pressure! Could be sediment in the aerators or pressure regulator. Let us know when is convenient to discuss.',
    notes: [
      {
        id: 'n-4a',
        text: 'Customer texted back: "Thanks for the quick text! Can someone come out tomorrow morning between 9am-12pm?"',
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        author: 'Customer',
      },
      {
        id: 'n-4b',
        text: 'Checking technician route for Northside zip codes.',
        createdAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
        author: 'Dispatch',
      },
    ],
    activities: [
      {
        id: 'a-4a',
        type: 'created',
        text: 'Missed call logged',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      },
      {
        id: 'a-4b',
        type: 'status_change',
        text: 'Status updated to Responded (Customer replied)',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      },
    ],
  },
  {
    id: 'sample-5',
    customerName: 'Brenda Martinez',
    phone: '(555) 433-8710',
    problemDescription: 'Garbage disposal seized up, hums loudly when turned on, and drips dirty water under kitchen cabinet.',
    status: 'booked',
    isEmergency: false,
    isSample: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
    lastContactAt: new Date(Date.now() - 1000 * 60 * 340).toISOString(),
    approvedSmsDraft:
      'Hi Brenda, this is Rapid Flow Plumbing following up on your missed call. We would be happy to diagnose or install a replacement disposal unit for you. Reply here or call back when ready!',
    notes: [
      {
        id: 'n-5a',
        text: 'Customer called back after our SMS. Confirmed Badger 5 1/2 HP replacement appointment booked for tomorrow at 2:00 PM.',
        createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        author: 'Lead Plumber Dave',
      },
    ],
    activities: [
      {
        id: 'a-5a',
        type: 'created',
        text: 'Missed call logged',
        timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      },
      {
        id: 'a-5b',
        type: 'status_change',
        text: 'Status marked as Booked (Appointment set for tomorrow 2:00 PM)',
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      },
    ],
  },
];
