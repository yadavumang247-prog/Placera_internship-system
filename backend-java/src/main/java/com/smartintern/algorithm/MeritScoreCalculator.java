package com.smartintern.algorithm;

import com.smartintern.model.Student;
import com.smartintern.model.Internship;
import com.smartintern.model.MeritWeights;
import java.util.List;

/**
 * MeritScoreCalculator calculates multi-factor candidate scores for company rankings:
 * Default:
 * 40% Skill Compatibility
 * 30% CGPA
 * 20% Relevant Experience
 * 10% Branch Compatibility
 */
public class MeritScoreCalculator {

    public static class ScoreBreakdown {
        private final double skillScore;
        private final double cgpaScore;
        private final double experienceScore;
        private final double branchScore;
        private final double totalMeritScore;
        private final List<String> matchedSkills;

        public ScoreBreakdown(double skillScore, double cgpaScore, double experienceScore,
                              double branchScore, double totalMeritScore, List<String> matchedSkills) {
            this.skillScore = skillScore;
            this.cgpaScore = cgpaScore;
            this.experienceScore = experienceScore;
            this.branchScore = branchScore;
            this.totalMeritScore = totalMeritScore;
            this.matchedSkills = matchedSkills;
        }

        public double getSkillScore() { return skillScore; }
        public double getCgpaScore() { return cgpaScore; }
        public double getExperienceScore() { return experienceScore; }
        public double getBranchScore() { return branchScore; }
        public double getTotalMeritScore() { return totalMeritScore; }
        public List<String> getMatchedSkills() { return matchedSkills; }
    }

    public static ScoreBreakdown calculate(Student student, Internship internship, MeritWeights weights) {
        EligibilityEngine.EligibilityCheck check = EligibilityEngine.evaluate(student, internship, 0.0);
        double skillScore = check.getSkillMatchPercentage();

        // CGPA normalized (0-10 scale to 0-100)
        double cgpaScore = Math.min(100.0, Math.max(0.0, (student.getCgpa() / 10.0) * 100.0));

        // Experience score (6+ months -> 100)
        double experienceScore = Math.min(100.0, (Math.max(0, student.getExperienceMonths()) / 6.0) * 100.0);

        // Branch score
        double branchScore = computeBranchFit(student.getBranch(), internship.getAllowedBranches());

        double totalWeight = weights.getSkillWeight() + weights.getCgpaWeight()
                + weights.getExperienceWeight() + weights.getBranchWeight();

        double wSkill = totalWeight > 0 ? weights.getSkillWeight() / totalWeight : 0.40;
        double wCgpa = totalWeight > 0 ? weights.getCgpaWeight() / totalWeight : 0.30;
        double wExp = totalWeight > 0 ? weights.getExperienceWeight() / totalWeight : 0.20;
        double wBranch = totalWeight > 0 ? weights.getBranchWeight() / totalWeight : 0.10;

        double totalMerit = (wSkill * skillScore) + (wCgpa * cgpaScore) + (wExp * experienceScore) + (wBranch * branchScore);
        totalMerit = Math.round(totalMerit * 100.0) / 100.0;

        return new ScoreBreakdown(skillScore, cgpaScore, experienceScore, branchScore, totalMerit, check.getMatchedSkills());
    }

    private static double computeBranchFit(String branch, List<String> allowed) {
        if (allowed == null || allowed.isEmpty()) return 100.0;
        String b = branch.toLowerCase().trim();
        for (String a : allowed) {
            String al = a.toLowerCase().trim();
            if (al.equals("all") || al.equals("all branches") || b.equals(al)) return 100.0;
        }
        if (b.contains("computer") || b.contains("information") || b.contains("software") || b.contains("data")) return 90.0;
        if (b.contains("electronics") || b.contains("electrical")) return 80.0;
        return 70.0;
    }

    /**
     * Deterministic candidate comparator for company tie-breaking:
     * 1. Total Merit Score DESC
     * 2. CGPA DESC
     * 3. Roll Number ASC
     */
    public static int compare(double scoreA, double cgpaA, String rollA,
                               double scoreB, double cgpaB, String rollB) {
        if (Math.abs(scoreB - scoreA) > 0.001) {
            return Double.compare(scoreB, scoreA);
        }
        if (Math.abs(cgpaB - cgpaA) > 0.001) {
            return Double.compare(cgpaB, cgpaA);
        }
        return rollA.compareTo(rollB);
    }
}
