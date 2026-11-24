import { HRNotification } from '@/types/notification';

export const MOCK_NOTIFICATIONS: HRNotification[] = [
  // OSFORH notifications
  {
    id: 'notif-osf-bday-2days',
    organizationId: 'org-osforh',
    title: '🎂 2-Day Birthday Alert: Elena Rostova',
    message: 'Elena Rostova (Product & Design) turns a year older in 2 days (Nov 21). Time to plan her cake & team greeting!',
    type: 'celebration',
    createdAt: 'Just now',
    read: false,
    actionUrl: '/celebrations',
  },
  {
    id: 'notif-osf-1',
    organizationId: 'org-osforh',
    title: 'New Leave Request',
    message: 'Amira Nasser requested 3 days of Annual Leave (Dec 1 - Dec 3).',
    type: 'leave',
    createdAt: '15 mins ago',
    read: false,
    actionUrl: '/leave',
  },
  {
    id: 'notif-osf-2',
    organizationId: 'org-osforh',
    title: 'Expense Claim Pending Approval',
    message: 'Karim Fawzy submitted $450 client lunch and travel reimbursement.',
    type: 'expense',
    createdAt: '1 hour ago',
    read: true,
    actionUrl: '/expenses',
  },
  {
    id: 'notif-osf-4',
    organizationId: 'org-osforh',
    title: 'Compliance Deadline Approaching',
    message: 'Quarterly Corporate Tax & VAT filing window closes in 5 days.',
    type: 'compliance',
    createdAt: '5 hours ago',
    read: true,
    actionUrl: '/compliance',
  },
];
