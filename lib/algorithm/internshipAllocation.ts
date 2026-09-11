/**
 * SMARTINTERN - ALGORITHM DISPATCHER & INTEGRATION LAYER
 * 
 * Central facade for all allocation algorithms:
 * 1. Many-to-One Gale-Shapley Stable Matching (Default, provably stable)
 * 2. Greedy Multi-Objective Optimization (Benchmark)
 */

import {
  StudentData,
  InternshipData,
  PreferenceData,
  AlgorithmWeights,
  AlgorithmResult,
} from '../types';
import { runGaleShapleyAllocation } from './galeShapley';
import { runGreedyAllocation } from './greedyAllocation';
import { checkEligibility, evaluateSkills, normalizeSkillToken } from './eligibilityEngine';
import {
  calculateMeritScore,
  computeNormalizedCgpaScore,
  computeExperienceScore,
  computeBranchScore,
  DEFAULT_MERIT_WEIGHTS,
} from './meritCalculator';

export {
  runGaleShapleyAllocation,
  runGreedyAllocation,
  checkEligibility,
  evaluateSkills,
  calculateMeritScore,
  DEFAULT_MERIT_WEIGHTS,
};

// Legacy compatibility weights
export const DEFAULT_WEIGHTS: AlgorithmWeights = {
  preferenceWeight: 0.40,
  cgpaWeight: 0.30,
  skillWeight: 0.40,
  experienceWeight: 0.20,
  branchWeight: 0.10,
  minSkillMatchRatio: 0.0,
};

/**
 * Legacy compatibility wrapper for normalizeSkill
 */
export function normalizeSkill(skill: string): string {
  return normalizeSkillToken(skill);
}

/**
 * Legacy compatibility wrapper for computeSkillMatch
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
  const res = evaluateSkills(studentSkills, requiredSkills);
  return {
    matchedCount: res.matchedSkills.length,
    totalRequired: requiredSkills ? requiredSkills.length : 0,
    matchScore: res.matchPercentage,
    matchedSkills: res.matchedSkills,
  };
}

/**
 * Legacy preference score formula
 */
export function computePreferenceScore(rank: number): number {
  if (rank <= 0) return 0;
  return Math.max(0, 100 - (rank - 1) * 10);
}

/**
 * Legacy CGPA score formula
 */
export function computeCgpaScore(cgpa: number): number {
  return computeNormalizedCgpaScore(cgpa);
}

/**
 * Legacy overall score calculation
 */
export function computeOverallScore(
  preferenceScore: number,
  cgpaScore: number,
  skillMatchScore: number,
  weights: AlgorithmWeights
): number {
  const pWeight = weights.preferenceWeight ?? 0.40;
  const cWeight = weights.cgpaWeight ?? 0.30;
  const sWeight = weights.skillWeight ?? 0.30;
  const sum = pWeight + cWeight + sWeight;

  const score =
    (pWeight / sum) * preferenceScore +
    (cWeight / sum) * cgpaScore +
    (sWeight / sum) * skillMatchScore;

  return Math.round(score * 100) / 100;
}

/**
 * Primary Allocation Execution Function
 * Defaults to the Many-to-One Gale-Shapley Stable Matching algorithm.
 */
export function runInternshipAllocation(
  students: StudentData[],
  internships: InternshipData[],
  preferences: PreferenceData[],
  weights: AlgorithmWeights = DEFAULT_WEIGHTS,
  algorithmType: 'GALE_SHAPLEY' | 'GREEDY' = 'GALE_SHAPLEY'
): AlgorithmResult {
  if (algorithmType === 'GREEDY') {
    return runGreedyAllocation(students, internships, preferences, weights);
  }
  return runGaleShapleyAllocation(students, internships, preferences, weights);
}
