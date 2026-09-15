import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { Briefcase, ArrowRight, Clock, ShieldCheck, FileCheck } from 'lucide-react';

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.student.getApplications();
      setApplications(res.applications || []);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filtered = applications.filter(app => {
    if (filter === 'ALL') return true;
    return app.status === filter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: 0 }}>My Applications</h1>
            <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-1) 0 0 0', fontSize: 'var(--text-sm)' }}>
              Track recruitment progression, assessment invites, interview schedules, and inspect your permanent application snapshot.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Link to="/opportunities" className="btn btn-primary btn-sm">
              <Briefcase size={16} /> Explore Opportunities
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)', overflowX: 'auto' }}>
          {['ALL', 'APPLIED', 'SHORTLISTED', 'ASSESSMENT_SCHEDULED', 'INTERVIEW_SCHEDULED', 'OFFER_EXTENDED', 'OFFER_ACCEPTED', 'REJECTED'].map(st => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`btn btn-sm ${filter === st ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: 'var(--text-xs)' }}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: '100px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No applications found"
          description={filter === 'ALL' ? "You haven't submitted any applications yet. Browse active placement drives and open roles." : `No applications currently have status "${filter}".`}
          actionLabel="Browse Open Roles"
          actionLink="/opportunities"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {filtered.map(app => {
            const opp = app.opportunity || {};
            const org = opp.organization || {};
            return (
              <div 
                key={app._id} 
                className="card" 
                style={{ 
                  padding: 'var(--space-5)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 'var(--space-3)',
                  transition: 'var(--transition-normal)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  <div>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {org.name || 'Organization'}
                    </span>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: '0.2rem 0' }}>
                      {opp.title || 'Role Title'}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                      <span>Type: <strong>{opp.type || 'INTERNSHIP'}</strong></span>
                      <span>·</span>
                      <span>Location: <strong>{opp.location || 'Remote'}</strong></span>
                      <span>·</span>
                      <span>Applied: <strong>{new Date(app.appliedAt || app.createdAt).toLocaleDateString()}</strong></span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-2)' }}>
                    <StatusBadge status={app.status} />
                    {app.overallScore !== undefined && (
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                        Fit Score: <strong>{Math.round(app.overallScore)}%</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  borderTop: '1px solid var(--color-border)', 
                  paddingTop: 'var(--space-3)',
                  marginTop: 'var(--space-1)',
                  flexWrap: 'wrap',
                  gap: 'var(--space-2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <FileCheck size={14} color="var(--color-primary)" />
                      Snapshot ID: <code>{app.snapshotId ? app.snapshotId.toString().slice(-8) : 'Generated'}</code>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <ShieldCheck size={14} color="var(--color-success)" />
                      Pre-Deadline Locked
                    </span>
                  </div>

                  <Link 
                    to={`/student/applications/${app._id}`}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '0.4rem' }}
                  >
                    View Full Details & Snapshot <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
