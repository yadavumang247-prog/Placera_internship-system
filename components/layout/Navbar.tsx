'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Bell,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '../ui/button';
import { UserSession } from '../../lib/types';

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      } catch (err) {}
    }
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (err) {
      window.location.href = '/login';
    }
  };

  const getDashboardHref = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'STUDENT') return '/student/dashboard';
    return '/company/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0F172A] border-b border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between py-2.5">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-md bg-[#0284C7] flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-[#F8FAFC] text-base tracking-tight block leading-tight">
                InternMatch Portal
              </span>
              <span className="text-[11px] text-[#94A3B8] block">
                College Internship &amp; Placement
              </span>
            </div>
          </Link>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#94A3B8]">
            <Link href="/" className="hover:text-[#38BDF8] transition-colors">
              Home
            </Link>
            <Link href="/internships" className="hover:text-[#38BDF8] transition-colors">
              Internships
            </Link>

            {user && (
              <>
                {user.role === 'ADMIN' && (
                  <>
                    <Link href="/admin/students" className="hover:text-[#38BDF8] transition-colors">
                      Students
                    </Link>
                    <Link href="/admin/companies" className="hover:text-[#38BDF8] transition-colors">
                      Companies
                    </Link>
                    <Link href="/admin/allocations" className="hover:text-[#38BDF8] transition-colors">
                      Allocations
                    </Link>
                  </>
                )}

                {user.role === 'STUDENT' && (
                  <>
                    <Link href="/student/preferences" className="hover:text-[#38BDF8] transition-colors">
                      My Preferences
                    </Link>
                    <Link href="/student/dashboard" className="hover:text-[#38BDF8] transition-colors">
                      My Allocation
                    </Link>
                  </>
                )}

                {user.role === 'COMPANY' && (
                  <>
                    <Link href="/company/dashboard" className="hover:text-[#38BDF8] transition-colors">
                      Candidates
                    </Link>
                    <Link href="/company/dashboard" className="hover:text-[#38BDF8] transition-colors">
                      Allocations
                    </Link>
                  </>
                )}
              </>
            )}

            <Link href="/#about" className="hover:text-[#38BDF8] transition-colors">
              About
            </Link>
          </nav>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] rounded-md transition-colors relative"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#34D399]" />
              </button>

              <Link
                href={getDashboardHref()}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-[#1E293B] border border-transparent hover:border-[#334155] transition-all"
              >
                <div className="h-7 w-7 rounded-full bg-[#0284C7]/20 text-[#38BDF8] border border-[#0284C7]/40 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left">
                  <span className="text-xs font-semibold text-[#F8FAFC] block leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] block font-mono capitalize">
                    {user.role.toLowerCase()}
                  </span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="p-1.5 text-[#94A3B8] hover:text-[#F87171] hover:bg-[#EF4444]/10 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" className="bg-[#0284C7] hover:bg-[#0369A1] text-white">
                <LogIn className="h-4 w-4 mr-1.5" />
                Portal Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-[#94A3B8] hover:bg-[#1E293B]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1E293B] bg-[#0F172A] px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#CBD5E1] hover:text-[#38BDF8]"
          >
            Home
          </Link>
          <Link
            href="/internships"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#CBD5E1] hover:text-[#38BDF8]"
          >
            Internships
          </Link>
          {user ? (
            <>
              <Link
                href={getDashboardHref()}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-[#38BDF8]"
              >
                Dashboard ({user.name})
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 text-sm font-medium text-[#F87171]"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[#38BDF8]"
            >
              Sign In to Portal
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
