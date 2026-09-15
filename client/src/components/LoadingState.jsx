import React from 'react';

export const LoadingState = ({ message = 'Loading algorithmic data...' }) => {
  return (
    <div style={styles.container}>
      <div style={styles.spinner} />
      <span style={styles.text}>{message}</span>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 24px',
    gap: '16px',
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '3px solid #D6E4C6',
    borderTop: '3px solid #5A7863',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  text: {
    fontSize: '0.9rem',
    color: '#5A7863',
    fontWeight: '500',
  },
};

export default LoadingState;
