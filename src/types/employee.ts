export interface Employee {
  id: string;
  organizationId: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  departmentId: string;
  departmentName: string;
  designation: string;
  reportingManagerId?: string;
  reportingManagerName?: string;
  joiningDate: string;
  endDate?: string;
  birthDate: string;
  employmentType: 'full_time' | 'part_time' | 'contract' | 'intern';
  status: 'active' | 'probation' | 'notice_period' | 'terminated';
  workLocation: string;
  address?: string;
  salary: {
    basic: number;
    allowances: number;
    gross: number;
    currency: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}
