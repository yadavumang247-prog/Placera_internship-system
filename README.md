# Smart Internship Allocation System

> **Algorithm-Based Internship Allocation Platform**  
> *College Analysis and Optimization of Algorithms (AOA) Capstone Project*

---

## 1. Project Title
**Smart Internship Allocation System (SIAS)**  
*An Algorithmic Framework for Multi-Objective, Merit-Based, and Capacity-Constrained Student-to-Internship Matching.*

---

## 2. Project Description
Collegiate placement cells and campus recruitment programs frequently struggle with fair, transparent, and conflict-free allocation of students to competitive corporate internships. Manual matching or naive first-come-first-served queues induce seat wastage, subjective favoritism, and preference dissatisfaction.

The **Smart Internship Allocation System** solves this challenge through a deterministic multi-objective optimization algorithm. The platform evaluates academic achievement (CGPA), student preference hierarchies, and technical skill overlap to generate optimal, capacity-respecting allocations with full explainability, $O(SI \log(SI))$ time complexity, and zero subjective bias.

---

## 3. Features
- **Public Algorithmic Showcase**: Landing page with interactive execution flow diagrams, complexity analysis, and live platform statistics.
- **Admin Management Suite**:
  - Executive dashboard with 8 metric counters and 5 Recharts visualizations (Company utilization, Branch distribution, Preference satisfaction, Skill match distribution, Allocated vs Unallocated).
  - Full CRUD student directory with branch and CGPA filtering.
  - Industry partner directory with real-time seat quota tracking.
  - Internship position management with customizable CGPA cutoffs and skill requirements.
  - Interactive Algorithm Simulation engine with dynamic weight sliders ($w_{\text{pref}}, w_{\text{cgpa}}, w_{\text{skill}}$) and candidate pairs decision inspector.
  - Audit ledger with certified CSV export.
  - Fairness Insights card analyzing 1st preference allocation rates and competition indices.
- **Student Placement Portal**:
  - Academic profile overview with verified CGPA and technical skill badges.
  - Internship directory with search, stipend filters, and eligibility tags.
  - Interactive priority ranking manager (Rank 1 to 5) with up/down controls and real-time score weighting previews.
  - Real-time allocation notification banner with detailed mathematical score breakdown.
- **Company Recruiter Portal**:
  - Corporate overview and seat capacity metrics.
  - Internship creation and editing workflows.
  - Candidate applicant pool inspector filtered by minimum CGPA.
  - Verified final placement rosters.
- **Security & Infrastructure**:
  - Role-based access control (`ADMIN`, `STUDENT`, `COMPANY`).
  - Stateless signed JWT session cookies (`jose`) with Next.js edge route middleware guards.
  - Bcrypt password hashing.
  - Dual-mode data access: PostgreSQL with Prisma ORM + instant zero-setup in-memory fallback.

---

## 4. Technology Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: Next.js Route Handlers, TypeScript, Server Actions.
- **Database & ORM**: PostgreSQL, Prisma ORM 5.x.
- **Authentication**: Stateless JWT Session Cookies (`jose`), `bcryptjs`.
- **Testing**: Vitest with unit test coverage for the 9 core AOA test scenarios.
- **Deployment**: Vercel & Hosted PostgreSQL (Neon, Supabase, Railway).

---

## 5. System Architecture
```
                         +-----------------------------------+
                         |       Public Landing Page         |
                         +-----------------------------------+
                                           |
                                           v
                         +-----------------------------------+
                         |      Authentication & AuthGuard   |
                         |   (JWT Session Cookie via jose)   |
                         +-----------------------------------+
                               /           |           \
                              /            |            \
                             v             v             v
             +------------------+ +-----------------+ +--------------------+
             |   Admin Portal   | |  Student Portal | |   Company Portal   |
             | (/admin/*)       | | (/student/*)    | |  (/company/*)      |
             +------------------+ +-----------------+ +--------------------+
                             \             |             /
                              \            |            /
                               v           v           v
                         +-----------------------------------+
                         |     Next.js API Route Handlers    |
                         |        (/api/admin, /api/student) |
                         +-----------------------------------+
                                           |
                                           v
                         +-----------------------------------+
                         |        Core AOA Engine            |
                         |  (lib/algorithm/allocation.ts)    |
                         |   - Eligibility Filtering         |
                         |   - Multi-Objective Scoring       |
                         |   - Deterministic Sorting         |
                         |   - Constrained Greedy Allocation |
                         +-----------------------------------+
                                           |
                                           v
                         +-----------------------------------+
                         |      Data Access Service Layer    |
                         |   (lib/db/dataService.ts)         |
                         +-----------------------------------+
                                     /             \
                       (Connected)  /               \  (Fallback)
                                   v                 v
                      +-------------------+   +--------------------+
                      |   Prisma Client   |   |   Reactive Store   |
                      |   (PostgreSQL)    |   |    (Memory/Seed)   |
                      +-------------------+   +--------------------+
```

---

## 6. Database Schema (Prisma ORM)
- **User**: `id`, `name`, `email` (unique), `passwordHash`, `role` (`ADMIN` | `STUDENT` | `COMPANY`), `createdAt`, `updatedAt`.
- **Student**: `id`, `userId` (FK), `rollNumber` (unique), `branch`, `year`, `cgpa`, `skills`, `resumeUrl`, `createdAt`, `updatedAt`.
- **Company**: `id`, `userId` (FK), `name`, `description`, `logoUrl`, `website`, `createdAt`, `updatedAt`.
- **Internship**: `id`, `companyId` (FK), `title`, `description`, `location`, `mode` (`REMOTE` | `HYBRID` | `ONSITE`), `stipend`, `duration`, `minimumCGPA`, `requiredSkills`, `totalSeats`, `availableSeats`, `applicationDeadline`, `createdAt`, `updatedAt`.
- **Preference**: `id`, `studentId` (FK), `internshipId` (FK), `rank` (1 to 5), with compound unique keys `(studentId, internshipId)` and `(studentId, rank)`.
- **Allocation**: `id`, `studentId` (FK), `internshipId` (FK), `score`, `preferenceRank`, `skillMatchScore`, `cgpaScore`, `status` (`ALLOCATED` | `ACCEPTED` | `REJECTED`), `allocatedAt`.
- **AlgorithmRun**: `id`, `totalStudents`, `totalInternships`, `totalEligiblePairs`, `totalAllocated`, `totalUnallocated`, `executionTime`, `algorithmName`, `createdAt`.

---

## 7. Algorithm Explanation
The core allocation algorithm is located in [`lib/algorithm/internshipAllocation.ts`](file:///c:/Users/Dell/Desktop/Smart%20Internship%20Allocation%20System/lib/algorithm/internshipAllocation.ts).

### Phase 1 — Eligibility Filtering
For each student $s \in S$ and each preference $p \in P(s)$ pointing to internship $i \in I$:
- Confirm student CGPA satisfies cutoff: $s.\text{cgpa} \ge i.\text{minimumCGPA}$.
- Confirm application deadline has not expired.
- Prune ineligible pairs immediately.

### Phase 2 — Multi-Objective Scoring
Calculate component scores on a uniform $0 - 100$ scale:
1. **Preference Score**: $S_{\text{pref}}(r) = \max(0, 100 - (r - 1) \times 10)$
2. **Academic CGPA Score**: $S_{\text{cgpa}}(\text{cgpa}) = \left(\frac{\text{cgpa}}{10.0}\right) \times 100$
3. **Skill Match Score**: $S_{\text{skill}} = \left(\frac{|\text{skills}(s) \cap \text{required}(i)|}{|\text{required}(i)|}\right) \times 100$
4. **Composite Overall Score**:
   $$\text{OverallScore} = w_{\text{pref}} \cdot S_{\text{pref}} + w_{\text{cgpa}} \cdot S_{\text{cgpa}} + w_{\text{skill}} \cdot S_{\text{skill}}$$
   *(Default weights: $w_{\text{pref}} = 0.40, w_{\text{cgpa}} = 0.30, w_{\text{skill}} = 0.30$)*

### Phase 3 — Deterministic Multi-Criteria Sorting
Candidate pairs are sorted by a strict 4-tuple comparator:
1. `totalScore` Descending
2. `preferenceRank` Ascending (student priority)
3. `student.cgpa` Descending
4. `student.rollNumber` Ascending (lexicographical deterministic tie-breaker)

### Phase 4 — Constrained Greedy Allocation
Iterate through the sorted candidate list:
- **Constraint 1**: Each student receives at most one internship.
- **Constraint 2**: Each internship cannot exceed `totalSeats`.
- **Constraint 3**: Only eligible pairs can be allocated.
- **Constraint 4**: Only preferred internships are matched.

---

## 8. Mathematical / Scoring Model
$$\text{Score}(s, i, r) = 0.40 \cdot \max(0, 100 - 10(r-1)) + 0.30 \cdot (10 \cdot \text{CGPA}) + 0.30 \cdot \left(\frac{\text{SkillsMatched}}{\text{SkillsRequired}} \times 100\right)$$

---

## 9. Time Complexity
Let $S$ = number of students, and $I$ = number of internships:
- **Candidate Generation**: $O(S \times I)$
- **Sorting**: $O((S \times I) \log(S \times I))$
- **Greedy Allocation Pass**: $O(S \times I)$ with $O(1)$ Hash table lookups.
- **Overall Time Complexity**: $\mathcal{O}(SI \log(SI))$

---

## 10. Space Complexity
Auxiliary storage is dominated by candidate pairs and lookup sets:
- Candidate pairs array: $O(S \times I)$
- Student & Seat HashMaps: $O(S + I)$
- Final Allocations List: $O(\min(S, \text{totalSeats})) \le O(S)$
- **Overall Space Complexity**: $\mathcal{O}(SI)$

---

## 11. Installation Instructions
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-repo/smart-internship-allocation-system.git
cd "smart-internship-allocation-system"
npm install
```

---

## 12. Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/internship_allocation?schema=public"
AUTH_SECRET="smart-internship-allocation-aoa-secret-key-32chars-min"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 13. Database Setup
Generate the Prisma client:
```bash
npm run prisma:generate
```
Push the schema to your PostgreSQL database:
```bash
npm run prisma:push
```

---

## 14. Seed Instructions
Seed the database with 1 Admin, 5 Companies, 10 Internships, and 20 diverse Students with ranked preferences:
```bash
npm run prisma:seed
```

---

## 15. Local Development
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

Run automated unit tests for the algorithm:
```bash
npm test
```

---

## 16. Vercel Deployment
The application is pre-configured for direct Vercel deployment:
1. Push your repository to GitHub or GitLab.
2. Import the repository in [Vercel Dashboard](https://vercel.com).
3. Set the Environment Variables in Vercel:
   - `DATABASE_URL`: Hosted PostgreSQL connection URI (e.g., from Neon, Supabase, or Railway).
   - `AUTH_SECRET`: A secure 32+ character random string.
4. Set Build Command: `prisma generate && next build`.
5. Deploy. Vercel will automatically build the Next.js App Router application.

---

## 17. Demo Login Credentials
For demonstration and evaluation, use the pre-seeded accounts:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `Admin@123` | Full control, Algorithm simulation, CSV export, CRUD |
| **Student** | `student@example.com` | `Student@123` | Profile, Browse roles, 1–5 Preference Ranking, Status |
| **Company** | `company@example.com` | `Company@123` | Recruiter dashboard, Post roles, View applicants |

*(A 1-click credentials autofill is also provided directly on the [`/login`](file:///c:/Users/Dell/Desktop/Smart%20Internship%20Allocation%20System/app/login/page.tsx) page).*

---

## 18. Future Enhancements
- Multi-round deferred acceptance allocation with student acceptance/rejection response windows.
- Resume vector embedding matching using cosine similarity over LLM embeddings.
- Automated email and SMS notification webhooks upon allocation publication.
- College department quota reserving (affirmative action and diversity constraints).
