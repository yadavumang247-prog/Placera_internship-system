import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import ScoreBreakdown from '../../components/ScoreBreakdown';
import Modal from '../../components/Modal';
import { 
  Lock, Unlock, ShieldCheck, Clock, Users, Award, 
  ArrowLeft, ChevronRight, CheckCircle, XCircle, 
  Filter, Play, FileText, ExternalLink 
} from 'lucide-react';

export default function OpportunityApplicationsPage() {
  const { id } = useParams();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [opportunity, setOpportunity] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Shortlisting controls
  const [topN, setTopN] = useState(10);
  const [rankingRunning, setRankingRunning] = useState(false);

  // Modals
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [statusTransitionModal, setStatusTransitionModal] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [id]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.recruiter.getOpportunityApplications(id);
      setOpportunity(res.opportunity);
      setIsLocked(res.isLocked);
      setTotalCount(res.totalApplications || res.applications?.length || 0);
      setApplications(res.applications || []);
    } catch (err) {
      toast.error('Failed to load opportunity applications');
    } finally {
      setLoading(false);
    }
  };

  const handleRunRanking = async () => {
    try {
      setRankingRunning(true);
      const res = await api.recruiter.rankCandidates(id, { topN: Number(topN) });
      setApplications(res.rankedCandidates || res.applications || []);
      toast.success(`Algorithmic Top-${topN} ranking computed using Min-Heap engine!`);
    } catch (err) {
      toast.error(err.message || 'Ranking calculation failed');
    } finally {
      setRankingRunning(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      setTransitioning(true);
      await api.recruiter.updateApplicationStatus(appId, { status: newStatus });
      toast.success(`Application updated to ${newStatus.replace(/_/g, ' ')}`);
      setStatusTransitionModal(null);
      fetchApplications();
    } catch (err) {
      toast.error(err.message || 'Failed to update application status');
    } finally {
      setTransitioning(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div className="skeleton" style={{ height: '140px', borderRadius: 'var(--radius-lg)' }} />
        <div className="skeleton" style={{ height: '400px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  const deadlineDate = opportunity ? new Date(opportunity.applicationDeadline) : new Date();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <Link to="/recruiter/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Candidate Pipeline
            </span>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: 'var(--space-1) 0' }}>
              {opportunity?.title}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              <span>Type: <strong>{opportunity?.type}</strong></span>
              <span>·</span>
              <span>Openings: <strong>{opportunity?.openings || 1}</strong></span>
              <span>·</span>
              <span>Deadline: <strong>{deadlineDate.toLocaleString()}</strong></span>
            </div>
          </div>

          <div>
            {isLocked ? (
              <span className="badge badge-warning" style={{ fontSize: 'var(--text-sm)', padding: '0.4rem 0.8rem', gap: '0.4rem' }}>
                <Lock size={16} /> Pre-Deadline Locked
              </span>
            ) : (
              <span className="badge badge-success" style={{ fontSize: 'var(--text-sm)', padding: '0.4rem 0.8rem', gap: '0.4rem' }}>
                <Unlock size={16} /> Evaluation Unlocked
              </span>
            )}
          </div>
        </div>
      </div>

      {/* PRE-DEADLINE FAIRNESS BANNER */}
      {isLocked ? (
        <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center', background: 'linear-gradient(180deg, var(--color-surface) 0%, rgba(230, 169, 77, 0.08) 100%)', border: '1.5px dashed var(--color-accent)' }}>
          <div style={{ 
            width: 64, 
            height: 64, 
            borderRadius: '50%', 
            background: 'rgba(230, 169, 77, 0.15)', 
            color: 'var(--color-accent)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto var(--space-4) auto' 
          }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: '0 0 var(--space-2) 0' }}>
            Pre-Deadline Fairness Privacy Lock Active
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto var(--space-6) auto', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            In accordance with platform candidate protection policies, applicant profiles, identities, and individual scores are strictly shielded until the application window formally closes on <strong>{deadlineDate.toLocaleString()}</strong>.
            This prevents unconscious bias, early selection prejudices, and guarantees all candidates equal algorithmic review.
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', background: 'var(--color-surface)', padding: 'var(--space-4) var(--space-6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <Users size={24} color="var(--color-primary)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Verified Applications Received</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>{totalCount} Candidates</div>
            </div>
          </div>
        </div>
      ) : (
        /* POST-DEADLINE EVALUATION & RANKING VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Top-N Algorithm Runner Toolbar */}
          <div className="card" style={{ padding: 'var(--space-4) var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Award size={20} color="var(--color-primary)" />
              <div>
                <strong style={{ fontSize: 'var(--text-sm)' }}>Algorithmic Ranking Engine</strong>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'block' }}>
                  $O(M \log N)$ Binary Min-Heap multi-factor weighted scoring with deterministic 5-tier tie-breaking
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>Top-N Cutoff:</label>
                <input 
                  type="number" 
                  min="1" 
                  max="500" 
                  className="form-control" 
                  style={{ width: '80px', padding: '0.2rem 0.5rem', fontSize: 'var(--text-sm)' }}
                  value={topN} 
                  onChange={e => setTopN(e.target.value)} 
                />
              </div>

              <button 
                className="btn btn-primary btn-sm" 
                onClick={handleRunRanking}
                disabled={rankingRunning}
                style={{ gap: '0.4rem' }}
              >
                <Play size={14} /> {rankingRunning ? 'Computing Heap...' : 'Run Top-N Shortlist'}
              </button>
            </div>
          </div>

          {/* Applications Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Candidate</th>
                    <th>Academics</th>
                    <th>Scores Breakdown</th>
                    <th>Composite Fit</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                        No applicants found for this opportunity.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app, idx) => {
                      const student = app.student || app.snapshot?.student || {};
                      const userObj = student.user || {};
                      const academics = app.snapshot?.academics || student.academics || {};
                      const scores = app.scores || {};
                      const isTopNShortlist = idx < topN;

                      return (
                        <tr key={app._id} style={isTopNShortlist ? { background: 'rgba(144, 171, 139, 0.04)' } : {}}>
                          <td>
                            <div style={{ 
                              width: 28, 
                              height: 28, 
                              borderRadius: '50%', 
                              background: isTopNShortlist ? 'var(--color-primary)' : 'var(--color-surface)',
                              color: isTopNShortlist ? '#ffffff' : 'var(--color-text-muted)',
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              fontWeight: 700, 
                              fontSize: '0.75rem' 
                            }}>
                              {idx + 1}
                            </div>
                          </td>
                          <td>
                            <strong>{userObj.name || 'Candidate Name'}</strong>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                              Roll: {academics.rollNumber || 'N/A'} · {userObj.email}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: 'var(--text-sm)' }}>
                              <strong>{academics.cgpa || 'N/A'} CGPA</strong>
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                              {academics.department || 'Computer Science'} · {academics.activeBacklogs || 0} Backlogs
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 'var(--space-1)', fontSize: '0.7rem' }}>
                              <span className="badge badge-neutral" title="Skill Match (40%)">
                                S: {Math.round(scores.skillScore || 0)}
                              </span>
                              <span className="badge badge-neutral" title="Academic Score (20%)">
                                A: {Math.round(scores.academicScore || 0)}
                              </span>
                              <span className="badge badge-neutral" title="Project Score (15%)">
                                P: {Math.round(scores.projectScore || 0)}
                              </span>
                              <span className="badge badge-neutral" title="Experience Score (15%)">
                                E: {Math.round(scores.experienceScore || 0)}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--color-primary)' }}>
                              {Math.round(app.overallScore || 0)}%
                            </div>
                            {app.tieBreakReason && (
                              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block' }}>
                                Tier: {app.tieBreakReason}
                              </span>
                            )}
                          </td>
                          <td>
                            <StatusBadge status={app.status} />
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: 'var(--text-xs)', padding: '0.2rem 0.5rem' }}
                                onClick={() => {
                                  setSelectedCandidate(app);
                                  setInspectModalOpen(true);
                                }}
                              >
                                Snapshot
                              </button>

                              <button
                                className="btn btn-primary btn-sm"
                                style={{ fontSize: 'var(--text-xs)', padding: '0.2rem 0.5rem' }}
                                onClick={() => setStatusTransitionModal(app)}
                              >
                                Advance Stage
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Snapshot & Detailed Evaluation Modal */}
      {inspectModalOpen && selectedCandidate && (
        <Modal
          isOpen={true}
          onClose={() => setInspectModalOpen(false)}
          title={`Candidate Evaluation Snapshot: ${selectedCandidate.student?.user?.name || 'Candidate'}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, margin: '0 0 var(--space-2) 0' }}>
                Multi-Factor Evaluation Weights
              </h4>
              <ScoreBreakdown scores={selectedCandidate.scores} />
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, margin: '0 0 var(--space-2) 0' }}>
                Application Snapshot Details
              </h4>
              <div style={{ background: 'var(--color-surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                <div>Degree: <strong>{selectedCandidate.snapshot?.academics?.degree || 'B.Tech'}</strong></div>
                <div>Department: <strong>{selectedCandidate.snapshot?.academics?.department || 'N/A'}</strong></div>
                <div>CGPA at Application: <strong>{selectedCandidate.snapshot?.academics?.cgpa || 'N/A'}</strong></div>
                <div>Active Backlogs: <strong>{selectedCandidate.snapshot?.academics?.activeBacklogs ?? 0}</strong></div>
              </div>
            </div>

            {selectedCandidate.snapshot?.skills && (
              <div>
                <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Captured Skills Snapshot</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginTop: 'var(--space-1)' }}>
                  {selectedCandidate.snapshot.skills.map((s, i) => (
                    <span key={i} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                      {s.name} ({s.proficiency})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedCandidate.snapshot?.resumeUrl && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 'var(--space-2)' }}>
                <a
                  href={selectedCandidate.snapshot.resumeUrl.startsWith('http') ? selectedCandidate.snapshot.resumeUrl : `/api${selectedCandidate.snapshot.resumeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.3rem' }}
                >
                  <FileText size={14} /> Open Verified PDF Resume ↗
                </a>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Advance Stage Modal */}
      {statusTransitionModal && (
        <Modal
          isOpen={true}
          onClose={() => setStatusTransitionModal(null)}
          title={`Transition Stage for ${statusTransitionModal.student?.user?.name || 'Candidate'}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
              Current Status: <StatusBadge status={statusTransitionModal.status} />
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              {[
                { status: 'SHORTLISTED', label: 'Top-N Shortlist', desc: 'Advance candidate past initial screening' },
                { status: 'ASSESSMENT_SCHEDULED', label: 'Invite to Assessment', desc: 'Assign timed technical challenge / MCQ' },
                { status: 'INTERVIEW_SCHEDULED', label: 'Schedule Interview', desc: 'Book live panel video round' },
                { status: 'OFFER_EXTENDED', label: 'Extend Formal Offer', desc: 'Issue formal recruitment placement offer' },
                { status: 'REJECTED', label: 'Reject Candidate', desc: 'Conclude candidate evaluation' }
              ].map(opt => (
                <button
                  key={opt.status}
                  onClick={() => handleUpdateStatus(statusTransitionModal._id, opt.status)}
                  disabled={transitioning || statusTransitionModal.status === opt.status}
                  className="card"
                  style={{
                    padding: 'var(--space-3)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    background: opt.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.05)' : 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: 'var(--text-sm)', color: opt.status === 'REJECTED' ? 'var(--color-error)' : 'var(--color-text)' }}>
                      {opt.label}
                    </strong>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{opt.desc}</div>
                  </div>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
