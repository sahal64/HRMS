import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar } from '@/components/ui/avatar';
import { useOrganization } from '@/app/providers/OrganizationContext';
import { useRole } from '@/app/providers/RoleContext';
import { Receipt, Plus, CheckCircle, XCircle, DollarSign, FileText } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface ExpenseItem {
  id: string;
  organizationId: string;
  claimNumber: string;
  employeeName: string;
  employeeAvatar: string;
  category: 'Travel & Flights' | 'Client Entertainment' | 'Hardware & IT' | 'Office Supplies' | 'Training';
  amount: number;
  date: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'reimbursed';
}

const INITIAL_EXPENSES: ExpenseItem[] = [
  // OSFORH
  {
    id: 'exp-1',
    organizationId: 'org-osforh',
    claimNumber: 'EXP-1049',
    employeeName: 'Karim Fawzy',
    employeeAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    category: 'Client Entertainment',
    amount: 450,
    date: '2026-11-18',
    description: 'Executive dinner with prospective enterprise client from Riyadh',
    status: 'pending',
  },
  {
    id: 'exp-2',
    organizationId: 'org-osforh',
    claimNumber: 'EXP-1048',
    employeeName: 'Elena Rostova',
    employeeAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    category: 'Hardware & IT',
    amount: 180,
    date: '2026-11-15',
    description: 'Ergonomic trackball and wireless mechanical keyboard for design station',
    status: 'approved',
  },

  // Acme
  {
    id: 'exp-acm-1',
    organizationId: 'org-acme',
    claimNumber: 'EXP-3091',
    employeeName: 'Marcus Vance',
    employeeAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    category: 'Hardware & IT',
    amount: 1200,
    date: '2026-11-19',
    description: 'Server test bench hardware upgrade',
    status: 'pending',
  },

  // Nova
  {
    id: 'exp-nov-1',
    organizationId: 'org-nova',
    claimNumber: 'EXP-7012',
    employeeName: 'Arthur Pendleton',
    employeeAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    category: 'Travel & Flights',
    amount: 380,
    date: '2026-11-17',
    description: 'Eurostar train to Rotterdam logistics port',
    status: 'pending',
  },
];

export const ExpensesPage: React.FC = () => {
  const { currentOrganization } = useOrganization();
  const { currentUser } = useRole();

  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [category, setCategory] = useState<ExpenseItem['category']>('Travel & Flights');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const tenantExpenses = expenses.filter(
    (e) => e.organizationId === currentOrganization.id
  );

  const totalPending = tenantExpenses
    .filter((e) => e.status === 'pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleAction = (id: string, status: 'approved' | 'rejected') => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
    alert(`Expense claim marked as ${status.toUpperCase()}!`);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    const newExp: ExpenseItem = {
      id: `exp-${Date.now()}`,
      organizationId: currentOrganization.id,
      claimNumber: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      employeeName: currentUser.name,
      employeeAvatar: currentUser.avatar,
      category,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      description,
      status: 'pending',
    };

    setExpenses([newExp, ...expenses]);
    setModalOpen(false);
    setAmount('');
    setDescription('');
    alert(`Expense claim submitted for ${currentOrganization.settings.currencySymbol}${amount}! Routed to Finance.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expense & Reimbursement Claims"
        description={`Submit business expenses, track approval statuses, and manage reimbursement disbursements for ${currentOrganization.name}.`}
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Expenses & Reimbursements' }]}
        actions={
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Submit Expense Claim
          </Button>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Pending Review</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {currentOrganization.settings.currencySymbol}{totalPending.toLocaleString()}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Receipt className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Claims This Month</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{tenantExpenses.length}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Avg. Processing Time</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">1.8 Days</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expense List Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Claims & Advance Requests</CardTitle>
          <CardDescription>
            Audit claims against organization expense limits and receipts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Claim #</th>
                  <th className="px-4 py-3 font-semibold">Employee</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenantExpenses.length > 0 ? (
                  tenantExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-primary-600">
                        {exp.claimNumber}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar src={exp.employeeAvatar} fallback={exp.employeeName} size="xs" />
                          <span className="font-semibold text-slate-900">{exp.employeeName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{exp.category}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{exp.date}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {currentOrganization.settings.currencySymbol}{exp.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{exp.description}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={exp.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {exp.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="icon-sm"
                              variant="outline"
                              className="text-rose-600 hover:bg-rose-50"
                              onClick={() => handleAction(exp.id, 'rejected')}
                              title="Reject Claim"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon-sm"
                              variant="success"
                              onClick={() => handleAction(exp.id, 'approved')}
                              title="Approve Claim"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-xs text-slate-400">
                      No expense records logged for {currentOrganization.name}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Submit Expense Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogHeader>
          <DialogTitle>Submit New Expense Claim</DialogTitle>
          <DialogDescription>
            Provide expenditure receipts and itemized breakdown for approval.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateExpense} className="space-y-3 py-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Expense Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseItem['category'])}
              className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm text-slate-800"
            >
              <option value="Travel & Flights">Travel & Flights</option>
              <option value="Client Entertainment">Client Entertainment</option>
              <option value="Hardware & IT">Hardware & IT</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Training">Training & Certifications</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Amount ({currentOrganization.settings.currencySymbol})
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Business Purpose / Notes</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain business justification..."
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Submit Claim</Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};
