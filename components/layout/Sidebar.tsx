'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Cpu,
  FileSpreadsheet,
  BookOpen,
  LogOut,
  Sparkles,
  Menu,
  X,
  ListOrdered,
  Search,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { Role } from '../../lib/types';
import { Badge } from '../ui/badge';

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

  const adminNav: NavItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Students', href: '/admin/students', icon: Users },
    { name: 'Companies', href: '/admin/companies', icon: Building2 },
    { name: 'Internships', href: '/admin/internships', icon: Briefcase },
    { name: 'Run Algorithm', href: '/admin/algorithm', icon: Cpu, badge: 'AOA Engine' },
    { name: 'Allocations & CSV', href: '/admin/allocations', icon: FileSpreadsheet },
    { name: 'Algorithm Docs', href: '/algorithm-explanation', icon: BookOpen },
  ];

  const studentNav: NavItem[] = [
    { name: 'My Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Browse Internships', href: '/student/internships', icon: Search },
    { name: 'Rank Preferences', href: '/student/preferences', icon: ListOrdered, badge: 'Priority 1-5' },
    { name: 'Algorithm Details', href: '/algorithm-explanation', icon: BookOpen },
  ];

  const companyNav: NavItem[] = [
    { name: 'Recruiter Dashboard', href: '/company/dashboard', icon: LayoutDashboard },
    { name: 'Algorithm Details', href: '/algorithm-explanation', icon: BookOpen },
  ];

  const navItems: NavItem[] = userRole === 'ADMIN' ? adminNav : userRole === 'STUDENT' ? studentNav : companyNav;

  const roleLabel =
    userRole === 'ADMIN' ? 'Administrator' : userRole === 'STUDENT' ? 'Student Portal' : 'Recruiter Portal';
  const roleBadgeVariant =
    userRole === 'ADMIN' ? 'purple' : userRole === 'STUDENT' ? 'primary' : 'success';

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-bold text-slate-900 text-sm">Smart Allocation</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out border-r border-slate-800 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-950">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm tracking-tight leading-tight">
                Smart Allocation
              </div>
              <div className="text-[10px] text-indigo-400 font-mono">AOA Platform v1.0</div>
            </div>
          </Link>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{roleLabel}</span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                userRole === 'ADMIN'
                  ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50'
                  : userRole === 'STUDENT'
                  ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50'
                  : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
              }`}
            >
              {userRole}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-900'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
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
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-400">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{userName}</p>
              <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-300 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-900/40 rounded-lg transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
