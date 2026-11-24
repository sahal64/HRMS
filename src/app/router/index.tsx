import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/app/layouts/AppLayout';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { OrganizationPage } from '@/features/organization/pages/OrganizationPage';
import { AttendancePage } from '@/features/attendance/pages/AttendancePage';
import { LeavePage } from '@/features/leave/pages/LeavePage';
import { SelfServicePage } from '@/features/self-service/pages/SelfServicePage';
import { RecruitmentPage } from '@/features/recruitment/pages/RecruitmentPage';
import { PayrollPage } from '@/features/payroll/pages/PayrollPage';
import { ExpensesPage } from '@/features/expenses/pages/ExpensesPage';
import { ProjectsPage } from '@/features/projects/pages/ProjectsPage';
import { AdminPage } from '@/features/administration/pages/AdminPage';
import { CelebrationsPage } from '@/features/celebrations/pages/CelebrationsPage';
import { EmployeesPage } from '@/features/employees/pages/EmployeesPage';
import { PerformancePage } from '@/features/performance/pages/PerformancePage';
import { ModulePlaceholderPage } from '@/features/common/ModulePlaceholderPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'employees', element: <EmployeesPage /> },
      { path: 'self-service', element: <SelfServicePage /> },
      { path: 'organization', element: <OrganizationPage /> },
      { path: 'recruitment', element: <RecruitmentPage /> },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'leave', element: <LeavePage /> },
      { path: 'payroll', element: <PayrollPage /> },
      { path: 'expenses', element: <ExpensesPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'admin', element: <AdminPage /> },
      { path: 'celebrations', element: <CelebrationsPage /> },

      // Module 03: Manpower Planning
      {
        path: 'manpower',
        element: (
          <ModulePlaceholderPage
            moduleKey="manpower"
            title="Manpower Planning"
            description="Workforce budget forecasting, vacancy monitoring, and planned vs. actual headcount analysis"
            phase="Workforce"
            tableHeaders={['Department / Squad', 'Planned Headcount', 'Current Actual', 'Open Variance']}
            sampleRecords={[
              { id: '1', col1: 'Software Engineering', col2: '65 Engineers', col3: '58 Active', status: '-7 Vacant' },
              { id: '2', col1: 'Product & Design', col2: '28 Specialists', col3: '24 Active', status: '-4 Vacant' },
              { id: '3', col1: 'Human Resources & Talent', col2: '15 Staff', col3: '14 Active', status: '-1 Vacant' },
              { id: '4', col1: 'Enterprise Sales', col2: '30 Reps', col3: '30 Active', status: 'Balanced' },
            ]}
            actionButtonText="Draft Plan"
          />
        ),
      },

      // Module 06: Onboarding & Joining
      {
        path: 'onboarding',
        element: (
          <ModulePlaceholderPage
            moduleKey="onboarding"
            title="Onboarding & Joining"
            description="New hire orientation pipelines, IT asset provisioning, and statutory document collection"
            phase="People Ops"
            tableHeaders={['Joiner Name', 'Designation', 'Joining Date', 'Checklist Progress']}
            sampleRecords={[
              { id: '1', col1: 'Nourhan El-Sayed', col2: 'Senior QA Automation Engineer', col3: 'Dec 01, 2026', status: '80% Done' },
              { id: '2', col1: 'Fahad Al-Dossary', col2: 'Account Executive', col3: 'Dec 05, 2026', status: 'Pending IT' },
              { id: '3', col1: 'Liam O’Connor', col2: 'DevOps Specialist', col3: 'Dec 10, 2026', status: 'Completed' },
            ]}
            actionButtonText="Initiate Onboarding"
          />
        ),
      },

      // Module 10: Statutory Compliance
      {
        path: 'compliance',
        element: (
          <ModulePlaceholderPage
            moduleKey="compliance"
            title="Statutory Compliance & Legal"
            description="Track labor law obligations, tax filing due dates, and mandatory corporate audit requirements"
            phase="Operations"
            tableHeaders={['Compliance Obligation', 'Authority', 'Due Date', 'Filing Status']}
            sampleRecords={[
              { id: '1', col1: 'Corporate Tax & VAT Return', col2: 'Federal Tax Authority', col3: 'Nov 30, 2026', status: 'In Review' },
              { id: '2', col1: 'WPS Wages Compliance File', col2: 'Ministry of Human Resources', col3: 'Dec 05, 2026', status: 'Compliant' },
              { id: '3', col1: 'Group Medical Health Policy', col2: 'Health Authority', col3: 'Dec 31, 2026', status: 'Scheduled' },
            ]}
            actionButtonText="Log Filing"
          />
        ),
      },

      // Module 13: KPI & Performance (Department KPI Dashboard)
      {
        path: 'performance',
        element: <PerformancePage />,
      },

      // Module 14: Learning & Development
      {
        path: 'learning',
        element: (
          <ModulePlaceholderPage
            moduleKey="learning"
            title="Learning & Development (L&D)"
            description="Upskilling courses, mandatory certifications, training programs, and career progression paths"
            phase="Growth"
            tableHeaders={['Course / Program', 'Instructor / Platform', 'Enrolled Staff', 'Completion Rate']}
            sampleRecords={[
              { id: '1', col1: 'SOC2 & ISO-27001 Security Training', col2: 'Internal Compliance Squad', col3: '142 Staff', status: '94% Certified' },
              { id: '2', col1: 'Advanced TypeScript Architecture', col2: 'Frontend Masterclass', col3: '24 Engineers', status: 'In Progress' },
              { id: '3', col1: 'People Management Coaching', col2: 'Leadership Academy', col3: '12 Managers', status: 'Completed' },
            ]}
            actionButtonText="Assign Course"
          />
        ),
      },

      // Module 15: Employee Engagement & Communication
      {
        path: 'engagement',
        element: (
          <ModulePlaceholderPage
            moduleKey="engagement"
            title="Employee Engagement & Communication"
            description="Broadcast company-wide announcements, conduct pulse surveys, and share culture updates"
            phase="Experience"
            tableHeaders={['Notice Title', 'Author / Org', 'Published Date', 'Engagement Reach']}
            sampleRecords={[
              { id: '1', col1: 'Annual Corporate Gala & Awards 2026', col2: 'People & Culture', col3: 'Yesterday', status: '128 Views' },
              { id: '2', col1: 'Flexible Hybrid Policy Guidelines', col2: 'Executive Committee', col3: 'Nov 12, 2026', status: '142 Acknowledged' },
              { id: '3', col1: 'Q3 Enterprise Performance Recognition', col2: 'Managing Director', col3: 'Nov 01, 2026', status: '85 Reactions' },
            ]}
            actionButtonText="Publish Notice"
          />
        ),
      },

      // Module 18: HR Documents & Letters
      {
        path: 'documents',
        element: (
          <ModulePlaceholderPage
            moduleKey="documents"
            title="HR Documents & Letters"
            description="Generate employment verification letters, salary certificates, and corporate policy contracts"
            phase="Experience"
            tableHeaders={['Document Title', 'Recipient / Employee', 'Generated Date', 'Status']}
            sampleRecords={[
              { id: '1', col1: 'Salary Certificate for Bank Application', col2: 'Zayd Kareem', col3: 'Nov 17, 2026', status: 'Issued' },
              { id: '2', col1: 'Official Embassy Visa Letter', col2: 'Amira Nasser', col3: 'Nov 14, 2026', status: 'Approved' },
              { id: '3', col1: 'Confidentiality & IP Agreement', col2: 'Elena Rostova', col3: 'Jul 01, 2023', status: 'Signed' },
            ]}
            actionButtonText="Generate Letter"
          />
        ),
      },

      // Module 19: Grievance & Employee Relations
      {
        path: 'grievances',
        element: (
          <ModulePlaceholderPage
            moduleKey="grievances"
            title="Grievance & Employee Relations"
            description="Confidential dispute logging, investigation timelines, and resolution workflows"
            phase="Relations"
            tableHeaders={['Case Reference', 'Category', 'Assigned Investigator', 'Resolution Status']}
            sampleRecords={[
              { id: '1', col1: 'CASE-2026-08', col2: 'Workplace Ergonomics Concern', col3: 'Sarah Al-Hashemi', status: 'Resolved' },
              { id: '2', col1: 'CASE-2026-09', col2: 'Inter-departmental Communication', col3: 'Tariq Mansour', status: 'In Review' },
            ]}
            actionButtonText="Log Case"
          />
        ),
      },

      // Module 20: Disciplinary & Policy Management
      {
        path: 'disciplinary',
        element: (
          <ModulePlaceholderPage
            moduleKey="disciplinary"
            title="Disciplinary & Policy Management"
            description="Maintain employee code of conduct, log disciplinary warnings, and track policy acknowledgments"
            phase="Governance"
            tableHeaders={['Policy Name', 'Version / Year', 'Category', 'Acknowledgment']}
            sampleRecords={[
              { id: '1', col1: 'Code of Business Conduct & Ethics', col2: 'v3.2 (2026)', col3: 'Corporate Governance', status: '98% Signed' },
              { id: '2', col1: 'Information Security & Access Policy', col2: 'v4.0 (2026)', col3: 'IT Security', status: '100% Signed' },
              { id: '3', col1: 'Remote & Hybrid Workplace Agreement', col2: 'v2.1', col3: 'People Operations', status: '96% Signed' },
            ]}
            actionButtonText="New Policy Revision"
          />
        ),
      },

      // Module 21: Asset & IT Handover
      {
        path: 'assets',
        element: (
          <ModulePlaceholderPage
            moduleKey="assets"
            title="Asset & IT Handover"
            description="Inventory company laptops, monitors, software licenses, and employee asset allocation"
            phase="Administration"
            tableHeaders={['Asset Tag / Serial', 'Hardware Model', 'Assigned Custodian', 'Asset Condition']}
            sampleRecords={[
              { id: '1', col1: 'AST-DXB-4091', col2: 'Apple MacBook Pro 16" M3 Max', col3: 'Tariq Mansour', status: 'Active' },
              { id: '2', col1: 'AST-DXB-4092', col2: 'Dell UltraSharp 32" 4K Monitor', col3: 'Elena Rostova', status: 'Active' },
              { id: '3', col1: 'AST-DXB-4095', col2: 'Lenovo ThinkPad X1 Carbon Gen 12', col3: 'Karim Fawzy', status: 'Active' },
              { id: '4', col1: 'AST-DXB-5011', col2: 'Apple MacBook Air 15" M3', col3: 'IT Inventory Pool', status: 'In Stock' },
            ]}
            actionButtonText="Register Asset"
          />
        ),
      },

      // Module 22: Exit & Settlement
      {
        path: 'exit-management',
        element: (
          <ModulePlaceholderPage
            moduleKey="exit-management"
            title="Exit & Full and Final Settlement (F&F)"
            description="Manage resignations, notice periods, departmental clearances, and final severance compensation"
            phase="Administration"
            tableHeaders={['Employee Name', 'Resignation Date', 'Last Working Day', 'Clearance Status']}
            sampleRecords={[
              { id: '1', col1: 'Hany Mahmoud', col2: 'Nov 01, 2026', col3: 'Nov 30, 2026', status: 'IT Clearance' },
              { id: '2', col1: 'Jessica Vance', col2: 'Oct 20, 2026', col3: 'Nov 19, 2026', status: 'Completed' },
            ]}
            actionButtonText="Initiate Exit"
          />
        ),
      },

      // Module 23: HR Reports & Analytics
      {
        path: 'reports',
        element: (
          <ModulePlaceholderPage
            moduleKey="reports"
            title="HR Reports & Workforce Analytics"
            description="Generate executive reporting packages, attrition analysis, attendance ratios, and recruitment funnels"
            phase="Analytics"
            tableHeaders={['Report Name', 'Frequency', 'Format', 'Status']}
            sampleRecords={[
              { id: '1', col1: 'Monthly Headcount & Turnover Ratio', col2: 'Monthly', col3: 'PDF & CSV', status: 'Generated' },
              { id: '2', col1: 'Quarterly Attendance & Lateness Audit', col2: 'Quarterly', col3: 'Excel / CSV', status: 'Ready' },
              { id: '3', col1: 'Annual Statutory Compensation Ledger', col2: 'Yearly', col3: 'PDF Audit Package', status: 'Scheduled' },
            ]}
            actionButtonText="Generate Report"
          />
        ),
      },

      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
