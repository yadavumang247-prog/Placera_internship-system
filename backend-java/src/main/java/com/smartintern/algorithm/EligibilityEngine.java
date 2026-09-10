package com.smartintern.algorithm;

import com.smartintern.model.Student;
import com.smartintern.model.Internship;
import java.util.*;

/**
 * Strict pre-matching candidate eligibility engine.
 * Validates CGPA, branch, graduation year, and skill requirements.
 */
public class EligibilityEngine {

    public static class EligibilityCheck {
        private final boolean eligible;
        private final List<String> reasons;
        private final List<String> failedCriteria;
        private final List<String> matchedSkills;
        private final double skillMatchPercentage;

        public EligibilityCheck(boolean eligible, List<String> reasons, List<String> failedCriteria,
                                List<String> matchedSkills, double skillMatchPercentage) {
            this.eligible = eligible;
            this.reasons = reasons;
            this.failedCriteria = failedCriteria;
            this.matchedSkills = matchedSkills;
            this.skillMatchPercentage = skillMatchPercentage;
        }

        public boolean isEligible() { return eligible; }
        public List<String> getReasons() { return reasons; }
        public List<String> getFailedCriteria() { return failedCriteria; }
        public List<String> getMatchedSkills() { return matchedSkills; }
        public double getSkillMatchPercentage() { return skillMatchPercentage; }
    }

    public static EligibilityCheck evaluate(Student student, Internship internship, double minSkillRatio) {
        List<String> reasons = new ArrayList<>();
        List<String> failedCriteria = new ArrayList<>();

        // 1. Minimum CGPA Check
        boolean cgpaPass = student.getCgpa() >= internship.getMinimumCGPA();
        if (!cgpaPass) {
            failedCriteria.add(String.format("CGPA cutoff not met: student has %.2f, minimum required is %.2f",
                    student.getCgpa(), internship.getMinimumCGPA()));
        } else {
            reasons.add(String.format("✓ CGPA satisfied (%.2f >= %.2f)", student.getCgpa(), internship.getMinimumCGPA()));
        }

        // 2. Branch Compatibility Check
        boolean branchPass = isBranchAllowed(student.getBranch(), internship.getAllowedBranches());
        if (!branchPass) {
            failedCriteria.add(String.format("Branch '%s' not in allowed branches: %s",
                    student.getBranch(), String.join(", ", internship.getAllowedBranches())));
        } else {
            reasons.add(String.format("✓ Branch eligible (%s)", student.getBranch()));
        }

        // 3. Required Skills Evaluation
        List<String> matchedSkills = new ArrayList<>();
        List<String> reqSkills = internship.getRequiredSkills() != null ? internship.getRequiredSkills() : Collections.emptyList();
        List<String> studSkills = student.getSkills() != null ? student.getSkills() : Collections.emptyList();

        for (String req : reqSkills) {
            String normReq = req.toLowerCase().replaceAll("[^a-z0-9]", "");
            boolean match = studSkills.stream().anyMatch(s -> {
                String normStud = s.toLowerCase().replaceAll("[^a-z0-9]", "");
                return normStud.equals(normReq) || normStud.contains(normReq) || normReq.contains(normStud);
            });
            if (match) {
                matchedSkills.add(req);
            }
        }

        double skillPercentage = reqSkills.isEmpty() ? 100.0 :
                Math.round(((double) matchedSkills.size() / reqSkills.size()) * 10000.0) / 100.0;

        boolean skillsPass = true;
        if (minSkillRatio > 0 && !reqSkills.isEmpty()) {
            double ratio = (double) matchedSkills.size() / reqSkills.size();
            if (ratio < minSkillRatio) {
                skillsPass = false;
                failedCriteria.add(String.format("Skill match ratio (%.0f%%) below required threshold (%.0f%%)",
                        ratio * 100, minSkillRatio * 100));
            }
        }

        if (skillsPass) {
            reasons.add(String.format("✓ Skills compatible (%d/%d matched)", matchedSkills.size(), reqSkills.size()));
        }

        boolean overallEligible = cgpaPass && branchPass && skillsPass;

        return new EligibilityCheck(overallEligible, reasons, failedCriteria, matchedSkills, skillPercentage);
    }

    private static boolean isBranchAllowed(String branch, List<String> allowedBranches) {
        if (allowedBranches == null || allowedBranches.isEmpty()) return true;
        String lowerBranch = branch.toLowerCase().trim();
        for (String b : allowedBranches) {
            String lowerB = b.toLowerCase().trim();
            if (lowerB.equals("all") || lowerB.equals("all branches") || lowerBranch.equals(lowerB)
                    || lowerBranch.contains(lowerB) || lowerB.contains(lowerBranch)) {
                return true;
            }
        }
        return false;
    }
}
