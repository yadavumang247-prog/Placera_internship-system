import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';
import { Clock, AlertCircle, CheckCircle, Flag, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function TakeAssessmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionIndex: selectedOptionIndex }
  const [flagged, setFlagged] = useState({}); // { questionIndex: boolean }
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [result, setResult] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => {
    fetchAssessment();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      const res = await api.student.getAssessmentById(id);
      const data = res.assessment;
      setAssessment(data);

      const totalSec = (data.durationMinutes || 30) * 60;
      setTimeLeft(totalSec);

      // Start countdown
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error('Failed to load assessment');
      navigate('/student/assessments');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSubmit = () => {
    toast.warning('Time expired! Submitting your answers automatically.');
    submitAssessment();
  };

  const submitAssessment = async () => {
    try {
      setSubmitting(true);
      if (timerRef.current) clearInterval(timerRef.current);

      const formattedAnswers = Object.entries(answers).map(([qIdx, optIdx]) => ({
        questionIndex: Number(qIdx),
        selectedOption: optIdx
      }));

      const res = await api.student.submitAssessment(id, { answers: formattedAnswers });
      setResult(res.result || { score: res.score, passed: res.passed });
      setConfirmModal(false);
      toast.success('Assessment evaluated successfully!');
    } catch (err) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="skeleton" style={{ width: '100%', height: '400px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  // Result screen after submission
  if (result) {
    return (
      <div className="card" style={{ maxWidth: '640px', margin: 'var(--space-8) auto', padding: 'var(--space-8)', textAlign: 'center' }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: 'var(--radius-full)', 
          background: result.passed ? 'var(--color-primary-light)' : 'rgba(239, 68, 68, 0.1)', 
          color: result.passed ? 'var(--color-primary)' : 'var(--color-error)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto var(--space-4) auto' 
        }}>
          {result.passed ? <CheckCircle size={36} /> : <AlertCircle size={36} />}
        </div>

        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: '0 0 var(--space-2) 0' }}>
          {result.passed ? 'Assessment Cleared!' : 'Assessment Completed'}
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: '0 0 var(--space-6) 0' }}>
          Your responses have been instantly scored and stored in the evaluation pipeline.
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: 'var(--space-4)', 
          background: 'var(--color-surface)', 
          padding: 'var(--space-4)', 
          borderRadius: 'var(--radius-md)', 
          marginBottom: 'var(--space-6)' 
        }}>
          <div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Your Score</span>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
              {Math.round(result.score || 0)}%
            </div>
          </div>
          <div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Status</span>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginTop: 'var(--space-1)', color: result.passed ? 'var(--color-success)' : 'var(--color-error)' }}>
              {result.passed ? 'PASSED' : 'DID NOT CLEAR'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)' }}>
          <Link to="/student/assessments" className="btn btn-primary">
            Return to Assessments
          </Link>
          <Link to="/student/applications" className="btn btn-secondary">
            View Applications
          </Link>
        </div>
      </div>
    );
  }

  const questions = assessment?.questions || [];
  const currentQ = questions[currentIndex] || {};
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft < 300; // < 5 mins

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Runner Bar */}
      <div className="card" style={{ padding: 'var(--space-4) var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>{assessment.title}</h2>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            padding: '0.4rem 0.8rem', 
            borderRadius: 'var(--radius-md)', 
            background: isUrgent ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-surface)',
            color: isUrgent ? 'var(--color-error)' : 'var(--color-text)',
            fontWeight: 600,
            fontSize: 'var(--text-md)'
          }}>
            <Clock size={18} />
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>

          <button 
            className="btn btn-primary btn-sm" 
            onClick={() => setConfirmModal(true)}
            disabled={submitting}
          >
            Finish & Submit
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 'var(--space-4)' }}>
        {/* Question Pane */}
        <div className="card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="badge badge-neutral" style={{ fontSize: 'var(--text-xs)' }}>
              Category: {currentQ.category || 'General'} · Marks: {currentQ.marks || 1}
            </span>
            <button
              type="button"
              onClick={() => setFlagged({ ...flagged, [currentIndex]: !flagged[currentIndex] })}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: 'var(--text-xs)',
                color: flagged[currentIndex] ? 'var(--color-accent)' : 'var(--color-text-muted)'
              }}
            >
              <Flag size={14} fill={flagged[currentIndex] ? 'currentColor' : 'none'} />
              {flagged[currentIndex] ? 'Marked for Review' : 'Mark for Review'}
            </button>
          </div>

          <p style={{ fontSize: 'var(--text-lg)', fontWeight: 500, lineHeight: 1.6, margin: 0 }}>
            {currentQ.text}
          </p>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            {(currentQ.options || []).map((opt, optIdx) => {
              const isSelected = answers[currentIndex] === optIdx;
              return (
                <div
                  key={optIdx}
                  onClick={() => setAnswers({ ...answers, [currentIndex]: optIdx })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: isSelected ? 'var(--color-primary-light)' : 'var(--color-surface)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: 'var(--radius-full)',
                    border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: isSelected ? 'var(--color-primary)' : 'transparent',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {isSelected ? <Check size={14} /> : String.fromCharCode(65 + optIdx)}
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: isSelected ? 600 : 400 }}>
                    {opt.text || opt}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Nav Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
            <button
              className="btn btn-secondary btn-sm"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            {answers[currentIndex] !== undefined && (
              <button
                className="btn btn-sm"
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}
                onClick={() => {
                  const copy = { ...answers };
                  delete copy[currentIndex];
                  setAnswers(copy);
                }}
              >
                Clear Choice
              </button>
            )}

            <button
              className="btn btn-secondary btn-sm"
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div className="card" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, margin: 0 }}>Question Palette</h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-2)' }}>
            {questions.map((_, qIdx) => {
              const isAnswered = answers[qIdx] !== undefined;
              const isFlagged = flagged[qIdx];
              const isCurrent = currentIndex === qIdx;

              let bg = 'var(--color-surface)';
              let border = '1px solid var(--color-border)';
              let color = 'var(--color-text)';

              if (isCurrent) {
                border = '2px solid var(--color-primary)';
              }

              if (isAnswered) {
                bg = 'var(--color-primary)';
                color = '#ffffff';
              } else if (isFlagged) {
                bg = 'var(--color-accent)';
                color = '#ffffff';
              }

              return (
                <button
                  key={qIdx}
                  onClick={() => setCurrentIndex(qIdx)}
                  style={{
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    background: bg,
                    border,
                    color,
                    fontWeight: 600,
                    fontSize: 'var(--text-xs)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {qIdx + 1}
                </button>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--color-primary)' }} /> Answered ({Object.keys(answers).length})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--color-accent)' }} /> Flagged ({Object.keys(flagged).filter(k => flagged[k]).length})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }} /> Unanswered ({questions.length - Object.keys(answers).length})
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Submission Modal */}
      {confirmModal && (
        <Modal
          isOpen={true}
          onClose={() => setConfirmModal(false)}
          title="Submit Assessment?"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
              You have answered <strong>{Object.keys(answers).length}</strong> of <strong>{questions.length}</strong> questions.
              {Object.keys(answers).length < questions.length && (
                <span style={{ display: 'block', color: 'var(--color-error)', marginTop: 'var(--space-2)' }}>
                  You still have {questions.length - Object.keys(answers).length} unanswered question(s).
                </span>
              )}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <button className="btn btn-secondary" onClick={() => setConfirmModal(false)}>Continue Test</button>
              <button className="btn btn-primary" onClick={submitAssessment} disabled={submitting}>
                {submitting ? 'Evaluating...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
