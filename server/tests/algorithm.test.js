// Verification test suite for Placera allocation algorithms

import assert from 'assert';
import { checkEligibility } from '../algorithms/eligibility.js';
import { calculateCandidateScore } from '../algorithms/scoring.js';
import { rankCandidates, candidateComparator } from '../algorithms/ranking.js';
import { selectTopN } from '../algorithms/topN.js';
import { validateStateTransition, advanceToNextRound, APPLICATION_STATUSES } from '../services/stateMachineService.js';

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    -> ${err.message}`);
  }
}

console.log('========================================================');
console.log('🧪 Executing Placera Allocation Algorithm Test Suite');
console.log('========================================================');

// ============================================================================
// 1. ELIGIBILITY FILTERING TESTS
// ============================================================================
console.log('\n--- 1. Eligibility Filter Tests ---');

const baseOpportunity = {
  minCgpa: 7.5,
  allowedBranches: ['Computer Science & Engineering', 'Information Technology'],
  allowedDegrees: ['B.Tech'],
  graduationYears: [2026],
  maxBacklogs: 0,
  requiredSkills: ['JavaScript', 'Data Structures'],
  requiredExperienceMonths: 0,
};

runTest('Eligible student passes all requirements', () => {
  const student = {
    cgpa: 8.5,
    branch: 'Computer Science & Engineering',
    degree: 'B.Tech',
    graduationYear: 2026,
    activeBacklogs: 0,
    skills: ['JavaScript', 'Data Structures', 'React'],
    experience: [],
  };
  const result = checkEligibility(student, baseOpportunity);
  assert.strictEqual(result.isEligible, true);
  assert.strictEqual(result.reasons.length, 0);
});

runTest('Ineligible student due to CGPA boundary condition (7.4 vs 7.5)', () => {
  const student = {
    cgpa: 7.49,
    branch: 'Computer Science & Engineering',
    degree: 'B.Tech',
    graduationYear: 2026,
    activeBacklogs: 0,
    skills: ['JavaScript', 'Data Structures'],
    experience: [],
  };
  const result = checkEligibility(student, baseOpportunity);
  assert.strictEqual(result.isEligible, false);
  assert.ok(result.reasons.some((r) => r.includes('Minimum CGPA required')));
});

runTest('Ineligible student due to unallowed branch (Mechanical)', () => {
  const student = {
    cgpa: 9.0,
    branch: 'Mechanical Engineering',
    degree: 'B.Tech',
    graduationYear: 2026,
    activeBacklogs: 0,
    skills: ['JavaScript', 'Data Structures'],
    experience: [],
  };
  const result = checkEligibility(student, baseOpportunity);
  assert.strictEqual(result.isEligible, false);
  assert.ok(result.reasons.some((r) => r.includes('Allowed branches')));
});

runTest('Ineligible student missing mandatory skill (Data Structures missing)', () => {
  const student = {
    cgpa: 8.8,
    branch: 'Computer Science & Engineering',
    degree: 'B.Tech',
    graduationYear: 2026,
    activeBacklogs: 0,
    skills: ['JavaScript', 'Python'], // Missing Data Structures
    experience: [],
  };
  const result = checkEligibility(student, baseOpportunity);
  assert.strictEqual(result.isEligible, false);
  assert.ok(result.reasons.some((r) => r.includes('Missing mandatory skills')));
});

runTest('Ineligible student having active backlogs when max allowed is 0', () => {
  const student = {
    cgpa: 8.2,
    branch: 'Computer Science & Engineering',
    degree: 'B.Tech',
    graduationYear: 2026,
    activeBacklogs: 1,
    skills: ['JavaScript', 'Data Structures'],
    experience: [],
  };
  const result = checkEligibility(student, baseOpportunity);
  assert.strictEqual(result.isEligible, false);
  assert.ok(result.reasons.some((r) => r.includes('active backlogs')));
});

// ============================================================================
// 2. WEIGHTED SCORING TESTS
// ============================================================================
console.log('\n--- 2. Multi-Factor Weighted Scoring Tests ---');

runTest('Scoring generates normalized score between 0 and 100 with accurate breakdown', () => {
  const student = {
    cgpa: 9.0,
    skills: ['React', 'JavaScript', 'Node.js', 'SQL'],
    projects: [
      { title: 'Project 1', technologies: ['React', 'JavaScript'], description: 'Web app' },
      { title: 'Project 2', technologies: ['Node.js', 'SQL'], description: 'Backend API' },
    ],
    experience: [{ company: 'Acme', months: 6 }],
    certifications: [{ name: 'Cloud Cert' }],
    preferences: { preferredRoles: ['Software Engineer'], workMode: 'HYBRID' },
  };

  const opportunity = {
    title: 'Software Engineer',
    role: 'Software Engineer',
    workMode: 'HYBRID',
    requiredSkills: ['React', 'JavaScript', 'Node.js'],
    preferredSkills: ['SQL', 'Docker'],
    requiredExperienceMonths: 3,
  };

  const result = calculateCandidateScore(student, opportunity);
  assert.ok(result.overallScore > 0 && result.overallScore <= 100);
  assert.ok(result.scoreBreakdown.skills > 0);
  assert.ok(result.scoreBreakdown.academics > 0);
  assert.ok(result.scoreBreakdown.projects > 0);
  assert.ok(result.scoreBreakdown.experience > 0);
  assert.ok(result.scoreBreakdown.preferences > 0);
  assert.strictEqual(result.scoreBreakdown.maxPoints.skills, 40);
  assert.strictEqual(result.scoreBreakdown.maxPoints.academics, 20);
});

// ============================================================================
// 3. DETERMINISTIC TIE-BREAKING TESTS
// ============================================================================
console.log('\n--- 3. Deterministic Tie-Breaking Tests ---');

runTest('Equal scores broken by higher mandatory skill coverage ratio', () => {
  const candidateA = { score: 85, skillCoverageRatio: 0.9, totalExperienceMonths: 3, cgpa: 8.5, createdAt: new Date('2026-09-01') };
  const candidateB = { score: 85, skillCoverageRatio: 0.7, totalExperienceMonths: 6, cgpa: 9.0, createdAt: new Date('2026-08-01') };

  const comp = candidateComparator(candidateA, candidateB);
  assert.ok(comp < 0, 'Candidate A should be ranked higher due to higher skill coverage');
});

runTest('Equal scores and skill coverage broken by relevant experience', () => {
  const candidateA = { score: 85, skillCoverageRatio: 0.8, totalExperienceMonths: 6, cgpa: 8.0, createdAt: new Date('2026-09-01') };
  const candidateB = { score: 85, skillCoverageRatio: 0.8, totalExperienceMonths: 2, cgpa: 9.0, createdAt: new Date('2026-08-01') };

  const comp = candidateComparator(candidateA, candidateB);
  assert.ok(comp < 0, 'Candidate A should be ranked higher due to greater experience');
});

runTest('Equal scores, skills, and experience broken by higher CGPA', () => {
  const candidateA = { score: 85, skillCoverageRatio: 0.8, totalExperienceMonths: 3, cgpa: 9.2, createdAt: new Date('2026-09-01') };
  const candidateB = { score: 85, skillCoverageRatio: 0.8, totalExperienceMonths: 3, cgpa: 8.4, createdAt: new Date('2026-08-01') };

  const comp = candidateComparator(candidateA, candidateB);
  assert.ok(comp < 0, 'Candidate A should be ranked higher due to higher CGPA');
});

runTest('All metrics identical broken deterministically by earlier timestamp (FIFO)', () => {
  const earlyTime = new Date('2026-09-01T10:00:00Z');
  const lateTime = new Date('2026-09-01T12:00:00Z');
  const candidateA = { score: 85, skillCoverageRatio: 0.8, totalExperienceMonths: 3, cgpa: 8.5, appliedAt: earlyTime };
  const candidateB = { score: 85, skillCoverageRatio: 0.8, totalExperienceMonths: 3, cgpa: 8.5, appliedAt: lateTime };

  const comp = candidateComparator(candidateA, candidateB);
  assert.ok(comp < 0, 'Candidate A should win tie-break due to earlier application timestamp');
});

// ============================================================================
// 4. TOP-N MIN-HEAP SHORTLISTING TESTS
// ============================================================================
console.log('\n--- 4. Min-Heap Top-N Selection Tests (O(M log N)) ---');

// Generate 100 synthetic applicants with scores 1 to 100
const synthetic100 = Array.from({ length: 100 }, (_, i) => ({
  id: `applicant_${i + 1}`,
  score: i + 1, // score from 1 to 100
  skillCoverageRatio: 0.5,
  totalExperienceMonths: 0,
  cgpa: 7.0,
  appliedAt: new Date(Date.now() + i * 1000),
}));

runTest('Given 100 applicants and N = 5, returns exactly the top 5 highest-scoring candidates', () => {
  const { topShortlist, extendedPool } = selectTopN(synthetic100, 5);
  assert.strictEqual(topShortlist.length, 5);
  assert.strictEqual(extendedPool.length, 95);

  const scores = topShortlist.map((c) => c.score);
  assert.deepStrictEqual(scores, [100, 99, 98, 97, 96]);
  assert.strictEqual(topShortlist[0].rank, 1);
  assert.strictEqual(topShortlist[4].rank, 5);
});

runTest('Edge Case: N = 1 (single top candidate)', () => {
  const { topShortlist, extendedPool } = selectTopN(synthetic100, 1);
  assert.strictEqual(topShortlist.length, 1);
  assert.strictEqual(topShortlist[0].score, 100);
  assert.strictEqual(extendedPool.length, 99);
});

runTest('Edge Case: N > applicant count (e.g. N = 150 for 100 applicants)', () => {
  const { topShortlist, extendedPool } = selectTopN(synthetic100, 150);
  assert.strictEqual(topShortlist.length, 100);
  assert.strictEqual(extendedPool.length, 0);
});

runTest('Edge Case: Empty applicant pool returns empty lists', () => {
  const { topShortlist, extendedPool } = selectTopN([], 5);
  assert.strictEqual(topShortlist.length, 0);
  assert.strictEqual(extendedPool.length, 0);
});

// ============================================================================
// 5. RECRUITMENT STATE MACHINE TESTS
// ============================================================================
console.log('\n--- 5. Recruitment State Machine Progression Tests ---');

runTest('Permits valid sequential state transitions', () => {
  const t1 = validateStateTransition(APPLICATION_STATUSES.APPLIED, APPLICATION_STATUSES.SHORTLISTED);
  assert.strictEqual(t1.isValid, true);

  const t2 = validateStateTransition(APPLICATION_STATUSES.SHORTLISTED, APPLICATION_STATUSES.ROUND_PENDING);
  assert.strictEqual(t2.isValid, true);

  const t3 = validateStateTransition(APPLICATION_STATUSES.ROUND_IN_PROGRESS, APPLICATION_STATUSES.ROUND_PASSED);
  assert.strictEqual(t3.isValid, true);
});

runTest('Blocks illegal skip transitions (e.g. APPLIED directly to SELECTED)', () => {
  const illegal = validateStateTransition(APPLICATION_STATUSES.APPLIED, APPLICATION_STATUSES.SELECTED);
  assert.strictEqual(illegal.isValid, false);
  assert.ok(illegal.error.includes('Illegal recruitment pipeline transition'));
});

runTest('Terminal states (REJECTED, DISQUALIFIED) prevent further progression', () => {
  const invalidFromRejected = validateStateTransition(APPLICATION_STATUSES.REJECTED, APPLICATION_STATUSES.SELECTED);
  assert.strictEqual(invalidFromRejected.isValid, false);
});

console.log('\n========================================================');
console.log(`📊 Test Results: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('========================================================\n');

if (passedTests < totalTests) {
  process.exit(1);
} else {
  console.log('🎉 All algorithm unit tests passed cleanly!');
}
