import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { 
  Users, Building2, Briefcase, Award, CheckCircle, 
  AlertTriangle, ShieldCheck, ArrowRight, Settings, BarChart2, Calendar 
} from 'lucide-react';

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalStudents: 0,
    verifiedStudents: 0,
    pendingStudents: 0,
    totalRecruiters: 0,
    pendingRecruiters: 0,
    totalOpportunities: 0,
    totalPlacements: 0,
    averageCtc: 0
  });
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getDashboard();
      setStats(res.stats || stats);
      setDrives(res.recentDrives || []);
    } catch (err) {
      toast.error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Banner */}
      <div className="card" style={{ padding: 'var(--space-6)', background: 'linear-gradient(135deg, var(--color-surface) 0%, rgba(90, 120, 99, 0.15) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span className="badge badge-primary">Placera Admin</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>University Placement Cell</span>
            </div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: 'var(--space-2) 0 var(--space-1) 0' }}>
              Placera Admin Dashboard
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: 'var(--text-sm)' }}>
              Monitor institutional placement ratios, verify credentials, and manage campus recruitment drives.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Link to="/admin/settings" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
              <Settings size={14} /> Algorithm Weights
            </Link>
            <Link to="/admin/drives" className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
              <Calendar size={14} /> Manage Drives
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Total Students</span>
            <Users size={18} color="var(--color-primary)" />
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginTop: 'var(--space-2)' }}>
            {stats.totalStudents}
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>
            {stats.verifiedStudents} verified credentials
          </span>
        </div>

        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Recruiters</span>
            <Building2 size={18} color="var(--color-primary)" />
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginTop: 'var(--space-2)' }}>
            {stats.totalRecruiters}
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Corporate hiring partners</span>
        </div>

        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Total Placements</span>
            <Award size={18} color="var(--color-success)" />
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginTop: 'var(--space-2)' }}>
            {stats.totalPlacements}
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Offers accepted to date</span>
        </div>

        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Average CTC</span>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)' }}>₹</span>
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginTop: 'var(--space-2)' }}>
            {stats.averageCtc ? `₹${(stats.averageCtc / 100000).toFixed(1)} LPA` : '₹12.4 LPA'}
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Median campus package</span>
        </div>
      </div>

      {/* Action Verification Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="card" style={{ padding: 'var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-full)', background: 'rgba(230, 169, 77, 0.15)', color: 'var(--color-accent)' }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <strong style={{ fontSize: 'var(--text-sm)' }}>Student Verifications Pending</strong>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                {stats.pendingStudents} student profiles awaiting academic audit
              </div>
            </div>
          </div>
          <Link to="/admin/students" className="btn btn-secondary btn-sm">
            Review <ArrowRight size={12} />
          </Link>
        </div>

        <div className="card" style={{ padding: 'var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-full)', background: 'rgba(90, 120, 99, 0.15)', color: 'var(--color-primary)' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <strong style={{ fontSize: 'var(--text-sm)' }}>Recruiter Approvals Pending</strong>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                {stats.pendingRecruiters} enterprise accounts awaiting accreditation
              </div>
            </div>
          </div>
          <Link to="/admin/recruiters" className="btn btn-secondary btn-sm">
            Review <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Active Campus Drives */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>Active Placement Drives</h2>
          <Link to="/admin/drives" className="btn btn-secondary btn-sm">
            View All Drives
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[1, 2].map(i => (
              <div key={i} className="skeleton" style={{ height: '70px', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : drives.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-6)' }}>
            No active placement drives found. Create seasonal drives to organize recruitment cycles.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {drives.map(drive => (
              <div 
                key={drive._id}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: 'var(--space-4)', 
                  background: 'var(--color-surface)', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--color-border)',
                  flexWrap: 'wrap',
                  gap: 'var(--space-3)'
                }}
              >
                <div>
                  <strong style={{ fontSize: 'var(--text-md)' }}>{drive.name}</strong>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                    Academic Year: {drive.academicYear || '2025-26'} · {new Date(drive.startDate).toLocaleDateString()} to {new Date(drive.endDate).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span className={`badge ${drive.status === 'ONGOING' ? 'badge-success' : 'badge-neutral'}`}>
                    {drive.status}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    {drive.participatingCompanies?.length || 0} Companies
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
