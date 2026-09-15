import React from 'react';
import { Check, Clock, Lock } from 'lucide-react';

export const Timeline = ({ rounds = [], currentRoundIndex = 0, applicationStatus = 'APPLIED' }) => {
  // Build pipeline stages: Submitted -> Shortlisted -> Rounds ... -> Selected
  const stages = [
    { title: 'Application Submitted', description: 'Snapshot recorded & verified' },
    { title: 'Top-N Shortlist', description: 'Algorithm evaluation' },
    ...rounds.map((r) => ({
      title: r.name,
      description: `${r.type.replace('_', ' ')} (${r.passingScore}% cutoff)`,
      roundOrder: r.roundOrder,
    })),
    { title: 'Final Placement Selection', description: 'Offer release' },
  ];

  const getStageState = (idx) => {
    if (applicationStatus === 'REJECTED') {
      if (idx <= currentRoundIndex + 1) return 'failed';
      return 'locked';
    }
    if (applicationStatus === 'SELECTED' || applicationStatus === 'OFFER_RELEASED') {
      return 'completed';
    }

    // Dynamic state determination
    if (idx === 0) return 'completed'; // Application submitted is always complete
    if (idx === 1) {
      if (applicationStatus === 'APPLIED') return 'current';
      return 'completed';
    }

    const roundStageIdx = idx - 2; // Offset for stages 0 and 1
    if (roundStageIdx < currentRoundIndex) return 'completed';
    if (roundStageIdx === currentRoundIndex) return 'current';
    return 'locked';
  };

  return (
    <div style={styles.container}>
      <div style={styles.timelineList}>
        {stages.map((stage, idx) => {
          const state = getStageState(idx);
          const isLast = idx === stages.length - 1;

          return (
            <div key={stage.title} style={styles.stageItem}>
              <div style={styles.nodeColumn}>
                <div
                  style={{
                    ...styles.nodeCircle,
                    ...(state === 'completed' ? styles.nodeCompleted : {}),
                    ...(state === 'current' ? styles.nodeCurrent : {}),
                    ...(state === 'failed' ? styles.nodeFailed : {}),
                    ...(state === 'locked' ? styles.nodeLocked : {}),
                  }}
                >
                  {state === 'completed' && <Check size={14} color="#FFFFFF" />}
                  {state === 'current' && <Clock size={14} color="#FFFFFF" />}
                  {state === 'failed' && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>✕</span>}
                  {state === 'locked' && <Lock size={12} color="#90AB8B" />}
                </div>
                {!isLast && (
                  <div
                    style={{
                      ...styles.nodeConnector,
                      backgroundColor: state === 'completed' ? '#5A7863' : '#D6E4C6',
                    }}
                  />
                )}
              </div>

              <div style={styles.contentColumn}>
                <div style={styles.titleRow}>
                  <span
                    style={{
                      ...styles.stageTitle,
                      color: state === 'current' ? '#5A7863' : state === 'locked' ? '#718290' : '#26333D',
                      fontWeight: state === 'current' ? '700' : '600',
                    }}
                  >
                    {stage.title}
                  </span>
                  {state === 'current' && <span className="badge badge-sage">Current Stage</span>}
                  {state === 'completed' && <span className="badge badge-success">Completed</span>}
                </div>
                <p style={styles.stageDesc}>{stage.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '16px 0',
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column',
  },
  stageItem: {
    display: 'flex',
    gap: '16px',
  },
  nodeColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  nodeCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    transition: 'all 0.2s',
  },
  nodeCompleted: {
    backgroundColor: '#5A7863',
  },
  nodeCurrent: {
    backgroundColor: '#3B4953',
    boxShadow: '0 0 0 4px rgba(90, 120, 99, 0.25)',
  },
  nodeFailed: {
    backgroundColor: '#DC2626',
  },
  nodeLocked: {
    backgroundColor: '#EBF4DD',
    border: '2px solid #D6E4C6',
  },
  nodeConnector: {
    width: '2px',
    flex: 1,
    minHeight: '28px',
    margin: '4px 0',
  },
  contentColumn: {
    paddingBottom: '24px',
    flex: 1,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  stageTitle: {
    fontSize: '0.94rem',
  },
  stageDesc: {
    fontSize: '0.82rem',
    color: '#718290',
    marginTop: '2px',
  },
};

export default Timeline;
