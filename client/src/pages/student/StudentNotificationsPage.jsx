import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import EmptyState from '../../components/EmptyState';
import { Bell, CheckCheck, Check, Clock, AlertCircle } from 'lucide-react';

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.student.getNotifications();
      setNotifications(res.notifications || []);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.student.markAllNotificationsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark notifications read');
    }
  };

  const handleMarkSingle = async (id) => {
    try {
      await api.student.markNotificationRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      // silent
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: 0 }}>Notifications</h1>
            <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-1) 0 0 0', fontSize: 'var(--text-sm)' }}>
              Real-time updates regarding application progress, assessment deadlines, and campus recruitment drives.
            </p>
          </div>
          {notifications.some(n => !n.isRead) && (
            <button className="btn btn-secondary btn-sm" onClick={handleMarkAllRead}>
              <CheckCheck size={16} /> Mark All as Read
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: '70px', borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You are completely caught up! Relevant drive updates and status alerts will appear here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {notifications.map(n => (
            <div
              key={n._id}
              className="card"
              onClick={() => !n.isRead && handleMarkSingle(n._id)}
              style={{
                padding: 'var(--space-4)',
                borderLeft: n.isRead ? '3px solid transparent' : '3px solid var(--color-primary)',
                background: n.isRead ? 'var(--color-surface)' : '#ffffff',
                cursor: n.isRead ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
                transition: 'var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                <div style={{
                  padding: '0.4rem',
                  borderRadius: 'var(--radius-full)',
                  background: n.isRead ? 'var(--color-surface)' : 'var(--color-primary-light)',
                  color: n.isRead ? 'var(--color-text-muted)' : 'var(--color-primary)'
                }}>
                  <Bell size={16} />
                </div>
                <div>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: n.isRead ? 500 : 700, margin: 0 }}>
                    {n.title}
                  </h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 'var(--space-1) 0 0 0' }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginTop: 'var(--space-1)' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {!n.isRead && (
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)', marginTop: 'var(--space-2)' }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
