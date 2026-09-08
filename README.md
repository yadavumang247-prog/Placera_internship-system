# InternMatch Portal

> **College Internship & Placement Management Portal**  
> *A centralized platform for managing internship opportunities, student preferences, eligibility and internship allocation.*

---

## 1. Project Overview
**InternMatch Portal** is a production-ready, collegiate internship and campus placement management web application. Built for academic placement cells, universities, and technical institutions, the portal eliminates manual spreadsheet chaos and subjective bias through an automated, deterministic multi-objective optimization allocation algorithm.

The system manages the entire lifecycle of student internships:
- Corporate partner onboarding and internship job posting with minimum CGPA cutoffs and skill requirements.
- Student discovery, eligibility checks, and ranked preference submissions (Rank 1 through 5).
- Institutional administration, real-time quota tracking, and deterministic capacity-constrained greedy allocation.
- Transparent score inspection and verifiable audit trails.

---

## 2. Institutional Branding
- **Portal Name**: InternMatch Portal
- **Subtitle**: College Internship & Placement Management Portal
- **Design Philosophy**: Real college portal look and feel—clean, institutional, distraction-free aesthetic with high contrast, crisp data tables, and sober administrative charts.

---

## 3. Key Portal Capabilities

### Public Directory & Information
- Verified corporate listings directory with search and multi-factor filters (Company, Location, Mode, Minimum CGPA, Stipend, Duration).
- Detailed internship specification modal dialogs with technical requirements, eligibility criteria, and capacity quotas.
- Public institutional placement guidelines and contact coordinates.

### Administrative Management Suite (`/admin/*`)
- **Executive Dashboard**:
  - Two summary rows with 8 core metrics: Total Students, Active Internships, Partner Companies, Available Seats, Allocated Students, Unallocated Students, Allocation Rate, and Average Merit Score.
  - Three sober collegiate charts: Allocation by Branch, Company Seat Utilization, and Preference Distribution.
  - Real-time audit log of system events and algorithmic checkpoints.
- **Candidate & Company Directory**: Full CRUD management of registered applicants and corporate recruiters.
- **Internship Management**: Creation and editing of verified internship tracks.
- **AOA Allocation Engine**:
  - Deterministic greedy matching algorithm with zero subjective bias.
  - Interactive parameter weight adjustment ($w_{\text{cgpa}}, w_{\text{skill}}, w_{\text{pref}}, w_{\text{branch}}$).
  - Traceable candidate pairs table explaining exactly why each candidate was matched or waitlisted.
- **Allocations Ledger & Reporting**: Official cohort ledger with certified CSV export for university records.
- **Portal Settings**: Configuration of academic cycle dates, cutoff baselines, and placement cell coordinates.

### Student Placement Portal (`/student/*`)
- **Academic Profile**: Verified student credentials (Roll Number, Department, Year, Cumulative CGPA, Skills).
- **Preference Ranking Manager**: Interactive 1–5 ranking interface with instant preview of priority weight score calculations.
- **Placement Status**: Real-time allocation notification banner detailing the allocated company, position, work mode, and mathematical score breakdown.

### Corporate Recruiter Portal (`/company/*`)
- Recruiter overview tracking seat quota capacity, filled positions, and remaining vacancies.
- Internship creation and modification workflows.
- Applicant pool inspector filtered against minimum academic cutoffs.
- Final matched cohort roster.

---

## 4. Technical Architecture & Stack

```
                         +-----------------------------------+
                         |         InternMatch Portal        |
                         |          (Next.js 14 App)         |
                         +-----------------------------------+
                                           |
                                           v
                         +-----------------------------------+
                         |      Authentication & AuthGuard   |
                         |   (Stateless Signed JWT via jose) |
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
                         |   - Eligibility Cutoff Gate       |
                         |   - Multi-Objective Normalizer    |
                         |   - Deterministic 4-Tuple Sort    |
                         |   - Constrained Greedy Allocation |
                         +-----------------------------------+
                                           |
                                           v
                         +-----------------------------------+
                         |      Data Access Service Layer    |
                         |   (lib/db/dataService.ts)         |
                         +-----------------------------------+
                                     /             \
                       (Connected)  /               \  (Zero-Setup Fallback)
                                   v                 v
                      +-------------------+   +--------------------+
                      |   Prisma Client   |   |   Reactive Store   |
                      |   (PostgreSQL)    |   |    (Memory/Seed)   |
                      +-------------------+   +--------------------+
```

- **Frontend Framework**: Next.js 14 (App Router), React 18, TypeScript.
- **Styling & Design System**: Tailwind CSS configured with institutional color palette:
  - Primary Navy: `#1E3A5F`
  - Secondary Slate Blue: `#2F6690`
  - Accent / Success: `#3A7D44` / `#2E7D32`
  - Base Background: `#F5F7FA`
  - Card & Table Background: `#FFFFFF`
  - Neutral Borders: `#D9E0E7`
- **Charts & Data Visualizations**: Recharts with solid, accessible collegiate color tokens.
- **Database & Persistence**: PostgreSQL with Prisma ORM 5.x + seamless in-memory fallback for instant local preview without external database prerequisites.
- **Authentication**: Stateless Signed JWT Cookie Sessions (`jose`) with bcrypt password verification.
- **Testing**: Vitest test suite validating all deterministic algorithm allocation scenarios.

---

## 5. Mathematical Allocation Formulation

The core allocation algorithm in `lib/algorithm/internshipAllocation.ts` solves a constrained bipartite matching problem with multi-criteria optimization:

$$\text{OverallScore}(s, i, r) = w_{\text{cgpa}} \cdot S_{\text{cgpa}}(s) + w_{\text{skill}} \cdot S_{\text{skill}}(s, i) + w_{\text{pref}} \cdot S_{\text{pref}}(r) + w_{\text{branch}} \cdot S_{\text{branch}}(s, i)$$

Where:
- **CGPA Score**: $S_{\text{cgpa}} = \left(\frac{\text{CGPA}}{10.0}\right) \times 100$
- **Skill Match Score**: $S_{\text{skill}} = \left(\frac{|\text{skills}(s) \cap \text{required}(i)|}{|\text{required}(i)|}\right) \times 100$
- **Preference Priority**: $S_{\text{pref}} = \max(0, 100 - (r - 1) \times 10)$ for rank $r \in \{1, 2, 3, 4, 5\}$
- **Branch Fit**: $S_{\text{branch}} = 100$ if eligible engineering discipline, $0$ otherwise.

Candidate pairs that satisfy minimum CGPA eligibility are sorted via a deterministic 4-tuple comparator:
1. `overallScore` Descending
2. `preferenceRank` Ascending (student priority)
3. `student.cgpa` Descending
4. `student.rollNumber` Ascending (deterministic tie-breaking)

Greedy assignment is then performed ensuring:
1. Each student is allocated to at most one internship.
2. No internship exceeds its approved seat quota `totalSeats`.

---

## 6. Quick Start & Local Setup

### Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm or yarn

### Installation
```bash
git clone https://github.com/your-username/smart-internship-allocation-system.git
cd "smart-internship-allocation-system"
npm install
```

### Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```
Default parameters in `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/internship_allocation?schema=public"
AUTH_SECRET="internmatch-portal-secret-key-32chars-minimum"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```
*(Note: If no PostgreSQL database is running, the portal automatically operates in memory using realistic demo data so you can test all features immediately).*

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Algorithm Test Suite
```bash
npm test
```

---

## 7. Demo Accounts & Credentials

For immediate evaluation, the following pre-configured credentials are available with a 1-click autofill on the login screen:

| Role | Email | Password | Access & Responsibilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `Admin@123` | Institutional overview, Algorithm runs, Settings, CSV exports |
| **Student** | `student@example.com` | `Student@123` | Profile, Internship directory, Preference ranking, Allocation results |
| **Company** | `company@example.com` | `Company@123` | Corporate recruiter dashboard, Job postings, Candidate rosters |

---

## 8. Deployment to Vercel

1. Push your repository to GitHub or GitLab.
2. Import the repository in [Vercel](https://vercel.com).
3. Add the `DATABASE_URL` (hosted PostgreSQL such as Neon, Supabase, or Railway) and `AUTH_SECRET` environment variables.
4. Set the build command to: `prisma generate && next build`.
5. Deploy.
