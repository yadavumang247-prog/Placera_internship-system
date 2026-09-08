'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, BookOpen, Layers, ShieldCheck, LogIn } from 'lucide-react';
import { Button } from '../ui/button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base tracking-tight">Smart Internship Allocation</span>
              <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded px-1.5 py-0.5">
                AOA Project
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">Algorithm-Based Internship Allocation Platform</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/#how-it-works" className="hover:text-indigo-600 transition-colors">
            How It Works
          </Link>
          <Link href="/#algorithm" className="hover:text-indigo-600 transition-colors">
            Algorithm Flow
          </Link>
          <Link href="/#features" className="hover:text-indigo-600 transition-colors">
            Features
          </Link>
          <Link
            href="/algorithm-explanation"
            className="flex items-center gap-1.5 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            Algorithm Docs
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <LogIn className="h-4 w-4 mr-1.5" />
              Sign In
            </Button>
          </Link>
          <Link href="/login?demo=admin">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              <span>Explore Demo</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
