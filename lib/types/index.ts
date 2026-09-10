export type Role = 'ADMIN' | 'STUDENT' | 'COMPANY';

export type Mode = 'REMOTE' | 'HYBRID' | 'ONSITE';

export type AllocationStatus = 'ALLOCATED' | 'ACCEPTED' | 'REJECTED' | 'UNALLOCATED';

export type PublicationStatus = 'DRAFT' | 'PREVIEWED' | 'PUBLISHED';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  studentId?: string;
  companyId?: string;
}

export interface StudentData {
  id: string;
  userId: string;
  name: string;
  email: string;
  rollNumber: string;
  branch: string;
  year: number;
  graduationYear?: number;
  cgpa: number;
  skills: string[];
  experienceMonths?: number;
  experienceSummary?: string;
  resumeUrl?: string | null;
  preferencesLocked?: boolean;
  preferences?: PreferenceData[];
  allocation?: AllocationData | null;
  createdAt?: string | Date;
}

export interface CompanyData {
  id: string;
  userId?: string | null;
  name: string;
  description: string;
  logoUrl?: string | null;
  website?: string | null;
  industry?: string;
  location?: string;
  internships?: InternshipData[];
  createdAt?: string | Date;
}

export interface InternshipData {
  id: string;
  companyId: string;
  companyName?: string;
  companyLogo?: string | null;
  title: string;
  description: string;
  location: string;
  mode: Mode;
  stipend: number;
  duration: string;
  minimumCGPA: number;
  allowedBranches: string[];
  requiredSkills: string[];
  totalSeats: number;
  availableSeats: number;
  applicationDeadline: string | Date;
  status?: 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
  createdAt?: string | Date;
}

export interface PreferenceData {
  id: string;
  studentId: string;
  internshipId: string;
  rank: number; // 1-based ranking (1 is highest priority)
  internship?: InternshipData;
}

export interface MeritScoreBreakdown {
  skillScore: number;
  cgpaScore: number;
  experienceScore: number;
  branchScore: number;
  totalMeritScore: number;
  matchedSkills: string[];
  requiredSkills: string[];
}

export interface AllocationData {
  id: string;
  studentId: string;
  studentName?: string;
  studentRollNumber?: string;
  studentBranch?: string;
  studentCgpa?: number;
  internshipId: string;
  internshipTitle?: string;
  companyName?: string;
  score: number;
  preferenceRank: number;
  skillMatchScore: number;
  cgpaScore: number;
  experienceScore?: number;
  branchScore?: number;
  meritBreakdown?: MeritScoreBreakdown;
  rankWithinQuota?: number;
  totalSeats?: number;
  status: AllocationStatus;
  allocatedAt: string | Date;
  explanationReasons?: string[];
}

export interface AlgorithmWeights {
  // Legacy compatibility weights
  preferenceWeight?: number;
  // Standard AoA Merit weights (Summing to 1.0)
  skillWeight: number;       // default 0.40 (40%)
  cgpaWeight: number;        // default 0.30 (30%)
  experienceWeight: number;  // default 0.20 (20%)
  branchWeight: number;      // default 0.10 (10%)
  minSkillMatchRatio?: number; // default 0.0 (allow partial match)
}

export interface CandidatePair {
  studentId: string;
  studentName: string;
  studentRollNumber: string;
  studentBranch: string;
  studentCgpa: number;
  internshipId: string;
  internshipTitle: string;
  companyName: string;
  preferenceRank: number;
  preferenceScore: number;
  cgpaScore: number;
  skillMatchScore: number;
  experienceScore?: number;
  branchScore?: number;
  matchedSkills: string[];
  requiredSkills: string[];
  totalScore: number;
  allocated: boolean;
  rejectionReason?: string;
}

export interface ProposalStep {
  stepNumber: number;
  round: number;
  studentId: string;
  studentName: string;
  internshipId: string;
  internshipTitle: string;
  companyName: string;
  action: 'PROPOSE' | 'ACCEPT_PROVISIONALLY' | 'REJECT_EXCESS' | 'HELD';
  meritScore: number;
  displacedStudentName?: string;
  message: string;
}

export interface AlgorithmStats {
  totalStudents: number;
  eligibleStudents: number;
  totalInternships: number;
  totalSeats: number;
  totalEligiblePairs: number;
  eligiblePreferenceRelationships: number;
  totalProposals: number;
  totalAllocated: number;
  totalUnallocated: number;
  allocationRate: number; // percentage
  seatUtilization: number; // percentage
  averageScore: number;
  averagePreferenceRank: number;
  executionTimeMs: number;
  firstPreferenceAllocatedCount: number;
  secondPreferenceAllocatedCount: number;
  thirdPreferenceAllocatedCount: number;
  topThreePreferencesAllocatedCount: number;
  stabilityVerified: boolean;
  blockingPairsCount: number;
  branchDistribution: Record<string, number>;
  companyUtilization: Record<string, { filled: number; total: number }>;
}

export interface AlgorithmResult {
  algorithmName: string;
  algorithmVersion: string;
  allocations: AllocationData[];
  unallocatedStudents: {
    id: string;
    name: string;
    rollNumber: string;
    branch: string;
    cgpa: number;
    reason: string;
    unmetPreferences?: {
      rank: number;
      internshipTitle: string;
      companyName: string;
      reason: string;
    }[];
  }[];
  candidatePairs: CandidatePair[];
  steps?: ProposalStep[];
  stats: AlgorithmStats;
  weights: AlgorithmWeights;
  timestamp: string;
  published: boolean;
}

export interface AllocationRunRecord {
  id: string;
  algorithmName: string;
  algorithmVersion: string;
  status: PublicationStatus;
  startedAt: string;
  completedAt: string;
  executionTimeMs: number;
  totalStudents: number;
  totalAllocated: number;
  totalProposals: number;
  weights: AlgorithmWeights;
  metrics: AlgorithmStats;
  executedBy: string;
  publishedAt?: string | null;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  details: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALLOCATION';
  timestamp: string;
  read: boolean;
  link?: string;
}
