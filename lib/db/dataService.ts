import { prisma } from './prisma';
import {
  StudentData,
  CompanyData,
  InternshipData,
  PreferenceData,
  AllocationData,
  AlgorithmWeights,
  AlgorithmResult,
} from '../types';
import {
  INITIAL_COMPANIES,
  INITIAL_INTERNSHIPS,
  INITIAL_STUDENTS,
  INITIAL_PREFERENCES,
} from './seedData';
import { runInternshipAllocation, DEFAULT_WEIGHTS } from '../algorithm/internshipAllocation';

// In-Memory Reactive Store (Fallback & Instant Zero-Setup Mode)
class MemoryStore {
  companies: CompanyData[] = [...INITIAL_COMPANIES];
  internships: InternshipData[] = [...INITIAL_INTERNSHIPS];
  students: StudentData[] = [...INITIAL_STUDENTS];
  preferences: PreferenceData[] = [...INITIAL_PREFERENCES];
  allocations: AllocationData[] = [];
  lastAlgorithmResult: AlgorithmResult | null = null;
  weights: AlgorithmWeights = { ...DEFAULT_WEIGHTS };

  constructor() {
    // Run initial allocation on startup so dashboard immediately has real analytics
    this.recompute();
  }

  recompute() {
    const result = runInternshipAllocation(
      this.students,
      this.internships,
      this.preferences,
      this.weights
    );
    this.allocations = result.allocations;
    this.lastAlgorithmResult = result;
    return result;
  }
}

const globalForStore = globalThis as unknown as {
  memoryStore: MemoryStore | undefined;
};

export const memoryStore = globalForStore.memoryStore ?? new MemoryStore();
if (process.env.NODE_ENV !== 'production') {
  globalForStore.memoryStore = memoryStore;
}

/**
 * Data Service with graceful Prisma -> Memory fallback
 */
export const dataService = {
  // --- Students ---
  async getStudents(): Promise<StudentData[]> {
    try {
      if (process.env.DATABASE_URL) {
        const dbStudents = await prisma.student.findMany({
          include: {
            user: true,
            preferences: { include: { internship: true }, orderBy: { rank: 'asc' } },
            allocations: { include: { internship: true } },
          },
        });
        if (dbStudents && dbStudents.length > 0) {
          return dbStudents.map((s) => ({
            id: s.id,
            userId: s.userId,
            name: s.user.name,
            email: s.user.email,
            rollNumber: s.rollNumber,
            branch: s.branch,
            year: s.year,
            cgpa: s.cgpa,
            skills: s.skills ? s.skills.split(',').map((x) => x.trim()) : [],
            resumeUrl: s.resumeUrl,
            preferences: s.preferences.map((p) => ({
              id: p.id,
              studentId: p.studentId,
              internshipId: p.internshipId,
              rank: p.rank,
            })),
            allocation: s.allocations[0]
              ? {
                  id: s.allocations[0].id,
                  studentId: s.allocations[0].studentId,
                  internshipId: s.allocations[0].internshipId,
                  internshipTitle: s.allocations[0].internship?.title,
                  score: s.allocations[0].score,
                  preferenceRank: s.allocations[0].preferenceRank,
                  skillMatchScore: s.allocations[0].skillMatchScore,
                  cgpaScore: s.allocations[0].cgpaScore,
                  status: s.allocations[0].status,
                  allocatedAt: s.allocations[0].allocatedAt,
                }
              : null,
          }));
        }
      }
    } catch (err) {
      // Graceful fallback to memory store
    }
    // Attach allocation to students in memory store
    const allocMap = new Map(memoryStore.allocations.map((a) => [a.studentId, a]));
    return memoryStore.students.map((s) => ({
      ...s,
      allocation: allocMap.get(s.id) || null,
      preferences: memoryStore.preferences.filter((p) => p.studentId === s.id),
    }));
  },

  async getStudentById(id: string): Promise<StudentData | null> {
    const students = await this.getStudents();
    return students.find((s) => s.id === id || s.userId === id || s.email === id) || null;
  },

  async createStudent(data: {
    name: string;
    email: string;
    rollNumber: string;
    branch: string;
    year: number;
    cgpa: number;
    skills: string[];
    resumeUrl?: string;
  }): Promise<StudentData> {
    const newStudent: StudentData = {
      id: `stud_${Date.now()}`,
      userId: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      rollNumber: data.rollNumber,
      branch: data.branch,
      year: data.year,
      cgpa: data.cgpa,
      skills: data.skills,
      resumeUrl: data.resumeUrl,
    };
    memoryStore.students.push(newStudent);
    memoryStore.recompute();
    return newStudent;
  },

  async updateStudent(id: string, data: Partial<StudentData>): Promise<StudentData | null> {
    const idx = memoryStore.students.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    memoryStore.students[idx] = { ...memoryStore.students[idx], ...data };
    memoryStore.recompute();
    return memoryStore.students[idx];
  },

  async deleteStudent(id: string): Promise<boolean> {
    memoryStore.students = memoryStore.students.filter((s) => s.id !== id);
    memoryStore.preferences = memoryStore.preferences.filter((p) => p.studentId !== id);
    memoryStore.recompute();
    return true;
  },

  // --- Companies ---
  async getCompanies(): Promise<CompanyData[]> {
    try {
      if (process.env.DATABASE_URL) {
        const dbCompanies = await prisma.company.findMany({
          include: { internships: true },
        });
        if (dbCompanies && dbCompanies.length > 0) {
          return dbCompanies.map((c) => ({
            id: c.id,
            userId: c.userId,
            name: c.name,
            description: c.description,
            logoUrl: c.logoUrl,
            website: c.website,
            internships: c.internships.map((i) => ({
              id: i.id,
              companyId: i.companyId,
              companyName: c.name,
              title: i.title,
              description: i.description,
              location: i.location,
              mode: i.mode,
              stipend: i.stipend,
              duration: i.duration,
              minimumCGPA: i.minimumCGPA,
              requiredSkills: i.requiredSkills.split(',').map((x) => x.trim()),
              totalSeats: i.totalSeats,
              availableSeats: i.availableSeats,
              applicationDeadline: i.applicationDeadline,
            })),
          }));
        }
      }
    } catch (err) {}
    return memoryStore.companies.map((c) => ({
      ...c,
      internships: memoryStore.internships.filter((i) => i.companyId === c.id),
    }));
  },

  async createCompany(data: {
    name: string;
    description: string;
    website?: string;
    logoUrl?: string;
  }): Promise<CompanyData> {
    const newCompany: CompanyData = {
      id: `comp_${Date.now()}`,
      name: data.name,
      description: data.description,
      website: data.website,
      logoUrl: data.logoUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80',
    };
    memoryStore.companies.push(newCompany);
    return newCompany;
  },

  async updateCompany(id: string, data: Partial<CompanyData>): Promise<CompanyData | null> {
    const idx = memoryStore.companies.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    memoryStore.companies[idx] = { ...memoryStore.companies[idx], ...data };
    return memoryStore.companies[idx];
  },

  async deleteCompany(id: string): Promise<boolean> {
    memoryStore.companies = memoryStore.companies.filter((c) => c.id !== id);
    memoryStore.internships = memoryStore.internships.filter((i) => i.companyId !== id);
    memoryStore.recompute();
    return true;
  },

  // --- Internships ---
  async getInternships(): Promise<InternshipData[]> {
    try {
      if (process.env.DATABASE_URL) {
        const dbInterns = await prisma.internship.findMany({
          include: { company: true },
        });
        if (dbInterns && dbInterns.length > 0) {
          return dbInterns.map((i) => ({
            id: i.id,
            companyId: i.companyId,
            companyName: i.company.name,
            companyLogo: i.company.logoUrl,
            title: i.title,
            description: i.description,
            location: i.location,
            mode: i.mode,
            stipend: i.stipend,
            duration: i.duration,
            minimumCGPA: i.minimumCGPA,
            requiredSkills: i.requiredSkills.split(',').map((x) => x.trim()),
            totalSeats: i.totalSeats,
            availableSeats: i.availableSeats,
            applicationDeadline: i.applicationDeadline,
          }));
        }
      }
    } catch (err) {}
    return memoryStore.internships;
  },

  async createInternship(data: {
    companyId: string;
    title: string;
    description: string;
    location: string;
    mode: 'REMOTE' | 'HYBRID' | 'ONSITE';
    stipend: number;
    duration: string;
    minimumCGPA: number;
    requiredSkills: string[];
    totalSeats: number;
    applicationDeadline: string;
  }): Promise<InternshipData> {
    const company = memoryStore.companies.find((c) => c.id === data.companyId);
    const newIntern: InternshipData = {
      id: `int_${Date.now()}`,
      companyId: data.companyId,
      companyName: company?.name || 'Partner Company',
      companyLogo: company?.logoUrl,
      title: data.title,
      description: data.description,
      location: data.location,
      mode: data.mode,
      stipend: data.stipend,
      duration: data.duration,
      minimumCGPA: data.minimumCGPA,
      requiredSkills: data.requiredSkills,
      totalSeats: data.totalSeats,
      availableSeats: data.totalSeats,
      applicationDeadline: data.applicationDeadline,
    };
    memoryStore.internships.push(newIntern);
    memoryStore.recompute();
    return newIntern;
  },

  async updateInternship(id: string, data: Partial<InternshipData>): Promise<InternshipData | null> {
    const idx = memoryStore.internships.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    memoryStore.internships[idx] = { ...memoryStore.internships[idx], ...data };
    memoryStore.recompute();
    return memoryStore.internships[idx];
  },

  async deleteInternship(id: string): Promise<boolean> {
    memoryStore.internships = memoryStore.internships.filter((i) => i.id !== id);
    memoryStore.preferences = memoryStore.preferences.filter((p) => p.internshipId !== id);
    memoryStore.recompute();
    return true;
  },

  // --- Preferences ---
  async getPreferencesByStudent(studentId: string): Promise<PreferenceData[]> {
    const prefs = memoryStore.preferences.filter((p) => p.studentId === studentId);
    prefs.sort((a, b) => a.rank - b.rank);
    return prefs.map((p) => ({
      ...p,
      internship: memoryStore.internships.find((i) => i.id === p.internshipId),
    }));
  },

  async saveStudentPreferences(
    studentId: string,
    internshipIds: string[]
  ): Promise<PreferenceData[]> {
    // Remove existing
    memoryStore.preferences = memoryStore.preferences.filter((p) => p.studentId !== studentId);

    const newPrefs: PreferenceData[] = internshipIds.map((internshipId, index) => ({
      id: `pref_${studentId}_${internshipId}_${Date.now()}`,
      studentId,
      internshipId,
      rank: index + 1,
    }));

    memoryStore.preferences.push(...newPrefs);
    memoryStore.recompute();
    return this.getPreferencesByStudent(studentId);
  },

  // --- Algorithm Execution & Results ---
  async runAllocation(weights?: Partial<AlgorithmWeights>): Promise<AlgorithmResult> {
    if (weights) {
      memoryStore.weights = { ...memoryStore.weights, ...weights };
    }
    const result = memoryStore.recompute();
    return result;
  },

  async getAllocations(): Promise<AllocationData[]> {
    if (!memoryStore.lastAlgorithmResult) {
      memoryStore.recompute();
    }
    return memoryStore.allocations;
  },

  async getLatestAlgorithmResult(): Promise<AlgorithmResult> {
    if (!memoryStore.lastAlgorithmResult) {
      return memoryStore.recompute();
    }
    return memoryStore.lastAlgorithmResult;
  },
};
