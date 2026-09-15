import React, { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, MapPin } from 'lucide-react';
import { api } from '../../services/api.js';
import { OpportunityCard } from '../../components/OpportunityCard.jsx';
import { EmptyState } from '../../components/EmptyState.jsx';
import { LoadingState } from '../../components/LoadingState.jsx';

export const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedWorkMode, setSelectedWorkMode] = useState('ALL');

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedType !== 'ALL') params.append('type', selectedType);
      if (selectedWorkMode !== 'ALL') params.append('workMode', selectedWorkMode);

      const res = await api.get(`/opportunities?${params.toString()}`);
      if (res.success) {
        setOpportunities(res.opportunities || []);
      }
    } catch (err) {
      console.error('Failed to load opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [selectedType, selectedWorkMode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOpportunities();
  };

  return (
    <div style={styles.page}>
      <div className="container" style={{ padding: '40px 16px' }}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 className="section-heading">Active Placement Drives & Internships</h1>
            <p style={{ color: '#718290', fontSize: '0.95rem', marginTop: '4px' }}>
              Explore verified opportunities. Algorithmic match scores are automatically calculated based on your profile.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="card" style={styles.filterCard}>
          <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
            <div className="search-bar" style={{ flex: 1, minWidth: '280px' }}>
              <Search size={18} color="#718290" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search by title, role, or technical skill (e.g. React, Python)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={styles.selectGroup}>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="select"
                style={{ width: 'auto', minWidth: '160px' }}
              >
                <option value="ALL">All Opportunity Types</option>
                <option value="INTERNSHIP">Internships</option>
                <option value="FULL_TIME">Full-Time (Graduate)</option>
                <option value="INTERNSHIP_PPO">Internship + PPO</option>
              </select>

              <select
                value={selectedWorkMode}
                onChange={(e) => setSelectedWorkMode(e.target.value)}
                className="select"
                style={{ width: 'auto', minWidth: '140px' }}
              >
                <option value="ALL">All Work Modes</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ON_SITE">On-Site</option>
              </select>

              <button type="submit" className="btn btn-primary btn-sm">
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Results Grid */}
        {loading ? (
          <LoadingState message="Fetching active recruitment drives..." />
        ) : opportunities.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No Opportunities Found"
            description="No recruitment drives matched your search criteria. Try adjusting your filters."
            actionText="Reset Filters"
            onAction={() => {
              setSearch('');
              setSelectedType('ALL');
              setSelectedWorkMode('ALL');
            }}
          />
        ) : (
          <div className="grid grid-3" style={{ marginTop: '24px' }}>
            {opportunities.map((opp) => (
              <OpportunityCard key={opp._id} opportunity={opp} match={opp.match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#EBF4DD',
    minHeight: 'calc(100vh - 70px)',
  },
  header: {
    marginBottom: '28px',
  },
  filterCard: {
    padding: '16px 20px',
    marginBottom: '24px',
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
    minWidth: '280px',
    backgroundColor: '#F6FAEE',
    border: '1px solid #D6E4C6',
    borderRadius: '8px',
    padding: '8px 14px',
  },
  searchInput: {
    border: 'none',
    background: 'none',
    outline: 'none',
    width: '100%',
    fontSize: '0.92rem',
    color: '#3B4953',
  },
  selectGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
};

export default OpportunitiesPage;
