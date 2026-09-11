'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Sliders,
  FileSpreadsheet,
  Settings,
  User,
  ListOrdered,
  CheckCircle2,
  LogOut,
  GraduationCap,
  Menu,
  X,
  UserCheck,
  Award,
  Bell,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { Role } from '../../lib/types';

interface SidebarProps {
  userRole: Role;
  userName: string;
  userEmail: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export function Sidebar({ userRole, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      window.location.href = '/login';
    }
  };

  // ADMIN Navigation (Algorithm Analysis link removed as requested)
  const adminNav: NavItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Control Center', href: '/admin/algorithm', icon: Sliders },
    { name: 'Students Directory', href: '/admin/students', icon: Users },
    { name: 'Corporate Partners', href: '/admin/companies', icon: Building2 },
    { name: 'Internship Roles', href: '/admin/internships', icon: Briefcase },
    { name: 'Master Ledger', href: '/admin/allocations', icon: FileSpreadsheet },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  // STUDENT Navigation
  const studentNav: NavItem[] = [
    { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', href: '/student/profile', icon: User },
    { name: 'Browse Internships', href: '/student/internships', icon: Briefcase },
    { name: 'Eligibility Matrix', href: '/student/eligibility', icon: ShieldCheck },
    { name: 'My Preferences', href: '/student/preferences', icon: ListOrdered },
    { name: 'Allocation Result', href: '/student/result', icon: Award },
    { name: 'Notifications', href: '/student/notifications', icon: Bell },
    { name: 'Placement Documents', href: '/student/documents', icon: FileText },
  ];

  // COMPANY Navigation
  const companyNav: NavItem[] = [
    { name: 'Recruiter Overview', href: '/company/dashboard', icon: LayoutDashboard },
    { name: 'Internship Postings', href: '/company/dashboard#internships', icon: Briefcase },
    { name: 'Applicant Pool', href: '/company/dashboard#candidates', icon: UserCheck },
    { name: 'Matched Cohort', href: '/company/dashboard#allocations', icon: CheckCircle2 },
  ];

  const navItems: NavItem[] =
    userRole === 'ADMIN' ? adminNav : userRole === 'STUDENT' ? studentNav : companyNav;

  const roleLabel =
    userRole === 'ADMIN' ? 'Control Center' : userRole === 'STUDENT' ? 'Student Dashboard' : 'Employer Console';

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-3.5 bg-[#0A1128] border-b border-[#1E3466] sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#D4A253] to-[#F3CA68] flex items-center justify-center text-[#0A1128]">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="font-extrabold text-[#FAF8F5] text-sm tracking-tight">
            SMART<span className="text-[#E5BA73]">INTERN</span>
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-md text-[#D8CEBC] hover:text-[#FAF8F5] hover:bg-[#142247]"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0A1128] border-r border-[#1E3466] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="p-5 border-b border-[#1E3466]">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#D4A253] to-[#F3CA68] flex items-center justify-center text-[#0A1128] shadow-sm shadow-[#E5BA73]/20">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-[#FAF8F5] text-base tracking-tight block leading-tight">
                  SMART<span className="text-[#E5BA73]">INTERN</span>
                </span>
                <span className="text-[10px] text-[#E5BA73] font-semibold uppercase tracking-wider block">
                  {roleLabel}
                </span>
              </div>
            </Link>
          </div>

          {/* User Profile Summary */}
          <div className="p-4 mx-3 my-3 rounded-xl bg-[#0F1A36] border border-[#1E3466]">
            <div className="text-xs font-bold text-[#FAF8F5] truncate">{userName}</div>
            <div className="text-[11px] text-[#D8CEBC] truncate">{userEmail}</div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[#10B981]"></span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#E5BA73]">
                {userRole}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#E5BA73] text-[#0A1128] font-bold shadow-md shadow-[#E5BA73]/20'
                      : 'text-[#D8CEBC] hover:text-[#FAF8F5] hover:bg-[#142247]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-[#0A1128]' : 'text-[#E5BA73]'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#E5BA73]/15 text-[#E5BA73] border border-[#E5BA73]/40">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer & Logout */}
        <div className="p-3 border-t border-[#1E3466] space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#D8CEBC] hover:text-[#FAF8F5] hover:bg-[#142247] font-medium"
          >
            <Briefcase className="h-4 w-4 text-[#D8CEBC]" />
            <span>Public Home</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#EF4444] hover:bg-red-500/10 font-semibold transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
        />
      )}
    </>
  );
}
