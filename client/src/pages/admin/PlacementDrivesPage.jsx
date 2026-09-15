import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';
import { Calendar, Plus, Building2, Clock, CheckCircle } from 'lucide-react';

export default function PlacementDrivesPage() {
  const { toast } = useToast();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [academicYear, setAcademicYear] = useState('2025-26');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('ONGOING');

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getDrives();
      setDrives(res.drives || []);
    } catch (err) {
      toast.error('Failed to load placement drives');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) {
      toast.error('Please fill in drive name and date boundaries');
      return;
    }
    try {
      setSaving(true);
      await api.admin.createDrive({
        name,
        academicYear,
        description,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        status
      });
      toast.success('Placement drive created successfully!');
      setModalOpen(false);
      setName('');
      fetchDrives();
    } catch (err) {
      toast.error(err.message || 'Failed to create drive');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: 0 }}>Placement Seasons & Drives</h1>
            <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-1) 0 0 0', fontSize: 'var(--text-sm)' }}>
              Configure institutional recruitment windows, participating corporate cohorts, and drive phases.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Create Placement Drive
          </button>
        </div>
      </div>

      {/* Drives Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: '180px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : drives.length === 0 ? (
        <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>No placement drives recorded yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
          {drives.map(drive => (
            <div key={drive._id} className="card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                    AY {drive.academicYear || '2025-26'}
                  </span>
                  <span className={`badge ${drive.status === 'ONGOING' ? 'badge-success' : drive.status === 'UPCOMING' ? 'badge-primary' : 'badge-neutral'}`} style={{ fontSize: '0.75rem' }}>
                    {drive.status}
                  </span>
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 'var(--space-2) 0 var(--space-1) 0' }}>
                  {drive.name}
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
                  {drive.description || 'University official placement drive cycle.'}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                <div>Window: <strong>{new Date(drive.startDate).toLocaleDateString()}</strong> to <strong>{new Date(drive.endDate).toLocaleDateString()}</strong></div>
                <div>Participating Companies: <strong>{drive.participatingCompanies?.length || 0}</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Drive Modal */}
      {modalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setModalOpen(false)}
          title="Create Placement Season Drive"
        >
          <form onSubmit={handleCreateDrive} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label className="form-label">Drive Title *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Campus Placement Season 2025-26" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div>
                <label className="form-label">Academic Year</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={academicYear} 
                  onChange={e => setAcademicYear(e.target.value)} 
                />
              </div>
              <div>
                <label className="form-label">Drive Status</label>
                <select className="form-control" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="ONGOING">Ongoing</option>
                  <option value="UPCOMING">Upcoming</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div>
                <label className="form-label">Start Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="form-label">End Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={endDate} 
                  onChange={e => setEndDate(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div>
              <label className="form-label">Description / Guidelines</label>
              <textarea 
                className="form-control" 
                rows={2} 
                placeholder="Overview of eligible departments, dream/core company policies..." 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Creating...' : 'Create Drive'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
