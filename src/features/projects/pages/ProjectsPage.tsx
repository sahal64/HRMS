import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Avatar } from '@/components/ui/avatar';
import { useOrganization } from '@/app/providers/OrganizationContext';
import { Kanban, Plus, Calendar, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface Task {
  id: string;
  organizationId: string;
  title: string;
  projectName: string;
  assignedToName: string;
  assignedToAvatar: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'review' | 'completed';
}

const INITIAL_TASKS: Task[] = [
  // OSFORH
  {
    id: 'tsk-1',
    organizationId: 'org-osforh',
    title: 'Migrate HRMS Frontend state to Tenant Context',
    projectName: 'Core HRMS 2.0',
    assignedToName: 'Tariq Mansour',
    assignedToAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    dueDate: '2026-11-28',
    priority: 'high',
    status: 'in_progress',
  },
  {
    id: 'tsk-2',
    organizationId: 'org-osforh',
    title: 'Design UI for Disciplinary and Grievance Workflows',
    projectName: 'Enterprise Experience',
    assignedToName: 'Elena Rostova',
    assignedToAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    dueDate: '2026-11-30',
    priority: 'medium',
    status: 'todo',
  },
  {
    id: 'tsk-3',
    organizationId: 'org-osforh',
    title: 'Configure Attendance Geofencing Algorithm',
    projectName: 'Core HRMS 2.0',
    assignedToName: 'Amira Nasser',
    assignedToAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    dueDate: '2026-11-22',
    priority: 'high',
    status: 'review',
  },
  {
    id: 'tsk-4',
    organizationId: 'org-osforh',
    title: 'Finalize Q3 Audited Financial Statements',
    projectName: 'Corporate Governance',
    assignedToName: 'Karim Fawzy',
    assignedToAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    dueDate: '2026-11-15',
    priority: 'medium',
    status: 'completed',
  },

  // Acme
  {
    id: 'tsk-acm-1',
    organizationId: 'org-acme',
    title: 'Deploy Multi-Region Kubernetes Cluster',
    projectName: 'Cloud Infra 2026',
    assignedToName: 'Marcus Vance',
    assignedToAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    dueDate: '2026-11-27',
    priority: 'high',
    status: 'in_progress',
  },

  // Nova
  {
    id: 'tsk-nov-1',
    organizationId: 'org-nova',
    title: 'Rotterdam Port API Connector Integration',
    projectName: 'Logistics Stream',
    assignedToName: 'Arthur Pendleton',
    assignedToAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    dueDate: '2026-12-04',
    priority: 'high',
    status: 'in_progress',
  },
];

const COLUMNS: { id: Task['status']; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'In Review' },
  { id: 'completed', label: 'Completed' },
];

export const ProjectsPage: React.FC = () => {
  const { currentOrganization } = useOrganization();
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [modalOpen, setModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskProject, setTaskProject] = useState('Core HRMS 2.0');
  const [taskPriority, setTaskPriority] = useState<Task['priority']>('medium');

  const tenantTasks = tasks.filter(
    (t) => t.organizationId === currentOrganization.id
  );

  const handleAdvanceStatus = (taskId: string, currentStatus: Task['status']) => {
    const nextMap: Record<Task['status'], Task['status']> = {
      todo: 'in_progress',
      in_progress: 'review',
      review: 'completed',
      completed: 'todo',
    };
    const next = nextMap[currentStatus];
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: next } : t))
    );
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    const newTask: Task = {
      id: `tsk-${Date.now()}`,
      organizationId: currentOrganization.id,
      title: taskTitle,
      projectName: taskProject,
      assignedToName: 'Tariq Mansour',
      assignedToAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      priority: taskPriority,
      status: 'todo',
    };

    setTasks([newTask, ...tasks]);
    setModalOpen(false);
    setTaskTitle('');
    alert(`Task "${taskTitle}" created!`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project & Task Management"
        description={`Sprint boards, deliverables, milestones, and employee workload tracking for ${currentOrganization.name}.`}
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Projects & Tasks' }]}
        actions={
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Create Task
          </Button>
        }
      />

      {/* Kanban Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = tenantTasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                  {col.label}
                </span>
                <span className="text-xs font-semibold bg-white text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {colTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2 hover:border-primary-400 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">
                        {t.projectName}
                      </span>
                      <StatusBadge status={t.priority} />
                    </div>

                    <p className="text-xs font-semibold text-slate-900 leading-snug">{t.title}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Avatar src={t.assignedToAvatar} fallback={t.assignedToName} size="xs" />
                        <span className="truncate max-w-[80px]">{t.assignedToName.split(' ')[0]}</span>
                      </div>
                      <span className="flex items-center gap-1 font-mono text-[10px]">
                        <Clock className="h-3 w-3" /> {t.dueDate}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full h-7 text-[11px] mt-2"
                      onClick={() => handleAdvanceStatus(t.id, t.status)}
                    >
                      {col.id === 'completed' ? 'Re-open Task' : 'Advance →'}
                    </Button>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-400 italic">
                    No tasks in this lane
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Creation Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogHeader>
          <DialogTitle>Create Project Task</DialogTitle>
          <DialogDescription>Assign a new deliverable item</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateTask} className="space-y-3 py-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title</label>
            <Input
              placeholder="e.g. Conduct compliance audit on employee contracts"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Project</label>
            <Input
              placeholder="e.g. Core HRMS 2.0"
              value={taskProject}
              onChange={(e) => setTaskProject(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value as Task['priority'])}
              className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Task</Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};
