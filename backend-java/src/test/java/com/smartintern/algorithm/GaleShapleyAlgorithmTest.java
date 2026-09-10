package com.smartintern.algorithm;

import com.smartintern.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

class GaleShapleyAlgorithmTest {

    private GaleShapleyAlgorithm algorithm;
    private MeritWeights defaultWeights;

    @BeforeEach
    void setUp() {
        algorithm = new GaleShapleyAlgorithm();
        defaultWeights = MeritWeights.builder()
                .skillWeight(0.40)
                .cgpaWeight(0.30)
                .experienceWeight(0.20)
                .branchWeight(0.10)
                .minSkillMatchRatio(0.0)
                .build();
    }

    @Test
    @DisplayName("1. Eligible student is successfully allocated when seats are available")
    void testEligibleAllocation() {
        Student s1 = Student.builder()
                .id("s1").name("Aarav Sharma").rollNumber("CS001").branch("Computer Science")
                .cgpa(9.2).skills(Arrays.asList("Go", "Kubernetes", "Docker", "Python")).experienceMonths(6)
                .build();

        Internship i1 = Internship.builder()
                .id("i1").companyName("Google India").title("Cloud Engineer").minimumCGPA(8.0)
                .allowedBranches(Arrays.asList("Computer Science", "Information Technology"))
                .requiredSkills(Arrays.asList("Go", "Kubernetes", "Docker"))
                .totalSeats(2).build();

        Preference p1 = Preference.builder().id("p1").studentId("s1").internshipId("i1").rank(1).build();

        AllocationResult result = algorithm.allocate(
                Collections.singletonList(s1),
                Collections.singletonList(i1),
                Collections.singletonList(p1),
                defaultWeights
        );

        assertEquals(1, result.getAllocations().size());
        assertEquals("s1", result.getAllocations().get(0).getStudentId());
        assertEquals("i1", result.getAllocations().get(0).getInternshipId());
        assertTrue(result.getMetrics().isStabilityVerified());
    }

    @Test
    @DisplayName("2. Student with CGPA below cutoff is rejected by Eligibility Engine")
    void testIneligibleCgpaRejected() {
        Student sLow = Student.builder()
                .id("s_low").name("Rohan").rollNumber("CS002").branch("Computer Science")
                .cgpa(7.2).skills(Arrays.asList("Python")).experienceMonths(0)
                .build();

        Internship iHigh = Internship.builder()
                .id("i_high").companyName("Google India").title("SWE").minimumCGPA(8.5)
                .allowedBranches(Arrays.asList("Computer Science"))
                .requiredSkills(Arrays.asList("Python"))
                .totalSeats(1).build();

        Preference p = Preference.builder().id("p").studentId("s_low").internshipId("i_high").rank(1).build();

        AllocationResult result = algorithm.allocate(
                Collections.singletonList(sLow),
                Collections.singletonList(iHigh),
                Collections.singletonList(p),
                defaultWeights
        );

        assertEquals(0, result.getAllocations().size());
        assertEquals(1, result.getUnallocatedStudents().size());
        assertTrue(result.getUnallocatedStudents().get(0).getPrimaryReason().contains("Ineligible"));
    }

    @Test
    @DisplayName("3. Quota enforcement: Capacity limit is strictly respected")
    void testCapacityEnforcement() {
        Student s1 = Student.builder().id("s1").name("Candidate 1").rollNumber("CS01").branch("Computer Science")
                .cgpa(9.5).skills(Arrays.asList("Java", "Spring")).experienceMonths(6).build();
        Student s2 = Student.builder().id("s2").name("Candidate 2").rollNumber("CS02").branch("Computer Science")
                .cgpa(8.8).skills(Arrays.asList("Java", "Spring")).experienceMonths(4).build();

        // Only 1 seat available
        Internship i1 = Internship.builder().id("i1").companyName("Amazon").title("SDE Intern").minimumCGPA(7.0)
                .allowedBranches(Arrays.asList("Computer Science")).requiredSkills(Arrays.asList("Java"))
                .totalSeats(1).build();

        List<Preference> prefs = Arrays.asList(
                Preference.builder().id("p1").studentId("s1").internshipId("i1").rank(1).build(),
                Preference.builder().id("p2").studentId("s2").internshipId("i1").rank(1).build()
        );

        AllocationResult result = algorithm.allocate(Arrays.asList(s1, s2), Collections.singletonList(i1), prefs, defaultWeights);

        assertEquals(1, result.getAllocations().size());
        // Highest merit student s1 secures the single seat
        assertEquals("s1", result.getAllocations().get(0).getStudentId());
        assertEquals(1, result.getUnallocatedStudents().size());
        assertEquals("s2", result.getUnallocatedStudents().get(0).getStudentId());
    }
}
