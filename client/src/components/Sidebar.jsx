import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  CheckSquare,
  Video,
  Bell,
  Settings,
  Building2,
  Users,
  Award,
  BarChart3,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/student/profile', icon: User },
    { name: 'Opportunities', path: '/student/opportunities', icon: Briefcase },
    { name: 'My Applications', path: '/student/applications', icon: FileText },
    { name: 'Assessments', path: '/student/assessments', icon: CheckSquare },
    { name: 'Interviews', path: '/student/interviews', icon: Video },
    { name: 'Notifications', path: '/student/notifications', icon: Bell },
  ];

  const recruiterLinks = [
    { name: 'Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
    { name: 'Opportunities', path: '/recruiter/opportunities', icon: Briefcase },
    { name: 'Post Opportunity', path: '/recruiter/opportunities/create', icon: FileText },
    { name: 'Interviews', path: '/recruiter/interviews', icon: Video },
    { name: 'Analytics', path: '/recruiter/analytics', icon: BarChart3 },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Student Verifications', path: '/admin/students', icon: Users },
    { name: 'Recruiter Verifications', path: '/admin/recruiters', icon: Building2 },
    { name: 'Placement Drives', path: '/admin/drives', icon: Calendar },
    { name: 'Platform Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Algorithm Config', path: '/admin/settings', icon: Settings },
  ];

  const links = role === 'STUDENT' ? studentLinks : role === 'RECRUITER' ? recruiterLinks : adminLinks;

  return (
    <aside style={styles.sidebar}>
      <div style={styles.roleBanner}>
        <span style={styles.roleBadge}>{role} PORTAL</span>
      </div>

      <nav style={styles.navGroup}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
            >
              <Icon size={18} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div style={styles.sidebarFooter}>
        <div style={styles.systemStatus}>
          <span style={styles.statusDot} />
          <span style={{ fontSize: '0.78rem', color: '#718290' }}>Algorithm Engine: Active</span>
        </div>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '260px',
    minHeight: 'calc(100vh - 70px)',
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #D6E4C6',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    flexShrink: 0,
  },
  roleBanner: {
    paddingBottom: '16px',
    marginBottom: '16px',
    borderBottom: '1px solid #EBF4DD',
  },
  roleBadge: {
    fontSize: '0.72rem',
    fontWeight: '700',
    letterSpacing: '0.08em',
    color: '#5A7863',
    backgroundColor: '#EFF5F0',
    padding: '4px 10px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  navGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#4A5B67',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
  },
  navItemActive: {
    backgroundColor: '#5A7863',
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sidebarFooter: {
    paddingTop: '16px',
    borderTop: '1px solid #EBF4DD',
  },
  systemStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#15803D',
    display: 'inline-block',
  },
};

export default Sidebar;
