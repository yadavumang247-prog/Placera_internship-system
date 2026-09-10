import { prisma } from './prisma';
import {
  StudentData,
  CompanyData,
  InternshipData,
  PreferenceData,
  AllocationData,
  AlgorithmWeights,
  AlgorithmResult,
  AllocationRunRecord,
  AuditLog,
  NotificationItem,
  PublicationStatus,
} from '../types';
import {
  INITIAL_COMPANIES,
  INITIAL_INTERNSHIPS,
  INITIAL_STUDENTS,
  INITIAL_PREFERENCES,
} from './seedData';
import { runGaleShapleyAllocation } from '../algorithm/galeShapley';
import { runGreedyAllocation } from '../algorithm/greedyAllocation';
import { DEFAULT_MERIT_WEIGHTS } from '../algorithm/meritCalculator';

// In-Memory Reactive Store (Full Local High-Performance Mode)
class MemoryStore {
  companies: CompanyData[] = [...INITIAL_COMPANIES];
  internships: InternshipData[] = [...INITIAL_INTERNSHIPS];
  students: StudentData[] = [...INITIAL_STUDENTS];
  preferences: PreferenceData[] = [...INITIAL_PREFERENCES];
  allocations: AllocationData[] = [];
  lastAlgorithmResult: AlgorithmResult | null = null;
  confirmedResult: AlgorithmResult | null = null;
  weights: AlgorithmWeights = { ...DEFAULT_MERIT_WEIGHTS };
  isPreferencesLocked: boolean = true;
  publicationStatus: PublicationStatus = 'PUBLISHED'; // Set to published by default for rich initial demo exploration
  allocationRuns: AllocationRunRecord[] = [];
  auditLogs: AuditLog[] = [
    {
      id: 'log_init',
      action: 'SYSTEM_INITIALIZATION',
      performedBy: 'System Administrator',
      details: 'SMARTINTERN Placement Portal initialized with 20 student profiles and 10 corporate tracks.',
      timestamp: new Date().toISOString(),
    },
  ];
  notifications: NotificationItem[] = [
    {
      id: 'notif_welcome',
      title: 'Welcome to SMARTINTERN',
      message: 'Placement cycle 2025–26 preference ranking window is currently open.',
      type: 'INFO',
      timestamp: new Date().toISOString(),
      read: false,
      link: '/student/preferences',
    },
  ];

  constructor() {
    this.executeInitialMatching();
  }

  executeInitialMatching() {
    const result = runGaleShapleyAllocation(
      this.students,
      this.internships,
      this.preferences,
      this.weights
    );
    result.published = true;
    this.allocations = result.allocations;
    this.lastAlgorithmResult = result;
    this.confirmedResult = result;

    this.allocationRuns.push({
      id: 'run_baseline_01',
      algorithmName: result.algorithmName,
      algorithmVersion: result.algorithmVersion,
      status: 'PUBLISHED',
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 3598000).toISOString(),
      executionTimeMs: result.stats.executionTimeMs,
      totalStudents: result.stats.totalStudents,
      totalAllocated: result.stats.totalAllocated,
      totalProposals: result.stats.totalProposals,
      weights: { ...this.weights },
      metrics: result.stats,
      executedBy: 'Dean of Placements',
      publishedAt: new Date().toISOString(),
    });
  }
}

const globalForStore = globalThis as unknown as {
  memoryStore: MemoryStore | undefined;
};

export const memoryStore = globalForStore.memoryStore ?? new MemoryStore();
if (process.env.NODE_ENV !== 'production') {
  globalForStore.memoryStore = memoryStore;
}

export const dataService = {
  // --- Students ---
  async getStudents(): Promise<StudentData[]> {
    const allocMap = new Map(memoryStore.allocations.map((a) => [a.studentId, a]));
    return memoryStore.students.map((s) => ({
      ...s,
      preferencesLocked: memoryStore.isPreferencesLocked,
      allocation: memoryStore.publicationStatus === 'PUBLISHED' ? allocMap.get(s.id) || null : null,
      preferences: memoryStore.preferences
        .filter((p) => p.studentId === s.id)
        .sort((a, b) => a.rank - b.rank)
        .map((p) => ({
          ...p,
          internship: memoryStore.internships.find((i) => i.id === p.internshipId),
        })),
    }));
  },

  async getStudentById(id: string): Promise<StudentData | null> {
    const students = await this.getStudents();
    return (
      students.find((s) => s.id === id || s.userId === id || s.email === id || s.rollNumber === id) ||
      null
    );
  },

  async updateStudentProfile(
    studentId: string,
    updates: Partial<StudentData>
  ): Promise<StudentData | null> {
    const idx = memoryStore.students.findIndex((s) => s.id === studentId || s.userId === studentId);
    if (idx === -1) return null;

    memoryStore.students[idx] = {
      ...memoryStore.students[idx],
      ...updates,
      skills: updates.skills ?? memoryStore.students[idx].skills,
    };

    memoryStore.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'STUDENT_PROFILE_UPDATE',
      performedBy: memoryStore.students[idx].name,
      details: `Profile updated: CGPA ${memoryStore.students[idx].cgpa}, Branch ${memoryStore.students[idx].branch}`,
      timestamp: new Date().toISOString(),
    });

    return memoryStore.students[idx];
  },

  // --- Companies ---
  async getCompanies(): Promise<CompanyData[]> {
    return memoryStore.companies.map((c) => ({
      ...c,
      internships: memoryStore.internships.filter((i) => i.companyId === c.id),
    }));
  },

  async getCompanyById(id: string): Promise<CompanyData | null> {
    const companies = await this.getCompanies();
    return companies.find((c) => c.id === id || c.userId === id) || null;
  },

  // --- Internships ---
  async getInternships(): Promise<InternshipData[]> {
    return memoryStore.internships.map((i) => {
      const company = memoryStore.companies.find((c) => c.id === i.companyId);
      return {
        ...i,
        companyName: company?.name || i.companyName || 'Partner Company',
        companyLogo: company?.logoUrl || i.companyLogo,
      };
    });
  },

  async getInternshipById(id: string): Promise<InternshipData | null> {
    const internships = await this.getInternships();
    return internships.find((i) => i.id === id) || null;
  },

  async createInternship(data: Omit<InternshipData, 'id'>): Promise<InternshipData> {
    const newInternship: InternshipData = {
      ...data,
      id: `int_${Date.now()}`,
      availableSeats: data.totalSeats,
      status: 'ACTIVE',
    };
    memoryStore.internships.push(newInternship);

    memoryStore.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'INTERNSHIP_CREATED',
      performedBy: 'Corporate Recruiter',
      details: `Created new internship role '${newInternship.title}' with ${newInternship.totalSeats} seats.`,
      timestamp: new Date().toISOString(),
    });

    return newInternship;
  },

  async updateInternship(id: string, updates: Partial<InternshipData>): Promise<InternshipData | null> {
    const idx = memoryStore.internships.findIndex((i) => i.id === id);
    if (idx === -1) return null;

    memoryStore.internships[idx] = {
      ...memoryStore.internships[idx],
      ...updates,
    };
    return memoryStore.internships[idx];
  },

  // --- Preferences ---
  async getPreferences(studentId?: string): Promise<PreferenceData[]> {
    const filtered = studentId
      ? memoryStore.preferences.filter((p) => p.studentId === studentId)
      : memoryStore.preferences;

    return filtered
      .sort((a, b) => a.rank - b.rank)
      .map((p) => ({
        ...p,
        internship: memoryStore.internships.find((i) => i.id === p.internshipId),
      }));
  },

  async savePreferences(studentId: string, internshipIds: string[]): Promise<PreferenceData[]> {
    if (memoryStore.isPreferencesLocked) {
      throw new Error('Preferences are currently locked by the placement administration.');
    }

    // Remove old preferences for this student
    memoryStore.preferences = memoryStore.preferences.filter((p) => p.studentId !== studentId);

    // Insert new ranked preferences
    const newPrefs: PreferenceData[] = internshipIds.map((id, index) => ({
      id: `pref_${studentId}_${index + 1}_${Date.now()}`,
      studentId,
      internshipId: id,
      rank: index + 1,
    }));

    memoryStore.preferences.push(...newPrefs);

    memoryStore.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'PREFERENCES_SUBMITTED',
      performedBy: studentId,
      details: `Submitted ${newPrefs.length} ranked preferences.`,
      timestamp: new Date().toISOString(),
    });

    return this.getPreferences(studentId);
  },

  async setPreferenceLock(locked: boolean, performedBy: string = 'Placement Admin'): Promise<boolean> {
    memoryStore.isPreferencesLocked = locked;
    memoryStore.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: locked ? 'PREFERENCES_LOCKED' : 'PREFERENCES_UNLOCKED',
      performedBy,
      details: locked
        ? 'Student preference ranking submission has been locked.'
        : 'Student preference ranking window has been re-opened.',
      timestamp: new Date().toISOString(),
    });
    return locked;
  },

  isPreferencesLocked(): boolean {
    return memoryStore.isPreferencesLocked;
  },

  // --- Allocation Workflow (Preview, Run, Publish, Audit) ---

  getPublicationStatus(): PublicationStatus {
    return memoryStore.publicationStatus;
  },

  /**
   * STEP 4 & 5: PREVIEW ALLOCATION (Does NOT publish to students)
   */
  async previewAllocation(
    weights?: AlgorithmWeights,
    algorithmType: 'GALE_SHAPLEY' | 'GREEDY' = 'GALE_SHAPLEY'
  ): Promise<AlgorithmResult> {
    const w = weights ? { ...memoryStore.weights, ...weights } : memoryStore.weights;
    memoryStore.weights = w;

    const result =
      algorithmType === 'GREEDY'
        ? runGreedyAllocation(memoryStore.students, memoryStore.internships, memoryStore.preferences, w)
        : runGaleShapleyAllocation(memoryStore.students, memoryStore.internships, memoryStore.preferences, w);

    result.published = false;
    memoryStore.lastAlgorithmResult = result;
    memoryStore.publicationStatus = 'PREVIEWED';

    memoryStore.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'ALLOCATION_PREVIEW',
      performedBy: 'Placement Admin',
      details: `Generated allocation preview using ${result.algorithmName} (${result.stats.totalAllocated} allocated, ${result.stats.totalProposals} proposals).`,
      timestamp: new Date().toISOString(),
    });

    return result;
  },

  /**
   * STEP 6 & 7: RUN / CONFIRM ALLOCATION (Persists confirmed matching, status = DRAFT until published)
   */
  async runAllocation(
    weights?: AlgorithmWeights,
    algorithmType: 'GALE_SHAPLEY' | 'GREEDY' = 'GALE_SHAPLEY',
    executedBy: string = 'Placement Admin'
  ): Promise<AlgorithmResult> {
    const w = weights ? { ...memoryStore.weights, ...weights } : memoryStore.weights;
    memoryStore.weights = w;

    const result =
      algorithmType === 'GREEDY'
        ? runGreedyAllocation(memoryStore.students, memoryStore.internships, memoryStore.preferences, w)
        : runGaleShapleyAllocation(memoryStore.students, memoryStore.internships, memoryStore.preferences, w);

    result.published = false;
    memoryStore.confirmedResult = result;
    memoryStore.lastAlgorithmResult = result;
    memoryStore.allocations = result.allocations;
    memoryStore.publicationStatus = 'DRAFT';

    const runRecord: AllocationRunRecord = {
      id: `run_${Date.now()}`,
      algorithmName: result.algorithmName,
      algorithmVersion: result.algorithmVersion,
      status: 'DRAFT',
      startedAt: new Date(Date.now() - result.stats.executionTimeMs).toISOString(),
      completedAt: new Date().toISOString(),
      executionTimeMs: result.stats.executionTimeMs,
      totalStudents: result.stats.totalStudents,
      totalAllocated: result.stats.totalAllocated,
      totalProposals: result.stats.totalProposals,
      weights: { ...w },
      metrics: result.stats,
      executedBy,
    };

    memoryStore.allocationRuns.unshift(runRecord);

    memoryStore.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'ALLOCATION_RUN_CONFIRMED',
      performedBy: executedBy,
      details: `Executed and confirmed ${result.algorithmName} run (${result.stats.totalAllocated} matches generated). Awaiting publication.`,
      timestamp: new Date().toISOString(),
    });

    return result;
  },

  /**
   * STEP 8: PUBLISH RESULTS (Students and companies can now view verified results)
   */
  async publishAllocation(publishedBy: string = 'Placement Admin'): Promise<AlgorithmResult> {
    if (!memoryStore.confirmedResult && !memoryStore.lastAlgorithmResult) {
      await this.runAllocation(undefined, 'GALE_SHAPLEY', publishedBy);
    }

    const current = memoryStore.confirmedResult || memoryStore.lastAlgorithmResult!;
    current.published = true;
    memoryStore.publicationStatus = 'PUBLISHED';

    if (memoryStore.allocationRuns.length > 0) {
      memoryStore.allocationRuns[0].status = 'PUBLISHED';
      memoryStore.allocationRuns[0].publishedAt = new Date().toISOString();
    }

    memoryStore.auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'RESULTS_PUBLISHED',
      performedBy: publishedBy,
      details: `Official allocation results published to ${memoryStore.students.length} students and ${memoryStore.companies.length} employers.`,
      timestamp: new Date().toISOString(),
    });

    // Notify all students
    memoryStore.notifications.unshift({
      id: `notif_${Date.now()}`,
      title: 'Allocation Results Published',
      message: 'The official internship allocations have been verified and published by the placement cell.',
      type: 'ALLOCATION',
      timestamp: new Date().toISOString(),
      read: false,
      link: '/student/result',
    });

    return current;
  },

  async getLatestResult(): Promise<AlgorithmResult> {
    if (!memoryStore.lastAlgorithmResult) {
      return this.previewAllocation();
    }
    return memoryStore.lastAlgorithmResult;
  },

  async getAllocationRuns(): Promise<AllocationRunRecord[]> {
    return memoryStore.allocationRuns;
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    return memoryStore.auditLogs;
  },

  async getNotifications(): Promise<NotificationItem[]> {
    return memoryStore.notifications;
  },

  async getStudentAllocation(studentId: string): Promise<{
    published: boolean;
    allocation: AllocationData | null;
    unallocatedInfo?: { reason: string } | null;
  }> {
    if (memoryStore.publicationStatus !== 'PUBLISHED') {
      return {
        published: false,
        allocation: null,
      };
    }

    const alloc = memoryStore.allocations.find((a) => a.studentId === studentId) || null;
    let unallocInfo = null;

    if (!alloc && memoryStore.lastAlgorithmResult) {
      const found = memoryStore.lastAlgorithmResult.unallocatedStudents.find(
        (u) => u.id === studentId
      );
      if (found) {
        unallocInfo = { reason: found.reason };
      }
    }

    return {
      published: true,
      allocation: alloc,
      unallocatedInfo: unallocInfo,
    };
  },

  // --- Aliases for compatibility ---
  async getPreferencesByStudent(studentId: string): Promise<PreferenceData[]> {
    return this.getPreferences(studentId);
  },

  async saveStudentPreferences(studentId: string, internshipIds: string[]): Promise<PreferenceData[]> {
    return this.savePreferences(studentId, internshipIds);
  },

  async getLatestAlgorithmResult(): Promise<AlgorithmResult> {
    return this.getLatestResult();
  },
};

