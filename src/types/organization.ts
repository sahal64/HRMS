export interface Organization {
  id: string;
  name: string;
  code: string;
  logo?: string;
  industry: string;
  currency: string;
  timezone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  contactEmail: string;
  contactPhone: string;
  website: string;
  taxId: string;
  status: 'active' | 'suspended' | 'trial';
  employeeCount: number;
  settings: OrganizationSettings;
}

export interface OrganizationSettings {
  fiscalYearStartMonth: number; // 1-12
  workWeek: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  dailyWorkHours: number;
  defaultProbationMonths: number;
  enableOvertime: boolean;
  enableGeofencing: boolean;
  currencySymbol: string;
  themeColor?: string;
}

export interface Department {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  headOfDepartmentId?: string;
  parentDepartmentId?: string;
  budget?: number;
  employeeCount: number;
  description?: string;
}

export interface Team {
  id: string;
  organizationId: string;
  departmentId: string;
  name: string;
  teamLeadId?: string;
  memberCount: number;
}

export interface Location {
  id: string;
  organizationId: string;
  name: string;
  type: 'headquarters' | 'branch' | 'remote_hub';
  address: string;
  city: string;
  country: string;
  isHeadquarters: boolean;
  employeeCount: number;
}
