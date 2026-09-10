/**
 * SMARTINTERN - MERIT SCORING ENGINE
 * 
 * Configurable multi-criteria candidate evaluation engine for company preferences.
 * 
 * Default Weight Distribution:
 * - 40% Skill Compatibility
 * - 30% Cumulative CGPA
 * - 20% Relevant Experience
 * - 10% Academic / Branch Compatibility
 */

import { StudentData, InternshipData, AlgorithmWeights, MeritScoreBreakdown } from '../types';
import { evaluateSkills } from './eligibilityEngine';

export const DEFAULT_MERIT_WEIGHTS: AlgorithmWeights = {
  skillWeight: 0.40,
  cgpaWeight: 0.30,
  experienceWeight: 0.20,
  branchWeight: 0.10,
  minSkillMatchRatio: 0.0,
};

/**
 * Normalizes CGPA (0.0 to 10.0 scale) to a 0 - 100 base score
 */
export function computeNormalizedCgpaScore(cgpa: number): number {
  const clamped = Math.max(0, Math.min(10.0, cgpa));
  return Math.round((clamped / 10.0) * 10000) / 100;
}

/**
 * Computes experience score based on verified internship/project months (scale 0 - 100)
 * 6+ months experience reaches full 100 score
 */
export function computeExperienceScore(experienceMonths: number = 0): number {
  const clamped = Math.max(0, experienceMonths);
  const normalized = Math.min(100, (clamped / 6.0) * 100);
  return Math.round(normalized * 100) / 100;
}

/**
 * Computes branch compatibility score (0 - 100)
 * 100 for core match, 85 for allied tech branches, 70 for general engineering
 */
export function computeBranchScore(
  studentBranch: string,
  allowedBranches?: string[]
): number {
  if (!allowedBranches || allowedBranches.length === 0) {
    return 100;
  }

  const lowerStudent = studentBranch.toLowerCase().trim();

  // Exact match with any allowed branch
  for (const b of allowedBranches) {
    const lowerB = b.toLowerCase().trim();
    if (lowerB === 'all' || lowerB === 'all branches' || lowerStudent === lowerB) {
      return 100;
    }
  }

  // Allied computing/electronics branches
  const isAllied =
    (lowerStudent.includes('computer') ||
      lowerStudent.includes('information') ||
      lowerStudent.includes('data') ||
      lowerStudent.includes('artificial') ||
      lowerStudent.includes('software')) &&
    allowedBranches.some((b) => {
      const lb = b.toLowerCase();
      return (
        lb.includes('computer') ||
        lb.includes('information') ||
        lb.includes('software') ||
        lb.includes('data')
      );
    });

  if (isAllied) return 90;

  if (lowerStudent.includes('electronics') || lowerStudent.includes('electrical')) {
    return 80;
  }

  return 70;
}

/**
 * Computes comprehensive merit score breakdown for a candidate applying to an internship
 */
export function calculateMeritScore(
  student: StudentData,
  internship: InternshipData,
  weights: AlgorithmWeights = DEFAULT_MERIT_WEIGHTS
): MeritScoreBreakdown {
  // 1. Skill Compatibility Score (0 - 100)
  const skillEval = evaluateSkills(student.skills, internship.requiredSkills);
  const skillScore = skillEval.matchPercentage;

  // 2. CGPA Score (0 - 100)
  const cgpaScore = computeNormalizedCgpaScore(student.cgpa);

  // 3. Relevant Experience Score (0 - 100)
  const experienceScore = computeExperienceScore(student.experienceMonths ?? (student.year >= 3 ? 3 : 1));

  // 4. Academic Branch Compatibility (0 - 100)
  const branchScore = computeBranchScore(student.branch, internship.allowedBranches);

  // Normalize weights so they sum to 1.0
  const totalWeight =
    weights.skillWeight +
    weights.cgpaWeight +
    weights.experienceWeight +
    weights.branchWeight;

  const wSkill = totalWeight > 0 ? weights.skillWeight / totalWeight : 0.40;
  const wCgpa = totalWeight > 0 ? weights.cgpaWeight / totalWeight : 0.30;
  const wExp = totalWeight > 0 ? weights.experienceWeight / totalWeight : 0.20;
  const wBranch = totalWeight > 0 ? weights.branchWeight / totalWeight : 0.10;

  const totalMerit =
    wSkill * skillScore +
    wCgpa * cgpaScore +
    wExp * experienceScore +
    wBranch * branchScore;

  return {
    skillScore: Math.round(skillScore * 100) / 100,
    cgpaScore: Math.round(cgpaScore * 100) / 100,
    experienceScore: Math.round(experienceScore * 100) / 100,
    branchScore: Math.round(branchScore * 100) / 100,
    totalMeritScore: Math.round(totalMerit * 100) / 100,
    matchedSkills: skillEval.matchedSkills,
    requiredSkills: internship.requiredSkills,
  };
}

/**
 * Deterministic Candidate Comparator for company rankings & tie-breaking:
 * 1. Total Merit Score DESC
 * 2. Cumulative CGPA DESC
 * 3. Experience Score DESC
 * 4. Student Roll Number ASC (guarantees strictly deterministic output)
 */
export function compareCandidatesByMerit(
  studentA: { score: number; cgpa: number; rollNumber: string; expScore?: number },
  studentB: { score: number; cgpa: number; rollNumber: string; expScore?: number }
): number {
  if (Math.abs(studentB.score - studentA.score) > 0.001) {
    return studentB.score - studentA.score;
  }
  if (Math.abs(studentB.cgpa - studentA.cgpa) > 0.001) {
    return studentB.cgpa - studentA.cgpa;
  }
  if (studentB.expScore !== undefined && studentA.expScore !== undefined) {
    if (Math.abs(studentB.expScore - studentA.expScore) > 0.001) {
      return studentB.expScore - studentA.expScore;
    }
  }
  return studentA.rollNumber.localeCompare(studentB.rollNumber);
}
