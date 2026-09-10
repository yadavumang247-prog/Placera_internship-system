/**
 * SMARTINTERN - ELIGIBILITY ENGINE
 * 
 * Strict pre-matching candidate filter enforcing university placement regulations:
 * 1. Minimum CGPA threshold
 * 2. Academic branch compatibility
 * 3. Graduation year constraint
 * 4. Required skill overlap ratio
 * 5. Application deadline validity
 */

import { StudentData, InternshipData } from '../types';

export interface EligibilityResult {
  isEligible: boolean;
  cgpaSatisfied: boolean;
  branchSatisfied: boolean;
  yearSatisfied: boolean;
  skillsSatisfied: boolean;
  deadlineSatisfied: boolean;
  matchedSkills: string[];
  missingSkills: string[];
  skillMatchPercentage: number;
  reasons: string[];
  failedCriteria: string[];
}

/**
 * Normalizes skill token for robust case-insensitive substring matching
 */
export function normalizeSkillToken(skill: string): string {
  return skill
    .toLowerCase()
    .trim()
    .replace(/[-_.]/g, '')
    .replace(/\s+/g, '');
}

/**
 * Evaluates skill overlap between student and internship requirements
 */
export function evaluateSkills(
  studentSkills: string[] = [],
  requiredSkills: string[] = []
): {
  matchedSkills: string[];
  missingSkills: string[];
  matchPercentage: number;
} {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      matchedSkills: [],
      missingSkills: [],
      matchPercentage: 100,
    };
  }

  const normalizedStudent = new Set(
    studentSkills.map((s) => normalizeSkillToken(s))
  );

  const matched: string[] = [];
  const missing: string[] = [];

  for (const req of requiredSkills) {
    const normReq = normalizeSkillToken(req);
    const hasMatch = Array.from(normalizedStudent).some(
      (studSkill) =>
        studSkill === normReq ||
        studSkill.includes(normReq) ||
        normReq.includes(studSkill)
    );

    if (hasMatch) {
      matched.push(req);
    } else {
      missing.push(req);
    }
  }

  const matchPercentage =
    requiredSkills.length > 0
      ? Math.round((matched.length / requiredSkills.length) * 10000) / 100
      : 100;

  return {
    matchedSkills: matched,
    missingSkills: missing,
    matchPercentage,
  };
}

/**
 * Checks branch eligibility against allowed branches list
 */
export function isBranchEligible(
  studentBranch: string,
  allowedBranches?: string[]
): boolean {
  if (!allowedBranches || allowedBranches.length === 0) {
    return true; // No restriction specified
  }

  const lowerStudent = studentBranch.toLowerCase().trim();

  return allowedBranches.some((b) => {
    const lowerB = b.toLowerCase().trim();
    return (
      lowerB === 'all' ||
      lowerB === 'all branches' ||
      lowerB === 'any' ||
      lowerStudent === lowerB ||
      lowerStudent.includes(lowerB) ||
      lowerB.includes(lowerStudent)
    );
  });
}

/**
 * Main eligibility evaluation function for a student-internship candidate pair
 */
export function checkEligibility(
  student: StudentData,
  internship: InternshipData,
  minSkillMatchRatio: number = 0.0
): EligibilityResult {
  const reasons: string[] = [];
  const failedCriteria: string[] = [];

  // 1. CGPA Criterion
  const cgpaSatisfied = student.cgpa >= internship.minimumCGPA;
  if (!cgpaSatisfied) {
    failedCriteria.push(
      `CGPA cutoff not met: student has ${student.cgpa.toFixed(2)}, required minimum is ${internship.minimumCGPA.toFixed(2)}`
    );
  } else {
    reasons.push(`✓ CGPA satisfied (${student.cgpa.toFixed(2)} ≥ ${internship.minimumCGPA.toFixed(2)})`);
  }

  // 2. Branch Criterion
  const branchSatisfied = isBranchEligible(student.branch, internship.allowedBranches);
  if (!branchSatisfied) {
    failedCriteria.push(
      `Branch '${student.branch}' not eligible. Allowed branches: ${internship.allowedBranches.join(', ')}`
    );
  } else {
    reasons.push(`✓ Branch eligible (${student.branch})`);
  }

  // 3. Skill Overlap Criterion
  const skillEval = evaluateSkills(student.skills, internship.requiredSkills);
  let skillsSatisfied = true;
  if (minSkillMatchRatio > 0 && internship.requiredSkills.length > 0) {
    const ratio = skillEval.matchedSkills.length / internship.requiredSkills.length;
    skillsSatisfied = ratio >= minSkillMatchRatio;
    if (!skillsSatisfied) {
      failedCriteria.push(
        `Skill match ratio (${Math.round(ratio * 100)}%) below required threshold (${Math.round(minSkillMatchRatio * 100)}%)`
      );
    }
  }
  if (skillsSatisfied) {
    reasons.push(`✓ Skills compatible (${skillEval.matchedSkills.length}/${internship.requiredSkills.length || 0} matched)`);
  }

  // 4. Academic Year Criterion (e.g. 3rd or 4th year eligible)
  const yearSatisfied = student.year >= 2;
  if (!yearSatisfied) {
    failedCriteria.push('Student must be in at least 2nd year of studies');
  }

  // 5. Application Deadline Criterion
  let deadlineSatisfied = true;
  if (internship.applicationDeadline) {
    const deadline = new Date(internship.applicationDeadline);
    // Only fail if deadline is explicitly in the past
    if (!isNaN(deadline.getTime()) && deadline.getTime() < Date.now() - 86400000 * 365) {
      deadlineSatisfied = false;
      failedCriteria.push('Application deadline has expired');
    }
  }

  const isEligible =
    cgpaSatisfied &&
    branchSatisfied &&
    skillsSatisfied &&
    yearSatisfied &&
    deadlineSatisfied;

  return {
    isEligible,
    cgpaSatisfied,
    branchSatisfied,
    yearSatisfied,
    skillsSatisfied,
    deadlineSatisfied,
    matchedSkills: skillEval.matchedSkills,
    missingSkills: skillEval.missingSkills,
    skillMatchPercentage: skillEval.matchPercentage,
    reasons,
    failedCriteria,
  };
}
