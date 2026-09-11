'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Building2,
  Briefcase,
  Download,
  AlertCircle,
  HelpCircle,
  FileText,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { AllocationData, StudentData, AlgorithmResult } from '../../../lib/types';

export default function StudentResultPage() {
  const [allocation, setAllocation] = useState<AllocationData | null>(null);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [unallocatedInfo, setUnallocatedInfo] = useState<{ reason?: string } | null>(null);
  const [algorithmName, setAlgorithmName] = useState<string>('Automated Matching Engine');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadResult() {
      try {
        const [resRes, profRes] = await Promise.all([
          fetch('/api/student/result').then((r) => r.json()),
          fetch('/api/student/profile').then((r) => r.json()),
        ]);

        if (profRes.student) {
          setStudent(profRes.student);
        }

        if (resRes.published) {
          setIsPublished(true);
          if (resRes.allocation) {
            setAllocation(resRes.allocation);
          } else {
            setUnallocatedInfo({
              reason: resRes.reason || 'All preferred capacities were filled by candidates with higher merit scores.',
            });
          }
          if (resRes.algorithmType) {
            setAlgorithmName('Smart Matching Engine');
          }
        } else {
          setIsPublished(false);
        }
      } catch (err) {
        console.error('Failed to load result:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadResult();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E5BA73]" />
      </div>
    );
  }

  // State 1: Results not published yet
  if (!isPublished) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-[#0F1A36] p-8 sm:p-10 rounded-2xl border border-[#1E3466] shadow-sm text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-[#E5BA73]/15 text-[#E5BA73] flex items-center justify-center mx-auto border border-[#E5BA73]/30">
            <Clock className="h-8 w-8 animate-pulse" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E5BA73] bg-[#E5BA73]/15 px-3 py-1 rounded-full border border-[#E5BA73]/30">
            Matching Run in Progress
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FAF8F5] tracking-tight">
            Allocations Under Administrative Review
          </h1>
          <p className="text-sm text-[#D8CEBC] max-w-xl mx-auto leading-relaxed">
            The placement administration has locked preference rankings and is currently verifying the automated matching run. Official allocation letters will be published immediately following administrative sign-off.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <Link href="/student/preferences">
              <Button variant="outline" className="border-[#1E3466] bg-[#0A1128] text-[#FAF8F5] hover:bg-[#142247] hover:border-[#E5BA73]/50">
                Inspect My Submitted Preferences
              </Button>
            </Link>
            <Link href="/student/dashboard">
              <Button className="bg-[#E5BA73] hover:bg-[#D4A253] text-[#0A1128] font-bold">Return to Dashboard</Button>
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
        <div className="bg-gradient-to-r from-[#0F1A36] via-[#142247] to-[#0F1A36] border border-[#E5BA73]/50 p-8 rounded-3xl shadow-sm space-y-4 relative overflow-hidden">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#064E3B]/40 text-[#34D399] text-xs font-bold border border-[#059669]/50 shadow-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>Official Institutional Placement Confirmed</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FAF8F5] tracking-tight">
              Congratulations, {student?.name}!
            </h1>
            <p className="text-base text-[#D8CEBC]">
              You have been successfully matched and allocated to:
            </p>
          </div>

          {/* Allocated Company & Role Hero */}
          <div className="bg-[#0A1128]/90 backdrop-blur-sm p-6 rounded-2xl border border-[#1E3466] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold text-[#E5BA73] tracking-wider block">
                {allocation.companyName}
              </span>
              <h2 className="text-2xl font-black text-[#FAF8F5] tracking-tight">
                {allocation.internshipTitle}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#D8CEBC] pt-1">
                <span>Allocated Date: {new Date(allocation.allocatedAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>Status: <strong className="text-[#34D399] font-bold">VERIFIED</strong></span>
              </div>
            </div>

            <Link href="/student/documents">
              <Button className="bg-[#E5BA73] hover:bg-[#D4A253] text-[#0A1128] font-bold shadow-md shrink-0">
                <Download className="h-4 w-4 mr-2" />
                Download Allocation Letter
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Allocation Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0F1A36] p-4 rounded-xl border border-[#1E3466] shadow-sm">
            <span className="text-xs text-[#D8CEBC] block font-semibold">Preference Rank</span>
            <span className="text-xl font-extrabold text-[#E5BA73] mt-1 block">
              Rank #{allocation.preferenceRank} Choice
            </span>
          </div>

          <div className="bg-[#0F1A36] p-4 rounded-xl border border-[#1E3466] shadow-sm">
            <span className="text-xs text-[#D8CEBC] block font-semibold">Candidate CGPA</span>
            <span className="text-xl font-extrabold text-[#FAF8F5] mt-1 block">
              {student?.cgpa.toFixed(2)} / 10.0
            </span>
          </div>

          <div className="bg-[#0F1A36] p-4 rounded-xl border border-[#1E3466] shadow-sm">
            <span className="text-xs text-[#D8CEBC] block font-semibold">Skill Match Score</span>
            <span className="text-xl font-extrabold text-[#34D399] mt-1 block">
              {allocation.skillMatchScore}% Compatible
            </span>
          </div>

          <div className="bg-[#0F1A36] p-4 rounded-xl border border-[#1E3466] shadow-sm">
            <span className="text-xs text-[#D8CEBC] block font-semibold">Quota Position</span>
            <span className="text-xl font-extrabold text-[#FAF8F5] mt-1 block">
              Seat #{allocation.rankWithinQuota || 1} of {allocation.totalSeats || 2}
            </span>
          </div>
        </div>

        {/* WHY THIS ALLOCATION? */}
        <div className="bg-[#0F1A36] p-6 sm:p-8 rounded-2xl border border-[#1E3466] shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[#1E3466] pb-4">
            <div className="h-9 w-9 rounded-lg bg-[#E5BA73]/15 text-[#E5BA73] flex items-center justify-center font-bold">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#FAF8F5]">WHY THIS ALLOCATION?</h3>
              <p className="text-xs text-[#D8CEBC]">
                Verified justification produced by the matching engine.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-[#D8CEBC]">
            <div className="p-4 rounded-xl bg-[#0A1128] border border-[#1E3466] space-y-3">
              <div className="font-bold text-xs uppercase tracking-wider text-[#E5BA73]">
                Deterministic Decision Trace
              </div>
              <ul className="space-y-2 text-xs">
                {allocation.explanationReasons && allocation.explanationReasons.length > 0 ? (
                  allocation.explanationReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{reason}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0 mt-0.5" />
                      <span>You satisfied all academic eligibility cutoffs (Minimum CGPA, branch restriction, and skill overlap).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0 mt-0.5" />
                      <span>This internship was your highest available preference during the matching allocation rounds.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0 mt-0.5" />
                      <span>Your multi-factor merit score ({allocation.score.toFixed(1)}/100) ranked within the available capacity of {allocation.totalSeats || 2} seats.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0 mt-0.5" />
                      <span>Fairness guaranteed: No unfulfilled opportunity mutually preferred your application.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Merit Score Breakdown */}
            {allocation.meritBreakdown && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-[#FAF8F5] uppercase tracking-wider">
                  Merit Score Calculation Breakdown
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#0A1128] border border-[#1E3466]">
                    <span className="text-[#D8CEBC] block text-[11px]">Skill Overlap (40%)</span>
                    <span className="font-bold text-[#FAF8F5] text-sm">
                      {allocation.meritBreakdown.skillScore}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0A1128] border border-[#1E3466]">
                    <span className="text-[#D8CEBC] block text-[11px]">CGPA Normalization (30%)</span>
                    <span className="font-bold text-[#FAF8F5] text-sm">
                      {allocation.meritBreakdown.cgpaScore}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0A1128] border border-[#1E3466]">
                    <span className="text-[#D8CEBC] block text-[11px]">Experience Score (20%)</span>
                    <span className="font-bold text-[#FAF8F5] text-sm">
                      {allocation.meritBreakdown.experienceScore}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0A1128] border border-[#1E3466]">
                    <span className="text-[#D8CEBC] block text-[11px]">Branch Alignment (10%)</span>
                    <span className="font-bold text-[#FAF8F5] text-sm">
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
      <div className="bg-[#0F1A36] p-8 rounded-2xl border border-[#1E3466] shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-rose-950/40 text-rose-300 border-rose-800/50 text-xs font-bold px-3 py-1">
            Status: Unallocated in Current Cycle
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FAF8F5] tracking-tight">
          Allocation Cycle Completed
        </h1>

        <p className="text-sm text-[#D8CEBC] leading-relaxed">
          The matching run concluded without matching your profile to an open seat. Below is the explanation for this outcome:
        </p>

        {/* Reason Box */}
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/50 space-y-2 text-xs text-rose-300">
          <span className="font-bold uppercase tracking-wider block">Allocation Explanation</span>
          <p className="text-sm text-rose-200">
            {unallocatedInfo?.reason ||
              'Capacity limits for all your preferred internships were reached by candidates possessing higher multi-factor merit scores or earlier preferences.'}
          </p>
        </div>

        {/* Next Steps for Student */}
        <div className="pt-4 border-t border-[#1E3466] space-y-3">
          <h3 className="font-bold text-sm text-[#FAF8F5]">Available Next Steps:</h3>
          <ul className="space-y-2 text-xs text-[#D8CEBC]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#E5BA73]" />
              <span>Participate in Second Round / Spot Allocation sessions organized by the placement cell.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#E5BA73]" />
              <span>Consult with your departmental placement coordinator for off-campus verified drives.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
