'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  UserCheck,
  Building2,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  KeyRound,
  Check,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
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
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="h-11 w-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Sparkles className="h-6 w-6" />
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign In to Platform
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
          Smart Internship Allocation System • AOA Engine
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-card rounded-2xl border border-slate-200/80">
          {/* Demo Quick-Fill Buttons */}
          <div className="mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-indigo-600" />
                Select Demo Account
              </span>
              <span className="text-[11px] text-indigo-600 font-medium">1-Click Fill</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@example.com', 'Admin@123')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs transition-all ${
                  email === 'admin@example.com'
                    ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-500/20'
                    : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-slate-700'
                }`}
              >
                <ShieldCheck className="h-4 w-4 mb-1 text-purple-600" />
                <span className="font-semibold text-[11px]">Admin</span>
                <span className="text-[9px] text-slate-400">Full Control</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('student@example.com', 'Student@123')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs transition-all ${
                  email === 'student@example.com'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700'
                }`}
              >
                <UserCheck className="h-4 w-4 mb-1 text-indigo-600" />
                <span className="font-semibold text-[11px]">Student</span>
                <span className="text-[9px] text-slate-400">Preferences</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('company@example.com', 'Company@123')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs transition-all ${
                  email === 'company@example.com'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-700'
                }`}
              >
                <Building2 className="h-4 w-4 mb-1 text-emerald-600" />
                <span className="font-semibold text-[11px]">Company</span>
                <span className="text-[9px] text-slate-400">Recruiter</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2"
              isLoading={isLoading}
            >
              Sign In
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          {/* Credentials Reference Box */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200/60">
            <p className="font-semibold text-slate-700">Pre-Configured Demo Credentials:</p>
            <div className="flex justify-between">
              <span>Admin:</span>
              <code className="font-mono text-slate-800 font-semibold">admin@example.com / Admin@123</code>
            </div>
            <div className="flex justify-between">
              <span>Student:</span>
              <code className="font-mono text-slate-800 font-semibold">student@example.com / Student@123</code>
            </div>
            <div className="flex justify-between">
              <span>Company:</span>
              <code className="font-mono text-slate-800 font-semibold">company@example.com / Company@123</code>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            ← Back to Public Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading login...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
