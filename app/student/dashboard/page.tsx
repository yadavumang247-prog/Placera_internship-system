'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User,
  Award,
  BookOpen,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ListOrdered,
  Building2,
  MapPin,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { StudentData, PreferenceData } from '../../../lib/types';

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [preferences, setPreferences] = useState<PreferenceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStudentData() {
      try {
        const [meRes, prefRes] = await Promise.all([
          fetch('/api/auth/me').then((r) => r.json()),
          fetch('/api/student/preferences').then((r) => r.json()),
        ]);

        if (meRes.user) {
          // Fetch student profile
          const studRes = await fetch('/api/admin/students').then((r) => r.json());
          if (studRes.students) {
            const found = studRes.students.find(
              (s: StudentData) =>
                s.id === meRes.user.studentId || s.userId === meRes.user.id || s.email === meRes.user.email
            );
            if (found) setStudent(found);
          }
        }
        if (prefRes.preferences) {
          setPreferences(prefRes.preferences);
        }
      } catch (err) {
        console.error('Error fetching student dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStudentData();
  }, []);

  const allocation = student?.allocation;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold mb-3 border border-indigo-400/30">
            <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
            <span>Student Placement Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {student?.name || 'Aarav Sharma'}
          </h1>
          <p className="text-indigo-200 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Track your internship allocation status, inspect mathematical matching scores, and submit your ranked company preferences.
          </p>
        </div>
      </div>

      {/* Allocation Status Card */}
      {allocation ? (
        <Card className="border-emerald-200 bg-emerald-50/30 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200/60">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-200 shrink-0">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success" size="sm">
                      OFFICIAL ALLOCATION CONFIRMED
                    </Badge>
                    <span className="text-xs text-emerald-800 font-mono font-semibold">
                      Preference #{allocation.preferenceRank}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {allocation.internshipTitle}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    at <strong className="text-slate-900">{allocation.companyName}</strong>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Overall Merit Score</span>
                <span className="text-3xl font-extrabold font-mono text-indigo-600">
                  {allocation.score}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">out of 100.0</span>
              </div>
            </div>

            {/* Score Breakdown Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 text-center">
              <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Preference Score (40%)
                </span>
                <span className="text-base font-bold text-indigo-700">
                  {100 - (allocation.preferenceRank - 1) * 10} pts
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Choice #{allocation.preferenceRank}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  CGPA Score (30%)
                </span>
                <span className="text-base font-bold text-blue-700">
                  {allocation.cgpaScore} pts
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  CGPA: {student?.cgpa.toFixed(2)}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Skill Match (30%)
                </span>
                <span className="text-base font-bold text-emerald-700">
                  {allocation.skillMatchScore}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Overlap Ratio</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-amber-200 bg-amber-50/20">
          <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Allocation Pending or Unmatched</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  You are currently on the waiting list. Ensure you have submitted all 5 ranked preferences.
                </p>
              </div>
            </div>
            <Link href="/student/preferences">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                Update Preferences
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Student Profile & Preferences Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-600" />
              Academic Profile
            </CardTitle>
            <CardDescription className="text-xs">
              Verified university placement credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Roll Number:</span>
              <span className="font-mono font-bold text-slate-800">
                {student?.rollNumber || 'CS2024001'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Branch:</span>
              <span className="font-semibold text-slate-800">
                {student?.branch || 'Computer Engineering'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Academic Year:</span>
              <span className="font-semibold text-slate-800">Year {student?.year || 3}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Cumulative CGPA:</span>
              <span className="font-mono font-bold text-indigo-600 text-sm">
                {student?.cgpa ? student.cgpa.toFixed(2) : '9.35'}
              </span>
            </div>

            {/* Skills */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Verified Technical Skills
              </span>
              <div className="flex flex-wrap gap-1">
                {(student?.skills || ['Go', 'Kubernetes', 'Docker', 'Python', 'Distributed Systems']).map(
                  (sk) => (
                    <Badge key={sk} variant="default" size="sm">
                      {sk}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Preview Card */}
        <Card className="lg:col-span-2 space-y-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ListOrdered className="h-4 w-4 text-indigo-600" />
                  Your Active Preference Rankings ({preferences.length}/5)
                </CardTitle>
                <CardDescription className="text-xs">
                  Prioritized order used by the allocation algorithm
                </CardDescription>
              </div>
              <Link href="/student/preferences">
                <Button size="sm" variant="outline">
                  Modify Rankings
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {preferences.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <p>No preferences submitted yet.</p>
                <Link href="/student/internships" className="text-indigo-600 font-semibold mt-2 inline-block">
                  Browse available internships →
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {preferences.map((p) => {
                  const isAllocated = allocation?.internshipId === p.internshipId;
                  return (
                    <div
                      key={p.id}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        isAllocated
                          ? 'border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-400'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            p.rank === 1
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          #{p.rank}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {p.internship?.title || 'Internship Position'}
                          </p>
                          <p className="text-slate-500 text-[11px]">
                            {p.internship?.companyName || 'Company'} • Min CGPA: {p.internship?.minimumCGPA}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isAllocated && (
                          <Badge variant="success" size="sm">
                            ALLOCATED SEAT
                          </Badge>
                        )}
                        <span className="font-mono text-slate-500 font-semibold">
                          {100 - (p.rank - 1) * 10} pts
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
