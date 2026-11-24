export type KpiStatus = 'excellent' | 'good' | 'avg' | 'bad' | 'na';

export interface MetricRow {
  name: string;
  weeklyTarget: number | null;
  monthlyTarget: number | null;
  weeks: (number | null)[]; // W1 to W5
  monthTotal: number | null;
  perfPercent: number | null;
  status: KpiStatus | null;
  kind?: 'total' | 'sub';
}

export interface MetricBlock {
  title: string;
  subtitle?: string;
  rows: MetricRow[];
}

export interface DepartmentKpiData {
  id: string;
  name: string;
  iconName?: string;
  targetDescription: string;
  sourceNote?: string;
  overallScore: number;
  overallStatus: KpiStatus;
  blocks: MetricBlock[];
}

export interface BrandOutput {
  brand: string;
  posters: number;
  videos: number;
}

export interface SocialMediaBrandMetric {
  brand: string;
  periods: (number | null)[]; // 1-7, 8-14, 15-21, 22-31
}

export interface SocialMediaMonthlySummary {
  brand: string;
  posters: string;
  reels: string;
  reach: string;
  profileActivity: string;
}

export interface WebDeveloperSummary {
  name: string;
  role: string;
  daysReported: number;
  totalWorkingDays: number;
  kpiPercent: number;
  septemberPercent?: number;
  summaryText: string;
}

export interface WebProjectTracker {
  sn: number;
  project: string;
  assignedTo: string;
  startDate: string;
  status: 'In progress' | 'Completed' | 'Demo done' | 'Updated' | 'No update';
  remarks: string;
}

export interface DepartmentTargetRule {
  id: string;
  departmentId: string;
  departmentName: string;
  deliverableName: string;
  category: string;
  weeklyTarget: string | number;
  monthlyTarget: string | number;
  unit: string;
  assignedTeam: string;
  targetRuleNote: string;
  benchmarkGood: string;
  benchmarkAttention: string;
}
