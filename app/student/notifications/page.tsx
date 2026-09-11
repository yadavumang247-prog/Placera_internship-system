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
        return <Award className="h-5 w-5 text-emerald-400" />;
      case 'WARNING':
        return <AlertTriangle className="h-5 w-5 text-[#E5BA73]" />;
      default:
        return <Info className="h-5 w-5 text-[#E5BA73]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl text-[#FAF8F5]">
      <div className="bg-[#0F1A36] p-6 rounded-2xl border border-[#1E3466] shadow-md space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#E5BA73] bg-[#E5BA73]/15 border border-[#E5BA73]/30 px-2.5 py-0.5 rounded">
          Communication Center
        </span>
        <h1 className="text-2xl font-extrabold text-[#FAF8F5] tracking-tight mt-1">
          Placement Notices &amp; Circulars
        </h1>
        <p className="text-xs sm:text-sm text-[#A8B2D1]">
          Official announcements regarding cycle milestones, allocation matching progress, and company interviews.
        </p>
      </div>

      <div className="bg-[#0F1A36] rounded-2xl border border-[#1E3466] shadow-md divide-y divide-[#1E3466] overflow-hidden">
        {notifications.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#A8B2D1]">No recent announcements.</div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="p-5 flex items-start gap-4 hover:bg-[#142247]/50 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-[#142247] border border-[#1E3466] flex items-center justify-center shrink-0">
                {getIcon(n.type)}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-[#FAF8F5]">{n.title}</h3>
                  <span className="text-[10px] text-[#A8B2D1] flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(n.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-[#D8CEBC] leading-relaxed">{n.message}</p>
                {n.link && (
                  <Link href={n.link} className="inline-block text-xs font-semibold text-[#E5BA73] hover:underline pt-1">
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
