# Placera

### Smart Internship & Placement Allocation Platform
**Tagline:** *Smart Placement. Better Opportunities.*

An algorithm-driven platform connecting students, recruiters, and placement cells through smarter opportunity matching and recruitment.

---

## 📖 Project Overview

**Placera** is a full-stack campus recruitment and placement platform. It provides students with transparent opportunity matching, gives recruiters efficient candidate evaluation tools, and enables university placement cells to manage institution-wide hiring drives seamlessly.

### Core Value Pillars
- **Student-Centric Discovery**: Explore verified opportunities tailored to your technical skills and academic background.
- **Fairness & Objectivity**: Pre-deadline privacy locks ensure unbiased candidate evaluation.
- **Automated Workflows**: Complete hiring lifecycle including MCQs, coding challenges, interviews, and offer tracking.

---

## ✨ Main Features

1. **Smart Matching & Eligibility**: Deterministic evaluation of CGPA, branch, graduation batch, and mandatory skills.
2. **Multi-Factor Candidate Scoring**: Normalized composite score based on skills (40%), academics (20%), projects (15%), experience (15%), and role preferences (10%).
3. **Deterministic 5-Tier Tie-Breaking**: Resolves identical scores using skill ratio, experience depth, CGPA, project count, and submission timestamp (FIFO).
4. **Binary Min-Heap Top-N Selection**: Selects top $N$ vacancies in $O(M \log N)$ time while retaining the full candidate pool.
5. **Fairness Deadline Freeze**: Recruiter cannot access individual candidate identities until the application deadline expires.
6. **Immutable Application Snapshots**: Freezes student profiles at submission time to preserve historical evaluation integrity.
7. **Sequential Recruitment Pipeline**: Finite state machine managing test rounds, interviews, and offer releases.

---

## 💻 Technology Stack

- **Frontend**: React 18 SPA, Vite, JavaScript (ESM), React Router v6, Lucide Icons, Vanilla CSS Design System (`#EBF4DD`, `#90AB8B`, `#5A7863`, `#3B4953`).
- **Backend**: Node.js, Express.js REST API layer, JWT Authentication, Multer file upload handling.
- **Database**: MongoDB & Mongoose ODM (with automatic in-memory fallback).
- **Testing**: Built-in test runner for allocation algorithms (`server/tests/algorithm.test.js`).

---

## 🏗️ Architecture

Placera follows a decoupled, three-tier architecture:
- **Presentation Layer**: Responsive React SPA communicating over REST APIs.
- **Service & Algorithm Layer**: Modular algorithmic engines (eligibility, scoring, ranking, top-N heap, graph matching) and lifecycle state machines.
- **Data Persistence Layer**: MongoDB collections storing verified students, recruiters, job postings, rounds, and frozen submission snapshots.

---

## 📁 Folder Structure

```
placera/
├── client/                     # React Vite Frontend SPA
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Footer, Modals, Cards)
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── layouts/            # MainLayout, DashboardLayout
│   │   ├── pages/
│   │   │   ├── admin/          # Admin Dashboard, Verifications, Drives, Analytics
│   │   │   ├── auth/           # Login, Student Registration, Recruiter Registration
│   │   │   ├── public/         # Landing, Opportunities, How It Works, About, Contact
│   │   │   ├── recruiter/      # Recruiter Dashboard, Opportunity Management, Pipeline
│   │   │   └── student/        # Student Dashboard, Profile, Applications, Assessments
│   │   ├── services/           # Authenticated API Client
│   │   └── styles/             # Global Design System & Tokens
│   └── vite.config.js
├── server/                     # Node.js & Express REST Backend
│   ├── algorithms/             # Eligibility, Scoring, Ranking, Top-N Heap, Graph
│   ├── config/                 # Database connection & in-memory fallback
│   ├── controllers/            # Auth, Student, Recruiter, Admin controllers
│   ├── middleware/             # Authentication, Roles, File Uploads, Error Handling
│   ├── models/                 # Mongoose Schemas & Application Snapshots
│   ├── routes/                 # Express API Route Handlers
│   ├── services/               # Recruitment State Machine & Code Runner
│   ├── tests/                  # Algorithm Verification Test Suite
│   └── utils/                  # Database Seed Scripts
└── docs/                       # Detailed Documentation
    ├── algorithms/             # Algorithmic Formulas, Pseudocode, Complexity
    └── architecture/           # System Diagrams & Entity Specifications
```

---

## ⚙️ Environment Variables

Configure the following variables in `server/.env` (or copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/placera
JWT_SECRET=super-secret-key-change-in-production-2025
CLIENT_URL=http://localhost:5173
```

> **Note**: If `MONGO_URI` is omitted or local MongoDB is unavailable, Placera automatically starts an in-memory MongoDB replica for effortless local execution.

---

## 🚀 Installation & Running the Application

### 1. Prerequisites
- **Node.js**: v18 or higher
- **npm**: v8 or higher

### 2. Install Dependencies
```bash
npm install
npm run install:all
```

### 3. Database Setup & Seeding
Populate the database with demo students, recruiters, postings, and assessments:
```bash
npm run seed
```

### 4. Start Development Servers
Runs both the backend API and frontend Vite development server:
```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 🔑 Demo Accounts

The seed script initializes accounts with default password `password123`:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Student** | `student@example.com` | `password123` | Student Dashboard, Profile, Applications, Assessments, Interviews |
| **Recruiter** | `recruiter@example.com` | `password123` | Recruiter Dashboard, Create Opportunities, Shortlist Pipeline |
| **Placement Cell Admin** | `admin@example.com` | `password123` | Placera Admin Dashboard, Student/Recruiter Audits, System Analytics |

---

## 🧠 Algorithm Overview

Placera includes modular algorithmic engines located in `server/algorithms/`:

1. **Eligibility Filter (`eligibility.js`)**: Deterministic check across CGPA, branch, degree, backlogs, and required skills in $O(1)$ practical time.
2. **Weighted Scoring (`scoring.js`)**: Computes multi-factor compatibility score normalized to $[0, 100]$.
3. **Deterministic Ranking (`ranking.js`)**: 5-tier tie-breaking hierarchy eliminating sorting ambiguity.
4. **Top-N Min-Heap (`topN.js`)**: Binary Min-Heap selecting the top $N$ candidates in $O(M \log N)$ time and $O(N)$ space.
5. **Opportunity Recommendations (`recommendation.js`)**: Personalized opportunity ranking for student profiles.

Run the test suite to verify algorithm correctness:
```bash
npm test
```

---

## 📜 License
MIT License. Built for university placement operations and modern recruitment excellence.
