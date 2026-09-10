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
public class Student {
    private String id;
    private String name;
    private String email;
    private String rollNumber;
    private String branch;
    private int year;
    private double cgpa;
    private List<String> skills;
    private int experienceMonths;
    private String resumeUrl;
}
