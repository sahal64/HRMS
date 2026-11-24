import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Award,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Palette,
  Video,
  Megaphone,
  Share2,
  Code2,
  UserCheck,
  BadgePercent,
  ShoppingCart,
  Calendar,
  ChevronRight,
  Filter,
  Sparkles,
  ExternalLink,
  FileSpreadsheet,
  Layers,
  Download,
  Check,
  Laptop,
  Edit3,
  Plus,
  Save,
  X,
  RefreshCw,
  Target,
  Search,
} from 'lucide-react';
import {
  DESIGN_KPI,
  VIDEO_KPI,
  MARKETING_KPI,
  BRAND_COLLATERAL_OUTPUT,
  SOCIAL_PERIODS,
  SOCIAL_BRAND_METRICS,
  SOCIAL_PERIOD_TOTALS,
  SOCIAL_MONTHLY_SUMMARIES,
  WEB_DEVELOPERS_SUMMARY,
  WEB_WEEKS_ATTENDANCE,
  WEB_PROJECTS_TRACKER,
  ADMIN_KPI,
  SALES_KPI,
  ECOM_KPI,
  ALL_DEPARTMENTS_OVERVIEW,
  DEPARTMENT_TARGET_RULES,
} from '../data/kpiData';
import {
  KpiStatus,
  MetricBlock,
  MetricRow,
  WebProjectTracker,
  DepartmentKpiData,
  DepartmentTargetRule,
} from '../types/kpi';

// Status styling helpers
const getStatusBadge = (status: KpiStatus | null) => {
  switch (status) {
    case 'excellent':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="h-3 w-3" /> Excellent
        </span>
      );
    case 'good':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <Check className="h-3 w-3" /> Good
        </span>
      );
    case 'avg':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="h-3 w-3" /> Average
        </span>
      );
    case 'bad':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
          <AlertCircle className="h-3 w-3" /> Needs Improvement
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-500 border border-stone-200">
          —
        </span>
      );
  }
};

const getProgressBarColor = (status: KpiStatus | null) => {
  switch (status) {
    case 'excellent':
    case 'good':
      return 'bg-emerald-600';
    case 'avg':
      return 'bg-amber-500';
    case 'bad':
      return 'bg-rose-500';
    default:
      return 'bg-stone-300';
  }
};

const getHeatmapColor = (val: number | null) => {
  if (val === null) return 'text-stone-400 bg-transparent';
  if (val >= 90) return 'bg-emerald-100/70 text-emerald-900 font-semibold';
  if (val >= 75) return 'bg-emerald-50 text-emerald-800 font-medium';
  if (val >= 50) return 'bg-amber-100/70 text-amber-900 font-medium';
  return 'bg-rose-100/70 text-rose-900 font-medium';
};

const getProjectStatusChip = (status: string) => {
  switch (status) {
    case 'Completed':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
          Completed
        </span>
      );
    case 'In progress':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
          In progress
        </span>
      );
    case 'Demo done':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-purple-50 text-purple-800 border border-purple-200">
          Demo done
        </span>
      );
    case 'Updated':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
          Updated
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-stone-100 text-stone-600 border border-stone-200">
          {status}
        </span>
      );
  }
};

const calculateKpiStatus = (pct: number): KpiStatus => {
  if (pct >= 90) return 'excellent';
  if (pct >= 67) return 'good';
  if (pct >= 50) return 'avg';
  return 'bad';
};

export const PerformancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedMonth, setSelectedMonth] = useState<string>('october-2026');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reactive State for KPI Datasets (enables live editing)
  const [designKpi, setDesignKpi] = useState<DepartmentKpiData>(DESIGN_KPI);
  const [videoKpi, setVideoKpi] = useState<DepartmentKpiData>(VIDEO_KPI);
  const [marketingKpi, setMarketingKpi] = useState<DepartmentKpiData>(MARKETING_KPI);
  const [adminKpi, setAdminKpi] = useState<DepartmentKpiData>(ADMIN_KPI);
  const [salesKpi, setSalesKpi] = useState<DepartmentKpiData>(SALES_KPI);
  const [ecomKpi, setEcomKpi] = useState<DepartmentKpiData>(ECOM_KPI);
  const [webProjects, setWebProjects] = useState<WebProjectTracker[]>(WEB_PROJECTS_TRACKER);

  // FEATURE A: Project Editing Modal State
  const [editingProject, setEditingProject] = useState<WebProjectTracker | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [projectFormData, setProjectFormData] = useState<WebProjectTracker>({
    sn: 13,
    project: '',
    assignedTo: 'Sahal',
    startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
    status: 'In progress',
    remarks: '',
  });

  // FEATURE B: KPI Metric Slide-Over Drawer State
  const [kpiDrawerOpen, setKpiDrawerOpen] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('design');
  const [selectedBlockIdx, setSelectedBlockIdx] = useState<number>(0);
  const [selectedRowIdx, setSelectedRowIdx] = useState<number>(0);
  const [metricFormData, setMetricFormData] = useState({
    name: '',
    weeklyTarget: 25,
    monthlyTarget: 100,
    w1: 0,
    w2: 0,
    w3: 0,
    w4: 0,
    w5: 0,
  });

  // FEATURE C: Department Targets Master State
  const [targetRules, setTargetRules] = useState<DepartmentTargetRule[]>(DEPARTMENT_TARGET_RULES);
  const [targetSearch, setTargetSearch] = useState('');
  const [selectedTargetCategory, setSelectedTargetCategory] = useState('all');
  const [editingTarget, setEditingTarget] = useState<DepartmentTargetRule | null>(null);
  const [isNewTarget, setIsNewTarget] = useState(false);
  const [targetFormData, setTargetFormData] = useState<DepartmentTargetRule>({
    id: 'tgt-custom-1',
    departmentId: 'design',
    departmentName: 'Design Team',
    deliverableName: '',
    category: 'Creative & Media',
    weeklyTarget: '20 per person',
    monthlyTarget: '80 total',
    unit: 'assets',
    assignedTeam: 'Assigned Staff',
    targetRuleNote: '',
    benchmarkGood: '67% and above',
    benchmarkAttention: 'Below 50%',
  });

  const handleOpenEditTarget = (t: DepartmentTargetRule) => {
    setEditingTarget(t);
    setIsNewTarget(false);
    setTargetFormData({ ...t });
  };

  const handleOpenAddTarget = () => {
    setIsNewTarget(true);
    const newTgt: DepartmentTargetRule = {
      id: `tgt-custom-${Date.now()}`,
      departmentId: 'design',
      departmentName: 'Design Team',
      deliverableName: '',
      category: 'Creative & Media',
      weeklyTarget: '20 deliverables',
      monthlyTarget: '80 deliverables',
      unit: 'items',
      assignedTeam: 'Team Members',
      targetRuleNote: '',
      benchmarkGood: '67% and above',
      benchmarkAttention: 'Below 50%',
    };
    setEditingTarget(newTgt);
    setTargetFormData(newTgt);
  };

  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetFormData.deliverableName.trim()) {
      alert('Please enter what the department must deliver.');
      return;
    }

    if (isNewTarget) {
      setTargetRules([...targetRules, targetFormData]);
      showToast(`Added new company target: "${targetFormData.deliverableName}"!`);
    } else {
      setTargetRules(
        targetRules.map((t) => (t.id === targetFormData.id ? { ...targetFormData } : t))
      );
      showToast(`Updated target: "${targetFormData.deliverableName}"!`);
    }
    setEditingTarget(null);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const tabs = [
    { id: 'overview', label: 'All Departments Overview', icon: Layers },
    { id: 'targets', label: 'Department Targets Master', icon: Target },
    { id: 'design', label: 'Design Team', icon: Palette },
    { id: 'video', label: 'Video Team', icon: Video },
    { id: 'marketing', label: 'Marketing Team', icon: Megaphone },
    { id: 'social', label: 'Social Media Insight', icon: Share2 },
    { id: 'web', label: 'Web Developers', icon: Code2 },
    { id: 'admin', label: 'Recruitment & Admin', icon: UserCheck },
    { id: 'sales', label: 'Sales Team', icon: BadgePercent },
    { id: 'ecom', label: 'E-Commerce', icon: ShoppingCart },
  ];

  // Map department ID to its state and setter
  const getDeptStateAndSetter = (deptId: string): [DepartmentKpiData, React.Dispatch<React.SetStateAction<DepartmentKpiData>>] => {
    switch (deptId) {
      case 'video':
        return [videoKpi, setVideoKpi];
      case 'marketing':
        return [marketingKpi, setMarketingKpi];
      case 'admin':
        return [adminKpi, setAdminKpi];
      case 'sales':
        return [salesKpi, setSalesKpi];
      case 'ecom':
        return [ecomKpi, setEcomKpi];
      case 'design':
      default:
        return [designKpi, setDesignKpi];
    }
  };

  // Open KPI Drawer pre-filled with selected person & metric
  const openKpiDrawer = (deptId?: string, blockIdx = 0, rowIdx = 0) => {
    const targetDeptId = deptId || (activeTab !== 'overview' && activeTab !== 'social' && activeTab !== 'web' ? activeTab : 'design');
    setSelectedDeptId(targetDeptId);
    setSelectedBlockIdx(blockIdx);
    setSelectedRowIdx(rowIdx);

    const [dept] = getDeptStateAndSetter(targetDeptId);
    const block = dept.blocks[blockIdx] || dept.blocks[0];
    const row = block?.rows[rowIdx] || block?.rows[0];

    if (row) {
      setMetricFormData({
        name: row.name,
        weeklyTarget: row.weeklyTarget || 0,
        monthlyTarget: row.monthlyTarget || 0,
        w1: Number(row.weeks[0]) || 0,
        w2: Number(row.weeks[1]) || 0,
        w3: Number(row.weeks[2]) || 0,
        w4: Number(row.weeks[3]) || 0,
        w5: Number(row.weeks[4]) || 0,
      });
    }

    setKpiDrawerOpen(true);
  };

  // Handle department change in drawer
  const handleDrawerDeptChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    setSelectedBlockIdx(0);
    setSelectedRowIdx(0);

    const [dept] = getDeptStateAndSetter(deptId);
    const block = dept.blocks[0];
    const row = block?.rows[0];

    if (row) {
      setMetricFormData({
        name: row.name,
        weeklyTarget: row.weeklyTarget || 0,
        monthlyTarget: row.monthlyTarget || 0,
        w1: Number(row.weeks[0]) || 0,
        w2: Number(row.weeks[1]) || 0,
        w3: Number(row.weeks[2]) || 0,
        w4: Number(row.weeks[3]) || 0,
        w5: Number(row.weeks[4]) || 0,
      });
    }
  };

  // Handle contributor/block change in drawer
  const handleDrawerBlockChange = (blockIdx: number) => {
    setSelectedBlockIdx(blockIdx);
    setSelectedRowIdx(0);

    const [dept] = getDeptStateAndSetter(selectedDeptId);
    const block = dept.blocks[blockIdx];
    const row = block?.rows[0];

    if (row) {
      setMetricFormData({
        name: row.name,
        weeklyTarget: row.weeklyTarget || 0,
        monthlyTarget: row.monthlyTarget || 0,
        w1: Number(row.weeks[0]) || 0,
        w2: Number(row.weeks[1]) || 0,
        w3: Number(row.weeks[2]) || 0,
        w4: Number(row.weeks[3]) || 0,
        w5: Number(row.weeks[4]) || 0,
      });
    }
  };

  // Handle metric row change in drawer
  const handleDrawerRowChange = (rowIdx: number) => {
    setSelectedRowIdx(rowIdx);
    const [dept] = getDeptStateAndSetter(selectedDeptId);
    const block = dept.blocks[selectedBlockIdx];
    const row = block?.rows[rowIdx];

    if (row) {
      setMetricFormData({
        name: row.name,
        weeklyTarget: row.weeklyTarget || 0,
        monthlyTarget: row.monthlyTarget || 0,
        w1: Number(row.weeks[0]) || 0,
        w2: Number(row.weeks[1]) || 0,
        w3: Number(row.weeks[2]) || 0,
        w4: Number(row.weeks[3]) || 0,
        w5: Number(row.weeks[4]) || 0,
      });
    }
  };

  // Save updated KPI numbers
  const handleSaveKpiMetric = (e: React.FormEvent) => {
    e.preventDefault();
    const [dept, setDept] = getDeptStateAndSetter(selectedDeptId);

    const totalActual =
      Number(metricFormData.w1) +
      Number(metricFormData.w2) +
      Number(metricFormData.w3) +
      Number(metricFormData.w4) +
      Number(metricFormData.w5);

    const perfPercent = metricFormData.monthlyTarget > 0
      ? Number(((totalActual / metricFormData.monthlyTarget) * 100).toFixed(1))
      : 0;

    const newStatus = calculateKpiStatus(perfPercent);

    // Create updated department copy
    const updatedBlocks = dept.blocks.map((block, bIdx) => {
      if (bIdx !== selectedBlockIdx) return block;

      const updatedRows = block.rows.map((row, rIdx) => {
        if (rIdx !== selectedRowIdx) return row;
        return {
          ...row,
          name: metricFormData.name || row.name,
          weeklyTarget: Number(metricFormData.weeklyTarget),
          monthlyTarget: Number(metricFormData.monthlyTarget),
          weeks: [
            Number(metricFormData.w1),
            Number(metricFormData.w2),
            Number(metricFormData.w3),
            Number(metricFormData.w4),
            Number(metricFormData.w5),
          ],
          monthTotal: totalActual,
          perfPercent,
          status: newStatus,
        };
      });

      // Recalculate block total row if present
      const nonTotalRows = updatedRows.filter((r) => r.kind !== 'total');
      const totalRowIdx = updatedRows.findIndex((r) => r.kind === 'total');

      if (totalRowIdx !== -1) {
        const sumActual = nonTotalRows.reduce((acc, r) => acc + (r.monthTotal || 0), 0);
        const sumTarget = updatedRows[totalRowIdx].monthlyTarget || nonTotalRows.reduce((acc, r) => acc + (r.monthlyTarget || 0), 0);
        const totalPerf = sumTarget > 0 ? Number(((sumActual / sumTarget) * 100).toFixed(1)) : 0;

        updatedRows[totalRowIdx] = {
          ...updatedRows[totalRowIdx],
          monthTotal: sumActual,
          perfPercent: totalPerf,
          status: calculateKpiStatus(totalPerf),
        };
      }

      return {
        ...block,
        rows: updatedRows,
      };
    });

    setDept({
      ...dept,
      blocks: updatedBlocks,
    });

    setKpiDrawerOpen(false);
    showToast(`Saved & recalculated ${metricFormData.name} (${perfPercent}%) for ${dept.name}!`);
  };

  // FEATURE A: Open Project Edit modal
  const handleOpenEditProject = (p: WebProjectTracker) => {
    setEditingProject(p);
    setIsNewProject(false);
    setProjectFormData({ ...p });
  };

  const handleOpenAddProject = () => {
    setIsNewProject(true);
    const nextSn = webProjects.length > 0 ? Math.max(...webProjects.map((p) => p.sn)) + 1 : 1;
    const newProj: WebProjectTracker = {
      sn: nextSn,
      project: '',
      assignedTo: 'Sahal',
      startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      status: 'In progress',
      remarks: '',
    };
    setEditingProject(newProj);
    setProjectFormData(newProj);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectFormData.project.trim()) {
      alert('Please enter a project name.');
      return;
    }

    if (isNewProject) {
      setWebProjects([...webProjects, projectFormData]);
      showToast(`Added new software project: "${projectFormData.project}"!`);
    } else {
      setWebProjects(
        webProjects.map((p) => (p.sn === projectFormData.sn ? { ...projectFormData } : p))
      );
      showToast(`Updated project: "${projectFormData.project}" to ${projectFormData.status}!`);
    }

    setEditingProject(null);
  };

  // Helper to render standard metric block table with Edit trigger
  const renderMetricBlockTable = (block: MetricBlock, deptId: string, bIdx: number) => (
    <div key={block.title} className="rounded-xl border border-[#e6e3da] bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="px-4 py-3 bg-[#faf9f5] border-b border-[#f0ede6] flex items-center justify-between">
        <div>
          <h4 className="font-bold text-xs sm:text-sm text-stone-900">{block.title}</h4>
          {block.subtitle && <p className="text-[11px] text-stone-500">{block.subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openKpiDrawer(deptId, bIdx, 0)}
            className="h-7 text-xs px-2.5 flex items-center gap-1 hover:border-stone-400"
          >
            <Edit3 className="h-3 w-3 text-stone-500" />
            <span>Update Numbers</span>
          </Button>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#e6e3da] text-stone-600">
            Monthly Target
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-stone-800">
          <thead className="bg-[#fcfbf9] text-[11px] font-semibold text-stone-500 border-b border-[#f0ede6]">
            <tr>
              <th className="px-4 py-2 font-medium">KPI Metric</th>
              <th className="px-3 py-2 text-right font-medium">Weekly Target</th>
              <th className="px-3 py-2 text-right font-medium">Monthly Target</th>
              <th className="px-2.5 py-2 text-right font-medium">W1</th>
              <th className="px-2.5 py-2 text-right font-medium">W2</th>
              <th className="px-2.5 py-2 text-right font-medium">W3</th>
              <th className="px-2.5 py-2 text-right font-medium">W4</th>
              <th className="px-2.5 py-2 text-right font-medium">W5</th>
              <th className="px-3 py-2 text-right font-semibold text-stone-900">Month Total</th>
              <th className="px-3 py-2 text-right font-medium">Perf %</th>
              <th className="px-4 py-2 text-right font-medium">Result</th>
              <th className="px-3 py-2 text-right font-medium w-16">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f4f1ea]">
            {block.rows.map((row: MetricRow, rIdx: number) => {
              const isTotal = row.kind === 'total';
              const isSub = row.kind === 'sub';

              return (
                <tr
                  key={rIdx}
                  className={`transition-colors ${
                    isTotal
                      ? 'bg-[#faf9f5] font-bold text-stone-900 border-t-2 border-[#e6e3da]'
                      : 'hover:bg-stone-50/50'
                  }`}
                >
                  <td className={`px-4 py-2.5 ${isSub ? 'pl-8 text-stone-600' : 'font-medium'}`}>
                    {row.name}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-stone-600">
                    {row.weeklyTarget !== null ? row.weeklyTarget : '—'}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-stone-600">
                    {row.monthlyTarget !== null ? row.monthlyTarget : '—'}
                  </td>
                  {row.weeks.map((w, wIdx) => (
                    <td key={wIdx} className="px-2.5 py-2.5 text-right font-mono text-stone-700">
                      {w !== null ? w : '—'}
                    </td>
                  ))}
                  <td className="px-3 py-2.5 text-right font-mono font-bold text-stone-900">
                    {row.monthTotal !== null ? row.monthTotal : '—'}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono">
                    {row.perfPercent !== null ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="font-semibold text-stone-900">{row.perfPercent}%</span>
                        <div className="w-10 h-1.5 rounded-full bg-stone-100 overflow-hidden">
                          <div
                            className={`h-full ${getProgressBarColor(row.status)}`}
                            style={{ width: `${Math.min(100, Math.max(0, row.perfPercent))}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">{getStatusBadge(row.status)}</td>
                  <td className="px-3 py-2.5 text-right">
                    {!isTotal && (
                      <button
                        type="button"
                        onClick={() => openKpiDrawer(deptId, bIdx, rIdx)}
                        className="text-stone-400 hover:text-stone-800 p-1 rounded hover:bg-stone-100"
                        title="Edit numbers"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Live overview score calculation reflecting user edits
  const currentDeptOverview = [
    {
      id: 'design',
      name: 'Design Team',
      teamSize: '3 designers',
      metrics: [
        { label: 'Umaibanu (Lead)', score: designKpi.blocks[0]?.rows.find(r => r.kind === 'total')?.perfPercent || 80, status: designKpi.blocks[0]?.rows.find(r => r.kind === 'total')?.status || 'good' },
        { label: 'Gokul', score: designKpi.blocks[1]?.rows.find(r => r.kind === 'total')?.perfPercent || 3, status: designKpi.blocks[1]?.rows.find(r => r.kind === 'total')?.status || 'bad' },
        { label: 'Third Designer', score: designKpi.blocks[2]?.rows.find(r => r.kind === 'total')?.perfPercent || 0, status: designKpi.blocks[2]?.rows.find(r => r.kind === 'total')?.status || 'bad' },
      ],
    },
    {
      id: 'video',
      name: 'Video Team',
      teamSize: '1 creator',
      metrics: [{ label: 'Afsal (Total Assets)', score: videoKpi.blocks[0]?.rows.find(r => r.kind === 'total')?.perfPercent || 126, status: videoKpi.blocks[0]?.rows.find(r => r.kind === 'total')?.status || 'excellent' }],
    },
    {
      id: 'marketing',
      name: 'Marketing Team',
      teamSize: 'Arshad & Thufail',
      metrics: [
        { label: 'Team Combined Leads', score: marketingKpi.blocks[0]?.rows.find(r => r.kind === 'total')?.perfPercent || 5.8, status: marketingKpi.blocks[0]?.rows.find(r => r.kind === 'total')?.status || 'bad' },
        { label: 'Arshad Brand Leads', score: marketingKpi.blocks[1]?.rows.find(r => r.kind === 'total')?.perfPercent || 4.2, status: marketingKpi.blocks[1]?.rows.find(r => r.kind === 'total')?.status || 'bad' },
        { label: 'Thufail Brand Leads', score: marketingKpi.blocks[2]?.rows.find(r => r.kind === 'total')?.perfPercent || 2.1, status: marketingKpi.blocks[2]?.rows.find(r => r.kind === 'total')?.status || 'bad' },
      ],
    },
    {
      id: 'social',
      name: 'Social Media Insight',
      teamSize: '9 sister brands',
      metrics: [{ label: 'Oct Period Average', score: 68.4, status: 'avg' as KpiStatus }],
    },
    {
      id: 'web',
      name: 'Web Developers',
      teamSize: '3 developers',
      metrics: [
        { label: 'Shabeeb (Lead)', score: 44, status: 'bad' as KpiStatus },
        { label: 'Fameesha', score: 48, status: 'bad' as KpiStatus },
        { label: 'Sahal (Joined Oct 13)', score: 65, status: 'avg' as KpiStatus },
      ],
    },
    {
      id: 'admin',
      name: 'Admin & Recruitment',
      teamSize: 'Salma (Sevenstar)',
      metrics: [{ label: 'Recruitment Funnel', score: adminKpi.blocks[0]?.rows.find(r => r.kind === 'total')?.perfPercent || 21.8, status: adminKpi.blocks[0]?.rows.find(r => r.kind === 'total')?.status || 'bad' }],
    },
    {
      id: 'sales',
      name: 'Sales Team',
      teamSize: 'Education & Software',
      metrics: [
        { label: 'Learning Hub Enrollment', score: salesKpi.blocks[0]?.rows.find(r => r.kind === 'total')?.perfPercent || 102, status: salesKpi.blocks[0]?.rows.find(r => r.kind === 'total')?.status || 'excellent' },
        { label: 'Enterprise Software', score: salesKpi.blocks[1]?.rows.find(r => r.kind === 'total')?.perfPercent || 0, status: salesKpi.blocks[1]?.rows.find(r => r.kind === 'total')?.status || 'bad' },
      ],
    },
    {
      id: 'ecom',
      name: 'E-Commerce Operations',
      teamSize: 'Fadi',
      metrics: [{ label: 'Store Catalog & Media', score: ecomKpi.blocks[0]?.rows.find(r => r.kind === 'total')?.perfPercent || 58.5, status: ecomKpi.blocks[0]?.rows.find(r => r.kind === 'total')?.status || 'avg' }],
    },
  ];

  return (
    <div className="space-y-4 pb-12">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-900 shadow-lg flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="All Departments KPI Dashboard"
        description="Monthly KPI scorecard workbook, targets, deliverables, and team performance tracking."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'KPI & Performance' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => openKpiDrawer()}
              className="h-8 text-xs bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1.5 shadow-2xs"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Update KPI Numbers</span>
            </Button>
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="h-8 pl-3 pr-8 rounded-lg border border-[#e6e3da] bg-white text-xs font-medium text-stone-800 outline-none shadow-2xs cursor-pointer"
              >
                <option value="october-2026">October 2026 (Workbook Complete)</option>
                <option value="november-2026">November 2026 (Live Cycle)</option>
                <option value="september-2026">September 2026 (Archived)</option>
              </select>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs flex items-center gap-1.5"
              onClick={() => alert('Exporting Department KPI Workbook to Excel / CSV format...')}
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>Export Sheet</span>
            </Button>
          </div>
        }
      />

      {/* Top Unified Metric Strip */}
      <div className="rounded-xl border border-[#e6e3da] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.8)] overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#f0ede6]">
          <div className="p-3.5 sm:p-4">
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
              <Layers className="h-3.5 w-3.5 text-stone-400" />
              Departments Evaluated
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-bold text-stone-900">8 Units</span>
              <span className="text-[11px] text-stone-400">Design, Dev, Sales, Mktg</span>
            </div>
          </div>

          <div className="p-3.5 sm:p-4">
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
              <Award className="h-3.5 w-3.5 text-amber-500" />
              Top Performing Unit
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-bold text-emerald-800">Video Team</span>
              <span className="text-[11px] font-semibold text-emerald-700">126% Quota</span>
            </div>
          </div>

          <div className="p-3.5 sm:p-4">
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
              <Laptop className="h-3.5 w-3.5 text-stone-400" />
              Web Projects Monitored
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-bold text-stone-900">{webProjects.length} Total</span>
              <span className="text-[11px] text-stone-400">
                {webProjects.filter((p) => p.status === 'Completed').length} Completed
              </span>
            </div>
          </div>

          <div className="p-3.5 sm:p-4">
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
              <Share2 className="h-3.5 w-3.5 text-stone-400" />
              Brand Outreach Reach
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-bold text-stone-900">396.5K</span>
              <span className="text-[11px] text-stone-400">Across 9 sister brands</span>
            </div>
          </div>
        </div>
      </div>

      {/* Department Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs select-none scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white border border-[#e6e3da] text-stone-600 hover:border-stone-400 hover:text-stone-900'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= VIEW 1: OVERVIEW SCORECARDS ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-stone-900">All Departments Monthly Health</h3>
              <p className="text-xs text-stone-500">
                Click any department scorecard to inspect weekly breakdown tables or update numbers.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openKpiDrawer()}
              className="h-7 text-xs flex items-center gap-1 hover:border-stone-400"
            >
              <Plus className="h-3 w-3" />
              <span>Log Deliverable</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {currentDeptOverview.map((dept) => (
              <div
                key={dept.id}
                onClick={() => setActiveTab(dept.id)}
                className="rounded-xl border border-[#e6e3da] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.8)] space-y-3.5 hover:border-stone-400 hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-stone-950 flex items-center gap-1">
                      {dept.name}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-stone-400" />
                    </h4>
                    <span className="text-[10px] text-stone-400">{dept.teamSize}</span>
                  </div>
                </div>

                {/* Score lines */}
                <div className="space-y-2.5 pt-1">
                  {dept.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-700 font-medium truncate max-w-[140px]">
                          {m.label}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-stone-900 font-mono">{m.score}%</span>
                          {getStatusBadge(m.status)}
                        </div>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className={`h-full ${getProgressBarColor(m.status)}`}
                          style={{ width: `${Math.min(100, Math.max(0, m.score))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#f4f1ea] flex items-center justify-between text-[11px] text-stone-400">
                  <span>Open Breakdown</span>
                  <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl border border-[#e6e3da] bg-[#faf9f5] text-xs text-stone-600 flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Evaluation Bands:</strong> Performance &ge; 90% is classified as <em>Excellent</em>, 67–89% as <em>Good</em>, 50–66% as <em>Average</em>, and below 50% as <em>Needs Improvement</em>. Click <strong>&quot;Update KPI Numbers&quot;</strong> anytime to adjust weekly figures or monthly targets.
            </p>
          </div>
        </div>
      )}

      {/* ================= VIEW: DEPARTMENT TARGETS MASTER (PLAIN-ENGLISH) ================= */}
      {activeTab === 'targets' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Top Banner */}
          <div className="p-4 rounded-xl border border-[#e6e3da] bg-[#faf9f5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center p-1 rounded-md bg-stone-900 text-white">
                  <Target className="h-3.5 w-3.5" />
                </span>
                <h3 className="font-bold text-sm text-stone-900">
                  Company-Wide Department Targets Master
                </h3>
              </div>
              <p className="text-xs text-stone-600">
                Clear plain-English expectations, weekly goals, monthly quotas, and team responsibilities across all 8 operating units.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleOpenAddTarget}
                className="h-8 text-xs bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Set New Target</span>
              </Button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-[#e6e3da] bg-white">
              <span className="text-[10px] text-stone-400 block font-medium">Active Targets Configured</span>
              <span className="text-base font-bold text-stone-900 font-mono mt-0.5 block">{targetRules.length} Goals</span>
              <span className="text-[10px] text-stone-500">Across 8 company squads</span>
            </div>
            <div className="p-3 rounded-xl border border-[#e6e3da] bg-white">
              <span className="text-[10px] text-stone-400 block font-medium">Goal Frequency</span>
              <span className="text-base font-bold text-stone-900 mt-0.5 block">Weekly & Monthly</span>
              <span className="text-[10px] text-stone-500">Evaluated every 7 days</span>
            </div>
            <div className="p-3 rounded-xl border border-[#e6e3da] bg-white">
              <span className="text-[10px] text-stone-400 block font-medium">Standard Success Bar</span>
              <span className="text-base font-bold text-emerald-800 font-mono mt-0.5 block">&ge; 67% Required</span>
              <span className="text-[10px] text-emerald-700 font-medium">Benchmark for Good standing</span>
            </div>
            <div className="p-3 rounded-xl border border-[#e6e3da] bg-white">
              <span className="text-[10px] text-stone-400 block font-medium">Review Cycle</span>
              <span className="text-base font-bold text-stone-900 mt-0.5 block">Monthly Alignment</span>
              <span className="text-[10px] text-stone-500">October / November planning</span>
            </div>
          </div>

          {/* Search & Category Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search deliverables, departments, or staff..."
                value={targetSearch}
                onChange={(e) => setTargetSearch(e.target.value)}
                className="w-full h-8.5 pl-8.5 pr-3 rounded-lg border border-[#e6e3da] bg-white text-xs text-stone-800 placeholder:text-stone-400 outline-none focus:border-stone-400"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs select-none">
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'Creative & Media', label: 'Creative & Media' },
                { id: 'Growth & Leads', label: 'Growth & Leads' },
                { id: 'Engineering & Tech', label: 'Engineering & Tech' },
                { id: 'Sales & Revenue', label: 'Sales & Revenue' },
                { id: 'HR & Talent', label: 'HR & Talent' },
                { id: 'Commercial & Retail', label: 'Commercial & Retail' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedTargetCategory(c.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedTargetCategory === c.id
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'bg-white border border-[#e6e3da] text-stone-600 hover:border-stone-400 hover:text-stone-900'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Master Department Targets Table */}
          <div className="rounded-xl border border-[#e6e3da] bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="px-4 py-3 bg-[#faf9f5] border-b border-[#f0ede6] flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                  Target Guidelines & Performance Expectations Matrix
                </h4>
                <p className="text-[11px] text-stone-500">
                  Showing {targetRules.filter((t) => {
                    const matchesSearch =
                      t.deliverableName.toLowerCase().includes(targetSearch.toLowerCase()) ||
                      t.departmentName.toLowerCase().includes(targetSearch.toLowerCase()) ||
                      t.assignedTeam.toLowerCase().includes(targetSearch.toLowerCase()) ||
                      t.targetRuleNote.toLowerCase().includes(targetSearch.toLowerCase());
                    const matchesCategory =
                      selectedTargetCategory === 'all' || t.category === selectedTargetCategory;
                    return matchesSearch && matchesCategory;
                  }).length} company targets
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#e6e3da] text-stone-600">
                Official Company Benchmarks
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-800">
                <thead className="bg-[#fcfbf9] text-[11px] font-semibold text-stone-500 border-b border-[#f0ede6]">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Department</th>
                    <th className="px-4 py-2.5 font-medium">What They Must Deliver</th>
                    <th className="px-3 py-2.5 text-right font-medium">Weekly Goal</th>
                    <th className="px-3 py-2.5 text-right font-medium">Monthly Target</th>
                    <th className="px-4 py-2.5 font-medium">Team Responsible</th>
                    <th className="px-4 py-2.5 font-medium max-w-xs">Target Rule & Expectation</th>
                    <th className="px-3 py-2.5 text-center font-medium">Benchmark</th>
                    <th className="px-3 py-2.5 text-right font-medium w-16">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f1ea]">
                  {targetRules
                    .filter((t) => {
                      const matchesSearch =
                        t.deliverableName.toLowerCase().includes(targetSearch.toLowerCase()) ||
                        t.departmentName.toLowerCase().includes(targetSearch.toLowerCase()) ||
                        t.assignedTeam.toLowerCase().includes(targetSearch.toLowerCase()) ||
                        t.targetRuleNote.toLowerCase().includes(targetSearch.toLowerCase());
                      const matchesCategory =
                        selectedTargetCategory === 'all' || t.category === selectedTargetCategory;
                      return matchesSearch && matchesCategory;
                    })
                    .map((tgt) => (
                      <tr
                        key={tgt.id}
                        onClick={() => handleOpenEditTarget(tgt)}
                        className="hover:bg-stone-50/70 transition-colors cursor-pointer"
                      >
                        {/* Department & Category */}
                        <td className="px-4 py-3">
                          <span className="font-bold text-stone-900 block">{tgt.departmentName}</span>
                          <span className="text-[10px] text-stone-400 block">{tgt.category}</span>
                        </td>

                        {/* Deliverable Name */}
                        <td className="px-4 py-3">
                          <span className="font-semibold text-stone-800 block">{tgt.deliverableName}</span>
                          <span className="text-[10px] font-mono text-stone-400">Unit: {tgt.unit}</span>
                        </td>

                        {/* Weekly Goal */}
                        <td className="px-3 py-3 text-right">
                          <span className="inline-block px-2 py-0.5 rounded bg-[#faf9f5] border border-[#e6e3da] text-[11px] font-mono font-medium text-stone-800">
                            {tgt.weeklyTarget}
                          </span>
                        </td>

                        {/* Monthly Target */}
                        <td className="px-3 py-3 text-right">
                          <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[11px] font-mono font-bold text-emerald-900">
                            {tgt.monthlyTarget}
                          </span>
                        </td>

                        {/* Team Responsible */}
                        <td className="px-4 py-3">
                          <span className="text-xs text-stone-700 font-medium">{tgt.assignedTeam}</span>
                        </td>

                        {/* Plain-English Target Rule */}
                        <td className="px-4 py-3 max-w-xs text-stone-600 text-[11px] leading-relaxed">
                          {tgt.targetRuleNote}
                        </td>

                        {/* Benchmark Pill */}
                        <td className="px-3 py-3 text-center">
                          <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200 font-medium">
                            Good: {tgt.benchmarkGood}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-3 py-3 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditTarget(tgt);
                            }}
                            className="text-stone-400 hover:text-stone-800 p-1 rounded hover:bg-stone-100"
                            title="Edit Target"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 2: DESIGN TEAM ================= */}
      {activeTab === 'design' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-xl border border-[#e6e3da] bg-[#faf9f5] flex items-start justify-between">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Design Team Deliverables</h3>
              <p className="text-xs text-stone-600 pt-0.5">{designKpi.targetDescription}</p>
            </div>
            <Button
              size="sm"
              onClick={() => openKpiDrawer('design')}
              className="h-7 text-xs bg-stone-900 text-white flex items-center gap-1"
            >
              <Edit3 className="h-3 w-3" />
              <span>Update Design KPIs</span>
            </Button>
          </div>

          <div className="space-y-4">
            {designKpi.blocks.map((block, bIdx) => renderMetricBlockTable(block, 'design', bIdx))}
          </div>
        </div>
      )}

      {/* ================= VIEW 3: VIDEO TEAM ================= */}
      {activeTab === 'video' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-xl border border-[#e6e3da] bg-[#faf9f5] flex items-start justify-between">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Video Production Team</h3>
              <p className="text-xs text-stone-600 pt-0.5">{videoKpi.targetDescription}</p>
            </div>
            <Button
              size="sm"
              onClick={() => openKpiDrawer('video')}
              className="h-7 text-xs bg-stone-900 text-white flex items-center gap-1"
            >
              <Edit3 className="h-3 w-3" />
              <span>Update Video KPIs</span>
            </Button>
          </div>

          <div className="space-y-4">
            {videoKpi.blocks.map((block, bIdx) => renderMetricBlockTable(block, 'video', bIdx))}
          </div>
        </div>
      )}

      {/* ================= VIEW 4: MARKETING TEAM ================= */}
      {activeTab === 'marketing' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-xl border border-[#e6e3da] bg-[#faf9f5] flex items-start justify-between">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Marketing & Lead Generation Funnel</h3>
              <p className="text-xs text-stone-600 pt-0.5">{marketingKpi.targetDescription}</p>
            </div>
            <Button
              size="sm"
              onClick={() => openKpiDrawer('marketing')}
              className="h-7 text-xs bg-stone-900 text-white flex items-center gap-1"
            >
              <Edit3 className="h-3 w-3" />
              <span>Update Marketing KPIs</span>
            </Button>
          </div>

          <div className="space-y-4">
            {marketingKpi.blocks.map((block, bIdx) => renderMetricBlockTable(block, 'marketing', bIdx))}
          </div>

          {/* Brand Collateral Output Table */}
          <div className="rounded-xl border border-[#e6e3da] bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="px-4 py-3 bg-[#faf9f5] border-b border-[#f0ede6] flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                  Poster & Video Collateral Output by Brand (Combined Weeks 1–4)
                </h4>
                <p className="text-[11px] text-stone-500">Distribution across 15 internal sister brands</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#e6e3da] text-stone-600">
                Total: {BRAND_COLLATERAL_OUTPUT.reduce((acc, c) => acc + c.posters, 0)} Posters / {BRAND_COLLATERAL_OUTPUT.reduce((acc, c) => acc + c.videos, 0)} Videos
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-800">
                <thead className="bg-[#fcfbf9] text-[11px] font-semibold text-stone-500 border-b border-[#f0ede6]">
                  <tr>
                    <th className="px-4 py-2 font-medium">Brand Entity</th>
                    <th className="px-4 py-2 text-right font-medium">Posters Created</th>
                    <th className="px-4 py-2 text-right font-medium">Videos Produced</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f1ea]">
                  {BRAND_COLLATERAL_OUTPUT.map((b, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/50">
                      <td className="px-4 py-2 font-medium text-stone-900">{b.brand}</td>
                      <td className="px-4 py-2 text-right font-mono font-medium">{b.posters}</td>
                      <td className="px-4 py-2 text-right font-mono font-medium">{b.videos}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#faf9f5] font-bold text-stone-900 border-t-2 border-[#e6e3da]">
                    <td className="px-4 py-2.5">Grand Total</td>
                    <td className="px-4 py-2.5 text-right font-mono">
                      {BRAND_COLLATERAL_OUTPUT.reduce((acc, c) => acc + c.posters, 0)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono">
                      {BRAND_COLLATERAL_OUTPUT.reduce((acc, c) => acc + c.videos, 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 5: SOCIAL MEDIA INSIGHT ================= */}
      {activeTab === 'social' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-xl border border-[#e6e3da] bg-[#faf9f5] flex items-start justify-between">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Social Media Engagement & Reach</h3>
              <p className="text-xs text-stone-600 pt-0.5">
                Target: 30% engagement lift for every brand across 4 weekly measurement intervals.
              </p>
            </div>
            <span className="text-[11px] font-mono text-stone-400">9 Brands Evaluated</span>
          </div>

          {/* Heatmap Matrix Table */}
          <div className="rounded-xl border border-[#e6e3da] bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="px-4 py-3 bg-[#faf9f5] border-b border-[#f0ede6]">
              <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                Performance Score Heatmap by Brand & Period
              </h4>
              <p className="text-[11px] text-stone-500">Shading: 90%+ dark green, 75%+ green, 50%+ amber, &lt;50% red</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-800">
                <thead className="bg-[#fcfbf9] text-[11px] font-semibold text-stone-500 border-b border-[#f0ede6]">
                  <tr>
                    <th className="px-4 py-2 font-medium">Brand</th>
                    {SOCIAL_PERIODS.map((period, idx) => (
                      <th key={idx} className="px-4 py-2 text-center font-medium">
                        Period {idx + 1} ({period})
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f1ea]">
                  {SOCIAL_BRAND_METRICS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/50">
                      <td className="px-4 py-2.5 font-medium text-stone-900">{row.brand}</td>
                      {row.periods.map((p, pIdx) => (
                        <td key={pIdx} className="px-4 py-2 text-center font-mono text-xs">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${getHeatmapColor(
                              p
                            )}`}
                          >
                            {p !== null ? `${p.toFixed(2)}%` : '—'}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-[#faf9f5] font-bold text-stone-900 border-t-2 border-[#e6e3da]">
                    <td className="px-4 py-2.5">Period Weighted Average</td>
                    {SOCIAL_PERIOD_TOTALS.map((t, idx) => (
                      <td key={idx} className="px-4 py-2.5 text-center font-mono font-bold text-stone-900">
                        {t.toFixed(2)}%
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Reach Totals */}
          <div className="rounded-xl border border-[#e6e3da] bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="px-4 py-3 bg-[#faf9f5] border-b border-[#f0ede6]">
              <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                Monthly Aggregated Metrics (Top Recorded Brands)
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-800">
                <thead className="bg-[#fcfbf9] text-[11px] font-semibold text-stone-500 border-b border-[#f0ede6]">
                  <tr>
                    <th className="px-4 py-2 font-medium">Brand</th>
                    <th className="px-4 py-2 text-right font-medium">Posters</th>
                    <th className="px-4 py-2 text-right font-medium">Reels</th>
                    <th className="px-4 py-2 text-right font-medium">Accounts Reach</th>
                    <th className="px-4 py-2 text-right font-medium">Profile Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f1ea]">
                  {SOCIAL_MONTHLY_SUMMARIES.map((r, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/50">
                      <td className="px-4 py-2.5 font-medium text-stone-900">{r.brand}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{r.posters}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{r.reels}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-semibold text-stone-900">{r.reach}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{r.profileActivity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 6: WEB DEVELOPERS ================= */}
      {activeTab === 'web' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-xl border border-[#e6e3da] bg-[#faf9f5] flex items-start justify-between">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Web Development Squad & Project Tracker</h3>
              <p className="text-xs text-stone-600 pt-0.5">
                KPI % = days reported &divide; working days (Mon–Sat, leave not deducted). Source: Team OSFORH daily standup logs.
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleOpenAddProject}
              className="h-7 text-xs bg-stone-900 text-white flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              <span>Add New Project</span>
            </Button>
          </div>

          {/* 3 Developer Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {WEB_DEVELOPERS_SUMMARY.map((dev) => (
              <div
                key={dev.name}
                className="rounded-xl border border-[#e6e3da] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">{dev.name}</h4>
                    <p className="text-[11px] text-stone-500">{dev.role}</p>
                  </div>
                  <span className="text-lg font-bold font-mono text-stone-900">{dev.kpiPercent}%</span>
                </div>

                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className={`h-full ${
                      dev.kpiPercent >= 67 ? 'bg-emerald-600' : dev.kpiPercent >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${dev.kpiPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-stone-500">
                    <strong>{dev.daysReported}</strong> of {dev.totalWorkingDays} days reported
                  </span>
                  {dev.septemberPercent !== undefined && (
                    <span className="text-stone-400">Sept: {dev.septemberPercent}%</span>
                  )}
                </div>

                <p className="text-xs text-stone-600 border-t border-[#f4f1ea] pt-2.5 leading-relaxed">
                  {dev.summaryText}
                </p>
              </div>
            ))}
          </div>

          {/* Weekly Attendance Heatmap */}
          <div className="rounded-xl border border-[#e6e3da] bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="px-4 py-3 bg-[#faf9f5] border-b border-[#f0ede6]">
              <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                Weekly Developer Attendance & Standup Logging
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-800">
                <thead className="bg-[#fcfbf9] text-[11px] font-semibold text-stone-500 border-b border-[#f0ede6]">
                  <tr>
                    <th className="px-4 py-2 font-medium">Developer</th>
                    {WEB_WEEKS_ATTENDANCE.map((w, idx) => (
                      <th key={idx} className="px-4 py-2 text-center font-medium">
                        {w.label} ({w.dateRange})
                      </th>
                    ))}
                    <th className="px-4 py-2 text-center font-semibold text-stone-900">Month Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f1ea]">
                  {WEB_DEVELOPERS_SUMMARY.map((dev) => (
                    <tr key={dev.name} className="hover:bg-stone-50/50">
                      <td className="px-4 py-3 font-medium text-stone-900">{dev.name}</td>
                      {WEB_WEEKS_ATTENDANCE.map((w, idx) => {
                        const val = w.data[dev.name as 'Shabeeb' | 'Fameesha' | 'Sahal'];
                        if (!val) {
                          return (
                            <td key={idx} className="px-4 py-3 text-center text-stone-400 text-xs italic">
                              Joined Later
                            </td>
                          );
                        }
                        const pctVal = Math.round((val[0] / val[1]) * 100);
                        return (
                          <td key={idx} className="px-4 py-3 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${
                                pctVal >= 67
                                  ? 'bg-emerald-100/70 text-emerald-900'
                                  : pctVal >= 50
                                  ? 'bg-amber-100/70 text-amber-900'
                                  : 'bg-rose-100/70 text-rose-900'
                              }`}
                            >
                              {pctVal}% ({val[0]}/{val[1]}d)
                            </span>
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-center font-bold font-mono text-stone-900">
                        {dev.kpiPercent}% ({dev.daysReported}/{dev.totalWorkingDays}d)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Web Project Tracker (Interactive Table with Status Editing) */}
          <div className="rounded-xl border border-[#e6e3da] bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="px-4 py-3 bg-[#faf9f5] border-b border-[#f0ede6] flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                  Live Web Work & Software Project Tracker
                </h4>
                <p className="text-[11px] text-stone-500">
                  Click any project or &quot;Edit&quot; to update progress, assignment, or notes.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleOpenAddProject}
                  className="h-7 text-xs flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>New Project</span>
                </Button>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#e6e3da] text-stone-600">
                  {webProjects.length} Initiatives
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-800">
                <thead className="bg-[#fcfbf9] text-[11px] font-semibold text-stone-500 border-b border-[#f0ede6]">
                  <tr>
                    <th className="px-3 py-2 text-center font-medium w-12">#</th>
                    <th className="px-4 py-2 font-medium">Software / Client Project</th>
                    <th className="px-3 py-2 font-medium">Assigned Developer</th>
                    <th className="px-3 py-2 font-medium">Start Date</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Work Notes & Remarks</th>
                    <th className="px-3 py-2 text-right font-medium w-16">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f1ea]">
                  {webProjects.map((p) => (
                    <tr
                      key={p.sn}
                      onClick={() => handleOpenEditProject(p)}
                      className="hover:bg-stone-50/70 cursor-pointer transition-colors"
                    >
                      <td className="px-3 py-2.5 text-center font-mono text-stone-400">{p.sn}</td>
                      <td className="px-4 py-2.5 font-bold text-stone-900">{p.project}</td>
                      <td className="px-3 py-2.5 text-stone-700">{p.assignedTo}</td>
                      <td className="px-3 py-2.5 text-stone-500 font-mono text-[11px]">{p.startDate}</td>
                      <td className="px-3 py-2.5">{getProjectStatusChip(p.status)}</td>
                      <td className="px-4 py-2.5 text-stone-600 text-[11px] max-w-sm leading-relaxed">
                        {p.remarks}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditProject(p);
                          }}
                          className="text-stone-400 hover:text-stone-800 p-1 rounded hover:bg-stone-100"
                          title="Edit project"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 7: ADMIN & RECRUITMENT ================= */}
      {activeTab === 'admin' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-xl border border-[#e6e3da] bg-[#faf9f5] flex items-start justify-between">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Admin & HR Recruitment (Sevenstar)</h3>
              <p className="text-xs text-stone-600 pt-0.5">{adminKpi.targetDescription}</p>
            </div>
            <Button
              size="sm"
              onClick={() => openKpiDrawer('admin')}
              className="h-7 text-xs bg-stone-900 text-white flex items-center gap-1"
            >
              <Edit3 className="h-3 w-3" />
              <span>Update Recruitment KPIs</span>
            </Button>
          </div>

          <div className="space-y-4">
            {adminKpi.blocks.map((block, bIdx) => renderMetricBlockTable(block, 'admin', bIdx))}
          </div>
        </div>
      )}

      {/* ================= VIEW 8: SALES TEAM ================= */}
      {activeTab === 'sales' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-xl border border-[#e6e3da] bg-[#faf9f5] flex items-start justify-between">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Sales Operations & Lead Closures</h3>
              <p className="text-xs text-stone-600 pt-0.5">{salesKpi.targetDescription}</p>
            </div>
            <Button
              size="sm"
              onClick={() => openKpiDrawer('sales')}
              className="h-7 text-xs bg-stone-900 text-white flex items-center gap-1"
            >
              <Edit3 className="h-3 w-3" />
              <span>Update Sales KPIs</span>
            </Button>
          </div>

          <div className="space-y-4">
            {salesKpi.blocks.map((block, bIdx) => renderMetricBlockTable(block, 'sales', bIdx))}
          </div>
        </div>
      )}

      {/* ================= VIEW 9: E-COMMERCE ================= */}
      {activeTab === 'ecom' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-xl border border-[#e6e3da] bg-[#faf9f5] flex items-start justify-between">
            <div>
              <h3 className="font-bold text-sm text-stone-900">E-Commerce Listings & Sales Pipeline</h3>
              <p className="text-xs text-stone-600 pt-0.5">{ecomKpi.targetDescription}</p>
            </div>
            <Button
              size="sm"
              onClick={() => openKpiDrawer('ecom')}
              className="h-7 text-xs bg-stone-900 text-white flex items-center gap-1"
            >
              <Edit3 className="h-3 w-3" />
              <span>Update E-Com KPIs</span>
            </Button>
          </div>

          <div className="space-y-4">
            {ecomKpi.blocks.map((block, bIdx) => renderMetricBlockTable(block, 'ecom', bIdx))}
          </div>
        </div>
      )}

      {/* ================= FEATURE A: EDIT/ADD WEB PROJECT MODAL ================= */}
      <Dialog open={Boolean(editingProject)} onOpenChange={() => setEditingProject(null)}>
        {editingProject && (
          <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-stone-900">
                <Laptop className="h-4 w-4 text-[#d9533f]" />
                <span>{isNewProject ? 'Register New Web Project' : `Update Project #${projectFormData.sn}`}</span>
              </DialogTitle>
              <DialogDescription>
                Track live software development status, client deliverables, and technical remarks.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-1">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-stone-700">Project / Client Portal Name *</label>
                <Input
                  required
                  placeholder="e.g. Osforh Learning Hub"
                  value={projectFormData.project}
                  onChange={(e) => setProjectFormData({ ...projectFormData, project: e.target.value })}
                  className="h-8.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-stone-700">Assigned Developer *</label>
                  <Input
                    required
                    placeholder="e.g. Shabeeb, Fameesha, Sahal"
                    value={projectFormData.assignedTo}
                    onChange={(e) => setProjectFormData({ ...projectFormData, assignedTo: e.target.value })}
                    className="h-8.5 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-stone-700">Start / Kickoff Date</label>
                  <Input
                    placeholder="e.g. Oct 15"
                    value={projectFormData.startDate}
                    onChange={(e) => setProjectFormData({ ...projectFormData, startDate: e.target.value })}
                    className="h-8.5 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Status Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-stone-700 block">Deliverable Status</label>
                <div className="flex flex-wrap gap-1.5">
                  {(['In progress', 'Completed', 'Demo done', 'Updated', 'No update'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setProjectFormData({ ...projectFormData, status: st })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        projectFormData.status === st
                          ? 'bg-stone-900 text-white shadow-2xs'
                          : 'bg-[#faf9f5] border border-[#e6e3da] text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-stone-700">Work Notes & Technical Remarks</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Deployed to production on VPS, final responsiveness checks pending."
                  value={projectFormData.remarks}
                  onChange={(e) => setProjectFormData({ ...projectFormData, remarks: e.target.value })}
                  className="w-full rounded-lg border border-[#e6e3da] bg-white p-2.5 text-xs text-stone-800 placeholder:text-stone-400 outline-none focus:border-stone-400"
                />
              </div>
            </div>

            <DialogFooter className="pt-2 border-t border-[#f0ede6]">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingProject(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-stone-900 text-white">
                Save Project
              </Button>
            </DialogFooter>
          </form>
        )}
      </Dialog>

      {/* ================= FEATURE B: SLIDE-OVER DRAWER FOR KPI DELIVERABLES ================= */}
      {kpiDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setKpiDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col border-l border-[#e6e3da] animate-in slide-in-from-right duration-300">
              {/* Drawer Header */}
              <div className="px-6 py-4.5 border-b border-[#f0ede6] bg-[#fdfcfb] flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-[#fbf5f3] text-[#d9533f] border border-[#edd7d2]">
                      <BarChart3 className="h-4 w-4" />
                    </span>
                    <h2 className="text-base font-bold text-stone-900">Update KPI Numbers & Targets</h2>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Input weekly actuals (W1..W5), adjust targets, and recalculate performance live.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setKpiDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Body Form */}
              <form onSubmit={handleSaveKpiMetric} className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* 1. Real-Time Calculation Preview Card */}
                {(() => {
                  const currentSum =
                    Number(metricFormData.w1 || 0) +
                    Number(metricFormData.w2 || 0) +
                    Number(metricFormData.w3 || 0) +
                    Number(metricFormData.w4 || 0) +
                    Number(metricFormData.w5 || 0);
                  const currentPerf =
                    metricFormData.monthlyTarget > 0
                      ? Number(((currentSum / metricFormData.monthlyTarget) * 100).toFixed(1))
                      : 0;
                  const currentRating = calculateKpiStatus(currentPerf);

                  return (
                    <div className="rounded-xl border border-[#e6e3da] bg-[#fbfaf7] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.025),inset_0_1px_0_rgba(255,255,255,0.8)] relative overflow-hidden space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#ece8df]">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                          <Sparkles className="h-3 w-3 text-amber-500" /> Live Recalculation
                        </span>
                        {getStatusBadge(currentRating)}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-stone-900">
                            {metricFormData.name || 'Select KPI Metric'}
                          </h4>
                          <span className="text-[11px] text-stone-500">
                            Target: {metricFormData.monthlyTarget} monthly
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold font-mono text-stone-900">
                            {currentSum} / {metricFormData.monthlyTarget}
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-800 block">
                            {currentPerf}% Achieved
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                        <div
                          className={`h-full ${getProgressBarColor(currentRating)} transition-all duration-300`}
                          style={{ width: `${Math.min(100, Math.max(0, currentPerf))}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}

                {/* 2. Step: Choose Department */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-stone-800 uppercase tracking-wider block">
                    1. Select Department
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'design', label: 'Design Team' },
                      { id: 'video', label: 'Video Team' },
                      { id: 'marketing', label: 'Marketing Team' },
                      { id: 'admin', label: 'Recruitment' },
                      { id: 'sales', label: 'Sales Team' },
                      { id: 'ecom', label: 'E-Commerce' },
                    ].map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => handleDrawerDeptChange(d.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedDeptId === d.id
                            ? 'bg-stone-900 text-white shadow-xs'
                            : 'bg-[#faf9f5] border border-[#e6e3da] text-stone-600 hover:border-stone-400'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Step: Choose Contributor / Squad */}
                <div className="space-y-2 pt-1 border-t border-[#f0ede6]">
                  <label className="text-[11px] font-semibold text-stone-800 uppercase tracking-wider block">
                    2. Select Team Member / Account
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {getDeptStateAndSetter(selectedDeptId)[0].blocks.map((b, bIdx) => (
                      <button
                        key={b.title}
                        type="button"
                        onClick={() => handleDrawerBlockChange(bIdx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedBlockIdx === bIdx
                            ? 'bg-stone-900 text-white shadow-xs'
                            : 'bg-[#faf9f5] border border-[#e6e3da] text-stone-600 hover:border-stone-400'
                        }`}
                      >
                        {b.title.split('(')[0].trim()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Step: Choose Metric */}
                <div className="space-y-2 pt-1 border-t border-[#f0ede6]">
                  <label className="text-[11px] font-semibold text-stone-800 uppercase tracking-wider block">
                    3. Select KPI Metric Row
                  </label>
                  <div className="space-y-1">
                    <select
                      value={selectedRowIdx}
                      onChange={(e) => handleDrawerRowChange(Number(e.target.value))}
                      className="w-full h-9 rounded-lg border border-[#e6e3da] bg-white px-3 text-xs font-medium text-stone-800 outline-none"
                    >
                      {getDeptStateAndSetter(selectedDeptId)[0].blocks[selectedBlockIdx]?.rows
                        .filter((r) => r.kind !== 'total')
                        .map((r, rIdx) => (
                          <option key={rIdx} value={rIdx}>
                            {r.name} (Monthly Target: {r.monthlyTarget || '—'})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* 5. Targets Definition */}
                <div className="space-y-3 pt-1 border-t border-[#f0ede6]">
                  <label className="text-[11px] font-semibold text-stone-800 uppercase tracking-wider block">
                    4. Quota Targets
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-stone-700">Weekly Target</label>
                      <Input
                        type="number"
                        value={metricFormData.weeklyTarget}
                        onChange={(e) =>
                          setMetricFormData({ ...metricFormData, weeklyTarget: Number(e.target.value) })
                        }
                        className="h-8.5 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-stone-700">Monthly Target</label>
                      <Input
                        type="number"
                        value={metricFormData.monthlyTarget}
                        onChange={(e) =>
                          setMetricFormData({ ...metricFormData, monthlyTarget: Number(e.target.value) })
                        }
                        className="h-8.5 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. Weekly Deliverables Actuals (W1 to W5) */}
                <div className="space-y-3 pt-1 border-t border-[#f0ede6]">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-stone-800 uppercase tracking-wider block">
                      5. Weekly Actual Output (Completed Deliverables)
                    </label>
                    <span className="text-[10px] text-stone-400">Sum: {Number(metricFormData.w1) + Number(metricFormData.w2) + Number(metricFormData.w3) + Number(metricFormData.w4) + Number(metricFormData.w5)}</span>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { label: 'W1', field: 'w1' },
                      { label: 'W2', field: 'w2' },
                      { label: 'W3', field: 'w3' },
                      { label: 'W4', field: 'w4' },
                      { label: 'W5', field: 'w5' },
                    ].map((w) => (
                      <div key={w.label} className="space-y-1">
                        <label className="text-[10px] font-semibold text-stone-500 text-center block">
                          {w.label}
                        </label>
                        <Input
                          type="number"
                          value={metricFormData[w.field as keyof typeof metricFormData]}
                          onChange={(e) =>
                            setMetricFormData({
                              ...metricFormData,
                              [w.field]: Number(e.target.value),
                            })
                          }
                          className="h-8 text-center text-xs font-mono px-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sticky Footer */}
                <div className="pt-4 border-t border-[#f0ede6] flex items-center justify-between sticky bottom-0 bg-white py-3 -mx-6 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.03)]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setKpiDrawerOpen(false)}
                    className="h-9 px-4 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="h-9 px-5 text-xs bg-stone-900 hover:bg-stone-800 text-white shadow-xs flex items-center gap-1.5"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save & Recalculate</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT / ADD DEPARTMENT TARGET MODAL ================= */}
      <Dialog open={Boolean(editingTarget)} onOpenChange={() => setEditingTarget(null)}>
        {editingTarget && (
          <form onSubmit={handleSaveTarget} className="space-y-4 text-xs">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-stone-900">
                <Target className="h-4 w-4 text-[#d9533f]" />
                <span>{isNewTarget ? 'Set New Department Target' : `Adjust Target: ${targetFormData.deliverableName}`}</span>
              </DialogTitle>
              <DialogDescription>
                Define plain-English deliverables, quotas, weekly benchmarks, and team responsibilities.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-stone-700">Department *</label>
                  <select
                    value={targetFormData.departmentName}
                    onChange={(e) => {
                      const dName = e.target.value;
                      let dId = 'design';
                      if (dName.includes('Video')) dId = 'video';
                      else if (dName.includes('Marketing')) dId = 'marketing';
                      else if (dName.includes('Social')) dId = 'social';
                      else if (dName.includes('Web')) dId = 'web';
                      else if (dName.includes('Recruit') || dName.includes('Admin')) dId = 'admin';
                      else if (dName.includes('Sales')) dId = 'sales';
                      else if (dName.includes('Commerce')) dId = 'ecom';

                      setTargetFormData({
                        ...targetFormData,
                        departmentName: dName,
                        departmentId: dId,
                      });
                    }}
                    className="w-full h-8.5 rounded-lg border border-[#e6e3da] bg-white px-2.5 text-xs text-stone-800 outline-none"
                  >
                    <option value="Design Team">Design Team</option>
                    <option value="Video Team">Video Team</option>
                    <option value="Marketing Team">Marketing Team</option>
                    <option value="Social Media Insight">Social Media Insight</option>
                    <option value="Web Developers">Web Developers</option>
                    <option value="Recruitment & Admin">Recruitment & Admin</option>
                    <option value="Sales Team">Sales Team</option>
                    <option value="E-Commerce Operations">E-Commerce Operations</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-stone-700">Business Category</label>
                  <select
                    value={targetFormData.category}
                    onChange={(e) => setTargetFormData({ ...targetFormData, category: e.target.value })}
                    className="w-full h-8.5 rounded-lg border border-[#e6e3da] bg-white px-2.5 text-xs text-stone-800 outline-none"
                  >
                    <option value="Creative & Media">Creative & Media</option>
                    <option value="Growth & Leads">Growth & Leads</option>
                    <option value="Engineering & Tech">Engineering & Tech</option>
                    <option value="Sales & Revenue">Sales & Revenue</option>
                    <option value="HR & Talent">HR & Talent</option>
                    <option value="Commercial & Retail">Commercial & Retail</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-stone-700">What They Must Deliver (Deliverable Name) *</label>
                <Input
                  required
                  placeholder="e.g. Social Media & Promotional Posters"
                  value={targetFormData.deliverableName}
                  onChange={(e) => setTargetFormData({ ...targetFormData, deliverableName: e.target.value })}
                  className="h-8.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-stone-700">Weekly Goal</label>
                  <Input
                    required
                    placeholder="e.g. 25 per designer"
                    value={targetFormData.weeklyTarget}
                    onChange={(e) => setTargetFormData({ ...targetFormData, weeklyTarget: e.target.value })}
                    className="h-8.5 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-stone-700">Monthly Target</label>
                  <Input
                    required
                    placeholder="e.g. 100+ per person"
                    value={targetFormData.monthlyTarget}
                    onChange={(e) => setTargetFormData({ ...targetFormData, monthlyTarget: e.target.value })}
                    className="h-8.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-stone-700">Team Members Responsible</label>
                  <Input
                    required
                    placeholder="e.g. Umaibanu, Gokul"
                    value={targetFormData.assignedTeam}
                    onChange={(e) => setTargetFormData({ ...targetFormData, assignedTeam: e.target.value })}
                    className="h-8.5 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-stone-700">Success Benchmark</label>
                  <Input
                    placeholder="e.g. 67% and above"
                    value={targetFormData.benchmarkGood}
                    onChange={(e) => setTargetFormData({ ...targetFormData, benchmarkGood: e.target.value })}
                    className="h-8.5 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-stone-700">Plain-English Target Guideline & Expectation</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Must complete minimum 5 branding packages and 25 posters weekly with brand guidelines."
                  value={targetFormData.targetRuleNote}
                  onChange={(e) => setTargetFormData({ ...targetFormData, targetRuleNote: e.target.value })}
                  className="w-full rounded-lg border border-[#e6e3da] bg-white p-2.5 text-xs text-stone-800 placeholder:text-stone-400 outline-none focus:border-stone-400"
                />
              </div>
            </div>

            <DialogFooter className="pt-2 border-t border-[#f0ede6]">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingTarget(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-stone-900 text-white">
                Save Target
              </Button>
            </DialogFooter>
          </form>
        )}
      </Dialog>
    </div>
  );
};
