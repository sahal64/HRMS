import { MOCK_EMPLOYEES } from '@/mock-data/employees';
import { MOCK_ORGANIZATIONS } from '@/mock-data/organizations';
import { apiFetch } from './api';

export interface DashboardMetrics {
  totalEmployees: number;
  activeEmployees: number;
  presentToday: number;
  onLeaveToday: number;
  openRequisitions: number;
  pendingApprovalsCount: number;
  retentionRate: string;
  monthlyPayrollEstimate: string;
}

export interface PendingTask {
  id: string;
  title: string;
  type: 'leave' | 'expense' | 'offer' | 'onboarding' | 'appraisal';
  requesterName: string;
  requesterAvatar: string;
  requestedDate: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface UpcomingEvent {
  id: string;
  type: 'birthday' | 'anniversary' | 'holiday';
  title: string;
  personName?: string;
  avatar?: string;
  date: string;
  daysRemaining: number;
}

export interface WorkforceTrendPoint {
  month: string;
  headcount: number;
  hired: number;
  departed: number;
}

export interface IDashboardService {
  getMetrics(organizationId: string): Promise<DashboardMetrics>;
  getPendingTasks(organizationId: string): Promise<PendingTask[]>;
  getUpcomingEvents(organizationId: string): Promise<UpcomingEvent[]>;
  getWorkforceTrends(organizationId: string): Promise<WorkforceTrendPoint[]>;
}

class BackendDashboardService implements IDashboardService {
  async getMetrics(organizationId: string): Promise<DashboardMetrics> {
    try {
      // Connect to Real PHP + MySQL Backend
      const res = await apiFetch<{ success: boolean; data: any }>(
        `/dashboard/metrics.php?organizationId=${organizationId}`
      );
      if (res && res.success && res.data) {
        const d = res.data;
        return {
          totalEmployees: d.totalEmployees,
          activeEmployees: d.totalEmployees,
          presentToday: d.presentToday,
          onLeaveToday: Math.max(0, d.totalEmployees - d.presentToday),
          openRequisitions: 8,
          pendingApprovalsCount: d.pendingLeaves || 3,
          retentionRate: '96.4%',
          monthlyPayrollEstimate: '₹14,20,000',
        };
      }
    } catch (err) {
      console.warn('Backend metrics API unreachable, falling back to local store', err);
    }

    // Fallback if backend offline
    const org = MOCK_ORGANIZATIONS.find((o) => o.id === organizationId) || MOCK_ORGANIZATIONS[0];
    const total = org.employeeCount || 142;
    const presentToday = Math.round(total * 0.95);

    return {
      totalEmployees: total,
      activeEmployees: total,
      presentToday,
      onLeaveToday: total - presentToday,
      openRequisitions: 8,
      pendingApprovalsCount: 3,
      retentionRate: '96.4%',
      monthlyPayrollEstimate: '₹14,20,000',
    };
  }

  async getPendingTasks(organizationId: string): Promise<PendingTask[]> {
    return Promise.resolve([
      {
        id: 'task-1',
        title: 'Annual Leave Request (3 Days)',
        type: 'leave',
        requesterName: 'Amira Nasser',
        requesterAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        requestedDate: 'Today, 09:30 AM',
        urgency: 'high',
      },
      {
        id: 'task-2',
        title: 'Client Lunch Reimbursement (₹4,500)',
        type: 'expense',
        requesterName: 'Karim Fawzy',
        requesterAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        requestedDate: 'Yesterday',
        urgency: 'medium',
      },
    ]);
  }

  async getUpcomingEvents(organizationId: string): Promise<UpcomingEvent[]> {
    return Promise.resolve([
      {
        id: 'event-1',
        type: 'birthday',
        title: 'Birthday Celebration (In 2 Days!)',
        personName: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        date: 'Nov 21',
        daysRemaining: 2,
      },
      {
        id: 'event-2',
        type: 'anniversary',
        title: '3-Year Work Anniversary',
        personName: 'Tariq Mansour',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        date: 'Nov 25',
        daysRemaining: 5,
      },
    ]);
  }

  async getWorkforceTrends(organizationId: string): Promise<WorkforceTrendPoint[]> {
    return Promise.resolve([
      { month: 'Jan', headcount: 120, hired: 4, departed: 1 },
      { month: 'Feb', headcount: 125, hired: 6, departed: 1 },
      { month: 'Mar', headcount: 129, hired: 5, departed: 1 },
      { month: 'Apr', headcount: 134, hired: 7, departed: 2 },
      { month: 'May', headcount: 138, hired: 6, departed: 2 },
      { month: 'Jun', headcount: 142, hired: 5, departed: 1 },
    ]);
  }
}

export const dashboardService: IDashboardService = new BackendDashboardService();
