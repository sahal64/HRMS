export type UserRole =
  | 'super_admin'
  | 'org_admin'
  | 'hr_admin'
  | 'hr_staff'
  | 'manager'
  | 'finance'
  | 'recruiter'
  | 'employee';

export interface RoleConfig {
  id: UserRole;
  label: string;
  description: string;
  badgeColor: string;
  defaultRoute: string;
  allowedModules: string[];
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  super_admin: {
    id: 'super_admin',
    label: 'Platform Super Admin',
    description: 'Full cross-organization administrative control & platform governance',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    defaultRoute: '/admin',
    allowedModules: ['*'],
  },
  org_admin: {
    id: 'org_admin',
    label: 'Organization Admin',
    description: 'Tenant executive with enterprise configuration and high-level control',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    defaultRoute: '/dashboard',
    allowedModules: ['*'],
  },
  hr_admin: {
    id: 'hr_admin',
    label: 'HR Admin',
    description: 'Comprehensive HR operational management across all personnel modules',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    defaultRoute: '/dashboard',
    allowedModules: [
      'dashboard', 'employees', 'organization', 'manpower', 'recruitment', 'onboarding',
      'attendance', 'leave', 'payroll', 'compliance', 'expenses', 'projects',
      'performance', 'learning', 'engagement', 'celebrations', 'self-service',
      'documents', 'grievances', 'disciplinary', 'assets', 'exit-management',
      'reports', 'administration'
    ],
  },
  hr_staff: {
    id: 'hr_staff',
    label: 'HR Staff',
    description: 'Day-to-day HR operations, attendance, records and onboarding support',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    defaultRoute: '/dashboard',
    allowedModules: [
      'dashboard', 'employees', 'organization', 'recruitment', 'onboarding', 'attendance',
      'leave', 'learning', 'engagement', 'celebrations', 'self-service',
      'documents', 'assets', 'reports'
    ],
  },
  manager: {
    id: 'manager',
    label: 'Manager / Team Lead',
    description: 'Team supervisor with approval rights, task oversight and KPI reviews',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    defaultRoute: '/dashboard',
    allowedModules: [
      'dashboard', 'employees', 'attendance', 'leave', 'projects', 'performance',
      'learning', 'engagement', 'celebrations', 'self-service', 'expenses'
    ],
  },
  finance: {
    id: 'finance',
    label: 'Finance Specialist',
    description: 'Financial payroll review, expense reimbursement & statutory accounting',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    defaultRoute: '/payroll',
    allowedModules: [
      'dashboard', 'payroll', 'compliance', 'expenses', 'reports', 'self-service'
    ],
  },
  recruiter: {
    id: 'recruiter',
    label: 'Talent Acquisition / Recruiter',
    description: 'Candidate sourcing, job requisitions, pipelines & interview scheduling',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    defaultRoute: '/recruitment',
    allowedModules: [
      'dashboard', 'recruitment', 'onboarding', 'manpower', 'reports', 'self-service'
    ],
  },
  employee: {
    id: 'employee',
    label: 'Employee',
    description: 'Standard employee with self-service requests, attendance, leave and tasks',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
    defaultRoute: '/self-service',
    allowedModules: [
      'self-service', 'projects', 'learning', 'engagement', 'celebrations'
    ],
  },
};
