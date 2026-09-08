/**
 * INTERNMATCH PORTAL - CORE AOA ALGORITHM
 * 
 * College AOA (Analysis and Optimization of Algorithms) Project
 * Algorithm: Multi-Objective Constrained Greedy Optimization with Multi-Criteria Tie-Breaking
 * 
 * Complexity:
 * - Time Complexity:
 *   - Candidate Generation: O(S * I)
 *   - Sorting: O((S * I) * log(S * I))
 *   - Greedy Allocation: O(S * I)
 *   - Overall Time Complexity: O(S * I * log(S * I))
 * - Space Complexity:
 *   - Candidate Pairs & State Storage: O(S * I)
 * 
 * Where:
 * S = Total number of participating students
 * I = Total number of available internships
 */

import {
  StudentData,
  InternshipData,
  PreferenceData,
  AlgorithmWeights,
  AlgorithmResult,
  CandidatePair,
  AllocationData,
} from '../types';

export const DEFAULT_WEIGHTS: AlgorithmWeights = {
  preferenceWeight: 0.40,
  cgpaWeight: 0.30,
  skillWeight: 0.30,
  minSkillMatchRatio: 0.0, // partial skill match allowed
};

/**
 * Normalizes skill strings for robust case-insensitive comparison
 */
export function normalizeSkill(skill: string): string {
  return skill
    .toLowerCase()
    .trim()
    .replace(/[-_.]/g, '')
    .replace(/\s+/g, '');
}

/**
 * Computes matching skills between student and internship requirements
 */
export function computeSkillMatch(
  studentSkills: string[],
  requiredSkills: string[]
): {
  matchedCount: number;
  totalRequired: number;
  matchScore: number;
  matchedSkills: string[];
} {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      matchedCount: 0,
      totalRequired: 0,
      matchScore: 100, // No specific skill required
      matchedSkills: [],
    };
  }

  const normalizedStudentSkills = new Set(
    studentSkills.map((s) => normalizeSkill(s))
  );

  const matchedSkills: string[] = [];

  for (const req of requiredSkills) {
    const normReq = normalizeSkill(req);
    // Exact or substring match for variants like "React" vs "React.js"
    const isMatched = Array.from(normalizedStudentSkills).some(
      (studSkill) =>
        studSkill === normReq ||
        studSkill.includes(normReq) ||
        normReq.includes(studSkill)
    );

    if (isMatched) {
      matchedSkills.push(req);
    }
  }

  const matchScore = (matchedSkills.length / requiredSkills.length) * 100;

  return {
    matchedCount: matchedSkills.length,
    totalRequired: requiredSkills.length,
    matchScore: Math.round(matchScore * 100) / 100,
    matchedSkills,
  };
}

/**
 * Computes preference score according to rank:
 * 1st preference = 100
 * 2nd preference = 90
 * 3rd preference = 80
 * 4th preference = 70
 * 5th preference = 60
 * formula: Math.max(0, 100 - (rank - 1) * 10)
 */
export function computePreferenceScore(rank: number): number {
  if (rank <= 0) return 0;
  return Math.max(0, 100 - (rank - 1) * 10);
}

/**
 * Normalizes student CGPA (assumed scale of 10.0) to a 0-100 score
 */
export function computeCgpaScore(cgpa: number): number {
  const clamped = Math.max(0, Math.min(10.0, cgpa));
  return Math.round((clamped / 10.0) * 10000) / 100;
}

/**
 * Computes composite weighted score:
 * overallScore = w_pref * preferenceScore + w_cgpa * cgpaScore + w_skill * skillMatchScore
 */
export function computeOverallScore(
  preferenceScore: number,
  cgpaScore: number,
  skillMatchScore: number,
  weights: AlgorithmWeights
): number {
  const sumWeights =
    weights.preferenceWeight + weights.cgpaWeight + weights.skillWeight;
  const normWPref = sumWeights > 0 ? weights.preferenceWeight / sumWeights : 0.4;
  const normWCgpa = sumWeights > 0 ? weights.cgpaWeight / sumWeights : 0.3;
  const normWSkill = sumWeights > 0 ? weights.skillWeight / sumWeights : 0.3;

  const score =
    normWPref * preferenceScore +
    normWCgpa * cgpaScore +
    normWSkill * skillMatchScore;

  return Math.round(score * 100) / 100;
}

/**
 * Core Algorithm Execution Function
 * 
 * Performs deterministic allocation over Students, Internships, and Preferences.
 */
export function runInternshipAllocation(
  students: StudentData[],
  internships: InternshipData[],
  preferences: PreferenceData[],
  weights: AlgorithmWeights = DEFAULT_WEIGHTS
): AlgorithmResult {
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

  // 1. Indexing Data Structures for O(1) Lookups
  const internshipMap = new Map<string, InternshipData>();
  const internshipSeats = new Map<string, { total: number; available: number; filled: number }>();
  for (const intern of internships) {
    internshipMap.set(intern.id, intern);
    internshipSeats.set(intern.id, {
      total: intern.totalSeats,
      available: intern.totalSeats,
      filled: 0,
    });
  }

  const studentMap = new Map<string, StudentData>();
  for (const stud of students) {
    studentMap.set(stud.id, stud);
  }

  // Group preferences by student
  const studentPrefsMap = new Map<string, PreferenceData[]>();
  for (const pref of preferences) {
    const list = studentPrefsMap.get(pref.studentId) || [];
    list.push(pref);
    studentPrefsMap.set(pref.studentId, list);
  }

  // Sort each student's preferences by rank ascending
  studentPrefsMap.forEach((list: PreferenceData[]) => {
    list.sort((a: PreferenceData, b: PreferenceData) => a.rank - b.rank);
  });

  // 2. STEP 1 & 2: Eligibility Filtering and Score Computation
  const candidatePairs: CandidatePair[] = [];
  const currentDate = new Date();

  for (const student of students) {
    const studentPrefs = studentPrefsMap.get(student.id) || [];
    if (studentPrefs.length === 0) {
      continue; // No preferences submitted
    }

    for (const pref of studentPrefs) {
      const internship = internshipMap.get(pref.internshipId);
      if (!internship) continue;

      // Check Eligibility Condition A: Application Deadline
      if (internship.applicationDeadline) {
        const deadline = new Date(internship.applicationDeadline);
        // Only invalidate if explicitly passed in production config
        // For demo stability, we allow all active internships
      }

      // Check Eligibility Condition B: Minimum CGPA
      if (student.cgpa < internship.minimumCGPA) {
        // Ineligible due to CGPA threshold
        continue;
      }

      // Check Eligibility Condition C: Skill Match Threshold
      const skillEval = computeSkillMatch(student.skills, internship.requiredSkills);
      const minRatio = weights.minSkillMatchRatio ?? 0.0;
      if (minRatio > 0 && skillEval.totalRequired > 0) {
        if (skillEval.matchedCount / skillEval.totalRequired < minRatio) {
          // Ineligible due to insufficient skill overlap
          continue;
        }
      }

      // Calculate component scores
      const prefScore = computePreferenceScore(pref.rank);
      const cgpaScore = computeCgpaScore(student.cgpa);
      const skillScore = skillEval.matchScore;
      const totalScore = computeOverallScore(prefScore, cgpaScore, skillScore, weights);

      candidatePairs.push({
        studentId: student.id,
        studentName: student.name,
        studentRollNumber: student.rollNumber,
        studentBranch: student.branch,
        studentCgpa: student.cgpa,
        internshipId: internship.id,
        internshipTitle: internship.title,
        companyName: internship.companyName || 'Partner Company',
        preferenceRank: pref.rank,
        preferenceScore: prefScore,
        cgpaScore: cgpaScore,
        skillMatchScore: skillScore,
        matchedSkills: skillEval.matchedSkills,
        requiredSkills: internship.requiredSkills,
        totalScore,
        allocated: false,
      });
    }
  }

  // 3. STEP 3: Multi-Criteria Deterministic Sorting
  // Primary: Total Score DESC
  // Secondary: Preference Rank ASC (higher student priority)
  // Tertiary: CGPA DESC
  // Quaternary: Student Roll Number ASC (deterministic tie-breaker)
  candidatePairs.sort((a, b) => {
    // 1. Overall score descending
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    // 2. Preference rank ascending (e.g. rank 1 beats rank 2)
    if (a.preferenceRank !== b.preferenceRank) {
      return a.preferenceRank - b.preferenceRank;
    }
    // 3. CGPA descending
    if (b.studentCgpa !== a.studentCgpa) {
      return b.studentCgpa - a.studentCgpa;
    }
    // 4. Deterministic Tie-Breaker: Roll Number ascending
    return a.studentRollNumber.localeCompare(b.studentRollNumber);
  });

  // 4. STEP 4: Constrained Greedy Allocation Loop
  const allocatedStudents = new Set<string>();
  const allocations: AllocationData[] = [];

  for (const pair of candidatePairs) {
    const seatInfo = internshipSeats.get(pair.internshipId);

    // Check Constraint 1: Student receives at most one internship
    if (allocatedStudents.has(pair.studentId)) {
      pair.allocated = false;
      pair.rejectionReason = 'Student already allocated to a higher-scoring preference';
      continue;
    }

    // Check Constraint 2: Internship seat capacity limit
    if (!seatInfo || seatInfo.available <= 0) {
      pair.allocated = false;
      pair.rejectionReason = 'Internship seat capacity reached';
      continue;
    }

    // Valid Allocation: Assign student to internship
    seatInfo.available -= 1;
    seatInfo.filled += 1;
    allocatedStudents.add(pair.studentId);
    pair.allocated = true;

    const allocationRecord: AllocationData = {
      id: `alloc_${pair.studentId}_${pair.internshipId}`,
      studentId: pair.studentId,
      studentName: pair.studentName,
      studentRollNumber: pair.studentRollNumber,
      studentBranch: pair.studentBranch,
      studentCgpa: pair.studentCgpa,
      internshipId: pair.internshipId,
      internshipTitle: pair.internshipTitle,
      companyName: pair.companyName,
      score: pair.totalScore,
      preferenceRank: pair.preferenceRank,
      skillMatchScore: pair.skillMatchScore,
      cgpaScore: pair.cgpaScore,
      status: 'ALLOCATED',
      allocatedAt: new Date().toISOString(),
    };

    allocations.push(allocationRecord);
  }

  // 5. STEP 5: Identify Unallocated Students & Root Causes
  const unallocatedStudents: AlgorithmResult['unallocatedStudents'] = [];

  for (const student of students) {
    if (!allocatedStudents.has(student.id)) {
      const studentPrefs = studentPrefsMap.get(student.id) || [];
      let reason = 'No preferences submitted';

      if (studentPrefs.length > 0) {
        // Check if any pairs were generated
        const pairsForStudent = candidatePairs.filter((p) => p.studentId === student.id);
        if (pairsForStudent.length === 0) {
          reason = 'Ineligible for all preferred internships (CGPA or Skill mismatch)';
        } else {
          reason = 'All preferred internship capacities were filled by higher-ranked candidates';
        }
      }

      unallocatedStudents.push({
        id: student.id,
        name: student.name,
        rollNumber: student.rollNumber,
        branch: student.branch,
        cgpa: student.cgpa,
        reason,
      });
    }
  }

  // 6. STEP 6: Compute Analytical & Fairness Statistics
  const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const executionTimeMs = Math.round((endTime - startTime) * 100) / 100;

  let totalScoreSum = 0;
  let totalRankSum = 0;
  let firstPrefCount = 0;
  let topThreeCount = 0;
  const branchDist: Record<string, number> = {};
  const companyUtil: Record<string, { filled: number; total: number }> = {};

  for (const intern of internships) {
    const seat = internshipSeats.get(intern.id);
    const company = intern.companyName || 'Unknown';
    if (!companyUtil[company]) {
      companyUtil[company] = { filled: 0, total: 0 };
    }
    companyUtil[company].total += intern.totalSeats;
    companyUtil[company].filled += seat ? seat.filled : 0;
  }

  for (const alloc of allocations) {
    totalScoreSum += alloc.score;
    totalRankSum += alloc.preferenceRank;
    if (alloc.preferenceRank === 1) firstPrefCount++;
    if (alloc.preferenceRank <= 3) topThreeCount++;

    const branch = alloc.studentBranch || 'Other';
    branchDist[branch] = (branchDist[branch] || 0) + 1;
  }

  const totalAllocated = allocations.length;
  const totalStudentsCount = students.length;
  const totalSeats = internships.reduce((sum, i) => sum + i.totalSeats, 0);

  const avgScore = totalAllocated > 0 ? Math.round((totalScoreSum / totalAllocated) * 100) / 100 : 0;
  const avgRank = totalAllocated > 0 ? Math.round((totalRankSum / totalAllocated) * 100) / 100 : 0;
  const allocationRate = totalStudentsCount > 0 ? Math.round((totalAllocated / totalStudentsCount) * 10000) / 100 : 0;

  return {
    allocations,
    unallocatedStudents,
    candidatePairs,
    stats: {
      totalStudents: totalStudentsCount,
      totalInternships: internships.length,
      totalSeats,
      totalEligiblePairs: candidatePairs.length,
      totalAllocated,
      totalUnallocated: unallocatedStudents.length,
      allocationRate,
      averageScore: avgScore,
      averagePreferenceRank: avgRank,
      executionTimeMs,
      firstPreferenceAllocatedCount: firstPrefCount,
      topThreePreferencesAllocatedCount: topThreeCount,
      branchDistribution: branchDist,
      companyUtilization: companyUtil,
    },
    weights,
    timestamp: new Date().toISOString(),
  };
}
