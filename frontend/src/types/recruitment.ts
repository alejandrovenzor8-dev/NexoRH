/**
 * ENUMS
 */

export enum CandidateStage {
  APPLIED = 'applied',
  SCREENING = 'screening',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  HIRED = 'hired',
  REJECTED = 'rejected',
}

export enum CandidatePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum CandidateSource {
  LINKEDIN = 'linkedin',
  INDEED = 'indeed',
  REFERRAL = 'referral',
  WEBSITE = 'website',
  EMAIL = 'email',
  OTHER = 'other',
}

export enum InterviewType {
  PHONE = 'phone',
  VIDEO = 'video',
  IN_PERSON = 'in-person',
  PANEL = 'panel',
}

/**
 * TIPOS PRINCIPALES
 */

export interface Candidate {
  id: string
  fullName: string
  email: string
  phone?: string
  avatar?: string
  position: string
  source: CandidateSource
  stage: CandidateStage
  priority: CandidatePriority
  score?: number
  rating?: number // 1-5
  tags?: string[]
  appliedAt: string
  updatedAt: string
  recruiter?: string
  notes?: string
  cvUrl?: string
  linkedinUrl?: string
}

export interface Interview {
  id: string
  candidateId: string
  type: InterviewType
  date: string
  time?: string
  interviewer?: string
  notes?: string
  feedback?: string
  result?: 'pending' | 'pass' | 'fail'
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

export interface RecruitmentStats {
  newApplications: number
  inReview: number
  interviews: number
  selected: number
  totalCandidates: number
  avgScore: number
}

export interface CandidateFilters {
  query: string
  stage: 'all' | CandidateStage
  position: 'all' | string
  source: 'all' | CandidateSource
  priority: 'all' | CandidatePriority
  sort: 'newest' | 'oldest' | 'score-desc' | 'score-asc'
}

/**
 * TIPOS PARA UI
 */

export interface CandidateCardProps {
  candidate: Candidate
  onViewProfile: (id: string) => void
  onChangeStage: (id: string, stage: CandidateStage) => void
  onScheduleInterview: (id: string) => void
  onReject: (id: string) => void
  onHire: (id: string) => void
  isDragging?: boolean
}
