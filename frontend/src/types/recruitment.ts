export enum CandidateStage {
  APPLIED = 'applied',
  SCREENING = 'screening',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  HIRED = 'hired',
  REJECTED = 'rejected',
}

export interface Candidate {
  id: string
  fullName: string
  email: string
  phone?: string
  position: string
  source: string
  stage: CandidateStage
  score?: number
  appliedAt: string
  updatedAt: string
  recruiter?: string
  notes?: string
}

export interface RecruitmentForm {
  position: string
  department: string
  location: string
  employmentType: 'full-time' | 'part-time' | 'contract'
  description: string
  requirements: string[]
  salaryRange?: string
  closingDate?: string
}

export interface CandidateFilters {
  query: string
  stage: 'all' | CandidateStage
  position: 'all' | string
  source: 'all' | string
  sort: 'newest' | 'oldest' | 'score-desc' | 'score-asc'
}
