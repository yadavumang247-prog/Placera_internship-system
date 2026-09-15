import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import EmptyState from '../../components/EmptyState';
import { Calendar, Video, Clock, Building2, UserCheck, ExternalLink, CheckCircle } from 'lucide-react';

export default function StudentInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await api.student.getInterviews();
      setInterviews(res.interviews || []);
    } catch (err) {
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: 0 }}>Scheduled Interviews</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-1) 0 0 0', fontSize: 'var(--text-sm)' }}>
          Technical rounds, behavioral evaluations, and leadership interviews scheduled by recruiting partners.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {[1, 2].map(i => (
            <div key={i} className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No interviews currently scheduled"
          description="Once your assessment scores clear the cutoff threshold, recruiters schedule live technical and HR interviews here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {interviews.map(item => {
            const opp = item.opportunity || {};
            const org = opp.organization || {};
            const isCompleted = item.status === 'COMPLETED';

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
                      {item.roundName || 'Technical Interview'}
                    </h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                      Interviewer: <strong>{item.interviewerName || 'Technical Panel'}</strong>
                    </p>
                  </div>

                  <div>
                    {isCompleted ? (
                      <span className="badge badge-success" style={{ fontSize: 'var(--text-sm)' }}>
                        <CheckCircle size={14} /> Completed
                      </span>
                    ) : (
                      <span className="badge badge-primary" style={{ fontSize: 'var(--text-sm)' }}>
                        <Clock size={14} /> Scheduled
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={14} /> Date: <strong>{new Date(item.scheduledAt).toLocaleDateString()}</strong>
                  </span>
                  <span>·</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={14} /> Time: <strong>{new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong> ({item.durationMinutes || 45} mins)
                  </span>
                </div>

                {item.instructions && (
                  <div style={{ background: 'var(--color-surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>
                    <strong>Instructions:</strong> {item.instructions}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-1)' }}>
                  {item.meetingLink ? (
                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                      style={{ gap: '0.4rem' }}
                    >
                      <Video size={14} /> Join Video Meeting <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      Meeting link will be shared 15 minutes before scheduled slot
                    </span>
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
