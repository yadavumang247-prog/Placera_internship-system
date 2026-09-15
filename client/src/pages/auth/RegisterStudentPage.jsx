import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { GraduationCap, ArrowRight } from 'lucide-react';

export const RegisterStudentPage = () => {
  const navigate = useNavigate();
  const { registerStudent } = useAuth();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    branch: 'Computer Science & Engineering',
    degree: 'B.Tech',
    graduationYear: 2026,
    cgpa: 8.0,
    college: 'National Institute of Technology',
    phone: '',
    skills: 'React, JavaScript, Node.js, SQL',
  });
  const [submitting, setSubmitting] = useState(false);

  const branches = [
    'Computer Science & Engineering',
    'Information Technology',
    'Data Science & Artificial Intelligence',
    'Electronics & Communication Engineering',
    'Electrical & Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        graduationYear: Number(formData.graduationYear),
        cgpa: Number(formData.cgpa),
      };

      await registerStudent(payload);
      showSuccess('Account successfully created! Welcome to your Student Dashboard.');
      navigate('/student/dashboard');
    } catch (err) {
      showError(err.message || 'Registration failed.');
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
              <GraduationCap size={26} color="#5A7863" />
            </div>
            <h1 style={{ fontSize: '1.8rem', color: '#3B4953' }}>Student Registration</h1>
            <p style={{ fontSize: '0.9rem', color: '#718290', marginTop: '4px' }}>
              Create your verified profile to discover top internships and placement opportunities on Placera.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Full Legal Name *</label>
              <input
                type="text"
                required
                className="input"
                placeholder="e.g. Aditya Sharma"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="grid grid-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">College Email *</label>
                <input
                  type="email"
                  required
                  className="input"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password (min 6 chars) *</label>
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

            <div className="grid grid-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">College / University Name *</label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="e.g. Delhi Technological University"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">University Roll / Enrollment No. *</label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="e.g. 2022/CS/104"
                  value={formData.rollNumber || ''}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Degree *</label>
                <select
                  className="select"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                >
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="MCA">MCA</option>
                  <option value="B.Sc">B.Sc / M.Sc</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Engineering Branch *</label>
                <select
                  className="select"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                >
                  {branches.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Graduation Year *</label>
                <select
                  className="select"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                >
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Current Cumulative CGPA (out of 10) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  className="input"
                  placeholder="8.50"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Key Technical Skills (comma separated) *</label>
              <input
                type="text"
                required
                className="input"
                placeholder="React, Node.js, Python, SQL, Docker, Algorithms"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              />
              <span style={{ fontSize: '0.76rem', color: '#718290', marginTop: '4px', display: 'block' }}>
                Used for instant algorithmic match scores against recruiter listings.
              </span>
            </div>

            {/* Institutional Verification Proofs */}
            <div style={{ margin: '16px 0 10px 0', borderTop: '1px solid #D6E4C6', paddingTop: '14px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#3B4953' }}>
                🛡️ Academic Verification Proof
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Student ID / Marksheet Proof Document URL</label>
              <input
                type="text"
                className="input"
                placeholder="https://drive.google.com/... or Institutional Portal Link"
                value={formData.documentUrl || ''}
                onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
              />
              <span style={{ fontSize: '0.76rem', color: '#718290', marginTop: '4px', display: 'block' }}>
                Upload valid College ID card, semester marksheet, or bonafide certificate.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">SheerID Student Verification ID (Optional)</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. SHEER-STUDENT-88214"
                value={formData.sheerIdCode || ''}
                onChange={(e) => setFormData({ ...formData, sheerIdCode: e.target.value })}
              />
              <span style={{ fontSize: '0.76rem', color: '#5A7863', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                Instant auto-verification is applied if verified with SheerID.
              </span>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting} style={{ marginTop: '12px' }}>
              {submitting ? 'Creating Profile...' : 'Complete Registration'} <ArrowRight size={18} />
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

export default RegisterStudentPage;
