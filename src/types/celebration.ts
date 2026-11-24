export interface CelebrationEvent {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  type: 'birthday' | 'anniversary';
  eventDate: string; // MM-DD format e.g. "11-21"
  displayDate: string; // e.g. "Nov 21"
  daysRemaining: number; // 0 = today, 1 = tomorrow, 2 = in 2 days, etc.
  yearsMilestone?: number; // for anniversaries (e.g. 1, 3, 5 years)
  wishesSent?: boolean;
}

export interface CelebrationSettings {
  reminderDaysInAdvance: number; // default: 2
  notifyOnBell: boolean;
  sendAutomatedSlack: boolean;
  sendCompanyEmail: boolean;
}
