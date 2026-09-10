'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Briefcase,
  Building2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { StudentData, InternshipData } from '../../../lib/types';
import { checkEligibility } from '../../../lib/algorithm/eligibilityEngine';
import { calculateMeritScore } from '../../../lib/algorithm/meritCalculator';

export default function StudentEligibilityPage() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profRes, internRes] = await Promise.all([
          fetch('/api/student/profile').then((r) => r.json()),
          fetch('/api/admin/internships').then((r) => r.json()),
        ]);

        if (profRes.student) setStudent(profRes.student);
        if (internRes.internships) setInternships(internRes.internships);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0284C7]" />
      </div>
    );
  }

  const eligibleTracks = student
    ? internships.filter((i) => checkEligibility(student, i).isEligible)
    : [];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] bg-[#E0F2FE] px-2.5 py-0.5 rounded">
            Pre-Matching Engine
          </span>
          <span className="text-xs text-[#10B981] font-semibold">
            {eligibleTracks.length} of {internships.length} Tracks Eligible
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          Eligibility Matrix &amp; Verification
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B]">
          Before proposing candidates to internships, the SMARTINTERN engine filters out any pair that violates academic regulations. Below is your personalized status across every track.
        </p>
      </div>

      {/* Student Credentials Strip */}
      <div className="bg-[#EFF6FF] border border-[#BAE6FD] p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <span className="text-[#64748B] block">Candidate:</span>
          <span className="font-bold text-[#0F172A] text-sm">{student?.name} ({student?.rollNumber})</span>
        </div>
        <div>
          <span className="text-[#64748B] block">Department:</span>
          <span className="font-bold text-[#0F172A]">{student?.branch}</span>
        </div>
        <div>
          <span className="text-[#64748B] block">Verified CGPA:</span>
          <span className="font-bold text-[#0284C7] text-sm">{student?.cgpa.toFixed(2)} / 10.0</span>
        </div>
        <div>
          <span className="text-[#64748B] block">Skills Registered:</span>
          <span className="font-bold text-[#0F172A]">{student?.skills.length} Technical Skills</span>
        </div>
        <Link href="/student/profile">
          <Button size="sm" variant="outline" className="border-[#0284C7] text-[#0284C7] bg-white">
            Update Profile
          </Button>
        </Link>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#F1F5F9] font-bold text-sm text-[#0F172A]">
          Internship Eligibility Breakdown
        </div>

        <div className="divide-y divide-[#F1F5F9]">
          {internships.map((intern) => {
            const elig = student ? checkEligibility(student, intern) : null;
            const merit = student && elig?.isEligible ? calculateMeritScore(student, intern) : null;

            return (
              <div key={intern.id} className="p-5 hover:bg-[#F8FAFC] transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-[#0284C7] uppercase">{intern.companyName}</span>
                    <h3 className="font-bold text-base text-[#0F172A]">{intern.title}</h3>
                    <p className="text-xs text-[#64748B]">
                      {intern.mode} • ₹{intern.stipend.toLocaleString()}/mo • {intern.totalSeats} seats
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {elig?.isEligible ? (
                      <Badge className="bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0] text-xs font-semibold px-3 py-1">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-[#10B981]" />
                        Eligible ({elig.skillMatchPercentage}% skills)
                      </Badge>
                    ) : (
                      <Badge className="bg-[#FEF2F2] text-[#991B1B] border-[#FECACA] text-xs font-semibold px-3 py-1">
                        <XCircle className="h-3.5 w-3.5 mr-1 text-[#EF4444]" />
                        Not Eligible
                      </Badge>
                    )}

                    <Link href={`/internships/${intern.id}`}>
                      <Button size="sm" variant="outline" className="text-xs border-[#CBD5E1]">
                        View Role
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Criteria Checklist Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  {/* CGPA */}
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                    {student && student.cgpa >= intern.minimumCGPA ? (
                      <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-[#EF4444] shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold block text-[#0F172A]">CGPA Requirement</span>
                      <span className="text-[11px] text-[#64748B]">
                        Min {intern.minimumCGPA.toFixed(1)} (You: {student?.cgpa.toFixed(2)})
                      </span>
                    </div>
                  </div>

                  {/* Branch */}
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                    {elig?.branchSatisfied ? (
                      <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-[#EF4444] shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold block text-[#0F172A]">Branch Match</span>
                      <span className="text-[11px] text-[#64748B] truncate block max-w-[200px]">
                        {elig?.branchSatisfied ? 'Approved discipline' : 'Branch excluded'}
                      </span>
                    </div>
                  </div>

                  {/* Estimated Merit */}
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                    <Sparkles className="h-4 w-4 text-[#0284C7] shrink-0" />
                    <div>
                      <span className="font-semibold block text-[#0F172A]">Estimated Merit</span>
                      <span className="text-[11px] text-[#0284C7] font-bold">
                        {merit ? `${merit.totalMeritScore.toFixed(1)} / 100` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {!elig?.isEligible && (
                  <div className="text-xs text-[#991B1B] bg-[#FEF2F2] p-2.5 rounded-lg border border-[#FECACA]">
                    <strong>Rejection reason: </strong>
                    {elig?.failedCriteria.join('; ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
