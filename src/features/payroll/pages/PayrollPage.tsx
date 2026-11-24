import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar } from '@/components/ui/avatar';
import { useOrganization } from '@/app/providers/OrganizationContext';
import { MOCK_EMPLOYEES } from '@/mock-data/employees';
import { Banknote, FileCheck, CheckCircle2, Download, AlertCircle, RefreshCw } from 'lucide-react';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

export const PayrollPage: React.FC = () => {
  const { currentOrganization } = useOrganization();
  const [payrollStatus, setPayrollStatus] = useState<'draft' | 'under_review' | 'finalized'>('under_review');
  const [confirmModal, setConfirmModal] = useState(false);

  const tenantEmployees = MOCK_EMPLOYEES.filter(
    (e) => e.organizationId === currentOrganization.id
  );

  const totalGross = tenantEmployees.reduce((acc, curr) => acc + curr.salary.gross, 0);
  const totalBasic = tenantEmployees.reduce((acc, curr) => acc + curr.salary.basic, 0);
  const totalAllowances = tenantEmployees.reduce((acc, curr) => acc + curr.salary.allowances, 0);

  const handleFinalizePayroll = () => {
    setPayrollStatus('finalized');
    alert(`November 2026 payroll batch finalized and locked for ${currentOrganization.name}! Salary register generated.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll & Compensation"
        description={`Monthly payroll processing, gross compensation breakdowns, and disbursement authorizations for ${currentOrganization.name}.`}
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Payroll & Compensation' }]}
        badge={
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
            Cycle: November 2026
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert('Simulated export of direct deposit bank NACHA / WPS text file initiated.')}
            >
              <Download className="h-4 w-4 mr-1.5" />
              Export Bank File (WPS)
            </Button>
            {payrollStatus !== 'finalized' && (
              <Button size="sm" onClick={() => setConfirmModal(true)}>
                <FileCheck className="h-4 w-4 mr-1.5" />
                Finalize & Disburse
              </Button>
            )}
          </div>
        }
      />

      {/* Demo Calculation Notice */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
        <span>
          <strong>Demo Notice:</strong> Payroll computations and tax statutory percentages are simulated for prototype verification and not legally binding.
        </span>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Monthly Gross</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {currentOrganization.settings.currencySymbol}{totalGross.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Calculated for {tenantEmployees.length} employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase">Basic Salaries</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {currentOrganization.settings.currencySymbol}{totalBasic.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Base contractual compensation</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase">Allowances & Housing</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {currentOrganization.settings.currencySymbol}{totalAllowances.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Transport, housing & utility</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase">Payroll Batch Status</p>
            <div className="mt-2">
              <StatusBadge status={payrollStatus} />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Cut-off date: 28th of month</p>
          </CardContent>
        </Card>
      </div>

      {/* Salary Register Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Employee Compensation Breakdown</CardTitle>
            <CardDescription>
              Detailed employee earnings, allowances, and net payable calculations
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Employee</th>
                  <th className="px-4 py-3 font-semibold">Designation</th>
                  <th className="px-4 py-3 font-semibold">Basic Pay</th>
                  <th className="px-4 py-3 font-semibold">Allowances</th>
                  <th className="px-4 py-3 font-semibold">Gross Total</th>
                  <th className="px-4 py-3 font-semibold">Net Payable</th>
                  <th className="px-4 py-3 font-semibold text-right">Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenantEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={emp.avatar} fallback={emp.fullName} size="sm" />
                        <div>
                          <p className="font-semibold text-slate-900">{emp.fullName}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{emp.employeeCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{emp.designation}</td>
                    <td className="px-4 py-3 font-mono font-medium">
                      {currentOrganization.settings.currencySymbol}{emp.salary.basic.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">
                      {currentOrganization.settings.currencySymbol}{emp.salary.allowances.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {currentOrganization.settings.currencySymbol}{emp.salary.gross.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-700">
                      {currentOrganization.settings.currencySymbol}{emp.salary.gross.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => alert(`Simulated PDF Payslip download for ${emp.fullName}`)}
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmModal}
        onOpenChange={setConfirmModal}
        title="Finalize Payroll Run"
        description={`Are you sure you want to finalize the November 2026 payroll for ${currentOrganization.name}? This will lock all compensation sheets and trigger payslip generation.`}
        confirmLabel="Finalize & Lock"
        onConfirm={handleFinalizePayroll}
      />
    </div>
  );
};
