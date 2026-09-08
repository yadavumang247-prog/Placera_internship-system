'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  ListOrdered,
  Building2,
  MapPin,
  FileText,
  AlertCircle,
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
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1E293B] p-6 rounded-xl border border-[#334155] shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Student Portal
            </span>
            <span className="text-[#64748B]">•</span>
            <span className="text-xs text-[#34D399] font-medium">Academic Year 2025–26</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome, {student?.name || 'Student Applicant'}
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            View your academic credentials, preference rankings, and confirmed internship allocation status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/student/internships">
            <Button size="sm" variant="outline" className="border-[#334155] bg-[#0F172A] text-[#38BDF8] hover:bg-[#1E293B]">
              <Briefcase className="h-4 w-4 mr-1.5 text-[#38BDF8]" />
              Browse Internships
            </Button>
          </Link>
          <Link href="/student/preferences">
            <Button size="sm" className="bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-md shadow-sky-950">
              <ListOrdered className="h-4 w-4 mr-1.5" />
              Manage Preferences
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards (4 cards in a row) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Current CGPA */}
        <Card className="border-[#334155] bg-[#1E293B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Current CGPA
            </span>
            <div className="h-8 w-8 rounded-lg bg-[#0F172A] text-[#38BDF8] flex items-center justify-center border border-[#334155]">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">
              {student?.cgpa ? student.cgpa.toFixed(2) : '9.35'}
              <span className="text-xs text-[#94A3B8] font-normal"> / 10.0</span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">Verified Academic Score</p>
          </div>
        </Card>

        {/* Card 2: Preferred Internships */}
        <Card className="border-[#334155] bg-[#1E293B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Preferred Internships
            </span>
            <div className="h-8 w-8 rounded-lg bg-[#0F172A] text-[#818CF8] flex items-center justify-center border border-[#334155]">
              <ListOrdered className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">
              {preferences.length} <span className="text-xs text-[#94A3B8] font-normal">/ 5</span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">Ranked preferences</p>
          </div>
        </Card>

        {/* Card 3: Applications / Preferences */}
        <Card className="border-[#334155] bg-[#1E293B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Applications
            </span>
            <div className="h-8 w-8 rounded-lg bg-[#0F172A] text-[#34D399] flex items-center justify-center border border-[#334155]">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">
              {preferences.length > 0 ? 'Active' : 'Pending'}
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              {preferences.length > 0 ? 'In placement cycle' : 'No choices selected'}
            </p>
          </div>
        </Card>

        {/* Card 4: Allocation Status */}
        <Card className="border-[#334155] bg-[#1E293B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Allocation Status
            </span>
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center border ${
                allocation
                  ? 'bg-emerald-950/60 text-[#34D399] border-emerald-700/50'
                  : 'bg-amber-950/60 text-amber-400 border-amber-700/50'
              }`}
            >
              {allocation ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
            </div>
          </div>
          <div className="mt-3">
            <div
              className={`text-2xl font-bold ${
                allocation ? 'text-[#34D399]' : 'text-amber-400'
              }`}
            >
              {allocation ? 'Allocated' : 'Pending'}
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              {allocation ? `Preference Rank #${allocation.preferenceRank}` : 'Drive in progress'}
            </p>
          </div>
        </Card>
      </div>

      {/* Section: Current Allocation */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#38BDF8]" />
            Current Allocation
          </h2>
        </div>

        {allocation ? (
          <Card className="border-emerald-800/40 bg-emerald-950/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#334155]">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#34D399] text-[#0B1120] flex items-center justify-center shrink-0 mt-1 shadow-md shadow-emerald-950">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#0284C7] text-white">
                        Confirmed Allocation
                      </span>
                      <span className="text-xs text-[#34D399] font-semibold">
                        Preference #{allocation.preferenceRank}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {allocation.internshipTitle}
                    </h3>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      at <strong className="text-white">{allocation.companyName}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                  <span className="text-xs text-[#94A3B8] block">Algorithm Merit Score</span>
                  <span className="text-2xl font-bold font-mono text-[#38BDF8]">
                    {allocation.score}
                  </span>
                  <span className="text-[11px] text-[#94A3B8] block mt-0.5">out of 100.0</span>
                </div>
              </div>

              {/* Score breakdown metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-center">
                <div className="p-3 bg-[#0F172A] rounded-lg border border-[#334155]">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                    Preference (20%)
                  </span>
                  <span className="text-sm font-bold text-white">
                    Choice #{allocation.preferenceRank}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] block mt-0.5">
                    {100 - (allocation.preferenceRank - 1) * 10} pts
                  </span>
                </div>

                <div className="p-3 bg-[#0F172A] rounded-lg border border-[#334155]">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                    CGPA Score (40%)
                  </span>
                  <span className="text-sm font-bold text-white">
                    {student?.cgpa.toFixed(2)} / 10.0
                  </span>
                  <span className="text-[10px] text-[#94A3B8] block mt-0.5">
                    {allocation.cgpaScore} pts
                  </span>
                </div>

                <div className="p-3 bg-[#0F172A] rounded-lg border border-[#334155]">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                    Skill Match (30%)
                  </span>
                  <span className="text-sm font-bold text-[#34D399]">
                    {allocation.skillMatchScore}%
                  </span>
                  <span className="text-[10px] text-[#94A3B8] block mt-0.5">Direct Skill Overlap</span>
                </div>

                <div className="p-3 bg-[#0F172A] rounded-lg border border-[#334155]">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                    Branch Match (10%)
                  </span>
                  <span className="text-sm font-bold text-white">
                    {student?.branch || 'Eligible'}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] block mt-0.5">Discipline Weight</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-[#334155] bg-[#1E293B]">
            <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#0F172A] border border-[#334155] text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    No internship has been allocated yet.
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Allocations will appear once the placement drive is run by the placement cell.
                  </p>
                </div>
              </div>

              <Link href="/student/preferences">
                <Button size="sm" className="bg-[#0284C7] hover:bg-[#0369A1] text-white">
                  Review Preferences
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Table: My Internship Preferences */}
      <Card className="border-[#334155] bg-[#1E293B]">
        <CardHeader className="pb-3 border-b border-[#334155]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <ListOrdered className="h-4 w-4 text-[#38BDF8]" />
                My Internship Preferences
              </CardTitle>
              <CardDescription className="text-xs text-[#94A3B8]">
                Submitted ranked preferences evaluated by the allocation algorithm
              </CardDescription>
            </div>
            <Link href="/student/preferences">
              <Button size="sm" variant="outline" className="border-[#334155] bg-[#0F172A] text-[#38BDF8] text-xs hover:bg-[#1E293B]">
                Manage Preferences
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {preferences.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#94A3B8]">
              <p>No preferences submitted yet.</p>
              <Link href="/student/internships" className="text-[#38BDF8] font-semibold mt-2 inline-block hover:underline">
                Browse available internships →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#334155] bg-[#0F172A] text-[#94A3B8] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4 w-16">Rank</th>
                    <th className="py-3 px-4">Internship</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Min CGPA</th>
                    <th className="py-3 px-4 text-right">Status / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]">
                  {preferences.map((p) => {
                    const isAllocated = allocation?.internshipId === p.internshipId;
                    return (
                      <tr
                        key={p.id}
                        className={`hover:bg-[#0F172A]/50 transition-colors ${
                          isAllocated ? 'bg-emerald-950/20' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-bold">
                          <span
                            className={`inline-flex items-center justify-center h-6 w-6 rounded-md text-xs font-bold ${
                              p.rank === 1
                                ? 'bg-[#0284C7] text-white'
                                : 'bg-[#0F172A] text-[#F8FAFC] border border-[#334155]'
                            }`}
                          >
                            #{p.rank}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">
                          {p.internship?.title || 'Internship Position'}
                        </td>
                        <td className="py-3 px-4 text-[#94A3B8]">
                          {p.internship?.companyName || 'Corporate Partner'}
                        </td>
                        <td className="py-3 px-4 text-[#94A3B8]">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-[#64748B]" />
                            {p.internship?.location || 'Remote'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white font-mono">
                          ≥ {p.internship?.minimumCGPA.toFixed(1) || '6.0'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isAllocated ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/60 text-[#34D399] border border-emerald-700/50">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Allocated Seat
                            </span>
                          ) : (
                            <span className="text-[11px] text-[#94A3B8]">
                              Choice #{p.rank}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Academic Credentials Card */}
      <Card className="border-[#334155] bg-[#1E293B]">
        <CardHeader className="pb-3 border-b border-[#334155]">
          <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
            <User className="h-4 w-4 text-[#38BDF8]" />
            Academic Profile &amp; Technical Skills
          </CardTitle>
          <CardDescription className="text-xs text-[#94A3B8]">
            Verified university placement credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#94A3B8] block mb-0.5">Roll Number</span>
              <span className="font-mono font-bold text-white">
                {student?.rollNumber || 'CS2024001'}
              </span>
            </div>
            <div>
              <span className="text-[#94A3B8] block mb-0.5">Engineering Branch</span>
              <span className="font-semibold text-white">
                {student?.branch || 'Computer Engineering'}
              </span>
            </div>
            <div>
              <span className="text-[#94A3B8] block mb-0.5">Academic Standing</span>
              <span className="font-semibold text-white">
                Year {student?.year || 3} • CGPA {student?.cgpa ? student.cgpa.toFixed(2) : '9.35'}
              </span>
            </div>
            <div>
              <span className="text-[#94A3B8] block mb-1">Technical Skills</span>
              <div className="flex flex-wrap gap-1">
                {(student?.skills || ['Go', 'Kubernetes', 'Docker', 'Python', 'Distributed Systems']).map(
                  (sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 bg-[#0F172A] text-[#38BDF8] text-[10px] font-medium rounded border border-[#334155]"
                    >
                      {sk}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
