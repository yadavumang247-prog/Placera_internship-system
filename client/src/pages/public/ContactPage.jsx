import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

export const ContactPage = () => {
  const { showSuccess } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showSuccess('Your inquiry has been submitted to the placement administration.');
  };

  return (
    <div style={{ backgroundColor: '#EBF4DD', minHeight: 'calc(100vh - 70px)', padding: '60px 0' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="section-heading" style={{ fontSize: '2.4rem' }}>Placement Cell & Platform Support</h1>
          <p style={{ color: '#4A5B67', fontSize: '1.05rem', marginTop: '8px' }}>
            Have questions regarding campus recruitment drives, company onboarding, or algorithm verification?
          </p>
        </div>

        <div className="grid grid-2" style={{ gap: '32px' }}>
          {/* Contact Details */}
          <div className="card">
            <h2 style={{ fontSize: '1.3rem', color: '#3B4953', marginBottom: '20px' }}>Office of Career & Placements</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={styles.iconBox}><MapPin size={20} color="#5A7863" /></div>
                <div>
                  <strong style={{ display: 'block', color: '#3B4953' }}>Campus Address</strong>
                  <p style={{ fontSize: '0.88rem', color: '#718290' }}>
                    Placement & Training Cell, Technology Tower 4, National Institute of Technology Campus, Bangalore 560001
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={styles.iconBox}><Mail size={20} color="#5A7863" /></div>
                <div>
                  <strong style={{ display: 'block', color: '#3B4953' }}>Email Inquiries</strong>
                  <p style={{ fontSize: '0.88rem', color: '#718290' }}>placements@placera.edu</p>
                  <p style={{ fontSize: '0.88rem', color: '#718290' }}>support@placera.org</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={styles.iconBox}><Phone size={20} color="#5A7863" /></div>
                <div>
                  <strong style={{ display: 'block', color: '#3B4953' }}>Helpline Phone</strong>
                  <p style={{ fontSize: '0.88rem', color: '#718290' }}>+91 (080) 2345-6789 (Mon-Fri, 9am - 5pm)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card">
            <h2 style={{ fontSize: '1.3rem', color: '#3B4953', marginBottom: '20px' }}>Send a Message</h2>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <CheckCircle2 size={48} color="#15803D" style={{ marginBottom: '14px' }} />
                <h3 style={{ color: '#3B4953' }}>Message Dispatched</h3>
                <p style={{ fontSize: '0.88rem', color: '#718290', marginTop: '6px' }}>
                  Our career cell coordinator will review your submission and reply shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Campus drive / recruiter verification inquiry"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    required
                    className="textarea"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Detail your request..."
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Send size={16} /> Submit Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  iconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: '#F6FAEE',
    border: '1px solid #D6E4C6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
};

export default ContactPage;
