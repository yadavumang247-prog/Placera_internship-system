-- ==========================================================
-- SMARTINTERN - DATABASE SCHEMA (PostgreSQL DDL)
-- Smart Internship Allocation & Placement System
-- ==========================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS allocation_runs CASCADE;
DROP TABLE IF EXISTS allocations CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS preferences CASCADE;
DROP TABLE IF EXISTS internship_skills CASCADE;
DROP TABLE IF EXISTS student_skills CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS internships CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('ADMIN', 'STUDENT', 'COMPANY')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 2. STUDENTS TABLE
CREATE TABLE students (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    roll_number VARCHAR(64) NOT NULL UNIQUE,
    branch VARCHAR(128) NOT NULL,
    year INT NOT NULL DEFAULT 3 CHECK (year BETWEEN 1 AND 5),
    graduation_year INT NOT NULL DEFAULT 2026,
    cgpa NUMERIC(4, 2) NOT NULL CHECK (cgpa >= 0.0 AND cgpa <= 10.0),
    experience_months INT NOT NULL DEFAULT 0,
    experience_summary TEXT,
    skills TEXT NOT NULL, -- Comma-separated or JSON string for flexibility
    resume_url VARCHAR(512),
    preferences_locked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_roll ON students(roll_number);
CREATE INDEX idx_students_branch ON students(branch);
CREATE INDEX idx_students_cgpa ON students(cgpa);

-- 3. COMPANIES TABLE
CREATE TABLE companies (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    logo_url VARCHAR(512),
    website VARCHAR(255),
    industry VARCHAR(128),
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_companies_name ON companies(name);

-- 4. INTERNSHIPS TABLE
CREATE TABLE internships (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    mode VARCHAR(32) NOT NULL DEFAULT 'REMOTE' CHECK (mode IN ('REMOTE', 'HYBRID', 'ONSITE')),
    stipend INT NOT NULL DEFAULT 0,
    duration VARCHAR(64) NOT NULL DEFAULT '3 Months',
    minimum_cgpa NUMERIC(4, 2) NOT NULL DEFAULT 6.00 CHECK (minimum_cgpa >= 0.0 AND minimum_cgpa <= 10.0),
    allowed_branches TEXT NOT NULL DEFAULT 'All Branches', -- JSON or comma-separated
    required_skills TEXT NOT NULL, -- JSON or comma-separated
    total_seats INT NOT NULL DEFAULT 1 CHECK (total_seats > 0),
    available_seats INT NOT NULL DEFAULT 1 CHECK (available_seats >= 0),
    application_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CLOSED', 'ARCHIVED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_internships_company ON internships(company_id);
CREATE INDEX idx_internships_cgpa ON internships(minimum_cgpa);
CREATE INDEX idx_internships_status ON internships(status);

-- 5. SKILLS TABLE
CREATE TABLE skills (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL UNIQUE,
    category VARCHAR(64) DEFAULT 'TECHNICAL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_skills_name ON skills(name);

-- 6. STUDENT_SKILLS LINK TABLE
CREATE TABLE student_skills (
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    skill_id VARCHAR(64) NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(32) DEFAULT 'INTERMEDIATE',
    PRIMARY KEY (student_id, skill_id)
);

-- 7. INTERNSHIP_SKILLS LINK TABLE
CREATE TABLE internship_skills (
    internship_id VARCHAR(64) NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
    skill_id VARCHAR(64) NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (internship_id, skill_id)
);

-- 8. PREFERENCES TABLE (Student Ranked Order 1..N)
CREATE TABLE preferences (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    internship_id VARCHAR(64) NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
    rank INT NOT NULL CHECK (rank >= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_internship UNIQUE (student_id, internship_id),
    CONSTRAINT uq_student_rank UNIQUE (student_id, rank)
);

CREATE INDEX idx_preferences_student ON preferences(student_id);
CREATE INDEX idx_preferences_internship ON preferences(internship_id);
CREATE INDEX idx_preferences_rank ON preferences(rank);

-- 9. APPLICATIONS TABLE
CREATE TABLE applications (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    internship_id VARCHAR(64) NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'SHORTLISTED', 'REJECTED', 'ALLOCATED')),
    merit_score NUMERIC(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_app_student_internship UNIQUE (student_id, internship_id)
);

-- 10. ALLOCATIONS TABLE (Confirmed & Algorithmically Generated Matches)
CREATE TABLE allocations (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    internship_id VARCHAR(64) NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
    score NUMERIC(5, 2) NOT NULL,
    preference_rank INT NOT NULL,
    skill_match_score NUMERIC(5, 2) NOT NULL,
    cgpa_score NUMERIC(5, 2) NOT NULL,
    experience_score NUMERIC(5, 2) DEFAULT 0,
    branch_score NUMERIC(5, 2) DEFAULT 0,
    rank_within_quota INT NOT NULL DEFAULT 1,
    status VARCHAR(32) NOT NULL DEFAULT 'ALLOCATED' CHECK (status IN ('ALLOCATED', 'ACCEPTED', 'REJECTED')),
    allocated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_allocation_student UNIQUE (student_id)
);

CREATE INDEX idx_allocations_student ON allocations(student_id);
CREATE INDEX idx_allocations_internship ON allocations(internship_id);

-- 11. ALLOCATION_RUNS TABLE (Audit History for Every Algorithm Execution)
CREATE TABLE allocation_runs (
    id VARCHAR(64) PRIMARY KEY,
    algorithm_name VARCHAR(255) NOT NULL,
    algorithm_version VARCHAR(64) NOT NULL DEFAULT '2.4-stable',
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PREVIEWED', 'PUBLISHED')),
    total_students INT NOT NULL,
    eligible_students INT NOT NULL,
    total_internships INT NOT NULL,
    total_seats INT NOT NULL,
    total_proposals INT NOT NULL,
    total_allocated INT NOT NULL,
    total_unallocated INT NOT NULL,
    allocation_rate NUMERIC(5, 2) NOT NULL,
    seat_utilization NUMERIC(5, 2) NOT NULL,
    average_score NUMERIC(5, 2) NOT NULL,
    average_rank NUMERIC(4, 2) NOT NULL,
    execution_time_ms NUMERIC(8, 2) NOT NULL,
    skill_weight NUMERIC(3, 2) NOT NULL DEFAULT 0.40,
    cgpa_weight NUMERIC(3, 2) NOT NULL DEFAULT 0.30,
    experience_weight NUMERIC(3, 2) NOT NULL DEFAULT 0.20,
    branch_weight NUMERIC(3, 2) NOT NULL DEFAULT 0.10,
    stability_verified BOOLEAN NOT NULL DEFAULT TRUE,
    blocking_pairs_count INT NOT NULL DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    executed_by VARCHAR(255) NOT NULL DEFAULT 'Placement Admin'
);

-- 12. AUDIT_LOGS TABLE
CREATE TABLE audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    action VARCHAR(128) NOT NULL,
    performed_by VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_timestamp ON audit_logs(created_at);

-- 13. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(32) NOT NULL DEFAULT 'INFO' CHECK (type IN ('INFO', 'SUCCESS', 'WARNING', 'ALLOCATION')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);

-- 14. DOCUMENTS TABLE (Offer Slips, Transcripts, Placement Letters)
CREATE TABLE documents (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    document_type VARCHAR(64) NOT NULL CHECK (document_type IN ('OFFER_SLIP', 'ALLOCATION_LETTER', 'NOC', 'RESUME')),
    title VARCHAR(255) NOT NULL,
    file_url VARCHAR(512) NOT NULL,
    verification_hash VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_student ON documents(student_id);
