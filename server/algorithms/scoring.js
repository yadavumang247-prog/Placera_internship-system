// Calculate weighted compatibility
export function calculateCandidateScore(student, opportunity, customWeights = {}) {
  // Configurable weights (default sum = 1.0)
  const weights = {
    skill: customWeights.skillWeight !== undefined ? Number(customWeights.skillWeight) : 0.40,
    academic: customWeights.academicWeight !== undefined ? Number(customWeights.academicWeight) : 0.20,
    project: customWeights.projectWeight !== undefined ? Number(customWeights.projectWeight) : 0.15,
    experience: customWeights.experienceWeight !== undefined ? Number(customWeights.experienceWeight) : 0.15,
    preference: customWeights.preferenceWeight !== undefined ? Number(customWeights.preferenceWeight) : 0.10,
  };

  // Normalization factor if weights don't sum to exactly 1.0
  const totalWeight = weights.skill + weights.academic + weights.project + weights.experience + weights.preference || 1.0;

  // Max points allocated per component
  const maxPoints = {
    skills: Math.round((weights.skill / totalWeight) * 100),
    academics: Math.round((weights.academic / totalWeight) * 100),
    projects: Math.round((weights.project / totalWeight) * 100),
    experience: Math.round((weights.experience / totalWeight) * 100),
    preferences: Math.round((weights.preference / totalWeight) * 100),
  };

  // 1. Skill Score Computation
  const studentSkills = (Array.isArray(student.skills) ? student.skills : []).map((s) => s.toLowerCase().trim());
  const requiredSkills = (Array.isArray(opportunity.requiredSkills) ? opportunity.requiredSkills : []).map((s) => s.toLowerCase().trim());
  const preferredSkills = (Array.isArray(opportunity.preferredSkills) ? opportunity.preferredSkills : []).map((s) => s.toLowerCase().trim());

  let matchedRequired = 0;
  for (const req of requiredSkills) {
    if (studentSkills.some((s) => s === req || s.includes(req) || req.includes(s))) {
      matchedRequired++;
    }
  }

  let matchedPreferred = 0;
  for (const pref of preferredSkills) {
    if (studentSkills.some((s) => s === pref || s.includes(pref) || pref.includes(s))) {
      matchedPreferred++;
    }
  }

  const reqRatio = requiredSkills.length > 0 ? matchedRequired / requiredSkills.length : 1.0;
  const prefRatio = preferredSkills.length > 0 ? matchedPreferred / preferredSkills.length : 0.5;
  const combinedSkillRatio = requiredSkills.length > 0
    ? (reqRatio * 0.75 + prefRatio * 0.25)
    : (matchedPreferred > 0 ? prefRatio : 0.5);

  const rawSkillScore = Math.min(combinedSkillRatio * maxPoints.skills, maxPoints.skills);
  const skillPoints = Number(rawSkillScore.toFixed(1));

  // 2. Academic Score Computation
  const cgpa = Number(student.cgpa) || 0;
  // CGPA score: 10.0 gets 100% of academic points, 6.0 gets 60%
  const cgpaRatio = Math.min(Math.max(cgpa / 10.0, 0), 1.0);
  let backlogDeduction = (Number(student.activeBacklogs) || 0) * 0.1; // 10% penalty per active backlog
  const academicRatio = Math.max(cgpaRatio - backlogDeduction, 0);
  const academicPoints = Number((academicRatio * maxPoints.academics).toFixed(1));

  // 3. Project Relevance Score Computation
  let projectMatchCount = 0;
  const allTargetSkills = [...requiredSkills, ...preferredSkills];
  const projects = Array.isArray(student.projects) ? student.projects : [];

  for (const proj of projects) {
    const projTechs = (proj.technologies || []).map((t) => t.toLowerCase().trim());
    const projDesc = (proj.description || '').toLowerCase();
    const hasRelevantTech = projTechs.some((tech) =>
      allTargetSkills.some((target) => target === tech || target.includes(tech) || tech.includes(target))
    );
    const hasRelevantDesc = allTargetSkills.some((target) => projDesc.includes(target));
    if (hasRelevantTech || hasRelevantDesc) {
      projectMatchCount++;
    }
  }

  // Base score from having projects + bonus for tech relevancy
  const projectBaseRatio = Math.min(projects.length / 2.0, 1.0) * 0.4;
  const projectRelevanceRatio = projects.length > 0 ? Math.min(projectMatchCount / projects.length, 1.0) * 0.6 : 0;
  const totalProjectRatio = Math.min(projectBaseRatio + projectRelevanceRatio, 1.0);
  const projectPoints = Number((totalProjectRatio * maxPoints.projects).toFixed(1));

  // 4. Experience Score Computation
  let studentMonths = 0;
  if (Array.isArray(student.experience)) {
    studentMonths = student.experience.reduce((sum, exp) => sum + (Number(exp.months) || 0), 0);
  }
  const reqMonths = Number(opportunity.requiredExperienceMonths) || 0;
  let experienceRatio = 0.5; // Base entry level score
  if (reqMonths > 0) {
    experienceRatio = Math.min(studentMonths / reqMonths, 1.2) * 0.8;
  } else {
    // If no experience strictly required, additional experience offers linear advantage up to 12 months
    experienceRatio = Math.min(0.5 + (studentMonths / 12) * 0.5, 1.0);
  }
  const experiencePoints = Number((Math.min(experienceRatio, 1.0) * maxPoints.experience).toFixed(1));

  // 5. Preferences & Certifications Score Computation
  const prefs = student.preferences || {};
  const prefRoles = (prefs.preferredRoles || []).map((r) => r.toLowerCase());
  const oppTitle = (opportunity.title || '').toLowerCase();
  const oppRole = (opportunity.role || '').toLowerCase();
  const roleMatch = prefRoles.some((r) => oppTitle.includes(r) || oppRole.includes(r) || r.includes(oppRole));

  const prefMode = (prefs.workMode || 'ANY').toUpperCase();
  const oppMode = (opportunity.workMode || 'HYBRID').toUpperCase();
  const modeMatch = prefMode === 'ANY' || prefMode === oppMode;

  const certCount = Array.isArray(student.certifications) ? student.certifications.length : 0;
  const certRatio = Math.min(certCount / 2.0, 1.0);

  let preferenceRatio = (roleMatch ? 0.4 : 0.1) + (modeMatch ? 0.3 : 0.1) + (certRatio * 0.3);
  preferenceRatio = Math.min(preferenceRatio, 1.0);
  const preferencePoints = Number((preferenceRatio * maxPoints.preferences).toFixed(1));

  // Total Aggregate Score
  const overallScore = Number(
    Math.min(skillPoints + academicPoints + projectPoints + experiencePoints + preferencePoints, 100).toFixed(1)
  );

  return {
    overallScore,
    skillCoverageRatio: reqRatio,
    totalExperienceMonths: studentMonths,
    scoreBreakdown: {
      skills: skillPoints,
      academics: academicPoints,
      projects: projectPoints,
      experience: experiencePoints,
      preferences: preferencePoints,
      maxPoints,
      details: {
        matchedRequiredSkillsCount: matchedRequired,
        totalRequiredSkillsCount: requiredSkills.length,
        matchedPreferredSkillsCount: matchedPreferred,
        totalPreferredSkillsCount: preferredSkills.length,
        cgpa,
        projectCount: projects.length,
        relevantProjectsCount: projectMatchCount,
        experienceMonths: studentMonths,
        rolePreferenceMatched: roleMatch,
        certificationsCount: certCount,
      },
    },
  };
}
