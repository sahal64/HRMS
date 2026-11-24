export type LeaveType = 'annual' | 'sick' | 'casual' | 'maternity' | 'paternity' | 'unpaid';

export interface LeaveRequest {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

export interface LeaveBalance {
  type: LeaveType;
  label: string;
  allocated: number;
  used: number;
  available: number;
}

export interface Holiday {
  id: string;
  organizationId: string;
  name: string;
  date: string;
  dayOfWeek: string;
  isOptional?: boolean;
}
