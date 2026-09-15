import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';
import { CheckCircle, XCircle, Search, FileText, UserCheck, Shield, ExternalLink } from 'lucide-react';

export default function StudentVerificationPage() {
  const { toast } = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, VERIFIED
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getStudents();
      setStudents(res.students || []);
    } catch (err) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (studentId, isVerified) => {
    try {
      setActionLoading(true);
      await api.admin.verifyStudent(studentId, { isVerified });
      toast.success(isVerified ? 'Student profile verified!' : 'Student verification revoked');
      setStudents(students.map(s => s._id === studentId ? { ...s, isVerified } : s));
      if (selectedStudent && selectedStudent._id === studentId) {
        setSelectedStudent({ ...selectedStudent, isVerified });
      }
    } catch (err) {
      toast.error(err.message || 'Verification update failed');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = students.filter(s => {
    const matchesFilter = filter === 'ALL' || (filter === 'VERIFIED' ? s.isVerified : !s.isVerified);
    const term = search.toLowerCase();
    const name = (s.user?.name || '').toLowerCase();
    const roll = (s.academics?.rollNumber || '').toLowerCase();
    const dept = (s.academics?.department || '').toLowerCase();
    const matchesSearch = !term || name.includes(term) || roll.includes(term) || dept.includes(term);
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: 0 }}>Student Profile Verification</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-1) 0 0 0', fontSize: 'var(--text-sm)' }}>
          Audit student CGPA, backlogs, and resumes. Only verified students are permitted to participate in on-campus placement drives.
        </p>

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
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

          <div style={{ position: 'relative', width: '280px' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search by name, roll, or branch..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 'var(--space-8)' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Department & Degree</th>
                <th>CGPA</th>
                <th>Backlogs</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                    Loading student directory...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                    No students matching filter.
                  </td>
                </tr>
              ) : (
                filtered.map(s => {
                  const userObj = s.user || {};
                  const acad = s.academics || {};
                  return (
                    <tr key={s._id}>
                      <td>
                        <strong>{acad.rollNumber || 'N/A'}</strong>
                      </td>
                      <td>
                        <strong>{userObj.name}</strong>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                          {userObj.email}
                        </div>
                      </td>
                      <td>
                        {acad.department || 'N/A'}
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                          {acad.degree || 'B.Tech'} · Grad {acad.graduationYear || 2026}
                        </div>
                      </td>
                      <td>
                        <strong>{acad.cgpa || 'N/A'}</strong> / 10
                      </td>
                      <td>
                        <span style={{ color: acad.activeBacklogs > 0 ? 'var(--color-error)' : 'inherit', fontWeight: acad.activeBacklogs > 0 ? 600 : 400 }}>
                          {acad.activeBacklogs ?? 0} active
                        </span>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                          {acad.historyOfBacklogs ?? 0} historical
                        </div>
                      </td>
                      <td>
                        {s.isVerified ? (
                          <span className="badge badge-success" style={{ fontSize: '0.75rem', gap: '0.3rem' }}>
                            <CheckCircle size={12} /> Verified
                          </span>
                        ) : (
                          <span className="badge badge-warning" style={{ fontSize: '0.75rem', gap: '0.3rem' }}>
                            Pending
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: 'var(--text-xs)', padding: '0.2rem 0.5rem' }}
                            onClick={() => setSelectedStudent(s)}
                          >
                            Inspect
                          </button>
                          {s.isVerified ? (
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: 'var(--text-xs)', padding: '0.2rem 0.5rem', color: 'var(--color-error)' }}
                              disabled={actionLoading}
                              onClick={() => handleVerify(s._id, false)}
                            >
                              Revoke
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary btn-sm"
                              style={{ fontSize: 'var(--text-xs)', padding: '0.2rem 0.5rem' }}
                              disabled={actionLoading}
                              onClick={() => handleVerify(s._id, true)}
                            >
                              Verify
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Student Modal */}
      {selectedStudent && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedStudent(null)}
          title={`Student Academic Audit: ${selectedStudent.user?.name}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
              <div>Roll Number: <strong>{selectedStudent.academics?.rollNumber}</strong></div>
              <div>Department: <strong>{selectedStudent.academics?.department}</strong></div>
              <div>Degree: <strong>{selectedStudent.academics?.degree}</strong></div>
              <div>Graduation Year: <strong>{selectedStudent.academics?.graduationYear}</strong></div>
              <div>CGPA: <strong>{selectedStudent.academics?.cgpa} / 10</strong></div>
              <div>10th %: <strong>{selectedStudent.academics?.tenthPercentage}%</strong></div>
              <div>12th %: <strong>{selectedStudent.academics?.twelfthPercentage}%</strong></div>
              <div>Active Backlogs: <strong>{selectedStudent.academics?.activeBacklogs}</strong></div>
            </div>

            <div>
              <strong style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
                Skills ({selectedStudent.skills?.length || 0})
              </strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginTop: 'var(--space-1)' }}>
                {(selectedStudent.skills || []).map((sk, i) => (
                  <span key={i} className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                    {sk.name} ({sk.proficiency})
                  </span>
                ))}
              </div>
            </div>

            {selectedStudent.resumeUrl && (
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)' }}>
                <a
                  href={selectedStudent.resumeUrl.startsWith('http') ? selectedStudent.resumeUrl : `/api${selectedStudent.resumeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.3rem' }}
                >
                  <FileText size={14} /> Open Verified PDF Resume ↗
                </a>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedStudent(null)}>Close</button>
              {selectedStudent.isVerified ? (
                <button 
                  className="btn btn-secondary" 
                  style={{ color: 'var(--color-error)' }}
                  onClick={() => handleVerify(selectedStudent._id, false)}
                >
                  Revoke Verification
                </button>
              ) : (
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleVerify(selectedStudent._id, true)}
                >
                  Approve & Verify Profile
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
