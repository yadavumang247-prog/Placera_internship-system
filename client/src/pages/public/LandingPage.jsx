import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Cpu,
  GraduationCap,
  Building2,
  Lock,
  Layers,
  BarChart3,
  Award,
} from 'lucide-react';
import { api } from '../../services/api.js';
import { OpportunityCard } from '../../components/OpportunityCard.jsx';

export const LandingPage = () => {
  const [featuredOpportunities, setFeaturedOpportunities] = useState([]);

  useEffect(() => {
    api.get('/opportunities?limit=3')
      .then((res) => {
        if (res.success) setFeaturedOpportunities(res.opportunities.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <div style={styles.page}>
      {/* 1. HERO SECTION */}
      <section style={styles.heroSection}>
        <div className="container" style={styles.heroContainer}>
          <div style={styles.heroBadge}>
            <Sparkles size={14} color="#5A7863" />
            <span>Smart Placement. Better Opportunities.</span>
          </div>

          <h1 className="display-title" style={styles.heroHeadline}>
            <span style={{ letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>PLACERA</span>
            <span style={{ color: '#5A7863' }}>Smart Placement. Better Opportunities.</span>
          </h1>

          <p style={styles.heroSubtext}>
            An algorithm-driven platform connecting students, recruiters, and placement cells through smarter opportunity matching and recruitment.
          </p>

          <div style={styles.heroCtaGroup}>
            <Link to="/opportunities" className="btn btn-primary btn-lg">
              Find Opportunities <ArrowRight size={18} />
            </Link>
            <Link to="/register/recruiter" className="btn btn-secondary btn-lg">
              Recruit Talent
            </Link>
          </div>

          {/* Key pillars banner */}
          <div style={styles.pillarsRow}>
            <div style={styles.pillarItem}>
              <CheckCircle2 size={16} color="#5A7863" />
              <span>Verified Companies</span>
            </div>
            <div style={styles.pillarItem}>
              <Lock size={16} color="#5A7863" />
              <span>Transparent Shortlisting</span>
            </div>
            <div style={styles.pillarItem}>
              <Cpu size={16} color="#5A7863" />
              <span>Smart Profile Matching</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section style={styles.statsSection}>
        <div className="container">
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <span style={styles.statNumber}>10K+</span>
              <span style={styles.statLabel}>Student Profiles</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statNumber}>500+</span>
              <span style={styles.statLabel}>Recruiting Organizations</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statNumber}>2K+</span>
              <span style={styles.statLabel}>Verified Opportunities</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statNumber}>95%</span>
              <span style={styles.statLabel}>Placement Success Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM VS SOLUTION */}
      <section style={styles.section}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 className="section-heading">Modernizing Campus Recruitment</h2>
            <p style={styles.sectionLead}>
              Say goodbye to manual resume screening and opaque hiring processes.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '24px' }}>
            <div className="card" style={{ borderLeft: '4px solid #DC2626' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <ShieldAlert size={22} color="#DC2626" />
                <h3 style={{ fontSize: '1.2rem', color: '#3B4953' }}>Conventional Placement Hassles</h3>
              </div>
              <ul style={styles.problemList}>
                <li><strong>Manual Screening Delays:</strong> Sifting through endless resumes slows down recruitment drives.</li>
                <li><strong>Opaque Statuses:</strong> Students wait weeks without clear feedback on their application status.</li>
                <li><strong>Unfair Advantage:</strong> Early applicants get seen while equally qualified candidates get missed.</li>
                <li><strong>Disconnected Tools:</strong> Tests, emails, and forms scattered across multiple platforms.</li>
              </ul>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #5A7863' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <CheckCircle2 size={22} color="#5A7863" />
                <h3 style={{ fontSize: '1.2rem', color: '#5A7863' }}>The Placera Advantage</h3>
              </div>
              <ul style={styles.problemList}>
                <li><strong>Instant Eligibility Checks:</strong> Real-time feedback on matching roles, required skills, and criteria.</li>
                <li><strong>Unbiased Evaluation:</strong> Objective shortlisting based on verified merit, skills, and performance.</li>
                <li><strong>Verified Profiles:</strong> Placement cell-authenticated academic and student credentials.</li>
                <li><strong>All-in-One Pipeline:</strong> Aptitude tests, coding assessments, and interviews managed in one place.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS EXPLAINER */}
      <section style={{ ...styles.section, backgroundColor: '#FFFFFF', borderTop: '1px solid #D6E4C6', borderBottom: '1px solid #D6E4C6' }}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#5A7863', letterSpacing: '0.08em' }}>
              Simplified Journey
            </span>
            <h2 className="section-heading" style={{ marginTop: '4px' }}>How Placera Works</h2>
            <p style={styles.sectionLead}>
              A seamless, transparent recruitment experience designed for students, recruiters, and placement cells.
            </p>
          </div>

          <div style={styles.flowRow}>
            <div style={styles.flowCard}>
              <div style={styles.stepNum}>01</div>
              <h4 style={styles.stepTitle}>Create Profile</h4>
              <p style={styles.stepText}>Build your verified profile with academic scores, technical skills, projects, and career preferences.</p>
            </div>
            <div style={styles.flowArrow}>→</div>
            <div style={styles.flowCard}>
              <div style={styles.stepNum}>02</div>
              <h4 style={styles.stepTitle}>Smart Matching</h4>
              <p style={styles.stepText}>Explore opportunities curated for your profile with clear eligibility indicators and match scores.</p>
            </div>
            <div style={styles.flowArrow}>→</div>
            <div style={styles.flowCard}>
              <div style={styles.stepNum}>03</div>
              <h4 style={styles.stepTitle}>Direct Apply</h4>
              <p style={styles.stepText}>Apply in a single click before the deadline with frozen snapshot submissions for fair review.</p>
            </div>
            <div style={styles.flowArrow}>→</div>
            <div style={styles.flowCard}>
              <div style={styles.stepNum}>04</div>
              <h4 style={styles.stepTitle}>Hiring Rounds & Offers</h4>
              <p style={styles.stepText}>Track online assessments, technical rounds, and receive real-time updates through final selection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AUDIENCE VALUE PROPOSITIONS */}
      <section style={styles.section}>
        <div className="container">
          <div className="grid grid-3">
            <div className="card">
              <GraduationCap size={32} color="#5A7863" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>For Students</h3>
              <p style={{ fontSize: '0.9rem', color: '#4A5B67', lineHeight: 1.6 }}>
                Discover opportunities matched to your specific technical skills and academic background. View transparent eligibility feedback and tracked recruitment rounds.
              </p>
            </div>

            <div className="card">
              <Building2 size={32} color="#5A7863" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>For Recruiters</h3>
              <p style={{ fontSize: '0.9rem', color: '#4A5B67', lineHeight: 1.6 }}>
                Define custom recruitment rounds, aptitude cut-offs, and vacancies. Let algorithms deliver a verified, ranked Top-N shortlist the second the application deadline closes.
              </p>
            </div>

            <div className="card">
              <BarChart3 size={32} color="#5A7863" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>For Placement Cells</h3>
              <p style={{ fontSize: '0.9rem', color: '#4A5B67', lineHeight: 1.6 }}>
                Administer university-wide placement drives with live analytics on branch-wise selection, skill demand, and automated academic document verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURED OPPORTUNITIES */}
      {featuredOpportunities.length > 0 && (
        <section style={{ ...styles.section, backgroundColor: '#FFFFFF', borderTop: '1px solid #D6E4C6' }}>
          <div className="container">
            <div style={styles.sectionHeader}>
              <h2 className="section-heading">Recent Opportunities</h2>
              <p style={styles.sectionLead}>Explore active and upcoming placement drives from verified organizations.</p>
            </div>
            <div className="grid grid-3">
              {featuredOpportunities.map((opp) => (
                <OpportunityCard key={opp._id} opportunity={opp} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Link to="/opportunities" className="btn btn-outline">
                View All Opportunities <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 7. FINAL CALL TO ACTION */}
      <section style={styles.ctaSection}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={styles.ctaHeadline}>Build a Better Placement Process.</h2>
          <p style={styles.ctaSubtext}>
            Join hundreds of forward-thinking institutions and organizations leveraging algorithmic precision for campus recruitment.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/register/student" className="btn btn-primary btn-lg">
              Get Started as Student
            </Link>
            <Link to="/register/recruiter" className="btn btn-secondary btn-lg">
              Hire Campus Talent
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#EBF4DD',
  },
  heroSection: {
    padding: '90px 0 70px',
    textAlign: 'center',
  },
  heroContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '960px',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #D6E4C6',
    borderRadius: '20px',
    fontSize: '0.84rem',
    fontWeight: '600',
    color: '#3B4953',
    marginBottom: '24px',
    boxShadow: 'var(--shadow-sm)',
  },
  heroHeadline: {
    marginBottom: '20px',
  },
  heroSubtext: {
    fontSize: '1.15rem',
    color: '#4A5B67',
    maxWidth: '740px',
    lineHeight: 1.6,
    marginBottom: '36px',
  },
  heroCtaGroup: {
    display: 'flex',
    gap: '16px',
    marginBottom: '48px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pillarsRow: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderTop: '1px solid #D6E4C6',
    paddingTop: '28px',
    width: '100%',
  },
  pillarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.86rem',
    fontWeight: '600',
    color: '#3B4953',
  },
  statsSection: {
    backgroundColor: '#5A7863',
    color: '#FFFFFF',
    padding: '50px 0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    textAlign: 'center',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statNumber: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '3.2rem',
    lineHeight: 1,
    color: '#EBF4DD',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#EBF4DD',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  section: {
    padding: '80px 0',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  sectionLead: {
    fontSize: '1.05rem',
    color: '#64748B',
    maxWidth: '600px',
    margin: '10px auto 0',
  },
  problemList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    fontSize: '0.9rem',
    color: '#4A5B67',
  },
  flowRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
  },
  flowCard: {
    flex: 1,
    minWidth: '220px',
    backgroundColor: '#F6FAEE',
    border: '1px solid #D6E4C6',
    borderRadius: '12px',
    padding: '24px',
  },
  stepNum: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '1.8rem',
    color: '#90AB8B',
    lineHeight: 1,
    marginBottom: '8px',
  },
  stepTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#26333D',
    marginBottom: '6px',
  },
  stepText: {
    fontSize: '0.84rem',
    color: '#64748B',
    lineHeight: 1.5,
  },
  flowArrow: {
    fontSize: '1.6rem',
    color: '#90AB8B',
    fontWeight: 'bold',
  },
  ctaSection: {
    backgroundColor: '#3B4953',
    color: '#FFFFFF',
    padding: '80px 0',
  },
  ctaHeadline: {
    fontFamily: "'Lora', serif",
    fontSize: '2.5rem',
    color: '#EBF4DD',
    marginBottom: '16px',
  },
  ctaSubtext: {
    fontSize: '1.1rem',
    color: '#90AB8B',
    maxWidth: '650px',
    margin: '0 auto 36px',
  },
};

export default LandingPage;
