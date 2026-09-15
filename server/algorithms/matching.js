// Recruitment Allocation Algorithms

import { checkEligibility } from './eligibility.js';
import { calculateCandidateScore } from './scoring.js';
import { rankCandidates, candidateComparator } from './ranking.js';
import { selectTopN } from './topN.js';
import { calculateStudentOpportunityScore, rankRecommendedOpportunities } from './recommendation.js';
import { BipartiteMatchingGraph } from './matchingGraph.js';

export {
  checkEligibility,
  calculateCandidateScore,
  rankCandidates,
  candidateComparator,
  selectTopN,
  calculateStudentOpportunityScore,
  rankRecommendedOpportunities,
  BipartiteMatchingGraph,
};

// Run full candidate evaluation pipeline
export function executeOpportunityShortlistPipeline(applications, opportunity, customWeights = {}) {
  const evaluatedCandidates = [];
  const ineligibleCandidates = [];

  for (const app of applications) {
    const candidateData = app.snapshot || app.student;
    const eligibility = checkEligibility(candidateData, opportunity);

    if (!eligibility.isEligible) {
      ineligibleCandidates.push({
        applicationId: app._id,
        candidate: candidateData,
        isEligible: false,
        reasons: eligibility.reasons,
        score: 0,
      });
      continue;
    }

    const scoring = calculateCandidateScore(candidateData, opportunity, customWeights);

    evaluatedCandidates.push({
      applicationId: app._id,
      studentId: app.student._id || app.student,
      candidate: candidateData,
      isEligible: true,
      score: scoring.overallScore,
      skillCoverageRatio: scoring.skillCoverageRatio,
      totalExperienceMonths: scoring.totalExperienceMonths,
      scoreBreakdown: scoring.scoreBreakdown,
      appliedAt: app.createdAt || app.submittedAt,
    });
  }

  // Use Min-Heap Top-N selection
  const vacancies = Number(opportunity.vacancies) || 5;
  const { topShortlist, extendedPool } = selectTopN(evaluatedCandidates, vacancies);

  return {
    opportunityId: opportunity._id,
    vacancies,
    totalApplicants: applications.length,
    eligibleCount: evaluatedCandidates.length,
    ineligibleCount: ineligibleCandidates.length,
    topShortlist,
    extendedPool,
    ineligibleCandidates,
  };
}
