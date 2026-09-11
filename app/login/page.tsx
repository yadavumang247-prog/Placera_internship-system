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
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#0A1128] text-[#FAF8F5]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center justify-center mb-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#D4A253] to-[#F3CA68] flex items-center justify-center text-[#0A1128] shadow-lg shadow-[#E5BA73]/20">
            <GraduationCap className="h-7 w-7" />
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#FAF8F5] tracking-tight">
          SMART<span className="text-[#E5BA73]">INTERN</span>
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#D8CEBC]">
          Smart Internship Allocation System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#0F1A36] py-8 px-6 sm:px-10 rounded-2xl border border-[#1E3466] shadow-xl">
          {/* Quick-Fill Role Selector */}
          <div className="mb-6 pb-5 border-b border-[#1E3466]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D8CEBC] flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-[#E5BA73]" />
                Select Account Role
              </span>
              <span className="text-[11px] text-[#E5BA73] font-semibold">1-Click Auto Fill</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@example.com', 'Admin@123')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs transition-all ${
                  email === 'admin@example.com'
                    ? 'border-[#E5BA73] bg-[#E5BA73]/15 text-[#F3CA68] font-semibold ring-1 ring-[#E5BA73]'
                    : 'border-[#1E3466] hover:border-[#E5BA73]/50 bg-[#0A1128] text-[#D8CEBC]'
                }`}
              >
                <ShieldCheck className="h-4 w-4 mb-1 text-[#E5BA73]" />
                <span className="text-[11px] text-[#FAF8F5]">Admin</span>
                <span className="text-[9px] text-[#D8CEBC]">Officer</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('student@example.com', 'Student@123')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs transition-all ${
                  email === 'student@example.com'
                    ? 'border-[#E5BA73] bg-[#E5BA73]/15 text-[#F3CA68] font-semibold ring-1 ring-[#E5BA73]'
                    : 'border-[#1E3466] hover:border-[#E5BA73]/50 bg-[#0A1128] text-[#D8CEBC]'
                }`}
              >
                <UserCheck className="h-4 w-4 mb-1 text-[#E5BA73]" />
                <span className="text-[11px] text-[#FAF8F5]">Student</span>
                <span className="text-[9px] text-[#D8CEBC]">Applicant</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('company@example.com', 'Company@123')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs transition-all ${
                  email === 'company@example.com'
                    ? 'border-[#E5BA73] bg-[#E5BA73]/15 text-[#F3CA68] font-semibold ring-1 ring-[#E5BA73]'
                    : 'border-[#1E3466] hover:border-[#E5BA73]/50 bg-[#0A1128] text-[#D8CEBC]'
                }`}
              >
                <Building2 className="h-4 w-4 mb-1 text-[#E5BA73]" />
                <span className="text-[11px] text-[#FAF8F5]">Company</span>
                <span className="text-[9px] text-[#D8CEBC]">Partner</span>
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
                label="Email Address"
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
              className="w-full bg-[#E5BA73] hover:bg-[#D4A253] text-[#0A1128] mt-2 font-bold shadow-md shadow-[#E5BA73]/20"
              isLoading={isLoading}
            >
              Sign In
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          {/* Credentials Reference Box */}
          <div className="mt-6 pt-4 border-t border-[#1E3466] text-[11px] text-[#D8CEBC] space-y-1.5 bg-[#0A1128] p-3.5 rounded-xl border border-[#1E3466]">
            <p className="font-semibold text-[#FAF8F5]">Pre-Configured Demo Credentials:</p>
            <div className="flex justify-between">
              <span>Admin:</span>
              <code className="font-mono text-[#E5BA73] font-semibold">admin@example.com / Admin@123</code>
            </div>
            <div className="flex justify-between">
              <span>Student:</span>
              <code className="font-mono text-[#E5BA73] font-semibold">student@example.com / Student@123</code>
            </div>
            <div className="flex justify-between">
              <span>Company:</span>
              <code className="font-mono text-[#E5BA73] font-semibold">company@example.com / Company@123</code>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-[#D8CEBC]">
          <Link href="/" className="hover:text-[#E5BA73] transition-colors">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0A1128] text-[#D8CEBC]">Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
