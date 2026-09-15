import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';
import EmptyState from '../../components/EmptyState';
import { 
  Calendar, Video, Clock, Plus, Star, CheckCircle, 
  User, Building2, ExternalLink, Award 
} from 'lucide-react';

export default function ManageInterviewsPage() {
  const { toast } = useToast();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Schedule Modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpp, setSelectedOpp] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [roundName, setRoundName] = useState('Technical Interview 1');
  const [interviewerName, setInterviewerName] = useState('Lead Engineering Panel');
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/xyz-abcd-efg');
  const [instructions, setInstructions] = useState('');
  const [scheduling, setScheduling] = useState(false);

  // Rubric Evaluation Modal
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [activeInterview, setActiveInterview] = useState(null);
  const [rubric, setRubric] = useState({
    technicalCompetence: 8,
    problemSolving: 8,
    communication: 8,
    cultureFit: 8,
    recommendation: 'HIRE',
    feedbackNotes: ''
  });
  const [savingRubric, setSavingRubric] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [intRes, oppRes] = await Promise.all([
        api.recruiter.getInterviews(),
        api.recruiter.getOpportunities()
      ]);
      setInterviews(intRes.interviews || []);
      setOpportunities(oppRes.opportunities || []);
      if (oppRes.opportunities?.length > 0) {
        setSelectedOpp(oppRes.opportunities[0]._id);
      }
    } catch (err) {
      toast.error('Failed to load interview schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOpp || !candidateEmail || !scheduledAt) {
      toast.error('Please fill in candidate email, opportunity, and scheduled time');
      return;
    }
    try {
      setScheduling(true);
      await api.recruiter.scheduleInterview({
        opportunityId: selectedOpp,
        candidateEmail,
        roundName,
        interviewerName,
        scheduledAt: new Date(scheduledAt).toISOString(),
        durationMinutes: Number(durationMinutes),
        meetingLink,
        instructions
      });
      toast.success('Interview scheduled and invite dispatched!');
      setScheduleModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Scheduling failed');
    } finally {
      setScheduling(false);
    }
  };

  const handleSaveEvaluation = async (e) => {
    e.preventDefault();
    if (!activeInterview) return;
    try {
      setSavingRubric(true);
      await api.recruiter.submitInterviewRubric(activeInterview._id, rubric);
      toast.success('Interviewer rubric saved successfully!');
      setEvalModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to submit rubric');
    } finally {
      setSavingRubric(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: 0 }}>Recruitment Interviews</h1>
            <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-1) 0 0 0', fontSize: 'var(--text-sm)' }}>
              Coordinate live video evaluation panels and record multi-dimensional assessment rubrics.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setScheduleModalOpen(true)}>
            <Plus size={16} /> Schedule Candidate Interview
          </button>
        </div>
      </div>

      {/* Interviews List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: '90px', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No interviews scheduled"
          description="Schedule technical or behavioral video evaluations with shortlisted candidates."
          actionLabel="Schedule First Interview"
          onAction={() => setScheduleModalOpen(true)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {interviews.map(intv => {
            const student = intv.student || {};
            const userObj = student.user || {};
            const opp = intv.opportunity || {};
            const isCompleted = intv.status === 'COMPLETED';

            return (
              <div 
                key={intv._id} 
                className="card" 
                style={{ 
                  padding: 'var(--space-5)', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  flexWrap: 'wrap', 
                  gap: 'var(--space-4)' 
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>{opp.title || 'Role'}</span>
                    <strong style={{ fontSize: 'var(--text-md)' }}>{intv.roundName}</strong>
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)', color: 'var(--color-text)' }}>
                    Candidate: <strong>{userObj.name || candidateEmail || 'Candidate'}</strong> ({userObj.email || intv.candidateEmail})
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
                    <span>Panel: {intv.interviewerName}</span>
                    <span>·</span>
                    <span>Date: {new Date(intv.scheduledAt).toLocaleString()} ({intv.durationMinutes} mins)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  {intv.meetingLink && (
                    <a 
                      href={intv.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '0.3rem' }}
                    >
                      <Video size={14} /> Join Meeting <ExternalLink size={12} />
                    </a>
                  )}

                  <button
                    className="btn btn-primary btn-sm"
                    style={{ gap: '0.3rem' }}
                    onClick={() => {
                      setActiveInterview(intv);
                      if (intv.evaluation) {
                        setRubric(intv.evaluation);
                      }
                      setEvalModalOpen(true);
                    }}
                  >
                    <Star size={14} /> {isCompleted ? 'View Rubric' : 'Evaluate Rubric'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Interview Modal */}
      {scheduleModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setScheduleModalOpen(false)}
          title="Schedule Candidate Interview"
        >
          <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label className="form-label">Select Opportunity</label>
              <select className="form-control" value={selectedOpp} onChange={e => setSelectedOpp(e.target.value)} required>
                {opportunities.map(opp => (
                  <option key={opp._id} value={opp._id}>{opp.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Candidate Registered Email</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="student@example.com" 
                value={candidateEmail} 
                onChange={e => setCandidateEmail(e.target.value)} 
                required 
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div>
                <label className="form-label">Round Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={roundName} 
                  onChange={e => setRoundName(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="form-label">Interviewer / Panel Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={interviewerName} 
                  onChange={e => setInterviewerName(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 'var(--space-3)' }}>
              <div>
                <label className="form-label">Scheduled Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="form-control" 
                  value={scheduledAt} 
                  onChange={e => setScheduledAt(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="form-label">Duration (Minutes)</label>
                <input 
                  type="number" 
                  min="15" 
                  max="180" 
                  className="form-control" 
                  value={durationMinutes} 
                  onChange={e => setDurationMinutes(e.target.value)} 
                />
              </div>
            </div>
            <div>
              <label className="form-label">Video Meeting Link</label>
              <input 
                type="url" 
                className="form-control" 
                value={meetingLink} 
                onChange={e => setMeetingLink(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="form-label">Instructions for Candidate</label>
              <textarea 
                className="form-control" 
                rows={2} 
                placeholder="e.g. Please join from a quiet workspace with working webcam and audio..."
                value={instructions} 
                onChange={e => setInstructions(e.target.value)} 
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setScheduleModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={scheduling}>
                {scheduling ? 'Scheduling...' : 'Confirm Schedule'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Rubric Evaluation Modal */}
      {evalModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setEvalModalOpen(false)}
          title={`Interviewer Evaluation Rubric: ${activeInterview?.roundName}`}
        >
          <form onSubmit={handleSaveEvaluation} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
              <div>
                <label className="form-label">Technical Competence (1-10)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  className="form-control" 
                  value={rubric.technicalCompetence} 
                  onChange={e => setRubric({ ...rubric, technicalCompetence: Number(e.target.value) })} 
                />
              </div>
              <div>
                <label className="form-label">Problem Solving & DSA (1-10)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  className="form-control" 
                  value={rubric.problemSolving} 
                  onChange={e => setRubric({ ...rubric, problemSolving: Number(e.target.value) })} 
                />
              </div>
              <div>
                <label className="form-label">Communication & Articulation (1-10)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  className="form-control" 
                  value={rubric.communication} 
                  onChange={e => setRubric({ ...rubric, communication: Number(e.target.value) })} 
                />
              </div>
              <div>
                <label className="form-label">Culture & Alignment (1-10)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  className="form-control" 
                  value={rubric.cultureFit} 
                  onChange={e => setRubric({ ...rubric, cultureFit: Number(e.target.value) })} 
                />
              </div>
            </div>

            <div>
              <label className="form-label">Recommendation Verdict</label>
              <select 
                className="form-control" 
                value={rubric.recommendation} 
                onChange={e => setRubric({ ...rubric, recommendation: e.target.value })}
              >
                <option value="STRONG_HIRE">Strong Hire</option>
                <option value="HIRE">Hire</option>
                <option value="LEAN_HIRE">Lean Hire</option>
                <option value="HOLD">On Hold</option>
                <option value="REJECT">Reject</option>
              </select>
            </div>

            <div>
              <label className="form-label">Detailed Interviewer Evaluation Notes</label>
              <textarea 
                className="form-control" 
                rows={4} 
                placeholder="Specific strengths, weaknesses, algorithm design choices, code quality observations..."
                value={rubric.feedbackNotes} 
                onChange={e => setRubric({ ...rubric, feedbackNotes: e.target.value })} 
                required 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setEvalModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={savingRubric}>
                {savingRubric ? 'Saving...' : 'Submit Evaluation'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
