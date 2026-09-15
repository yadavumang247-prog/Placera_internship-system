// Student Opportunity Recommendation Module

import { checkEligibility } from './eligibility.js';
import { calculateCandidateScore } from './scoring.js';

// Calculate candidate compatibility score
export function calculateStudentOpportunityScore(student, opportunity, customWeights = {}) {
  // 1. Evaluate baseline eligibility
  const eligibility = checkEligibility(student, opportunity);

  // 2. Calculate multi-factor compatibility score
  const scoring = calculateCandidateScore(student, opportunity, customWeights);

  // Generate explanatory highlights for student UI
  const highlights = [];
  if (eligibility.isEligible) {
    highlights.push('✓ Fully meets academic CGPA and branch requirements');
  } else {
    highlights.push(`✗ Does not meet strict eligibility: ${eligibility.reasons[0]}`);
  }

  const skillCoverage = Math.round(
    (scoring.scoreBreakdown.details.matchedRequiredSkillsCount /
      Math.max(1, scoring.scoreBreakdown.details.totalRequiredSkillsCount)) * 100
  );
  if (skillCoverage >= 80) {
    highlights.push(`✓ High skill overlap (${skillCoverage}% of mandatory requirements)`);
  } else {
    highlights.push(`~ Matches ${skillCoverage}% of required skills`);
  }

  if (scoring.scoreBreakdown.details.rolePreferenceMatched) {
    highlights.push('✓ Aligns with your career role preference');
  }

  return {
    score: scoring.overallScore,
    isEligible: eligibility.isEligible,
    eligibilityReasons: eligibility.reasons,
    skillMatch: scoring.scoreBreakdown.skills,
    academicMatch: scoring.scoreBreakdown.academics,
    projectMatch: scoring.scoreBreakdown.projects,
    experienceMatch: scoring.scoreBreakdown.experience,
    preferenceMatch: scoring.scoreBreakdown.preferences,
    maxPoints: scoring.scoreBreakdown.maxPoints,
    details: scoring.scoreBreakdown.details,
    highlights,
  };
}

// Rank opportunities by match score
export function rankRecommendedOpportunities(student, opportunities, customWeights = {}) {
  if (!Array.isArray(opportunities)) return [];

  const scored = opportunities.map((opp) => {
    const match = calculateStudentOpportunityScore(student, opp, customWeights);
    return {
      opportunity: opp,
      match,
    };
  });

  // Sort: Eligible first, then highest match score descending
  scored.sort((a, b) => {
    if (a.match.isEligible && !b.match.isEligible) return -1;
    if (!a.match.isEligible && b.match.isEligible) return 1;
    return b.match.score - a.match.score;
  });

  return scored;
}
