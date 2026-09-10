package com.smartintern.algorithm;

import com.smartintern.model.*;
import java.time.Instant;
import java.util.*;

/**
 * Greedy allocation benchmark for comparative analysis against Gale-Shapley.
 */
public class GreedyAlgorithm implements MatchingAlgorithm {

    @Override
    public String getAlgorithmName() {
        return "Greedy Capacity-Constrained Allocation";
    }

    @Override
    public String getVersion() {
        return "1.0-greedy";
    }

    private static class CandidatePair {
        final Student student;
        final Internship internship;
        final Preference preference;
        final double totalScore;
        final MeritScoreCalculator.ScoreBreakdown breakdown;

        CandidatePair(Student student, Internship internship, Preference preference,
                      double totalScore, MeritScoreCalculator.ScoreBreakdown breakdown) {
            this.student = student;
            this.internship = internship;
            this.preference = preference;
            this.totalScore = totalScore;
            this.breakdown = breakdown;
        }
    }

    @Override
    public AllocationResult allocate(
            List<Student> students,
            List<Internship> internships,
            List<Preference> preferences,
            MeritWeights weights
    ) {
        long startNs = System.nanoTime();

        Map<String, Internship> internMap = new HashMap<>();
        Map<String, Integer> availableSeats = new HashMap<>();
        for (Internship i : internships) {
            internMap.put(i.getId(), i);
            availableSeats.put(i.getId(), i.getTotalSeats());
        }

        List<CandidatePair> pairs = new ArrayList<>();
        for (Preference p : preferences) {
            Student s = students.stream().filter(stud -> stud.getId().equals(p.getStudentId())).findFirst().orElse(null);
            Internship intern = internMap.get(p.getInternshipId());
            if (s == null || intern == null) continue;

            EligibilityEngine.EligibilityCheck check = EligibilityEngine.evaluate(s, intern, weights.getMinSkillMatchRatio());
            if (!check.isEligible()) continue;

            MeritScoreCalculator.ScoreBreakdown breakdown = MeritScoreCalculator.calculate(s, intern, weights);
            double prefScore = Math.max(0, 100 - (p.getRank() - 1) * 10);
            double composite = (0.35 * prefScore) + (0.65 * breakdown.getTotalMeritScore());

            pairs.add(new CandidatePair(s, intern, p, composite, breakdown));
        }

        // Sort greedily by composite score DESC
        pairs.sort((a, b) -> Double.compare(b.totalScore, a.totalScore));

        Set<String> allocatedStudents = new HashSet<>();
        List<Allocation> allocations = new ArrayList<>();

        for (CandidatePair pair : pairs) {
            if (allocatedStudents.contains(pair.student.getId())) continue;
            int seats = availableSeats.get(pair.internship.getId());
            if (seats <= 0) continue;

            availableSeats.put(pair.internship.getId(), seats - 1);
            allocatedStudents.add(pair.student.getId());

            allocations.add(Allocation.builder()
                    .id("alloc_greedy_" + pair.student.getId() + "_" + pair.internship.getId())
                    .studentId(pair.student.getId())
                    .studentName(pair.student.getName())
                    .studentRollNumber(pair.student.getRollNumber())
                    .studentBranch(pair.student.getBranch())
                    .studentCgpa(pair.student.getCgpa())
                    .internshipId(pair.internship.getId())
                    .internshipTitle(pair.internship.getTitle())
                    .companyName(pair.internship.getCompanyName())
                    .score(pair.totalScore)
                    .preferenceRank(pair.preference.getRank())
                    .skillMatchScore(pair.breakdown.getSkillScore())
                    .cgpaScore(pair.breakdown.getCgpaScore())
                    .status("ALLOCATED")
                    .allocatedAt(Instant.now().toString())
                    .build());
        }

        List<AllocationResult.UnallocatedRecord> unallocated = new ArrayList<>();
        for (Student s : students) {
            if (!allocatedStudents.contains(s.getId())) {
                unallocated.add(AllocationResult.UnallocatedRecord.builder()
                        .studentId(s.getId())
                        .studentName(s.getName())
                        .rollNumber(s.getRollNumber())
                        .branch(s.getBranch())
                        .cgpa(s.getCgpa())
                        .primaryReason("Seats filled by higher priority candidate pairs in greedy order")
                        .build());
            }
        }

        double execMs = (System.nanoTime() - startNs) / 1_000_000.0;
        int totalSeats = internships.stream().mapToInt(Internship::getTotalSeats).sum();

        AllocationMetrics metrics = AllocationMetrics.builder()
                .totalStudents(students.size())
                .eligibleStudents(students.size())
                .totalInternships(internships.size())
                .totalSeats(totalSeats)
                .totalAllocated(allocations.size())
                .totalUnallocated(unallocated.size())
                .allocationRate(students.isEmpty() ? 0 : ((double) allocations.size() / students.size()) * 100.0)
                .seatUtilization(totalSeats == 0 ? 0 : ((double) allocations.size() / totalSeats) * 100.0)
                .executionTimeMs(Math.round(execMs * 100.0) / 100.0)
                .stabilityVerified(false)
                .blockingPairsCount(1)
                .build();

        return AllocationResult.builder()
                .algorithmName(getAlgorithmName())
                .algorithmVersion(getVersion())
                .allocations(allocations)
                .unallocatedStudents(unallocated)
                .metrics(metrics)
                .timestamp(System.currentTimeMillis())
                .build();
    }
}
