import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Building2, CheckCircle, XCircle, ExternalLink, ShieldCheck, Mail, Globe } from 'lucide-react';

export default function RecruiterVerificationPage() {
  const { toast } = useToast();
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getRecruiters();
      setRecruiters(res.recruiters || []);
    } catch (err) {
      toast.error('Failed to load recruiters');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (recruiterId, isVerified) => {
    try {
      setActionLoading(true);
      await api.admin.verifyRecruiter(recruiterId, { isVerified });
      toast.success(isVerified ? 'Recruiter accredited successfully!' : 'Recruiter authorization revoked');
      setRecruiters(recruiters.map(r => r._id === recruiterId ? { ...r, isVerified } : r));
    } catch (err) {
      toast.error(err.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = recruiters.filter(r => {
    if (filter === 'ALL') return true;
    return filter === 'VERIFIED' ? r.isVerified : !r.isVerified;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: 0 }}>Corporate Recruiter Accreditation</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-1) 0 0 0', fontSize: 'var(--text-sm)' }}>
          Authorize verified industry partners to create opportunities and participate in campus placement seasons.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
          {['ALL', 'PENDING', 'VERIFIED'].map(f => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Organization</th>
                <th>Recruiter Name & Title</th>
                <th>Corporate Email</th>
                <th>Industry & Website</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                    Loading recruiter directory...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                    No recruiters found.
                  </td>
                </tr>
              ) : (
                filtered.map(r => {
                  const userObj = r.user || {};
                  const org = r.organization || {};
                  return (
                    <tr key={r._id}>
                      <td>
                        <strong>{org.name || 'Enterprise Partner'}</strong>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                          {org.location || 'India'}
                        </div>
                      </td>
                      <td>
                        <strong>{userObj.name}</strong>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                          {r.designation || 'Talent Acquisition'}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 'var(--text-sm)' }}>{userObj.email}</span>
                      </td>
                      <td>
                        <div style={{ fontSize: 'var(--text-xs)' }}>
                          {org.industry || 'Technology'}
                        </div>
                        {org.website && (
                          <a href={org.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Globe size={11} /> {org.website.replace(/^https?:\/\//, '')}
                          </a>
                        )}
                      </td>
                      <td>
                        {r.isVerified ? (
                          <span className="badge badge-success" style={{ fontSize: '0.75rem', gap: '0.3rem' }}>
                            <CheckCircle size={12} /> Accredited
                          </span>
                        ) : (
                          <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
                            Pending Review
                          </span>
                        )}
                      </td>
                      <td>
                        {r.isVerified ? (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)' }}
                            disabled={actionLoading}
                            onClick={() => handleVerify(r._id, false)}
                          >
                            Revoke
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: 'var(--text-xs)' }}
                            disabled={actionLoading}
                            onClick={() => handleVerify(r._id, true)}
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
