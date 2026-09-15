import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Lock, Cpu, Trophy, UserCheck, CalendarCheck, FileSpreadsheet } from 'lucide-react';

export const HowItWorksPage = () => {
  const steps = [
    {
      step: '01',
      title: 'Profile Registration & Academic Verification',
      role: 'Student & Placement Cell',
      desc: 'Students register with detailed academic statistics (CGPA, degree, branch, active backlogs), verified programming languages, tools, projects, and work experience. College placement cells verify document authenticity.',
      icon: UserCheck,
    },
    {
      step: '02',
      title: 'Opportunity Creation & Dynamic Eligibility Criteria',
      role: 'Recruiters',
      desc: 'Recruiters specify role details, stipend/CTC, minimum CGPA, allowed departments, mandatory skills, vacancy quota N, and customize recruitment rounds (Aptitude, DSA coding, Technical, HR).',
      icon: FileSpreadsheet,
    },
    {
      step: '03',
      title: 'Compatibility Matching & Student Applications',
      role: 'Algorithm Engine & Students',
      desc: 'Our recommendation algorithm computes multi-factor match percentages. Students explore roles, verify deterministic eligibility requirements, and submit immutable application snapshots.',
      icon: Cpu,
    },
    {
      step: '04',
      title: 'Application Deadline Freeze & Privacy Lockout',
      role: 'System Fairness Rule',
      desc: 'Before the deadline, recruiters see only applicant volume count. Individual student names, resumes, and identities remain strictly locked to prevent premature selection bias. Upon deadline expiry, applications freeze permanently.',
      icon: Lock,
    },
    {
      step: '05',
      title: 'Top-N Min-Heap Selection & Candidate Ranking',
      role: 'Algorithm Engine',
      desc: 'The algorithm evaluates all submitted snapshots, executes deterministic 5-tier tie-breaking, and employs a Binary Min-Heap to isolate the top-N shortlist in O(M log N) time while keeping the extended pool accessible.',
      icon: Trophy,
    },
    {
      step: '06',
      title: 'Sequential Recruitment Rounds & Offer Allocation',
      role: 'Recruiters & Students',
      desc: 'Shortlisted candidates advance through timed MCQ aptitude tests, sandboxed coding challenges, and video interviews. The recruitment state machine tracks every transition until final placement offer release.',
      icon: CalendarCheck,
    },
  ];

  return (
    <div style={{ backgroundColor: '#EBF4DD', minHeight: 'calc(100vh - 70px)', padding: '60px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px' }}>
          <h1 className="section-heading" style={{ fontSize: '2.4rem' }}>How Placera Works</h1>
          <p style={{ color: '#4A5B67', fontSize: '1.05rem', marginTop: '10px' }}>
            A streamlined, transparent campus placement and internship platform designed to connect ambitious students with top opportunities.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="card" style={styles.stepCard}>
                <div style={styles.stepHeader}>
                  <div style={styles.badgeCol}>
                    <span style={styles.stepNumber}>{s.step}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.25rem', color: '#3B4953' }}>{s.title}</h3>
                      <span className="badge badge-sage">{s.role}</span>
                    </div>
                    <p style={{ color: '#4A5B67', fontSize: '0.92rem', marginTop: '6px', lineHeight: 1.6 }}>
                      {s.desc}
                    </p>
                  </div>
                  <div style={styles.iconCircle}>
                    <Icon size={24} color="#5A7863" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Link to="/opportunities" className="btn btn-primary btn-lg">
            Explore Opportunities Now
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  stepCard: {
    padding: '28px',
  },
  stepHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '24px',
  },
  badgeCol: {
    width: '48px',
  },
  stepNumber: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '2.5rem',
    color: '#90AB8B',
    lineHeight: 1,
  },
  iconCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#F6FAEE',
    border: '1px solid #D6E4C6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
};

export default HowItWorksPage;
