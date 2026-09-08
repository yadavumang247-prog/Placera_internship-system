import React from 'react';
import { getSession } from '../../lib/auth/session';
import { redirect } from 'next/navigation';
import { Sidebar } from '../../components/layout/Sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If no session or not admin, redirect to login
  if (!session || session.role !== 'ADMIN') {
    redirect('/login?redirect=/admin/dashboard');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <Sidebar
        userRole="ADMIN"
        userName={session.name || 'System Administrator'}
        userEmail={session.email || 'admin@example.com'}
      />
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
