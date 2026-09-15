import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.container}>
        <div style={styles.topSection}>
          <div style={styles.brandColumn}>
            <div style={styles.logoRow}>
              <div style={styles.logoIcon}>P</div>
              <span style={styles.brandTitle}>PLACERA</span>
            </div>
            <p style={{ ...styles.description, color: '#90AB8B', fontWeight: '600', marginBottom: '8px' }}>
              Smart Placement. Better Opportunities.
            </p>
            <p style={styles.description}>
              An algorithm-driven platform connecting students, recruiters, and placement cells through smarter opportunity matching and recruitment.
            </p>
          </div>

          <div style={styles.linksGrid}>
            <div>
              <h4 style={styles.columnTitle}>Navigation</h4>
              <ul style={styles.linkList}>
                <li><Link to="/opportunities" style={styles.link}>For Students</Link></li>
                <li><Link to="/register/recruiter" style={styles.link}>For Recruiters</Link></li>
                <li><Link to="/login" style={styles.link}>Placement Cell</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={styles.columnTitle}>Company</h4>
              <ul style={styles.linkList}>
                <li><Link to="/about" style={styles.link}>About</Link></li>
                <li><Link to="/how-it-works" style={styles.link}>How It Works</Link></li>
                <li><Link to="/contact" style={styles.link}>Help & Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={styles.columnTitle}>Legal</h4>
              <ul style={styles.linkList}>
                <li><Link to="/about" style={styles.link}>Privacy</Link></li>
                <li><Link to="/about" style={styles.link}>Terms</Link></li>
                <li><Link to="/contact" style={styles.link}>Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div style={styles.bottomSection}>
          <p style={styles.copyright}>
            &copy; {new Date().getFullYear()} Placera. All rights reserved.
          </p>
          <div style={styles.systemTag}>
            <span>Placera — Smart Placement. Better Opportunities.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#3B4953',
    color: '#EBF4DD',
    padding: '60px 0 30px',
    marginTop: 'auto',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  topSection: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '60px',
    flexWrap: 'wrap',
  },
  brandColumn: {
    maxWidth: '420px',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    backgroundColor: '#5A7863',
    color: '#EBF4DD',
    fontWeight: '800',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
  },
  brandTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '1.6rem',
    letterSpacing: '0.04em',
    color: '#FFFFFF',
  },
  description: {
    color: '#90AB8B',
    fontSize: '0.88rem',
    lineHeight: 1.6,
  },
  linksGrid: {
    display: 'flex',
    gap: '48px',
    flexWrap: 'wrap',
  },
  columnTitle: {
    color: '#FFFFFF',
    fontSize: '0.9rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '14px',
  },
  linkList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  link: {
    color: '#EBF4DD',
    fontSize: '0.88rem',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  bottomSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(144, 171, 139, 0.25)',
    paddingTop: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  copyright: {
    fontSize: '0.82rem',
    color: '#90AB8B',
  },
  systemTag: {
    display: 'flex',
    gap: '8px',
    fontSize: '0.78rem',
    color: '#90AB8B',
  },
};

export default Footer;
