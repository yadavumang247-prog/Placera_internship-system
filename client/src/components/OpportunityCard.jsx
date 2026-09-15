import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Briefcase, Calendar, Users, IndianRupee, Sparkles, AlertCircle } from 'lucide-react';

export const OpportunityCard = ({ opportunity, match }) => {
  const org = opportunity.organization || {};
  const matchScore = match?.score ?? opportunity.match?.score;
  const isEligible = match?.isEligible ?? opportunity.match?.isEligible ?? true;
  const highlights = match?.highlights ?? opportunity.match?.highlights ?? [];

  const isDeadlinePassed = new Date() > new Date(opportunity.applicationDeadline);
  const deadlineStr = new Date(opportunity.applicationDeadline).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="card card-interactive" style={styles.card}>
      {/* Header Row: Org & Match Score */}
      <div style={styles.headerRow}>
        <div style={styles.orgInfo}>
          <div style={styles.orgLogo}>
            <Building2 size={20} color="#5A7863" />
          </div>
          <div>
            <h4 style={styles.orgName}>{org.name || 'Hiring Organization'}</h4>
            <span style={styles.orgIndustry}>{org.industry || 'Technology'}</span>
          </div>
        </div>

        {matchScore !== undefined && (
          <div style={{ ...styles.matchBadge, ...(isEligible ? styles.matchBadgeEligible : styles.matchBadgeIneligible) }}>
            <Sparkles size={13} />
            <span>{matchScore}% Match</span>
          </div>
        )}
      </div>

      {/* Role Title & Type */}
      <div style={styles.titleSection}>
        <h3 style={styles.jobTitle}>{opportunity.title}</h3>
        <div style={styles.tagRow}>
          <span className="badge badge-sage">{opportunity.type?.replace('_', ' ')}</span>
          <span className="badge badge-neutral">{opportunity.workMode}</span>
          <span className="badge badge-neutral">Min CGPA: {opportunity.minCgpa?.toFixed(1)}</span>
        </div>
      </div>

      {/* Logistics Pills */}
      <div style={styles.logisticsGrid}>
        <div style={styles.logisticsItem}>
          <MapPin size={14} color="#718290" />
          <span>{opportunity.location || 'Pan-India'}</span>
        </div>
        <div style={styles.logisticsItem}>
          <IndianRupee size={14} color="#718290" />
          <span>{opportunity.stipendOrSalary}</span>
        </div>
        <div style={styles.logisticsItem}>
          <Users size={14} color="#718290" />
          <span>{opportunity.vacancies} Top Shortlists</span>
        </div>
        <div style={styles.logisticsItem}>
          <Calendar size={14} color={isDeadlinePassed ? '#DC2626' : '#718290'} />
          <span style={{ color: isDeadlinePassed ? '#DC2626' : 'inherit', fontWeight: isDeadlinePassed ? '600' : 'normal' }}>
            {isDeadlinePassed ? 'Closed' : `Closes ${deadlineStr}`}
          </span>
        </div>
      </div>

      {/* Skills Required */}
      <div style={styles.skillsSection}>
        <span style={styles.skillsLabel}>Key Skills:</span>
        <div style={styles.skillsList}>
          {(opportunity.requiredSkills || []).slice(0, 4).map((skill) => (
            <span key={skill} style={styles.skillTag}>
              {skill}
            </span>
          ))}
          {(opportunity.requiredSkills || []).length > 4 && (
            <span style={styles.moreSkillTag}>+{opportunity.requiredSkills.length - 4} more</span>
          )}
        </div>
      </div>

      {/* Explanatory Highlight */}
      {highlights.length > 0 && (
        <div style={styles.highlightBanner}>
          <span style={styles.highlightText}>{highlights[0]}</span>
        </div>
      )}

      {/* Footer CTA */}
      <div style={styles.footerRow}>
        <Link to={`/opportunities/${opportunity._id}`} className="btn btn-primary" style={{ width: '100%' }}>
          View Details & Eligibility
        </Link>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '24px',
    height: '100%',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '14px',
  },
  orgInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  orgLogo: {
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    backgroundColor: '#EFF5F0',
    border: '1px solid #D6E4C6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgName: {
    fontSize: '0.94rem',
    fontWeight: '700',
    color: '#3B4953',
    lineHeight: 1.2,
  },
  orgIndustry: {
    fontSize: '0.78rem',
    color: '#718290',
  },
  matchBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '700',
    letterSpacing: '0.02em',
  },
  matchBadgeEligible: {
    backgroundColor: '#EFF5F0',
    color: '#5A7863',
    border: '1px solid #90AB8B',
  },
  matchBadgeIneligible: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    border: '1px solid #FCA5A5',
  },
  titleSection: {
    marginBottom: '14px',
  },
  jobTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#26333D',
    marginBottom: '8px',
    lineHeight: 1.3,
  },
  tagRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  logisticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    backgroundColor: '#F6FAEE',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '14px',
  },
  logisticsItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.82rem',
    color: '#4A5B67',
  },
  skillsSection: {
    marginBottom: '14px',
  },
  skillsLabel: {
    fontSize: '0.76rem',
    fontWeight: '600',
    color: '#718290',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    display: 'block',
    marginBottom: '6px',
  },
  skillsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  skillTag: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #D6E4C6',
    borderRadius: '4px',
    padding: '3px 8px',
    fontSize: '0.78rem',
    color: '#3B4953',
    fontWeight: '500',
  },
  moreSkillTag: {
    fontSize: '0.76rem',
    color: '#718290',
    padding: '3px 4px',
  },
  highlightBanner: {
    backgroundColor: '#EFF5F0',
    borderLeft: '3px solid #5A7863',
    padding: '6px 10px',
    borderRadius: '0 4px 4px 0',
    marginBottom: '16px',
  },
  highlightText: {
    fontSize: '0.78rem',
    color: '#3B4953',
    fontWeight: '500',
  },
  footerRow: {
    marginTop: 'auto',
  },
};

export default OpportunityCard;
