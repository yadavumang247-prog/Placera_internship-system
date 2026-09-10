package com.smartintern.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Allocation {
    private String id;
    private String studentId;
    private String studentName;
    private String studentRollNumber;
    private String studentBranch;
    private double studentCgpa;
    private String internshipId;
    private String internshipTitle;
    private String companyName;
    private double score;
    private int preferenceRank;
    private double skillMatchScore;
    private double cgpaScore;
    private double experienceScore;
    private double branchScore;
    private int rankWithinQuota;
    private int totalSeats;
    private String status;
    private String allocatedAt;
    private List<String> explanationReasons;
}
