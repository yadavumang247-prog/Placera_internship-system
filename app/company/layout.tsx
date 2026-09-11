import React from 'react';
import { getSession } from '../../lib/auth/session';
import { redirect } from 'next/navigation';
import { Sidebar } from '../../components/layout/Sidebar';

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.role !== 'COMPANY') {
    redirect('/login?redirect=/company/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#0A1128] text-[#FAF8F5] flex flex-col lg:flex-row">
      <Sidebar
        userRole="COMPANY"
        userName={session.name || 'Company Recruiter'}
        userEmail={session.email || 'company@example.com'}
      />
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
