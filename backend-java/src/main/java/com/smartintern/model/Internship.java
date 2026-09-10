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
public class Internship {
    private String id;
    private String companyId;
    private String companyName;
    private String title;
    private String description;
    private String location;
    private String mode;
    private int stipend;
    private String duration;
    private double minimumCGPA;
    private List<String> allowedBranches;
    private List<String> requiredSkills;
    private int totalSeats;
    private int availableSeats;
    private String applicationDeadline;
}
