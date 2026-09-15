import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Building2, ArrowRight } from 'lucide-react';

export const RegisterRecruiterPage = () => {
  const navigate = useNavigate();
  const { registerRecruiter } = useAuth();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    designation: 'University Talent Partner',
    organizationName: '',
    industry: 'Software & Cloud Services',
    companySize: '500-1000 employees',
    location: 'Bangalore, India',
    website: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await registerRecruiter(formData);
      showSuccess('Recruiter account created! Welcome to your Recruiter Dashboard.');
      navigate('/recruiter/dashboard');
    } catch (err) {
      showError(err.message || 'Recruiter registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#EBF4DD', minHeight: 'calc(100vh - 70px)', padding: '40px 16px' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        <div className="card" style={{ padding: '36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#EFF5F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Building2 size={26} color="#5A7863" />
            </div>
            <h1 style={{ fontSize: '1.8rem', color: '#3B4953' }}>Recruiter Registration</h1>
            <p style={{ fontSize: '0.9rem', color: '#718290', marginTop: '4px' }}>
              Register your organization on Placera to post opportunities and recruit verified student talent.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="grid grid-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Designation *</label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="e.g. Lead Campus Recruiter"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Official Work Email *</label>
                <input
                  type="email"
                  required
                  className="input"
                  placeholder="recruiter@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Organization / Company Name *</label>
              <input
                type="text"
                required
                className="input"
                placeholder="e.g. Apex Technologies"
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              />
            </div>

            <div className="grid grid-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Industry Domain *</label>
                <select
                  className="select"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                >
                  <option value="Software & Cloud Services">Software & Cloud Services</option>
                  <option value="FinTech & Banking">FinTech & Banking</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Semiconductors & Hardware">Semiconductors & Hardware</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Company Size</label>
                <select
                  className="select"
                  value={formData.companySize}
                  onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                >
                  <option value="50-200 employees">50-200 employees</option>
                  <option value="200-500 employees">200-500 employees</option>
                  <option value="500-1000 employees">500-1000 employees</option>
                  <option value="1000-5000 employees">1000-5000 employees</option>
                  <option value="5000+ employees">5000+ employees</option>
                </select>
              </div>
            </div>

            <div className="grid grid-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Headquarters / Location</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Bangalore, India"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company Website URL</label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://company.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
            </div>

            {/* Corporate Verification Section */}
            <div style={{ margin: '16px 0 10px 0', borderTop: '1px solid #D6E4C6', paddingTop: '14px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#3B4953' }}>
                🛡️ Corporate Verification & Legal Proof
              </span>
            </div>

            <div className="grid grid-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Company CIN / Registration No.</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. U72200KA2020PTC123456"
                  value={formData.cin || ''}
                  onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">GSTIN / Corporate Tax ID</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. 29AAAAA0000A1Z5"
                  value={formData.gstin || ''}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Corporate ID / Authorization Letter Proof URL</label>
              <input
                type="text"
                className="input"
                placeholder="https://drive.google.com/... or Corporate Verification Link"
                value={formData.documentUrl || ''}
                onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
              />
              <span style={{ fontSize: '0.76rem', color: '#718290', marginTop: '4px', display: 'block' }}>
                Official employment letter, recruiter corporate ID, or incorporation certificate.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">SheerID Business Verification Code (Optional)</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. SHEER-BIZ-CORP-44021"
                value={formData.sheerIdCode || ''}
                onChange={(e) => setFormData({ ...formData, sheerIdCode: e.target.value })}
              />
              <span style={{ fontSize: '0.76rem', color: '#5A7863', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                Automatic instant corporate verification is applied with a valid SheerID code.
              </span>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting} style={{ marginTop: '12px' }}>
              {submitting ? 'Registering Organization...' : 'Register as Recruiter'} <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #EBF4DD' }}>
            <span style={{ fontSize: '0.88rem', color: '#718290' }}>Already registered? </span>
            <Link to="/login" style={{ fontWeight: '600' }}>Sign In here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterRecruiterPage;
