export interface HRNotification {
  id: string;
  organizationId: string;
  title: string;
  message: string;
  type: 'leave' | 'expense' | 'recruitment' | 'compliance' | 'celebration' | 'system';
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}
