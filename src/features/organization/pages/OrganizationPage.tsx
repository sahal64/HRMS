import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useOrganization } from '@/app/providers/OrganizationContext';
import { Department, Location } from '@/types/organization';
import { Building2, MapPin, Users, Settings, Plus, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export const OrganizationPage: React.FC = () => {
  const { currentOrganization, departments, locations, updateOrganizationSettings } = useOrganization();

  // Local state for tabs and forms
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaved, setIsSaved] = useState(false);

  // Form states
  const [orgName, setOrgName] = useState(currentOrganization.name);
  const [taxId, setTaxId] = useState(currentOrganization.taxId);
  const [contactEmail, setContactEmail] = useState(currentOrganization.contactEmail);
  const [contactPhone, setContactPhone] = useState(currentOrganization.contactPhone);
  const [website, setWebsite] = useState(currentOrganization.website);

  // Policy Settings state
  const [dailyHours, setDailyHours] = useState(currentOrganization.settings.dailyWorkHours);
  const [probationMonths, setProbationMonths] = useState(currentOrganization.settings.defaultProbationMonths);
  const [enableGeofencing, setEnableGeofencing] = useState(currentOrganization.settings.enableGeofencing);
  const [enableOvertime, setEnableOvertime] = useState(currentOrganization.settings.enableOvertime);

  // Modal states
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [deptList, setDeptList] = useState(departments);

  // Location modal states
  const [locModalOpen, setLocModalOpen] = useState(false);
  const [newLocName, setNewLocName] = useState('');
  const [newLocCity, setNewLocCity] = useState('');
  const [locList, setLocList] = useState(locations);

  // Sync with currentOrganization when tenant switches
  React.useEffect(() => {
    setOrgName(currentOrganization.name);
    setTaxId(currentOrganization.taxId);
    setContactEmail(currentOrganization.contactEmail);
    setContactPhone(currentOrganization.contactPhone);
    setWebsite(currentOrganization.website);
    setDailyHours(currentOrganization.settings.dailyWorkHours);
    setProbationMonths(currentOrganization.settings.defaultProbationMonths);
    setEnableGeofencing(currentOrganization.settings.enableGeofencing);
    setEnableOvertime(currentOrganization.settings.enableOvertime);
    setDeptList(departments);
    setLocList(locations);
  }, [currentOrganization, departments, locations]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSaveSettings = () => {
    updateOrganizationSettings({
      dailyWorkHours: Number(dailyHours),
      defaultProbationMonths: Number(probationMonths),
      enableGeofencing,
      enableOvertime,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddDepartment = () => {
    if (!newDeptName || !newDeptCode) return;
    const newDept: Department = {
      id: `dept-${Date.now()}`,
      organizationId: currentOrganization.id,
      name: newDeptName,
      code: newDeptCode.toUpperCase(),
      employeeCount: 0,
      description: 'Newly created department',
    };
    setDeptList([...deptList, newDept]);
    setNewDeptName('');
    setNewDeptCode('');
    setDeptModalOpen(false);
  };

  const handleAddLocation = () => {
    if (!newLocName || !newLocCity) return;
    const newLoc: Location = {
      id: `loc-${Date.now()}`,
      organizationId: currentOrganization.id,
      name: newLocName,
      city: newLocCity,
      country: currentOrganization.address.country,
      address: 'Business Park, Sector 4',
      type: 'branch',
      isHeadquarters: false,
      employeeCount: 0,
    };
    setLocList([...locList, newLoc]);
    setNewLocName('');
    setNewLocCity('');
    setLocModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company & Organisation Setup"
        description={`Manage legal structure, branch offices, operational units, and policy rules for ${currentOrganization.name}.`}
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Company & Organisation Setup' }]}
        badge={
          <span className="text-xs bg-primary-100 text-primary-800 font-semibold px-2.5 py-1 rounded-full border border-primary-200">
            Tenant: {currentOrganization.code}
          </span>
        }
      />

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Organization settings saved and synced across modules successfully!</span>
        </div>
      )}

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">
            <Building2 className="h-4 w-4 mr-2" />
            Company Profile
          </TabsTrigger>
          <TabsTrigger value="departments">
            <Users className="h-4 w-4 mr-2" />
            Departments ({deptList.length})
          </TabsTrigger>
          <TabsTrigger value="locations">
            <MapPin className="h-4 w-4 mr-2" />
            Offices & Locations ({locList.length})
          </TabsTrigger>
          <TabsTrigger value="policies">
            <Settings className="h-4 w-4 mr-2" />
            Work Rules & Policies
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Profile */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Legal Entity Information</CardTitle>
              <CardDescription>
                Primary business registration, contact coordinates, and statutory taxation identifiers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Organization Legal Name
                    </label>
                    <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Corporate Tax ID / Registration #
                    </label>
                    <Input value={taxId} onChange={(e) => setTaxId(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Contact Email
                    </label>
                    <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Phone Number
                    </label>
                    <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Company Website
                    </label>
                    <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Operating Timezone
                    </label>
                    <Input value={currentOrganization.timezone} disabled className="bg-slate-50" />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Button type="submit">Save Profile Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Departments */}
        <TabsContent value="departments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Departments & Business Units</CardTitle>
                <CardDescription>
                  Organizational breakdown of teams, cost centers, and departmental budgets.
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => setDeptModalOpen(true)}>
                <Plus className="h-4 w-4 mr-1.5" />
                Add Department
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Department Name</th>
                      <th className="px-4 py-3 font-semibold">Code</th>
                      <th className="px-4 py-3 font-semibold">Headcount</th>
                      <th className="px-4 py-3 font-semibold">Annual Budget</th>
                      <th className="px-4 py-3 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {deptList.map((dept) => (
                      <tr key={dept.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-semibold text-slate-900">{dept.name}</td>
                        <td className="px-4 py-3 font-mono text-primary-600 font-medium">{dept.code}</td>
                        <td className="px-4 py-3">{dept.employeeCount} Members</td>
                        <td className="px-4 py-3 font-medium">
                          {dept.budget ? `${currentOrganization.settings.currencySymbol}${dept.budget.toLocaleString()}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{dept.description || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Locations */}
        <TabsContent value="locations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Offices & Work Locations</CardTitle>
                <CardDescription>
                  Physical offices, engineering hubs, and geofencing coordinates.
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => setLocModalOpen(true)}>
                <Plus className="h-4 w-4 mr-1.5" />
                Add Office Location
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {locList.map((loc) => (
                  <div
                    key={loc.id}
                    className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-primary-400 transition-colors shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-primary-600" />
                        {loc.name}
                      </span>
                      {loc.isHeadquarters && (
                        <span className="text-[10px] font-bold bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full">
                          HQ
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{loc.address}, {loc.city}, {loc.country}</p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <span>Assigned Staff:</span>
                      <span className="font-semibold">{loc.employeeCount} Employees</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Policies */}
        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle>Attendance & Personnel Policy Rules</CardTitle>
              <CardDescription>
                Simulated company-specific rules that govern daily work schedules and probation cycles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Standard Daily Working Hours
                  </label>
                  <Input
                    type="number"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number(e.target.value))}
                    min={4}
                    max={12}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Used to calculate overtime and partial-day deductions.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Default Probation Duration (Months)
                  </label>
                  <Input
                    type="number"
                    value={probationMonths}
                    onChange={(e) => setProbationMonths(Number(e.target.value))}
                    min={1}
                    max={12}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Automatic reminder triggers 14 days before completion.</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={enableGeofencing}
                    onChange={(e) => setEnableGeofencing(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Enable Mobile Geofencing for Attendance</p>
                    <p className="text-[11px] text-slate-500">Requires employees to be within 200m of office coordinates to punch in.</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={enableOvertime}
                    onChange={(e) => setEnableOvertime(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Enable Overtime Approval Workflow</p>
                    <p className="text-[11px] text-slate-500">Manager approval required for work beyond daily work hours.</p>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button onClick={handleSaveSettings}>Save Policy Rules</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Department Modal */}
      <Dialog open={deptModalOpen} onOpenChange={setDeptModalOpen}>
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
          <DialogDescription>Create a business unit for {currentOrganization.name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department Name</label>
            <Input
              placeholder="e.g. Information Security & Compliance"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Code</label>
            <Input
              placeholder="e.g. SEC"
              value={newDeptCode}
              onChange={(e) => setNewDeptCode(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeptModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAddDepartment}>Create Department</Button>
        </DialogFooter>
      </Dialog>

      {/* Add Location Modal */}
      <Dialog open={locModalOpen} onOpenChange={setLocModalOpen}>
        <DialogHeader>
          <DialogTitle>Add Office Location</DialogTitle>
          <DialogDescription>Register a new workplace branch</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Office Name</label>
            <Input
              placeholder="e.g. Silicon Oasis Innovation Hub"
              value={newLocName}
              onChange={(e) => setNewLocName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
            <Input
              placeholder="e.g. Dubai"
              value={newLocCity}
              onChange={(e) => setNewLocCity(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setLocModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAddLocation}>Save Location</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
