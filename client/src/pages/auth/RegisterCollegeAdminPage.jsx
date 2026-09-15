import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { apiRequest } from '../../services/api.js';
import { School, Mail, Lock, User, Phone, Award, ShieldCheck, ArrowRight, FileText } from 'lucide-react';

export const RegisterCollegeAdminPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    collegeName: '',
    designation: 'Head of Training & Placement Cell',
    phone: '',
    accreditationId: '',
    documentUrl: '',
    sheerIdCode: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const { setAuthUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return showError('Passwords do not match.');
    }

    if (formData.password.length < 6) {
      return showError('Password must be at least 6 characters long.');
    }

    try {
      setSubmitting(true);
      const res = await apiRequest('/auth/register/college-admin', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (res.token && res.user) {
        localStorage.setItem('smart_place_token', res.token);
        localStorage.setItem('smart_place_user', JSON.stringify(res.user));
        if (setAuthUser) setAuthUser(res.user);
      }

      showSuccess('College Placement Cell registered successfully! Accessing portal...');
      navigate('/admin/dashboard');
    } catch (err) {
      showError(err.message || 'Registration failed. Please verify institutional details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div className="container" style={styles.container}>
        <div className="card" style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.badge}>Institutional Portal</div>
            <h1 style={styles.title}>Register Placement Cell</h1>
            <p style={styles.subtitle}>
              Set up your official university placement administration portal for campus drives and student verifications.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* College / Institution Details */}
            <div style={styles.sectionTitle}>
              <School size={18} color="#5A7863" /> Institution Details
            </div>

            <div className="form-group">
              <label className="form-label">College / University Name *</label>
              <input
                type="text"
                name="collegeName"
                required
                className="input"
                placeholder="e.g. Delhi Technological University / IIT Bombay"
                value={formData.collegeName}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Accreditation / AICTE / UGC ID</label>
                <input
                  type="text"
                  name="accreditationId"
                  className="input"
                  placeholder="e.g. AICTE-1-123456789"
                  value={formData.accreditationId}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official College Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="input"
                  placeholder="tpo@university.ac.in"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Placement Officer Details */}
            <div style={styles.sectionTitle}>
              <User size={18} color="#5A7863" /> Placement Officer Information
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="input"
                  placeholder="Dr. Rajesh Sharma"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Designation *</label>
                <input
                  type="text"
                  name="designation"
                  required
                  className="input"
                  placeholder="Head of Training & Placement Cell"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="input"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Institutional Verification Proofs */}
            <div style={styles.sectionTitle}>
              <ShieldCheck size={18} color="#5A7863" /> Institutional Verification Proof
            </div>

            <div className="form-group">
              <label className="form-label">Authorization / Affiliation Document URL or Reference</label>
              <input
                type="text"
                name="documentUrl"
                className="input"
                placeholder="https://drive.google.com/... or Institutional Portal Verification Link"
                value={formData.documentUrl}
                onChange={handleChange}
              />
              <span style={{ fontSize: '0.78rem', color: '#718290', marginTop: '4px' }}>
                Upload official TPO appointment letter, affiliation certificate, or staff ID.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">SheerID Institutional Verification Code (Optional)</label>
              <div className="input-icon-wrapper">
                <Award size={16} className="input-icon" />
                <input
                  type="text"
                  name="sheerIdCode"
                  className="input"
                  placeholder="e.g. SHEER-COLLEGE-VERIFIED-991"
                  value={formData.sheerIdCode}
                  onChange={handleChange}
                />
              </div>
              <span style={{ fontSize: '0.78rem', color: '#5A7863', marginTop: '4px', fontWeight: 500 }}>
                Instant verification is automatically activated if verified through SheerID.
              </span>
            </div>

            {/* Password */}
            <div style={styles.sectionTitle}>
              <Lock size={18} color="#5A7863" /> Account Security
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Create Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="input"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  className="input"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '16px' }}
              disabled={submitting}
            >
              {submitting ? 'Registering Placement Cell...' : 'Register College Placement Cell'}{' '}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Footer */}
          <div style={styles.footer}>
            <p style={{ fontSize: '0.88rem', color: '#718290' }}>
              Already registered? <Link to="/login" style={{ fontWeight: 600 }}>Sign In</Link>
            </p>
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
    padding: '40px 16px',
  },
  container: {
    maxWidth: '680px',
  },
  card: {
    padding: '36px 32px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  badge: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#5A7863',
    backgroundColor: '#EFF5F0',
    padding: '4px 12px',
    borderRadius: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '8px',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#26333D',
    margin: '0 0 6px 0',
  },
  subtitle: {
    fontSize: '0.92rem',
    color: '#4A5B67',
    margin: 0,
    lineHeight: 1.5,
  },
  sectionTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#3B4953',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '18px 0 12px 0',
    paddingBottom: '6px',
    borderBottom: '1px solid #D6E4C6',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #E8EFE0',
  },
};

export default RegisterCollegeAdminPage;
