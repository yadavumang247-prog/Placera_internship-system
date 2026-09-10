package com.smartintern.algorithm;

import com.smartintern.model.Allocation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllocationResult {
    private String algorithmName;
    private String algorithmVersion;
    private List<Allocation> allocations;
    private List<UnallocatedRecord> unallocatedStudents;
    private AllocationMetrics metrics;
    private long timestamp;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UnallocatedRecord {
        private String studentId;
        private String studentName;
        private String rollNumber;
        private String branch;
        private double cgpa;
        private String primaryReason;
    }
}
