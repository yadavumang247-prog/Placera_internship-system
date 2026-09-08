import React from 'react';
import Link from 'next/link';
import { Sparkles, Code2, BookOpen, ExternalLink, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-bold text-slate-900 text-base">Smart Internship Allocation System</span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md leading-relaxed">
              A comprehensive college Analysis and Optimization of Algorithms (AOA) project demonstrating deterministic multi-criteria greedy optimization for fair, merit-based student-to-internship matching.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Code2 className="h-4 w-4 text-indigo-500" />
              <span>Time Complexity: O(S·I log(S·I)) | Space Complexity: O(S·I)</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login?demo=admin" className="hover:text-indigo-600 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login?demo=student" className="hover:text-indigo-600 transition-colors">
                  Student Portal & Preferences
                </Link>
              </li>
              <li>
                <Link href="/login?demo=company" className="hover:text-indigo-600 transition-colors">
                  Company Recruiter Portal
                </Link>
              </li>
              <li>
                <Link href="/algorithm-explanation" className="hover:text-indigo-600 transition-colors">
                  Algorithm Explanation & Math
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Tech Stack</h4>
            <ul className="space-y-2 text-xs">
              <li>Next.js 14 (App Router)</li>
              <li>TypeScript & Tailwind CSS</li>
              <li>Prisma ORM & PostgreSQL</li>
              <li>Recharts Data Visualizations</li>
              <li>Role-Based JWT Session Auth</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Smart Internship Allocation System. Built for College AOA Academic Evaluation.</p>
          <div className="flex items-center gap-4">
            <Link href="/algorithm-explanation" className="hover:text-indigo-600">
              Algorithm Complexity
            </Link>
            <Link href="/login" className="hover:text-indigo-600">
              Demo Credentials
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
