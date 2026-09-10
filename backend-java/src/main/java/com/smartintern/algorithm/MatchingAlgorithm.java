package com.smartintern.algorithm;

import com.smartintern.model.Student;
import com.smartintern.model.Internship;
import com.smartintern.model.Preference;
import com.smartintern.model.MeritWeights;
import java.util.List;

/**
 * Interface defining the contract for capacity-constrained internship matching algorithms.
 * Allows polymorphic substitution of:
 * - Many-to-One Gale-Shapley Stable Matching
 * - Greedy Allocation
 * - Hungarian / Maximum Weight Matching
 */
public interface MatchingAlgorithm {

    /**
     * Executes the allocation algorithm over students, internships, and preferences.
     *
     * @param students    List of participating students with academic profiles
     * @param internships List of offered internship roles with seat capacities
     * @param preferences Ordered student preference rankings
     * @param weights     Configurable merit scoring weights
     * @return Comprehensive AllocationResult containing matches, metrics, and audit steps
     */
    AllocationResult allocate(
            List<Student> students,
            List<Internship> internships,
            List<Preference> preferences,
            MeritWeights weights
    );

    /**
     * Returns human-readable name of the algorithm.
     */
    String getAlgorithmName();

    /**
     * Returns algorithm version identifier.
     */
    String getVersion();
}
