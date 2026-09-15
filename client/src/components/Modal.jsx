import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, subtitle, children, footer, maxWidth = '650px' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={{ ...styles.modal, maxWidth }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div style={styles.header}>
          <div>
            <h3 style={styles.title}>{title}</h3>
            {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={styles.closeBtn} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div style={styles.body}>{children}</div>

        {footer && <div style={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(38, 51, 61, 0.55)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: '14px',
    boxShadow: '0 20px 40px rgba(59, 73, 83, 0.2)',
    border: '1px solid #D6E4C6',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px 24px',
    borderBottom: '1px solid #EBF4DD',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#3B4953',
  },
  subtitle: {
    fontSize: '0.84rem',
    color: '#718290',
    marginTop: '2px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#718290',
    padding: '4px',
    borderRadius: '4px',
  },
  body: {
    padding: '24px',
    overflowY: 'auto',
    flex: 1,
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid #EBF4DD',
    backgroundColor: '#F6FAEE',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
};

export default Modal;
