import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar } from '@/components/ui/avatar';
import { useOrganization } from '@/app/providers/OrganizationContext';
import { useRole } from '@/app/providers/RoleContext';
import { MOCK_ATTENDANCE } from '@/mock-data/attendance';
import { AttendanceRecord } from '@/types/attendance';
import { apiFetch } from '@/services/api';
import { ColumnDef } from '@tanstack/react-table';
import { Clock, PlusCircle, CheckCircle, Search, Filter, AlertTriangle } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export const AttendancePage: React.FC = () => {
  const { currentOrganization, departments } = useOrganization();
  const { currentUser } = useRole();

  const [records, setRecords] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [selectedDept, setSelectedDept] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasPunchedIn, setHasPunchedIn] = useState(false);

  // Fetch live attendance records from MySQL backend
  useEffect(() => {
    apiFetch<{ success: boolean; data: any[] }>(`/attendance/index.php?organizationId=${currentOrganization.id}`)
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: AttendanceRecord[] = res.data.map((item: any) => ({
            id: String(item.id),
            organizationId: item.organization_id || currentOrganization.id,
            employeeId: item.employee_id,
            employeeName: item.employee_name,
            employeeAvatar: item.employee_avatar,
            department: item.department,
            date: item.date,
            checkIn: item.check_in || '—',
            checkOut: item.check_out || '—',
            workHours: item.work_hours || 'In Progress',
            status: item.status,
          }));
          setRecords(mapped);

          // Check if current user already punched in today
          const todayStr = new Date().toISOString().split('T')[0];
          const myToday = mapped.find((r) => r.employeeId === currentUser.id && r.date === todayStr);
          if (myToday && !myToday.checkOut) {
            setHasPunchedIn(true);
          }
        }
      })
      .catch((err) => {
        console.warn('Backend attendance fetch fallback:', err);
      });
  }, [currentOrganization.id, currentUser.id]);

  // Correction dialog
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [correctionReason, setCorrectionReason] = useState('');
  const [correctionDate, setCorrectionDate] = useState('2026-11-19');

  // Filter records by active organization and filter inputs
  const tenantRecords = records.filter(
    (r) =>
      r.organizationId === currentOrganization.id &&
      (selectedDept === 'all' || r.department === selectedDept) &&
      (r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSimulatePunch = async () => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    try {
      const res = await apiFetch<{ success: boolean; action: string; message: string }>('/attendance/index.php', {
        method: 'POST',
        body: JSON.stringify({
          employeeId: currentUser.id,
          employeeName: currentUser.name,
          employeeAvatar: currentUser.avatar,
          department: currentUser.department,
        }),
      });

      if (res.action === 'punch_in') {
        const newRecord: AttendanceRecord = {
          id: `att-live-${Date.now()}`,
          organizationId: currentOrganization.id,
          employeeId: currentUser.id,
          employeeName: currentUser.name,
          employeeAvatar: currentUser.avatar,
          department: currentUser.department,
          date: new Date().toISOString().split('T')[0],
          checkIn: nowStr,
          checkOut: '—',
          workHours: 'In Progress',
          status: 'present',
        };
        setRecords([newRecord, ...records]);
        setHasPunchedIn(true);
      } else {
        setRecords((prev) =>
          prev.map((r) =>
            r.employeeId === currentUser.id ? { ...r, checkOut: nowStr, workHours: 'Completed' } : r
          )
        );
        setHasPunchedIn(false);
      }
      alert(res.message);
    } catch (err: any) {
      alert(`Punched locally: ${nowStr}`);
    }
  };

  const handleCorrectionSubmit = () => {
    if (!correctionReason) return;
    alert(`Attendance regularisation request submitted for ${correctionDate}! Routed to your reporting manager.`);
    setCorrectionModalOpen(false);
    setCorrectionReason('');
  };

  const columns: ColumnDef<AttendanceRecord>[] = [
    {
      accessorKey: 'employeeName',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={row.original.employeeAvatar}
            fallback={row.original.employeeName}
            size="sm"
          />
          <div>
            <p className="font-semibold text-slate-900">{row.original.employeeName}</p>
            <p className="text-[11px] text-slate-500">{row.original.department}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.date}</span>,
    },
    {
      accessorKey: 'checkIn',
      header: 'Check-In',
      cell: ({ row }) => (
        <span className="font-medium text-slate-800">{row.original.checkIn}</span>
      ),
    },
    {
      accessorKey: 'checkOut',
      header: 'Check-Out',
      cell: ({ row }) => (
        <span className="text-slate-600">{row.original.checkOut || '—'}</span>
      ),
    },
    {
      accessorKey: 'workHours',
      header: 'Effective Hours',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {row.original.workHours}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance & Time Management"
        description={`Track daily clock-ins, biometric punches, missing entries, and work hour compliance for ${currentOrganization.name}.`}
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Attendance & Time' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCorrectionModalOpen(true)}
            >
              <AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
              Request Correction
            </Button>
            <Button
              size="sm"
              onClick={handleSimulatePunch}
              variant={hasPunchedIn ? 'destructive' : 'default'}
            >
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              {hasPunchedIn ? 'Punch Out' : 'Punch In (Simulate)'}
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search employee or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full sm:w-64">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TanStack Table Data View */}
      <DataTable
        columns={columns}
        data={tenantRecords}
        emptyTitle="No attendance logs found"
        emptyDescription="No employee punch logs recorded for this selected department or query."
      />

      {/* Attendance Correction Modal */}
      <Dialog open={correctionModalOpen} onOpenChange={setCorrectionModalOpen}>
        <DialogHeader>
          <DialogTitle>Request Attendance Regularisation</DialogTitle>
          <DialogDescription>
            Submit an attendance punch correction for approval by your team lead.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Date to Regularise
            </label>
            <Input
              type="date"
              value={correctionDate}
              onChange={(e) => setCorrectionDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason / Explanation (e.g. biometric reader failure, external client meeting)
            </label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Provide context for missed check-in..."
              value={correctionReason}
              onChange={(e) => setCorrectionReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setCorrectionModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCorrectionSubmit}>
            Submit Correction Request
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
