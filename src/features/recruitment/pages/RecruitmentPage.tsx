import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar } from '@/components/ui/avatar';
import { useOrganization } from '@/app/providers/OrganizationContext';
import { MOCK_REQUISITIONS, MOCK_CANDIDATES } from '@/mock-data/recruitment';
import { Candidate, CandidateStage, JobRequisition } from '@/types/recruitment';
import { UserPlus, Briefcase, Star, ArrowRight, CheckCircle, Calendar, Plus, Clock } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const STAGES: { id: CandidateStage; label: string }[] = [
  { id: 'applied', label: 'Applied' },
  { id: 'screening', label: 'Screening' },
  { id: 'interview', label: 'Interview' },
  { id: 'offer', label: 'Offer Stage' },
  { id: 'hired', label: 'Hired' },
];

export const RecruitmentPage: React.FC = () => {
  const { currentOrganization } = useOrganization();
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [requisitions, setRequisitions] = useState<JobRequisition[]>(MOCK_REQUISITIONS);
  const [activeTab, setActiveTab] = useState('pipeline');

  // Job Modal
  const [newJobModal, setNewJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState('Software Engineering');

  // Interview modal
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [interviewDate, setInterviewDate] = useState('2026-11-25');
  const [interviewTime, setInterviewTime] = useState('14:00');

  const tenantRequisitions = requisitions.filter(
    (j) => j.organizationId === currentOrganization.id
  );

  const tenantCandidates = candidates.filter(
    (c) => c.organizationId === currentOrganization.id
  );

  const handleAdvanceStage = (candId: string, currentStage: CandidateStage) => {
    const nextStages: Record<CandidateStage, CandidateStage> = {
      applied: 'screening',
      screening: 'interview',
      interview: 'offer',
      offer: 'hired',
      hired: 'hired',
      rejected: 'screening',
    };
    const next = nextStages[currentStage];
    setCandidates((prev) =>
      prev.map((c) => (c.id === candId ? { ...c, stage: next } : c))
    );
    alert(`Candidate advanced to ${next.toUpperCase()} stage!`);
  };

  const handleCreateJob = () => {
    if (!newJobTitle) return;
    const newJob: JobRequisition = {
      id: `job-${Date.now()}`,
      organizationId: currentOrganization.id,
      title: newJobTitle,
      department: newJobDept,
      location: currentOrganization.address.city,
      openings: 1,
      applicantsCount: 0,
      status: 'active',
      postedDate: new Date().toISOString().split('T')[0],
    };
    setRequisitions([newJob, ...requisitions]);
    setNewJobModal(false);
    setNewJobTitle('');
    alert(`Job Requisition created: "${newJobTitle}"!`);
  };

  const handleScheduleInterview = () => {
    if (!selectedCandidate) return;
    alert(`Interview confirmed for ${selectedCandidate.name} on ${interviewDate} at ${interviewTime}! Google Meet calendar invite dispatched.`);
    setInterviewModalOpen(false);
    setSelectedCandidate(null);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Recruitment & Applicant Tracking (ATS)"
        description={`Manage active open requisitions, candidate evaluation pipelines, and hiring workflows for ${currentOrganization.name}.`}
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Recruitment & ATS' }]}
        actions={
          <Button size="sm" onClick={() => setNewJobModal(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Post Requisition
          </Button>
        }
      />

      {/* Sleek Unified Pipeline Summary Strip */}
      <div className="rounded-xl border border-[#e6e3da] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.8)] overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#f0ede6]">
          <div className="p-3.5 sm:p-4">
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
              <Briefcase className="h-3.5 w-3.5 text-stone-400" />
              Active Open Requisitions
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-bold text-stone-900">{tenantRequisitions.length}</span>
              <span className="text-[11px] text-stone-400">Positions accepting applications</span>
            </div>
          </div>

          <div className="p-3.5 sm:p-4">
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
              <UserPlus className="h-3.5 w-3.5 text-stone-400" />
              Candidates in Pipeline
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-bold text-stone-900">{tenantCandidates.length}</span>
              <span className="text-[11px] text-stone-400">Across 5 evaluation stages</span>
            </div>
          </div>

          <div className="p-3.5 sm:p-4">
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
              <Calendar className="h-3.5 w-3.5 text-stone-400" />
              Interviews Scheduled
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-bold text-stone-900">
                {tenantCandidates.filter((c) => c.stage === 'interview').length}
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">Google Meet calendar synced</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pipeline" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-3">
          <TabsTrigger value="pipeline">
            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            Candidate Pipeline (Kanban ATS)
          </TabsTrigger>
          <TabsTrigger value="jobs">
            <Briefcase className="h-3.5 w-3.5 mr-1.5" />
            Job Postings ({tenantRequisitions.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Pipeline Kanban / Columns */}
        <TabsContent value="pipeline">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {STAGES.map((stage) => {
              const stageCandidates = tenantCandidates.filter((c) => c.stage === stage.id);
              return (
                <div
                  key={stage.id}
                  className="rounded-xl border border-[#e6e3da] bg-[#faf9f5]/70 p-3 flex flex-col min-h-[380px]"
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#ece8df]">
                    <span className="text-xs font-semibold text-stone-800">
                      {stage.label}
                    </span>
                    <span className="text-[11px] font-medium bg-white text-stone-600 px-2 py-0.2 rounded-full border border-[#e2dfd5] shadow-2xs">
                      {stageCandidates.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1">
                    {stageCandidates.map((cand) => (
                      <div
                        key={cand.id}
                        className="p-3 bg-white rounded-lg border border-[#e6e3da] shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-2.5 hover:border-stone-400 hover:shadow-xs transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <Avatar src={cand.avatar} fallback={cand.name} size="sm" />
                          <div className="truncate">
                            <p className="font-semibold text-xs text-stone-900 truncate">{cand.name}</p>
                            <p className="text-[10px] text-stone-400 truncate">{cand.jobTitle}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-[#f2efe8]">
                          <span className="text-stone-500 font-medium">{cand.experienceYears}y exp</span>
                          <span className="flex items-center text-amber-500 font-semibold text-[10px]">
                            <Star className="h-3 w-3 fill-amber-400 mr-0.5" />
                            {cand.rating}.0
                          </span>
                        </div>

                        <div className="pt-1 flex items-center justify-between gap-1.5">
                          {stage.id === 'interview' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-[11px] px-2 flex-1 font-normal"
                              onClick={() => {
                                setSelectedCandidate(cand);
                                setInterviewModalOpen(true);
                              }}
                            >
                              <Calendar className="h-3 w-3 mr-1 text-stone-400" />
                              Schedule
                            </Button>
                          )}
                          {stage.id !== 'hired' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-[11px] px-2 flex-1 hover:bg-stone-900 hover:text-white hover:border-stone-900 font-medium transition-all"
                              onClick={() => handleAdvanceStage(cand.id, cand.stage)}
                            >
                              Advance <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {stageCandidates.length === 0 && (
                      <div className="text-center py-10 text-[11px] text-stone-400 italic">
                        No candidates
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab 2: Job Requisitions */}
        <TabsContent value="jobs">
          <div className="rounded-xl border border-[#e6e3da] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-4 border-b border-[#f0ede6]">
              <h3 className="text-xs sm:text-[13px] font-semibold text-stone-900">Active Job Vacancies</h3>
              <p className="text-[11px] text-stone-400 mt-0.5">Departmental requisitions currently accepting applications</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-800">
                <thead className="bg-[#faf9f5] text-[11px] font-semibold text-stone-500 border-b border-[#e6e3da]">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold text-stone-600">Position Title</th>
                    <th className="px-4 py-2.5 font-semibold text-stone-600">Department</th>
                    <th className="px-4 py-2.5 font-semibold text-stone-600">Location</th>
                    <th className="px-4 py-2.5 font-semibold text-stone-600">Openings</th>
                    <th className="px-4 py-2.5 font-semibold text-stone-600">Applicants</th>
                    <th className="px-4 py-2.5 font-semibold text-stone-600">Status</th>
                    <th className="px-4 py-2.5 font-semibold text-right text-stone-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2efe8]">
                  {tenantRequisitions.map((job) => (
                    <tr key={job.id} className="hover:bg-[#faf9f5]/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-stone-900">{job.title}</td>
                      <td className="px-4 py-3 text-stone-600">{job.department}</td>
                      <td className="px-4 py-3 text-stone-600">{job.location}</td>
                      <td className="px-4 py-3 font-medium text-stone-800">{job.openings}</td>
                      <td className="px-4 py-3 font-medium text-stone-900">{job.applicantsCount} Applicants</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={job.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => alert(`Viewing applicants pipeline for ${job.title}`)}
                          >
                            View Candidates
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        </TabsContent>
      </Tabs>

      {/* Post Requisition Modal */}
      <Dialog open={newJobModal} onOpenChange={setNewJobModal}>
        <DialogHeader>
          <DialogTitle>Create Job Requisition</DialogTitle>
          <DialogDescription>Draft and publish a new hiring opening</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Position Title</label>
            <Input
              placeholder="e.g. Lead Mobile Engineer (React Native)"
              value={newJobTitle}
              onChange={(e) => setNewJobTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
            <select
              value={newJobDept}
              onChange={(e) => setNewJobDept(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm"
            >
              <option>Software Engineering</option>
              <option>Product & Design</option>
              <option>Human Resources & Talent</option>
              <option>Enterprise Sales & Growth</option>
              <option>Finance & Compliance</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setNewJobModal(false)}>Cancel</Button>
          <Button onClick={handleCreateJob}>Publish Requisition</Button>
        </DialogFooter>
      </Dialog>

      {/* Schedule Interview Modal */}
      <Dialog open={interviewModalOpen} onOpenChange={setInterviewModalOpen}>
        <DialogHeader>
          <DialogTitle>Schedule Candidate Interview</DialogTitle>
          <DialogDescription>
            Book an interview slot with {selectedCandidate?.name} for {selectedCandidate?.jobTitle}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Interview Date</label>
              <Input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
              <Input
                type="time"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Interview Type</label>
            <select className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm">
              <option>Google Meet (Video Conference)</option>
              <option>In-Person Technical Round (HQ Office)</option>
              <option>Screening Phone Call</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setInterviewModalOpen(false)}>Cancel</Button>
          <Button onClick={handleScheduleInterview}>Send Calendar Invite</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
