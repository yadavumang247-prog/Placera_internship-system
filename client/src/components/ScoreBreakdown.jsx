import React from 'react';
import { Cpu, GraduationCap, FolderGit2, Briefcase, Award } from 'lucide-react';

export const ScoreBreakdown = ({ score = 0, breakdown = {}, showDetails = true }) => {
  const skills = breakdown.skills || 0;
  const academics = breakdown.academics || 0;
  const projects = breakdown.projects || 0;
  const experience = breakdown.experience || 0;
  const preferences = breakdown.preferences || 0;

  const maxPoints = breakdown.maxPoints || {
    skills: 40,
    academics: 20,
    projects: 15,
    experience: 15,
    preferences: 10,
  };

  const rows = [
    { label: 'Technical Skills', score: skills, max: maxPoints.skills, icon: Cpu, color: '#5A7863' },
    { label: 'Academic Performance', score: academics, max: maxPoints.academics, icon: GraduationCap, color: '#90AB8B' },
    { label: 'Project Portfolio', score: projects, max: maxPoints.projects, icon: FolderGit2, color: '#3B4953' },
    { label: 'Work Experience', score: experience, max: maxPoints.experience, icon: Briefcase, color: '#0284C7' },
    { label: 'Preferences & Certs', score: preferences, max: maxPoints.preferences, icon: Award, color: '#D97706' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <span style={styles.label}>Algorithmic Match Score</span>
          <h3 style={styles.scoreTitle}>{score}% <span style={styles.maxSub}>/ 100</span></h3>
        </div>
        <div style={styles.scoreRing}>
          <svg viewBox="0 0 36 36" style={styles.svgRing}>
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#EBF4DD"
              strokeWidth="3.5"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#5A7863"
              strokeWidth="3.5"
              strokeDasharray={`${score}, 100`}
            />
          </svg>
        </div>
      </div>

      {showDetails && (
        <div style={styles.barsContainer}>
          {rows.map((row) => {
            const Icon = row.icon;
            const pct = row.max > 0 ? (row.score / row.max) * 100 : 0;
            return (
              <div key={row.label} style={styles.row}>
                <div style={styles.rowLabelGroup}>
                  <Icon size={14} color={row.color} />
                  <span style={styles.rowName}>{row.label}</span>
                  <span style={styles.rowScore}>
                    <strong>{row.score}</strong> / {row.max}
                  </span>
                </div>
                <div style={styles.progressTrack}>
                  <div
                    style={{
                      ...styles.progressBar,
                      width: `${pct}%`,
                      backgroundColor: row.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#F6FAEE',
    border: '1px solid #D6E4C6',
    borderRadius: '12px',
    padding: '20px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    borderBottom: '1px solid #E2ECD5',
    paddingBottom: '12px',
  },
  label: {
    fontSize: '0.78rem',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#718290',
    fontWeight: '600',
  },
  scoreTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '2.4rem',
    color: '#3B4953',
    lineHeight: 1,
    marginTop: '4px',
  },
  maxSub: {
    fontSize: '1rem',
    color: '#90AB8B',
  },
  scoreRing: {
    width: '48px',
    height: '48px',
  },
  svgRing: {
    width: '100%',
    height: '100%',
  },
  barsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  rowLabelGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.84rem',
  },
  rowName: {
    flex: 1,
    color: '#4A5B67',
    fontWeight: '500',
  },
  rowScore: {
    color: '#3B4953',
    fontFamily: 'monospace',
    fontSize: '0.82rem',
  },
  progressTrack: {
    height: '6px',
    backgroundColor: '#E2ECD5',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.4s ease',
  },
};

export default ScoreBreakdown;
