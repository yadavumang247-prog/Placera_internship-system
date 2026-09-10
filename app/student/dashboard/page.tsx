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
  ShieldCheck,
  Sparkles,
  Lock,
  Unlock,
  Bell,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { StudentData, PreferenceData, InternshipData, AllocationData } from '../../../lib/types';
import { checkEligibility } from '../../../lib/algorithm/eligibilityEngine';

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [preferences, setPreferences] = useState<PreferenceData[]>([]);
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [allocation, setAllocation] = useState<AllocationData | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStudentData() {
      try {
        const [profRes, prefRes, internRes, resultRes] = await Promise.all([
          fetch('/api/student/profile').then((r) => r.json()),
          fetch('/api/student/preferences').then((r) => r.json()),
          fetch('/api/admin/internships').then((r) => r.json()),
          fetch('/api/student/result').then((r) => r.json()),
        ]);

        if (profRes.student) {
          setStudent(profRes.student);
        }
        if (prefRes.preferences) {
          setPreferences(prefRes.preferences);
        }
        if (internRes.internships) {
          setInternships(internRes.internships);
        }
        if (resultRes.published) {
          setIsPublished(true);
          setAllocation(resultRes.allocation);
        } else {
          setIsPublished(false);
        }
      } catch (err) {
        console.error('Error fetching student dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStudentData();
  }, []);

  // Compute profile completion percentage
  const computeCompletion = () => {
    if (!student) return 0;
    let score = 0;
    if (student.name) score += 20;
    if (student.rollNumber) score += 20;
    if (student.cgpa) score += 20;
    if (student.skills && student.skills.length > 0) score += 20;
    if (student.resumeUrl) score += 20;
    return score;
  };

  const profileScore = computeCompletion();
  const eligibleCount = student
    ? internships.filter((i) => checkEligibility(student, i).isEligible).length
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0284C7]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] bg-[#E0F2FE] px-2.5 py-0.5 rounded">
              Student Placement Portal
            </span>
            <span className="text-[#94A3B8]">•</span>
            <span className="text-xs text-[#10B981] font-semibold">Academic Year 2025–26</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Welcome back, {student?.name || 'Student Candidate'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            {student?.branch} • Roll Number: <strong className="text-[#0F172A]">{student?.rollNumber}</strong> • CGPA: <strong className="text-[#0F172A]">{student?.cgpa.toFixed(2)}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/student/internships">
            <Button size="sm" variant="outline" className="border-[#CBD5E1] bg-white text-[#0F172A] hover:bg-[#F1F5F9]">
              <Briefcase className="h-4 w-4 mr-1.5 text-[#0284C7]" />
              Browse Internships
            </Button>
          </Link>
          <Link href="/student/preferences">
            <Button size="sm" className="bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-sm">
              <ListOrdered className="h-4 w-4 mr-1.5" />
              Manage Preferences
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Core Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile Completion */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-semibold uppercase tracking-wider">Profile Status</span>
            <User className="h-4 w-4 text-[#0284C7]" />
          </div>
          <div className="text-2xl font-bold text-[#0F172A]">{profileScore}%</div>
          <div className="w-full bg-[#F1F5F9] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#0284C7] h-full rounded-full transition-all"
              style={{ width: `${profileScore}%` }}
            />
          </div>
          <div className="text-[11px] text-[#64748B] flex items-center justify-between pt-1">
            <span>{profileScore === 100 ? 'Fully Verified' : 'Action Required'}</span>
            <Link href="/student/profile" className="text-[#0284C7] font-semibold hover:underline">
              Edit &rarr;
            </Link>
          </div>
        </div>

        {/* Eligible Internships */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-semibold uppercase tracking-wider">Eligible Tracks</span>
            <ShieldCheck className="h-4 w-4 text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold text-[#0F172A]">{eligibleCount}</div>
          <p className="text-[11px] text-[#64748B]">
            Out of {internships.length} active opportunities based on your CGPA and branch.
          </p>
          <Link href="/student/eligibility" className="text-[11px] text-[#0284C7] font-semibold hover:underline block pt-1">
            View Eligibility Matrix &rarr;
          </Link>
        </div>

        {/* Preferences Selected */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-semibold uppercase tracking-wider">Preferences</span>
            <ListOrdered className="h-4 w-4 text-[#8B5CF6]" />
          </div>
          <div className="text-2xl font-bold text-[#0F172A]">{preferences.length}</div>
          <div className="flex items-center gap-1.5 text-[11px]">
            {student?.preferencesLocked ? (
              <span className="inline-flex items-center gap-1 text-[#065F46] font-semibold bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                <Lock className="h-3 w-3" /> Locked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#D97706] font-semibold bg-[#FFFBEB] px-2 py-0.5 rounded border border-[#FDE68A]">
                <Unlock className="h-3 w-3" /> Open
              </span>
            )}
          </div>
          <Link href="/student/preferences" className="text-[11px] text-[#0284C7] font-semibold hover:underline block pt-1">
            Reorder Preferences &rarr;
          </Link>
        </div>

        {/* Allocation Status */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-semibold uppercase tracking-wider">Allocation Result</span>
            <Award className="h-4 w-4 text-[#F59E0B]" />
          </div>
          <div className="text-xl font-bold truncate">
            {isPublished && allocation ? (
              <span className="text-[#10B981]">Allocated!</span>
            ) : isPublished && !allocation ? (
              <span className="text-[#64748B]">Unallocated</span>
            ) : (
              <span className="text-[#0284C7] text-lg">In Verification</span>
            )}
          </div>
          <p className="text-[11px] text-[#64748B]">
            {isPublished && allocation
              ? `${allocation.companyName}`
              : isPublished
              ? 'Check non-allocation explanation'
              : 'Placement cell is running Gale-Shapley rounds'}
          </p>
          <Link href="/student/result" className="text-[11px] text-[#0284C7] font-semibold hover:underline block pt-1">
            View Full Result &rarr;
          </Link>
        </div>
      </div>

      {/* Allocation Status Banner (If Published and Allocated) */}
      {isPublished && allocation && (
        <div className="bg-gradient-to-r from-[#EFF6FF] to-[#ECFDF5] border border-[#BAE6FD] p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#065F46] text-xs font-bold">
                <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                Official Allocation Confirmed
              </span>
              <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                Congratulations! You have been allocated to {allocation.companyName}
              </h2>
              <p className="text-sm font-semibold text-[#0284C7]">
                {allocation.internshipTitle} • Preference #{allocation.preferenceRank} Match
              </p>
            </div>

            <Link href="/student/result">
              <Button className="bg-[#0284C7] hover:bg-[#0369A1] text-white shrink-0">
                View Why This Allocation &rarr;
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="bg-white/80 p-3 rounded-xl border border-[#BAE6FD]">
              <span className="text-[#64748B] block">Candidate Merit Score</span>
              <span className="text-base font-extrabold text-[#0F172A]">{allocation.score.toFixed(1)} / 100</span>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-[#BAE6FD]">
              <span className="text-[#64748B] block">Preference Priority</span>
              <span className="text-base font-extrabold text-[#0284C7]">Rank #{allocation.preferenceRank}</span>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-[#BAE6FD]">
              <span className="text-[#64748B] block">Skill Compatibility</span>
              <span className="text-base font-extrabold text-[#10B981]">{allocation.skillMatchScore}%</span>
            </div>
            <div className="bg-white/80 p-3 rounded-xl border border-[#BAE6FD]">
              <span className="text-[#64748B] block">Quota Position</span>
              <span className="text-base font-extrabold text-[#0F172A]">Seat #{allocation.rankWithinQuota || 1} of {allocation.totalSeats || 2}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Preferences Roster & Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Preferences List */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
            <div>
              <h3 className="font-bold text-[#0F172A] text-base">Your Ranked Preferences</h3>
              <p className="text-xs text-[#64748B]">
                Submitted order for Gale-Shapley stable matching rounds.
              </p>
            </div>
            <Link href="/student/preferences">
              <Button size="sm" variant="outline" className="text-xs border-[#CBD5E1]">
                Edit Rankings
              </Button>
            </Link>
          </div>

          {preferences.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <ListOrdered className="h-8 w-8 text-[#94A3B8] mx-auto" />
              <p className="text-xs text-[#64748B]">You have not added any internships to your preference list yet.</p>
              <Link href="/student/internships">
                <Button size="sm" className="bg-[#0284C7] text-white mt-1">Browse Internships</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {preferences.map((pref) => (
                <div
                  key={pref.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] hover:bg-white hover:border-[#BAE6FD] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg bg-[#0284C7] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {pref.rank}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#0F172A]">
                        {pref.internship?.title || 'Internship Opportunity'}
                      </h4>
                      <p className="text-[11px] text-[#64748B]">
                        {pref.internship?.companyName} • {pref.internship?.location.split(',')[0]} • ₹{pref.internship?.stipend.toLocaleString()}/mo
                      </p>
                    </div>
                  </div>

                  <Link href={`/internships/${pref.internshipId}`}>
                    <Button size="sm" variant="ghost" className="text-xs text-[#0284C7] hover:bg-[#E0F2FE]">
                      View Role &rarr;
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Notifications & Deadlines */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-[#0F172A]">
                <Bell className="h-4 w-4 text-[#0284C7]" />
                <span>Placement Announcements</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#BAE6FD] space-y-1">
                <span className="font-bold text-[#0284C7] block">Gale-Shapley Matching Underway</span>
                <p className="text-[11px] text-[#475569]">
                  Placement administration has initiated verification rounds. Check back for published results.
                </p>
                <span className="text-[10px] text-[#94A3B8] block">Today, 10:00 AM</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <span className="font-bold text-[#0F172A] block">Preference Window Deadline</span>
                <p className="text-[11px] text-[#64748B]">
                  Ensure all ranked preferences are saved and locked before the round cutoff.
                </p>
                <span className="text-[10px] text-[#94A3B8] block">Dec 31, 2026</span>
              </div>
            </div>
          </div>

          {/* Placement Cell Support */}
          <div className="bg-gradient-to-tr from-[#0F172A] to-[#1E293B] text-white p-6 rounded-2xl shadow-sm space-y-3 text-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#38BDF8]">
              Need Help?
            </span>
            <h4 className="font-bold text-sm">Training &amp; Placement Helpdesk</h4>
            <p className="text-[#94A3B8] leading-relaxed">
              If you have queries regarding minimum CGPA cutoffs or branch exemptions, contact your department placement coordinator.
            </p>
            <div className="pt-2 text-[11px] text-[#38BDF8]">
              <span>Email: placement@smartintern.edu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
