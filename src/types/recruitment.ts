export type CandidateStage = 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';

export interface JobRequisition {
  id: string;
  organizationId: string;
  title: string;
  department: string;
  location: string;
  openings: number;
  applicantsCount: number;
  status: 'active' | 'draft' | 'closed';
  postedDate: string;
}

export interface Candidate {
  id: string;
  organizationId: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  stage: CandidateStage;
  appliedDate: string;
  experienceYears: number;
  rating: number; // 1-5
}
