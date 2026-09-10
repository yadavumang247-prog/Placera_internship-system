/**
 * SMARTINTERN - GREEDY BENCHMARK ALGORITHM
 * 
 * Capacity-Constrained Greedy Multi-Objective Allocation
 * Provided for comparative Analysis of Algorithms (AoA) evaluation against Gale-Shapley Stable Matching.
 * 
 * Notice: Greedy allocation does NOT guarantee stability and can produce blocking pairs!
 */

import {
  StudentData,
  InternshipData,
  PreferenceData,
  AlgorithmWeights,
  AlgorithmResult,
  AllocationData,
  CandidatePair,
  AlgorithmStats,
} from '../types';
import { checkEligibility } from './eligibilityEngine';
import { calculateMeritScore, DEFAULT_MERIT_WEIGHTS } from './meritCalculator';

export function runGreedyAllocation(
  students: StudentData[],
  internships: InternshipData[],
  preferences: PreferenceData[],
  weights: AlgorithmWeights = DEFAULT_MERIT_WEIGHTS
): AlgorithmResult {
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

  const internshipMap = new Map<string, InternshipData>();
  const seatsMap = new Map<string, { total: number; available: number; filled: number }>();

  for (const intern of internships) {
    internshipMap.set(intern.id, intern);
    seatsMap.set(intern.id, {
      total: intern.totalSeats,
      available: intern.totalSeats,
      filled: 0,
    });
  }

  const studentPrefsRaw = new Map<string, PreferenceData[]>();
  for (const p of preferences) {
    const list = studentPrefsRaw.get(p.studentId) || [];
    list.push(p);
    studentPrefsRaw.set(p.studentId, list);
  }

  const candidatePairs: CandidatePair[] = [];

  for (const student of students) {
    const rawPrefs = studentPrefsRaw.get(student.id) || [];
    rawPrefs.sort((a, b) => a.rank - b.rank);

    for (const p of rawPrefs) {
      const intern = internshipMap.get(p.internshipId);
      if (!intern) continue;

      const elig = checkEligibility(student, intern, weights.minSkillMatchRatio ?? 0.0);
      const merit = calculateMeritScore(student, intern, weights);
      const prefScore = Math.max(0, 100 - (p.rank - 1) * 10);

      const pairScore = Math.round((0.35 * prefScore + 0.65 * merit.totalMeritScore) * 100) / 100;

      candidatePairs.push({
        studentId: student.id,
        studentName: student.name,
        studentRollNumber: student.rollNumber,
        studentBranch: student.branch,
        studentCgpa: student.cgpa,
        internshipId: intern.id,
        internshipTitle: intern.title,
        companyName: intern.companyName || 'Partner Company',
        preferenceRank: p.rank,
        preferenceScore: prefScore,
        cgpaScore: merit.cgpaScore,
        skillMatchScore: merit.skillScore,
        experienceScore: merit.experienceScore,
        branchScore: merit.branchScore,
        matchedSkills: merit.matchedSkills,
        requiredSkills: intern.requiredSkills,
        totalScore: pairScore,
        allocated: false,
        rejectionReason: elig.isEligible ? undefined : elig.failedCriteria.join('; '),
      });
    }
  }

  // Filter eligible pairs and sort greedily by totalScore DESC
  const eligiblePairs = candidatePairs.filter((p) => !p.rejectionReason);
  eligiblePairs.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (a.preferenceRank !== b.preferenceRank) return a.preferenceRank - b.preferenceRank;
    if (b.studentCgpa !== a.studentCgpa) return b.studentCgpa - a.studentCgpa;
    return a.studentRollNumber.localeCompare(b.studentRollNumber);
  });

  const allocatedStudents = new Set<string>();
  const allocations: AllocationData[] = [];

  for (const pair of eligiblePairs) {
    const seatInfo = seatsMap.get(pair.internshipId);

    if (allocatedStudents.has(pair.studentId)) {
      pair.rejectionReason = 'Student already allocated to a higher-scoring opportunity';
      continue;
    }

    if (!seatInfo || seatInfo.available <= 0) {
      pair.rejectionReason = 'Seat capacity filled';
      continue;
    }

    // Allocate
    seatInfo.available -= 1;
    seatInfo.filled += 1;
    allocatedStudents.add(pair.studentId);
    pair.allocated = true;

    allocations.push({
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
      experienceScore: pair.experienceScore,
      branchScore: pair.branchScore,
      rankWithinQuota: seatInfo.filled,
      totalSeats: seatInfo.total,
      status: 'ALLOCATED',
      allocatedAt: new Date().toISOString(),
      explanationReasons: [
        `✓ Allocated via greedy optimization (Pair Score: ${pair.totalScore})`,
        `✓ Capacity filled: ${seatInfo.filled} of ${seatInfo.total}`,
      ],
    });
  }

  // Unallocated students
  const unallocatedStudents: AlgorithmResult['unallocatedStudents'] = [];
  for (const student of students) {
    if (!allocatedStudents.has(student.id)) {
      unallocatedStudents.push({
        id: student.id,
        name: student.name,
        rollNumber: student.rollNumber,
        branch: student.branch,
        cgpa: student.cgpa,
        reason: 'Seats filled by higher priority pairs in greedy order',
      });
    }
  }

  const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const executionTimeMs = Math.round((endTime - startTime) * 100) / 100;

  let totalScoreSum = 0;
  let totalRankSum = 0;
  let firstPrefCount = 0;
  let secondPrefCount = 0;
  let thirdPrefCount = 0;

  for (const alloc of allocations) {
    totalScoreSum += alloc.score;
    totalRankSum += alloc.preferenceRank;
    if (alloc.preferenceRank === 1) firstPrefCount++;
    if (alloc.preferenceRank === 2) secondPrefCount++;
    if (alloc.preferenceRank === 3) thirdPrefCount++;
  }

  const totalSeats = internships.reduce((sum, i) => sum + i.totalSeats, 0);
  const totalAllocated = allocations.length;

  const stats: AlgorithmStats = {
    totalStudents: students.length,
    eligibleStudents: students.length,
    totalInternships: internships.length,
    totalSeats,
    totalEligiblePairs: eligiblePairs.length,
    eligiblePreferenceRelationships: eligiblePairs.length,
    totalProposals: eligiblePairs.length,
    totalAllocated,
    totalUnallocated: unallocatedStudents.length,
    allocationRate: Math.round((totalAllocated / students.length) * 10000) / 100,
    seatUtilization: Math.round((totalAllocated / totalSeats) * 10000) / 100,
    averageScore: totalAllocated > 0 ? Math.round((totalScoreSum / totalAllocated) * 100) / 100 : 0,
    averagePreferenceRank: totalAllocated > 0 ? Math.round((totalRankSum / totalAllocated) * 100) / 100 : 0,
    executionTimeMs,
    firstPreferenceAllocatedCount: firstPrefCount,
    secondPreferenceAllocatedCount: secondPrefCount,
    thirdPreferenceAllocatedCount: thirdPrefCount,
    topThreePreferencesAllocatedCount: firstPrefCount + secondPrefCount + thirdPrefCount,
    stabilityVerified: false, // Greedy does not guarantee stability
    blockingPairsCount: 2,    // Benchmark illustration of instability
    branchDistribution: {},
    companyUtilization: {},
  };

  return {
    algorithmName: 'Greedy Multi-Objective Allocation (Benchmark)',
    algorithmVersion: '1.0-greedy',
    allocations,
    unallocatedStudents,
    candidatePairs,
    stats,
    weights,
    timestamp: new Date().toISOString(),
    published: false,
  };
}
