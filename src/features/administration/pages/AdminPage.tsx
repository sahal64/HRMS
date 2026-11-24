import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useOrganization } from '@/app/providers/OrganizationContext';
import { useRole } from '@/app/providers/RoleContext';
import { ROLE_CONFIGS, UserRole } from '@/types/role';
import { Settings2, ShieldCheck, History, Users, Lock, Key, CheckCircle, RefreshCw } from 'lucide-react';

interface AuditLog {
  id: string;
  organizationId: string;
  actorName: string;
  action: string;
  module: string;
  timestamp: string;
  ipAddress: string;
}

const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    organizationId: 'org-osforh',
    actorName: 'Sarah Al-Hashemi',
    action: 'Approved Annual Leave for Amira Nasser (3 Days)',
    module: 'Leave & Attendance',
    timestamp: '15 mins ago',
    ipAddress: '194.170.82.14',
  },
  {
    id: 'log-2',
    organizationId: 'org-osforh',
    actorName: 'Tariq Mansour',
    action: 'Updated Working Hours Policy (8.0 hrs/day)',
    module: 'Organization Setup',
    timestamp: '1 hour ago',
    ipAddress: '194.170.82.14',
  },
  {
    id: 'log-3',
    organizationId: 'org-osforh',
    actorName: 'Karim Fawzy',
    action: 'Generated Draft Monthly Salary Register',
    module: 'Payroll',
    timestamp: '3 hours ago',
    ipAddress: '194.170.82.90',
  },
  {
    id: 'log-4',
    organizationId: 'org-acme',
    actorName: 'Marcus Vance',
    action: 'Scheduled Candidate Interview for SRE',
    module: 'Recruitment',
    timestamp: '2 hours ago',
    ipAddress: '68.183.42.10',
  },
];

export const AdminPage: React.FC = () => {
  const { currentOrganization } = useOrganization();
  const { currentRole, switchRole } = useRole();
  const [activeTab, setActiveTab] = useState('roles');
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('60');

  const tenantLogs = MOCK_AUDIT_LOGS.filter(
    (l) => l.organizationId === currentOrganization.id
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin, Security & Audit Governance"
        description={`Configure RBAC role matrix, enforce 2FA/SSO policies, and inspect forensic audit trails for ${currentOrganization.name}.`}
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Admin & Governance' }]}
        badge={
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900 text-white flex items-center gap-1.5">
            <Lock className="h-3 w-3" /> SOC2 / ISO-27001 Ready
          </span>
        }
      />

      <Tabs defaultValue="roles" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="roles">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Roles & Permissions Matrix
          </TabsTrigger>
          <TabsTrigger value="audit">
            <History className="h-4 w-4 mr-2" />
            Audit Logs ({tenantLogs.length})
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Security & Authentication
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Roles Matrix */}
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Role-Based Access Control (RBAC) Architecture</CardTitle>
              <CardDescription>
                Simulated role scopes that control frontend accessibility and will map cleanly to Laravel Spatie Permission tables.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.values(ROLE_CONFIGS).map((role) => (
                  <div
                    key={role.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${role.badgeColor}`}>
                          {role.label}
                        </span>
                        {currentRole === role.id && (
                          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> (Currently Active)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{role.description}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        Allowed Modules: {role.allowedModules.slice(0, 6).join(', ')}
                        {role.allowedModules.length > 6 ? ` +${role.allowedModules.length - 6} more` : ''}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant={currentRole === role.id ? 'default' : 'outline'}
                      onClick={() => switchRole(role.id as UserRole)}
                    >
                      {currentRole === role.id ? 'Active Persona' : 'Simulate This Role'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Audit Logs */}
        <TabsContent value="audit">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Forensic Audit Trail</CardTitle>
                <CardDescription>Immutable record of user actions and security events</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert('Simulated export of compliance CSV audit log.')}
              >
                Export Audit CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Timestamp</th>
                      <th className="px-4 py-3 font-semibold">Actor</th>
                      <th className="px-4 py-3 font-semibold">Module</th>
                      <th className="px-4 py-3 font-semibold">Action Performed</th>
                      <th className="px-4 py-3 font-semibold">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tenantLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">{log.timestamp}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{log.actorName}</td>
                        <td className="px-4 py-3 text-slate-600 font-medium">{log.module}</td>
                        <td className="px-4 py-3 text-slate-800">{log.action}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">{log.ipAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Security Policies */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Authentication & Security Policies</CardTitle>
              <CardDescription>Tenant-level credential requirements and session timeout controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer select-none p-3 rounded-lg border border-slate-200 hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={mfaEnforced}
                  onChange={(e) => setMfaEnforced(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-800">Enforce Multi-Factor Authentication (MFA)</p>
                  <p className="text-[11px] text-slate-500">Require all privileged HR & Finance staff to use TOTP / Authenticator apps.</p>
                </div>
              </label>

              <div className="p-3 rounded-lg border border-slate-200 space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Idle Session Inactivity Timeout (Minutes)
                </label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="flex h-9 w-full sm:w-64 rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm text-slate-800"
                >
                  <option value="15">15 Minutes (Strict)</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">60 Minutes (Standard)</option>
                  <option value="240">4 Hours</option>
                </select>
                <p className="text-[11px] text-slate-500">Automatically locks inactive browser sessions.</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button onClick={() => alert('Security parameters updated successfully!')}>
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
