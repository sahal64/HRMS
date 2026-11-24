import React, { useState, useEffect, useMemo } from 'react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar } from '@/components/ui/avatar';
import { useOrganization } from '@/app/providers/OrganizationContext';
import { apiFetch } from '@/services/api';
import {
  Users,
  Building2,
  CalendarCheck,
  CalendarX2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { currentOrganization, departments } = useOrganization();
  const [liveMetrics, setLiveMetrics] = useState<{
    totalEmployees?: number;
    activeDepartments?: number;
    presentToday?: number;
    presentRate?: number;
    pendingLeaves?: number;
  }>({});

  useEffect(() => {
    apiFetch<{ success: boolean; data: any }>(`/dashboard/metrics.php?organizationId=${currentOrganization.id}`)
      .then((res) => {
        if (res.success && res.data) {
          setLiveMetrics(res.data);
        }
      })
      .catch((err) => {
        console.warn('Dashboard live metrics fallback:', err);
      });
  }, [currentOrganization.id]);

  // Simulated Leave Applications
  const [leaveApplications, setLeaveApplications] = useState([
    {
      id: 'app-1',
      name: 'Wade Warren',
      department: 'IT Department',
      reason: 'Personal Leave',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      status: 'pending',
    },
    {
      id: 'app-2',
      name: 'Jerome Bell',
      department: 'Sales Department',
      reason: 'Sick Leave',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      status: 'pending',
    },
    {
      id: 'app-3',
      name: 'Theresa Webb',
      department: 'Development Department',
      reason: 'Family Emergency',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      status: 'approved',
    },
    {
      id: 'app-4',
      name: 'Robert Fox',
      department: 'Sales Department',
      reason: 'Sick Leave',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
      status: 'approved',
    },
    {
      id: 'app-5',
      name: 'Jenny Wilson',
      department: 'Data Department',
      reason: 'Medical Follow-up',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      status: 'approved',
    },
    {
      id: 'app-6',
      name: 'Amira Nasser',
      department: 'Engineering Lead',
      reason: 'Annual Vacation',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
      status: 'pending',
    },
  ]);

  // Attendance Data (scaled proportionally for natural bar height)
  const allAttendanceData = [
    { month: 'Jan', onTime: 125, late: 12, absent: 5 },
    { month: 'Feb', onTime: 122, late: 14, absent: 6 },
    { month: 'Mar', onTime: 128, late: 10, absent: 4 },
    { month: 'Apr', onTime: 130, late: 8, absent: 4 },
    { month: 'May', onTime: 132, late: 7, absent: 3 },
    { month: 'Jun', onTime: 136, late: 5, absent: 2 },
  ];

  // Employee Growth Rate Data
  const allGrowthData = [
    { month: 'Jan', count: 110 },
    { month: 'Feb', count: 118 },
    { month: 'Mar', count: 124 },
    { month: 'Apr', count: 128 },
    { month: 'May', count: 135 },
    { month: 'Jun', count: 142 },
  ];

  const [attendanceTimeframe, setAttendanceTimeframe] = useState<'6m' | '3m' | 'year'>('6m');
  const [growthTimeframe, setGrowthTimeframe] = useState<'6m' | '3m'>('6m');

  const attendanceBarData = useMemo(() => {
    if (attendanceTimeframe === '3m') return allAttendanceData.slice(-3);
    return allAttendanceData;
  }, [attendanceTimeframe]);

  const growthRateData = useMemo(() => {
    if (growthTimeframe === '3m') return allGrowthData.slice(-3);
    return allGrowthData;
  }, [growthTimeframe]);

  const handleToggleStatus = (id: string) => {
    setLeaveApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const next = app.status === 'pending' ? 'approved' : 'pending';
          return { ...app, status: next };
        }
        return app;
      })
    );
  };

  const totalEmployees = liveMetrics.totalEmployees ?? currentOrganization.employeeCount ?? 142;
  const presentRate = liveMetrics.presentRate ?? 95.5;
  const presentCount = liveMetrics.presentToday ?? Math.round((totalEmployees * presentRate) / 100);
  const pendingLeavesCount = liveMetrics.pendingLeaves ?? leaveApplications.filter((l) => l.status === 'pending').length;

  return (
    <div className="space-y-4">
      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Total Employees */}
        <div className="rounded-xl border border-[#e6e3da] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all hover:border-stone-400">
          <div className="flex items-center justify-between text-stone-500">
            <span className="flex items-center gap-1.5 text-xs font-medium text-stone-500">
              <Users className="h-3.5 w-3.5 text-stone-400" />
              Total Employees
            </span>
          </div>
          <div className="mt-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-sans">
              {totalEmployees}
            </h2>
            <p className="mt-1 text-[11px] font-medium text-emerald-700">
              +2.5% <span className="text-stone-400 font-normal">from last month</span>
            </p>
          </div>
        </div>

        {/* Metric 2: Active Departments */}
        <div className="rounded-xl border border-[#e6e3da] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all hover:border-stone-400">
          <div className="flex items-center justify-between text-stone-500">
            <span className="flex items-center gap-1.5 text-xs font-medium text-stone-500">
              <Building2 className="h-3.5 w-3.5 text-stone-400" />
              Active Departments
            </span>
          </div>
          <div className="mt-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-sans">
              {departments.length || 5}
            </h2>
            <p className="mt-1 text-[11px] font-medium text-stone-400">
              Across all office locations
            </p>
          </div>
        </div>

        {/* Metric 3: Today's Attendance */}
        <div className="rounded-xl border border-[#e6e3da] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all hover:border-stone-400">
          <div className="flex items-center justify-between text-stone-500">
            <span className="flex items-center gap-1.5 text-xs font-medium text-stone-500">
              <CalendarCheck className="h-3.5 w-3.5 text-stone-400" />
              Today's Attendance
            </span>
          </div>
          <div className="mt-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-sans">
              {presentCount}
            </h2>
            <p className="mt-1 text-[11px] font-medium text-emerald-700">
              +{presentRate}% <span className="text-stone-400 font-normal">present rate</span>
            </p>
          </div>
        </div>

        {/* Metric 4: Leave Request */}
        <div className="rounded-xl border border-[#e6e3da] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all hover:border-stone-400">
          <div className="flex items-center justify-between text-stone-500">
            <span className="flex items-center gap-1.5 text-xs font-medium text-stone-500">
              <CalendarX2 className="h-3.5 w-3.5 text-stone-400" />
              Pending Leaves
            </span>
          </div>
          <div className="mt-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-sans">
              {pendingLeavesCount}
            </h2>
            <p className="mt-1 text-[11px] font-medium text-[#c44330]">
              Requires approval
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left (7 Cols) + Right (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-7 space-y-4">
          {/* Attendance Summary Stacked Bar Chart */}
          <div className="rounded-xl border border-[#e6e3da] bg-white p-4.5 shadow-[0_1px_2px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.8)]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xs sm:text-[13px] font-semibold text-stone-900">
                  Attendance Summary
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">Monthly check-in compliance</p>
              </div>
              <select 
                value={attendanceTimeframe}
                onChange={(e) => setAttendanceTimeframe(e.target.value as '6m' | '3m' | 'year')}
                className="text-[11px] font-medium text-stone-600 bg-white border border-[#e6e3da] rounded-md px-2 py-0.5 outline-none cursor-pointer hover:border-stone-400"
              >
                <option value="6m">Last 6 Months</option>
                <option value="3m">Last 3 Months</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <div className="h-56 w-full pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceBarData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#8c867a' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#8c867a' }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(238, 236, 230, 0.4)' }}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e6e3da',
                      borderRadius: '8px',
                      fontSize: '11px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  />
                  {/* Chubby, rounded stacked bars matching Design 3 */}
                  <Bar dataKey="onTime" name="On Time" stackId="a" fill="#d9533f" radius={[0, 0, 4, 4]} barSize={34} />
                  <Bar dataKey="late" name="Late" stackId="a" fill="#fbd38d" barSize={34} />
                  <Bar dataKey="absent" name="Absent" stackId="a" fill="#fecdd3" radius={[4, 4, 0, 0]} barSize={34} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Clean Legend */}
            <div className="mt-3 pt-3 border-t border-[#f0ede6] flex flex-wrap items-center justify-center gap-6 text-[11px] text-stone-600">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="h-2.5 w-2.5 rounded-xs bg-[#d9533f]" />
                On Time Present 95%
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="h-2.5 w-2.5 rounded-xs bg-[#fbd38d]" />
                Late Present 03%
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="h-2.5 w-2.5 rounded-xs bg-[#fecdd3]" />
                Absent 02%
              </span>
            </div>
          </div>

          {/* Employee Growth Rate Line Chart */}
          <div className="rounded-xl border border-[#e6e3da] bg-white p-4.5 shadow-[0_1px_2px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.8)]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xs sm:text-[13px] font-semibold text-stone-900">
                  Employee Growth Rate
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">Net active headcount trend</p>
              </div>
              <select 
                value={growthTimeframe}
                onChange={(e) => setGrowthTimeframe(e.target.value as '6m' | '3m')}
                className="text-[11px] font-medium text-stone-600 bg-white border border-[#e6e3da] rounded-md px-2 py-0.5 outline-none cursor-pointer hover:border-stone-400"
              >
                <option value="6m">Last 6 Months</option>
                <option value="3m">Last 3 Months</option>
              </select>
            </div>

            <div className="h-44 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthRateData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ede6" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#8c867a' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#8c867a' }} domain={['dataMin - 10', 'dataMax + 10']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e6e3da',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#d9533f"
                    strokeWidth={2}
                    dot={{ fill: '#ffffff', stroke: '#d9533f', strokeWidth: 2, r: 3.5 }}
                    activeDot={{ r: 5, fill: '#d9533f' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="lg:col-span-5 space-y-4">
          {/* Leave Trends Cards */}
          <div className="rounded-xl border border-[#e6e3da] bg-white p-4.5 shadow-[0_1px_2px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.8)]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs sm:text-[13px] font-semibold text-stone-900">
                  Leave Trends
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">Category distribution</p>
              </div>
              <select 
                value={growthTimeframe}
                onChange={(e) => setGrowthTimeframe(e.target.value as '6m' | '3m')}
                className="text-[11px] font-medium text-stone-600 bg-white border border-[#e6e3da] rounded-md px-2 py-0.5 outline-none cursor-pointer hover:border-stone-400"
              >
                <option value="6m">Last 6 Months</option>
                <option value="3m">Last 3 Months</option>
              </select>
            </div>

            {/* 4 Compact Leave Metric Tiles */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Casual */}
              <div className="p-3 rounded-lg border border-[#e6e3da] bg-[#faf9f5]">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-stone-900">37%</span>
                  <div className="text-right">
                    <p className="text-[11px] font-semibold text-stone-800">Casual Leave</p>
                    <p className="text-[10px] text-stone-400">34 days</p>
                  </div>
                </div>
                <div className="mt-1 flex items-center justify-end text-[10px] font-semibold text-emerald-700">
                  +3.4% ▲
                </div>
              </div>

              {/* Sick */}
              <div className="p-3 rounded-lg border border-[#e6e3da] bg-[#faf9f5]">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-stone-900">23%</span>
                  <div className="text-right">
                    <p className="text-[11px] font-semibold text-stone-800">Sick Leave</p>
                    <p className="text-[10px] text-stone-400">21 days</p>
                  </div>
                </div>
                <div className="mt-1 flex items-center justify-end text-[10px] font-semibold text-emerald-700">
                  +2.2% ▲
                </div>
              </div>

              {/* Annual */}
              <div className="p-3 rounded-lg border border-[#e6e3da] bg-[#faf9f5]">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-stone-900">29%</span>
                  <div className="text-right">
                    <p className="text-[11px] font-semibold text-stone-800">Annual Leave</p>
                    <p className="text-[10px] text-stone-400">29 days</p>
                  </div>
                </div>
                <div className="mt-1 flex items-center justify-end text-[10px] font-semibold text-rose-600">
                  -3.4% ▼
                </div>
              </div>

              {/* Emergency */}
              <div className="p-3 rounded-lg border border-[#e6e3da] bg-[#faf9f5]">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-stone-900">10%</span>
                  <div className="text-right">
                    <p className="text-[11px] font-semibold text-stone-800">Emergency</p>
                    <p className="text-[10px] text-stone-400">15 days</p>
                  </div>
                </div>
                <div className="mt-1 flex items-center justify-end text-[10px] font-semibold text-emerald-700">
                  +1.2% ▲
                </div>
              </div>
            </div>
          </div>

          {/* Leave Application List */}
          <div className="rounded-xl border border-[#e6e3da] bg-white p-4.5 shadow-[0_1px_2px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.8)]">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#f0ede6]">
              <div>
                <h3 className="text-xs sm:text-[13px] font-semibold text-stone-900">
                  Leave Applications
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">Recent time-off submissions</p>
              </div>
              <span className="text-[11px] font-semibold text-[#b83321] bg-[#fbe8e5] border border-[#f3c5bd] px-2 py-0.5 rounded-full">
                {leaveApplications.filter((l) => l.status === 'pending').length} Actionable
              </span>
            </div>

            <div className="divide-y divide-[#f5f3ec]">
              {leaveApplications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => handleToggleStatus(app.id)}
                  className="py-2.5 flex items-center justify-between hover:bg-[#faf9f5] px-2 rounded-lg transition-colors cursor-pointer group"
                  title="Click to toggle Pending / Approved"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Avatar src={app.avatar} fallback={app.name} size="sm" />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-stone-900 truncate">
                        {app.name}{' '}
                        <span className="font-normal text-stone-400 text-[11px]">({app.department})</span>
                      </p>
                      <p className="text-[11px] text-stone-500 font-medium truncate mt-0.5">
                        Reason: <span className="text-stone-700">{app.reason}</span>
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-3">
                    <StatusBadge status={app.status} />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center border-t border-[#f2efe8] mt-2">
              <span className="text-[10px] text-stone-400 font-medium">
                Click any row to quickly toggle approval status.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
