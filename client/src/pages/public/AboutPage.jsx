import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Building2, 
  School, 
  ShieldCheck, 
  Target, 
  Code, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Users,
  Award
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div style={{ backgroundColor: '#EBF4DD', minHeight: 'calc(100vh - 70px)', padding: '60px 0 80px 0' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        
        {/* Header / Hero */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'rgba(90, 120, 99, 0.12)', 
            border: '1px solid #90AB8B', 
            color: '#5A7863', 
            padding: '6px 14px', 
            borderRadius: '20px', 
            fontSize: '0.8rem', 
            fontWeight: '700', 
            letterSpacing: '0.05em', 
            textTransform: 'uppercase',
            marginBottom: '16px' 
          }}>
            <Sparkles size={16} /> The Verified Campus Placement Ecosystem
          </div>
          <h1 className="section-heading" style={{ fontSize: '2.8rem', color: '#26333D', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>
            Empowering Campus Recruitment with <span style={{ color: '#5A7863' }}>Placera</span>
          </h1>
          <p style={{ color: '#4A5B67', fontSize: '1.15rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.7 }}>
            Placera is an end-to-end recruitment and placement management platform connecting ambitious students, top enterprise recruiters, and college placement cells under one unified, transparent ecosystem.
          </p>
        </div>

        {/* Stakeholder Grid: What Placera delivers for you */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '24px', marginBottom: '56px' }}>
          
          {/* Card 1: For Students */}
          <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(90, 120, 99, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5A7863' }}>
              <GraduationCap size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#26333D', margin: '0 0 6px 0' }}>For Students</h3>
              <p style={{ fontSize: '0.9rem', color: '#5A7863', fontWeight: 600, margin: 0 }}>Accelerate Your Professional Career</p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#4A5B67' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#5A7863" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Verified Profiles:</strong> Showcase your validated degree, academic marks, and technical skills with institutional proofs.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#5A7863" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Equal Opportunity:</strong> Transparent application rounds where your skills and real achievements determine your selection.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#5A7863" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Interactive Coding Arena:</strong> Practice and undergo AI-proctored technical coding assessments with live test execution.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#5A7863" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>End-to-End Tracking:</strong> Real-time alerts for application shortlisting, interview rounds, and offer letters.</span>
              </li>
            </ul>
            <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
              <Link to="/register/student" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                Register as Student <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 2: For Corporate Recruiters */}
          <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(90, 120, 99, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5A7863' }}>
              <Building2 size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#26333D', margin: '0 0 6px 0' }}>For Recruiters</h3>
              <p style={{ fontSize: '0.9rem', color: '#5A7863', fontWeight: 600, margin: 0 }}>Hire Pre-Screened Top Talent</p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#4A5B67' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#5A7863" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Verified College Talent:</strong> Connect directly with genuine students from accredited universities without resume fraud.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#5A7863" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Automated Criteria Filtering:</strong> Set cutoffs for CGPA, branches, and required skill sets to automatically filter applicants.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#5A7863" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Online Screening & AI Proctoring:</strong> Conduct automated technical MCQs and coding challenges with webcam and mic integrity.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#5A7863" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Zero-Paperwork Hiring:</strong> Manage interview rounds, candidate evaluations, and roll out digital offer letters seamlessly.</span>
              </li>
            </ul>
            <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
              <Link to="/register/recruiter" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                Hire with Placera <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 3: For College Placement Cells */}
          <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(90, 120, 99, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5A7863' }}>
              <School size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#26333D', margin: '0 0 6px 0' }}>For Placement Cells</h3>
              <p style={{ fontSize: '0.9rem', color: '#5A7863', fontWeight: 600, margin: 0 }}>Automate College Placement Operations</p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#4A5B67' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#5A7863" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Institutional Onboarding:</strong> Dedicated College Admin portal for Training & Placement Officers (TPOs) and Dean Offices.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#5A7863" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Campus Drive Orchestration:</strong> Post exclusive campus drives, schedule on-campus interview slots, and coordinate recruiters.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#5A7863" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Institutional Verification:</strong> Verify enrolled students' academic records, marksheets, and prevent eligibility disputes.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#5A7863" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Real-time Analytics:</strong> Generate automated placement statistics, department-wise placement rates, and salary packages.</span>
              </li>
            </ul>
            <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
              <Link to="/register/college" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                Register Your College <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>

        {/* Section: Core Platform Values */}
        <div className="card" style={{ padding: '40px', marginBottom: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#26333D', margin: '0 0 8px 0' }}>
              Why Institutions & Enterprises Trust Placera
            </h2>
            <p style={{ color: '#4A5B67', fontSize: '0.95rem', margin: 0 }}>
              Built with uncompromising standards for fairness, security, and transparent execution.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            
            <div style={featureBoxStyle}>
              <div style={iconBadgeStyle}>
                <ShieldCheck size={22} color="#5A7863" />
              </div>
              <h4 style={featureHeadingStyle}>Strict Verification Standards</h4>
              <p style={featureTextStyle}>
                All participants—students, employers, and college placement cells—are verified using government and institutional credentials (including SheerID and official proofs) to maintain an uncompromised environment.
              </p>
            </div>

            <div style={featureBoxStyle}>
              <div style={iconBadgeStyle}>
                <Target size={22} color="#5A7863" />
              </div>
              <h4 style={featureHeadingStyle}>Zero Early-Applicant Bias</h4>
              <p style={featureTextStyle}>
                Placera locks applications until the deadline concludes. Every qualified applicant is evaluated simultaneously on genuine merit, eliminating arbitrary early-bird preferences and ensuring fair competition.
              </p>
            </div>

            <div style={featureBoxStyle}>
              <div style={iconBadgeStyle}>
                <Code size={22} color="#5A7863" />
              </div>
              <h4 style={featureHeadingStyle}>AI-Proctored Assessments</h4>
              <p style={featureTextStyle}>
                Integrates sandboxed code execution, live webcam/microphone integrity verification, and tab-switch monitoring so candidates can demonstrate authentic problem-solving skills remotely.
              </p>
            </div>

            <div style={featureBoxStyle}>
              <div style={iconBadgeStyle}>
                <Award size={22} color="#5A7863" />
              </div>
              <h4 style={featureHeadingStyle}>Complete Offer Governance</h4>
              <p style={featureTextStyle}>
                Prevents multiple unaccepted offer hoarding and provides clear, auditable trail from internship application to full-time placement conversion.
              </p>
            </div>

          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div 
          className="card" 
          style={{ 
            background: 'linear-gradient(135deg, #26333D 0%, #1A2228 100%)', 
            color: '#EBF4DD', 
            padding: '48px 32px', 
            textAlign: 'center',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #5A7863'
          }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
            Transform Your Campus Recruitment Experience
          </h2>
          <p style={{ color: '#D6E4C6', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
            Join hundreds of forward-thinking colleges, high-growth tech companies, and ambitious graduates on Placera today.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link 
              to="/opportunities" 
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem', fontWeight: 600 }}
            >
              Browse Active Opportunities
            </Link>
            <Link 
              to="/login" 
              className="btn btn-secondary"
              style={{ 
                padding: '0.75rem 1.6rem', 
                fontSize: '0.95rem', 
                fontWeight: 600,
                backgroundColor: 'transparent',
                color: '#EBF4DD',
                borderColor: '#90AB8B'
              }}
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

const featureBoxStyle = {
  backgroundColor: '#F6FAEE',
  border: '1px solid #D6E4C6',
  borderRadius: '12px',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const iconBadgeStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  backgroundColor: 'rgba(90, 120, 99, 0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '4px'
};

const featureHeadingStyle = {
  fontSize: '1.05rem',
  fontWeight: 700,
  color: '#26333D',
  margin: 0
};

const featureTextStyle = {
  fontSize: '0.88rem',
  color: '#4A5B67',
  lineHeight: 1.6,
  margin: 0
};

export default AboutPage;
