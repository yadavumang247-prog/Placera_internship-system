'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Building2,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useToast } from '../../components/ui/toast';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error: showError } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-fill from query parameter
  useEffect(() => {
    const demoParam = searchParams.get('demo');
    if (demoParam === 'admin') {
      fillCredentials('admin@example.com', 'Admin@123');
    } else if (demoParam === 'student') {
      fillCredentials('student@example.com', 'Student@123');
    } else if (demoParam === 'company') {
      fillCredentials('company@example.com', 'Company@123');
    }
  }, [searchParams]);

  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      success(`Welcome back, ${data.user.name}!`);
      const redirectTarget = searchParams.get('redirect') || data.redirectUrl;
      router.push(redirectTarget);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Login error occurred');
      showError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#0B1120] text-[#F8FAFC]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center justify-center mb-3">
          <div className="h-12 w-12 rounded-xl bg-[#0284C7] flex items-center justify-center text-white shadow-lg shadow-sky-950">
            <GraduationCap className="h-7 w-7" />
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          InternMatch Portal
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#94A3B8]">
          College Internship &amp; Placement Management Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#1E293B] py-8 px-6 sm:px-10 rounded-xl border border-[#334155] shadow-xl">
          {/* Quick-Fill Role Selector */}
          <div className="mb-6 pb-5 border-b border-[#334155]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-[#38BDF8]" />
                Select Portal Role
              </span>
              <span className="text-[11px] text-[#38BDF8] font-medium">1-Click Auto Fill</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@example.com', 'Admin@123')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs transition-all ${
                  email === 'admin@example.com'
                    ? 'border-[#38BDF8] bg-[#38BDF8]/10 text-[#38BDF8] font-semibold ring-1 ring-[#38BDF8]'
                    : 'border-[#334155] hover:border-[#64748B] bg-[#0F172A] text-[#94A3B8]'
                }`}
              >
                <ShieldCheck className="h-4 w-4 mb-1 text-[#38BDF8]" />
                <span className="text-[11px] text-white">Admin</span>
                <span className="text-[9px] text-[#94A3B8]">Officer</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('student@example.com', 'Student@123')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs transition-all ${
                  email === 'student@example.com'
                    ? 'border-[#38BDF8] bg-[#38BDF8]/10 text-[#38BDF8] font-semibold ring-1 ring-[#38BDF8]'
                    : 'border-[#334155] hover:border-[#64748B] bg-[#0F172A] text-[#94A3B8]'
                }`}
              >
                <UserCheck className="h-4 w-4 mb-1 text-[#38BDF8]" />
                <span className="text-[11px] text-white">Student</span>
                <span className="text-[9px] text-[#94A3B8]">Applicant</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('company@example.com', 'Company@123')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs transition-all ${
                  email === 'company@example.com'
                    ? 'border-[#38BDF8] bg-[#38BDF8]/10 text-[#38BDF8] font-semibold ring-1 ring-[#38BDF8]'
                    : 'border-[#334155] hover:border-[#64748B] bg-[#0F172A] text-[#94A3B8]'
                }`}
              >
                <Building2 className="h-4 w-4 mb-1 text-[#34D399]" />
                <span className="text-[11px] text-white">Company</span>
                <span className="text-[9px] text-[#94A3B8]">Partner</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label="College Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>

            <div>
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0284C7] hover:bg-[#0369A1] text-white mt-2 font-medium shadow-md shadow-sky-950"
              isLoading={isLoading}
            >
              Sign In to Portal
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          {/* Credentials Reference Box */}
          <div className="mt-6 pt-4 border-t border-[#334155] text-[11px] text-[#94A3B8] space-y-1.5 bg-[#0F172A] p-3.5 rounded-lg border border-[#334155]">
            <p className="font-semibold text-[#F8FAFC]">Pre-Configured Demo Credentials:</p>
            <div className="flex justify-between">
              <span>Admin:</span>
              <code className="font-mono text-[#38BDF8] font-semibold">admin@example.com / Admin@123</code>
            </div>
            <div className="flex justify-between">
              <span>Student:</span>
              <code className="font-mono text-[#38BDF8] font-semibold">student@example.com / Student@123</code>
            </div>
            <div className="flex justify-between">
              <span>Company:</span>
              <code className="font-mono text-[#38BDF8] font-semibold">company@example.com / Company@123</code>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-[#94A3B8]">
          <Link href="/" className="hover:text-[#38BDF8] transition-colors">
            ← Return to Portal Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0B1120] text-[#94A3B8]">Loading portal...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
