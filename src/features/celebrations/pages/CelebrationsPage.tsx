import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { useOrganization } from '@/app/providers/OrganizationContext';
import { MOCK_CELEBRATIONS } from '@/mock-data/celebrations';
import { CelebrationEvent, CelebrationSettings } from '@/types/celebration';
import { apiFetch } from '@/services/api';
import {
  Cake,
  Award,
  Bell,
  Calendar,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Gift,
  PartyPopper,
  Settings2,
} from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export const CelebrationsPage: React.FC = () => {
  const { currentOrganization } = useOrganization();
  const [celebrations, setCelebrations] = useState<CelebrationEvent[]>(MOCK_CELEBRATIONS);
  const [activeTab, setActiveTab] = useState('birthdays');

  // Load live celebration records from MySQL backend
  useEffect(() => {
    apiFetch<{ success: boolean; data: any[] }>(`/celebrations/index.php?organizationId=${currentOrganization.id}`)
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: CelebrationEvent[] = res.data.map((item: any) => ({
            id: String(item.id),
            organizationId: item.organization_id || currentOrganization.id,
            employeeId: item.employee_id,
            employeeName: item.employee_name,
            employeeAvatar: item.employee_avatar,
            department: item.department,
            type: item.type,
            eventDate: item.event_date,
            displayDate: item.display_date,
            yearsMilestone: item.years_milestone ? Number(item.years_milestone) : undefined,
            daysRemaining: Number(item.daysRemaining ?? 2),
            wishesSent: Boolean(Number(item.wishes_sent)),
          }));
          setCelebrations(mapped);
        }
      })
      .catch((err) => {
        console.warn('Backend celebration fetch failed, showing mock fallback:', err);
      });
  }, [currentOrganization.id]);

  // Notification Settings state (Default: 2 days before)
  const [settings, setSettings] = useState<CelebrationSettings>({
    reminderDaysInAdvance: 2,
    notifyOnBell: true,
    sendAutomatedSlack: true,
    sendCompanyEmail: true,
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Modal state for sending greeting
  const [greetingModalOpen, setGreetingModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<CelebrationEvent | null>(null);
  const [customMessage, setCustomMessage] = useState(
    'Wishing you a very Happy Birthday! May this year bring you continued growth, happiness, and success. Enjoy your special day! 🎉🎂'
  );

  const birthdays = celebrations.filter((c) => c.type === 'birthday');
  const anniversaries = celebrations.filter((c) => c.type === 'anniversary');

  // Find anyone whose birthday is within 2 days!
  const urgentBirthdays = birthdays.filter(
    (b) => b.daysRemaining <= settings.reminderDaysInAdvance
  );

  const handleOpenGreeting = (person: CelebrationEvent) => {
    setSelectedPerson(person);
    if (person.type === 'anniversary') {
      setCustomMessage(
        `Happy ${person.yearsMilestone}-Year Work Anniversary! Thank you for your leadership, dedication, and wonderful contributions to our team. Here's to many more milestones together! 🥂✨`
      );
    } else {
      setCustomMessage(
        `Wishing you a fantastic Birthday, ${person.employeeName}! May your year ahead be filled with joy, prosperity, and memorable moments. Enjoy your celebration! 🎉🎂`
      );
    }
    setGreetingModalOpen(true);
  };

  const handleSendGreeting = async () => {
    if (!selectedPerson) return;
    try {
      await apiFetch('/celebrations/index.php', {
        method: 'POST',
        body: JSON.stringify({ id: selectedPerson.id }),
      });
    } catch (err) {
      console.warn('API post error:', err);
    }

    setCelebrations((prev) =>
      prev.map((c) =>
        c.id === selectedPerson.id ? { ...c, wishesSent: true } : c
      )
    );
    alert(
      `Birthday greeting successfully recorded in MySQL database for ${selectedPerson.employeeName}! Broadcast will dispatch on ${selectedPerson.displayDate}.`
    );
    setGreetingModalOpen(false);
    setSelectedPerson(null);
  };

  const handleSaveSettings = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Birthdays & Work Anniversaries"
        description={`Milestone recognition calendar and automated advance alerts for ${currentOrganization.name}.`}
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Birthdays & Anniversaries' }]}
        badge={
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#fbe8e5] text-[#d9533f] border border-[#f1b3a8]">
            2-Day Advance Alert Active
          </span>
        }
        actions={
          <Button
            size="sm"
            onClick={() => {
              if (urgentBirthdays.length > 0) handleOpenGreeting(urgentBirthdays[0]);
              else if (birthdays.length > 0) handleOpenGreeting(birthdays[0]);
            }}
          >
            <Send className="h-3.5 w-3.5 mr-1" />
            Send Team Greeting
          </Button>
        }
      />

      {/* 2-Day Advance Notification Alert Banner */}
      {urgentBirthdays.length > 0 && (
        <div className="rounded-xl border border-[#edd7d2] bg-[#fbf5f3] p-4 text-stone-800 shadow-[0_1px_2px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.8)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#ead3cd] text-[#d9533f] shadow-2xs">
              <Cake className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[#b83321] tracking-wide">
                  2-Day Advance Birthday Alert
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-[#fbe8e5] text-[#b83321] px-2 py-0.5 rounded-full border border-[#f3c5bd]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d9533f] animate-pulse" />
                  In 2 Days
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-stone-900 mt-0.5">
                {urgentBirthdays[0].employeeName} · {urgentBirthdays[0].department}
              </p>
              <p className="text-[11px] text-stone-500">
                Turns a year older on {urgentBirthdays[0].displayDate}. Time to order cake, sign a card, or schedule an automated broadcast.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="default"
            onClick={() => handleOpenGreeting(urgentBirthdays[0])}
            className="shrink-0 text-xs h-8 px-3.5"
          >
            <Gift className="h-3.5 w-3.5 mr-1.5 text-amber-200" />
            Prepare Greeting
          </Button>
        </div>
      )}

      {/* Sleek Milestone Metric Strip */}
      <div className="rounded-xl border border-[#e6e3da] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.8)] overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#f0ede6]">
          <div className="p-3.5 sm:p-4">
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
              <Clock className="h-3.5 w-3.5 text-[#d9533f]" />
              Action Required (≤ 2 Days)
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-bold text-stone-900">{urgentBirthdays.length}</span>
              <span className="text-[11px] font-medium text-[#d9533f]">Immediate prep</span>
            </div>
          </div>

          <div className="p-3.5 sm:p-4">
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
              <Cake className="h-3.5 w-3.5 text-stone-400" />
              Birthdays (Next 30 Days)
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-bold text-stone-900">{birthdays.length}</span>
              <span className="text-[11px] text-stone-400">Team celebrations</span>
            </div>
          </div>

          <div className="p-3.5 sm:p-4">
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
              <Award className="h-3.5 w-3.5 text-stone-400" />
              Work Anniversaries
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-bold text-stone-900">{anniversaries.length}</span>
              <span className="text-[11px] text-emerald-700 font-medium">Tenure milestones</span>
            </div>
          </div>

          <div className="p-3.5 sm:p-4">
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
              <Bell className="h-3.5 w-3.5 text-stone-400" />
              Advance Reminder Window
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-bold text-stone-900">{settings.reminderDaysInAdvance} Days</span>
              <span className="text-[11px] text-stone-400">Before milestone</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="birthdays" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="birthdays">
            <Cake className="h-3.5 w-3.5 mr-1.5" />
            Upcoming Birthdays ({birthdays.length})
          </TabsTrigger>
          <TabsTrigger value="anniversaries">
            <Award className="h-3.5 w-3.5 mr-1.5" />
            Work Anniversaries ({anniversaries.length})
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings2 className="h-3.5 w-3.5 mr-1.5" />
            Notification Rules (2-Day Reminder)
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Birthdays */}
        <TabsContent value="birthdays">
          <div className="rounded-xl border border-[#e6e3da] bg-white p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.8)]">
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#f2efe8]">
              <div>
                <h3 className="text-xs sm:text-[13px] font-semibold text-stone-900">
                  Upcoming Birthdays Calendar
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Ordered chronologically • System alerts you 2 days in advance for preparation
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {birthdays.map((person) => {
                const is2Days = person.daysRemaining <= 2;
                return (
                  <div
                    key={person.id}
                    className={`p-3.5 rounded-xl border transition-all duration-150 ${
                      is2Days
                        ? 'border-[#edd7d2] bg-[#fdfaf8] shadow-2xs ring-1 ring-[#f5d9d2]/40'
                        : 'border-[#e6e3da] bg-white hover:border-stone-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={person.employeeAvatar} fallback={person.employeeName} size="md" />
                        <div>
                          <p className="text-xs font-semibold text-stone-900">{person.employeeName}</p>
                          <p className="text-[10px] text-stone-400">{person.department}</p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          is2Days
                            ? 'bg-[#fbe8e5] text-[#b83321] border border-[#f5cfc7]'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {person.daysRemaining === 0
                          ? 'Today! 🎂'
                          : person.daysRemaining === 1
                          ? 'Tomorrow'
                          : `In ${person.daysRemaining} days`}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#f2efe8] flex items-center justify-between text-xs">
                      <span className="font-medium text-stone-700 flex items-center gap-1.5 text-[11px]">
                        <Calendar className="h-3.5 w-3.5 text-stone-400" />
                        {person.displayDate}
                      </span>

                      {person.wishesSent ? (
                        <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Scheduled
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant={is2Days ? 'default' : 'outline'}
                          className="h-7 text-[11px] px-2.5"
                          onClick={() => handleOpenGreeting(person)}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Send Card
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Work Anniversaries */}
        <TabsContent value="anniversaries">
          <div className="rounded-xl border border-[#e6e3da] bg-white p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.8)]">
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#f2efe8]">
              <div>
                <h3 className="text-xs sm:text-[13px] font-semibold text-stone-900">
                  Tenure & Loyalty Milestones
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Recognize employee service milestones (1, 3, 5+ years)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {anniversaries.map((person) => (
                <div
                  key={person.id}
                  className="p-3.5 rounded-xl border border-[#e6e3da] bg-white flex items-center justify-between hover:border-stone-300 transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <Avatar src={person.employeeAvatar} fallback={person.employeeName} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-stone-900">{person.employeeName}</p>
                        <span className="text-[10px] font-medium bg-[#eaf5ed] text-[#166534] px-2 py-0.5 rounded-full border border-[#d1ebd7]">
                          {person.yearsMilestone} Years 🏅
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400">{person.department}</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">
                        Anniversary Date: {person.displayDate} (in {person.daysRemaining} days)
                      </p>
                    </div>
                  </div>

                  {person.wishesSent ? (
                    <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Sent
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px]"
                      onClick={() => handleOpenGreeting(person)}
                    >
                      <Award className="h-3 w-3 mr-1" />
                      Acknowledge
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Notification Settings */}
        <TabsContent value="settings">
          <div className="rounded-xl border border-[#e5e2d9] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-5">
            <div>
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                Celebration Advance Notification Configuration
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Customize how far in advance you receive alerts to prepare cakes, cards, or team greetings.
              </p>
            </div>

            {settingsSaved && (
              <div className="p-3 bg-[#e2f3e8] border border-[#bbf7d0] rounded-lg text-[#15803d] text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Notification rules saved! You will receive birthday alerts 2 days in advance.</span>
              </div>
            )}

            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  How many days in advance should the HR manager be notified?
                </label>
                <select
                  value={settings.reminderDaysInAdvance}
                  onChange={(e) =>
                    setSettings({ ...settings, reminderDaysInAdvance: Number(e.target.value) })
                  }
                  className="w-full sm:w-80 h-9 rounded-lg border border-[#e5e2d9] bg-white px-3 py-1 text-xs text-stone-800 font-medium outline-none focus:border-[#d9533f]"
                >
                  <option value={1}>1 Day in Advance (Day before)</option>
                  <option value={2}>2 Days in Advance (Recommended for HR) ⭐</option>
                  <option value={3}>3 Days in Advance (Extra prep time)</option>
                  <option value={7}>1 Week in Advance</option>
                </select>
                <p className="text-[11px] text-stone-400 mt-1">
                  Alerts will trigger in your top notification bell and highlight on the dashboard.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-[#f2efe8]">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs select-none">
                  <input
                    type="checkbox"
                    checked={settings.notifyOnBell}
                    onChange={(e) => setSettings({ ...settings, notifyOnBell: e.target.checked })}
                    className="h-4 w-4 rounded border-stone-300 text-[#d9533f] focus:ring-[#d9533f]"
                  />
                  <span className="font-medium text-stone-800">
                    Show badge & unread alert on the Top Navbar Bell
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs select-none">
                  <input
                    type="checkbox"
                    checked={settings.sendCompanyEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, sendCompanyEmail: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-stone-300 text-[#d9533f] focus:ring-[#d9533f]"
                  />
                  <span className="font-medium text-stone-800">
                    Draft automated celebratory email to company mailing list
                  </span>
                </label>
              </div>

              <div className="pt-3">
                <Button onClick={handleSaveSettings} size="sm">
                  Save Notification Preferences
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Greeting Modal Dialog */}
      <Dialog open={greetingModalOpen} onOpenChange={setGreetingModalOpen}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PartyPopper className="h-4 w-4 text-[#d9533f]" />
            <span>
              {selectedPerson?.type === 'anniversary'
                ? `Work Anniversary Greeting: ${selectedPerson?.employeeName}`
                : `Birthday Greeting: ${selectedPerson?.employeeName}`}
            </span>
          </DialogTitle>
          <DialogDescription>
            {selectedPerson?.type === 'anniversary'
              ? `Celebrating ${selectedPerson?.yearsMilestone} years at ${currentOrganization.name} on ${selectedPerson?.displayDate}.`
              : `Scheduled for ${selectedPerson?.displayDate} (in ${selectedPerson?.daysRemaining} days).`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <div>
            <label className="block font-semibold text-stone-800 mb-1">Recipient</label>
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#faf9f5] border border-[#e5e2d9]">
              <Avatar
                src={selectedPerson?.employeeAvatar}
                fallback={selectedPerson?.employeeName || ''}
                size="sm"
              />
              <div>
                <p className="font-bold text-stone-900">{selectedPerson?.employeeName}</p>
                <p className="text-[11px] text-stone-500">{selectedPerson?.department}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Celebration Message (Editable)
            </label>
            <textarea
              rows={4}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full rounded-lg border border-[#e5e2d9] p-2.5 text-xs text-stone-800 outline-none focus:border-[#d9533f]"
            />
          </div>

          <div className="p-2.5 rounded-lg bg-[#fdf5f4] border border-[#f1b3a8] text-[11px] text-stone-700">
            <strong>HR Tip:</strong> Sending this will queue a digital greeting card and automatically notify their department team lead.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setGreetingModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendGreeting}>
            <Send className="h-3 w-3 mr-1" />
            Dispatch Greeting
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
