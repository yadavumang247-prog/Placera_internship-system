export type Role = 'ADMIN' | 'STUDENT' | 'COMPANY';

export type Mode = 'REMOTE' | 'HYBRID' | 'ONSITE';

export type AllocationStatus = 'ALLOCATED' | 'ACCEPTED' | 'REJECTED';

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
  cgpa: number;
  skills: string[];
  resumeUrl?: string | null;
  preferences?: PreferenceData[];
  allocation?: AllocationData | null;
}

export interface CompanyData {
  id: string;
  userId?: string | null;
  name: string;
  description: string;
  logoUrl?: string | null;
  website?: string | null;
  internships?: InternshipData[];
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
  requiredSkills: string[];
  totalSeats: number;
  availableSeats: number;
  applicationDeadline: string | Date;
}

export interface PreferenceData {
  id: string;
  studentId: string;
  internshipId: string;
  rank: number;
  internship?: InternshipData;
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
  status: AllocationStatus;
  allocatedAt: string | Date;
}

export interface AlgorithmWeights {
  preferenceWeight: number; // e.g. 0.40
  cgpaWeight: number;       // e.g. 0.30
  skillWeight: number;      // e.g. 0.30
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
  matchedSkills: string[];
  requiredSkills: string[];
  totalScore: number;
  allocated: boolean;
  rejectionReason?: string;
}

export interface AlgorithmResult {
  allocations: AllocationData[];
  unallocatedStudents: {
    id: string;
    name: string;
    rollNumber: string;
    branch: string;
    cgpa: number;
    reason: string;
  }[];
  candidatePairs: CandidatePair[];
  stats: {
    totalStudents: number;
    totalInternships: number;
    totalSeats: number;
    totalEligiblePairs: number;
    totalAllocated: number;
    totalUnallocated: number;
    allocationRate: number; // percentage
    averageScore: number;
    averagePreferenceRank: number;
    executionTimeMs: number;
    firstPreferenceAllocatedCount: number;
    topThreePreferencesAllocatedCount: number;
    branchDistribution: Record<string, number>;
    companyUtilization: Record<string, { filled: number; total: number }>;
  };
  weights: AlgorithmWeights;
  timestamp: string;
}
