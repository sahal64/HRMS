export interface AttendanceRecord {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  workHours: string;
  status: 'present' | 'late' | 'half_day' | 'absent' | 'on_leave';
  notes?: string;
}
