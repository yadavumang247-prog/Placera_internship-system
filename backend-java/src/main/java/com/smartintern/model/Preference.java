package com.smartintern.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Preference {
    private String id;
    private String studentId;
    private String internshipId;
    private int rank;
}
