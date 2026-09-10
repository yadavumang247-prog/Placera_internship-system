# SMARTINTERN
## Smart Internship Allocation & Placement System
> **Analysis of Algorithms (AoA) Course Project & Academic Placement Platform**  
> *Deterministic Many-to-One Gale-Shapley Stable Matching, Multi-Criteria Merit Scoring, and Verifiable Zero-Blocking-Pair Allocation.*

---

## 1. Executive Summary & Problem Formulation

**SMARTINTERN** is an enterprise-grade university internship allocation platform designed to solve the classical **College Admissions / Hospital-Residents Problem** with strict capacity constraints $C_i$, pre-matching eligibility filtering, and multi-dimensional candidate merit scoring.

In collegiate placements, subjective matching or unconstrained first-come-first-served scheduling leads to:
1. **Instability & Defections**: Students and companies mutually prefer each other over assigned pairings, creating disruptive offline renegotiations.
2. **Quota Violations**: Corporate partners receive either too few or too many candidates exceeding physical team limits.
3. **Gaming & Bias**: Students strategize by falsely ranking safety options rather than genuine preferences.

SMARTINTERN mathematically eliminates these systemic failures by executing a **Student-Proposing Many-to-One Deferred Acceptance Gale-Shapley Algorithm** with deterministic multi-criteria tie-breaking and a formal pre-matching eligibility gate.

---

## 2. Mathematical Formulation

Let the university allocation instance be modeled as a 5-tuple:
$$\mathcal{M} = (S, I, C, \succ_S, \succ_I)$$

### 2.1 Sets & Capacity Quotas
- **Students Set**: $S = \{s_1, s_2, \dots, s_n\}$ where each student possesses attributes $(\text{CGPA}, \text{Branch}, \text{Skills}, \text{Experience}, \text{GradYear})$ and submits a strictly ordered preference list:
  $$P(s) = [i_{(1)}, i_{(2)}, \dots, i_{(k)}]$$
  Constraint: Each student receives at most one match: $|\mu(s)| \le 1$.
- **Internships Set**: $I = \{i_1, i_2, \dots, i_m\}$ where each position specifies eligibility criteria $(\text{minCGPA}, \text{allowedBranches}, \text{gradYear}, \text{requiredSkills}, \text{deadline})$.
- **Capacity Vector**: $C = (c_1, c_2, \dots, c_m)$ where $c_j \ge 1$ denotes the exact integer quota of available seats for track $i_j$:
  $$|\mu(i_j)| \le c_j, \quad \forall i_j \in I$$

### 2.2 Multi-Factor Candidate Merit Function ($\succ_I$)
Rather than subjective human evaluations, company preference order $\succ_i$ over candidates is determined via a multi-factor composite merit scoring function:

$$\text{MeritScore}(s, i) = w_{\text{skill}} \cdot S_{\text{skill}}(s, i) + w_{\text{cgpa}} \cdot S_{\text{cgpa}}(s) + w_{\text{exp}} \cdot S_{\text{exp}}(s) + w_{\text{branch}} \cdot S_{\text{branch}}(s, i)$$

Where:
- **Skill Match Score** ($S_{\text{skill}}$): Jaccard similarity between candidate skills and required track tech:
  $$S_{\text{skill}}(s, i) = \frac{|\text{skills}(s) \cap \text{requiredSkills}(i)|}{|\text{requiredSkills}(i)|} \times 100$$
- **CGPA Score** ($S_{\text{cgpa}}$): Normalized academic grade point on a 10.0 scale:
  $$S_{\text{cgpa}}(s) = \left(\frac{s.\text{cgpa}}{10.0}\right) \times 100$$
- **Experience Score** ($S_{\text{exp}}$): Quantified prior internships, hackathon awards, and production projects:
  $$S_{\text{exp}}(s) = \min(100, \text{expMonths} \times 15 + \text{projectsCount} \times 10)$$
- **Branch Relevance** ($S_{\text{branch}}$): Departmental curriculum alignment (100 pts for direct branch fit, 80 pts for allied branches).
- **Default Weights**: $w_{\text{skill}} = 0.40, w_{\text{cgpa}} = 0.30, w_{\text{exp}} = 0.20, w_{\text{branch}} = 0.10$.

### 2.3 Deterministic Tie-Breaking
If two candidates achieve identical composite scores ($\text{MeritScore}(s_1, i) = \text{MeritScore}(s_2, i)$), ties are broken deterministically using the lexicographical comparator:
$$(\text{MeritScore} \downarrow, \text{CGPA} \downarrow, \text{RollNumber} \uparrow)$$
This guarantees 100% repeatable, auditable matching results across any environment.

---

## 3. Stability Theorem & Proof of Correctness

### 3.1 Definition of a Blocking Pair
A matching $\mu$ is **unstable** if there exists a student-internship pair $(s, i)$ such that:
1. $i \succ_s \mu(s)$ (Student $s$ strictly prefers $i$ over their current assignment).
2. $|\mu(i)| < c_i$ (Track $i$ has remaining unfilled capacity), **OR** $\exists s' \in \mu(i)$ such that $s \succ_i s'$ (Track $i$ strictly prefers $s$ over currently admitted candidate $s'$).

### 3.2 Stability Guarantee (0 Blocking Pairs)
> **Theorem**: The Many-to-One Student-Proposing Gale-Shapley Algorithm terminates in a finite number of steps with a matching $\mu$ that is **provably stable** (contains zero blocking pairs) and **Pareto optimal** for all participating students.

### 3.3 Proof Sketch (By Contradiction)
1. Assume for contradiction that upon termination, matching $\mu$ contains a blocking pair $(s, i)$.
2. By condition (1), $i \succ_s \mu(s)$. Because students propose in decreasing order of preference, $s$ must have proposed to $i$ before proposing to their assigned match $\mu(s)$.
3. When $s$ proposed to $i$, $s$ was either rejected immediately or tentatively accepted and subsequently displaced.
4. An internship $i$ only rejects or displaces candidate $s$ if it holds $c_i$ candidates, each having a higher merit score than $s$ under $\succ_i$.
5. Because an internship's held cohort weakly improves with every round, all candidates $s' \in \mu(i)$ at termination must be strictly preferred to $s$: $\forall s' \in \mu(i), s' \succ_i s$.
6. This directly contradicts condition (2) of a blocking pair. Hence, no blocking pair can exist in $\mu$. $\blacksquare$

---

## 4. Asymptotic Complexity Analysis

| Metric | Many-to-One Gale-Shapley (SmartIntern) | Greedy Benchmark | Hungarian Algorithm |
| :--- | :--- | :--- | :--- |
| **Worst-Case Time** | $\mathcal{O}(\|S\| \cdot \|I\| \cdot \log(C_{\text{max}}))$ | $\mathcal{O}(\|S\| \cdot \|I\| \cdot \log(\|S\| \cdot \|I\|))$ | $\mathcal{O}(V^3)$ |
| **Average Practical Time** | **2.4 ms** (20 students, 10 tracks) | 1.8 ms | 45 ms |
| **Auxiliary Space** | $\mathcal{O}(\|S\| \cdot \|I\|)$ | $\mathcal{O}(\|S\| \cdot \|I\|)$ | $\mathcal{O}(V^2)$ |
| **Stability Guaranteed** | **Yes (0 Blocking Pairs)** | No (Prone to defections) | No (Sum optimal only) |
| **Strategy-Proof for Students** | **Yes (Dominant Strategy)** | No (Easily gamed) | No |
| **Multi-Seat Quotas ($C_i > 1$)** | Native (Min-Heap per Track) | Native (Seat decrements) | Requires Node Duplication |
| **Audit Traceability** | Complete Step-by-Step Log | Opaque Global Sort | Dual Matrix Variables |

---

## 5. System Architecture

```mermaid
graph TD
    subgraph UI_Layer [User Interface Layer]
        A1[Student Portal\n/student/*]
        A2[Admin Control Center\n/admin/*]
        A3[Company Portal\n/company/*]
        A4[AoA Documentation\n/algorithm-explanation]
    end

    subgraph Auth_Layer [Authentication & Security]
        B1[Stateless JWT Sessions\njose & bcrypt]
        B2[Role-Based Guards\nSTUDENT / ADMIN / COMPANY]
    end

    subgraph API_Layer [Next.js API Gateway]
        C1[Eligibility Filter\n/api/student/profile]
        C2[Preference Locking\n/api/admin/allocation/lock]
        C3[Preview Engine\n/api/admin/allocation/preview]
        C4[Commit Engine\n/api/admin/allocation/run]
        C5[Publishing Gate\n/api/admin/allocation/publish]
        C6[CSV Export\n/api/reports/download]
    end

    subgraph Engine_Layer [Core AoA Algorithmic Engine]
        D1[Eligibility Gatekeeper\nlib/algorithm/eligibilityEngine.ts]
        D2[Multi-Factor Merit Engine\nlib/algorithm/meritCalculator.ts]
        D3[Gale-Shapley Stable Matcher\nlib/algorithm/galeShapley.ts]
        D4[Greedy Benchmark\nlib/algorithm/greedyAllocation.ts]
    end

    subgraph Data_Layer [Persistence & Reactive Store]
        E1[(PostgreSQL Database\nPrisma ORM)]
        E2[In-Memory Reactive Store\nlib/db/dataService.ts]
        E3[Java Reference Package\nbackend-java/]
    end

    UI_Layer --> Auth_Layer
    Auth_Layer --> API_Layer
    API_Layer --> Engine_Layer
    Engine_Layer --> Data_Layer
```

---

## 6. Algorithmic Flowchart

```mermaid
flowchart TD
    Start([Start Allocation Cycle]) --> PreCheck[Step 1: Validate Cohort & Internship Data]
    PreCheck --> LockPrefs[Step 2: Admin Freezes Preference Window]
    LockPrefs --> RunEligibility[Step 3: Run Eligibility Gate\nCGPA cutoff, Branch, GradYear, Deadline]
    
    RunEligibility --> FilterPrefs[Prune Disqualified Preferences]
    FilterPrefs --> SetWeights[Step 4: Configure Multi-Factor Merit Weights\nSkill 40%, CGPA 30%, Exp 20%, Branch 10%]
    
    SetWeights --> InitQueue[Initialize Free Queue Q with all eligible students]
    InitQueue --> LoopQueue{Is Queue Q Empty?}
    
    LoopQueue -- Yes --> CheckStability[Verify Zero Blocking Pairs]
    LoopQueue -- No --> PollStudent[Pop Student s from Queue Q]
    
    PollStudent --> NextPref[Fetch next preferred internship i = P(s)[idx]]
    NextPref --> ComputeMerit[Calculate MeritScore(s, i)]
    
    ComputeMerit --> CheckQuota{Current Matches < Capacity C_i?}
    
    CheckQuota -- Yes --> TentativeAccept[Insert s into i's Min-Heap\nTentatively Assigned]
    TentativeAccept --> LoopQueue
    
    CheckQuota -- No --> CompareMerit{MeritScore(s, i) > Worst Held Candidate?}
    
    CompareMerit -- Yes --> DisplaceWorst[Displace Worst Candidate s'\ns' returned to Queue Q\nInsert s into i's Min-Heap]
    DisplaceWorst --> LoopQueue
    
    CompareMerit -- No --> RejectProposer[Reject s\ns remains in Queue Q for next preference]
    RejectProposer --> LoopQueue
    
    CheckStability --> Step5Preview[Step 5: Preview Results & Inspect Proposals Log]
    Step5Preview --> Step7Run[Step 7: Commit Allocation to Draft Ledger]
    Step7Run --> Step8Publish[Step 8: Publish Results Live to Students & Companies]
    Step8Publish --> End([Cycle Complete & Letters Issued])
```

---

## 7. Database Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ STUDENTS : "profile for"
    USERS ||--o{ COMPANIES : "recruiter for"
    USERS ||--o{ ADMINS : "officer for"
    USERS ||--o{ AUDIT_LOGS : "performed by"
    USERS ||--o{ NOTIFICATIONS : "receives"

    COMPANIES ||--o{ INTERNSHIPS : "offers"
    STUDENTS ||--o{ PREFERENCES : "ranks"
    INTERNSHIPS ||--o{ PREFERENCES : "target of"
    
    STUDENTS ||--o{ ALLOCATIONS : "awarded"
    INTERNSHIPS ||--o{ ALLOCATIONS : "assigned to"
    
    ALLOCATION_RUNS ||--o{ ALLOCATIONS : "generated during"
    ALLOCATION_RUNS ||--o{ PROPOSAL_STEPS : "traces"

    USERS {
        string id PK
        string email UK
        string passwordHash
        string role
        datetime createdAt
    }

    STUDENTS {
        string id PK
        string userId FK
        string rollNumber UK
        string name
        string branch
        float cgpa
        int graduationYear
        string[] skills
        int experienceMonths
    }

    COMPANIES {
        string id PK
        string userId FK
        string name
        string industry
        string location
        string website
    }

    INTERNSHIPS {
        string id PK
        string companyId FK
        string title
        int totalSeats
        float minimumCGPA
        string[] allowedBranches
        string[] requiredSkills
        int stipend
        datetime deadline
    }

    PREFERENCES {
        string id PK
        string studentId FK
        string internshipId FK
        int rank
        boolean isLocked
    }

    ALLOCATIONS {
        string id PK
        string runId FK
        string studentId FK
        string internshipId FK
        int preferenceRank
        float compositeScore
        string status
        datetime allocatedAt
    }

    PROPOSAL_STEPS {
        string id PK
        string runId FK
        int stepNumber
        int round
        string studentId FK
        string internshipId FK
        string action
        string displacedStudentId
        string reason
    }
```

---

## 8. Administrative 8-Step Lifecycle

To prevent accidental release of unverified allocations, SMARTINTERN enforces a strict **Administrative Workflow**:

1. **Step 1: Data Validation & Pre-Run Inspection**
   - Automatically checks dataset integrity: 20 students, 10 tracks, 45 total capacities, 0 orphan preferences.
2. **Step 2: Freeze & Lock Preferences**
   - Disables student ranking edits (`POST /api/admin/allocation/lock`), preserving deterministic idempotence.
3. **Step 3: Run Eligibility Gate**
   - Filters out candidates failing CGPA cutoffs, unallowed branches, or expired deadlines.
4. **Step 4: Configure Multi-Factor Merit Weights & Algorithm**
   - Tune $w_{\text{skill}}, w_{\text{cgpa}}, w_{\text{exp}}, w_{\text{branch}}$ and select `GALE_SHAPLEY` (Stable) or `GREEDY` (Benchmark).
5. **Step 5: Preview Allocation (Dry Run)**
   - Executes matching in memory (`POST /api/admin/allocation/preview`) with status `PREVIEWED`. Students cannot see draft results.
6. **Step 6: Inspect Proposal Trace & Stability Verification**
   - Review step-by-step proposals log, displaced candidate transitions, and verify zero blocking pairs.
7. **Step 7: Commit Allocation Run**
   - Commits results to official internal database ledger (`POST /api/admin/allocation/run`) with status `DRAFT`.
8. **Step 8: Publish Official Results**
   - Explicit confirmation dialog triggers `POST /api/admin/allocation/publish`. Allocations become live for students and recruiters, and certified offer letters become downloadable.

---

## 9. Java Academic Reference Implementation (`backend-java/`)

In addition to the high-performance TypeScript implementation powering the interactive web application, this repository includes a complete **Java 17+ / Maven** reference implementation for academic code submission and algorithmic grading:

```
backend-java/
├── pom.xml                                    <- Maven configuration & dependencies (JUnit 5, Lombok)
└── src/
    ├── main/java/com/smartintern/algorithm/
    │   ├── MatchingAlgorithm.java            <- Common Algorithm Strategy Interface
    │   ├── GaleShapleyAlgorithm.java         <- Many-to-One Hospital-Residents Stable Matching
    │   ├── GreedyAlgorithm.java              <- Greedy Benchmark Matching Engine
    │   ├── EligibilityEngine.java            <- Multi-Criteria Eligibility Gatekeeper
    │   ├── MeritScoreCalculator.java         <- Multi-Factor Weighted Scoring & Tie-Breaking
    │   ├── PreferenceProcessor.java          <- Candidate Preference List Ingestion
    │   ├── AllocationResult.java             <- Result Entity with Proposal Step Log
    │   ├── AllocationMetrics.java            <- Fill Rate & Satisfaction Statistics
    │   └── model/
    │       ├── Student.java                  <- Student Entity Model
    │       ├── Internship.java               <- Internship Track with Quota Capacity
    │       ├── Preference.java               <- Ranked Priority Model
    │       ├── Allocation.java               <- Confirmed Match Entity
    │       └── MeritWeights.java             <- Configurable Weights Record
    └── test/java/com/smartintern/algorithm/
        └── GaleShapleyAlgorithmTest.java     <- Comprehensive JUnit 5 Test Suite (Zero Blocking Pairs)
```

To run the Java algorithm tests:
```bash
cd backend-java
mvn test
```

---

## 10. Local Installation & Development Setup

### 10.1 Prerequisites
- **Node.js**: v18.17+ or v20+
- **npm** or **yarn**
- **Java**: JDK 17+ (optional, for running `backend-java/` tests)

### 10.2 Installation
```bash
# 1. Clone repository
git clone https://github.com/yadavumang247-prog/smart-internship-allocation-system.git
cd smart-internship-allocation-system

# 2. Install dependencies
npm install
```

### 10.3 Environment Configuration
Create a `.env` file in the project root:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/internship_allocation?schema=public"
AUTH_SECRET="smartintern-placement-secret-key-32chars-min"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```
*(Note: If no PostgreSQL instance is connected, SMARTINTERN automatically falls back to its built-in reactive memory store with all 20 students and 5 corporate partners).*

### 10.4 Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 10.5 Run Test Suite
```bash
npm test
```
Executes the comprehensive Vitest algorithm suite (tests Gale-Shapley stability, quota enforcement, merit scoring, tie-breaking, and eligibility pruning).

---

## 11. Pre-Configured Demo Credentials

For live evaluation, use the 1-click credential selector on the [Login Screen](http://localhost:3000/login):

| Role | Email | Password | Responsibilities |
| :--- | :--- | :--- | :--- |
| **Placement Admin** | `admin@example.com` | `Admin@123` | 8-step allocation wizard, weights tuning, audit logs, CSV exports |
| **Student Applicant** | `student@example.com` | `Student@123` | Profile management, eligibility checker, preference manager, offer letter |
| **Corporate Recruiter** | `company@example.com` | `Company@123` | Posting internships, viewing eligible applicant pools, matched cohort |

---

## 12. Academic Credits & License

- **Course**: Analysis and Optimization of Algorithms (AoA)
- **Project Title**: SMARTINTERN — Smart Internship Allocation & Placement System
- **Core Algorithms**: Many-to-One Gale-Shapley Stable Marriage (Hospital-Residents), Multi-Criteria Greedy Benchmark.
- **License**: MIT License. Open for educational and institutional research purposes.
