import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No Records Found',
  description = 'There are currently no items to display.',
  actionText,
  onAction,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.iconCircle}>
        <Icon size={32} color="#5A7863" />
      </div>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.description}>{description}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>
          {actionText}
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center',
    backgroundColor: '#F6FAEE',
    border: '1px dashed #D6E4C6',
    borderRadius: '14px',
    margin: '16px 0',
  },
  iconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    border: '1px solid #D6E4C6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    boxShadow: 'var(--shadow-sm)',
  },
  title: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#3B4953',
    marginBottom: '6px',
  },
  description: {
    fontSize: '0.88rem',
    color: '#718290',
    maxWidth: '400px',
    lineHeight: 1.5,
  },
};

export default EmptyState;
