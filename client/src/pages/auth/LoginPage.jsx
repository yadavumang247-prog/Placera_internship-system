import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Lock, Mail, ArrowRight, UserCheck, ShieldCheck, Briefcase } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await login(email, password);
      showSuccess(`Welcome back! Logged in as ${res.user.role}.`);

      if (res.user.role === 'STUDENT') navigate('/student/dashboard');
      else if (res.user.role === 'RECRUITER') navigate('/recruiter/dashboard');
      else if (res.user.role === 'ADMIN' || res.user.role === 'COLLEGE_ADMIN') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err) {
      showError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div className="container" style={styles.container}>
        <div className="card" style={styles.authCard}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.brandBadge}>Placera Sign In</div>
            <h1 style={styles.title}>Account Sign In</h1>
            <p style={styles.subtitle}>Enter your institutional or corporate credentials to access your portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  required
                  className="input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  required
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '8px' }}
              disabled={submitting}
            >
              {submitting ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
            </button>
          </form>

          {/* Footer Registration Links */}
          <div style={styles.footerLinks}>
            <p style={{ fontSize: '0.88rem', color: '#718290', marginBottom: '8px' }}>
              Don't have an account yet? Register below:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <Link to="/register/student" style={{ fontWeight: '600' }}>
                  Student Sign Up
                </Link>
                <span>•</span>
                <Link to="/register/recruiter" style={{ fontWeight: '600' }}>
                  Recruiter Sign Up
                </Link>
              </div>
              <div style={{ textAlign: 'center', borderTop: '1px solid #E8EFE0', paddingTop: '8px', marginTop: '4px' }}>
                <Link to="/register/college" style={{ fontWeight: '600', color: 'var(--color-primary)' }}>
                  🏛️ Register as College Placement Cell (TPO)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#EBF4DD',
    minHeight: 'calc(100vh - 70px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 16px',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  authCard: {
    maxWidth: '460px',
    width: '100%',
    padding: '36px 32px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  brandBadge: {
    display: 'inline-block',
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#5A7863',
    backgroundColor: '#EFF5F0',
    padding: '3px 10px',
    borderRadius: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '8px',
  },
  title: {
    fontSize: '1.8rem',
    color: '#3B4953',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: '0.88rem',
    color: '#718290',
    marginTop: '4px',
  },
  demoBox: {
    backgroundColor: '#F6FAEE',
    border: '1px solid #D6E4C6',
    borderRadius: '10px',
    padding: '12px',
    marginBottom: '20px',
  },
  demoLabel: {
    display: 'block',
    fontSize: '0.74rem',
    fontWeight: '700',
    color: '#718290',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  demoBtnGroup: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  demoBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #D6E4C6',
    borderRadius: '6px',
    padding: '5px 10px',
    fontSize: '0.76rem',
    fontWeight: '600',
    color: '#3B4953',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    pointerEvents: 'none',
  },
  footerLinks: {
    textAlign: 'center',
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid #EBF4DD',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

export default LoginPage;
