import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import { 
  Briefcase, Plus, Users, Calendar, Award, 
  Clock, Lock, Unlock, ArrowRight, BarChart2, ShieldCheck 
} from 'lucide-react';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    activeOpportunities: 0,
    totalApplicants: 0,
    interviewsScheduled: 0,
    offersExtended: 0
  });
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.recruiter.getDashboard();
      setStats(res.stats || stats);
      setOpportunities(res.opportunities || []);
    } catch (err) {
      toast.error('Failed to load recruiter dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Welcome Banner */}
      <div className="card" style={{ padding: 'var(--space-6)', background: 'linear-gradient(135deg, var(--color-surface) 0%, rgba(144, 171, 139, 0.15) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span className="badge badge-primary">Placera Recruiter</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                {user?.organization?.name || 'Partner Enterprise'}
              </span>
            </div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: 'var(--space-2) 0 var(--space-1) 0' }}>
              Welcome to Placera
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: 'var(--text-sm)' }}>
              Manage your recruitment pipeline from applications to final selection.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Link to="/recruiter/opportunities/new" className="btn btn-primary">
              <Plus size={16} /> Post New Opportunity
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Active Postings
            </span>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-full)', background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              <Briefcase size={18} />
            </div>
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginTop: 'var(--space-2)' }}>
            {stats.activeOpportunities}
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Open for campus applications</span>
        </div>

        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Applicants
            </span>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-full)', background: 'rgba(59, 73, 83, 0.1)', color: 'var(--color-text)' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginTop: 'var(--space-2)' }}>
            {stats.totalApplicants}
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Applications received</span>
        </div>

        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Interviews Scheduled
            </span>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-full)', background: 'rgba(230, 169, 77, 0.15)', color: '#b47318' }}>
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginTop: 'var(--space-2)' }}>
            {stats.interviewsScheduled}
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Rounds currently underway</span>
        </div>

        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Offers Extended
            </span>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-full)', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--color-success)' }}>
              <Award size={18} />
            </div>
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginTop: 'var(--space-2)' }}>
            {stats.offersExtended}
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Final campus allocations</span>
        </div>
      </div>

      {/* Fairness Lock Notice */}
      <div className="card" style={{ padding: 'var(--space-4) var(--space-5)', borderLeft: '4px solid var(--color-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <ShieldCheck size={28} color="var(--color-primary)" />
        <div>
          <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>Pre-Deadline Candidate Fairness Protocol</strong>
          <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            Individual student profiles and score rankings remain strictly locked until an opportunity's application deadline concludes. Only aggregate applicant counts are visible before deadline expiry.
          </p>
        </div>
      </div>

      {/* Active Listings Table */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>Posted Opportunities</h2>
          <Link to="/recruiter/opportunities/new" className="btn btn-secondary btn-sm">
            <Plus size={14} /> New Listing
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ height: '70px', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : opportunities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>No opportunities posted yet. Create your first opening to receive qualified campus applicants.</p>
            <Link to="/recruiter/opportunities/new" className="btn btn-primary" style={{ marginTop: 'var(--space-2)' }}>
              Create Opportunity
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Role & Title</th>
                  <th>Type</th>
                  <th>Deadline</th>
                  <th>Fairness State</th>
                  <th>Applicants</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map(opp => {
                  const deadlinePassed = new Date() > new Date(opp.applicationDeadline);
                  return (
                    <tr key={opp._id}>
                      <td>
                        <strong>{opp.title}</strong>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                          {opp.location || 'Remote'} · Min CGPA: {opp.eligibilityCriteria?.minCgpa || 7.0}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>{opp.type}</span>
                      </td>
                      <td>
                        <div style={{ fontSize: 'var(--text-xs)' }}>
                          {new Date(opp.applicationDeadline).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        {deadlinePassed ? (
                          <span className="badge badge-success" style={{ fontSize: '0.75rem', gap: '0.3rem' }}>
                            <Unlock size={12} /> Unlocked
                          </span>
                        ) : (
                          <span className="badge badge-warning" style={{ fontSize: '0.75rem', gap: '0.3rem' }}>
                            <Lock size={12} /> Pre-Deadline Lock
                          </span>
                        )}
                      </td>
                      <td>
                        <strong>{opp.applicantCount || opp.applications?.length || 0}</strong> candidates
                      </td>
                      <td>
                        <Link 
                          to={`/recruiter/opportunities/${opp._id}/applications`}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '0.3rem', fontSize: 'var(--text-xs)' }}
                        >
                          {deadlinePassed ? 'View & Rank Candidates' : 'Pipeline Overview'} <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
