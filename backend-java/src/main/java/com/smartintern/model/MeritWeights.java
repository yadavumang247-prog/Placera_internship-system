package com.smartintern.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeritWeights {
    @Builder.Default
    private double skillWeight = 0.40;

    @Builder.Default
    private double cgpaWeight = 0.30;

    @Builder.Default
    private double experienceWeight = 0.20;

    @Builder.Default
    private double branchWeight = 0.10;

    @Builder.Default
    private double minSkillMatchRatio = 0.0;
}
