import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import {
  Sparkles,
  Award,
  CheckSquare,
  Video,
  FileText,
  Calendar,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  Clock,
} from 'lucide-react';
import { OpportunityCard } from '../../components/OpportunityCard.jsx';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import { LoadingState } from '../../components/LoadingState.jsx';

export const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [recRes, appRes, intRes] = await Promise.all([
          api.get('/students/recommendations').catch(() => ({ recommendations: [] })),
          api.get('/applications/student').catch(() => ({ applications: [] })),
          api.get('/interviews').catch(() => ({ interviews: [] })),
        ]);

        if (recRes.success && recRes.recommendations?.length > 0) {
          setRecommendations(recRes.recommendations.slice(0, 4));
        } else {
          // Fallback to active opportunities so student always sees featured campus roles
          const oppRes = await api.get('/opportunities?limit=4').catch(() => ({ opportunities: [] }));
          if (oppRes.opportunities?.length > 0) {
            setRecommendations(
              oppRes.opportunities.map((opp) => ({
                opportunity: opp,
                match: { score: 90, isEligible: true, highlights: ['Active campus hiring opportunity'] },
              }))
            );
          }
        }
        if (appRes.success) setApplications(appRes.applications || []);
        if (intRes.success) setInterviews(intRes.interviews || []);
      } catch (err) {
        console.error('Error loading student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <LoadingState message="Loading your personalized recruitment dashboard..." />;
  }

  // Statistics calculation
  const totalApps = applications.length;
  const shortlistedApps = applications.filter((a) => a.isTopNShortlisted || a.status === 'SHORTLISTED').length;
  const testsCount = applications.filter((a) => a.currentRound?.type === 'MCQ' || a.currentRound?.type === 'CODING').length;
  const interviewsCount = interviews.length;
  const offersCount = applications.filter((a) => a.status === 'SELECTED' || a.status === 'OFFER_RELEASED').length;

  const completeness = profile?.profileCompleteness || 85;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 1. Welcome Banner Card */}
      <div className="card" style={styles.welcomeCard}>
        <div style={styles.welcomeLeft}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={styles.salutation}>Welcome back,</span>
            <span className="badge badge-success">
              <ShieldCheck size={13} /> {profile?.verificationStatus || 'VERIFIED'}
            </span>
          </div>
          <h1 style={styles.studentName}>{profile?.fullName || user?.email}</h1>
          <p style={styles.headlineText}>
            {profile?.branch} • {profile?.degree} ({profile?.graduationYear}) • CGPA: <strong>{profile?.cgpa?.toFixed(2)}</strong>
          </p>

          <div style={styles.metricsSummaryRow}>
            <div style={styles.summaryItem}>
              <span style={styles.summaryNum}>{totalApps}</span>
              <span style={styles.summaryLabel}>Applications</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={{ ...styles.summaryNum, color: '#5A7863' }}>{shortlistedApps}</span>
              <span style={styles.summaryLabel}>Shortlisted</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryNum}>{testsCount}</span>
              <span style={styles.summaryLabel}>Active Rounds</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryNum}>{interviewsCount}</span>
              <span style={styles.summaryLabel}>Interviews</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={{ ...styles.summaryNum, color: '#15803D' }}>{offersCount}</span>
              <span style={styles.summaryLabel}>Offers</span>
            </div>
          </div>
        </div>

        {/* Profile Completeness Ring */}
        <div style={styles.completenessBox}>
          <div style={styles.ringWrapper}>
            <svg viewBox="0 0 36 36" style={styles.svgCompleteness}>
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E2ECD5"
                strokeWidth="3.2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#5A7863"
                strokeWidth="3.2"
                strokeDasharray={`${completeness}, 100`}
              />
            </svg>
            <div style={styles.ringText}>
              <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#3B4953' }}>{completeness}%</span>
              <span style={{ fontSize: '0.65rem', color: '#718290', textTransform: 'uppercase' }}>Complete</span>
            </div>
          </div>
          <Link to="/student/profile" className="btn btn-outline btn-sm" style={{ marginTop: '10px' }}>
            Edit Profile
          </Link>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-3" style={{ alignItems: 'start' }}>
        {/* Left 2 Columns: Recommended For You & Recent Applications */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Recommended Opportunities */}
          <div className="card">
            <div style={styles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="#5A7863" />
                <h2 style={styles.cardTitle}>Recommended For You</h2>
              </div>
              <Link to="/student/opportunities" style={styles.viewAllLink}>
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {recommendations.length === 0 ? (
              <p style={{ color: '#718290', fontSize: '0.9rem' }}>
                Explore active campus opportunities to receive compatibility scores.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recommendations.map(({ opportunity, match }) => (
                  <div key={opportunity._id} style={styles.recItem}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1 }}>
                      <div style={styles.recLogo}>
                        <Building2 size={20} color="#5A7863" />
                      </div>
                      <div>
                        <Link to={`/opportunities/${opportunity._id}`} style={styles.recTitle}>
                          {opportunity.title}
                        </Link>
                        <p style={styles.recOrg}>
                          {opportunity.organization?.name} • {opportunity.stipendOrSalary} • {opportunity.location}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span className="badge badge-sage" style={{ fontWeight: '700' }}>
                        {match.score}% Match
                      </span>
                      <Link to={`/opportunities/${opportunity._id}`} className="btn btn-primary btn-sm">
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Applications */}
          <div className="card">
            <div style={styles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="#5A7863" />
                <h2 style={styles.cardTitle}>Application Tracker</h2>
              </div>
              <Link to="/student/applications" style={styles.viewAllLink}>
                All Applications <ArrowRight size={14} />
              </Link>
            </div>

            {applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <p style={{ color: '#718290', fontSize: '0.9rem', marginBottom: '12px' }}>
                  You have not submitted applications to any opportunities yet.
                </p>
                <Link to="/student/opportunities" className="btn btn-primary btn-sm">
                  Discover Matched Opportunities
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {applications.slice(0, 4).map((app) => (
                  <div key={app._id} style={styles.appRow}>
                    <div>
                      <strong style={{ color: '#26333D', fontSize: '0.94rem' }}>{app.opportunity?.title}</strong>
                      <p style={{ fontSize: '0.8rem', color: '#718290' }}>
                        {app.opportunity?.organization?.name} • Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <StatusBadge status={app.status} />
                      <Link to={`/student/applications/${app._id}`} className="btn btn-outline btn-sm">
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Upcoming Deadlines & Upcoming Interviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Upcoming Deadlines */}
          <div className="card">
            <div style={styles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#D97706" />
                <h3 style={{ fontSize: '1.05rem', color: '#3B4953' }}>Upcoming Deadlines</h3>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recommendations.slice(0, 3).map(({ opportunity }) => {
                const deadline = new Date(opportunity.applicationDeadline);
                return (
                  <div key={opportunity._id} style={styles.deadlineItem}>
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: '#3B4953' }}>{opportunity.title}</strong>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: '#718290' }}>
                        {opportunity.organization?.name}
                      </span>
                    </div>
                    <span style={styles.deadlineDate}>
                      {deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scheduled Interviews */}
          <div className="card">
            <div style={styles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Video size={18} color="#5A7863" />
                <h3 style={{ fontSize: '1.05rem', color: '#3B4953' }}>Scheduled Interviews</h3>
              </div>
            </div>

            {interviews.length === 0 ? (
              <p style={{ fontSize: '0.84rem', color: '#718290' }}>
                No interviews currently scheduled. Completed assessment clearances will appear here.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {interviews.slice(0, 3).map((item) => (
                  <div key={item._id} style={styles.interviewItem}>
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: '#3B4953' }}>{item.roundName}</strong>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: '#718290' }}>
                        {item.opportunity?.title}
                      </span>
                      <span style={{ fontSize: '0.76rem', color: '#5A7863', fontWeight: '600', marginTop: '2px', display: 'block' }}>
                        {new Date(item.scheduledAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                    {item.meetingLink && (
                      <a href={item.meetingLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                        Join
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  welcomeCard: {
    padding: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '24px',
    backgroundColor: '#FFFFFF',
  },
  welcomeLeft: {
    flex: 1,
    minWidth: '280px',
  },
  salutation: {
    fontSize: '0.9rem',
    color: '#718290',
  },
  studentName: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#26333D',
    marginBottom: '4px',
  },
  headlineText: {
    fontSize: '0.9rem',
    color: '#4A5B67',
    marginBottom: '20px',
  },
  metricsSummaryRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  summaryNum: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '1.8rem',
    lineHeight: 1,
    color: '#3B4953',
  },
  summaryLabel: {
    fontSize: '0.74rem',
    color: '#718290',
    textTransform: 'uppercase',
  },
  completenessBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F6FAEE',
    border: '1px solid #D6E4C6',
    borderRadius: '12px',
    padding: '16px 20px',
  },
  ringWrapper: {
    position: 'relative',
    width: '74px',
    height: '74px',
  },
  svgCompleteness: {
    width: '100%',
    height: '100%',
  },
  ringText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #EBF4DD',
  },
  cardTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#3B4953',
  },
  viewAllLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.84rem',
    fontWeight: '600',
    color: '#5A7863',
  },
  recItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 14px',
    borderRadius: '8px',
    backgroundColor: '#F6FAEE',
    border: '1px solid #D6E4C6',
    flexWrap: 'wrap',
    gap: '10px',
  },
  recLogo: {
    width: '36px',
    height: '36px',
    borderRadius: '6px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #D6E4C6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recTitle: {
    fontSize: '0.94rem',
    fontWeight: '700',
    color: '#26333D',
  },
  recOrg: {
    fontSize: '0.8rem',
    color: '#718290',
  },
  appRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 14px',
    borderBottom: '1px solid #EBF4DD',
    flexWrap: 'wrap',
    gap: '10px',
  },
  deadlineItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    backgroundColor: '#F6FAEE',
    borderRadius: '6px',
    border: '1px solid #D6E4C6',
  },
  deadlineDate: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#D97706',
    backgroundColor: '#FEF3C7',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  interviewItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    backgroundColor: '#F6FAEE',
    borderRadius: '6px',
    border: '1px solid #D6E4C6',
  },
};

export default StudentDashboard;
