'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  XCircle,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  FileText,
  ShieldCheck,
  Cpu,
  AlertCircle,
  HelpCircle,
  Download,
  Calendar,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { AllocationData, StudentData } from '../../../lib/types';

export default function StudentAllocationResultPage() {
  const [allocation, setAllocation] = useState<AllocationData | null>(null);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [unallocatedInfo, setUnallocatedInfo] = useState<{ reason: string } | null>(null);
  const [algorithmName, setAlgorithmName] = useState('Many-to-One Gale-Shapley Stable Matching');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadResult() {
      try {
        const res = await fetch('/api/student/result');
        const data = await res.json();

        if (data.student) setStudent(data.student);
        setIsPublished(!!data.published);
        setAllocation(data.allocation || null);
        setUnallocatedInfo(data.unallocatedInfo || null);
        if (data.algorithmName) setAlgorithmName(data.algorithmName);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadResult();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0284C7]" />
      </div>
    );
  }

  // State 1: Results not published yet
  if (!isPublished) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E2E8F0] shadow-sm text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mx-auto">
            <Cpu className="h-8 w-8 animate-pulse" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#BAE6FD]">
            Algorithm Run in Progress
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Allocations Under Administrative Review
          </h1>
          <p className="text-sm text-[#64748B] max-w-xl mx-auto leading-relaxed">
            The placement administration has locked preference rankings and is currently verifying the Many-to-One Gale-Shapley matching run. Official allocation letters will be published immediately following executive sign-off.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <Link href="/student/preferences">
              <Button variant="outline" className="border-[#CBD5E1]">
                Inspect My Submitted Preferences
              </Button>
            </Link>
            <Link href="/student/dashboard">
              <Button className="bg-[#0284C7] text-white">Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State 2: Published and Allocated
  if (allocation) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Congratulations Banner */}
        <div className="bg-gradient-to-r from-[#EFF6FF] via-[#F0FDF4] to-[#ECFDF5] border border-[#A7F3D0] p-8 rounded-3xl shadow-sm space-y-4 relative overflow-hidden">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981] text-white text-xs font-bold shadow-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>Official Institutional Placement Confirmed</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Congratulations, {student?.name}!
            </h1>
            <p className="text-base text-[#334155]">
              You have been successfully matched and allocated to:
            </p>
          </div>

          {/* Allocated Company & Role Hero */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-[#BAE6FD] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold text-[#0284C7] tracking-wider block">
                {allocation.companyName}
              </span>
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
                {allocation.internshipTitle}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748B] pt-1">
                <span>Allocated Date: {new Date(allocation.allocatedAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>Status: <strong className="text-[#10B981] font-bold">VERIFIED</strong></span>
              </div>
            </div>

            <Link href="/student/documents">
              <Button className="bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-md shrink-0">
                <Download className="h-4 w-4 mr-2" />
                Download Allocation Letter
              </Button>
            </Link>
          </div>
        </div>

        {/* 8-Factor Allocation Metric Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
            <span className="text-xs text-[#64748B] block font-semibold">Preference Rank</span>
            <span className="text-xl font-extrabold text-[#0284C7] mt-1 block">
              Rank #{allocation.preferenceRank} Choice
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
            <span className="text-xs text-[#64748B] block font-semibold">Candidate CGPA</span>
            <span className="text-xl font-extrabold text-[#0F172A] mt-1 block">
              {student?.cgpa.toFixed(2)} / 10.0
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
            <span className="text-xs text-[#64748B] block font-semibold">Skill Match Score</span>
            <span className="text-xl font-extrabold text-[#10B981] mt-1 block">
              {allocation.skillMatchScore}% Compatible
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
            <span className="text-xs text-[#64748B] block font-semibold">Quota Position</span>
            <span className="text-xl font-extrabold text-[#0F172A] mt-1 block">
              Seat #{allocation.rankWithinQuota || 1} of {allocation.totalSeats || 2}
            </span>
          </div>
        </div>

        {/* WHY THIS ALLOCATION? (Explainability Engine) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[#F1F5F9] pb-4">
            <div className="h-9 w-9 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#0F172A]">WHY THIS ALLOCATION?</h3>
              <p className="text-xs text-[#64748B]">
                Algorithmic justification produced by the {algorithmName}.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-[#334155]">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="font-bold text-xs uppercase tracking-wider text-[#0284C7]">
                Deterministic Decision Trace
              </div>
              <ul className="space-y-2 text-xs">
                {allocation.explanationReasons && allocation.explanationReasons.length > 0 ? (
                  allocation.explanationReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{reason}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span>You satisfied all academic eligibility cutoffs (Minimum CGPA, branch restriction, and skill overlap).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span>This internship was your highest available preference during the Gale-Shapley proposal rounds.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span>Your multi-factor merit score ({allocation.score.toFixed(1)}/100) ranked within the available capacity of {allocation.totalSeats || 2} seats.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span>Stability guaranteed: There is no unfulfilled opportunity that mutually preferred your application.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Merit Score Breakdown */}
            {allocation.meritBreakdown && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Merit Score Calculation Breakdown
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                    <span className="text-[#64748B] block text-[11px]">Skill Overlap (40%)</span>
                    <span className="font-bold text-[#0F172A] text-sm">
                      {allocation.meritBreakdown.skillScore}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                    <span className="text-[#64748B] block text-[11px]">CGPA Normalization (30%)</span>
                    <span className="font-bold text-[#0F172A] text-sm">
                      {allocation.meritBreakdown.cgpaScore}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                    <span className="text-[#64748B] block text-[11px]">Experience Score (20%)</span>
                    <span className="font-bold text-[#0F172A] text-sm">
                      {allocation.meritBreakdown.experienceScore}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                    <span className="text-[#64748B] block text-[11px]">Branch Alignment (10%)</span>
                    <span className="font-bold text-[#0F172A] text-sm">
                      {allocation.meritBreakdown.branchScore}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // State 3: Published and Unallocated
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-[#FEF2F2] text-[#991B1B] border-[#FECACA] text-xs font-bold px-3 py-1">
            Status: Unallocated in Current Cycle
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          Allocation Cycle Completed
        </h1>

        <p className="text-sm text-[#64748B] leading-relaxed">
          The Many-to-One Gale-Shapley matching run concluded without matching your profile to an open seat. Below is the transparent algorithmic explanation for this outcome:
        </p>

        {/* Reason Box */}
        <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] space-y-2 text-xs text-[#991B1B]">
          <span className="font-bold uppercase tracking-wider block">Algorithmic Root Cause</span>
          <p className="text-sm">
            {unallocatedInfo?.reason ||
              'Capacity limits for all your preferred internships were reached by candidates possessing higher multi-factor merit scores or earlier preferences.'}
          </p>
        </div>

        {/* Next Steps for Student */}
        <div className="pt-4 border-t border-[#F1F5F9] space-y-3">
          <h3 className="font-bold text-sm text-[#0F172A]">Available Next Steps:</h3>
          <ul className="space-y-2 text-xs text-[#475569]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#0284C7]" />
              <span>Participate in Second Round / Spot Allocation sessions organized by the placement cell.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#0284C7]" />
              <span>Consult with your departmental placement coordinator for off-campus verified drives.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
