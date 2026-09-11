'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  Sparkles,
  Award,
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
    <header className="sticky top-0 z-40 w-full bg-[#0A1128]/95 border-b border-[#1E3466] shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#D4A253] to-[#F3CA68] flex items-center justify-center text-[#0A1128] shadow-md shadow-[#E5BA73]/20">
              <GraduationCap className="h-6 w-6 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[#FAF8F5] text-lg tracking-tight block leading-tight">
                  SMART<span className="text-[#E5BA73]">INTERN</span>
                </span>
              </div>
              <span className="text-[11px] text-[#D8CEBC] block leading-none mt-0.5 font-medium">
                Smart Internship Allocation System
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#D8CEBC]">
            <Link href="/" className="hover:text-[#E5BA73] transition-colors">
              Home
            </Link>
            <Link href="/internships" className="hover:text-[#E5BA73] transition-colors">
              Internships
            </Link>
            <Link href="/about" className="hover:text-[#E5BA73] transition-colors">
              About
            </Link>

            {user && (
              <>
                {user.role === 'ADMIN' && (
                  <>
                    <span className="text-[#1E3466]">|</span>
                    <Link href="/admin/dashboard" className="text-[#FAF8F5] hover:text-[#E5BA73] transition-colors font-semibold">
                      Control Center
                    </Link>
                    <Link href="/admin/algorithm" className="hover:text-[#E5BA73] transition-colors">
                      Allocation Engine
                    </Link>
                    <Link href="/admin/allocations" className="hover:text-[#E5BA73] transition-colors">
                      Ledger
                    </Link>
                  </>
                )}

                {user.role === 'STUDENT' && (
                  <>
                    <span className="text-[#1E3466]">|</span>
                    <Link href="/student/dashboard" className="text-[#FAF8F5] hover:text-[#E5BA73] transition-colors font-semibold">
                      Dashboard
                    </Link>
                    <Link href="/student/preferences" className="hover:text-[#E5BA73] transition-colors">
                      My Preferences
                    </Link>
                    <Link href="/student/result" className="hover:text-[#E5BA73] transition-colors">
                      Allocation Result
                    </Link>
                  </>
                )}

                {user.role === 'COMPANY' && (
                  <>
                    <span className="text-[#1E3466]">|</span>
                    <Link href="/company/dashboard" className="text-[#FAF8F5] hover:text-[#E5BA73] transition-colors font-semibold">
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
                <div className="text-xs font-semibold text-[#FAF8F5] leading-tight">{user.name}</div>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#10B981]"></span>
                  <span className="text-[10px] font-bold text-[#E5BA73] uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
              </div>

              <Link href={getDashboardHref()}>
                <Button size="sm" className="bg-[#E5BA73] hover:bg-[#D4A253] text-[#0A1128] font-bold shadow-sm">
                  Dashboard
                </Button>
              </Link>

              <Button
                size="sm"
                variant="outline"
                onClick={handleLogout}
                className="border-[#1E3466] bg-transparent text-[#D8CEBC] hover:text-[#FAF8F5] hover:bg-[#142247]"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link href="/login">
                <Button
                  size="sm"
                  className="bg-[#E5BA73] hover:bg-[#D4A253] text-[#0A1128] font-bold shadow-md shadow-[#E5BA73]/15"
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
            className="text-[#D8CEBC] hover:text-[#FAF8F5]"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F1A36] border-b border-[#1E3466] px-4 pt-3 pb-5 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#FAF8F5] font-medium py-1.5"
          >
            Home
          </Link>
          <Link
            href="/internships"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#D8CEBC] font-medium py-1.5"
          >
            Internships
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#D8CEBC] font-medium py-1.5"
          >
            About
          </Link>

          {user ? (
            <div className="pt-3 border-t border-[#1E3466] space-y-2">
              <div className="text-xs text-[#D8CEBC]">
                Signed in as <span className="text-white font-semibold">{user.name}</span> ({user.role})
              </div>
              <Link
                href={getDashboardHref()}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[#E5BA73] font-medium py-1.5"
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
                className="w-full border-[#1E3466] text-[#D8CEBC]"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="pt-3 border-t border-[#1E3466]">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full bg-[#E5BA73] text-[#0A1128] font-bold">
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
