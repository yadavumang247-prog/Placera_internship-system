'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Info, CheckCircle2, AlertTriangle, Award, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { NotificationItem } from '../../../lib/types';

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNotifs() {
      try {
        const res = await fetch('/api/student/notifications');
        const data = await res.json();
        if (data.notifications) setNotifications(data.notifications);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadNotifs();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
      case 'ALLOCATION':
        return <Award className="h-5 w-5 text-[#10B981]" />;
      case 'WARNING':
        return <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />;
      default:
        return <Info className="h-5 w-5 text-[#0284C7]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] bg-[#E0F2FE] px-2.5 py-0.5 rounded">
          Communication Center
        </span>
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
          Placement Notices &amp; Circulars
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B]">
          Official announcements regarding cycle milestones, Gale-Shapley matching progress, and company interviews.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm divide-y divide-[#F1F5F9] overflow-hidden">
        {notifications.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#64748B]">No recent announcements.</div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="p-5 flex items-start gap-4 hover:bg-[#F8FAFC] transition-colors">
              <div className="h-10 w-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0">
                {getIcon(n.type)}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-[#0F172A]">{n.title}</h3>
                  <span className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(n.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">{n.message}</p>
                {n.link && (
                  <Link href={n.link} className="inline-block text-xs font-semibold text-[#0284C7] hover:underline pt-1">
                    View Associated Details &rarr;
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
