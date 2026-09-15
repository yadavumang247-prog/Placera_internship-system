// Filter eligible applicants
export function checkEligibility(student, opportunity) {
  const reasons = [];
  const criteriaStatus = {};

  // Normalize student attributes
  const studentCgpa = Number(student.cgpa) || 0;
  const minCgpa = Number(opportunity.minCgpa) || 0;
  const studentBranch = (student.branch || '').trim();
  const studentDegree = (student.degree || '').trim();
  const studentGradYear = Number(student.graduationYear) || 0;
  const studentBacklogs = Number(student.activeBacklogs) || 0;
  const maxBacklogs = opportunity.maxBacklogs !== undefined ? Number(opportunity.maxBacklogs) : 0;

  // 1. CGPA Requirement Check
  const cgpaPassed = studentCgpa >= minCgpa;
  criteriaStatus.cgpa = {
    passed: cgpaPassed,
    required: minCgpa,
    actual: studentCgpa,
  };
  if (!cgpaPassed) {
    reasons.push(`Minimum CGPA required: ${minCgpa.toFixed(2)} (Your CGPA: ${studentCgpa.toFixed(2)})`);
  }

  // 2. Allowed Branches Check (if specified)
  const allowedBranches = Array.isArray(opportunity.allowedBranches) ? opportunity.allowedBranches : [];
  if (allowedBranches.length > 0) {
    const branchMatched = allowedBranches.some(
      (b) => b.toLowerCase().trim() === studentBranch.toLowerCase() ||
             studentBranch.toLowerCase().includes(b.toLowerCase().trim()) ||
             b.toLowerCase().trim().includes(studentBranch.toLowerCase())
    );
    criteriaStatus.branch = {
      passed: branchMatched,
      required: allowedBranches,
      actual: studentBranch,
    };
    if (!branchMatched) {
      reasons.push(`Allowed branches: ${allowedBranches.join(', ')} (Your branch: ${studentBranch || 'Not specified'})`);
    }
  } else {
    criteriaStatus.branch = { passed: true, required: 'All Branches', actual: studentBranch };
  }

  // 3. Allowed Degrees Check (if specified)
  const allowedDegrees = Array.isArray(opportunity.allowedDegrees) ? opportunity.allowedDegrees : [];
  if (allowedDegrees.length > 0) {
    const degreeMatched = allowedDegrees.some(
      (d) => d.toLowerCase().trim() === studentDegree.toLowerCase().trim()
    );
    criteriaStatus.degree = {
      passed: degreeMatched,
      required: allowedDegrees,
      actual: studentDegree,
    };
    if (!degreeMatched) {
      reasons.push(`Allowed degrees: ${allowedDegrees.join(', ')} (Your degree: ${studentDegree || 'Not specified'})`);
    }
  } else {
    criteriaStatus.degree = { passed: true, required: 'All Degrees', actual: studentDegree };
  }

  // 4. Graduating Batch / Year Check (if specified)
  const allowedGradYears = Array.isArray(opportunity.graduationYears) ? opportunity.graduationYears : [];
  if (allowedGradYears.length > 0) {
    const yearMatched = allowedGradYears.includes(studentGradYear);
    criteriaStatus.graduationYear = {
      passed: yearMatched,
      required: allowedGradYears,
      actual: studentGradYear,
    };
    if (!yearMatched) {
      reasons.push(`Eligible graduation batches: ${allowedGradYears.join(', ')} (Your batch: ${studentGradYear})`);
    }
  } else {
    criteriaStatus.graduationYear = { passed: true, required: 'Any Batch', actual: studentGradYear };
  }

  // 5. Active Backlogs Check
  const backlogsPassed = studentBacklogs <= maxBacklogs;
  criteriaStatus.backlogs = {
    passed: backlogsPassed,
    requiredMax: maxBacklogs,
    actual: studentBacklogs,
  };
  if (!backlogsPassed) {
    reasons.push(`Maximum active backlogs allowed: ${maxBacklogs} (You have: ${studentBacklogs})`);
  }

  // 6. Mandatory Required Skills Check
  const requiredSkills = Array.isArray(opportunity.requiredSkills) ? opportunity.requiredSkills : [];
  const studentSkills = (Array.isArray(student.skills) ? student.skills : []).map((s) => s.toLowerCase().trim());
  const missingSkills = [];

  for (const req of requiredSkills) {
    const reqNormalized = req.toLowerCase().trim();
    const hasSkill = studentSkills.some(
      (s) => s === reqNormalized || s.includes(reqNormalized) || reqNormalized.includes(s)
    );
    if (!hasSkill) {
      missingSkills.push(req);
    }
  }

  const skillsPassed = missingSkills.length === 0;
  criteriaStatus.mandatorySkills = {
    passed: skillsPassed,
    required: requiredSkills,
    missing: missingSkills,
  };
  if (!skillsPassed) {
    reasons.push(`Missing mandatory skills: ${missingSkills.join(', ')}`);
  }

  // 7. Experience Requirement Check (in months)
  const reqExperienceMonths = Number(opportunity.requiredExperienceMonths) || 0;
  let totalStudentMonths = 0;
  if (Array.isArray(student.experience)) {
    totalStudentMonths = student.experience.reduce((sum, exp) => sum + (Number(exp.months) || 0), 0);
  }
  const experiencePassed = totalStudentMonths >= reqExperienceMonths;
  criteriaStatus.experience = {
    passed: experiencePassed,
    requiredMonths: reqExperienceMonths,
    actualMonths: totalStudentMonths,
  };
  if (!experiencePassed) {
    reasons.push(`Minimum experience required: ${reqExperienceMonths} months (Your total: ${totalStudentMonths} months)`);
  }

  const isEligible = reasons.length === 0;

  return {
    isEligible,
    reasons,
    criteriaStatus,
  };
}
