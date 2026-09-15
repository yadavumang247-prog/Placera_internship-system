import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import ScoreBreakdown from '../../components/ScoreBreakdown';
import Timeline from '../../components/Timeline';
import Modal from '../../components/Modal';
import { 
  ArrowLeft, Briefcase, Building2, MapPin, Calendar, 
  FileCheck, Shield, Award, CheckCircle, XCircle 
} from 'lucide-react';

export default function StudentApplicationDetailPage() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState(null); // 'accept' or 'decline'
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const res = await api.student.getApplicationById(id);
      setApplication(res.application);
    } catch (err) {
      toast.error('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleOfferResponse = async (status) => {
    try {
      setProcessing(true);
      await api.student.respondToOffer(id, { status });
      toast.success(status === 'OFFER_ACCEPTED' ? 'Congratulations! Offer accepted.' : 'Offer declined.');
      setActionModal(null);
      fetchApplicationDetails();
    } catch (err) {
      toast.error(err.message || 'Action failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div className="skeleton" style={{ height: '200px', borderRadius: 'var(--radius-lg)' }} />
        <div className="skeleton" style={{ height: '400px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
        <h3>Application Not Found</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>The requested application could not be located.</p>
        <Link to="/student/applications" className="btn btn-secondary" style={{ marginTop: 'var(--space-4)' }}>
          Back to Applications
        </Link>
      </div>
    );
  }

  const opp = application.opportunity || {};
  const org = opp.organization || {};
  const snap = application.snapshot || {};

  // Build timeline events from application audit trail / stage history
  const timelineEvents = (application.statusHistory || [
    { status: 'APPLIED', timestamp: application.appliedAt || application.createdAt, note: 'Application registered and verified with immutable snapshot' }
  ]).map(h => ({
    title: h.status.replace(/_/g, ' '),
    subtitle: h.note || `Stage updated to ${h.status.replace(/_/g, ' ')}`,
    date: h.timestamp ? new Date(h.timestamp).toLocaleDateString() : 'N/A',
    status: h.status === 'REJECTED' ? 'REJECTED' : 'COMPLETED'
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Back button */}
      <div>
        <Link to="/student/applications" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>
          <ArrowLeft size={16} /> Back to My Applications
        </Link>
      </div>

      {/* Header Card */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
              <Building2 size={16} /> {org.name || 'Organization'}
            </div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: 'var(--space-1) 0' }}>
              {opp.title}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Briefcase size={14} /> {opp.type}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={14} /> {opp.location || 'Remote'}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={14} /> Applied on {new Date(application.appliedAt || application.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-3)' }}>
            <StatusBadge status={application.status} />
            {application.status === 'OFFER_EXTENDED' && (
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button onClick={() => setActionModal('accept')} className="btn btn-primary btn-sm">
                  <CheckCircle size={14} /> Accept Offer
                </button>
                <button onClick={() => setActionModal('decline')} className="btn btn-secondary btn-sm" style={{ color: 'var(--color-error)' }}>
                  <XCircle size={14} /> Decline
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Left column: Recruitment Timeline & Match Scores */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: '0 0 var(--space-4) 0' }}>Recruitment Stage Progress</h3>
            <Timeline events={timelineEvents} />
          </div>

          {application.scores && (
            <div className="card" style={{ padding: 'var(--space-5)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: '0 0 var(--space-4) 0' }}>Candidate Evaluation Breakdown</h3>
              <ScoreBreakdown scores={application.scores} />
            </div>
          )}
        </div>

        {/* Right column: Immutable Application Snapshot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="card" style={{ padding: 'var(--space-5)', border: '1px solid var(--color-primary-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Shield size={20} color="var(--color-primary)" />
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, margin: 0 }}>Immutable Application Snapshot</h3>
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>Snapshot Locked</span>
            </div>
            
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: '0 0 var(--space-4) 0' }}>
              In accordance with platform fairness policy, this is the exact, unchangeable record of your profile data as it existed when you applied. Future profile edits do not alter this evaluation record.
            </p>

            {/* Academic Snapshot */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Academics Snapshot</strong>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                <div>Degree: <strong>{snap.academics?.degree || 'B.Tech'}</strong></div>
                <div>Department: <strong>{snap.academics?.department || 'N/A'}</strong></div>
                <div>CGPA at Application: <strong>{snap.academics?.cgpa || 'N/A'} / 10</strong></div>
                <div>Backlogs: <strong>{snap.academics?.activeBacklogs ?? 0} active</strong></div>
              </div>
            </div>

            {/* Skills Snapshot */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skills Snapshot</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginTop: 'var(--space-2)' }}>
                {(snap.skills || []).map((s, idx) => (
                  <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                    {s.name} ({s.proficiency || 'proficient'})
                  </span>
                ))}
              </div>
            </div>

            {/* Projects Snapshot */}
            {snap.projects && snap.projects.length > 0 && (
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Projects Snapshot ({snap.projects.length})</strong>
                <ul style={{ margin: 'var(--space-1) 0 0 0', paddingLeft: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                  {snap.projects.map((p, idx) => (
                    <li key={idx}><strong>{p.title}</strong> {p.role && `(${p.role})`}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Resume Snapshot */}
            {snap.resumeUrl && (
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                <a 
                  href={snap.resumeUrl.startsWith('http') ? snap.resumeUrl : `/api${snap.resumeUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <FileCheck size={16} /> View Snapshot Resume (PDF) ↗
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Accept / Decline Modal */}
      {actionModal && (
        <Modal
          isOpen={true}
          onClose={() => setActionModal(null)}
          title={actionModal === 'accept' ? 'Accept Placement Offer' : 'Decline Placement Offer'}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
              {actionModal === 'accept' ? (
                <>Are you sure you want to accept the formal offer for <strong>{opp.title}</strong> at <strong>{org.name}</strong>? In accordance with placement cell policies, accepting an offer may lock you from further on-campus drives.</>
              ) : (
                <>Are you sure you want to decline this offer? This decision is final and cannot be reversed.</>
              )}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <button className="btn btn-secondary" onClick={() => setActionModal(null)}>Cancel</button>
              <button 
                className={`btn ${actionModal === 'accept' ? 'btn-primary' : 'btn-secondary'}`}
                style={actionModal === 'decline' ? { color: 'var(--color-error)' } : {}}
                disabled={processing}
                onClick={() => handleOfferResponse(actionModal === 'accept' ? 'OFFER_ACCEPTED' : 'OFFER_DECLINED')}
              >
                {processing ? 'Processing...' : actionModal === 'accept' ? 'Confirm Acceptance' : 'Confirm Decline'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
