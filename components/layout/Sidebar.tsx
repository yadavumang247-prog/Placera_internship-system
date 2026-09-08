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
  LineChart,
  User,
  ListOrdered,
  CheckCircle2,
  LogOut,
  GraduationCap,
  Menu,
  X,
  UserCheck,
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

  // ADMIN Navigation: Dashboard, Students, Companies, Internships, Allocation, Analytics, Algorithm, Settings
  const adminNav: NavItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Students', href: '/admin/students', icon: Users },
    { name: 'Companies', href: '/admin/companies', icon: Building2 },
    { name: 'Internships', href: '/admin/internships', icon: Briefcase },
    { name: 'Allocation', href: '/admin/allocations', icon: FileSpreadsheet },
    { name: 'Analytics', href: '/admin/dashboard#analytics', icon: LineChart },
    { name: 'Algorithm', href: '/admin/algorithm', icon: Sliders },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  // STUDENT Navigation: Dashboard, My Profile, Internships, My Preferences, My Allocation
  const studentNav: NavItem[] = [
    { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', href: '/student/dashboard#profile', icon: User },
    { name: 'Internships', href: '/student/internships', icon: Briefcase },
    { name: 'My Preferences', href: '/student/preferences', icon: ListOrdered },
    { name: 'My Allocation', href: '/student/dashboard#allocation', icon: CheckCircle2 },
  ];

  // COMPANY Navigation: Dashboard, Company Profile, Internships, Candidates, Allocations
  const companyNav: NavItem[] = [
    { name: 'Dashboard', href: '/company/dashboard', icon: LayoutDashboard },
    { name: 'Company Profile', href: '/company/dashboard#profile', icon: Building2 },
    { name: 'Internships', href: '/company/dashboard#internships', icon: Briefcase },
    { name: 'Candidates', href: '/company/dashboard#candidates', icon: UserCheck },
    { name: 'Allocations', href: '/company/dashboard#allocations', icon: CheckCircle2 },
  ];

  const navItems: NavItem[] =
    userRole === 'ADMIN' ? adminNav : userRole === 'STUDENT' ? studentNav : companyNav;

  const roleLabel =
    userRole === 'ADMIN' ? 'Placement Admin' : userRole === 'STUDENT' ? 'Student Portal' : 'Recruiter Portal';

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-3.5 bg-[#0F172A] border-b border-[#1E293B] sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded bg-[#0284C7] flex items-center justify-center text-white">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="font-bold text-[#F8FAFC] text-sm">InternMatch Portal</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded text-[#94A3B8] hover:bg-[#1E293B]"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-60 bg-[#0F172A] text-[#F8FAFC] flex flex-col justify-between transition-transform duration-200 ease-in-out border-r border-[#1E293B] ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#1E293B]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded bg-[#0284C7] flex items-center justify-center text-white shrink-0 shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-[#F8FAFC] text-sm tracking-tight leading-tight">
                InternMatch Portal
              </div>
              <div className="text-[10px] text-[#94A3B8]">Placement Management</div>
            </div>
          </Link>

          <div className="mt-3 pt-2.5 border-t border-[#1E293B] flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#94A3B8]">{roleLabel}</span>
            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/30 font-semibold">
              {userRole}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1E293B] text-[#38BDF8] border-l-2 border-[#38BDF8] font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-[#38BDF8]' : 'text-[#64748B]'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded ${
                      isActive
                        ? 'bg-[#0284C7]/30 text-[#38BDF8]'
                        : 'bg-[#1E293B] text-[#94A3B8]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Profile & Logout */}
        <div className="p-3 border-t border-[#1E293B] bg-[#0B1120]">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="h-7 w-7 rounded-full bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/40 flex items-center justify-center font-bold text-xs shrink-0">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#F8FAFC] truncate">{userName}</p>
              <p className="text-[10px] text-[#94A3B8] truncate">{userEmail}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#F87171] bg-[#1E293B] hover:bg-[#EF4444]/20 border border-[#EF4444]/30 rounded transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
