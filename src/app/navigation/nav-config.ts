import {
  LayoutDashboard,
  Building2,
  Users2,
  UserPlus,
  UserCheck,
  Clock,
  CalendarDays,
  Banknote,
  ShieldCheck,
  Receipt,
  Kanban,
  Award,
  GraduationCap,
  Megaphone,
  PartyPopper,
  UserSquare2,
  FileText,
  AlertOctagon,
  Scale,
  Laptop,
  LogOut,
  BarChart3,
  Settings2,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  moduleKey: string;
  badge?: string;
}

export interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

export const NAVIGATION_CONFIG: NavGroup[] = [
  {
    id: 'overview',
    title: 'Overview',
    items: [
      {
        id: 'dashboard',
        label: 'HR Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        moduleKey: 'dashboard',
      },
      {
        id: 'self-service',
        label: 'Self-Service (ESS)',
        href: '/self-service',
        icon: UserSquare2,
        moduleKey: 'self-service',
      },
    ],
  },
  {
    id: 'people',
    title: 'People Operations',
    items: [
      {
        id: 'employees',
        label: 'Employee Directory',
        href: '/employees',
        icon: Users2,
        moduleKey: 'employees',
      },
      {
        id: 'organization',
        label: 'Company & Org Setup',
        href: '/organization',
        icon: Building2,
        moduleKey: 'organization',
      },
      {
        id: 'recruitment',
        label: 'Recruitment & ATS',
        href: '/recruitment',
        icon: UserPlus,
        moduleKey: 'recruitment',
        badge: '3 Open',
      },
      {
        id: 'onboarding',
        label: 'Onboarding & Joining',
        href: '/onboarding',
        icon: UserCheck,
        moduleKey: 'onboarding',
      },
      {
        id: 'manpower',
        label: 'Manpower Planning',
        href: '/manpower',
        icon: Users2,
        moduleKey: 'manpower',
      },
      {
        id: 'exit-management',
        label: 'Exit & Settlement',
        href: '/exit-management',
        icon: LogOut,
        moduleKey: 'exit-management',
      },
    ],
  },
  {
    id: 'time',
    title: 'Time & Attendance',
    items: [
      {
        id: 'attendance',
        label: 'Attendance & Time',
        href: '/attendance',
        icon: Clock,
        moduleKey: 'attendance',
      },
      {
        id: 'leave',
        label: 'Leave & Holidays',
        href: '/leave',
        icon: CalendarDays,
        moduleKey: 'leave',
        badge: 'New',
      },
    ],
  },
  {
    id: 'finance',
    title: 'Finance & Operations',
    items: [
      {
        id: 'payroll',
        label: 'Payroll & Compensation',
        href: '/payroll',
        icon: Banknote,
        moduleKey: 'payroll',
      },
      {
        id: 'expenses',
        label: 'Expenses & Advances',
        href: '/expenses',
        icon: Receipt,
        moduleKey: 'expenses',
      },
      {
        id: 'compliance',
        label: 'Statutory Compliance',
        href: '/compliance',
        icon: ShieldCheck,
        moduleKey: 'compliance',
      },
      {
        id: 'assets',
        label: 'Asset & IT Handover',
        href: '/assets',
        icon: Laptop,
        moduleKey: 'assets',
      },
    ],
  },
  {
    id: 'performance',
    title: 'Workforce & Growth',
    items: [
      {
        id: 'projects',
        label: 'Projects & Tasks',
        href: '/projects',
        icon: Kanban,
        moduleKey: 'projects',
      },
      {
        id: 'performance-kpi',
        label: 'KPI & Performance',
        href: '/performance',
        icon: Award,
        moduleKey: 'performance',
      },
      {
        id: 'learning',
        label: 'Learning & Dev (L&D)',
        href: '/learning',
        icon: GraduationCap,
        moduleKey: 'learning',
      },
    ],
  },
  {
    id: 'experience',
    title: 'Employee Experience',
    items: [
      {
        id: 'engagement',
        label: 'Engagement & Comms',
        href: '/engagement',
        icon: Megaphone,
        moduleKey: 'engagement',
      },
      {
        id: 'celebrations',
        label: 'Birthdays & Milestones',
        href: '/celebrations',
        icon: PartyPopper,
        moduleKey: 'celebrations',
      },
      {
        id: 'documents',
        label: 'HR Documents & Letters',
        href: '/documents',
        icon: FileText,
        moduleKey: 'documents',
      },
      {
        id: 'grievances',
        label: 'Grievance & Relations',
        href: '/grievances',
        icon: AlertOctagon,
        moduleKey: 'grievances',
      },
      {
        id: 'disciplinary',
        label: 'Disciplinary & Policies',
        href: '/disciplinary',
        icon: Scale,
        moduleKey: 'disciplinary',
      },
    ],
  },
  {
    id: 'reports-admin',
    title: 'Intelligence & Admin',
    items: [
      {
        id: 'reports',
        label: 'HR Reports & Analytics',
        href: '/reports',
        icon: BarChart3,
        moduleKey: 'reports',
      },
      {
        id: 'administration',
        label: 'Admin, Security & Audit',
        href: '/admin',
        icon: Settings2,
        moduleKey: 'administration',
      },
    ],
  },
];
