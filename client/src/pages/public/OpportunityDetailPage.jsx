import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  ArrowLeft,
  Sparkles,
  FileText,
  Clock,
} from 'lucide-react';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { ScoreBreakdown } from '../../components/ScoreBreakdown.jsx';
import { LoadingState } from '../../components/LoadingState.jsx';
import { Modal } from '../../components/Modal.jsx';

export const OpportunityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isStudent } = useAuth();
  const { showSuccess, showError } = useToast();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  // Eligibility / Ineligible Modal State
  const [ineligibleModalOpen, setIneligibleModalOpen] = useState(false);
  const [ineligibleReasons, setIneligibleReasons] = useState([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const fetchOpportunity = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/opportunities/${id}`);
      if (res.success) {
        setOpportunity(res.opportunity);
      }
    } catch (err) {
      showError(err.message || 'Failed to fetch opportunity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunity();
  }, [id]);

  if (loading) {
    return <LoadingState message="Loading opportunity specification..." />;
  }

  if (!opportunity) {
    return (
      <div className="container" style={{ padding: '60px 16px', textAlign: 'center' }}>
        <h2>Opportunity Not Found</h2>
        <Link to="/opportunities" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Opportunities
        </Link>
      </div>
    );
  }

  const org = opportunity.organization || {};
  const isDeadlinePassed = new Date() > new Date(opportunity.applicationDeadline);
  const deadlineDateStr = new Date(opportunity.applicationDeadline).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const studentMatch = opportunity.studentMatch;
  const existingApp = opportunity.existingApplication;

  const handleApplyClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isStudent) {
      showError('Only registered students can apply to opportunities.');
      return;
    }
    if (studentMatch && !studentMatch.isEligible) {
      setIneligibleReasons(studentMatch.eligibilityReasons || []);
      setIneligibleModalOpen(true);
      return;
    }
    setConfirmModalOpen(true);
  };

  const handleConfirmSubmitApplication = async () => {
    try {
      setApplying(true);
      const res = await api.post('/applications', { opportunityId: opportunity._id });
      if (res.success) {
        showSuccess('Application successfully submitted with an immutable profile snapshot!');
        setConfirmModalOpen(false);
        fetchOpportunity();
      }
    } catch (err) {
      if (err.data && err.data.reasons) {
        setConfirmModalOpen(false);
        setIneligibleReasons(err.data.reasons);
        setIneligibleModalOpen(true);
      } else {
        showError(err.message || 'Failed to submit application.');
      }
    } finally {
      setApplying(false);
    }
  };

  return (
    <div style={styles.page}>
      <div className="container" style={{ padding: '40px 16px' }}>
        {/* Back Link */}
        <Link to="/opportunities" style={styles.backLink}>
          <ArrowLeft size={16} /> Back to Opportunities
        </Link>

        {/* Top Header Card */}
        <div className="card" style={styles.headerCard}>
          <div style={styles.headerTop}>
            <div style={styles.orgRow}>
              <div style={styles.orgLogo}>
                <Building2 size={28} color="#5A7863" />
              </div>
              <div>
                <span className="badge badge-sage" style={{ marginBottom: '6px' }}>
                  {opportunity.type?.replace('_', ' ')}
                </span>
                <h1 style={styles.title}>{opportunity.title}</h1>
                <p style={styles.orgMeta}>
                  <strong>{org.name}</strong> • {org.industry} • {opportunity.location} ({opportunity.workMode})
                </p>
              </div>
            </div>

            <div style={styles.actionBox}>
              {existingApp ? (
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-success" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                    <CheckCircle2 size={16} /> Applied on {new Date(existingApp.createdAt).toLocaleDateString()}
                  </span>
                  <div style={{ marginTop: '8px' }}>
                    <Link to={`/student/applications/${existingApp._id}`} className="btn btn-outline btn-sm">
                      Track Application
                    </Link>
                  </div>
                </div>
              ) : isDeadlinePassed ? (
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-danger" style={{ fontSize: '0.88rem', padding: '6px 12px' }}>
                    <Lock size={14} /> Application Window Closed
                  </span>
                  <p style={{ fontSize: '0.78rem', color: '#718290', marginTop: '4px' }}>
                    Applications are frozen for algorithmic candidate ranking.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleApplyClick}
                  className="btn btn-primary btn-lg"
                  disabled={applying}
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div style={styles.metricsBar}>
            <div style={styles.metricItem}>
              <IndianRupee size={16} color="#5A7863" />
              <div>
                <span style={styles.metricLabel}>Compensation</span>
                <strong style={styles.metricValue}>{opportunity.stipendOrSalary}</strong>
              </div>
            </div>
            <div style={styles.metricItem}>
              <Users size={16} color="#5A7863" />
              <div>
                <span style={styles.metricLabel}>Top-N Shortlist Capacity</span>
                <strong style={styles.metricValue}>{opportunity.vacancies} Candidates</strong>
              </div>
            </div>
            <div style={styles.metricItem}>
              <Calendar size={16} color="#5A7863" />
              <div>
                <span style={styles.metricLabel}>Application Deadline</span>
                <strong style={{ ...styles.metricValue, color: isDeadlinePassed ? '#DC2626' : '#26333D' }}>
                  {deadlineDateStr}
                </strong>
              </div>
            </div>
            <div style={styles.metricItem}>
              <Lock size={16} color="#5A7863" />
              <div>
                <span style={styles.metricLabel}>Fairness Rule</span>
                <strong style={styles.metricValue}>Profiles Locked Until Deadline</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-3" style={{ marginTop: '24px', alignItems: 'start' }}>
          {/* Main Info (2 Columns) */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Description Card */}
            <div className="card">
              <h2 className="subheading" style={{ marginBottom: '16px' }}>Role Description & Responsibilities</h2>
              <div style={styles.descriptionText}>
                {opportunity.description}
              </div>
            </div>

            {/* Mandatory Eligibility Criteria */}
            <div className="card">
              <h2 className="subheading" style={{ marginBottom: '16px' }}>Mandatory Eligibility Criteria</h2>
              <div style={styles.criteriaGrid}>
                <div style={styles.criteriaCard}>
                  <span style={styles.criteriaLabel}>Minimum Academic CGPA</span>
                  <span style={styles.criteriaValue}>≥ {opportunity.minCgpa?.toFixed(2)} CGPA</span>
                </div>
                <div style={styles.criteriaCard}>
                  <span style={styles.criteriaLabel}>Allowed Batches / Year</span>
                  <span style={styles.criteriaValue}>
                    {opportunity.graduationYears?.length > 0 ? opportunity.graduationYears.join(', ') : 'All Batches'}
                  </span>
                </div>
                <div style={styles.criteriaCard}>
                  <span style={styles.criteriaLabel}>Allowed Branches</span>
                  <span style={styles.criteriaValue}>
                    {opportunity.allowedBranches?.length > 0 ? opportunity.allowedBranches.join(', ') : 'All Branches'}
                  </span>
                </div>
                <div style={styles.criteriaCard}>
                  <span style={styles.criteriaLabel}>Max Active Backlogs</span>
                  <span style={styles.criteriaValue}>≤ {opportunity.maxBacklogs}</span>
                </div>
              </div>

              {/* Skills breakdown */}
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ fontSize: '0.92rem', marginBottom: '8px', color: '#3B4953' }}>Required Skills (Mandatory):</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(opportunity.requiredSkills || []).map((s) => (
                    <span key={s} className="badge badge-sage">{s}</span>
                  ))}
                </div>
              </div>

              {opportunity.preferredSkills?.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <h4 style={{ fontSize: '0.92rem', marginBottom: '8px', color: '#3B4953' }}>Preferred Skills (Bonus Weight):</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {opportunity.preferredSkills.map((s) => (
                      <span key={s} className="badge badge-neutral">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Configured Recruitment Rounds */}
            <div className="card">
              <h2 className="subheading" style={{ marginBottom: '16px' }}>Recruitment Pipeline & Selection Rounds</h2>
              <p style={{ fontSize: '0.86rem', color: '#718290', marginBottom: '16px' }}>
                Candidates progress through these rounds sequentially upon clearing cut-offs.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(opportunity.rounds || []).map((r, i) => (
                  <div key={r._id} style={styles.roundItem}>
                    <div style={styles.roundNum}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '0.95rem', color: '#3B4953' }}>{r.name}</strong>
                        <span className="badge badge-sage">{r.type}</span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#718290', marginTop: '2px' }}>
                        Cut-off: {r.passingScore}% • Time Limit: {r.timeLimitMinutes} mins
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Match Breakdown & Organization (1 Column) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Algorithmic Compatibility Card */}
            {studentMatch && (
              <ScoreBreakdown
                score={studentMatch.score}
                breakdown={{
                  skills: studentMatch.skillMatch,
                  academics: studentMatch.academicMatch,
                  projects: studentMatch.projectMatch,
                  experience: studentMatch.experienceMatch,
                  preferences: studentMatch.preferenceMatch,
                  maxPoints: studentMatch.maxPoints,
                }}
              />
            )}

            {/* Organization Snapshot */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>About the Organization</h3>
              <p style={{ fontSize: '0.88rem', color: '#4A5B67', lineHeight: 1.5, marginBottom: '16px' }}>
                {org.description || 'Verified enterprise recruitment partner.'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: '#718290' }}>
                <div><strong>Industry:</strong> {org.industry}</div>
                <div><strong>Size:</strong> {org.companySize}</div>
                <div><strong>Headquarters:</strong> {org.location}</div>
                {org.website && (
                  <div>
                    <strong>Website:</strong>{' '}
                    <a href={org.website} target="_blank" rel="noreferrer">
                      {org.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ineligible Explanation Modal */}
      <Modal
        isOpen={ineligibleModalOpen}
        onClose={() => setIneligibleModalOpen(false)}
        title="Eligibility Verification Notice"
        subtitle="Our deterministic algorithm checked your profile against the mandatory requirements."
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
          <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: '#FEE2E2' }}>
            <XCircle size={28} color="#DC2626" />
          </div>
          <div>
            <h4 style={{ color: '#DC2626', fontSize: '1.05rem', marginBottom: '4px' }}>
              You are currently not eligible to apply.
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#4A5B67' }}>
              In accordance with our platform fairness principles, applications that do not meet strict corporate requirements are rejected before submission:
            </p>
          </div>
        </div>

        <div style={{ backgroundColor: '#F6FAEE', border: '1px solid #D6E4C6', borderRadius: '8px', padding: '16px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#718290', display: 'block', marginBottom: '8px' }}>
            Deficit Explanations:
          </span>
          <ul style={{ listStyle: 'disc', paddingLeft: '20px', fontSize: '0.9rem', color: '#3B4953', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {ineligibleReasons.map((reason, idx) => (
              <li key={idx}><strong>{reason}</strong></li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: '16px', fontSize: '0.84rem', color: '#718290' }}>
          Tip: You can update your skills, projects, and certifications in your <Link to="/student/profile">Student Profile</Link>.
        </div>
      </Modal>

      {/* Confirmation & Snapshot Preview Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Application & Profile Snapshot"
        subtitle="An immutable snapshot of your credentials will be locked upon applying."
        footer={
          <>
            <button onClick={() => setConfirmModalOpen(false)} className="btn btn-outline btn-sm">
              Cancel
            </button>
            <button
              onClick={handleConfirmSubmitApplication}
              className="btn btn-primary btn-sm"
              disabled={applying}
            >
              {applying ? 'Locking Snapshot...' : 'Confirm & Submit Application'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#EFF5F0', padding: '12px', borderRadius: '8px' }}>
            <CheckCircle2 size={20} color="#5A7863" />
            <span style={{ fontSize: '0.88rem', color: '#3B4953' }}>
              You meet all mandatory eligibility criteria for <strong>{opportunity.title}</strong>!
            </span>
          </div>

          <div style={{ fontSize: '0.86rem', color: '#4A5B67', lineHeight: 1.5 }}>
            <p style={{ marginBottom: '8px' }}>
              <strong>Fairness Snapshot Policy:</strong>
            </p>
            <p>
              When you submit this application, our algorithm creates an immutable record preserving your current academic CGPA, verified technical skills, project links, and resume version. Future profile edits will not alter this submitted application.
            </p>
            <p style={{ marginTop: '8px' }}>
              <strong>Recruiter Privacy Lock:</strong> The recruiter will not be able to view your name or individual profile until the application deadline expires.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#EBF4DD',
    minHeight: 'calc(100vh - 70px)',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.88rem',
    color: '#5A7863',
    fontWeight: '600',
    marginBottom: '20px',
  },
  headerCard: {
    padding: '32px',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '24px',
    flexWrap: 'wrap',
    marginBottom: '24px',
  },
  orgRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  orgLogo: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    backgroundColor: '#F6FAEE',
    border: '1px solid #D6E4C6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: {
    fontSize: '1.65rem',
    fontWeight: '700',
    color: '#26333D',
    marginBottom: '4px',
  },
  orgMeta: {
    fontSize: '0.9rem',
    color: '#718290',
  },
  actionBox: {
    alignSelf: 'center',
  },
  metricsBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    paddingTop: '20px',
    borderTop: '1px solid #EBF4DD',
  },
  metricItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  metricLabel: {
    display: 'block',
    fontSize: '0.74rem',
    color: '#718290',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  metricValue: {
    display: 'block',
    fontSize: '0.92rem',
    color: '#3B4953',
  },
  descriptionText: {
    fontSize: '0.92rem',
    lineHeight: 1.7,
    color: '#3B4953',
    whiteSpace: 'pre-line',
  },
  criteriaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  criteriaCard: {
    backgroundColor: '#F6FAEE',
    border: '1px solid #D6E4C6',
    borderRadius: '8px',
    padding: '12px 16px',
  },
  criteriaLabel: {
    display: 'block',
    fontSize: '0.76rem',
    color: '#718290',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  criteriaValue: {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#3B4953',
  },
  roundItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    backgroundColor: '#F6FAEE',
    border: '1px solid #D6E4C6',
    borderRadius: '10px',
    padding: '12px 16px',
  },
  roundNum: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#5A7863',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.9rem',
    flexShrink: 0,
  },
};

export default OpportunityDetailPage;
