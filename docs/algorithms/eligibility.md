# Deterministic Eligibility Filtering Algorithm

## 1. Overview
The Eligibility Engine evaluates whether a student meets the minimum academic and administrative criteria specified by a recruiter for a given role before allowing an application to be submitted.

Unlike basic keyword filtering, the evaluation is **deterministic**, **exhaustive**, and returns **transparent reasons for rejection** if any criterion fails.

---

## 2. Evaluation Criteria

| Rule Parameter | Type | Description | Evaluation Logic |
| :--- | :--- | :--- | :--- |
| `minCgpa` | `Number` (0.0 - 10.0) | Minimum cumulative grade point average | $CGPA_{student} \ge minCgpa$ |
| `allowedBranches` | `Array<String>` | Permitted academic departments | $Department_{student} \in allowedBranches$ |
| `maxActiveBacklogs` | `Number` | Maximum permitted standing backlogs | $BacklogsActive_{student} \le maxActiveBacklogs$ |
| `maxHistoryBacklogs` | `Number` | Maximum historical backlog count | $BacklogsHistory_{student} \le maxHistoryBacklogs$ |
| `graduationYears` | `Array<Number>` | Target cohort graduation year(s) | $GradYear_{student} \in graduationYears$ |

---

## 3. Algorithm Specification

```typescript
function checkEligibility(student: StudentProfile, opportunity: Opportunity): EligibilityResult {
  const failedReasons: string[] = [];

  // 1. Profile Verification Guard
  if (!student.isVerified) {
    failedReasons.push("Student profile has not yet been verified by the Placement Cell.");
  }

  // 2. Minimum CGPA Check
  if (opportunity.eligibilityCriteria.minCgpa !== undefined) {
    if (student.academics.cgpa < opportunity.eligibilityCriteria.minCgpa) {
      failedReasons.push(
        `CGPA ${student.academics.cgpa} is below the minimum required ${opportunity.eligibilityCriteria.minCgpa}.`
      );
    }
  }

  // 3. Department / Branch Whitelist Check
  if (opportunity.eligibilityCriteria.allowedBranches?.length > 0) {
    if (!opportunity.eligibilityCriteria.allowedBranches.includes(student.academics.department)) {
      failedReasons.push(
        `Department "${student.academics.department}" is not among eligible branches.`
      );
    }
  }

  // 4. Backlog Constraints
  if (student.academics.activeBacklogs > opportunity.eligibilityCriteria.maxActiveBacklogs) {
    failedReasons.push(
      `Active backlogs (${student.academics.activeBacklogs}) exceed maximum allowed (${opportunity.eligibilityCriteria.maxActiveBacklogs}).`
    );
  }

  // 5. Graduation Year Match
  if (opportunity.eligibilityCriteria.graduationYears?.length > 0) {
    if (!opportunity.eligibilityCriteria.graduationYears.includes(student.academics.graduationYear)) {
      failedReasons.push(
        `Graduation year ${student.academics.graduationYear} is not eligible.`
      );
    }
  }

  return {
    isEligible: failedReasons.length === 0,
    reasons: failedReasons
  };
}
```

---

## 4. Complexity Analysis
- **Time Complexity**: $O(B + Y)$ where $B$ is the number of allowed branches and $Y$ is the number of targeted graduation years. Because branch and year sets are small ($< 15$), execution is effectively $O(1)$.
- **Space Complexity**: $O(K)$ where $K$ is the number of rejection reason strings.
