import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import EmptyState from '../../components/EmptyState';
import { Code, Clock, Award, CheckCircle, Play, AlertTriangle } from 'lucide-react';

export default function StudentAssessmentsPage() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const res = await api.student.getAssessments();
      setAssessments(res.assessments || []);
    } catch (err) {
      toast.error('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: 0 }}>Online Assessments</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-1) 0 0 0', fontSize: 'var(--text-sm)' }}>
          Assigned aptitude screenings, technical MCQs, and coding challenges for shortlisted roles.
        </p>
      </div>

      {/* Live Coding Arena Feature Banner */}
      <div 
        className="card" 
        style={{ 
          background: 'linear-gradient(135deg, #26333D 0%, #1A2228 100%)', 
          color: '#EBF4DD', 
          padding: 'var(--space-6)',
          border: '1px solid #5A7863',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)'
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(90, 120, 99, 0.25)', border: '1px solid #90AB8B', color: '#90AB8B', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} />
            OPEN PRACTICE & ASSESSMENT SANDBOX
          </div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: '0 0 6px 0', color: '#FFFFFF' }}>
            Interactive Coding Arena & AI Proctoring
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: '#D6E4C6', margin: 0, lineHeight: 1.6 }}>
            Launch the real-time code execution environment with live webcam/microphone AI proctoring, test cases runner, anti-tab violation detection, and multi-language support.
          </p>
        </div>

        <div>
          <Link
            to="/student/assessments/coding"
            className="btn btn-primary"
            style={{ 
              padding: '0.65rem 1.4rem', 
              fontSize: 'var(--text-sm)', 
              fontWeight: 600,
              gap: '8px',
              boxShadow: '0 4px 12px rgba(90, 120, 99, 0.4)' 
            }}
          >
            <Play size={16} /> Launch Coding Arena
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {[1, 2].map(i => (
            <div key={i} className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : assessments.length === 0 ? (
        <EmptyState
          icon={Code}
          title="No pending assessments"
          description="You do not currently have any active assessment invitations. Assessments are assigned after candidate shortlisting."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {assessments.map(item => {
            const opp = item.opportunity || {};
            const org = opp.organization || {};
            const isTaken = item.attempt && item.attempt.status === 'COMPLETED';
            const isCoding = item.type === 'CODING' || (item.codingChallenges && item.codingChallenges.length > 0);

            return (
              <div 
                key={item._id} 
                className="card" 
                style={{ 
                  padding: 'var(--space-5)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 'var(--space-3)' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  <div>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                      {org.name || 'Organization'} · {opp.title || 'Role'}
                    </span>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: '0.2rem 0' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                      {item.description || 'Complete the assessment before the stated window expires.'}
                    </p>
                  </div>

                  <div>
                    {isTaken ? (
                      <span className={`badge ${item.attempt.passed ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: 'var(--text-sm)', padding: '0.4rem 0.8rem' }}>
                        <CheckCircle size={14} /> Completed ({item.attempt.score}%)
                      </span>
                    ) : (
                      <span className="badge badge-warning" style={{ fontSize: 'var(--text-sm)', padding: '0.4rem 0.8rem' }}>
                        <Clock size={14} /> Pending
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  <span>Duration: <strong>{item.durationMinutes || 45} mins</strong></span>
                  <span>·</span>
                  <span>Questions: <strong>{item.questions?.length || item.totalQuestions || 10}</strong></span>
                  <span>·</span>
                  <span>Cutoff Mark: <strong>{item.passingMarks || 50}%</strong></span>
                  <span>·</span>
                  <span>Type: <strong>{item.type || 'MCQ'}</strong></span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-1)' }}>
                  {isTaken ? (
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                      Submitted on {new Date(item.attempt.submittedAt).toLocaleString()}
                    </div>
                  ) : (
                    <Link
                      to={isCoding ? `/student/assessments/${item._id}/code` : `/student/assessments/${item._id}`}
                      className="btn btn-primary btn-sm"
                      style={{ gap: '0.4rem' }}
                    >
                      <Play size={14} /> Start Assessment Now
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
