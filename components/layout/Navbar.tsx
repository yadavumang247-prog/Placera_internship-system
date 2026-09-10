'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Cpu,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  Sparkles,
  Award,
  BookOpen,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
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
    <header className="sticky top-0 z-40 w-full bg-[#0F172A] border-b border-[#1E293B] shadow-sm backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-[#0284C7] to-[#0EA5E9] flex items-center justify-center text-white shadow-md shadow-sky-950/40">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[#F8FAFC] text-lg tracking-tight block leading-tight">
                  SMART<span className="text-[#38BDF8]">INTERN</span>
                </span>
              </div>
              <span className="text-[11px] text-[#94A3B8] block leading-none mt-0.5">
                Smart Internship Allocation System
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#94A3B8]">
            <Link href="/" className="hover:text-[#38BDF8] transition-colors">
              Home
            </Link>
            <Link href="/internships" className="hover:text-[#38BDF8] transition-colors">
              Internships
            </Link>
            <Link
              href="/algorithm-explanation"
              className="flex items-center gap-1.5 text-[#38BDF8] hover:text-[#7DD3FC] transition-colors"
            >
              <Cpu className="h-4 w-4" />
              Algorithm
            </Link>
            <Link href="/about" className="hover:text-[#38BDF8] transition-colors">
              About
            </Link>

            {user && (
              <>
                {user.role === 'ADMIN' && (
                  <>
                    <span className="text-[#334155]">|</span>
                    <Link href="/admin/dashboard" className="text-white hover:text-[#38BDF8] transition-colors font-semibold">
                      Control Center
                    </Link>
                    <Link href="/admin/algorithm" className="hover:text-[#38BDF8] transition-colors">
                      Allocation Engine
                    </Link>
                    <Link href="/admin/allocations" className="hover:text-[#38BDF8] transition-colors">
                      Ledger
                    </Link>
                  </>
                )}

                {user.role === 'STUDENT' && (
                  <>
                    <span className="text-[#334155]">|</span>
                    <Link href="/student/dashboard" className="text-white hover:text-[#38BDF8] transition-colors font-semibold">
                      Dashboard
                    </Link>
                    <Link href="/student/preferences" className="hover:text-[#38BDF8] transition-colors">
                      My Preferences
                    </Link>
                    <Link href="/student/result" className="hover:text-[#38BDF8] transition-colors">
                      Allocation Result
                    </Link>
                  </>
                )}

                {user.role === 'COMPANY' && (
                  <>
                    <span className="text-[#334155]">|</span>
                    <Link href="/company/dashboard" className="text-white hover:text-[#38BDF8] transition-colors font-semibold">
                      Recruiter Dashboard
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>
        </div>

        {/* Right Section / Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-semibold text-white leading-tight">{user.name}</div>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#10B981]"></span>
                  <span className="text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
              </div>

              <Link href={getDashboardHref()}>
                <Button size="sm" className="bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-sm">
                  Dashboard
                </Button>
              </Link>

              <Button
                size="sm"
                variant="outline"
                onClick={handleLogout}
                className="border-[#334155] bg-transparent text-[#94A3B8] hover:text-white hover:bg-[#1E293B]"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link href="/login">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#334155] bg-transparent text-[#94A3B8] hover:text-white hover:bg-[#1E293B]"
                >
                  <LogIn className="h-4 w-4 mr-1.5" />
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#94A3B8] hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B1329] border-b border-[#1E293B] px-4 pt-3 pb-5 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#F8FAFC] font-medium py-1.5"
          >
            Home
          </Link>
          <Link
            href="/internships"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#94A3B8] font-medium py-1.5"
          >
            Internships
          </Link>
          <Link
            href="/algorithm-explanation"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#38BDF8] font-medium py-1.5"
          >
            Algorithm
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#94A3B8] font-medium py-1.5"
          >
            About
          </Link>

          {user ? (
            <div className="pt-3 border-t border-[#1E293B] space-y-2">
              <div className="text-xs text-[#94A3B8]">
                Signed in as <span className="text-white font-semibold">{user.name}</span> ({user.role})
              </div>
              <Link
                href={getDashboardHref()}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[#38BDF8] font-medium py-1.5"
              >
                Go to Dashboard
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full border-[#334155] text-[#94A3B8]"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="pt-3 border-t border-[#1E293B]">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full bg-[#0284C7] text-white">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
