package com.smartintern.algorithm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllocationMetrics {
    private int totalStudents;
    private int eligibleStudents;
    private int totalInternships;
    private int totalSeats;
    private int eligiblePreferenceRelationships;
    private int totalProposals;
    private int totalAllocated;
    private int totalUnallocated;
    private double allocationRate;
    private double seatUtilization;
    private double averageScore;
    private double averagePreferenceRank;
    private double executionTimeMs;
    private int firstPreferenceAllocatedCount;
    private int secondPreferenceAllocatedCount;
    private int thirdPreferenceAllocatedCount;
    private boolean stabilityVerified;
    private int blockingPairsCount;
    private Map<String, Integer> branchDistribution;
    private Map<String, Integer> companyUtilization;
}
