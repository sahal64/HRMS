import { LeaveRequest, LeaveBalance, Holiday } from '@/types/leave';

export const MOCK_LEAVE_BALANCES: LeaveBalance[] = [
  { type: 'annual', label: 'Annual Leave', allocated: 22, used: 8, available: 14 },
  { type: 'sick', label: 'Sick Leave', allocated: 10, used: 2, available: 8 },
  { type: 'casual', label: 'Casual / Emergency', allocated: 5, used: 1, available: 4 },
  { type: 'maternity', label: 'Parental Leave', allocated: 60, used: 0, available: 60 },
];

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  // OSFORH
  {
    id: 'leave-osf-1',
    organizationId: 'org-osforh',
    employeeId: 'emp-osf-004',
    employeeName: 'Amira Nasser',
    employeeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Software Engineering',
    leaveType: 'annual',
    startDate: '2026-12-01',
    endDate: '2026-12-03',
    totalDays: 3,
    reason: 'Family trip & vacation',
    status: 'pending',
    appliedAt: '2026-11-18',
  },
  {
    id: 'leave-osf-2',
    organizationId: 'org-osforh',
    employeeId: 'emp-osf-003',
    employeeName: 'Zayd Kareem',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Product & Design',
    leaveType: 'casual',
    startDate: '2026-11-26',
    endDate: '2026-11-26',
    totalDays: 1,
    reason: 'Personal family emergency',
    status: 'approved',
    appliedAt: '2026-11-15',
  },

  // Acme
  {
    id: 'leave-acm-1',
    organizationId: 'org-acme',
    employeeId: 'emp-acm-002',
    employeeName: 'Chloe Chen',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Applied AI & ML',
    leaveType: 'maternity',
    startDate: '2026-12-15',
    endDate: '2027-02-15',
    totalDays: 60,
    reason: 'Maternity leave plan',
    status: 'pending',
    appliedAt: '2026-11-10',
  },

  // Nova
  {
    id: 'leave-nov-1',
    organizationId: 'org-nova',
    employeeId: 'emp-nov-002',
    employeeName: 'Fiona Gallagher',
    employeeAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    department: 'People & Operations',
    leaveType: 'sick',
    startDate: '2026-11-24',
    endDate: '2026-11-25',
    totalDays: 2,
    reason: 'Medical recovery',
    status: 'approved',
    appliedAt: '2026-11-17',
  },
];

export const MOCK_HOLIDAYS: Holiday[] = [
  // UAE Holidays for OSFORH
  {
    id: 'hol-1',
    organizationId: 'org-osforh',
    name: 'UAE Commemoration Day',
    date: '2026-12-01',
    dayOfWeek: 'Tuesday',
  },
  {
    id: 'hol-2',
    organizationId: 'org-osforh',
    name: 'UAE National Day',
    date: '2026-12-02',
    dayOfWeek: 'Wednesday',
  },
  {
    id: 'hol-3',
    organizationId: 'org-osforh',
    name: 'New Year Day',
    date: '2027-01-01',
    dayOfWeek: 'Friday',
  },

  // US Holidays for Acme
  {
    id: 'hol-acm-1',
    organizationId: 'org-acme',
    name: 'Thanksgiving Day',
    date: '2026-11-26',
    dayOfWeek: 'Thursday',
  },
  {
    id: 'hol-acm-2',
    organizationId: 'org-acme',
    name: 'Christmas Day',
    date: '2026-12-25',
    dayOfWeek: 'Friday',
  },

  // UK Holidays for Nova
  {
    id: 'hol-nov-1',
    organizationId: 'org-nova',
    name: 'Christmas Day',
    date: '2026-12-25',
    dayOfWeek: 'Friday',
  },
  {
    id: 'hol-nov-2',
    organizationId: 'org-nova',
    name: 'Boxing Day',
    date: '2026-12-28',
    dayOfWeek: 'Monday',
  },
];
