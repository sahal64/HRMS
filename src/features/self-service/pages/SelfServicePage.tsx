import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { useRole } from '@/app/providers/RoleContext';
import { useOrganization } from '@/app/providers/OrganizationContext';
import { Clock, Calendar, CheckSquare, Receipt, ArrowUpRight, Mail, MapPin, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SelfServicePage: React.FC = () => {
  const { currentUser } = useRole();
  const { currentOrganization } = useOrganization();
  const [clockedIn, setClockedIn] = useState(true);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Employee Self-Service (ESS)"
        description={`Personal workspace for ${currentUser.name}. Access your employment profile, attendance records, time-off balances, and assigned tasks.`}
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Self-Service' }]}
        badge={
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#e2f3e8] text-[#15803d]">
            Active Employee
          </span>
        }
      />

      {/* Refined Warm Profile Header (No harsh dark navy box!) */}
      <div className="rounded-xl border border-[#ece8e1] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <Avatar
              src={currentUser.avatar}
              fallback={currentUser.name}
              size="lg"
              className="ring-2 ring-[#ece8e1] shadow-2xs"
            />
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-lg font-bold text-stone-900 tracking-tight">
                  {currentUser.name}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fbe8e5] text-[#d4513b] border border-[#f1b3a8] w-fit mx-auto sm:mx-0">
                  HR MANAGER
                </span>
              </div>
              <p className="text-xs text-stone-600 font-medium">{currentUser.title}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] text-stone-400 pt-1">
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3 text-stone-400" />
                  {currentUser.department} • {currentOrganization.name}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-stone-400" />
                  {currentUser.email}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-stone-400" />
                  {currentOrganization.address.city}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Clock-in Widget */}
          <div className="rounded-xl bg-[#faf9f5] p-3.5 border border-[#ece8e1] text-center sm:text-right shrink-0 w-full sm:w-auto">
            <p className="text-[11px] font-medium text-stone-400">Today's Attendance</p>
            <p className="text-xs font-bold text-[#15803d] mt-0.5 flex items-center justify-center sm:justify-end gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {clockedIn ? 'Clocked In (09:00 AM)' : 'Clocked Out'}
            </p>
            <Button
              size="sm"
              variant={clockedIn ? 'outline' : 'default'}
              className="mt-2 text-xs w-full sm:w-auto h-7 px-3"
              onClick={() => {
                setClockedIn(!clockedIn);
                alert(clockedIn ? 'Punched out for today!' : 'Punched in for today!');
              }}
            >
              <Clock className="h-3 w-3 mr-1" />
              {clockedIn ? 'Punch Out' : 'Punch In'}
            </Button>
          </div>
        </div>
      </div>

      {/* Grid of ESS Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Leave Balances */}
        <div className="rounded-xl border border-[#ece8e1] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#f4f1ea]">
            <span className="text-xs font-bold text-stone-900 uppercase tracking-wide flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#d4513b]" />
              Time-Off Quota
            </span>
            <Link to="/leave" className="text-stone-400 hover:text-stone-700">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#faf9f5] border border-[#f0ede6]">
              <span className="text-stone-700 font-medium">Annual Vacation</span>
              <span className="font-bold text-stone-900">14 Days Left</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#faf9f5] border border-[#f0ede6]">
              <span className="text-stone-700 font-medium">Sick / Medical</span>
              <span className="font-bold text-stone-900">8 Days Left</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#faf9f5] border border-[#f0ede6]">
              <span className="text-stone-700 font-medium">Casual Leave</span>
              <span className="font-bold text-stone-900">4 Days Left</span>
            </div>
          </div>
          <Link to="/leave" className="block pt-1">
            <Button variant="outline" size="sm" className="w-full text-xs h-7.5">
              Apply for Leave
            </Button>
          </Link>
        </div>

        {/* Card 2: Tasks */}
        <div className="rounded-xl border border-[#ece8e1] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#f4f1ea]">
            <span className="text-xs font-bold text-stone-900 uppercase tracking-wide flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-[#15803d]" />
              Assigned Tasks
            </span>
            <Link to="/projects" className="text-stone-400 hover:text-stone-700">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-lg bg-[#faf9f5] border border-[#f0ede6] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-800 text-[11px] truncate">Annual Employee Appraisals</span>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-semibold">In Progress</span>
              </div>
              <p className="text-[10px] text-stone-400">Due Dec 05 • Performance</p>
            </div>
            <div className="p-2 rounded-lg bg-[#faf9f5] border border-[#f0ede6] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-800 text-[11px] truncate">Q4 Statutory Tax Filing Sign-off</span>
                <span className="text-[10px] text-[#15803d] bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">Scheduled</span>
              </div>
              <p className="text-[10px] text-stone-400">Due Nov 30 • Compliance</p>
            </div>
          </div>
          <Link to="/projects" className="block pt-1">
            <Button variant="outline" size="sm" className="w-full text-xs h-7.5">
              Open Task Board
            </Button>
          </Link>
        </div>

        {/* Card 3: Claims & Payslips */}
        <div className="rounded-xl border border-[#ece8e1] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#f4f1ea]">
            <span className="text-xs font-bold text-stone-900 uppercase tracking-wide flex items-center gap-1.5">
              <Receipt className="h-3.5 w-3.5 text-stone-500" />
              Documents & Claims
            </span>
            <Link to="/expenses" className="text-stone-400 hover:text-stone-700">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-lg bg-[#faf9f5] border border-[#f0ede6] flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-800 text-[11px]">October Salary Payslip</p>
                <p className="text-[10px] text-stone-400">Oct 31, 2026</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-[11px] px-2"
                onClick={() => alert('Simulated PDF payslip download.')}
              >
                Download
              </Button>
            </div>
            <div className="p-2 rounded-lg bg-[#faf9f5] border border-[#f0ede6] flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-800 text-[11px]">Client Travel Claim</p>
                <p className="text-[10px] text-emerald-600 font-semibold">$320 • Reimbursed</p>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">#EXP-841</span>
            </div>
          </div>
          <Link to="/expenses" className="block pt-1">
            <Button variant="outline" size="sm" className="w-full text-xs h-7.5">
              Submit Expense
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
