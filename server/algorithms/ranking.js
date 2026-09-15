// Resolve ranking ties
export function candidateComparator(a, b) {
  const scoreDiff = b.score - a.score;
  if (Math.abs(scoreDiff) > 0.01) {
    return scoreDiff;
  }

  // Tie-Breaker 1: Higher mandatory skill coverage ratio
  const skillCoverageA = a.skillCoverageRatio || 0;
  const skillCoverageB = b.skillCoverageRatio || 0;
  if (Math.abs(skillCoverageB - skillCoverageA) > 0.01) {
    return skillCoverageB - skillCoverageA;
  }

  // Tie-Breaker 2: Higher relevant experience duration (months)
  const expA = a.totalExperienceMonths || 0;
  const expB = b.totalExperienceMonths || 0;
  if (expB !== expA) {
    return expB - expA;
  }

  // Tie-Breaker 3: Higher academic score (CGPA)
  const cgpaA = a.cgpa || (a.snapshot ? a.snapshot.cgpa : 0) || 0;
  const cgpaB = b.cgpa || (b.snapshot ? b.snapshot.cgpa : 0) || 0;
  if (Math.abs(cgpaB - cgpaA) > 0.01) {
    return cgpaB - cgpaA;
  }

  // Tie-Breaker 4: Higher project relevance / project count
  const projA = a.projectCount || (a.snapshot && Array.isArray(a.snapshot.projects) ? a.snapshot.projects.length : 0) || 0;
  const projB = b.projectCount || (b.snapshot && Array.isArray(b.snapshot.projects) ? b.snapshot.projects.length : 0) || 0;
  if (projB !== projA) {
    return projB - projA;
  }

  // Tie-Breaker 5: Earlier valid application timestamp (FIFO fairness)
  const timeA = new Date(a.appliedAt || a.createdAt || 0).getTime();
  const timeB = new Date(b.appliedAt || b.createdAt || 0).getTime();
  return timeA - timeB; // Earlier timestamp wins (ascending order)
}

// Rank candidates by score
export function rankCandidates(candidates) {
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return [];
  }

  // Create a shallow copy and sort deterministically
  const sorted = [...candidates].sort(candidateComparator);

  // Assign 1-indexed rank
  return sorted.map((candidate, index) => ({
    ...candidate,
    rank: index + 1,
  }));
}
