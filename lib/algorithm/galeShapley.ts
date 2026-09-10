/**
 * SMARTINTERN - CORE ALGORITHM
 * 
 * Many-to-One Gale-Shapley (Hospital-Residents / College Admissions) Stable Matching Engine
 * 
 * Algorithm Characteristics:
 * - Student-proposing Many-to-One stable matching with internship capacity constraints C_i
 * - Strict pre-matching eligibility filtering (CGPA, Branch, Skills, Deadline)
 * - Multi-criteria company candidate merit scoring & deterministic tie-breaking
 * - Provably eliminates all blocking pairs (Stability Guarantee)
 * - Traceable step-by-step proposal and rejection logging
 * 
 * Complexity:
 * - Time Complexity: O(|S| * |I| * log(max(C_i))) in the worst case (at most |S| * |I| proposals)
 * - Space Complexity: O(|S| * |I|) to store preference schedules and candidate scores
 */

import {
  StudentData,
  InternshipData,
  PreferenceData,
  AlgorithmWeights,
  AlgorithmResult,
  AllocationData,
  CandidatePair,
  ProposalStep,
  AlgorithmStats,
} from '../types';
import { checkEligibility } from './eligibilityEngine';
import {
  calculateMeritScore,
  compareCandidatesByMerit,
  DEFAULT_MERIT_WEIGHTS,
} from './meritCalculator';

export interface HeldCandidate {
  student: StudentData;
  preferenceRank: number;
  meritScore: number;
  breakdown: ReturnType<typeof calculateMeritScore>;
}

/**
 * Executes Many-to-One Gale-Shapley Stable Matching
 */
export function runGaleShapleyAllocation(
  students: StudentData[],
  internships: InternshipData[],
  preferences: PreferenceData[],
  weights: AlgorithmWeights = DEFAULT_MERIT_WEIGHTS
): AlgorithmResult {
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

  // 1. Index internships and their seat capacities
  const internshipMap = new Map<string, InternshipData>();
  const capacityMap = new Map<string, number>();
  const heldMap = new Map<string, HeldCandidate[]>();

  for (const intern of internships) {
    internshipMap.set(intern.id, intern);
    capacityMap.set(intern.id, Math.max(1, intern.totalSeats));
    heldMap.set(intern.id, []);
  }

  // 2. Index students
  const studentMap = new Map<string, StudentData>();
  for (const s of students) {
    studentMap.set(s.id, s);
  }

  // 3. Group and sort student preferences
  const studentPrefsRaw = new Map<string, PreferenceData[]>();
  for (const p of preferences) {
    const list = studentPrefsRaw.get(p.studentId) || [];
    list.push(p);
    studentPrefsRaw.set(p.studentId, list);
  }

  // 4. STEP 1 & 2: Pre-matching Eligibility Gate & Candidate Scoring
  // Filter only eligible preferences for each student
  const studentEligiblePrefs = new Map<
    string,
    { pref: PreferenceData; internship: InternshipData; merit: ReturnType<typeof calculateMeritScore> }[]
  >();

  const candidatePairs: CandidatePair[] = [];
  let eligibleRelationsCount = 0;
  let eligibleStudentsCount = 0;

  for (const student of students) {
    const rawPrefs = studentPrefsRaw.get(student.id) || [];
    rawPrefs.sort((a, b) => a.rank - b.rank);

    const validPrefs: {
      pref: PreferenceData;
      internship: InternshipData;
      merit: ReturnType<typeof calculateMeritScore>;
    }[] = [];

    for (const p of rawPrefs) {
      const intern = internshipMap.get(p.internshipId);
      if (!intern) continue;

      const elig = checkEligibility(student, intern, weights.minSkillMatchRatio ?? 0.0);
      const merit = calculateMeritScore(student, intern, weights);

      const prefScore = Math.max(0, 100 - (p.rank - 1) * 10);

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
        totalScore: merit.totalMeritScore,
        allocated: false,
        rejectionReason: elig.isEligible ? undefined : elig.failedCriteria.join('; '),
      });

      if (elig.isEligible) {
        validPrefs.push({ pref: p, internship: intern, merit });
        eligibleRelationsCount++;
      }
    }

    if (validPrefs.length > 0) {
      eligibleStudentsCount++;
    }
    studentEligiblePrefs.set(student.id, validPrefs);
  }

  // 5. STEP 3: Gale-Shapley Many-to-One Proposal Loop
  // Queue of students who are currently unassigned and still have eligible preferences to propose to
  const freeQueue: string[] = [];
  const prefIndexMap = new Map<string, number>(); // studentId -> next preference index to propose

  for (const student of students) {
    const list = studentEligiblePrefs.get(student.id) || [];
    if (list.length > 0) {
      freeQueue.push(student.id);
      prefIndexMap.set(student.id, 0);
    }
  }

  const steps: ProposalStep[] = [];
  let stepNumber = 1;
  let round = 1;
  let totalProposals = 0;

  // Maximum safety iteration counter to avoid infinite loops in any pathological data
  const maxIterations = students.length * internships.length * 2 + 500;
  let iterations = 0;

  while (freeQueue.length > 0 && iterations < maxIterations) {
    iterations++;
    const studentId = freeQueue.shift()!;
    const student = studentMap.get(studentId)!;
    const currentIdx = prefIndexMap.get(studentId) ?? 0;
    const studentPrefList = studentEligiblePrefs.get(studentId) || [];

    if (currentIdx >= studentPrefList.length) {
      // Student has exhausted all eligible preferences
      continue;
    }

    // Student proposes to their next preferred internship
    const target = studentPrefList[currentIdx];
    prefIndexMap.set(studentId, currentIdx + 1); // Advance preference pointer
    totalProposals++;

    const internship = target.internship;
    const capacity = capacityMap.get(internship.id) || 1;
    const currentlyHeld = heldMap.get(internship.id) || [];

    const candidateEntry: HeldCandidate = {
      student,
      preferenceRank: target.pref.rank,
      meritScore: target.merit.totalMeritScore,
      breakdown: target.merit,
    };

    steps.push({
      stepNumber: stepNumber++,
      round,
      studentId: student.id,
      studentName: student.name,
      internshipId: internship.id,
      internshipTitle: internship.title,
      companyName: internship.companyName || 'Partner Company',
      action: 'PROPOSE',
      meritScore: target.merit.totalMeritScore,
      message: `${student.name} proposes to ${internship.title} (Pref #${target.pref.rank}, Merit Score: ${target.merit.totalMeritScore.toFixed(1)})`,
    });

    if (currentlyHeld.length < capacity) {
      // Capacity available: Accept provisionally
      currentlyHeld.push(candidateEntry);
      // Keep sorted by merit descending
      currentlyHeld.sort((a, b) =>
        compareCandidatesByMerit(
          { score: a.meritScore, cgpa: a.student.cgpa, rollNumber: a.student.rollNumber },
          { score: b.meritScore, cgpa: b.student.cgpa, rollNumber: b.student.rollNumber }
        )
      );
      heldMap.set(internship.id, currentlyHeld);

      steps.push({
        stepNumber: stepNumber++,
        round,
        studentId: student.id,
        studentName: student.name,
        internshipId: internship.id,
        internshipTitle: internship.title,
        companyName: internship.companyName || 'Partner Company',
        action: 'ACCEPT_PROVISIONALLY',
        meritScore: target.merit.totalMeritScore,
        message: `${internship.title} provisionally holds ${student.name} (${currentlyHeld.length}/${capacity} seats filled)`,
      });
    } else {
      // At capacity: Find the least preferred candidate currently held by company merit ranking
      const worstHeldIndex = currentlyHeld.length - 1;
      const worstHeld = currentlyHeld[worstHeldIndex];

      const comparison = compareCandidatesByMerit(
        { score: candidateEntry.meritScore, cgpa: candidateEntry.student.cgpa, rollNumber: candidateEntry.student.rollNumber },
        { score: worstHeld.meritScore, cgpa: worstHeld.student.cgpa, rollNumber: worstHeld.student.rollNumber }
      );

      if (comparison < 0) {
        // Proposing student is strictly better than the worst held candidate!
        // Displace the worst candidate
        currentlyHeld.splice(worstHeldIndex, 1); // remove worst
        currentlyHeld.push(candidateEntry);
        currentlyHeld.sort((a, b) =>
          compareCandidatesByMerit(
            { score: a.meritScore, cgpa: a.student.cgpa, rollNumber: a.student.rollNumber },
            { score: b.meritScore, cgpa: b.student.cgpa, rollNumber: b.student.rollNumber }
          )
        );
        heldMap.set(internship.id, currentlyHeld);

        steps.push({
          stepNumber: stepNumber++,
          round,
          studentId: student.id,
          studentName: student.name,
          internshipId: internship.id,
          internshipTitle: internship.title,
          companyName: internship.companyName || 'Partner Company',
          action: 'ACCEPT_PROVISIONALLY',
          meritScore: target.merit.totalMeritScore,
          displacedStudentName: worstHeld.student.name,
          message: `${internship.title} displaces ${worstHeld.student.name} (Merit: ${worstHeld.meritScore.toFixed(1)}) for higher-scoring ${student.name} (Merit: ${target.merit.totalMeritScore.toFixed(1)})`,
        });

        // Displaced student returns to free queue to propose to their next preference
        freeQueue.push(worstHeld.student.id);
      } else {
        // Proposing student ranks lower than all currently held candidates: Reject immediately
        steps.push({
          stepNumber: stepNumber++,
          round,
          studentId: student.id,
          studentName: student.name,
          internshipId: internship.id,
          internshipTitle: internship.title,
          companyName: internship.companyName || 'Partner Company',
          action: 'REJECT_EXCESS',
          meritScore: target.merit.totalMeritScore,
          message: `${internship.title} rejects proposal from ${student.name}; capacity full with candidates having merit score ≥ ${worstHeld.meritScore.toFixed(1)}`,
        });

        // If student still has preferences remaining, re-enqueue
        if (currentIdx + 1 < studentPrefList.length) {
          freeQueue.push(student.id);
        }
      }
    }

    round++;
  }

  // 6. Assemble Final Allocations
  const allocations: AllocationData[] = [];
  const allocatedStudentIds = new Set<string>();

  for (const intern of internships) {
    const heldList = heldMap.get(intern.id) || [];
    heldList.forEach((held, idx) => {
      allocatedStudentIds.add(held.student.id);

      // Update candidate pair status
      const pair = candidatePairs.find(
        (cp) => cp.studentId === held.student.id && cp.internshipId === intern.id
      );
      if (pair) {
        pair.allocated = true;
      }

      const allocRecord: AllocationData = {
        id: `alloc_${held.student.id}_${intern.id}`,
        studentId: held.student.id,
        studentName: held.student.name,
        studentRollNumber: held.student.rollNumber,
        studentBranch: held.student.branch,
        studentCgpa: held.student.cgpa,
        internshipId: intern.id,
        internshipTitle: intern.title,
        companyName: intern.companyName || 'Partner Company',
        score: held.meritScore,
        preferenceRank: held.preferenceRank,
        skillMatchScore: held.breakdown.skillScore,
        cgpaScore: held.breakdown.cgpaScore,
        experienceScore: held.breakdown.experienceScore,
        branchScore: held.breakdown.branchScore,
        meritBreakdown: held.breakdown,
        rankWithinQuota: idx + 1,
        totalSeats: intern.totalSeats,
        status: 'ALLOCATED',
        allocatedAt: new Date().toISOString(),
        explanationReasons: [
          `✓ Satisfied all eligibility criteria (CGPA: ${held.student.cgpa.toFixed(2)} ≥ ${intern.minimumCGPA.toFixed(2)}, branch '${held.student.branch}' approved)`,
          `✓ Matches ${held.breakdown.matchedSkills.length} of ${intern.requiredSkills.length} required skills (${held.breakdown.skillScore}%)`,
          `✓ Ranked as candidate's #${held.preferenceRank} preference`,
          `✓ Ranked #${idx + 1} of ${intern.totalSeats} seats by company merit evaluation (Composite Score: ${held.meritScore.toFixed(1)}/100)`,
          `✓ Stable matching: No blocking pair exists where candidate and another employer mutually prefer each other`,
        ],
      };

      allocations.push(allocRecord);
    });
  }

  // 7. Assemble Unallocated Students & Exact Root Cause Explanations
  const unallocatedStudents: AlgorithmResult['unallocatedStudents'] = [];

  for (const student of students) {
    if (!allocatedStudentIds.has(student.id)) {
      const rawPrefs = studentPrefsRaw.get(student.id) || [];
      const eligiblePrefs = studentEligiblePrefs.get(student.id) || [];

      let primaryReason = 'No preferences submitted';
      const unmetPrefs: {
        rank: number;
        internshipTitle: string;
        companyName: string;
        reason: string;
      }[] = [];

      if (rawPrefs.length > 0) {
        if (eligiblePrefs.length === 0) {
          primaryReason = 'Ineligible for all preferred internships (CGPA cutoff or branch mismatch)';
        } else {
          primaryReason =
            'All preferred internship capacities were filled by higher-scoring candidates in stable matching rounds';
        }

        for (const p of rawPrefs) {
          const intern = internshipMap.get(p.internshipId);
          if (!intern) continue;

          const elig = checkEligibility(student, intern, weights.minSkillMatchRatio ?? 0.0);
          let reasonText = '';

          if (!elig.isEligible) {
            reasonText = elig.failedCriteria.join('; ');
          } else {
            const held = heldMap.get(intern.id) || [];
            const minHeldScore = held.length > 0 ? held[held.length - 1].meritScore : 0;
            reasonText = `Capacity (${intern.totalSeats}) filled by candidates with merit scores ≥ ${minHeldScore.toFixed(1)}`;
          }

          unmetPrefs.push({
            rank: p.rank,
            internshipTitle: intern.title,
            companyName: intern.companyName || 'Partner Company',
            reason: reasonText,
          });
        }
      }

      unallocatedStudents.push({
        id: student.id,
        name: student.name,
        rollNumber: student.rollNumber,
        branch: student.branch,
        cgpa: student.cgpa,
        reason: primaryReason,
        unmetPreferences: unmetPrefs,
      });
    }
  }

  // 8. Verify Stability (Blocking-Pair Check)
  let blockingPairsCount = 0;
  for (const student of students) {
    const rawPrefs = studentPrefsRaw.get(student.id) || [];
    const alloc = allocations.find((a) => a.studentId === student.id);
    const assignedRank = alloc ? alloc.preferenceRank : Infinity;

    for (const pref of rawPrefs) {
      if (pref.rank >= assignedRank) {
        // Student does not prefer this internship over their assigned one
        continue;
      }

      const intern = internshipMap.get(pref.internshipId);
      if (!intern) continue;

      const elig = checkEligibility(student, intern, weights.minSkillMatchRatio ?? 0.0);
      if (!elig.isEligible) continue;

      const held = heldMap.get(intern.id) || [];
      const studentMerit = calculateMeritScore(student, intern, weights).totalMeritScore;

      // Condition for blocking pair:
      // (1) Internship has unfilled capacity
      // OR (2) Internship prefers student over some assigned candidate
      const hasUnfilledCapacity = held.length < intern.totalSeats;
      const worstHeld = held.length > 0 ? held[held.length - 1] : null;
      const employerPrefersStudent =
        worstHeld !== null &&
        compareCandidatesByMerit(
          { score: studentMerit, cgpa: student.cgpa, rollNumber: student.rollNumber },
          { score: worstHeld.meritScore, cgpa: worstHeld.student.cgpa, rollNumber: worstHeld.student.rollNumber }
        ) < 0;

      if (hasUnfilledCapacity || employerPrefersStudent) {
        blockingPairsCount++;
      }
    }
  }

  // 9. Analytical Metrics & Performance
  const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const executionTimeMs = Math.round((endTime - startTime) * 100) / 100;

  let totalScoreSum = 0;
  let totalRankSum = 0;
  let firstPrefCount = 0;
  let secondPrefCount = 0;
  let thirdPrefCount = 0;
  const branchDist: Record<string, number> = {};
  const companyUtil: Record<string, { filled: number; total: number }> = {};

  for (const intern of internships) {
    const held = heldMap.get(intern.id) || [];
    const compName = intern.companyName || 'Unknown';
    if (!companyUtil[compName]) {
      companyUtil[compName] = { filled: 0, total: 0 };
    }
    companyUtil[compName].total += intern.totalSeats;
    companyUtil[compName].filled += held.length;
  }

  for (const alloc of allocations) {
    totalScoreSum += alloc.score;
    totalRankSum += alloc.preferenceRank;
    if (alloc.preferenceRank === 1) firstPrefCount++;
    if (alloc.preferenceRank === 2) secondPrefCount++;
    if (alloc.preferenceRank === 3) thirdPrefCount++;

    const b = alloc.studentBranch || 'Other';
    branchDist[b] = (branchDist[b] || 0) + 1;
  }

  const totalSeats = internships.reduce((sum, i) => sum + i.totalSeats, 0);
  const totalAllocated = allocations.length;
  const totalStudents = students.length;

  const avgScore =
    totalAllocated > 0 ? Math.round((totalScoreSum / totalAllocated) * 100) / 100 : 0;
  const avgRank =
    totalAllocated > 0 ? Math.round((totalRankSum / totalAllocated) * 100) / 100 : 0;
  const allocationRate =
    totalStudents > 0 ? Math.round((totalAllocated / totalStudents) * 10000) / 100 : 0;
  const seatUtilization =
    totalSeats > 0 ? Math.round((totalAllocated / totalSeats) * 10000) / 100 : 0;

  const stats: AlgorithmStats = {
    totalStudents,
    eligibleStudents: eligibleStudentsCount,
    totalInternships: internships.length,
    totalSeats,
    totalEligiblePairs: candidatePairs.filter((cp) => !cp.rejectionReason).length,
    eligiblePreferenceRelationships: eligibleRelationsCount,
    totalProposals,
    totalAllocated,
    totalUnallocated: unallocatedStudents.length,
    allocationRate,
    seatUtilization,
    averageScore: avgScore,
    averagePreferenceRank: avgRank,
    executionTimeMs,
    firstPreferenceAllocatedCount: firstPrefCount,
    secondPreferenceAllocatedCount: secondPrefCount,
    thirdPreferenceAllocatedCount: thirdPrefCount,
    topThreePreferencesAllocatedCount: firstPrefCount + secondPrefCount + thirdPrefCount,
    stabilityVerified: blockingPairsCount === 0,
    blockingPairsCount,
    branchDistribution: branchDist,
    companyUtilization: companyUtil,
  };

  return {
    algorithmName: 'Many-to-One Gale-Shapley Stable Matching (Hospital-Residents)',
    algorithmVersion: '2.4-stable',
    allocations,
    unallocatedStudents,
    candidatePairs,
    steps,
    stats,
    weights,
    timestamp: new Date().toISOString(),
    published: false,
  };
}
