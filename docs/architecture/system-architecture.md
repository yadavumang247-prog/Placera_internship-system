# System Architecture

## 1. High-Level Architecture

The **Placera** platform (Placera — Smart Internship & Placement Allocation Platform) is designed as a decoupled, multi-tiered architecture built for high reliability, deterministic algorithmic evaluation, and strict candidate fairness:

```
+-----------------------------------------------------------------------------+
|                                 CLIENT TIER                                 |
|  React 18 SPA (Vite) · Vanilla CSS Design System · Role-Based Navigation    |
|  [Student Portal]         [Recruiter Portal]          [Placement Cell TPO]  |
+---------------------------------------+-------------------------------------+
                                        | HTTPS / REST JSON APIs
                                        v
+-----------------------------------------------------------------------------+
|                                 SERVER TIER                                 |
|  Node.js (ESM) · Express.js Router & Middleware Pipeline                   |
|  - JWT Authentication & RBAC (STUDENT, RECRUITER, ADMIN)                    |
|  - Multer PDF Resume Ingestion & Secure Static Serving                      |
|  - State Machine Transition Validator                                       |
|  - Sandbox Code Runner Interface                                            |
+---------------------------------------+-------------------------------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v                                             v
+---------------------------------+           +---------------------------------+
|       ALGORITHM ENGINE          |           |           DATA TIER             |
| - Deterministic Eligibility     |           | MongoDB & Mongoose ORM          |
| - 5-Factor Weighted Scoring     |           | - Immutable Snapshots           |
| - 5-Tier Tie-Breaking           |           | - Audit Trail & Logs            |
| - O(M log N) Binary Min-Heap    |           | - Automated In-Memory Fallback  |
| - Bipartite Matching Graph      |           +---------------------------------+
+---------------------------------+
```

---

## 2. Core Architectural Pillars

### 2.1 Pre-Deadline Candidate Fairness Privacy Lock
In traditional recruitment systems, early applicant bias and partial screening compromise meritocracy. This platform strictly enforces an automated privacy lock:
1. **Prior to Deadline**: When an opportunity's application deadline has not yet passed (`new Date() <= applicationDeadline`), recruiters querying the candidates endpoint receive an aggregate applicant count only (`isLocked: true`, `totalApplications: N`). Individual identities, academic scores, and resumes remain completely obscured.
2. **Post-Deadline**: Once the deadline closes, the platform unlocks the full candidate evaluation suite and enables the binary min-heap ranking engine.

### 2.2 Immutable Application Snapshots
When a candidate applies to an opportunity, the platform generates a standalone `ApplicationSnapshot` document:
- Captures candidate's exact CGPA, verified roll number, backlogs, skills list with proficiencies, project records, and resume document URL at that exact moment.
- If a student subsequently edits their profile (e.g., changes skills or CGPA), all historical and in-progress applications evaluate strictly against the permanent snapshot record, eliminating evaluation tampering or retrospective discrepancies.

### 2.3 Sequential Recruitment State Machine
Candidate progress is governed by strict deterministic transitions:
```
APPLIED 
   │
   ▼
SHORTLISTED (via Algorithmic Top-N Min-Heap)
   │
   ▼
ASSESSMENT_SCHEDULED
   │
   ▼
INTERVIEW_SCHEDULED
   │
   ▼
OFFER_EXTENDED ───► OFFER_ACCEPTED (locks student per One-Student One-Job policy)
   │
   ▼
OFFER_DECLINED / REJECTED
```

---

## 3. Database Schema Overview

The database utilizes MongoDB with 13 domain-specific collections:
- `users`: Core authentication record (email, password hash, role).
- `student_profiles`: Academic credentials, skill tags, project portfolio, experience entries, resume link, verification status.
- `recruiter_profiles`: Designation, enterprise affiliations, verification state.
- `organizations`: Corporate profile, industry, verification accreditation.
- `opportunities`: Role details, compensation, deadlines, deterministic eligibility criteria, required skill weights, recruitment rounds.
- `application_snapshots`: Permanent point-in-time profile snapshot.
- `applications`: Application state, overall composite fit score, sub-scores, snapshot pointer.
- `recruitment_rounds`: Pipeline definitions for screening, assessments, and interviews.
- `questions` & `assessments`: Timed MCQ test banks and sandboxed coding challenges.
- `assessment_attempts`: Instant auto-grading, responses, percentages, and timestamps.
- `interviews`: Scheduled video panel appointments, meeting links, and multi-criteria evaluation rubrics.
- `placement_drives`: Institutional university seasonal recruitment cycles.
- `algorithm_configs`: University-wide dynamic weighting calibrations ($w_{skill}, w_{acad}, w_{proj}, w_{exp}, w_{pref}$).
